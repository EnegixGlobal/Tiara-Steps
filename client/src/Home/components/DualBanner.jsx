import React from "react";
import dual1 from "../../assets/images/Dual-1.png";
import dual2 from "../../assets/images/Dual-2.png";

const DualBanner = () => {
  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 sm:py-6 md:py-8 lg:py-12">
      <div
        className="
          flex flex-wrap md:flex-nowrap justify-center items-center
          gap-4 sm:gap-6 md:gap-8
          overflow-hidden
        "
      >
        <img
          src={dual1}
          alt="Banner 1"
          className="
            w-full md:w-1/2 aspect-square rounded-lg md:rounded-xl
            object-cover transition-transform duration-300 ease-in-out
            hover:scale-[1.02]
          "
        />
        <img
          src={dual2}
          alt="Banner 2"
          className="
            w-full md:w-1/2 aspect-square rounded-lg md:rounded-xl
            object-cover transition-transform duration-300 ease-in-out
            hover:scale-[1.02]
          "
        />
      </div>
    </section>
  );
};

export default DualBanner;
