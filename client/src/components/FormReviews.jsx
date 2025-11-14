import React, { useRef, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
const FormReviews = ({ onClose, onSubmit, editData = null }) => {
  const modelRef = useRef();
  const [rating, setRating] = useState(editData?.rating || 1);
  const [opinion, setOpinion] = useState(editData?.review || "");

  useEffect(() => {
    if (editData) {
      setRating(editData.rating || 1);
      setOpinion(editData.review || "");
    }
  }, [editData]);

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
        <h3 className="text-xl font-semibold mb-4">{editData ? "Edit your review" : "How would you rate this product?"}</h3>
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
          <button
  type="submit"
  className="
    w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm
    font-['League_Spartan','Poppins',sans-serif] text-[15px]
    bg-[#A37478] border border-[#A37478] cursor-pointer
    hover:bg-[#8f6367] hover:border-[#8f6367]
  "
>
  {editData ? "Update" : "Submit"}
</button>

<button
  onClick={() => onClose()}
  type="button"
  className="
    w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm
    font-['League_Spartan','Poppins',sans-serif] text-[15px]
    bg-[#A37478] border border-[#A37478] cursor-pointer
    hover:bg-[#8f6367] hover:border-[#8f6367]
  "
>
  Cancel
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default FormReviews;
