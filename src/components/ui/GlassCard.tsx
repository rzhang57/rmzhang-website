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
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.5) 100%)',
                }}
            />
            <div
                className="relative bg-white/30 backdrop-blur-xl p-8 overflow-hidden"
                style={{
                    boxShadow: `
                        0 8px 32px rgba(0,0,0,0.08),
                        0 2px 8px rgba(0,0,0,0.04),
                        inset 0 2px 4px rgba(255,255,255,0.6),
                        inset 0 -1px 2px rgba(0,0,0,0.03)
                    `,
                }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)',
                    }}
                />
                <div
                    className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                    }}
                />
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    );
}