import React from "react";

import collection1 from "../../assets/images/collection-1.jpg";
import collection2 from "../../assets/images/collection-2.jpg";
import collection3 from "../../assets/images/collection-3.jpg";
import collection4 from "../../assets/images/collection-4.jpg";

const collections = [
  { title: "The Wedding Edit", img: collection1 },
  { title: "Festive Collection", img: collection2 },
  { title: "Timeless Embroidery", img: collection3 },
  { title: "Pearl Touch", img: collection4 },
  { title: "Party Glam", img: collection1 },
  { title: "Daily Bling", img: collection2 },
];

const CollectionGrid = () => (
  <section
    className="
      bg-white 
      grid 
      gap-5 md:gap-7 xl:gap-[30px] 
      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
      px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 
      py-8 sm:py-12 md:py-16
      font-poppins
    "
  >
    {collections.map((item, i) => (
      <div key={i} className="text-center">
        <img
          src={item.img}
          alt={item.title}
          className="
            w-full object-cover rounded-lg sm:rounded-[10px]
            h-[200px] sm:h-[220px] md:h-[300px] lg:h-80 2xl:h-[360px]
            transition-transform duration-300 hover:scale-[1.02]
          "
        />
        <h3 className="mt-2 text-[15px] sm:text-[16px] font-semibold text-[#333]">
          {item.title}
        </h3>
      </div>
    ))}
  </section>
);

export default CollectionGrid;
