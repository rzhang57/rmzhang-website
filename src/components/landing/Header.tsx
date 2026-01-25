"use client";

import NavLink from "@/components/landing/NavLink";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
      <header className="fixed left-0 top-0 h-full w-24 flex flex-col items-center justify-center z-10">
        <div className="flex flex-col items-center justify-center gap-16 h-full py-6">
          <nav className="flex flex-col gap-6">
            <NavLink href="#home" label="home" />
            <NavLink href="#about" label="about" />
            <NavLink href="#projects" label="projects" />
            <NavLink href="#contact" label="contact" />
          </nav>
          <div className="flex flex-col gap-4 items-center">
            <a
              href="https://linkedin.com/in/rmzhang"
              target="_blank"
              rel="noreferrer"
              className="text-xs border border-foreground/20 px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
            >
              in
            </a>
            <a
              href="https://github.com/rzhang57"
              target="_blank"
              rel="noreferrer"
              className="text-xs border border-foreground/20 px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
            >
              gh
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
  );
}
