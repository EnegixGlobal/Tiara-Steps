import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { MdMenuOpen } from "react-icons/md";
const AdminHeader = ({ open, toggleOpen }) => {
  return (
    <div className="flex justify-between items-center py-0 px-5 bg-[#faebd7] border-b border-[#ccc] h-14">
      <div className="flex items-center gap-1.5 font-medium text-lg">
        <div
          onClick={() => toggleOpen()}
          className="flex items-center transition-transform duration-300 ease-in-out"
          style={{ transform: `rotate(${open ? "0" : "180"}deg)` }}
        >
          <MdMenuOpen size={28} />
        </div>
        {/* <p>Dashboard</p> */}
      </div>
      <p className="flex items-center gap-1 font-medium text-base">
        Hello, Admin
        <FaCircleUser size={28} />
      </p>
    </div>
  );
};

export default AdminHeader;
