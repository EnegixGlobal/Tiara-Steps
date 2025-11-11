import { memo } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({
  totalPageCount,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  gotoPage,
  pageIndex,
}) => {
  let startPage = Math.max(pageIndex - 2, 1);
  let endPage = Math.min(startPage + 4, totalPageCount);

  if (endPage - startPage < 4) {
    startPage = Math.max(endPage - 4, 1);
  }
  return (
    <div className="flex mb-8 items-center justify-center">
      <button
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] bg-[#e8f6ea] text-[#54bab9] border border-[#cce7d0] transition-all duration-300 rounded-md cursor-pointer ${
          !canPreviousPage 
            ? "cursor-not-allowed bg-white text-[#cce7d0]" 
            : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
        }`}
      >
        <div className="flex items-center justify-around">
          <MdKeyboardArrowLeft className="text-xl max-[768px]:hidden" />
          <span>Previous</span>
        </div>
      </button>

      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((number) => (
        <button
          key={number}
          className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] bg-[#e8f6ea] text-[#54bab9] border border-[#cce7d0] transition-all duration-300 rounded-md cursor-pointer ${
            number === pageIndex + 1 
              ? "bg-[#54bab9] text-[#e8f6ea] border-[#54bab9]" 
              : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
          }`}
          onClick={() => gotoPage(number)}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => nextPage()}
        disabled={!canNextPage}
        className={`py-2.5 px-4 m-1 text-[15px] font-semibold font-['Poppins',sans-serif] bg-[#e8f6ea] text-[#54bab9] border border-[#cce7d0] transition-all duration-300 rounded-md cursor-pointer ${
          !canNextPage 
            ? "cursor-not-allowed bg-white text-[#cce7d0]" 
            : "hover:bg-[#54bab9] hover:text-[#e8f6ea] hover:border-[#54bab9]"
        }`}
      >
        <div className="flex items-center justify-around">
          <span>Next</span>
          <MdKeyboardArrowRight className="text-xl max-[768px]:hidden" />
        </div>
      </button>
    </div>
  );
};

export default memo(Pagination);
