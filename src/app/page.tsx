"use client";
import { useState, useEffect } from "react";
import Header from "../components/header/Header";
import AvatarContainer from "../components/avatar/AvatarContainer";

export default function Page() {
  // State to control the visibility of the help message
  const [showHelp, setShowHelp] = useState(true);

  // useEffect runs once when the component mounts and sets a timer to hide the help message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false);
    }, 5000);

    // Cleanup function to clear the timer if the component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-8">Avatar Model Page</h1>

      {/* Render the avatar container component */}
      <AvatarContainer />
    </main>
  );
}
