"use client"
import AvatarScene from "./AvatarScene";
import React, { useEffect, useState } from "react";

const AvatarContainer: React.FC = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0);
  
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

  const resetAvatar = () => {
    setResetTrigger((prev) => prev + 1); // 🔹 Trigger marker reset
};

// 🔹 Effect: Show markers when resetTrigger updates
useEffect(() => {
    console.log("Reset Triggered:", resetTrigger);
    setShowMarkers(true);
}, [resetTrigger]);

  const handleRotate = (rotating: boolean) => {
    setIsRotating(rotating);
    if (rotating) {
      console.log("Rotation Started - Hiding Markers");
      setShowMarkers(false); // Hide markers when rotating
  } else {
      console.log("Rotation Stopped - Showing Markers");
      setTimeout(() => setShowMarkers(true), 1000); // Show after rotation stops
  }
};

  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Avatar Scene (3D Model) */}
      <AvatarScene 
      onRotate={handleRotate}
      resetTrigger={resetTrigger}
      />

       {/* Overlay clickable markers */}
       { showMarkers && 
       bodyParts.map((part, index) => (
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

      {/* Reset Button */}
        <button onClick={resetAvatar} className="mt-4 p-2 bg-gray-800 text-white rounded">Learn More!</button>
    </div>

  );
};

export default AvatarContainer;
