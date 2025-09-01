"use client";

import Link from "next/link";

export default function Hero() {

  return (
    <div className="space-y-2 text-center relative">
      <h1
        onClick={() => {
            window.location.href = "#about";
        }}
        className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-6xl py-4 duration-1000 hover:cursor-pointer"
      >
        ryan zhang
      </h1>
      <div className="inline text-muted-foreground md:text-3xl text-center self-center tracking-tighter leading-relaxed">
        previous swe intern at{'  '}
        <Link
          href="https://www.planview.com/"
          target="_blank"
          className="inline-block transition-all duration-100 font-bold text-foreground underline-offset-4 hover:underline px-1 pl-0"
        >
          planview
        </Link>
      </div>
    </div>
  );
}
