import React from "react";
import videoBanner from "../../assets/images/videoBanner.mp4";

const VideoBanner = () => (
  <section
    className="
      w-full overflow-hidden flex justify-center items-center 
      bg-black
    "
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      className="
        w-full h-auto object-cover block
        max-h-[200px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[600px]
      "
    >
      <source src={videoBanner} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </section>
);

export default VideoBanner;
