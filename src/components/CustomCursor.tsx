"use client";

import { useEffect, useState, useRef } from "react";

const MS_COLORS = ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"];
const CustomCursor = () => {
    const mainCursorRef = useRef<HTMLDivElement>(null);
    const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
    const positionRef = useRef({
        mouseX: -100,
        mouseY: -100,
        mainX: -100,
        mainY: -100,
        orbitX: -100,
        orbitY: -100,
    });
    const angleRef = useRef(0);

    const particleOffsetsRef = useRef(
        Array(MS_COLORS.length).fill(null).map(() => ({
            speed: 0.02 + Math.random() * 0.02,
            radiusOffset: 0,
            angleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.05,
            wobbleAmount: Math.random() * 10,
            currentPhase: Math.random() * Math.PI * 2,
            transitionAngle: 0,
            targetTransitionAngle: 0
        }))
    );

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

        const handleMouseDown = () => {
            setIsClicking(true);
            particleOffsetsRef.current.forEach(p => {
                p.targetTransitionAngle += (Math.PI / 2 + Math.random() * Math.PI) * (Math.random() > 0.5 ? 1 : -1);
            });
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.addEventListener("mouseleave", handleBodyMouseLeave);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .clickable')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .clickable')) {
                setIsHovering(false);
            }
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        const checkIframeClass = () => {
            setIsInIframe(document.body.classList.contains('hide-custom-cursor'));
        };

        const observer = new MutationObserver(checkIframeClass);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        const animate = () => {
            const { mouseX, mouseY } = positionRef.current;

            positionRef.current.mainX = mouseX;
            positionRef.current.mainY = mouseY;

            positionRef.current.orbitX += (mouseX - positionRef.current.orbitX) * 0.1;
            positionRef.current.orbitY += (mouseY - positionRef.current.orbitY) * 0.1;

            const dx = mouseX - positionRef.current.orbitX;
            const dy = mouseY - positionRef.current.orbitY;
            const speed = Math.sqrt(dx * dx + dy * dy);

            const chaosMultiplier = Math.min(speed * 0.01, 0.5);

            particleOffsetsRef.current.forEach((p, i) => {
                p.currentPhase += p.wobbleSpeed * 0.1;
                // Reduced interpolation factor from 0.08 to 0.04 for slower transition
                p.transitionAngle += (p.targetTransitionAngle - p.transitionAngle) * 0.04;

                if (speed > 0.5) {
                    p.angleOffset += speed * 0.0005 * (i % 2 === 0 ? 1 : -1);

                    p.wobbleSpeed += (Math.random() - 0.5) * 0.0005 * speed;
                    p.wobbleSpeed = Math.max(0.02, Math.min(0.15, p.wobbleSpeed));
                }
            });

            angleRef.current += 0.02;

            if (mainCursorRef.current) {
                mainCursorRef.current.style.transform = `translate3d(${
                    Math.round(positionRef.current.mainX)
                }px, ${Math.round(positionRef.current.mainY)}px, 0)`;
            }

            const centerX = positionRef.current.orbitX + 8;
            const centerY = positionRef.current.orbitY + 8;

            orbitRefs.current.forEach((ref, index) => {
                if (ref) {
                    const particle = particleOffsetsRef.current[index];

                    const baseRadius = 24 + (index * 8);
                    const baseAngle = angleRef.current + particle.angleOffset + particle.transitionAngle;

                    const wobble = Math.sin(particle.currentPhase) * (particle.wobbleAmount + chaosMultiplier * 4);
                    const radius = baseRadius + wobble;

                    const currentAngle = baseAngle + (chaosMultiplier * 0.1 * (index % 2 === 0 ? 1 : -1));

                    const x = centerX + Math.cos(currentAngle) * radius;
                    const y = centerY + Math.sin(currentAngle) * radius;

                    ref.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.removeEventListener("mouseleave", handleBodyMouseLeave);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isVisible]);

    return (
        <>
            {MS_COLORS.map((color, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        orbitRefs.current[i] = el;
                    }}
                    className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
                    style={{
                        width: "4px",
                        height: "4px",
                        backgroundColor: color,
                        opacity: (isVisible && !isInIframe) ? 1 : 0,
                        transition: "opacity 0.2s",
                        borderRadius: "0px",
                    }}
                />
            ))}
            <div
                ref={mainCursorRef}
                className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
                style={{
                    opacity: (isVisible && !isInIframe) ? 1 : 0,
                    transition: "opacity 0.2s",
                    transformOrigin: "top left",
                    filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.2))"
                }}
            >
                <svg
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        transform: `scale(${isClicking ? 0.94 : (isHovering ? 1.01 : 1)})`,
                        transition: "transform 0.1s",
                    }}
                >
                    <path
                        d="M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z"
                        fill="white"
                        stroke="black"
                        strokeWidth="1"
                        shapeRendering="crispEdges"
                        strokeLinejoin="miter"
                    />
                </svg>
            </div>
        </>
    );
};

export default CustomCursor;