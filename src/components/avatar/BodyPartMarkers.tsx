"use client";

import React, { useEffect, useState } from "react";

const bodyParts = [
  { name: "Head", position: { x: "50%", y: "18%" } },
  { name: "Neck", position: { x: "50%", y: "25%" } },
  { name: "Chest", position: { x: "50%", y: "35%" } },
  { name: "Torso", position: { x: "50%", y: "50%" } },
  { name: "Left Shoulder", position: { x: "40%", y: "30%" } },
  { name: "Right Shoulder", position: { x: "60%", y: "30%" } },
  { name: "Left Elbow", position: { x: "35%", y: "45%" } },
  { name: "Right Elbow", position: { x: "65%", y: "45%" } },
  { name: "Left Hand", position: { x: "30%", y: "60%" } },
  { name: "Right Hand", position: { x: "70%", y: "60%" } },
  { name: "Left Knee", position: { x: "45%", y: "75%" } },
  { name: "Right Knee", position: { x: "55%", y: "75%" } },
  { name: "Left Ankle", position: { x: "43%", y: "90%" } },
  { name: "Right Ankle", position: { x: "150%", y: "50%" } },
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
    return (
        <div
          key={index}
          onClick={() => handleClick(part.name)}
          className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer opacity-75 hover:opacity-100 transition pointer-events-auto :active:bg-yellow-500"
          style={{
            top: `${left}px`,
            left: `${top}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 80,
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

