"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {ReactNode} from "react";

export default function ExpandableCard({
                                           title,
                                           children,
                                           defaultOpen = false,
                                       }: {
    title: string | ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = React.useState(defaultOpen);
    const panelRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        if (open) {
            el.style.height = "0px";
            requestAnimationFrame(() => {
                el.style.height = `${el.scrollHeight}px`;
            });
        } else {
            el.style.height = `${el.scrollHeight}px`;
            requestAnimationFrame(() => {
                el.style.height = "0px";
            });
        }
    }, [open]);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between py-3 text-left"
                aria-expanded={open}
            >
                <span className="font-semibold tracking-tight text-foreground">{title}</span>
                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-4 w-4 text-muted-foreground transition-transform", open ? "rotate-180" : "rotate-0")}
                    aria-hidden="true"
                >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div
                ref={panelRef}
                className="transition-[height] duration-300 ease-out overflow-clip will-change-[height]"
                style={{ height: open ? undefined : "0px" }}
                aria-hidden={!open}
            >
                <div className="py-3 text-sm text-muted-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
