import React from "react";

// ✅ Import local videos
import insta1 from "../../assets/images/insta-4.mp4";
import insta2 from "../../assets/images/insta-1.mp4";
import insta3 from "../../assets/images/insta-2.mp4";
import insta4 from "../../assets/images/about page video.mp4";

const videos = [insta1, insta2, insta3, insta4];

const ReelsSection = () => (
  <section
    className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
      gap-10 sm:gap-5 
      p-4 sm:p-8 lg:p-10 xl:p-20
    "
  >
    {videos.map((src, i) => (
      <video
        key={i}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="
          w-full rounded-lg object-cover 
          h-[360px] sm:h-80 lg:h-[360px] xl:h-[420px]
        "
      />
    ))}
  </section>
);

export default ReelsSection;
