"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
    useRef,
} from "react";

interface PanelContextType {
    activePanel: number;
    totalPanels: number;
    setActivePanel: (index: number) => void;
    navigateToPanel: (index: number) => void;
    registerPanel: () => number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setContainerRef: (ref: HTMLDivElement | null) => void;
}

const PanelContext = createContext<PanelContextType | null>(null);

export function usePanelContext() {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error("usePanelContext must be used within a PanelProvider");
    }
    return context;
}

interface PanelProviderProps {
    children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
    const [activePanel, setActivePanel] = useState(0);
    const [totalPanels, setTotalPanels] = useState(0);
    const panelCountRef = useRef(0);
    const containerRefState = useRef<HTMLDivElement | null>(null);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    const setContainerRef = useCallback((ref: HTMLDivElement | null) => {
        containerRefState.current = ref;
    }, []);

    const registerPanel = useCallback(() => {
        const index = panelCountRef.current;
        panelCountRef.current += 1;
        setTotalPanels(panelCountRef.current);
        return index;
    }, []);

    const navigateToPanel = useCallback((index: number) => {
        if (containerRefState.current && index >= 0 && index < panelCountRef.current) {
            isScrollingRef.current = true;
            const targetScroll = index * window.innerWidth;
            containerRefState.current.scrollTo({
                left: targetScroll,
                behavior: "smooth",
            });
            setActivePanel(index);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        }
    }, []);

    return (
        <PanelContext.Provider
            value={{
                activePanel,
                totalPanels,
                setActivePanel,
                navigateToPanel,
                registerPanel,
                containerRef: containerRefState,
                setContainerRef,
            }}
        >
            {children}
        </PanelContext.Provider>
    );
}
