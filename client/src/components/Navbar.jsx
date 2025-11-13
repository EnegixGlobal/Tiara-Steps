import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../Images/Tiara-logo2.png";
import { FiSearch } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setAuth(null);
    navigate("/");
  };

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
          <NavLink to="/trending" className="hover:text-[#b89396] transition-colors">
            Best Sellers
          </NavLink>
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
          <div className="hidden lg:flex items-center border border-gray-300 rounded-full px-5 py-2 bg-white shadow-sm w-[300px]">
            <input
              type="text"
              placeholder="Search for product"
              className="w-full border-none outline-none text-[16px] text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <FiSearch className="text-gray-500 text-2xl cursor-pointer hover:text-[#b89396] transition-colors" />
          </div>

          {/* Mobile Search Icon */}
          <div
            className="lg:hidden text-2xl text-gray-700 cursor-pointer hover:text-[#b89396] transition-colors"
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
          <div className="text-[28px] cursor-pointer text-[#4b3f3f] hover:text-[#b89396] relative group transition-colors">
            {auth ? (
              <>
                <LuUserRound className="text-[30px]" />
                <ul className="hidden group-hover:block absolute right-0 top-[38px] bg-white border border-gray-100 rounded-lg shadow-md w-[140px] py-2">
                  <li>
                    <Link
                      to="/orders"
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
          <NavLink to="/trending" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Best Sellers</NavLink>
          <NavLink to="/products" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Products</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">About</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-[#b89396]">Contact</NavLink>
        </div>
      )}

      {/* Mobile Search Bar */}
      {mobileSearch && (
        <div className="lg:hidden flex items-center gap-3 px-6 py-3 border-t border-gray-200 bg-white shadow-sm animate-fadeIn">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none text-gray-700"
          />
          <FiSearch className="text-2xl text-gray-600 cursor-pointer hover:text-[#b89396]" />
        </div>
      )}
    </div>
  );
};

export default Navbar;
