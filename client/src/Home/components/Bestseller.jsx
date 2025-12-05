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

  // Fetch bestsellers
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "20");
        params.append("category", "best seller");

        const response = await Axios.get(`/product/filter?${params.toString()}`);

        if (response.data?.success && response.data?.products) {
          const shuffled = [...response.data.products].sort(() => Math.random() - 0.5);
          setProducts(shuffled.slice(0, 6));
        }
      } catch (err) {
        console.error("Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    if (auth) fetchWishlist();
  }, [auth]);

  // Favorites map
  const favorites = useMemo(() => {
    const map = {};
    (wishlistIds instanceof Set
      ? Array.from(wishlistIds)
      : wishlistIds
    ).forEach((id) => (map[id] = true));
    return map;
  }, [wishlistIds]);

  // Toggle wishlist
  const toggleFavorite = async (productId, event) => {
    event.stopPropagation();

    if (!auth) {
      return toast.error("Please login to add items to wishlist", {
        position: "bottom-right",
      });
    }

    try {
      const exists = isInWishlist(productId);

      if (exists) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist", { position: "bottom-right" });
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error("Something went wrong", { position: "bottom-right" });
    }
  };

  const formatPrice = (price) =>
    typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "—";

  const handleProductClick = (product) => {
    navigate(`/product/${product?.slug || product?._id}`);
  };

  if (loading) {
    return (
      <section className="px-4 py-16 text-center bg-[#fdfdfd]">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Bestsellers to light up your Party wardrobe.
        </h2>
        <p className="mt-6 text-gray-500">Loading...</p>
      </section>
    );
  }

  return (
    <section
      id="bestsellers"
      className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16 bg-[#fdfdfd] font-poppins"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
        Bestsellers to light up your Party wardrobe.
      </h2>

      {/* CAROUSEL SECTION */}
      <div 
        className="mt-10 mb-8 overflow-x-auto hide-scrollbar"
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="flex gap-6 pb-4"
          style={{ 
            scrollBehavior: 'smooth'
          }}
        >
          {products.map((product, i) => {
            const productId = product?._id;
            const image =
              product?.image ||
              product?.thumbnail ||
              product?.images?.[0]?.url ||
              product?.images?.[0];

            return (
              <div
                key={productId || i}
                className="group cursor-pointer flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                onClick={() => handleProductClick(product)}
              >
                {/* IMAGE BOX */}
                <div className="relative overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={image}
                    alt={product?.name}
                    className="
                      w-full object-cover transition-all duration-300
                      h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px]
                      group-hover:scale-[1.04]
                    "
                  />

                  {/* HEART BUTTON */}
                  <button
                    onClick={(e) => toggleFavorite(productId, e)}
                    className={`
                      absolute top-3 right-3 p-2 rounded-full
                      transition-all duration-300 shadow-md
                      ${
                        favorites[productId]
                          ? "bg-[#b89396] text-white"
                          : "bg-white text-gray-700 hover:text-[#b89396]"
                      }
                    `}
                  >
                    <Heart
                      size={20}
                      fill={favorites[productId] ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* NAME + PRICE */}
                <h4 className="mt-3 text-[15px] font-semibold text-gray-800">
                  {product?.name}
                </h4>
                <p className="text-[14px] text-gray-500">{formatPrice(product?.price)}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <button
  onClick={() =>
    navigate(`/products?category=${encodeURIComponent("best seller")}`)
  }
  className="
    bg-[#b89396] text-white font-medium
    px-10 py-3 rounded-full mt-4
    hover:bg-[#a77f83] transition-all duration-300
    w-full sm:w-auto mx-auto block
  "
>
  View All Products
</button>

      
    </section>
  );
};

export default Bestsellers;
