"use client";

import { useEffect, useRef, useState } from "react";
import { catalog, type LabEffect } from "./catalog";

type Status = "pending" | "live" | "failed";

function ShaderTile({ effect, index }: { effect: LabEffect; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let handle: { dispose(): void } | undefined;

    void import("../shader/engine")
      .then(({ mountShader, mountSimulation }) =>
        effect.simulation
          ? mountSimulation(canvas, effect.simulation, { seed: index * 7.3 })
          : mountShader(canvas, effect.source!, { seed: index * 7.3 })
      )
      .then((mounted) => {
        if (cancelled) {
          mounted.dispose();
          return;
        }
        handle = mounted;
        setStatus("live");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setStatus("failed");
        setMessage(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [effect.source, effect.simulation, index]);

  return (
    <figure>
      <div className="relative overflow-hidden border border-rule bg-paper">
        <canvas
          ref={canvasRef}
          className={`block aspect-[16/10] w-full cursor-crosshair touch-none transition-opacity duration-700 ${
            status === "live" ? "opacity-100" : "opacity-0"
          }`}
        />
        {status === "failed" ? (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-[15px] leading-relaxed text-faint">
            {message}
          </p>
        ) : null}
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-[15px]">{effect.title}</span>
        <span className="text-[15px] text-faint">{effect.note}</span>
      </figcaption>
      <p className="mt-1.5 max-w-[32rem] text-[15px] leading-relaxed text-muted">
        {effect.detail}
      </p>
    </figure>
  );
}

export default function Gallery() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "gpu" in navigator);
  }, []);

  if (!supported) {
    return (
      <p className="aside">
        webgpu is unavailable in this browser, so none of these will run. try
        chrome, edge, safari 26+, or firefox on windows.
      </p>
    );
  }

  return (
    <div className="space-y-14">
      {catalog.map((effect, index) => (
        <ShaderTile key={effect.id} effect={effect} index={index} />
      ))}
    </div>
  );
}
