"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavLink from "@/components/landing/NavLink";

export default function Header() {
  return (
    <header className="w-full sticky top-0 bg-gray-50 bg-opacity-0 z-10">
      <div className="px-6 py-6 h-14 flex items-center justify-between max-w-xl mx-auto">
        <nav className="flex gap-4 sm:gap-6 items-center">
          <NavLink href="#home" label="home" />
          <NavLink href="#about" label="about" />
          <NavLink href="#projects" label="projects" />
          <NavLink href="#contact" label="contact" />
        </nav>
        <div className="flex gap-3 justify-between items-center ml-auto">
          <a href="https://linkedin.com/in/rmzhang" target="_blank" rel="noreferrer">
            <Avatar className="size-8">
              <AvatarImage src="/statics/inlogo.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </a>

          <a href="https://github.com/rzhang57" target="_blank" rel="noreferrer">
            <Avatar>
              <AvatarImage src="/statics/gitlogo.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>
    </header>
  );
}
