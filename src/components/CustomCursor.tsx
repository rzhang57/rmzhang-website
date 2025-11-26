"use client";

import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
    const mainCursorRef = useRef<HTMLDivElement>(null);
    const trailCursorRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef({
        mouseX: -100,
        mouseY: -100,
        mainX: -100,
        mainY: -100,
        trailX: -100,
        trailY: -100,
    });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isInIframe, setIsInIframe] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            positionRef.current.mouseX = clientX;
            positionRef.current.mouseY = clientY;
            if (!isVisible) setIsVisible(true);
        };

        const handleBodyMouseLeave = () => setIsVisible(false);
        const handleElementMouseEnter = () => setIsHovering(true);
        const handleElementMouseLeave = () => setIsHovering(false);

        const handleMouseDown = () => {
            setIsClicking(true);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.addEventListener("mouseleave", handleBodyMouseLeave);

        const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, [role="button"]'
        );
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", handleElementMouseEnter);
            el.addEventListener("mouseleave", handleElementMouseLeave);
        });

        const checkIframeClass = () => {
            setIsInIframe(document.body.classList.contains('hide-custom-cursor'));
        };

        const observer = new MutationObserver(checkIframeClass);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        const animate = () => {
            const { mouseX, mouseY, mainX, mainY, trailX, trailY } =
                positionRef.current;

            // Main cursor smoothing
            positionRef.current.mainX += (mouseX - mainX) * 0.2;
            positionRef.current.mainY += (mouseY - mainY) * 0.2;

            // Trail cursor smoothing
            positionRef.current.trailX += (positionRef.current.mainX - trailX) * 0.1;
            positionRef.current.trailY += (positionRef.current.mainY - trailY) * 0.1;

            if (mainCursorRef.current) {
                mainCursorRef.current.style.transform = `translate3d(${
                    positionRef.current.mainX - 12
                }px, ${positionRef.current.mainY - 12}px, 0)`;
            }
            if (trailCursorRef.current) {
                trailCursorRef.current.style.transform = `translate3d(${
                    positionRef.current.trailX - 4
                }px, ${positionRef.current.trailY - 4}px, 0)`;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.removeEventListener("mouseleave", handleBodyMouseLeave);
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleElementMouseEnter);
                el.removeEventListener("mouseleave", handleElementMouseLeave);
            });
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isVisible]);

    return (
        <>
            <div
                ref={trailCursorRef}
                className="pointer-events-none fixed left-0 top-0 z-50 hidden rounded-full md:block"
                style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                    opacity: (isVisible && !isInIframe) ? 1 : 0,
                    transition: "opacity 0.2s",
                }}
            />
            <div
                ref={mainCursorRef}
                className="pointer-events-none fixed left-0 top-0 z-50 hidden rounded-full md:block"
                style={{
                    width: isHovering ? "48px" : "24px",
                    height: isHovering ? "48px" : "24px",
                    backgroundColor: isClicking
                        ? "rgba(239,178,202,0.7)"
                        : "rgba(128, 128, 128, 0.3)",
                    backdropFilter: "grayscale(100%) invert(100%)",
                    WebkitBackdropFilter: "grayscale(100%) invert(100%)",
                    opacity: (isVisible && !isInIframe) ? 1 : 0,
                    transition: isClicking
                        ? "width 0.1s, height 0.1s, opacity 0.2s, background-color 0.1s"
                        : "width 0.6s, height 0.7s, opacity 0.2s, background-color 0.2s",
                    transform: isClicking ? "scale(0.8)" : "scale(1)",
                }}
            />
        </>
    );
};

export default CustomCursor;