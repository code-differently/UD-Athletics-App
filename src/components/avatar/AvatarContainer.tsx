"use client"
import AvatarScene from "./AvatarScene";
import React, { useEffect, useState } from "react";

const AvatarContainer: React.FC = () => {
  const [isRotating, setIsRotating] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [disableMarkersInteraction, setDisableMarkersInteraction] = useState(false);

  
  const bodyParts = [
    { id: "head", name: "Head", position: { x: "50.4%", y: "15%" } },
    { id: "chest", name: "Chest", position: { x: "50%", y: "50%" } },
    { id: "left-arm", name: "Left Arm", position: { x: "33%", y: "50%" } },
    { id: "right-arm", name: "Right Arm", position: { x: "67%", y: "50%" } },
    { id: "left-leg", name: "Left Leg", position: { x: "40%", y: "70%" } },
    { id: "right-leg", name: "Right Leg", position: { x: "60%", y: "70%" } },
  ];
  

  const handleClick = (part: string) => {
    alert(`You clicked on ${part}`);
  };

  const resetAvatar = () => {
    setResetTrigger((prev) => prev + 1); // 🔹 Trigger marker reset
};

useEffect(() => {
    console.log("Reset Triggered:", resetTrigger);
    setShowMarkers(true);
}, [resetTrigger]);

  const handleRotate = (rotating: boolean) => {
    setIsRotating(rotating);
    if (rotating) {
      console.log("Rotation Started - Hiding Markers");
      setDisableMarkersInteraction(true);
      setShowMarkers(false); // Hide markers when rotating
  } else {
      console.log("Rotation Stopped");
      setDisableMarkersInteraction(false);
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
          id={`marker-${part.id}`}
          onClick={() => handleClick(part.name)}
          className="absolute bg-blue-500 rounded-full opacity-75 hover:opacity-100 transition cursor-pointer"
          style={{
            top: part.position.y,
            left: part.position.x,
            width: "15px",
            height: "15px",
            transform: "translate(-50%, -50%)",
            pointerEvents: disableMarkersInteraction ? 'none' : 'auto', // Disable interaction with markers when rotating
          }}
        >
          <span className="sr-only">{part.name}</span>
        </div>
      ))}

      {/* Reset Button */}
        <button onClick={resetAvatar} 
        className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-lg transition-all duration-300">Learn More!
        </button>
    </div>

  );
};

export default AvatarContainer;
