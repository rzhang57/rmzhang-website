"use client";

import { useEffect, useState } from "react";

interface Orb {
    id: number;
    size: number;
    color: string;
    x: number;
    y: number;
    animation: string;
}

const orbConfigs: Orb[] = [
    {
        id: 1,
        size: 500,
        color: "rgba(255, 154, 158, 0.45)", // Coral pink
        x: 10,
        y: 20,
        animation: "animate-orb-float-1",
    },
    {
        id: 2,
        size: 400,
        color: "rgba(168, 237, 234, 0.5)", // Cyan/teal
        x: 70,
        y: 60,
        animation: "animate-orb-float-2",
    },
    {
        id: 3,
        size: 350,
        color: "rgba(210, 153, 194, 0.45)", // Lavender
        x: 30,
        y: 70,
        animation: "animate-orb-float-3",
    },
    {
        id: 4,
        size: 450,
        color: "rgba(254, 207, 239, 0.4)", // Light pink
        x: 80,
        y: 15,
        animation: "animate-orb-float-4",
    },
    {
        id: 5,
        size: 300,
        color: "rgba(254, 214, 227, 0.5)", // Soft pink
        x: 50,
        y: 40,
        animation: "animate-orb-float-5",
    },
];

export default function GradientOrbs() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {orbConfigs.map((orb) => (
                <div
                    key={orb.id}
                    className={reducedMotion ? "" : orb.animation}
                    style={{
                        position: "absolute",
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        width: orb.size,
                        height: orb.size,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                        filter: "blur(60px)",
                        transform: "translate(-50%, -50%)",
                        willChange: reducedMotion ? "auto" : "transform",
                    }}
                />
            ))}
        </div>
    );
}
