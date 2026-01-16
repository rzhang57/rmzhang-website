"use client";

import { useRef, useEffect, ReactNode } from "react";
import { usePanelContext } from "./PanelContext";

interface PanelNavigatorProps {
    children: ReactNode;
}

export default function PanelNavigator({ children }: PanelNavigatorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        activePanel,
        totalPanels,
        setActivePanel,
        navigateToPanel,
        setContainerRef,
    } = usePanelContext();
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (containerRef.current) {
            setContainerRef(containerRef.current);
        }
    }, [setContainerRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (isScrollingRef.current) {
                e.preventDefault();
                return;
            }

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                if (e.deltaY > 30 && activePanel < totalPanels - 1) {
                    isScrollingRef.current = true;
                    navigateToPanel(activePanel + 1);
                    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = setTimeout(() => {
                        isScrollingRef.current = false;
                    }, 800);
                } else if (e.deltaY < -30 && activePanel > 0) {
                    isScrollingRef.current = true;
                    navigateToPanel(activePanel - 1);
                    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = setTimeout(() => {
                        isScrollingRef.current = false;
                    }, 800);
                }
            }
        };

        const handleScroll = () => {
            if (!isScrollingRef.current) {
                const scrollLeft = container.scrollLeft;
                const panelWidth = window.innerWidth;
                const newActivePanel = Math.round(scrollLeft / panelWidth);
                if (newActivePanel !== activePanel && newActivePanel >= 0 && newActivePanel < totalPanels) {
                    setActivePanel(newActivePanel);
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                if (activePanel < totalPanels - 1) {
                    navigateToPanel(activePanel + 1);
                }
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                if (activePanel > 0) {
                    navigateToPanel(activePanel - 1);
                }
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("scroll", handleScroll);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("scroll", handleScroll);
            document.removeEventListener("keydown", handleKeyDown);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activePanel, totalPanels, navigateToPanel, setActivePanel]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && activePanel < totalPanels - 1) {
                    navigateToPanel(activePanel + 1);
                } else if (deltaX < 0 && activePanel > 0) {
                    navigateToPanel(activePanel - 1);
                }
            }
        };

        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [activePanel, totalPanels, navigateToPanel]);

    return (
        <div ref={containerRef} className="panel-container">
            {children}
        </div>
    );
}
