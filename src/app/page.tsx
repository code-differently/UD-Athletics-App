'use client' // Ensures this component runs on the client side in a Next.js app

import { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import AvatarContainer from '../components/avatar/AvatarContainer';

// Summary for Developers:
// This React component, Page, serves as the main structure for the avatar model page. 
// It includes a header, a title, and an avatar container. 
// The component utilizes the useState hook to control the visibility of a help message 
// and the useEffect hook to automatically hide it after 5 seconds using a timeout. 
// This approach ensures a smooth user experience by displaying the help temporarily.

// Summary for Non-Developers:
// This code builds a webpage that displays an avatar model. 
// It has a header at the top, a title, and a section where the avatar appears. 
// A help message appears when the page loads but disappears after 5 seconds to avoid clutter. 
// This makes sure users get guidance at the start but don’t get distracted afterward.

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
      {/* Render the header component */}
      <Header />

      {/* Page title */}
      <h1 className="text-4xl font-bold mb-8">Avatar Model Page</h1>

      {/* Render the avatar container component */}
      <AvatarContainer />

    </main>
  );
}
