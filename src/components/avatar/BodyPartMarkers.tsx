"use client";

import React, { useEffect, useState } from "react";

const bodyParts = [
  { name: "Head", position: { x: "-26%", y: "28%" } },
  { name: "Chest", position: { x: "-17%", y: "27%" } },
  { name: "Torso", position: { x: "-15%", y: "27%" } },
  { name: "Left Shoulder", position: { x: "-18%", y: "34%" } },
  { name: "Right Shoulder", position: { x: "-18%", y: "20%" } },
  { name: "Left Elbow", position: { x: "-15%", y: "35%" } },
  { name: "Right Elbow", position: { x: "-15%", y: "20%" } },
  { name: "Left Hand", position: { x: "-12%", y: "40%" } },
  { name: "Right Hand", position: { x: "-12%", y: "15%" } },
  { name: "Left Knee", position: { x: "-10.5%", y: "33%" } },
  { name: "Right Knee", position: { x: "-10.5%", y: "22%" } },
  { name: "Left Ankle", position: { x: "-7%", y: "33%" } },
  { name: "Right Ankle", position: { x: "-7%", y: "21%" } },
];


const BodyPartMarkers: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the window size

    return () => {
        window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleClick = (part: string) => {
    alert(`You clicked on ${part}`);
  };

  return (
    <div className="relative w-full h-full">
      {bodyParts.map((part, index) => {
        const {x, y } = part.position;

        const left = (parseFloat(x) / 100) * windowSize.width;
        const top = (parseFloat(y) / 100) * windowSize.height;
         //for smaller screens
        const markerSize = windowSize.width < 600 ? "w-1 h-2" : "w-2 h-2";

    return (
        <div
          key={index}
          onClick={() => handleClick(part.name)}
          className="absolute ${markerSize} bg-blue-500 rounded-full cursor-pointer opacity-75 hover:opacity-100 transition pointer-events-auto"
          style={{
            top: `${left}px`,
            left: `${top}px`
          }}
        >
          <span className="sr-only">{part.name}</span>
        </div>
         );
      })}
    </div>
  );
};

export default BodyPartMarkers;

