import image3 from "../Images/shoe1.svg";
import image1 from "../Images/shoe2.svg";
import image2 from "../Images/shoe3.svg";
import image4 from "../Images/shoe4.svg";
import image5 from "../Images/shoe5.svg";
import React, { useState } from "react";

const Container = () => {
  const [activeBox, setActiveBox] = useState(null);

  // const boxes = [
  //   { id: 1, image: image4, color: "#e6e2d9" },
  //   { id: 2, image: image2, color: "#64aedd" },
  //   { id: 3, image: image1, color: "#42a3c7" },
  //   { id: 4, image: image2, color: "#295eb4" },
  //   { id: 5, image: image3, color: "#08214a" },
  // ];

  const boxes = [
    { id: 1, image: image1, color: "#FFC5D3" }, // pastel pink
    { id: 2, image: image2, color: "#FFB6A0" }, // peach coral
    { id: 3, image: image3, color: "#C8A2C8" }, // lavender
    { id: 4, image: image4, color: "#F7D794" }, // soft gold
    { id: 5, image: image5, color: "#FF8DA1" }, // rose pink
  ];


  const handleMouseEnter = (id) => {
    setActiveBox(id);
  };

  const handleMouseLeave = () => {
    setActiveBox(null);
  };

  return (
    <section className="New-Arrival">
      <div className="box1">
        {boxes.map((box) => (
          <div
            key={box.id}
            className={`box1-container${box.id} ${
              activeBox === box.id ? "slide-max" : ""
            } ${activeBox !== null && activeBox !== box.id ? "slide-min" : ""}`}
            onMouseEnter={() => handleMouseEnter(box.id)}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundColor: box.color }}
          >
            <img src={box.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Container;
