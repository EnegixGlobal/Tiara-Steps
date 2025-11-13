import React from "react";
import { FiHeart } from "react-icons/fi";

import product1 from "../../assets/images/Bestsel-1.jpg";
import product2 from "../../assets/images/Bestsel-2.jpg";
import product3 from "../../assets/images/Bestsel-3.jpg";
import product4 from "../../assets/images/Bestsel-4.jpg";
import product5 from "../../assets/images/Bestsel-5.jpg";
import product6 from "../../assets/images/Bestsel-6.jpg";

const products = [
  { img: product1, name: "Crystal Heel Sandal", price: "₹3,499" },
  { img: product2, name: "Glitter Pump", price: "₹2,999" },
  { img: product3, name: "Elegant Stiletto", price: "₹4,199" },
  { img: product4, name: "Party Flats", price: "₹1,899" },
  { img: product5, name: "Pearl Loafers", price: "₹3,299" },
  { img: product6, name: "Evening Wedges", price: "₹3,999" },
];

const Bestsellers = () => (
  <section className="text-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-16 bg-[#fdfdfd] font-poppins">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
      Bestsellers to light up your Party wardrobe.
    </h2>

    {/* Grid Section */}
    <div
      className="
        grid gap-5 mt-8 mb-6 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        xl:grid-cols-4 2xl:grid-cols-6
        items-start
      "
    >
      {products.map((p, i) => (
        <div key={i} className="text-left relative group">
          {/* Image Box */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={p.img}
              alt={p.name}
              className="
                w-full object-cover transition-all duration-300 
                h-[300px] sm:h-[220px] md:h-60 lg:h-[280px] xl:h-80
                group-hover:scale-[1.03]
              "
            />
            <FiHeart
              className="
                absolute top-2.5 right-2.5 text-gray-800 
                bg-white/90 rounded-full p-1.5 text-[20px]
                hover:text-[#b89396] transition-all duration-300
              "
            />
          </div>

          {/* Product Text */}
          <h4 className="mt-2 text-[16px] font-semibold text-gray-800">
            {p.name}
          </h4>
          <p className="text-[15px] text-gray-500">{p.price}</p>
        </div>
      ))}
    </div>

    {/* Button */}
    <button
      className="
        bg-[#b89396] text-white text-[15px] font-medium
        px-8 py-2.5 rounded-full mt-4
        hover:bg-[#a77f83] transition-all duration-300
        w-full sm:w-auto sm:px-10
      "
    >
      View All Products
    </button>
  </section>
);

export default Bestsellers;
