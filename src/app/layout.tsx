import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, QrCode, PlusCircle } from "lucide-react";
import { AssetProvider } from "@/lib/AssetContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asset Management & Tracking System",
  description: "PWA Asset tracking for internal branch",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900 pb-16 md:pb-0 pt-14 md:pt-0`}>
        {/* Desktop Header / Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-blue-600 text-white flex items-center px-4 shadow-md z-50 md:static md:h-16">
          <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
            <Link href="/" className="font-bold text-lg tracking-tight">The Lab Kelapa Gading - AMTC</Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-blue-200 transition">Dashboard</Link>
              <Link href="/scanner" className="hover:text-blue-200 transition">Scan QR</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 md:py-8 w-full">
          <AssetProvider>
            {children}
          </AssetProvider>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link href="/" className="flex flex-col items-center text-slate-500 hover:text-blue-600">
            <Home size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link href="/scanner" className="flex flex-col items-center text-slate-500 hover:text-blue-600">
            <div className="bg-blue-600 text-white p-3 rounded-full -mt-6 shadow-lg shadow-blue-200">
              <QrCode size={24} />
            </div>
            <span className="text-xs mt-1 font-medium">Scan</span>
          </Link>
          <Link href="/report" className="flex flex-col items-center text-slate-500 hover:text-blue-600">
            <PlusCircle size={24} />
            <span className="text-xs mt-1 font-medium">Report</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
