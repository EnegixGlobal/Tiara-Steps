import React, { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
const FormReviews = ({ onClose, onSubmit }) => {
  const modelRef = useRef();
  const [rating, setRating] = useState(1);
  const [opinion, setOpinion] = useState("");

  const closeModal = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  //   const handleStarClick = (idx) => {
  //     setRating(idx + 1);
  //   };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ rating, opinion });
  };

  return (
    <div ref={modelRef} onClick={closeModal} className="fixed inset-0 z-[100000] backdrop-blur-[1px] bg-black/30 flex justify-center items-center">
      <div className="bg-white p-8 mx-4 max-w-[576px] w-full rounded-xl shadow-[8px_8px_30px_rgba(0,0,0,0.05)] text-center">
        <h3 className="text-xl font-semibold mb-4">How would you rate this product?</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center items-center gap-2 text-3xl mb-8">
            {[...Array(5)].map((_, idx) => (
              <FaStar
                key={idx}
                className="cursor-pointer"
                color={idx < rating ? "#ffc107" : "#e4e5e9"}
                onClick={() => setRating(idx + 1)}
              />
            ))}
          </div>
          <textarea
            name="opinion"
            cols="30"
            rows="5"
            placeholder="Your opinion..."
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            className="w-full bg-gray-100 p-4 rounded-lg border-none outline-none resize-none mb-2"
          ></textarea>
          <div className="flex justify-center items-center">
            <button type="submit" className="w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm font-['League_Spartan','Poppins',sans-serif] text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e]">Submit</button>
            <button onClick={() => onClose()} type="button" className="w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm font-['League_Spartan','Poppins',sans-serif] text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormReviews;
