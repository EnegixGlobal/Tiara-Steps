import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../Images/Tiara-logo2.png";
import { FiSearch } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import Axios from "../Axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const profileDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  
  // Debounce search queries
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedMobileSearchQuery = useDebounce(mobileSearchQuery, 300);

  const handleBestsellerClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // If already on home page, scroll to section
      const bestsellerSection = document.getElementById("bestsellers");
      if (bestsellerSection) {
        bestsellerSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // If not on home page, navigate to home and then scroll
      navigate("/");
      // Wait for page to render, then scroll
      setTimeout(() => {
        let retryCount = 0;
        const maxRetries = 10;
        const scrollToBestseller = () => {
          const bestsellerSection = document.getElementById("bestsellers");
          if (bestsellerSection) {
            bestsellerSection.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (retryCount < maxRetries) {
            // Retry if element not found yet
            retryCount++;
            setTimeout(scrollToBestseller, 100);
          }
        };
        scrollToBestseller();
      }, 300);
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setAuth(null);
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setMobileSearchQuery("");
      setMobileSearch(false);
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
    setShowSuggestions(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    setMobileSearch(false);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setShowSuggestions(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    setMobileSearch(false);
  };

  const handleDesktopSearch = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const handleMobileSearch = (e) => {
    if (e.key === "Enter") {
      handleSearch(mobileSearchQuery);
    }
  };

  const handleSearchIconClick = () => {
    handleSearch(searchQuery);
  };

  const handleMobileSearchIconClick = () => {
    handleSearch(mobileSearchQuery);
  };

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = debouncedSearchQuery.trim() || debouncedMobileSearchQuery.trim();
      
      if (!query || query.length < 2) {
        setSearchResults({ products: [], categories: [] });
        setShowSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);
      try {
        // Fetch products - no limit, show all matching products
        const productResponse = await Axios.get("/product/filter", {
          params: {
            search: query,
            page: 1,
            limit: 100, // Very high limit to get all products without pagination
          },
        });

        // Fetch categories and filter matching ones
        const categoryResponse = await Axios.get("/product/filterOptions");
        const allCategories = categoryResponse.data?.category || [];
        const matchingCategories = allCategories
          .filter((cat) => 
            cat.name?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 4) // Limit to 4 categories
          .map((cat) => cat.name);

        setSearchResults({
          products: productResponse.data?.products || [],
          categories: matchingCategories,
        });
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchResults({ products: [], categories: [] });
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery, debouncedMobileSearchQuery]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      
      // Close search suggestions dropdown
      const isClickInsideSearch = 
        (searchContainerRef.current && searchContainerRef.current.contains(event.target)) ||
        (searchDropdownRef.current && searchDropdownRef.current.contains(event.target)) ||
        (mobileSearchContainerRef.current && mobileSearchContainerRef.current.contains(event.target));
      
      if (showSuggestions && !isClickInsideSearch) {
        setShowSuggestions(false);
      }
    };

    if (showProfileDropdown || showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showSuggestions]);

  return (
    <div className="sticky top-0 left-0 right-0 z-[9999] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between px-8 md:px-14 lg:px-20 h-[85px] font-[Poppins]">
        
        {/* Left Section - Logo + Hamburger */}
        <div className="flex items-center gap-4">
          {/* Hamburger Icon - mobile only */}
          <div
            className="md:hidden text-3xl text-[#4b3f3f] cursor-pointer hover:text-[#b89396] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Tiara Steps"
              onClick={() => navigate("/")}
              className="h-[60px] w-auto cursor-pointer hover:scale-[1.03] transition-transform"
            />
          </div>
        </div>

        {/* Center Section - Nav Links (hidden in mobile) */}
        <div className="hidden md:flex items-center gap-10 text-[17px] font-medium text-gray-500">
          <NavLink to="/" className="hover:text-[#b89396] transition-colors">
            Home
          </NavLink>
          <a 
            href="#bestsellers" 
            onClick={handleBestsellerClick}
            className="hover:text-[#b89396] transition-colors cursor-pointer"
          >
            Best Sellers
          </a>
          <NavLink to="/products" className="hover:text-[#b89396] transition-colors">
            Products
          </NavLink>
          <NavLink to="/about" className="hover:text-[#b89396] transition-colors">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:text-[#b89396] transition-colors">
            Contact
          </NavLink>
        </div>

        {/* Right Section - Search + Icons */}
        <div className="flex items-center gap-6">
          {/* Search Bar - desktop only */}
          <div ref={searchContainerRef} className="hidden lg:flex relative">
            <div className="flex items-center border border-gray-300 rounded-full px-5 py-2 bg-white shadow-sm w-[300px]">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for product"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.trim().length >= 2);
                }}
                onKeyDown={handleDesktopSearch}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full border-none outline-none text-[16px] text-gray-700 placeholder-gray-400 bg-transparent"
              />
              <FiSearch 
                className="text-gray-500 text-2xl cursor-pointer hover:text-[#b89396] transition-colors" 
                onClick={handleSearchIconClick}
              />
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2 || mobileSearchQuery.trim().length >= 2) && (
              <div
                ref={searchDropdownRef}
                className="absolute top-full left-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-xl z-[10000] max-h-[600px] overflow-y-auto custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#b89396 #f3f4f6'
                }}
              >
                {loadingSuggestions ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : (
                  <>
                    {/* Categories Section */}
                    {searchResults.categories.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                          Categories
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.categories.map((category, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCategoryClick(category)}
                              className="px-3 py-1.5 bg-gray-50 hover:bg-[#b89396] hover:text-white rounded-full text-sm text-gray-700 transition-colors"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                          Products
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {searchResults.products.map((product) => {
                            const productSlug = product?.slug || product?._id;
                            const productImage =
                              product?.image ||
                              product?.thumbnail ||
                              (Array.isArray(product?.images) ? product.images[0]?.url || product.images[0] : null);
                            const productName = product?.name || "Untitled product";
                            const productPrice = product?.price || product?.salePrice || product?.mrp || 0;

                            return (
                              <div
                                key={productSlug}
                                onClick={() => handleProductClick(productSlug)}
                                className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                              >
                                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                  {productImage ? (
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 mb-1 w-full">
                                  {productName}
                                </div>
                                <div className="text-xs font-semibold text-[#b89396]">
                                  Rs. {Number(productPrice).toLocaleString("en-IN")}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No results found
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <div
            className="lg:hidden text-2xl text-gray-700 cursor-pointer hover:text-[#b89396]"
            onClick={() => setMobileSearch(!mobileSearch)}
          >
            <FiSearch />
          </div>

          {/* Cart Icon */}
          <div className="relative text-[26px] cursor-pointer text-[#4b3f3f] hover:text-[#b89396] transition-colors">
            <Link to="/cart">
              <FaShoppingCart />
              <div className="absolute -top-[7px] -right-3 text-[11px] bg-[#b89396] text-white rounded-full w-[18px] h-[18px] flex justify-center items-center font-semibold">
                {auth?.cartSize || 0}
              </div>
            </Link>
          </div>

          {/* Wishlist Icon */}
          <div className="text-[26px] cursor-pointer text-[#4b3f3f] hover:text-[#b89396] transition-colors">
            <Link to="/wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[28px] w-[28px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.623-2.045-4.75-4.571-4.75-1.762 0-3.307 1.017-4.429 2.518C10.878 4.517 9.333 3.5 7.571 3.5 5.045 3.5 3 5.627 3 8.25c0 4.464 7.5 10.25 9 10.25s9-5.786 9-10.25z"
                />
              </svg>
            </Link>
          </div>

          {/* Profile Icon */}
          <div 
            ref={profileDropdownRef}
            className="text-[28px] cursor-pointer text-[#4b3f3f] hover:text-[#b89396] relative transition-colors"
          >
            {auth ? (
              <>
                <div onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                  <LuUserRound className="text-[30px]" />
                </div>
                {showProfileDropdown && (
                  <ul className="absolute right-0 top-[38px] bg-white border border-gray-100 rounded-lg shadow-md w-[140px] py-2 z-50">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-[15px]"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-[15px]"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-[15px]"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <Link to="/login" className="text-[30px]">
                <LuUserRound />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md py-4 px-6 space-y-3 text-gray-600 font-medium text-[17px] animate-slideDown">
          <NavLink to="/" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Home</NavLink>
          <a 
            href="#bestsellers" 
            onClick={handleBestsellerClick}
            className="block hover:text-[#b89396] cursor-pointer"
          >
            Best Sellers
          </a>
          <NavLink to="/products" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Products</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">About</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Contact</NavLink>
        </div>
      )}

      {/* Mobile Search Bar */}
      {mobileSearch && (
        <div ref={mobileSearchContainerRef} className="lg:hidden relative">
          <div className="flex items-center gap-3 px-6 py-3 border-t border-gray-200 bg-white shadow-sm animate-fadeIn">
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search products..."
              value={mobileSearchQuery}
              onChange={(e) => {
                setMobileSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.trim().length >= 2);
              }}
              onKeyDown={handleMobileSearch}
              onFocus={() => {
                if (mobileSearchQuery.trim().length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none text-gray-700"
            />
            <FiSearch 
              className="text-2xl text-gray-600 cursor-pointer hover:text-[#b89396]" 
              onClick={handleMobileSearchIconClick}
            />
          </div>

          {/* Mobile Search Suggestions Dropdown */}
          {showSuggestions && mobileSearchQuery.trim().length >= 2 && (
            <div
              ref={searchDropdownRef}
              className="absolute top-full left-0 right-0 mt-1 mx-6 bg-white border border-gray-200 rounded-lg shadow-xl z-[10000] max-h-[500px] overflow-y-auto custom-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#b89396 #f3f4f6'
              }}
            >
              {loadingSuggestions ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : (
                <>
                  {/* Categories Section */}
                  {searchResults.categories.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                        Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.categories.map((category, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCategoryClick(category)}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[#b89396] hover:text-white rounded-full text-sm text-gray-700 transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Section */}
                  {searchResults.products.length > 0 && (
                    <div className="p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                        Products
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {searchResults.products.map((product) => {
                          const productSlug = product?.slug || product?._id;
                          const productImage =
                            product?.image ||
                            product?.thumbnail ||
                            (Array.isArray(product?.images) ? product.images[0]?.url || product.images[0] : null);
                          const productName = product?.name || "Untitled product";
                          const productPrice = product?.price || product?.salePrice || product?.mrp || 0;

                          return (
                            <div
                              key={productSlug}
                              onClick={() => handleProductClick(productSlug)}
                              className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 mb-1 w-full">
                                {productName}
                              </div>
                              <div className="text-xs font-semibold text-[#b89396]">
                                Rs. {Number(productPrice).toLocaleString("en-IN")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
