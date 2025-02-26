import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// Define metadata for the page, including the title and description
export const metadata: Metadata = {
  title: "Avatar Model Page",
  description: "Interact with the avatar to learn more",
};

// RootLayout component serves as the foundation for all pages,  
// ensuring they have a consistent structure and layout 
export default function RootLayout({
  children, // Represents the actual content of each page that this layout wraps
}: {
  children: React.ReactNode; // This tells TypeScript that 'children' can be any valid React element(s)  
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta tag to ensure responsive design on different screen sizes */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add more meta tags here if needed */}
      </head>
      <body className={inter.className}>
         {/* This is where the content of each page will be displayed */}
        {children}
      </body>
    </html>
  );
}
