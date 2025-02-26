import React from "react";
import './globals.css'; // Import global CSS styles
import { Inter } from "next/font/google"; // Import the Inter font from Google Fonts
import type { Metadata } from "next"; // Import Metadata type from Next.js

// Summary for Developers:
// This is the RootLayout component, which serves as the main layout for a Next.js application. 
// It applies global styles, sets up metadata (title and description), and wraps all page content. 
// The Inter font is imported and applied to the body. 
// This component ensures consistency across all pages and provides essential HTML structure.

// Summary for Non-Developers:
// This code helps create the overall structure of a webpage. 
// It defines a common layout, including styles, fonts, and metadata (like the page title and description). 
// It makes sure every page in the app has a uniform look and works well on different devices.

const inter = Inter({ subsets: ["latin"] });

// Define metadata for the page, including the title and description
export const metadata: Metadata = {
  title: "Avatar Model Page",
  description: "Interact with the avatar to learn more",
};

// RootLayout component wraps all pages, ensuring a consistent structure
export default function RootLayout({
  children, // Represents the content inside each page
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta tag to ensure responsive design on different screen sizes */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add more meta tags here if needed */}
      </head>
      <body className={inter.className}>
        {/* Render the page's content inside the body */}
        {children}
      </body>
    </html>
  );
}
