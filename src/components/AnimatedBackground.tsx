"use client";

import { useEffect, useRef, useState } from "react";
import { samplePanel, setGlassLive } from "@/components/shader/panel";
import { watchLinks } from "@/components/shader/glassLinks";

const blobs = [
  {
    className:
      "left-[-14%] top-[-12%] h-[44rem] w-[44rem] bg-[#ffb9a3] animate-drift1",
  },
  {
    className:
      "right-[-18%] top-[12%] h-[48rem] w-[48rem] bg-[#a9c8ff] animate-drift2",
  },
  {
    className:
      "bottom-[-22%] left-[18%] h-[40rem] w-[40rem] bg-[#d7bcff] animate-drift3",
  },
];

function Painted() {
  return (
    <>
      <div className="absolute inset-0 opacity-[0.55]">
        {blobs.map((blob, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-[130px] ${blob.className}`}
          />
        ))}
      </div>
      <div className="dotgrid absolute inset-0" />
      <div className="absolute inset-0 bg-paper/25" />
    </>
  );
}

export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let handle: { dispose(): void } | undefined;
    let stopWatching: (() => void) | undefined;

    void Promise.all([
      import("@/components/shader/engine"),
      import("@/components/shader/backdrop.wgsl"),
    ])
      .then(([{ mountShader }, source]) =>
        mountShader(canvas, source.default, {
          pointer: "window",
          seed: Math.random() * 997,
          panel: () => {
            const { current, spot, links, agitation, spotPresence } = samplePanel();
            const width = Math.max(1, canvas.clientWidth);
            const height = Math.max(1, canvas.clientHeight);
            const toRect = (r: typeof current) =>
              [
                (r.x - window.scrollX) / width,
                (r.y - window.scrollY) / height,
                r.width / width,
                r.height / height,
              ] as [number, number, number, number];
            return {
              rect: toRect(current),
              spot: toRect(spot),
              links: links.map(toRect),
              style: [current.opacity, 0.764, agitation, spotPresence] as [
                number,
                number,
                number,
                number,
              ],
            };
          },
        })
      )
      .then((mounted) => {
        if (cancelled) {
          mounted.dispose();
          return;
        }
        handle = mounted;
        stopWatching = watchLinks();
        setLive(true);
        setGlassLive(true);
      })
      .catch((error: unknown) => {
        console.error("[backdrop]", error);
        if (!cancelled) setLive(false);
      });

    return () => {
      cancelled = true;
      stopWatching?.();
      setGlassLive(false);
      handle?.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper"
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
      {live ? null : <Painted />}
    </div>
  );
}
