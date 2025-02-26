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
