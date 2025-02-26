"use client";
import { useState, useEffect } from "react";
import Header from "../components/header/Header";
import AvatarContainer from "../components/avatar/AvatarContainer";

export default function Page() {
  const [showHelp, setShowHelp] = useState(true);

  // Hide the help message automatically after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer); // Cleanup in case of unmount
  }, []);

  return (
    <main className="min-h-screen relative">
      <Header />
      <h1 className="text-4xl font-bold mb-8">Avatar Model Page</h1>
      <AvatarContainer />
    </main>
  );
}
