import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Avatar Model Page",
  description: "Interact with the avatar to learn more",
};

/**
 * The root layout for all pages.
 */
export default function RootLayout({
  children, 
}: {
  children: React.ReactNode; 
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
