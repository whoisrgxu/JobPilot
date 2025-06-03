
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./specialStyling.css";
import NavMenu from '@/components/NavMenu';
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPilot - AI-Powered Cover Letter Generator",
  description: "Instantly create personalized cover letters with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <div className="min-h-screen bg-[#faf6f6] dark:bg-[#0a0a0a] transition-colors duration-300">
          <NavMenu />
          {children}
          <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
