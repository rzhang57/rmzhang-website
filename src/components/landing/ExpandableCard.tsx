"use client";

import * as React from "react";
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
                    className={`h-4 w-4 text-gray-600 ${open ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div className="overflow-hidden">
                    <div className="py-3 text-sm text-muted-foreground">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}