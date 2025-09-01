"use client";

export default function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="tracking-tighter text-sm font-medium text-gray-900 hover:underline underline-offset-2"
    >
      {label}
    </a>
  );
}
