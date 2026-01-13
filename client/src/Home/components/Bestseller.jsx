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
    (wishlistIds instanceof Set
      ? Array.from(wishlistIds)
      : wishlistIds
    ).forEach((id) => (map[id] = true));
    return map;
  }, [wishlistIds]);

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    if (!auth) return toast.error("Please login to add items to wishlist");
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
    typeof price === "number"
      ? `₹${price.toLocaleString("en-IN")}`
      : price || "—";

  const handleProductClick = (product) =>
    navigate(`/product/${product?.slug || product?._id}`);

  // Split into 2 rows
  const mid = Math.ceil(products.length / 2);
  const row1 = products.slice(0, mid);
  const row2 = products.slice(mid);

  // Smooth infinite slider
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
        if (Math.abs(x) >= contentWidth) x = 0;
        slider.style.transform = `translateX(${x}px)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [products]);

  const renderCard = (product, i, tag) => {
    const image =
      product?.image ||
      product?.thumbnail ||
      product?.images?.[0]?.url ||
      product?.images?.[0];

    return (
      <div
        key={product?._id + tag + i}
        className="group cursor-pointer flex-shrink-0 w-[170px] sm:w-[200px] lg:w-[230px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
        onTouchCancel={() => (pausedRef.current = false)}
        onClick={() => handleProductClick(product)}
      >
        <div className="relative overflow-hidden rounded-xl shadow-sm">
          <img
            src={image}
            alt={product?.name}
            className="w-full h-[220px] object-cover transition-all duration-300 group-hover:scale-[1.04]"
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
              size={18}
              fill={favorites[product._id] ? "currentColor" : "none"}
            />
          </button>
        </div>
        <h4 className="mt-2 text-[14px] font-semibold text-gray-800 line-clamp-2">
          {product?.name}
        </h4>
        <p className="text-[13px] text-gray-500 mt-1">
          {formatPrice(product?.price)}
        </p>
      </div>
    );
  };

  if (loading)
    return (
      <section className="px-4 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-semibold">Bestsellers</h2>
        <p className="mt-6 text-gray-500">Loading...</p>
      </section>
    );

  return (
    <section
      id="bestsellers"
      className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-center">
        Bestsellers to light up your Party wardrobe.
      </h2>

      {/* 2 Row Scroller */}
      <div className="relative overflow-hidden mt-10 mb-8">
        <div
          ref={sliderRef}
          className="w-max flex flex-col gap-6"
          style={{
            whiteSpace: "nowrap",
            willChange: "transform",
            touchAction: "pan-y",
          }}
        >
          <div className="flex gap-6">
            {[...row1, ...row1].map((p, i) => renderCard(p, i, "r1"))}
          </div>
          <div className="flex gap-6">
            {[...row2, ...row2].map((p, i) => renderCard(p, i, "r2"))}
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(`/products?category=${encodeURIComponent("best seller")}`)
        }
        className="bg-[#b89396] text-white font-medium px-10 py-3 rounded-full mt-4 hover:bg-[#a77f83] transition mx-auto block"
      >
        View All Products
      </button>
    </section>
  );
};

export default Bestsellers;
