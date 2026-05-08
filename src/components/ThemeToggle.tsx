"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration - only render after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-16 h-8 px-1 rounded-full transition-colors duration-300 bg-border hover:bg-border/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {/* Sliding Thumb */}
      <div
        className={`absolute left-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {/* Icon */}
        {isDark ? (
          <Moon size={16} className="text-background" />
        ) : (
          <Sun size={16} className="text-background" />
        )}
      </div>
    </button>
  );
}
