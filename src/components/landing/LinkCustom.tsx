"use client";

export default function LinkCustom({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-blue-700 md:text-xl sm:text-md flex-1 transition-all tracking-tighter hover:tracking-tight relative group"
      target="_blank"
      rel="noreferrer"
    >
      {label}
      <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-500 group-hover:w-full"></span>
    </a>
  );
}

