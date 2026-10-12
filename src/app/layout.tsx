import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, QrCode, PlusCircle } from "lucide-react";
import { AssetProvider } from "@/lib/AssetContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asset Management & Tracking System",
  description: "PWA Asset tracking for internal branch",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

// Inline script to prevent theme flash (FOUC)
const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('amtc-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 pb-16 md:pb-0 pt-14 md:pt-0 transition-colors duration-200 antialiased`}>
        <ThemeProvider>
          {/* Desktop Header / Mobile Header */}
          <header className="fixed top-0 left-0 right-0 h-14 bg-blue-600 dark:bg-slate-900 text-white flex items-center px-4 shadow-md dark:shadow-slate-950/50 border-b border-transparent dark:border-slate-800 z-50 md:static md:h-16 transition-colors duration-200">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
              <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-90 transition">
                The Lab Kelapa Gading - AMTC
              </Link>
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex gap-6 items-center">
                  <Link href="/" className="hover:text-blue-200 dark:hover:text-blue-400 font-medium transition text-sm">
                    Booking
                  </Link>
                  <Link href="/dashboard" className="hover:text-blue-200 dark:hover:text-blue-400 font-medium transition text-sm">
                    Dashboard
                  </Link>
                  <Link href="/maintenance" className="hover:text-blue-200 dark:hover:text-blue-400 font-medium transition text-sm">
                    Maintenance
                  </Link>
                  <Link href="/scanner" className="hover:text-blue-200 dark:hover:text-blue-400 font-medium transition text-sm">
                    Scan QR
                  </Link>
                </nav>
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto p-4 md:py-8 w-full">
            <AssetProvider>
              {children}
            </AssetProvider>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-200">
            <Link href="/" className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Home size={22} />
              <span className="text-[11px] mt-1 font-medium">Home</span>
            </Link>
            <Link href="/scanner" className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <div className="bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full -mt-6 shadow-lg shadow-blue-300 dark:shadow-blue-950">
                <QrCode size={22} />
              </div>
              <span className="text-[11px] mt-1 font-medium">Scan</span>
            </Link>
            <Link href="/report" className="flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <PlusCircle size={22} />
              <span className="text-[11px] mt-1 font-medium">Report</span>
            </Link>
          </nav>
        </ThemeProvider>
      </body>
    </html>
  );
}
