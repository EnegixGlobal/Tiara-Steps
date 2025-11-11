import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../Images/Tiara-logo2.png";
import { FiSearch } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 right-0 z-[9999] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between px-19 h-[90px] font-[Poppins] max-[768px]:px-6">

        {/* Left Section - Links (moved closer to logo) */}
        <div className="flex items-center gap-13 text-[18px] font-medium text-gray-500 max-[992px]:hidden">
          <NavLink to="/" className="hover:text-[#d81b60] transition-colors">Home</NavLink>
          <NavLink to="/trending" className="hover:text-[#d81b60] transition-colors">Best Sellers</NavLink>
          <NavLink to="/products" className="hover:text-[#d81b60] transition-colors">Products</NavLink>
          <NavLink to="/about" className="hover:text-[#d81b60] transition-colors">About</NavLink>
          <NavLink to="/contact" className="hover:text-[#d81b60] transition-colors">Contact</NavLink>
        </div>

        {/* Center Section - Logo (slightly moved left) */}
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="Tiara Steps"
            className="h-[95px] w-auto cursor-pointer hover:scale-[1.03] transition-transform"
          />
        </div>

        {/* Right Section - Search + Icons */}
        <div className="flex items-center gap-7">
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-full px-5 py-3 bg-white shadow-sm w-[310px] max-[992px]:hidden">
            <input
              type="text"
              placeholder="Search for product"
              className="w-full border-none outline-none text-[17px] text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <FiSearch className="text-gray-500 text-2xl cursor-pointer hover:text-[#d81b60] transition-colors" />
          </div>

          {/* Cart Icon */}
          <div className="relative text-[26px] cursor-pointer text-[#4b3f3f] hover:text-[#d81b60] transition-colors">
            <Link to="/cart">
              <FaShoppingCart />
              <div className="absolute -top-[7px] -right-3 text-[11px] bg-[#d81b60] text-white rounded-full w-[18px] h-[18px] flex justify-center items-center font-semibold">
                {auth?.cartSize || 0}
              </div>
            </Link>
          </div>

          {/* Wishlist Icon */}
          <div className="text-[26px] cursor-pointer text-[#4b3f3f] hover:text-[#d81b60] transition-colors">
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
          <div className="text-[28px] cursor-pointer text-[#4b3f3f] hover:text-[#d81b60] relative group transition-colors">
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
                      onClick={() => {
                        localStorage.removeItem("jwt");
                        setAuth(null);
                        navigate("/");
                      }}
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
    </div>
  );
};

export default Navbar;
