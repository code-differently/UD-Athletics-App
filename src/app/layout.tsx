import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO and page descriptions
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
