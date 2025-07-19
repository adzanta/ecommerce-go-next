"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import WaveLoader from "@/components/WaveLoader";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthGuard>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <WaveLoader />
            </div>
          ) : (
            <>
              {children}
              <Footer />
            </>
          )}
        </AuthGuard>
      </body>
    </html>
  );
}
