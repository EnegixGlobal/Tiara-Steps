import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { MdClose } from "react-icons/md";
const MultiSelectBox = ({
  customWidth,
  multiple,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectOption = (option) => {
    if (multiple) {
      if (value.some((v) => v === option.value)) {
        onChange(value.filter((v) => v !== option.value));
      } else {
        onChange([...value, option.value]);
      }
    } else {
      if (option.value !== value.value) onChange(option);
    }
  };
  function isSelected(option) {
    return multiple
      ? value.some((v) => v === option.value)
      : option.value === value.value;
  }
  return (
    <div
      className="relative w-[23rem] min-h-10 border-[2.2px] border-gray-300 flex items-center gap-2 p-2 pl-4 rounded text-[#777] outline-none cursor-pointer bg-white text-base max-[600px]:w-full"
      tabIndex={0}
      onBlur={() => {
        setIsOpen(false);
      }}
      onClick={() => setIsOpen((prev) => !prev)}
      style={customWidth ? { width: "100%" } : {}}
    >
      <span className="flex-grow flex gap-2 flex-wrap">
        {multiple
          ? value.map((v, i) => (
              <button
                key={i}
                className="flex items-center border-[0.05em] border-gray-300 rounded px-1 py-0.5 gap-1 bg-none cursor-pointer outline-none text-[#777] hover:bg-[#e8f6ea] hover:text-[#54bab9] hover:border-[#54bab9]"
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption({ value: v });
                }}
              >
                {v}
                <span className="flex justify-center items-center">
                  <MdClose />
                </span>
              </button>
            ))
          : value.label}
      </span>
      <div className="flex items-center">
        <FaChevronDown />
      </div>
      <ul className={`absolute p-0 m-0 ${isOpen ? "block" : "hidden"} rounded border-[0.05em] border-gray-300 w-full left-0 top-[calc(100%+0.25em)] max-h-[15em] overflow-y-auto list-none bg-white z-[100]`}>
        {options.map((option, index) => {
          return (
            <li
              key={index}
              className={`py-1 px-2 cursor-pointer ${
                isSelected(option) ? "bg-[#e8f6ea] text-[#54bab9]" : ""
              } hover:bg-gray-100`}
              value={option.value}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default MultiSelectBox;
