import { AiFillHeart } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";

const CartItems = ({ cartId, data, qty, size, deleteItem, updateData }) => {
  const [currentQty, setCurrentQty] = useState(qty);
  const [debounceQty, setDebounceQty] = useState(null);
  const { auth, setAuth } = useAuth();
  const firstUpdate = useRef(true);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      setDebounceQty(currentQty);
    }, 450);
    return () => {
      clearTimeout(handler);
    };
  }, [currentQty]);
  
  const changeQty = async () => {
    try {
      const response = await Axios.put(
        `/cart/update/${cartId}`,
        {
          qty: debounceQty,
        },
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        }
      );
      updateData(response.data.cart);
      toast.success("Quantity updated successfully");
      setAuth({ ...auth, cartSize: auth.cartSize - qty + debounceQty });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  
  useEffect(() => {
    if (debounceQty !== null) {
      changeQty();
    }
  }, [debounceQty]);
  
  return (
    <div className="px-6 py-6">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0">
          <Link to={`/product/${data.slug}`}>
            <img 
              src={data.image} 
              alt={data.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 uppercase text-sm">
                {data.brand}
              </h3>
              <p className="text-gray-700 mt-1">
                {data.name}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Size {size}
              </p>
              <p className="text-gray-900 font-semibold mt-2">
                Rs. {data.price}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex gap-3">
              <button
                onClick={deleteItem}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Delete item"
              >
                <FiTrash2 size={20} className="text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Move to favorite"
              >
                <AiFillHeart size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="mt-4 flex items-center">
            <div className="inline-flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setCurrentQty((prev) => (prev > 1 ? prev - 1 : prev))}
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center">
                {currentQty}
              </span>
              <button
                onClick={() => setCurrentQty((prev) => prev + 1)}
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItems);