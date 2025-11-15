import React, { useEffect, useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";
import useAuth from "../../../hooks/useAuth";
import useWishlist from "../../../hooks/useWishlist";
import { toast } from "react-toastify";

const Bestsellers = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const {
    wishlistIds,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bestseller products (filtered by bestseller category)
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        // Fetch more products to randomize selection
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "20"); // Fetch more products for randomization
        // Filter by bestseller category (with space as stored in database)
        params.append("category", "best seller");
        
        const response = await Axios.get(`/product/filter?${params.toString()}`);

        if (response.data?.success && response.data?.products) {
          // Randomize the products array
          const allProducts = [...response.data.products];
          const shuffled = allProducts.sort(() => Math.random() - 0.5);
          // Take only first 6 random products
          setProducts(shuffled.slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching bestsellers:", err);
        // Fallback to empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (auth) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Create favorites map for quick lookup
  const favorites = useMemo(() => {
    const map = {};
    if (wishlistIds instanceof Set) {
      wishlistIds.forEach((id) => {
        map[id] = true;
      });
    } else if (Array.isArray(wishlistIds)) {
      wishlistIds.forEach((id) => {
        map[id] = true;
      });
    }
    return map;
  }, [wishlistIds]);

  // Toggle wishlist
  const toggleFavorite = async (productId, event) => {
    event.stopPropagation();
    
    if (!productId) {
      toast.error("Unable to update wishlist for this product", {
        position: "bottom-right",
      });
      return;
    }

    if (!auth) {
      toast.error("Please login to add items to wishlist", {
        position: "bottom-right",
      });
      return;
    }

    const inList = isInWishlist(productId);

    try {
      if (inList) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist", { position: "bottom-right" });
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist", { position: "bottom-right" });
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong",
        {
          position: "bottom-right",
        }
      );
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return price || "—";
  };

  // Handle product click
  const handleProductClick = (product) => {
    const productSlug = product?.slug || product?._id;
    if (productSlug) {
      navigate(`/product/${productSlug}`);
    }
  };

  if (loading) {
    return (
      <section
        id="bestsellers"
        className="text-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16 bg-[#fdfdfd] font-poppins"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Bestsellers to light up your Party wardrobe.
        </h2>
        <div className="mt-8 text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section
      id="bestsellers"
      className="text-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16 bg-[#fdfdfd] font-poppins"
    >
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
      Bestsellers to light up your Party wardrobe.
    </h2>

    {/* Grid Section */}
    <div
      className="
        grid gap-5 mt-8 mb-6 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        xl:grid-cols-4 2xl:grid-cols-6
        items-start
      "
    >
        {products.length > 0 ? (
          products.map((product, i) => {
            const productId = product?._id || product?.id;
            const productImage =
              product?.image ||
              product?.thumbnail ||
              (Array.isArray(product?.images) && product.images.length > 0
                ? product.images[0]?.url || product.images[0]
                : null);
            const productName = product?.name || "Untitled product";
            const productPrice = product?.price ?? "—";
            const isFavorite = productId ? Boolean(favorites[productId]) : false;

            return (
              <div
                key={productId || i}
                className="text-left relative group cursor-pointer"
                onClick={() => handleProductClick(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleProductClick(product);
                  }
                }}
              >
          {/* Image Box */}
          <div className="relative overflow-hidden rounded-lg">
                  {productImage ? (
            <img
                      src={productImage}
                      alt={productName}
              className="
                w-full object-cover transition-all duration-300 
                h-[400px] sm:h-[220px] md:h-60 lg:h-[280px] xl:h-80
                group-hover:scale-[1.03]
              "
            />
                  ) : (
                    <div
              className="
                w-full bg-gray-200 flex items-center justify-center transition-all duration-300 
                h-[400px] sm:h-[220px] md:h-60 lg:h-[280px] xl:h-80
                group-hover:scale-[1.03]
              "
                    >
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(productId, e)}
                    className={`
                absolute top-2.5 right-2.5 
                rounded-full p-1.5
                transition-all duration-300
                hover:scale-110
                ${
                  isFavorite
                    ? "bg-[#b89396] text-white"
                    : "bg-white/90 text-gray-800 hover:text-[#b89396]"
                }
              `}
                    type="button"
                    aria-label={
                      isFavorite ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={20}
                      fill={isFavorite ? "currentColor" : "none"}
                      className="transition-all duration-300"
                    />
                  </button>
          </div>

          {/* Product Text */}
          <h4 className="mt-2 text-[16px] font-semibold text-gray-800">
                  {productName}
          </h4>
                <p className="text-[15px] text-gray-500">
                  {formatPrice(productPrice)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-gray-500 py-8">
            No bestseller products available at the moment.
        </div>
        )}
    </div>

    {/* Button */}
    <button
        onClick={() => navigate(`/products?category=${encodeURIComponent("best seller")}`)}
      className="
        bg-[#b89396] text-white text-[15px] font-medium
        px-8 py-2.5 rounded-full mt-4
        hover:bg-[#a77f83] transition-all duration-300
        w-full sm:w-auto sm:px-10
      "
    >
      View All Products
    </button>
  </section>
);
};

export default Bestsellers;
