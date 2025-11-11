import { memo } from "react";
import { Link } from "react-router-dom";

const SideItems = ({ iconName, text, to }) => {
  return (
    <Link to={to} className="no-underline">
      <li className="cursor-pointer flex justify-items-start items-center gap-3 py-2 px-4 text-[#1a1a1a] text-sm font-medium rounded-md mb-1 transition-[background-color,color] duration-200 ease-in-out hover:text-[#54bab9] hover:bg-white/5">
        <div className="flex">{iconName}</div>
        <div className="text-[15px] flex justify-center items-center">{text}</div>
      </li>
    </Link>
  );
};

export default memo(SideItems);
