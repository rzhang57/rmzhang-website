"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePanelContext } from "./PanelNavigator";

interface PanelProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export default function Panel({ id, children, className = "" }: PanelProps) {
    const { registerPanel, activePanel } = usePanelContext();
    const panelIndexRef = useRef<number>(-1);
    const [isVisible, setIsVisible] = useState(false);
    const panelRef = useRef<HTMLElement>(null);

    useEffect(() => {
        panelIndexRef.current = registerPanel();
    }, [registerPanel]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        if (panelRef.current) {
            observer.observe(panelRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const isActive = panelIndexRef.current === activePanel;

    return (
        <section
            ref={panelRef}
            id={id}
            className={`panel ${className}`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{
                    opacity: isVisible ? 1 : 0.5,
                    scale: isVisible ? 1 : 0.97,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center px-6"
            >
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </motion.div>
        </section>
    );
}
