"use client";

import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div
            className={`relative bg-background p-8 border border-foreground/20 transition-all duration-300 hover:-translate-y-1 ${className}`}
        >
            <div className="relative z-10">{children}</div>
        </div>
    );
}
