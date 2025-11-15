import React from "react";
import { useNavigate } from "react-router-dom";
import cat1 from "../../assets/images/A-Casual.png";
import cat2 from "../../assets/images/A-Party-Wear.png";
import cat3 from "../../assets/images/A-Formal-Wear.png";
import cat4 from "../../assets/images/A-Daily-Comfort.png";
import cat5 from "../../assets/images/A-Travel-Essentials.png";
import cat6 from "../../assets/images/A-Dr-Sole.png";

const categories = [
  { name: "Casual Wear", img: cat1 },
  { name: "Party wear", img: cat2 },
  { name: "Formal Wear", img: cat3 },
  { name: "Daily Comfort", img: cat4 },
  { name: "Travel Essentials", img: cat5 },
  { name: "Dr Sole", img: cat6 },
];

const CategoryStrip = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Navigate to products page with category as URL parameter
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
  <section
  className="
    bg-white flex justify-center 
    px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 
    py-8 sm:py-12 md:py-16
  "
>
  <div
    className="
      flex flex-nowrap overflow-x-auto no-scrollbar gap-6 
      max-w-[1200px] w-full px-2

      md:flex-wrap md:overflow-visible md:justify-between md:gap-10
    "
  >
    {categories.map((c, i) => (
      <div
        key={i}
        className="text-center flex-none md:flex-1 md:min-w-[140px] cursor-pointer"
        onClick={() => handleCategoryClick(c.name)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategoryClick(c.name);
          }
        }}
      >
        <img
          src={c.img}
          alt={c.name}
          className="
            w-[85px] h-[85px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]
            object-cover rounded-full border-[3px] border-[#b89396]
            transition-all duration-300 
            hover:scale-[1.05] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)]
            mx-auto
          "
        />
        <p
          className="
            mt-2 sm:mt-3 
            text-[14px] sm:text-[15px] md:text-[16px] 
            font-medium text-[#333]
            transition-colors hover:text-[#A37478]
          "
        >
          {c.name}
        </p>
      </div>
    ))}
  </div>
</section>
  );
};

export default CategoryStrip;
