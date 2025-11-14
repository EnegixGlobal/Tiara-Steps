import React, { useState, useEffect } from "react";

// ✅ Import banner images
import mid1 from "../../assets/image/ban-1.png";
import mid2 from "../../assets/image/ban-2.png";
import mid3 from "../../assets/image/ban-3.png";
import mid4 from "../../assets/image/mid-ban4.png";

const slides = [mid1, mid2, mid3, mid4];

const MidBannerSlider = () => {
  const [current, setCurrent] = useState(0);

  // ⏱️ Auto-slide every 4s
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  // ⬅️ & ➡️ Controls
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div
      className="
        relative overflow-hidden
        w-screen md:w-full sm:w-full
        aspect-[16/6]        /* Mobile */
        sm:aspect-[21/9]     /* Tablet */
        md:aspect-[70/40]    /* Medium screens */
        lg:h-[80vh]          /* Desktop fixed height */
        bg-black rounded-none
      "
    >
      {/* 🖼️ Slides */}
      {slides.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={img}
            alt={`slide-${index}`}
            className="w-full h-full object-cover block"
          />
        </div>
      ))}

      {/* ⬅️ Prev Button */}
      <button
        onClick={prevSlide}
        className="
          absolute top-1/2 left-4 -translate-y-1/2 z-10
          bg-white/30 text-[#b89396]
          w-[42px] h-[42px] sm:w-[36px] sm:h-[36px] max-[480px]:w-[32px] max-[480px]:h-[32px]
          flex items-center justify-center rounded-full text-[1.6rem]
          transition-all duration-300 hover:bg-[#b89396] hover:text-white
        "
      >
        ❮
      </button>

      {/* ➡️ Next Button */}
      <button
        onClick={nextSlide}
        className="
          absolute top-1/2 right-4 -translate-y-1/2 z-10
          bg-white/30 text-[#b89396]
          w-[42px] h-[42px] sm:w-[36px] sm:h-[36px] max-[480px]:w-[32px] max-[480px]:h-[32px]
          flex items-center justify-center rounded-full text-[1.6rem]
          transition-all duration-300 hover:bg-[#b89396] hover:text-white
        "
      >
        ❯
      </button>

      {/* ⚪ Dots Indicator */}
      <div
        className="
          absolute left-1/2 bottom-6 sm:bottom-5 max-[480px]:bottom-3
          -translate-x-1/2 flex gap-2 sm:gap-2.5
          bg-black/30 px-3 py-2 rounded-full
        "
      >
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              i === current
                ? "bg-[#b89396] scale-125"
                : "bg-white/60 hover:bg-white/80"
            } w-2.5 h-2.5 sm:w-2 sm:h-2`}
          />
        ))}
      </div>
    </div>
  );
};

export default MidBannerSlider;
