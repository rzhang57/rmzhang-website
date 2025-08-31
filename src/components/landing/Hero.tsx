"use client";

import { useState } from "react";
import Confetti from "react-confetti";
import Link from "next/link";

export default function Hero() {
  const [recycleConfetti, setRecycleConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function handleNameClick() {
    setShowConfetti(true);
    setRecycleConfetti(true);
    setTimeout(() => setRecycleConfetti(false), 500);
  }

  return (
    <div className="space-y-2 text-center relative">
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth - 17 : 0}
          height={typeof window !== "undefined" ? window.innerHeight + 100 : 0}
          recycle={recycleConfetti}
          numberOfPieces={100}
        />
      )}
      <h1
        onClick={handleNameClick}
        className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-6xl py-4 duration-1000 hover:cursor-pointer"
      >
        ryan zhang
      </h1>
      <div className="inline text-muted-foreground md:text-3xl text-center self-center tracking-tighter leading-relaxed">
        software engineer coop at{'  '}
        <Link
          href="https://www.planview.com/"
          target="_blank"
          className="inline-block transition-all duration-100 font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent hover:brightness-125 hover:cursor-pointer px-1 pl-0"
        >
          planview
        </Link>
      </div>
    </div>
  );
}
