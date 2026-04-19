import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Love Memory Space",
  description:
    "Private couple memory web app built with Next.js and Supabase to store photos, videos, milestones, journals and anniversaries."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
