import React, { useEffect, useState, useMemo, useRef } from "react";
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

  const sliderRef = useRef(null);
  const pausedRef = useRef(false);

  // Fetch bestsellers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "100");
        params.append("category", "best seller");

        const res = await Axios.get(`/product/filter?${params.toString()}`);

        if (res.data?.success && res.data.products) {
          setProducts(res.data.products);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (auth) fetchWishlist();
  }, [auth]);

  const favorites = useMemo(() => {
    const map = {};
    (wishlistIds instanceof Set ? Array.from(wishlistIds) : wishlistIds).forEach(
      (id) => (map[id] = true)
    );
    return map;
  }, [wishlistIds]);

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    if (!auth) {
      return toast.error("Please login to add items to wishlist");
    }
    try {
      const exists = isInWishlist(productId);
      if (exists) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const formatPrice = (price) =>
    typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "—";

  const handleProductClick = (product) =>
    navigate(`/product/${product?.slug || product?._id}`);

  // ===========================
  // SMOOTH INFINITE SLIDER
  // ===========================
  useEffect(() => {
    if (!sliderRef.current || products.length === 0) return;

    const slider = sliderRef.current;
    let x = 0;
    const speed = 0.6;
    let animationFrame;

    const animate = () => {
      if (!pausedRef.current) {
        x -= speed;

        const contentWidth = slider.scrollWidth / 2;

        if (Math.abs(x) >= contentWidth) {
          x = 0;
        }

        slider.style.transform = `translateX(${x}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [products]);

  if (loading)
    return (
      <section className="px-4 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-semibold">Bestsellers</h2>
        <p className="mt-6 text-gray-500">Loading...</p>
      </section>
    );

  return (
    <section id="bestsellers" className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16">
      <h2 className="text-xl md:text-2xl font-semibold text-center">
        Bestsellers to light up your Party wardrobe.
      </h2>

      {/* Scroller wrapper */}
      <div className="relative overflow-hidden mt-10 mb-8">
        <div
          ref={sliderRef}
          className="flex gap-6 pb-4 w-max"
          style={{
            whiteSpace: "nowrap",
            willChange: "transform",
            touchAction: "pan-y", // ✅ allows touch scrolling + slider drag
          }}
        >
          {[...products, ...products].map((product, i) => {
            const image =
              product?.image ||
              product?.thumbnail ||
              product?.images?.[0]?.url ||
              product?.images?.[0];

            return (
              <div
                key={product?._id + "_dup_" + i}
                className="group cursor-pointer flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[240px]"

                // Desktop pause
                onMouseEnter={() => (pausedRef.current = true)}
                onMouseLeave={() => (pausedRef.current = false)}

                // Mobile touch pause (works while keeping swipe functionality)
                onTouchStart={() => (pausedRef.current = true)}
                onTouchEnd={() => (pausedRef.current = false)}
                onTouchCancel={() => (pausedRef.current = false)}

                onClick={() => handleProductClick(product)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={image}
                    alt={product?.name}
                    className="w-full h-[240px] object-cover transition-all duration-300 group-hover:scale-[1.04]"
                  />

                  <button
                    onClick={(e) => toggleFavorite(product._id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                      favorites[product._id]
                        ? "bg-[#b89396] text-white"
                        : "bg-white text-gray-700 hover:text-[#b89396]"
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={favorites[product._id] ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <h4 className="mt-3 text-[15px] font-semibold text-gray-800 whitespace-normal line-clamp-2 leading-snug">
                  {product?.name}
                </h4>

                <p className="text-[14px] text-gray-500 mt-1">
                  {formatPrice(product?.price)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() =>
          navigate(`/products?category=${encodeURIComponent("best seller")}`)}
        className="bg-[#b89396] text-white font-medium px-10 py-3 rounded-full mt-4 hover:bg-[#a77f83] transition mx-auto block"
      >
        View All Products
      </button>
    </section>
  );
};

export default Bestsellers;
