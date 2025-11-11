import React from "react";

const DashCard = ({ title, amount }) => {
  return (
    <div className="flex rounded-2xl py-6 px-5 flex-col rounded-lg gap-2 bg-[#f3f4f6] w-full">
      <div className="text-[1.1rem] font-medium text-[#3f3f46] flex items-center gap-1.5">{title}</div>
      <div className="text-[1.75rem] font-semibold text-[#1a1a1a]">{amount}</div>
    </div>
  );
};

export default DashCard;
