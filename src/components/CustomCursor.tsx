"use client";

import React, { useEffect, useState, useRef } from "react";

const PLANETS = [
    { color: "#F9A03F", size: 4, orbitRadius: 16 },
    { color: "#60A5FA", size: 5, orbitRadius: 28 },
    { color: "#C084FC", size: 6, orbitRadius: 42, isSaturn: true },
    { color: "#F472B6", size: 4, orbitRadius: 56 },
] as const;

const SATURN_INDEX = PLANETS.findIndex(p => 'isSaturn' in p && p.isSaturn);

const CustomCursor = () => {
    const sunRef = useRef<HTMLDivElement | null>(null);
    const ringRef = useRef<HTMLDivElement | null>(null);
    const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
    const moonRefs = useRef<(HTMLDivElement | null)[]>([]);

    const positionRef = useRef({ mouseX: -100, mouseY: -100, orbitX: -100, orbitY: -100 });
    const angleRef = useRef(0);
    const moonAnglesRef = useRef(PLANETS.map(() => Math.random() * Math.PI * 2));
    const planetPositionsRef = useRef(PLANETS.map(() => ({ x: -100, y: -100 })));

    const particleOffsetsRef = useRef(
        PLANETS.map(() => ({
            angleOffset: Math.random() * Math.PI * 2,
            wobbleAmount: Math.random() * 3,
            wobbleSpeed: 0.03 + Math.random() * 0.03,
            currentPhase: Math.random() * Math.PI * 2,
            transitionAngle: 0,
            targetTransitionAngle: 0,
        }))
    );

    const [isVisible, setIsVisible] = useState(false);
    const [isInIframe, setIsInIframe] = useState(false);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            positionRef.current.mouseX = e.clientX;
            positionRef.current.mouseY = e.clientY;
            if (!isVisible) setIsVisible(true);
        };

        const handleBodyMouseLeave = () => setIsVisible(false);

        const handleMouseDown = () => {
            particleOffsetsRef.current.forEach(p => {
                p.targetTransitionAngle += (Math.PI / 2 + Math.random() * Math.PI) * (Math.random() > 0.5 ? 1 : -1);
            });
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.body.addEventListener("mouseleave", handleBodyMouseLeave);

        const checkIframeClass = () => {
            setIsInIframe(document.body.classList.contains("hide-custom-cursor"));
        };
        const observer = new MutationObserver(checkIframeClass);
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

        const animate = () => {
            const { mouseX, mouseY } = positionRef.current;

            positionRef.current.orbitX += (mouseX - positionRef.current.orbitX) * 0.1;
            positionRef.current.orbitY += (mouseY - positionRef.current.orbitY) * 0.1;

            const centerX = positionRef.current.orbitX;
            const centerY = positionRef.current.orbitY;

            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const speed = Math.sqrt(dx * dx + dy * dy);
            const chaosMultiplier = Math.min(speed * 0.008, 0.3);

            if (sunRef.current) {
                sunRef.current.style.transform = `translate3d(${Math.round(centerX - 1.5)}px, ${Math.round(centerY - 1.5)}px, 0)`;
            }

            angleRef.current += 0.015;

            PLANETS.forEach((planet, i) => {
                const p = particleOffsetsRef.current[i];
                p.currentPhase += p.wobbleSpeed;
                p.transitionAngle += (p.targetTransitionAngle - p.transitionAngle) * 0.04;

                const wobble = Math.sin(p.currentPhase) * (p.wobbleAmount + chaosMultiplier * 2);
                const radius = planet.orbitRadius + wobble;
                const angle = angleRef.current + p.angleOffset + p.transitionAngle;

                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                planetPositionsRef.current[i] = { x, y };

                const planetRef = planetRefs.current[i];
                if (planetRef) {
                    planetRef.style.transform = `translate3d(${Math.round(x - planet.size / 2)}px, ${Math.round(y - planet.size / 2)}px, 0)`;
                }

                if (i === SATURN_INDEX && ringRef.current) {
                    ringRef.current.style.transform = `translate3d(${Math.round(x - 8)}px, ${Math.round(y - 3)}px, 0) rotate(-25deg)`;
                }

                moonAnglesRef.current[i] += 0.06;
                const moonAngle = moonAnglesRef.current[i];
                const moonRadius = 8;
                const mx = x + Math.cos(moonAngle) * moonRadius;
                const my = y + Math.sin(moonAngle) * moonRadius;

                const moonRef = moonRefs.current[i];
                if (moonRef) {
                    moonRef.style.transform = `translate3d(${Math.round(mx - 1)}px, ${Math.round(my - 1)}px, 0)`;
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.body.removeEventListener("mouseleave", handleBodyMouseLeave);
            observer.disconnect();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isVisible]);

    const opacity = isVisible && !isInIframe ? 1 : 0;
    const transition = "opacity 0.2s";
    const baseClass = "pointer-events-none fixed left-0 top-0 z-50 hidden md:block";

    return (
        <>
            <div
                ref={sunRef}
                className={baseClass}
                style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    backgroundColor: "#FFF8E7",
                    boxShadow: "0 0 6px 2px #F9A03F80",
                    opacity,
                    transition,
                }}
            />
            <div
                ref={ringRef}
                className={baseClass}
                style={{
                    width: "16px",
                    height: "6px",
                    border: "1.5px solid #C084FC99",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    opacity,
                    transition,
                }}
            />
            {PLANETS.map((planet, i) => (
                <React.Fragment key={i}>
                    <div
                        ref={(el) => { planetRefs.current[i] = el; }}
                        className={baseClass}
                        style={{
                            width: `${planet.size}px`,
                            height: `${planet.size}px`,
                            borderRadius: "50%",
                            backgroundColor: planet.color,
                            boxShadow: `0 0 5px 1px ${planet.color}60`,
                            opacity,
                            transition,
                        }}
                    />
                    <div
                        ref={(el) => { moonRefs.current[i] = el; }}
                        className={baseClass}
                        style={{
                            width: "2px",
                            height: "2px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff99",
                            opacity,
                            transition,
                        }}
                    />
                </React.Fragment>
            ))}
        </>
    );
};

export default CustomCursor;
