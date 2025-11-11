import React from "react";
import logo from "../../public/vite.svg";
import SideItems from "./SideItems";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaClipboardList } from "react-icons/fa";
import {
  MdWindow,
  MdOutlineLogout,
  MdMenuOpen,
  MdCategory,
  MdPalette,
} from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { TbBrandBooking } from "react-icons/tb";
import { Link } from "react-router-dom";

const AdminSideBar = ({ toggleOpen }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between py-2.5 px-2.5">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} alt="logo" className="w-[2.6rem] aspect-square" />
          <div className="flex flex-col gap-0">
            <div className="text-base font-bold text-[#1a1a1a] no-underline italic">TIARASTEPS</div>
            <Link
              to="/"
              className="text-[#ccc] text-[13px] -mt-1 underline hover:text-white"
            >
              Visit store
            </Link>
          </div>
        </div>
        <div onClick={() => toggleOpen()} className="hidden max-[1024px]:flex max-[1024px]:justify-center max-[1024px]:items-center">
          <MdMenuOpen size={28} />
        </div>
      </div>
      <ul className="flex-1 list-none p-2">
        <SideItems iconName={<FaHome size={20} />} text="Home" to="/admin" />
        <SideItems
          iconName={<FaUser size={17} />}
          text="Customers"
          to="/admin/customers"
        />
        <SideItems
          iconName={<MdWindow size={20} />}
          text="Products"
          to="/admin/products"
        />
        <SideItems
          iconName={<FaClipboardList size={18} />}
          text="Orders"
          to="/admin/orders"
        />
        <SideItems
          iconName={<BiSolidDiscount size={20} />}
          text="Coupons"
          to="/admin/coupons"
        />
        <SideItems
          iconName={<TbBrandBooking size={22} />}
          text="Brands"
          to="/admin/brands"
        />
        <SideItems
          iconName={<MdCategory size={20} />}
          text="Category"
          to="/admin/category"
        />
        <SideItems
          iconName={<MdPalette size={20} />}
          text="Colors"
          to="/admin/colors"
        />
        <li
          onClick={() => {
            localStorage.removeItem("jwtAdmin");
            navigate("/adminlogin");
          }}
          className="cursor-pointer flex justify-items-start items-center gap-3 py-2 px-4 text-[#1a1a1a] text-sm font-medium rounded-md mb-1 transition-[background-color,color] duration-200 ease-in-out hover:text-[#54bab9] hover:bg-white/5"
        >
          <div className="flex">
            <MdOutlineLogout size={20} />
          </div>
          <div className="text-[15px] flex justify-center items-center">Logout</div>
        </li>
      </ul>
    </>
  );
};

export default AdminSideBar;
