// "use client" tells the system that this code should run in the browser, where users can interact with it.
"use client";
// Importing the AvatarScene component to display the 3D model.
import AvatarScene from "./AvatarScene";
import React, { useEffect, useState } from "react";

// The main function that holds everything for this avatar feature. 
const AvatarContainer: React.FC = () => {
  // Here we're creating a list of body parts (like the head, arms, and legs) with their names and where they should appear on the screen.
  // The "position" shows where to place each body part on the screen (using percentages of the total space).
  const bodyParts = [
    { name: "Head", position: { x: "50.4%", y: "15%" } },
    { name: "Chest", position: { x: "50%", y: "50%" } },
    { name: "Left Arm", position: { x: "33%", y: "50%" } },
    { name: "Right Arm", position: { x: "67%", y: "50%" } },
    { name: "Left Leg", position: { x: "40%", y: "70%" } },
    { name: "Right Leg", position: { x: "60%", y: "70%" } },
  ];

  // Function that runs when a body part is clicked.
  // It pops up a message (alert) with the name of the clicked body part
  const handleClick = (part: string) => {
    alert(`You clicked on ${part}`); // Example: "You clicked on Head"
  };

  return (
    // This container holds everything, including the 3D model and the clickable markers.
    <div className="relative w-[300px] h-[300px]">
      {/* This is where the 3D avatar is displayed */}
      <AvatarScene />

      {/* This loop goes through all the body parts and places a clickable dot on each one. */}
      {bodyParts.map((part, index) => (
        <div
          key={index} // A unique key for React to track each element
          onClick={() => handleClick(part.name)} // Clicking a dot triggers the handleClick function
          className="absolute bg-blue-500 rounded-full opacity-75 hover:opacity-100 transition cursor-pointer"
          style={{
            top: part.position.y, // Position from the top of the container
            left: part.position.x, // Position from the left of the container
            width: "15px", // Size of the dot
            height: "15px",
            transform: "translate(-50%, -50%)", // Centers the dot on the body part
          }}
        >
          {/* This is hidden text for screen readers, improving accessibility */}
          <span className="sr-only">{part.name}</span>
        </div>
      ))}
    </div>
  );
};

// "export default" makes components available for use in other parts of the app.
// you'll see it those two appear in other components 
export default AvatarContainer;
