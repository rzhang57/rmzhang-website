"use client";

import { useState } from "react";
import SectionHeading from "@/components/landing/SectionHeading";
import content from "@/data/content.v2.json";

export default function HobbiesSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rise">
      <SectionHeading>hobbies</SectionHeading>

      <div className="flex flex-wrap gap-x-1.5 gap-y-2">
        {content.hobbies.map((hobby, i) => (
          <button
            key={hobby.name}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`rounded-[4px] px-2 py-1 text-[15px] transition-colors duration-200 ${
              selected === i
                ? "bg-ink/[0.06] text-ink"
                : "text-faint hover:text-ink"
            }`}
          >
            {hobby.name}
          </button>
        ))}
      </div>

      <div className="mt-7 min-h-[5rem] border-t border-rule pt-5">
        {selected === null ? (
          <p className="aside">pick one.</p>
        ) : (
          <p className="text-[15px] leading-relaxed text-muted">
            {content.hobbies[selected].note}
          </p>
        )}
      </div>
    </div>
  );
}
