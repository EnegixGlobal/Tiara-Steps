import React from "react";

// ✅ Import local videos
import insta1 from "../../assets/image/insta-4.mp4";
import insta2 from "../../assets/image/insta-1.mp4";
import insta3 from "../../assets/image/insta-2.mp4";
import insta4 from "../../assets/image/insta-3.mp4";

const videos = [insta1, insta2, insta3, insta4];

const ReelsSection = () => (
  <section
    className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
      gap-10 sm:gap-5 
      p-4 sm:p-8 lg:p-10 xl:p-20
      bg-[#f8f8f8]
    "
  >
    {videos.map((src, i) => (
      <div
        key={i}
        className="
          w-full overflow-hidden rounded-xl shadow-md
          flex justify-center items-center
          max-[480px]:h-[500px] max-[480px]:rounded-2xl
        "
      >
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="
            w-full h-[260px] sm:h-80 lg:h-[360px] xl:h-[420px]
            object-cover rounded-lg
            transition-all duration-500 ease-in-out

            /* ✅ On phone → full width, vertical style */
            max-[480px]:w-[92vw] 
            max-[480px]:h-[95vh]
            max-[480px]:object-cover
            max-[480px]:rounded-2xl
          "
        />
      </div>
    ))}
  </section>
);

export default ReelsSection;
