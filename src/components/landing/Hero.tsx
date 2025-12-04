"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="space-y-2 text-center relative">
      <h1
        onClick={() => {
            window.location.href = "#about";
        }}
        className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-4xl md:text-5xl lg:text-6xl py-4 duration-1000 hover:cursor-pointer"
      >
        ryan zhang
      </h1>
      <div className="inline text-muted-foreground md:text-3xl text-center self-center tracking-tighter leading-relaxed">
        <span className="cycle-item">
            incoming software engineer intern at{' '}
          <Link
              href="https://www.microsoft.com/"
              target="_blank"
              className="inline-block transition-all duration-100 font-bold bg-gradient-to-r bg-clip-text text-transparent hover:brightness-125 hover:cursor-pointer px-1 pl-0 tracking-tighter"
          >
                <span className="text-[#F25022]" style={{
                    WebkitTextStroke: '3px black',
                    paintOrder: 'stroke fill'
                }}>mi</span>
                <span className="text-[#7FBA00]" style={{
                    WebkitTextStroke: '3px black',
                    paintOrder: 'stroke fill'
                }}>cr</span>
                <span className="text-[#00A4EF]" style={{
                    WebkitTextStroke: '3px black',
                    paintOrder: 'stroke fill'
                }}>os</span>
                <span className="text-[#FFB900]" style={{
                    WebkitTextStroke: '3px black',
                    paintOrder: 'stroke fill'
                }}>oft</span>
          </Link>
        </span>
      </div>
    </div>
  );
}
