"use client";

export default function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="relative group tracking-tighter text-sm font-medium text-foreground transition-all hover:tracking-tight w-fit"
    >
      {label}
      <span className="block absolute bottom-0 left-0 w-0 h-[1px] bg-foreground transition-all duration-500 group-hover:w-full"></span>
    </a>
  );
}
