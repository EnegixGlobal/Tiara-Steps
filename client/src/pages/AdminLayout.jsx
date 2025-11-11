import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row">
      <div className={`bg-[#faebd7] h-screen sticky top-0 z-[999] transition-all duration-[500ms] ease-in-out overflow-hidden border-r border-[#ccc] max-[1024px]:fixed ${
        open ? "w-[17%] max-[1024px]:w-[12rem]" : "w-0"
      }`}>
        <AdminSideBar toggleOpen={() => setOpen((prev) => !prev)} />
      </div>
      <div className="w-full h-screen transition-all duration-[1000ms] ease-in-out" style={{ height: "100%" }}>
        <AdminHeader open={open} toggleOpen={() => setOpen((prev) => !prev)} />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
