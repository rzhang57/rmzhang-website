"use client";

import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div
            className={`bg-white p-8 border border-black ${className}`}
        >
            {children}
        </div>
    );
}