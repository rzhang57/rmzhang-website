"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePanelContext } from "@/components/navigation/PanelContext";

export default function Hero() {
    const { navigateToPanel } = usePanelContext();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
            {/* Main content */}
            <div className="space-y-4 text-center relative">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={() => navigateToPanel(1)}
                    className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-5xl md:text-6xl lg:text-7xl xl:text-8xl py-4 duration-1000 hover:cursor-pointer"
                >
                    ryan zhang
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="inline text-muted-foreground text-xl md:text-2xl lg:text-3xl text-center self-center tracking-tighter leading-relaxed"
                >
                    <span className="cycle-item">
                        incoming software engineering intern at{" "}
                        <Link
                            href="https://www.microsoft.com/"
                            target="_blank"
                            className="inline-block transition-all duration-100 font-bold bg-gradient-to-r bg-clip-text text-transparent hover:brightness-125 hover:cursor-pointer px-1 pl-0 tracking-tighter"
                        >
                            <span
                                className="text-[#F25022]"
                                style={{
                                    WebkitTextStroke: "3px black",
                                    paintOrder: "stroke fill",
                                }}
                            >
                                mi
                            </span>
                            <span
                                className="text-[#7FBA00]"
                                style={{
                                    WebkitTextStroke: "3px black",
                                    paintOrder: "stroke fill",
                                }}
                            >
                                cr
                            </span>
                            <span
                                className="text-[#00A4EF]"
                                style={{
                                    WebkitTextStroke: "3px black",
                                    paintOrder: "stroke fill",
                                }}
                            >
                                os
                            </span>
                            <span
                                className="text-[#FFB900]"
                                style={{
                                    WebkitTextStroke: "3px black",
                                    paintOrder: "stroke fill",
                                }}
                            >
                                oft
                            </span>
                        </Link>
                    </span>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <button
                    onClick={() => navigateToPanel(1)}
                    className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <span className="text-sm tracking-wide">explore</span>
                    <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="rotate-0"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </motion.div>
                </button>
            </motion.div>
        </div>
    );
}
