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
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Text",
                    "SF Pro Display",
                    "var(--font-geist-sans)",
                    "Segoe UI",
                    "Helvetica Neue",
                    "sans-serif",
                ],
                mono: [
                    "ui-monospace",
                    "SF Mono",
                    "SFMono-Regular",
                    "var(--font-geist-mono)",
                    "Menlo",
                    "monospace",
                ],
            },
            colors: {
                paper: "hsl(var(--paper))",
                ink: "hsl(var(--ink))",
                muted: "hsl(var(--muted))",
                faint: "hsl(var(--faint))",
                rule: "hsl(var(--rule))",
                accent: "hsl(var(--accent))",
            },
            maxWidth: {
                column: "38rem",
                wide: "48rem",
            },
            borderRadius: {
                none: "0",
            },
        },
    },
    plugins: [],
};

export default config;
