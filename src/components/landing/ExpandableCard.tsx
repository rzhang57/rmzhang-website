"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export default function ExpandableCard({
                                           title,
                                           children,
                                           defaultOpen = false,
                                       }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = React.useState(defaultOpen);
    const panelRef = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        const el = panelRef.current;
        if (!el) return;
        el.style.height = open ? "auto" : "0px";
    }, []);

    React.useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        if (open) {
            const target = el.scrollHeight;
            el.style.height = `${target}px`;
            const onEnd = () => {
                if (open) el.style.height = "auto";
                el.removeEventListener("transitionend", onEnd);
            };
            el.addEventListener("transitionend", onEnd);
        } else {
            const current = el.scrollHeight;
            el.style.height = `${current}px`;
            void el.offsetHeight;
            el.style.height = "0px";
        }
    }, [open]);

    React.useEffect(() => {
        const el = panelRef.current;
        if (!el || !open) return;
        const ro = new ResizeObserver(() => {
            if (!el) return;
            if (el.style.height !== "auto") return;
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [open]);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between py-3 text-left"
                aria-expanded={open}
            >
                <span className="font-semibold tracking-tight text-gray-800">{title}</span>
                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-4 w-4 text-gray-600 transition-transform", open ? "rotate-180" : "rotate-0")}
                    aria-hidden="true"
                >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div
                ref={panelRef}
                className="transition-[height] duration-300 ease-out overflow-clip will-change-[height]"
                aria-hidden={!open}
            >
                <div className="py-3 text-sm text-muted-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}