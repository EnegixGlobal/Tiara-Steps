import React from "react";

import insta1 from "../../assets/image/insta-4.mp4";
import insta2 from "../../assets/image/insta-1.mp4";
import insta3 from "../../assets/image/insta-2.mp4";
import insta4 from "../../assets/image/about page video.mp4";

const videos = [insta1, insta2, insta3, insta4];

const ReelsSection = () => (
  <section
    className="
      bg-[#f8f8f8] 
      p-4 sm:p-8 lg:p-10 xl:p-20
    "
  >

    {/* DESKTOP — same as before */}
    <div
      className="
        hidden                   /* hide on mobile */
        sm:grid                 /* show from sm and above */
        grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4
        gap-10 sm:gap-5
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
            w-full h-[260px] sm:h-80 lg:h-[360px] xl:h-[420px]
            rounded-xl object-cover shadow-md
          "
        />
      ))}
    </div>

    {/* MOBILE — horizontal scroll row */}
    <div
      className="
        flex             /* row layout */
        sm:hidden        /* hide on tablet/desktop */
        gap-4
        overflow-x-auto
        scrollbar-hide
        pb-3
      "
    >
      {videos.map((src, i) => (
        <div
          key={i}
          className="
            min-w-[75%]          /* size for mobile */
            h-[380px]
            rounded-xl
            overflow-hidden
            shadow-md
            flex-shrink-0
          "
        >
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      ))}
    </div>

  </section>
);

export default ReelsSection;
