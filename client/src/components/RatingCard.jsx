import { memo } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import Star from "./Star";
const RatingCard = ({ data }) => {
  console.log(data);
  const date = new Date(data.date);
  const formattedDate = date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return (
    <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
      <div className="w-12 h-12 rounded-full bg-[#54bab9] text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
        {data.name[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 mb-2">{data.name}</div>
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <Star rating={data.rating || 0} />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{data.review}</p>
        </div>
        <div className="text-gray-500 text-xs">on {formattedDate}</div>
      </div>
    </div>
  );
};

export default memo(RatingCard);
