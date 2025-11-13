import React from "react";
import cat1 from "../../assets/images/A-Casual.png";
import cat2 from "../../assets/images/A-Party Wear.png";
import cat3 from "../../assets/images/A-Formal Wear.png";
import cat4 from "../../assets/images/A-Daily Comfort.png";
import cat5 from "../../assets/images/A-Travel Essentials.png";
import cat6 from "../../assets/images/A-Dr Sole.png";

const categories = [
  { name: "Casual Wear", img: cat1 },
  { name: "Party Wear", img: cat2 },
  { name: "Formal Wear", img: cat3 },
  { name: "Daily Comfort", img: cat4 },
  { name: "Travel Essentials", img: cat5 },
  { name: "Dr. Sole", img: cat6 },
];

const CategoryStrip = () => (
  <section
    className="
      bg-white flex justify-center 
      px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 
      py-8 sm:py-12 md:py-16
    "
  >
    <div
      className="
        flex flex-wrap justify-between items-center gap-6 sm:gap-8 md:gap-10 
        max-w-[1200px] w-full
      "
    >
      {categories.map((c, i) => (
        <div
          key={i}
          className="text-center flex-1 min-w-[140px]"
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
            "
          >
            {c.name}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default CategoryStrip;
