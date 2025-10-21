// import { useEffect, useRef } from "react";
// import image from "../Images/MAIN-SECTION.svg";

// const LandingBanner = () => {
//   const bannerRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("visible");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     if (bannerRef.current) {
//       observer.observe(bannerRef.current);
//     }

//     return () => {
//       if (bannerRef.current) {
//         observer.unobserve(bannerRef.current);
//       }
//     };
//   }, []);

//   return (
//     <section className="main-Container" ref={bannerRef}>
//       <p className="p1">THE NEW {new Date().getFullYear()}</p>
//       <p className="p2">HIGH HEEL</p>
//       <div className="main-img-cont">
//         <img 
//           className="main-img" 
//           src={image} 
//           alt="Stylish high heel shoe for 2025 collection" 
//           loading="lazy"
//         />
//         <p className="p3">
//           <span>UNWRAP</span>
//           <span> POSSIBILITIES</span>
//         </p>
//       </div>
//       <p className="p4">UNWRAP POSSIBILITIES</p>
//     </section>
//   );
// };

// export default LandingBanner;

import { useState, useEffect, useRef } from "react";
import image1 from "../Images/MAIN-SECTION.svg";
// Add more images
import image2 from "../Images/shoe2.svg";
import image3 from "../Images/shoe3.svg";
import image4 from "../Images/shoe4.svg";
import image5 from "../Images/shoe5.svg";

const carouselImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
];

const LandingBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <section className="main-Container" ref={bannerRef}>
      <p className="p1">THE NEW {new Date().getFullYear()}</p>
      <p className="p2">HIGH HEEL</p>
      
      <div className="main-img-cont">
        <div className="carousel-wrapper">
          <div className="carousel-container">
            {/* <button 
              className="carousel-nav prev" 
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              ‹
            </button> */}
            
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselImages.map((img, index) => (
                <div key={index} className="carousel-slide">
                  <img 
                    className="main-img" 
                    src={img} 
                    alt=''
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* <button 
              className="carousel-nav next" 
              onClick={goToNext}
              aria-label="Next slide"
            >
              ›
            </button> */}
          </div>

          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="p3">
          <span>UNWRAP</span>
          <span> POSSIBILITIES</span>
        </p>
      </div>
      
      <p className="p4">UNWRAP POSSIBILITIES</p>
    </section>
  );
};

export default LandingBanner;
