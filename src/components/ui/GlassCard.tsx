"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "subtle";
    iridescent?: boolean;
    glow?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    variant = "default",
    iridescent = false,
    glow = false,
}: GlassCardProps) {
    const baseStyles = variant === "default" ? "glass" : "glass-subtle";

    return (
        <div
            className={cn(
                "relative rounded-2xl overflow-hidden transition-all duration-300",
                baseStyles,
                iridescent && "iridescent-border",
                glow && "glass-glow",
                "hover:-translate-y-1",
                className
            )}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Top highlight */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Left edge glow */}
            <div className="absolute left-0 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Right edge glow */}
            <div className="absolute right-0 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-8">{children}</div>
        </div>
    );
}
