"use client";

import AvatarScene from "./AvatarScene";
import React, { useEffect, useState } from "react";


const AvatarContainer: React.FC = () => {

  const bodyParts = [
    { name: "Head", position: { x: "50.4%", y: "15%" } },
    { name: "Chest", position: { x: "50%", y: "50%" } },
    { name: "Left Arm", position: { x: "33%", y: "50%" } },
    { name: "Right Arm", position: { x: "67%", y: "50%" } },
    { name: "Left Leg", position: { x: "40%", y: "70%" } },
    { name: "Right Leg", position: { x: "60%", y: "70%" } },
  ];

  const handleClick = (part: string) => {
    alert(`You clicked on ${part}`); 
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      <AvatarScene />

      {bodyParts.map((part, index) => (
        <div
          key={index} 
          onClick={() => handleClick(part.name)} 
          className="absolute bg-blue-500 rounded-full opacity-75 hover:opacity-100 transition cursor-pointer"
          style={{
            top: part.position.y,
            left: part.position.x,
            width: "15px",
            height: "15px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="sr-only">{part.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AvatarContainer;
