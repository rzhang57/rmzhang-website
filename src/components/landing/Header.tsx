"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePanelContext } from "@/components/navigation/PanelContext";
import { motion } from "framer-motion";

const navItems = [
    { label: "home", index: 0 },
    { label: "about", index: 1 },
    { label: "projects", index: 2 },
    { label: "contact", index: 3 },
];

export default function Header() {
    const { activePanel, navigateToPanel } = usePanelContext();

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-pill rounded-full px-2 py-2 flex items-center gap-1"
            >
                {/* Navigation links */}
                <nav className="flex items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigateToPanel(item.index)}
                            className={`
                                relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
                                ${activePanel === item.index
                                    ? "text-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                                }
                            `}
                        >
                            {activePanel === item.index && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-white/60 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="w-[1px] h-6 bg-white/30 mx-2" />

                {/* Social links */}
                <div className="flex items-center gap-2 pr-1">
                    <a
                        href="https://linkedin.com/in/rmzhang"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
                    >
                        <Avatar className="size-6">
                            <AvatarImage src="/statics/inlogo.png" />
                            <AvatarFallback>LI</AvatarFallback>
                        </Avatar>
                    </a>
                    <a
                        href="https://github.com/rzhang57"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
                    >
                        <Avatar className="size-6">
                            <AvatarImage src="/statics/gitlogo.png" />
                            <AvatarFallback>GH</AvatarFallback>
                        </Avatar>
                    </a>
                </div>
            </motion.div>
        </header>
    );
}
