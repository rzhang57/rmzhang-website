"use client";

import { useEffect, useState, useRef } from "react";

const MS_COLORS = ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"];

const CustomCursor = () => {
    const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
    const positionRef = useRef({
        mouseX: -100,
        mouseY: -100,
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

    const [isVisible, setIsVisible] = useState(false);
    const [isInIframe, setIsInIframe] = useState(false);
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
            particleOffsetsRef.current.forEach(p => {
                p.targetTransitionAngle += (Math.PI / 2 + Math.random() * Math.PI) * (Math.random() > 0.5 ? 1 : -1);
            });
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.body.addEventListener("mouseleave", handleBodyMouseLeave);

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

            positionRef.current.orbitX += (mouseX - positionRef.current.orbitX) * 0.1;
            positionRef.current.orbitY += (mouseY - positionRef.current.orbitY) * 0.1;

            const dx = mouseX - positionRef.current.orbitX;
            const dy = mouseY - positionRef.current.orbitY;
            const speed = Math.sqrt(dx * dx + dy * dy);

            const chaosMultiplier = Math.min(speed * 0.01, 0.5);

            particleOffsetsRef.current.forEach((p, i) => {
                p.currentPhase += p.wobbleSpeed * 0.1;
                p.transitionAngle += (p.targetTransitionAngle - p.transitionAngle) * 0.04;

                if (speed > 0.5) {
                    p.angleOffset += speed * 0.0005 * (i % 2 === 0 ? 1 : -1);
                    p.wobbleSpeed += (Math.random() - 0.5) * 0.0005 * speed;
                    p.wobbleSpeed = Math.max(0.02, Math.min(0.15, p.wobbleSpeed));
                }
            });

            angleRef.current += 0.02;

            const centerX = positionRef.current.orbitX;
            const centerY = positionRef.current.orbitY;

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
            document.body.removeEventListener("mouseleave", handleBodyMouseLeave);
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
        </>
    );
};

export default CustomCursor;
