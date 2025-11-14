import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";
import { toast } from "react-toastify";
import TriangleLoader from "../components/TriangleLoader";

const PRICE_MARKS = [0, 499, 999, 1999, 2999, 3999, 4999];
const MIN_INDEX_GAP = 1;
const DEFAULT_SWATCH_COLOR = "#E5E7EB";
const COLOR_TEST_ELEMENT =
  typeof document !== "undefined" && document.createElement
    ? document.createElement("span")
    : null;

const QUICK_PRICE_OPTIONS = [
  {
    label: "All prices",
    min: PRICE_MARKS[0],
    max: PRICE_MARKS[PRICE_MARKS.length - 1],
  },
  { label: "499 - 999", min: 499, max: 999 },
  { label: "1999 - 2999", min: 1999, max: 2999 },
  { label: "2999 - 3999", min: 2999, max: 3999 },
  { label: "3999 - 4999", min: 3999, max: 4999 },
];

const resolveSwatchColor = (candidate) => {
  if (!candidate || typeof candidate !== "string") {
    return DEFAULT_SWATCH_COLOR;
  }
  const trimmed = candidate.trim();
  if (!trimmed) return DEFAULT_SWATCH_COLOR;

  if (COLOR_TEST_ELEMENT) {
    COLOR_TEST_ELEMENT.style.color = "";
    COLOR_TEST_ELEMENT.style.color = trimmed;
    if (COLOR_TEST_ELEMENT.style.color) return trimmed;
  }

  const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  if (hexPattern.test(trimmed)) return trimmed;

  return DEFAULT_SWATCH_COLOR;
};

const normalizeColorOption = (option) => {
  if (!option) return null;
  if (typeof option === "string") {
    const trimmed = option.trim();
    if (!trimmed) return null;
    return {
      label: trimmed,
      value: trimmed,
      swatchColor: resolveSwatchColor(trimmed),
    };
  }
  if (typeof option === "object") {
    const rawLabel =
      option.label ?? option.name ?? option.value ?? option.display ?? option.code ?? "";
    const rawValue = option.value ?? option.name ?? option.label ?? "";
    const swatchCandidate =
      option.swatch ?? option.hex ?? option.color ?? option.code ?? rawValue ?? rawLabel;
    const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : "";
    if (!trimmedValue) return null;
    const trimmedLabel =
      typeof rawLabel === "string" && rawLabel.trim() ? rawLabel.trim() : trimmedValue;
    return {
      label: trimmedLabel,
      value: trimmedValue,
      swatchColor: resolveSwatchColor(swatchCandidate),
    };
  }
  return null;
};

const serializeParams = (params) => {
  const searchParams = new URLSearchParams();

  const appendParam = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => appendParam(key, item));
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => {
        if (childValue !== undefined && childValue !== null && childValue !== "") {
          appendParam(`${key}[${childKey}]`, childValue);
        }
      });
      return;
    }
    searchParams.append(key, value);
  };

  Object.entries(params).forEach(([key, value]) => {
    appendParam(key, value);
  });

  return searchParams.toString();
};

const normalizeFilterValue = (key, value) => {
  if (key === "sizes") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue;
  }
  return value;
};

// demo images (keep your imports)
import partyWear from "../assets/images/A-Casual.png";
import premiumEdit from "../assets/images/A-Party-Wear.png";
import sparkleEdit from "../assets/images/A-Formal-Wear.png";
import weddingReady from "../assets/images/A-Daily-Comfort.png";
import dailyBling from "../assets/images/A-Travel-Essentials.png";
import pearlTouch from "../assets/images/A-Dr-Sole.png";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const {
    wishlistIds,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  // UI / data state
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showHeelsOptions, setShowHeelsOptions] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    heelsType: "",
    sizes: [],
    colors: [],
    minPrice: PRICE_MARKS[0],
    maxPrice: PRICE_MARKS[PRICE_MARKS.length - 1],
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    colors: [],
    sizes: [],
  });

  const [minPriceIndex, setMinPriceIndex] = useState(0);
  const [maxPriceIndex, setMaxPriceIndex] = useState(PRICE_MARKS.length - 1);

  const PRODUCTS_PER_PAGE = 9;

  const categories = [
    { name: "Casual Wear", image: partyWear },
    { name: "Party Wear", image: premiumEdit },
    { name: "Formal Wear", image: sparkleEdit },
    { name: "Daily Comfort", image: weddingReady },
    { name: "Travel Essentials", image: dailyBling },
    { name: "Dr sole", image: pearlTouch },
  ];

  const categoryOptions = useMemo(() => {
    if (Array.isArray(filterOptions.categories) && filterOptions.categories.length > 0) {
      return filterOptions.categories;
    }
    return ["Flats", "Sneakers", "Wedges", "Heels", "Platform", "Kolhapuri", "Belly"];
  }, [filterOptions.categories]);

  const sizeOptions = useMemo(() => {
    if (Array.isArray(filterOptions.sizes) && filterOptions.sizes.length > 0) {
      return filterOptions.sizes.map((size) => String(size));
    }
    return ["35", "36", "37", "38", "39", "40", "41", "42"];
  }, [filterOptions.sizes]);

  // favorites map for quick lookup & UI
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

  const toggleFavorite = async (productId) => {
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
      toast.error(err?.response?.data?.message || err.message || "Something went wrong", {
        position: "bottom-right",
      });
    }
  };

  const toggleFilter = (key, value) => {
    const normalizedValue = normalizeFilterValue(key, value);

    setFilters((prev) => {
      const currentValues = Array.isArray(prev[key]) ? prev[key] : [];
      const exists = currentValues.some((item) => item === normalizedValue);
      const nextValues = exists
        ? currentValues.filter((item) => item !== normalizedValue)
        : [...currentValues, normalizedValue];

      return {
        ...prev,
        [key]: nextValues,
      };
    });

    setCurrentPage(1);
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const valueToPercentage = (value) => {
    const min = PRICE_MARKS[0];
    const max = PRICE_MARKS[PRICE_MARKS.length - 1];
    if (max === min) return 0;
    const safeValue = clamp(value, min, max);
    return ((safeValue - min) / (max - min)) * 100;
  };

  const getMinPercentage = () => valueToPercentage(PRICE_MARKS[minPriceIndex]);
  const getMaxPercentage = () => valueToPercentage(PRICE_MARKS[maxPriceIndex]);

  const updateMinPriceIndex = (index) => {
    const parsedIndex = Number(index);
    const maxAllowedIndex = Math.max(0, maxPriceIndex - MIN_INDEX_GAP);
    const nextIndex = clamp(parsedIndex, 0, maxAllowedIndex);
    setMinPriceIndex(nextIndex);
    setFilters((prev) => ({
      ...prev,
      minPrice: PRICE_MARKS[nextIndex],
    }));
    setCurrentPage(1);
  };

  const updateMaxPriceIndex = (index) => {
    const parsedIndex = Number(index);
    const minAllowedIndex = Math.min(minPriceIndex + MIN_INDEX_GAP, PRICE_MARKS.length - 1);
    const nextIndex = clamp(parsedIndex, minAllowedIndex, PRICE_MARKS.length - 1);
    setMaxPriceIndex(nextIndex);
    setFilters((prev) => ({
      ...prev,
      maxPrice: PRICE_MARKS[nextIndex],
    }));
    setCurrentPage(1);
  };

  const applyPriceRange = (min, max) => {
    const resolveIndex = (value, fallback) => {
      const directMatch = PRICE_MARKS.indexOf(value);
      if (directMatch !== -1) return directMatch;
      const closest = PRICE_MARKS.findIndex((mark) => mark >= value);
      return closest !== -1 ? closest : fallback;
    };

    const nextMinIndex = resolveIndex(min, 0);
    const nextMaxIndex = resolveIndex(max, PRICE_MARKS.length - 1);

    const nextMinValue = PRICE_MARKS[nextMinIndex] ?? min;
    const nextMaxValue = PRICE_MARKS[nextMaxIndex] ?? max;

    setMinPriceIndex(nextMinIndex);
    setMaxPriceIndex(nextMaxIndex);
    setFilters((prev) => ({
      ...prev,
      minPrice: nextMinValue,
      maxPrice: nextMaxValue,
    }));
    setCurrentPage(1);
  };

  const resetPriceFilters = () => {
    applyPriceRange(PRICE_MARKS[0], PRICE_MARKS[PRICE_MARKS.length - 1]);
  };

  const categoryFilterKey = useMemo(
    () => filters.categories.slice().sort().join("|"),
    [filters.categories]
  );
  const sizeFilterKey = useMemo(
    () => filters.sizes.slice().sort((a, b) => Number(a) - Number(b)).join("|"),
    [filters.sizes]
  );
  const colorFilterKey = useMemo(() => filters.colors.slice().sort().join("|"), [filters.colors]);

  const normalizedColorOptions = useMemo(
    () => (filterOptions.colors || []).map(normalizeColorOption).filter(Boolean),
    [filterOptions.colors]
  );

  const activeQuickPriceKey = useMemo(() => {
    const active = QUICK_PRICE_OPTIONS.find(
      ({ min, max }) => min === filters.minPrice && max === filters.maxPrice
    );
    return active ? `${active.min}-${active.max}` : null;
  }, [filters.minPrice, filters.maxPrice]);

  const isDefaultPriceRange = useMemo(
    () =>
      filters.minPrice === PRICE_MARKS[0] &&
      filters.maxPrice === PRICE_MARKS[PRICE_MARKS.length - 1],
    [filters.minPrice, filters.maxPrice]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchFilterOptions = async () => {
      try {
        const response = await Axios.get("/product/filterOptions", {
          signal: controller.signal,
        });

        const categoryOptions =
          response.data?.category?.map((item) => item?.name).filter(Boolean) || [];
        const colorOptions = response.data?.colors?.filter(Boolean) || [];
        const sizeOptions =
          response.data?.sizes
            ?.map((size) => Number(size))
            .filter((size) => !Number.isNaN(size))
            .sort((a, b) => a - b) || [];

        setFilterOptions({
          categories: categoryOptions,
          colors: colorOptions,
          sizes: sizeOptions,
        });
      } catch (err) {
        // ignore silently for filter options fetch
      }
    };

    fetchFilterOptions();
    return () => controller.abort();
  }, []);

  // Fetch wishlist items when user is authenticated
  useEffect(() => {
    if (auth) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const minPrice = Number(filters.minPrice);
        const maxPrice = Number(filters.maxPrice);

        const params = {
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
        };

        if (filters.categories.length > 0) params.category = filters.categories;
        if (filters.colors.length > 0) params.color = filters.colors;
        if (filters.sizes.length > 0) params.size = filters.sizes;
        if (filters.heelsType) params.heelsType = filters.heelsType;

        params.price = { minPrice, maxPrice };

        const response = await Axios.get("/product/filter", {
          params,
          paramsSerializer: serializeParams,
          signal: controller.signal,
        });

        setProducts(response.data?.products || []);
        setTotalProducts(response.data?.count || 0);
      } catch (err) {
        if (err.name === "CanceledError") return;
        const message = err.response?.data?.message || err.message || "Failed to load products";
        setError(message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [
    currentPage,
    filters.minPrice,
    filters.maxPrice,
    categoryFilterKey,
    sizeFilterKey,
    colorFilterKey,
    filters.heelsType,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="container mx-auto px-4 py-8">

<div className="bg-white rounded-lg shadow-sm py-4 px-3 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-5 py-2.5 overflow-x-auto">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 min-w-[180px] cursor-pointer transition-transform hover:-translate-y-1">
              <div className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-base font-semibold text-gray-800">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile Filter Toggle */}
      <div className="flex justify-between items-center mb-5 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
        <button
          className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white text-gray-700 text-sm shadow-sm active:scale-[0.98]"
          onClick={() => setShowFilters((s) => !s)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-[320px] flex-shrink-0 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="space-y-5">
            {/* Categories */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Categories</div>
              <div className="flex flex-col gap-3">
                  {categoryOptions.map((cat) => (
                  <div key={cat}>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => toggleFilter("categories", cat)}
                        className="hidden"
                      />
                      <div
                        className={`w-[18px] h-[18px] border-2 rounded border-gray-300 flex items-center justify-center transition-all ${
                          filters.categories.includes(cat) ? "bg-[#A37478] border-pink-[#A37478]" : ""
                        }`}
                      >
                        {filters.categories.includes(cat) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span
                        className="text-sm text-gray-600"
                        onClick={() => {
                          if (cat === "Heels") setShowHeelsOptions((s) => !s);
                        }}
                      >
                        {cat}
                      </span>
                    </label>

                    {/* Sub-options for Heels */}
                    {cat === "Heels" && showHeelsOptions && (
                      <div className="pl-7 mt-2 flex flex-col gap-2 text-sm text-gray-600">
                        {["Block Heels", "Pencil Heels", "Wedge Heels"].map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="heelsType"
                              value={option}
                              checked={filters.heelsType === option}
                              onChange={(e) => setFilters((prev) => ({ ...prev, heelsType: e.target.value }))}
                              className="accent-[#A37478]"
                            />
                            <span className="text-sm text-gray-600 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Size</div>
              <div className="grid grid-cols-4 gap-3">
                {sizeOptions.map((size) => {
                  const normalizedSize = normalizeFilterValue("sizes", size);
                  const isActive = filters.sizes.includes(normalizedSize);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleFilter("sizes", size)}
                      className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-xs font-semibold uppercase tracking-wide transition-all ${
                        isActive
                          ? "border-transparent bg-[#A37478] text-white shadow-md shadow-[#A37478]/40"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-[#A37478] hover:bg-white hover:text-[#A37478]"
                      }`}
                    >
                      <span className="text-sm">{size}</span>
                    
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            {normalizedColorOptions.length > 0 && (
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="text-base font-semibold mb-4">Colors</div>
                <div className="flex flex-wrap gap-3">
                  {normalizedColorOptions.map(({ label, value, swatchColor }) => {
                    const isActive = filters.colors.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 border rounded-full text-sm transition-all ${
                          isActive
                            ? "border-[#A37478] text-[#A37478] bg-[#FDF2F8]"
                            : "border-gray-200 text-gray-600 hover:border-[#A37478]"
                        }`}
                        onClick={() => toggleFilter("colors", value)}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: swatchColor }}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-800 uppercase tracking-[0.08em]">
                    Price Range
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Slide the handles or tap a quick filter
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetPriceFilters}
                  disabled={isDefaultPriceRange}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    isDefaultPriceRange
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-[#A37478] text-[#A37478] hover:bg-[#A37478] hover:text-white"
                  }`}
                >
                  Reset
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {/* <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gradient-to-r from-[#FDE8EB] to-[#F6EEF9] px-3 py-2.5 shadow-inner border border-[#F6D5DC]">
                    <div className="text-[11px] uppercase tracking-wide text-[#9C5B63]">
                      Minimum
                    </div>
                    <div className="text-base font-semibold text-[#7C3A41]">
                      Rs {filters.minPrice}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-[#F6EEF9] to-[#E8F3FF] px-3 py-2.5 shadow-inner border border-[#DCDCF4]">
                    <div className="text-[11px] uppercase tracking-wide text-[#5F5F9C]">
                      Maximum
                    </div>
                    <div className="text-base font-semibold text-[#38386A]">
                      Rs {filters.maxPrice}
                    </div>
                  </div>
                </div> */}

                <div className="relative h-16 flex items-center px-1">
                  <div className="absolute inset-x-0 h-2 rounded-full bg-gray-100 shadow-inner mt-3" />
                  <div
                    className="absolute h-2 rounded-full bg-gradient-to-r from-[#F19AAE] via-[#C87DAA] to-[#7B5195] shadow-lg mt-3"
                    style={{
                      left: `${getMinPercentage()}%`,
                      width: `${Math.max(getMaxPercentage() - getMinPercentage(), 0)}%`,
                    }}
                  />

                  <input
                    type="range"
                    min={0}
                    max={PRICE_MARKS.length - 1}
                    step={1}
                    value={minPriceIndex}
                    onChange={(e) => updateMinPriceIndex(e.target.value)}
                    className="dual-range"
                    style={{ zIndex: 30 }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={PRICE_MARKS.length - 1}
                    step={1}
                    value={maxPriceIndex}
                    onChange={(e) => updateMaxPriceIndex(e.target.value)}
                    className="dual-range"
                    style={{ zIndex: 40 }}
                  />

                  <span
                    className="absolute -top-3 flex items-center justify-center whitespace-nowrap rounded-full border border-[#ECE2FF] bg-white px-2.5 py-1 mt-7 text-xs font-semibold text-[#7B5195] shadow-md"
                    style={{ left: `${getMinPercentage()}%`, transform: "translate(-50%, -110%)" }}
                  >
                    Rs {filters.minPrice}
                  </span>
                  <span
                    className="absolute -top-3 flex items-center justify-center whitespace-nowrap rounded-full border border-[#ECE2FF] bg-white px-2.5 py-1 mt-7 text-xs font-semibold text-[#7B5195] shadow-md"
                    style={{ left: `${getMaxPercentage()}%`, transform: "translate(-50%, -110%)" }}
                  >
                    Rs {filters.maxPrice}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK_PRICE_OPTIONS.map(({ label, min, max }) => {
                    const optionKey = `${min}-${max}`;
                    const isActive = optionKey === activeQuickPriceKey;
                    return (
                      <button
                        key={optionKey}
                        type="button"
                        onClick={() => applyPriceRange(min, max)}
                        className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                          isActive
                            ? "border-transparent bg-gradient-to-r from-[#A37478] to-[#7B5195] text-white shadow-md"
                            : "border-gray-200 text-gray-600 hover:border-[#A37478] hover:text-[#A37478] hover:shadow-sm"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            isActive ? "bg-white" : "bg-[#A37478]/30 group-hover:bg-[#A37478]"
                          }`}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <TriangleLoader height="200px" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 sm:gap-8">
                {products.map((product, index) => {
                  const productId = product?._id || product?.id;
                  const productSlug = product?.slug || productId;
                  const productImage =
                    product?.image ||
                    product?.thumbnail ||
                    (Array.isArray(product?.images) ? product.images[0]?.url || product.images[0] : null);
                  const brandLabel = product?.brand?.name || product?.brand || "Tiara Steps";
                  const productName = product?.name || product?.title || "Untitled product";
                  const productPrice = product?.price ?? product?.salePrice ?? product?.mrp ?? "—";
                  const isFavorite = productId ? Boolean(favorites[productId]) : false;

                  const cardKey = productId || productSlug || `product-${index}`;

                  return (
                    <div
                      key={cardKey}
                      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                      onClick={() => {
                        if (productSlug) navigate(`/product/${productSlug}`);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && productSlug) {
                          navigate(`/product/${productSlug}`);
                        }
                      }}
                    >
                      <div className="relative w-full pt-[100%] overflow-hidden bg-gray-100">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-[1.08]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            Image unavailable
                          </div>
                        )}
                        <button
                          className={`absolute top-3 right-3 w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-250 ${
                            isFavorite ? "bg-[#A37478] text-white" : "bg-white/85 hover:bg-white hover:scale-110"
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (productId) toggleFavorite(productId);
                          }}
                          type="button"
                        >
                          <Heart size={18} />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="text-[13px] text-gray-600 uppercase tracking-wide mb-1 line-clamp-1">
                          {brandLabel}
                        </div>
                        <div className="text-[15px] text-gray-800 mb-2.5 font-medium line-clamp-2">{productName}</div>
                        <div className="text-base font-semibold text-[#A37478]">
                          {typeof productPrice === "number" ? `Rs. ${productPrice}` : productPrice}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-[50px] py-[30px]">
                <button
                  onClick={goToPrevPage}
                  className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>

                {pageNumbers.map((num) => (
                  <div
                    key={num}
                    className={`w-10 h-10 border rounded flex items-center justify-center cursor-pointer transition-all text-sm ${
                      currentPage === num ? "bg-[#A37478] text-white border-[#8b686b]" : "border-gray-300 bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </div>
                ))}

                <button
                  onClick={goToNextPage}
                  className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center hover:bg-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
