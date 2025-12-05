"use client";

import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div
            className={`relative bg-white/[0.02] backdrop-blur-md p-8 border border-white/[0.08] shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 ${className}`}
        >
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
            </div>
            <div className="absolute left-0 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent" />
            <div className="absolute right-0 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent" />
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}