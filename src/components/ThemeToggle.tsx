"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        className="border border-foreground/20 px-2 py-1 text-xs"
        aria-label="Toggle theme"
      >
        ...
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="border border-foreground/20 px-2 py-1 text-xs hover:bg-foreground hover:text-background transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
