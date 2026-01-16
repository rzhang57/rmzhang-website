"use client";

import { usePanelContext } from "./PanelNavigator";
import { motion } from "framer-motion";

const panelNames = ["home", "about", "projects", "contact"];

export default function PanelIndicator() {
    const { activePanel, totalPanels, navigateToPanel } = usePanelContext();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-pill rounded-full px-4 py-3 flex items-center gap-3">
                {Array.from({ length: totalPanels }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => navigateToPanel(index)}
                        className="relative group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
                        aria-label={`Navigate to ${panelNames[index] || `panel ${index + 1}`}`}
                        aria-current={activePanel === index ? "true" : undefined}
                    >
                        <motion.div
                            className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                            style={{
                                backgroundColor:
                                    activePanel === index
                                        ? "rgba(255, 255, 255, 0.9)"
                                        : "rgba(255, 255, 255, 0.35)",
                            }}
                            animate={{
                                scale: activePanel === index ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 px-2 py-1 rounded-md glass-subtle text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {panelNames[index] || `panel ${index + 1}`}
                        </div>

                        {/* Active indicator ring */}
                        {activePanel === index && (
                            <motion.div
                                className="absolute inset-0 rounded-full border border-white/30"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.6, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ margin: "-4px" }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
