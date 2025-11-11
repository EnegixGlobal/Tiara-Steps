import { useEffect, useMemo, useRef, useState } from "react";
import image1 from "../Images/banner.webp";
import image2 from "../Images/banner2.webp";
import image3 from "../Images/banner3.webp";

const images = [image1, image2, image3];

const AUTO_PLAY_INTERVAL_MS = 3000;

const LandingBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const autoPlayRef = useRef(null);

  const total = useMemo(() => images.length, []);

  const goTo = (index) => {
    if (total === 0) return;
    const next = (index + total) % total;
    setCurrentIndex(next);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  useEffect(() => {
    if (isPaused || total === 0) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIdx) => (prevIdx + 1) % total);
    }, AUTO_PLAY_INTERVAL_MS);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, total]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  const onTouchStart = (e) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e) => {
    const startX = touchStartXRef.current;
    if (startX == null) return;
    const endX = e.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    const threshold = 40; // px
    if (delta > threshold) prev();
    if (delta < -threshold) next();
    touchStartXRef.current = null;
  };

  return (
      <section
        className="relative w-full overflow-hidden bg-transparent m-0 p-0 h-auto"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product showcase"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div className="w-full overflow-hidden relative">
          <div
            className="flex transition-transform duration-[600ms] ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, idx) => (
              <div key={idx} className="min-w-full grid place-items-center bg-transparent">
                <img
                  src={src}
                  alt="Carousel item"
                  loading="lazy"
                  className="w-full h-auto max-h-[75vh] object-cover select-none transition-transform duration-[1s] ease-in-out transition-opacity duration-[0.8s] ease-in-out hover:scale-[1.02] max-[1024px]:max-h-[60vh] max-[600px]:max-h-[45vh]"
                />
              </div>
            ))}
          </div>
        </div>
    
        {/* Navigation Buttons (Left & Right) */}
        <div
          className="absolute inset-0 flex items-center justify-between px-5 z-10"
          aria-label="Carousel controls"
        >
          {/* Prev Button */}
          <button
            className="w-[45px] h-[45px] grid place-items-center rounded-full bg-white/85 text-[#111] border border-black/15 cursor-pointer transition-all duration-300 ease-in-out text-[24px] font-semibold hover:bg-[#111] hover:text-white hover:border-[#111] hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-[1024px]:w-[38px] max-[1024px]:h-[38px] max-[1024px]:text-xl max-[600px]:w-[32px] max-[600px]:h-[32px] max-[600px]:text-lg"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
    
          {/* Next Button */}
          <button
            className="w-[45px] h-[45px] grid place-items-center rounded-full bg-white/85 text-[#111] border border-black/15 cursor-pointer transition-all duration-300 ease-in-out text-[24px] font-semibold hover:bg-[#111] hover:text-white hover:border-[#111] hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-[1024px]:w-[38px] max-[1024px]:h-[38px] max-[1024px]:text-xl max-[600px]:w-[32px] max-[600px]:h-[32px] max-[600px]:text-lg"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </section>
   
    
  );
};

export default LandingBanner;
