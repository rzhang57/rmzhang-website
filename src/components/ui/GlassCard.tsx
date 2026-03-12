"use client";

import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div className={`relative p-[1px] transition-all duration-300 hover:-translate-y-1 ${className}`}>
            <div
                className="relative bg-transparent backdrop-blur-sm p-8 overflow-hidden"
            >
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    );
}
