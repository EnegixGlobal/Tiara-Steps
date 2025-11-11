import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Star from "./Star";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import SizeModal from "./SizeModal";
const Card = (data) => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const toTitleCase = (word) => {
    let letterCapitalizer = (match) =>
      match.substring(0, 1).toUpperCase() + match.substring(1);
    return word.split(" ").map(letterCapitalizer).join(" ");
  };
  const handleAddToCart = async (len) => {
    try {
      if (!auth) {
        toast.error("Login required");
        navigate("/login");
        return;
      } else if (len === 0) {
        toast.error("Out of stock");
        return;
      }
      setShowModal((prev) => !prev);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative w-[clamp(250px,20vw,310px)] py-3.5 px-3.5 pb-5 border border-[#cce7d0] rounded-[25px] shadow-[20px_20px_30px_rgba(0,0,0,0.06)] transition-all duration-200 ease-in-out hover:shadow-[20px_20px_30px_rgba(0,0,0,0.2)] max-[1000px]:w-[99%] max-[700px]:py-2.5 max-[700px]:px-2.5 max-[700px]:rounded-[18px] max-[700px]:shadow-none max-[700px]:hover:shadow-none max-[415px]:w-[99%]">
      {showModal && (
        <SizeModal
          id={data._id}
          size={data.sizeQuantity}
          onClose={() => setShowModal((prev) => !prev)}
        />
      )}
      <Link to={`/product/${data.slug}`} className="no-underline">
        <div className="w-full bg-[#e5e5e5] rounded-[20px] cursor-pointer overflow-hidden flex justify-center items-center border border-[#d9eadc] max-[700px]:rounded-[13px]">
          <img src={data.image} alt="image" height="240px" loading="lazy" className="object-cover w-full aspect-square" />
        </div>
      </Link>
      <div className="text-left pt-2.5 pb-0 font-['League_Spartan',sans-serif,'Poppins'] max-[700px]:pt-4 max-[700px]:pb-0.5">
        <Link to={`/product/${data.slug}`} className="no-underline">
          <h5 className="font-black whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(18px,3vw,24px)] text-[#1a1a1a] pt-[0.5vw] leading-none">{data.brand}</h5>
          <h6 className="whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(14px,2vw,18px)] font-normal text-gray-600">{toTitleCase(data.name)}</h6>
        </Link>
        <div className="text-[rgb(243,181,25)] text-[clamp(13px,2.5vw,17px)] flex gap-0.5 py-0.5">
          {<Star rating={data.ratingScore / data.ratings.length || 0} />}
        </div>
        <h4 className="font-extrabold text-[clamp(15px,2.5vw,19px)] text-[#54bab9] pt-2.5 pb-0">₹ {data.price}</h4>
      </div>
      <button
        className="h-[clamp(30px,3.5vw,40px)] w-[clamp(30px,3.5vw,40px)] rounded-[40px] items-center flex justify-center bg-[#e8f6ea] text-[#54bab9] border border-[#cce7d0] absolute bottom-[clamp(12px,1.5vw,20px)] right-[clamp(14px,1.5vw,20px)] cursor-pointer"
        onClick={() => handleAddToCart(data.sizeQuantity.length)}
      >
        <span className="text-[clamp(15px,2.5vw,21px)] flex mr-[0.28vw] justify-center items-center">
          <FaShoppingCart />
        </span>
      </button>
    </div>
  );
};

export default memo(Card);
