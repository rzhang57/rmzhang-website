"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlassCard from "@/components/ui/GlassCard";
import { AnimatePresence, motion } from "framer-motion";

export default function Contact() {
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState(false);

    function handleCopyClick() {
        const textToCopy = "ryanzhang@outlook.com";
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(() => {
                setCopyError(true);
                setTimeout(() => setCopyError(false), 2000);
            });
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <GlassCard iridescent glow className="text-center">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-3xl font-extrabold tracking-tighter">contact me</h1>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-white/20">
                            <AvatarImage src="/statics/pfp.png" />
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>

                        <p className="text-muted-foreground md:text-lg max-w-md">
                            inquiries? email me at{" "}
                            <button
                                onClick={handleCopyClick}
                                className="underline tracking-tight hover:tracking-normal transition-all hover:text-pink-500 font-medium iridescent-border px-1 rounded"
                            >
                                ryanzhang@outlook.com
                            </button>{" "}
                            or find me on linkedin!
                        </p>
                    </div>
                </GlassCard>

                <AnimatePresence>
                    {copySuccess && (
                        <div className="absolute top-full mt-4 left-0 right-0 flex justify-center z-50">
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="glass-pill rounded-full px-4 py-2 text-gray-700 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Email copied to clipboard!
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {copyError && (
                        <div className="absolute top-full mt-4 left-0 right-0 flex justify-center z-50">
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="glass-pill rounded-full px-4 py-2 text-red-600 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Failed to copy email
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
