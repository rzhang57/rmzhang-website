"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavLink from "@/components/landing/NavLink";

export default function Header() {
  return (
      <header className="fixed left-0 top-0 h-full w-24 flex flex-col items-center justify-center z-10">
        <div className="flex flex-col items-center justify-center gap-16 py-8 px-4 border border-black bg-white/80">
          <nav className="flex flex-col gap-6">
            <NavLink href="#home" label="home" />
            <NavLink href="#about" label="about" />
            <NavLink href="#projects" label="projects" />
            <NavLink href="#contact" label="contact" />
          </nav>
          <div className="flex flex-col gap-4 items-center">
            <a href="https://linkedin.com/in/rmzhang" target="_blank" rel="noreferrer">
              <Avatar className="size-8 hover:scale-110 transition-transform border-0">
                <AvatarImage src="/statics/inlogo.png" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </a>
            <a href="https://github.com/rzhang57" target="_blank" rel="noreferrer">
              <Avatar className="hover:scale-110 transition-transform border-0">
                <AvatarImage src="/statics/gitlogo.png" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </a>
          </div>
        </div>
      </header>
  );
}