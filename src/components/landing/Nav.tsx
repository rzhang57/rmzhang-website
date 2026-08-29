"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  isGlassLive,
  setBasePanel,
  subscribeGlass,
} from "@/components/shader/panel";

interface Route {
  href: string;
  label: string;
}

interface Pill {
  x: number;
  width: number;
  visible: boolean;
  animate: boolean;
}

export default function Nav({ routes }: { routes: Route[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const items = useRef(new Map<string, HTMLAnchorElement>());
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill>({
    x: 0,
    width: 0,
    visible: false,
    animate: false,
  });

  const glass = useSyncExternalStore(
    subscribeGlass,
    isGlassLive,
    () => false
  );

  const active = routes.find((route) => route.href === pathname)?.href ?? null;
  const target = hovered ?? active;

  const measure = useCallback(() => {
    const container = containerRef.current;
    const node = target ? items.current.get(target) : undefined;

    if (!container || !node) {
      setPill((previous) => ({ ...previous, visible: false }));
      setBasePanel(null);
      return;
    }

    const bounds = container.getBoundingClientRect();
    const item = node.getBoundingClientRect();

    setBasePanel({
      x: item.left + window.scrollX,
      y: item.top + window.scrollY,
      width: item.width,
      height: item.height,
      opacity: 1,
    });

    setPill((previous) => ({
      x: item.left - bounds.left,
      width: item.width,
      visible: true,
      animate: previous.visible,
    }));
  }, [target]);

  useLayoutEffect(measure, [measure, pathname]);

  useEffect(() => {
    if (!pill.visible || pill.animate) return;
    const handle = requestAnimationFrame(() =>
      setPill((previous) => ({ ...previous, animate: true }))
    );
    return () => cancelAnimationFrame(handle);
  }, [pill.visible, pill.animate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => () => setBasePanel(null), []);

  return (
    <nav
      ref={containerRef}
      onPointerLeave={() => setHovered(null)}
      className="relative -mr-3 flex items-center"
    >
      {glass ? null : (
        <span
          aria-hidden
          style={{
            transform: `translateX(${pill.x}px)`,
            width: `${pill.width}px`,
            opacity: pill.visible ? 1 : 0,
            transitionProperty: pill.animate
              ? "transform, width, opacity"
              : "opacity",
            background:
              "linear-gradient(152deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.34) 46%, rgba(255,255,255,0.7) 100%)",
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.9)",
              "0 0 0 2px rgba(215,188,255,0.7)",
              "inset 1px 0 0 rgba(255,185,163,0.55)",
              "inset -1px 0 0 rgba(169,200,255,0.7)",
              "inset 0 1px 0 rgba(255,255,255,0.98)",
              "inset 0 -7px 14px -7px rgba(96,106,148,0.4)",
              "0 2px 5px rgba(20,22,30,0.08)",
              "0 12px 26px -8px rgba(169,200,255,0.65)",
              "0 0 22px rgba(215,188,255,0.42)",
            ].join(", "),
          }}
          className="pointer-events-none absolute left-0 top-0 h-[28px] overflow-hidden rounded-[9px] backdrop-blur-[12px] backdrop-saturate-[190%] backdrop-brightness-[1.07] transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <span className="absolute inset-x-[3px] top-[1px] h-[10px] rounded-[7px] bg-gradient-to-b from-white/90 to-white/0" />
        </span>
      )}
      {routes.map((route) => {
        const lit = target === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            ref={(node) => {
              if (node) items.current.set(route.href, node);
              else items.current.delete(route.href);
            }}
            onPointerEnter={() => setHovered(route.href)}
            onFocus={() => setHovered(route.href)}
            onBlur={() => setHovered(null)}
            className={`relative z-10 flex h-[28px] items-center px-3 text-[13px] transition-colors duration-200 ${
              lit ? "text-ink" : "text-faint hover:text-ink"
            }`}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
