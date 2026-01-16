"use client";

export default function NoiseOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-10"
            style={{
                opacity: 0.03,
                mixBlendMode: "overlay",
            }}
        >
            <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                </defs>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    );
}
