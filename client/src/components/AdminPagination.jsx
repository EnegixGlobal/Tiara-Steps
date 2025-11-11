import { memo } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const AdminPagination = ({
  startPage,
  endPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  gotoPage,
  pageIndex,
}) => {
  return (
    <div className="flex mb-8 items-center justify-center">
      <button
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] border border-gray-200 transition-all duration-300 rounded-md cursor-pointer ${
          !canPreviousPage 
            ? "cursor-not-allowed bg-gray-100 text-black opacity-50" 
            : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
        } ${pageIndex + 1 === startPage ? "bg-[#54bab9] text-[#e8f6ea] border-[#54bab9]" : ""}`}
      >
        <div className="flex items-center justify-around">
          <MdKeyboardArrowLeft className="text-xl" />
          <span>Previous</span>
        </div>
      </button>

      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((number) => (
        <button
          key={number}
          className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] border border-gray-200 transition-all duration-300 rounded-md cursor-pointer ${
            number === pageIndex + 1 
              ? "bg-[#54bab9] text-[#e8f6ea] border-[#54bab9]" 
              : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
          }`}
          onClick={() => gotoPage(number - 1)}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => nextPage()}
        disabled={!canNextPage}
        className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] border border-gray-200 transition-all duration-300 rounded-md cursor-pointer ${
          !canNextPage 
            ? "cursor-not-allowed bg-gray-100 text-black opacity-50" 
            : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
        } ${pageIndex + 1 === endPage ? "bg-[#54bab9] text-[#e8f6ea] border-[#54bab9]" : ""}`}
      >
        <div className="flex items-center justify-around">
          <span>Next</span>
          <MdKeyboardArrowRight className="text-xl" />
        </div>
      </button>
    </div>
  );
};

export default memo(AdminPagination);
