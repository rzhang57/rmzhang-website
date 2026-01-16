import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif',
                ],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Iridescent glass colors
                glass: {
                    pink: "rgba(255, 182, 193, 0.6)",
                    cyan: "rgba(168, 237, 234, 0.6)",
                    lavender: "rgba(221, 160, 221, 0.6)",
                    mint: "rgba(152, 251, 152, 0.5)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "orb-float-1": {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "25%": { transform: "translate(100px, -50px) scale(1.1)" },
                    "50%": { transform: "translate(50px, 100px) scale(0.9)" },
                    "75%": { transform: "translate(-50px, 50px) scale(1.05)" },
                },
                "orb-float-2": {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "33%": { transform: "translate(-80px, 60px) scale(1.15)" },
                    "66%": { transform: "translate(60px, -40px) scale(0.95)" },
                },
                "orb-float-3": {
                    "0%, 100%": { transform: "translate(0, 0)" },
                    "50%": { transform: "translate(-100px, -80px)" },
                },
                "orb-float-4": {
                    "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
                    "25%": { transform: "translate(60px, 80px) rotate(90deg)" },
                    "50%": { transform: "translate(-40px, 60px) rotate(180deg)" },
                    "75%": { transform: "translate(-80px, -40px) rotate(270deg)" },
                },
                "orb-float-5": {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "50%": { transform: "translate(80px, -60px) scale(1.2)" },
                },
                "iridescent": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                "panel-enter": {
                    "0%": { opacity: "0", transform: "scale(0.97)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                "panel-exit": {
                    "0%": { opacity: "1", transform: "scale(1)" },
                    "100%": { opacity: "0", transform: "scale(0.97)" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(200%)" },
                },
                "edge-glow": {
                    "0%, 100%": {
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(255,182,193,0.3), 0 8px 32px rgba(0,0,0,0.1)",
                    },
                    "50%": {
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 0 30px rgba(173,216,230,0.4), 0 8px 32px rgba(0,0,0,0.1)",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "orb-float-1": "orb-float-1 20s ease-in-out infinite",
                "orb-float-2": "orb-float-2 25s ease-in-out infinite",
                "orb-float-3": "orb-float-3 18s ease-in-out infinite",
                "orb-float-4": "orb-float-4 22s ease-in-out infinite",
                "orb-float-5": "orb-float-5 15s ease-in-out infinite",
                "iridescent": "iridescent 8s ease infinite",
                "panel-enter": "panel-enter 0.5s ease-out",
                "panel-exit": "panel-exit 0.5s ease-out",
                "fade-in-up": "fade-in-up 0.6s ease-out",
                "shimmer": "shimmer 3s ease-in-out infinite",
                "edge-glow": "edge-glow 4s ease-in-out infinite",
            },
            backdropBlur: {
                glass: "40px",
            },
        },
    },

    plugins: [require("tailwindcss-animate")],
};

export default config;
