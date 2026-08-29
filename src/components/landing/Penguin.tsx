"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SCENE = [288, 288] as const;

export default function Penguin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [live, setLive] = useState(false);
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return;

    let cancelled = false;
    let handle: { dispose(): void } | undefined;

    void Promise.all([
      import("@/components/shader/engine"),
      import("@/components/lab/sims/penguin"),
    ])
      .then(([{ mountSimulation }, { createPenguin }]) =>
        mountSimulation(canvas, (gpu) => createPenguin(gpu, SCENE, true, 1.55), {
          alphaMode: "premultiplied",
          host: linkRef.current,
        })
      )
      .then((mounted) => {
        if (cancelled) {
          mounted.dispose();
          return;
        }
        handle = mounted;
        setLive(true);
      })
      .catch(() => {
        if (!cancelled) setLive(false);
      });

    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    void import("@/components/lab/sims/penguin/pulse").then(({ requestAssemble }) =>
      requestAssemble()
    );
  }, [pathname]);

  return (
    <Link
      ref={linkRef}
      href="/"
      aria-label="home"
      data-noglass
      className="relative flex h-11 w-11 items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}
