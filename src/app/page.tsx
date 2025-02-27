"use client";
import { useState, useEffect } from "react";
import AvatarContainer from "../components/avatar/AvatarContainer";

export default function Page() {
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer); 
  }, []);

  return (
    <main className="min-h-screen relative">
      <h1 className="text-4xl font-bold mb-8">Avatar Model Page</h1>
      <AvatarContainer />
    </main>
  );
}
