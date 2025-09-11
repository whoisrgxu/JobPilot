
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./specialStyling.css";
import NavMenu from '@/components/NavMenu';
import Footer from "@/components/Footer";
import InactivityWrapper from '@/components/InactivityWrapper'
import ClientHydrate from '@/components/ClientHydrate';
import DatadogRumProvider from "@/components/DatadogRumProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPilot - AI-Powered Resume-to-Job Fit Analyzer",
  description: "Instantly check your resume against any job description with AI. Get personalized feedback and improve your chances of landing the job.",
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
         {/* Initialize Datadog RUM here */}
        <DatadogRumProvider />

        <InactivityWrapper>
          <ClientHydrate />
          <main>
            <div className="min-h-screen bg-[#faf6f6] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
              <NavMenu />
              {children}
              <Footer />
            </div>
          </main>
        </InactivityWrapper>
      </body>
    </html>
  );
}
