import { useRef } from "react";
import MultiSelectBox from "./MultiSelectBox";
const FilterModal = ({
  onClose,
  filters,
  changeFilter,
  FilterOptions,
  requestData,
}) => {
  const modelRef = useRef();
  const closeModal = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  const sortOptions = [
    { value: "createdAt_asc", label: "Latest First" },
    { value: "createdAt_desc", label: "Oldest First" },
    { value: "price_asc", label: "Low to High Price" },
    { value: "price_desc", label: "High to Low Price" },
  ];
  const sizes = [];
  for (let i = 3; i <= 14; i++) {
    sizes.push({ value: i, label: i });
  }
  return (
    <div ref={modelRef} onClick={closeModal} className="fixed inset-0 z-[100000] backdrop-blur-[1px] bg-black/30 flex justify-center items-center">
      <div className="flex items-center flex-col gap-5 bg-white rounded-xl m-0 mx-4 p-7 px-8 max-[600px]:items-start max-[600px]:p-6">
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Sort By</h4>
          <div className="w-full">
            <MultiSelectBox
              multiple={false}
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) => changeFilter({ sortBy: e })}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">
            Size
            <br /> (in UK)
          </h4>
          <div className="w-full">
            <MultiSelectBox
              multiple={true}
              options={sizes}
              value={filters.size}
              onChange={(e) => changeFilter({ size: e })}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Color</h4>
          <div className="w-full">
            <MultiSelectBox
              multiple={true}
              options={FilterOptions.colors.map((color) => ({
                value: color,
                label: color,
              }))}
              value={filters.color}
              onChange={(e) => changeFilter({ color: e })}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Brand</h4>
          <div className="w-full">
            <MultiSelectBox
              multiple={true}
              options={FilterOptions.brands.map((brand) => ({
                value: brand,
                label: brand,
              }))}
              value={filters.brand}
              onChange={(e) => changeFilter({ brand: e })}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Category</h4>
          <div className="w-full">
            <MultiSelectBox
              multiple={true}
              options={FilterOptions.category.map((item) => ({
                value: item,
                label: item,
              }))}
              value={filters.category === "" ? [] : filters.category.split(",")}
              onChange={(e) => changeFilter({ category: e.join(",") })}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0 -mb-4">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Price Range</h4>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0 max-[600px]:flex-col max-[600px]:w-full">
          <div className="w-full h-[45px] flex items-center text-base text-[#777]">
            <span className="text-base text-[#777] font-semibold">Min</span>
            <input
              type="number"
              value={filters.price.minPrice}
              className="h-10 w-[160px] ml-3 text-center outline-none text-base rounded text-[#777] border-[2.2px] border-gray-300 p-2 bg-white max-[600px]:w-[13rem]"
              placeholder="0"
              min={0}
              onChange={(e) =>
                changeFilter({
                  price: {
                    ...filters.price,
                    minPrice: Number(e.target.value) || 0,
                  },
                })
              }
            />
          </div>
          <div className="text-base text-[#777] font-semibold max-[600px]:hidden">-</div>
          <div className="w-full h-[45px] flex items-center text-base text-[#777] max-[600px]:justify-between">
            <span className="text-base text-[#777] font-semibold">Max</span>
            <input
              type="number"
              value={filters.price.maxPrice}
              className="h-10 w-[160px] ml-3 text-center outline-none text-base rounded text-[#777] border-[2.2px] border-gray-300 p-2 bg-white max-[600px]:w-[13rem] max-[600px]:ml-0"
              placeholder="Infinity"
              min={0}
              onChange={(e) =>
                changeFilter({
                  price: {
                    ...filters.price,
                    maxPrice: Number(e.target.value) || Infinity,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <div className="w-full flex justify-center items-center gap-8 mt-2">
            <button
              className="w-full py-2 text-sm font-semibold font-['Poppins',sans-serif] bg-[#e5e5e5] text-[#777] border border-gray-300 rounded-md cursor-pointer hover:bg-[#e8f6ea] hover:text-[#54bab9] hover:border-[#54bab9]"
              onClick={() => {
                onClose();
              }}
            >
              Close
            </button>
            <button
              className="w-full py-2 text-sm font-semibold font-['Poppins',sans-serif] bg-[#e5e5e5] text-[#777] border border-gray-300 rounded-md cursor-pointer hover:bg-[#e8f6ea] hover:text-[#54bab9] hover:border-[#54bab9]"
              onClick={() => {
                requestData();
                onClose();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
