"use client";

export default function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="tracking-tighter text-sm font-medium text-black hover:underline w-fit"
    >
      {label}
    </a>
  );
}

