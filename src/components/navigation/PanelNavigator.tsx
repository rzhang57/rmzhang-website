"use client";

import {
    createContext,
    useContext,
    useRef,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";

interface PanelContextType {
    activePanel: number;
    totalPanels: number;
    navigateToPanel: (index: number) => void;
    registerPanel: () => number;
}

const PanelContext = createContext<PanelContextType | null>(null);

export function usePanelContext() {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error("usePanelContext must be used within a PanelNavigator");
    }
    return context;
}

interface PanelNavigatorProps {
    children: ReactNode;
}

export default function PanelNavigator({ children }: PanelNavigatorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activePanel, setActivePanel] = useState(0);
    const [totalPanels, setTotalPanels] = useState(0);
    const panelCountRef = useRef(0);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    const registerPanel = useCallback(() => {
        const index = panelCountRef.current;
        panelCountRef.current += 1;
        setTotalPanels(panelCountRef.current);
        return index;
    }, []);

    const navigateToPanel = useCallback((index: number) => {
        if (containerRef.current && index >= 0 && index < panelCountRef.current) {
            isScrollingRef.current = true;
            const targetScroll = index * window.innerWidth;
            containerRef.current.scrollTo({
                left: targetScroll,
                behavior: "smooth",
            });
            setActivePanel(index);

            // Reset scrolling flag after animation
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Handle wheel events to convert vertical scroll to horizontal
        const handleWheel = (e: WheelEvent) => {
            if (isScrollingRef.current) {
                e.preventDefault();
                return;
            }

            // Check if it's primarily a vertical scroll
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                // Determine direction and navigate
                if (e.deltaY > 30 && activePanel < totalPanels - 1) {
                    navigateToPanel(activePanel + 1);
                } else if (e.deltaY < -30 && activePanel > 0) {
                    navigateToPanel(activePanel - 1);
                }
            }
        };

        // Handle scroll events to track active panel
        const handleScroll = () => {
            if (!isScrollingRef.current) {
                const scrollLeft = container.scrollLeft;
                const panelWidth = window.innerWidth;
                const newActivePanel = Math.round(scrollLeft / panelWidth);
                if (newActivePanel !== activePanel) {
                    setActivePanel(newActivePanel);
                }
            }
        };

        // Handle keyboard navigation
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
    }, [activePanel, totalPanels, navigateToPanel]);

    // Handle touch swipe for mobile
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

            // Only handle horizontal swipes
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
        <PanelContext.Provider
            value={{ activePanel, totalPanels, navigateToPanel, registerPanel }}
        >
            <div ref={containerRef} className="panel-container">
                {children}
            </div>
        </PanelContext.Provider>
    );
}
