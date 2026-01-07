"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import GlassCard from "@/components/ui/GlassCard";
import HobbiesSection from "@/components/landing/About/HobbiesSection";
import OverviewSection from "@/components/landing/About/OverviewSection";
import WorkSection from "@/components/landing/About/WorkSection";
import MusicSection from "@/components/landing/About/MusicSection";

export type ActiveView = "overview" | "work" | "hobbies" | "music";

export default function About() {
    const [activeView, setActiveView] = useState<ActiveView>("overview");
    const [activeHobby, setActiveHobby] = useState(0);

    const imageSrc =
        activeView === "overview" || activeView === "work"
            ? "/statics/potential.jpg"
            : "/statics/otherimage.png";

    function handleAvatarClick() {
        setActiveView((prev) => (prev === "overview" ? "hobbies" : "overview"));
    }

    const tabs = [
        { id: "overview", label: "overview" },
        { id: "work", label: "my work" },
        { id: "hobbies", label: "my hobbies" },
        { id: "music", label: "on repeat" },
    ];

    const tabColors: Record<ActiveView, string> = {
        overview: "#ff91c1",
        work: "#6ca1ff",
        hobbies: "#ff3189",
        music: "#1db954",
    };

    return (
        <GlassCard>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-extrabold tracking-tighter">
                    who am i?
                </h1>
            </div>
            <div
                className="relative flex w-fit items-center justify-start border border-white/20 bg-white/10 p-1.5 ml-0 overflow-x-auto shadow-sm backdrop-blur-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as ActiveView)}
                        className={`relative h-9 px-4 md:px-6 transition-all duration-200 text-xs tracking-tight md:text-sm font-semibold whitespace-nowrap`}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {activeView === tab.id && (
                            <motion.span
                                layoutId="bubble"
                                className="absolute inset-0 z-10 shadow-sm backdrop-blur-sm"
                                style={{
                                    background: tabColors[activeView],
                                    boxShadow: `inset 0 1px 1px rgba(255,255,255,0.4), 0 0 20px ${tabColors[activeView]}80`
                                }}
                                transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                            />
                        )}
                        <span
                            className={`relative z-20 ${
                                activeView === tab.id
                                    ? "text-white font-bold drop-shadow-md"
                                    : "text-muted-foreground/80 hover:text-primary transition-colors"
                            }`}
                        >
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-[3fr_1fr] sm:grid-cols-1 items-start gap-8 w-full mt-4">
                <div className="min-h-[250px]">
                    <motion.div
                        key={activeView}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                        style={{overflow: "hidden"}}
                    >
                        <AnimatePresence mode="wait">
                            {activeView === "overview" && <OverviewSection setActiveView={setActiveView}/>}
                            {activeView === "work" && <WorkSection/>}
                            {activeView === "hobbies" &&
                                <HobbiesSection setActiveHobby={setActiveHobby} activeHobby={activeHobby}/>}
                            {activeView === "music" && <MusicSection/>}
                        </AnimatePresence>
                    </motion.div>
                </div>
                <div className="flex justify-center items-start">
                    <div onClick={handleAvatarClick} className="cursor-pointer">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={activeView}
                                initial={{opacity: 0, y: 50}}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {type: "spring", stiffness: 300, damping: 30}
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -50,
                                    transition: {type: "spring", stiffness: 300, damping: 30}
                                }}
                            >
                                <Avatar className="w-36 h-36 md:w-48 md:h-48">
                                    <AvatarImage src={imageSrc}/>
                                </Avatar>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}