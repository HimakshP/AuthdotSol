import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthdotSol - Solana Authentication SDK",
  description:
    "Put your Solana Identity to use. Onboard Solana users to your website with our one line SDK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
