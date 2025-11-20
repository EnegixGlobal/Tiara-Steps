import React from "react";

import collection1 from "../../assets/images/A-Casual.png";
import collection2 from "../../assets/images/A-Party-Wear.png";
import collection3 from "../../assets/images/A-Formal-Wear.png";
import collection4 from "../../assets/images/A-Daily-Comfort.png";
import collection5 from "../../assets/images/A-Travel-Essentials.png";
import collection6 from "../../assets/images/A-Dr-Sole.png";

const collections = [
  { title: "Casual Wear", img: collection1 },
  { title: "Party Wear", img: collection2 },
  { title: "Formal Wear", img: collection3 },
  { title: "Daily Comfort", img: collection4 },
  { title: "Travel Essentials", img: collection5 },
  { title: "Dr Sole", img: collection6 },
];

const CollectionGrid = () => (
  <section
    className="
      bg-white 
      grid grid-cols-3
      gap-3 sm:gap-5 md:gap-7 xl:gap-[30px]
      px-2 sm:px-4 md:px-12 lg:px-20 xl:px-24 
      py-6 sm:py-12 md:py-16
      font-poppins
    "
  >
    {collections.map((item, i) => (
      <div key={i} className="text-center">
        <img
          src={item.img}
          alt={item.title}
          className="
            w-full object-cover rounded-lg
            h-[130px] xs:h-[160px] sm:h-[220px] md:h-[300px] lg:h-80 2xl:h-[360px]
            transition-transform duration-300 hover:scale-[1.02]
          "
        />
        <h3 className="mt-2 text-[14px] sm:text-[16px] font-semibold text-[#333]">
          {item.title}
        </h3>
      </div>
    ))}
  </section>
);

export default CollectionGrid;
