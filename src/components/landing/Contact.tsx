"use client";

import { useState } from "react";
import SectionHeading from "@/components/landing/SectionHeading";

const email = "ryanzhang@outlook.com";

const links = [
  { label: "github", href: "https://github.com/rzhang57" },
  { label: "linkedin", href: "https://linkedin.com/in/rmzhang" },
  { label: "resume", href: "/resume" },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rise">
      <SectionHeading>contact</SectionHeading>

      <button
        onClick={copy}
        className="group flex w-full items-baseline justify-between gap-4 rounded-[5px] border border-rule bg-paper/40 px-4 py-4 text-left"
      >
        <span className="text-[15px] text-ink">{email}</span>
        <span className="text-[15px] text-faint transition-colors group-hover:text-muted">
          {copied ? "copied" : "copy"}
        </span>
      </button>

      <ul className="mt-10">
        {links.map((link) => (
          <li key={link.label} className="border-b border-rule">
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="row group flex items-baseline justify-between gap-4 py-4 text-[15px]"
            >
              <span className="transition-transform group-hover:translate-x-1">
                {link.label}
              </span>
              <span className="text-faint transition-colors group-hover:text-muted">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="aside mt-10">i reply to just about everything.</p>
    </div>
  );
}
