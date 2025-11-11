import React, { memo, useState } from "react";
import RatingCard from "./RatingCard";

const RatingContainer = ({ ratings }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);

  return (
    <div className="mt-4">
      {ratings.length > 0 && (
        <>
          <h3 className="text-[15px] font-semibold my-5 mb-2.5 text-black">Ratings </h3>
          {ratings.slice(0, visibleReviews).map((data, index) => (
            <RatingCard key={index} data={data} />
          ))}
          {ratings.length > visibleReviews && (
            <button
              className="w-full h-[55px] bg-black text-white border-none rounded text-base font-semibold uppercase tracking-wide cursor-pointer transition-colors my-4 hover:bg-gray-800"
              onClick={() => setVisibleReviews(visibleReviews + 3)}
            >
              Show more reviews
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default memo(RatingContainer);
