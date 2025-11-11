import React, { useRef, useState } from "react";
import MultiSelectBox from "./MultiSelectBox";
import { toast } from "react-toastify";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";

const SizeModal = ({ id, size, onClose }) => {
  const { auth, setAuth } = useAuth();
  const modelRef = useRef();
  const closeModal = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };
  const sizeOptions = size.map((item) => ({
    value: item.size,
    label: item.size,
  }));
  const [sizeSelected, setSizeSelected] = useState("");
  const requestData = async () => {
    try {
      if (sizeSelected === "") {
        toast.error("Please select a valid size");
        return;
      }
      const token = localStorage.getItem("jwt");
      console.log("Size Selected: ", Number(sizeSelected.value));
      const response = await Axios.post(
        "/cart/add",
        {
          productId: id,
          qty: 1,
          size: Number(sizeSelected.value),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response?.data?.message);
      setAuth({ ...auth, cartSize: auth.cartSize + 1 });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      ref={modelRef}
      onClick={closeModal}
      className="fixed inset-0 z-[100000] backdrop-blur-[1px] bg-black/30 flex justify-center items-center"
    >
      <div className="flex items-center flex-col gap-5 bg-white rounded-xl m-0 mx-4 p-7 px-8">
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <h4 className="m-0 text-lg font-semibold text-[#777]">Choose Your Perfect Fit Size:</h4>
        </div>
        <div className="flex w-full justify-between gap-5 items-center pb-0">
          <div className="w-full">
            <MultiSelectBox
              multiple={false}
              options={sizeOptions}
              value={sizeSelected}
              onChange={(e) => setSizeSelected(e)}
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
              Cancel
            </button>
            <button
              className="w-full py-2 text-sm font-semibold font-['Poppins',sans-serif] bg-[#e5e5e5] text-[#777] border border-gray-300 rounded-md cursor-pointer hover:bg-[#e8f6ea] hover:text-[#54bab9] hover:border-[#54bab9]"
              onClick={() => {
                requestData();
                onClose();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;
