import React, { useState, useEffect } from "react";
import banner1 from "../../assets/image/hero-banner1.png";
import banner2 from "../../assets/image/hero-banner2.png";
import banner3 from "../../assets/image/hero-banner3.png";

const slides = [banner1, banner2, banner3];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div
      className="
        relative w-full overflow-hidden
        bg-black
        aspect-[16/8]        /* Mobile: adjust height via ratio */
        sm:aspect-[21/9]     /* Tablet */
        md:aspect-[70/40]    /* Medium screens */
        lg:h-[90vh]          /* Desktop: fixed height */
      "
    >
      {/* ✅ Slides */}
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

      {/* ✅ Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="
          absolute top-1/2 left-4 -translate-y-1/2 z-10
          bg-white/30 text-[#b89396]
          w-[42px] h-[42px] sm:w-[36px] sm:h-[36px] max-[480px]:w-[30px] max-[480px]:h-[30px]
          flex items-center justify-center rounded-full text-[1.5rem]
          transition-all duration-300 hover:bg-[#b89396] hover:text-white
        "
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="
          absolute top-1/2 right-4 -translate-y-1/2 z-10
          bg-white/30 text-[#b89396]
          w-[42px] h-[42px] sm:w-[36px] sm:h-[36px] max-[480px]:w-[30px] max-[480px]:h-[30px]
          flex items-center justify-center rounded-full text-[1.5rem]
          transition-all duration-300 hover:bg-[#b89396] hover:text-white
        "
      >
        ❯
      </button>

      {/* ✅ Dots */}
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

export default HeroSlider;
