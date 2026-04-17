"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ResumeIcon() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/resume"
      aria-label="Download resume"
      className="flex items-center text-neutral-800 hover:text-black transition-all hover:scale-110"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="3 1 18 22"
        fill="currentColor"
        className="size-6"
      >
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 4h4v1.5h-4V13zm0 3h4v1.5h-4V16zm-2-6h2v1.5H9V10zm0 3h2v1.5H9V13zm0 3h2v1.5H9V16z" />
      </svg>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 18"
        className="h-3.5 w-3.5 text-emerald-600"
        initial={{ opacity: 0, x: -4 }}
        animate={{
          opacity: hovered ? 1 : 0,
          x: hovered ? 0 : -4,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <defs>
          <clipPath id="arrow-shape">
            <rect x="6" y="1" width="2" height="7" />
            <path d="M3 7.5L7 12L11 7.5" />
          </clipPath>
        </defs>
        <g clipPath="url(#arrow-shape)">
          <rect x="2" y="0" width="10" height="13" fill="currentColor" opacity={0.15} />
          <motion.rect
            x="2"
            width="10"
            height="13"
            fill="currentColor"
            animate={{ y: hovered ? ["0", "13", "0"] : "0" }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.1,
            }}
          />
        </g>
        <path
          d="M1 14.5L1 16C1 16.5 1.5 17 2 17L12 17C12.5 17 13 16.5 13 16L13 14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
    </a>
  );
}
