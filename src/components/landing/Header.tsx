"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavLink from "@/components/landing/NavLink";

export default function Header() {
  const [isFixed, setIsFixed] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        setIsFixed(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        ref={placeholderRef}
        className="w-full"
        style={{ height: isFixed ? headerRef.current?.offsetHeight : 0 }}
      />

      <header
        ref={headerRef}
        className={`w-full z-50 ${isFixed ? "fixed top-0 left-0 right-0" : ""}`}
      >
        <div className="flex items-center justify-center gap-8 py-4 px-6 max-w-5xl mx-auto">
          <nav className="flex items-center gap-8">
            <NavLink href="#home" label="home" />
            <NavLink href="#about" label="about" />
            <NavLink href="#projects" label="projects" />
            <NavLink href="#contact" label="contact" />
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/in/rmzhang" target="_blank" rel="noreferrer">
              <Avatar className="size-8 scale-100 hover:scale-110 transition-all">
                <AvatarImage src="/statics/inlogo.png" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </a>
            <a href="https://github.com/rzhang57" target="_blank" rel="noreferrer">
              <Avatar className="size-8 scale-100 hover:scale-110 transition-all">
                <AvatarImage src="/statics/gitlogo.png" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}