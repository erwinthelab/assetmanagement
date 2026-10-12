'use client';
import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder with same size during SSR to avoid layout shift
    return (
      <div className={`w-9 h-9 rounded-xl bg-white/10 ${className}`} aria-hidden="true" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 group ${
        isDark 
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700/60 shadow-sm' 
          : 'bg-white/20 hover:bg-white/30 text-white md:bg-white/15 md:hover:bg-white/25 border border-white/20 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun 
          size={19} 
          className={`transition-all duration-300 transform ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100 text-amber-400' 
              : '-rotate-90 scale-0 opacity-0 absolute'
          }`} 
        />
        {/* Moon Icon */}
        <Moon 
          size={19} 
          className={`transition-all duration-300 transform ${
            isDark 
              ? 'rotate-90 scale-0 opacity-0 absolute' 
              : 'rotate-0 scale-100 opacity-100 text-white'
          }`} 
        />
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
