"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import GlassCard from "@/components/ui/GlassCard";
import HobbiesSection from "@/components/landing/About/HobbiesSection";
import OverviewSection from "@/components/landing/About/OverviewSection";
import WorkSection from "@/components/landing/About/WorkSection";
import MusicSection from "@/components/landing/About/MusicSection";

export default function About() {
    const [activeHobby, setActiveHobby] = useState(0);
    const [showAltImage, setShowAltImage] = useState(false);

    const imageSrc = showAltImage ? "/statics/otherimage.png" : "/statics/potential.jpg";

    function handleAvatarClick() {
        setShowAltImage((prev) => !prev);
    }

    return (
        <div className="w-full max-w-6xl mx-auto max-h-[85vh] overflow-y-auto pr-2 scrollbar-thin">
            <GlassCard iridescent glow className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tighter">
                        who am i?
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Overview section */}
                    <div className="md:col-span-8 flex flex-col justify-center order-2 md:order-1">
                        <OverviewSection />
                    </div>

                    {/* Avatar */}
                    <div className="md:col-span-4 flex justify-center items-start md:items-center order-1 md:order-2 mb-4 md:mb-0">
                        <div onClick={handleAvatarClick} className="cursor-pointer group relative">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={showAltImage ? "alt" : "main"}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: { type: "spring", stiffness: 300, damping: 30 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Avatar className="w-32 h-32 md:w-56 md:h-56 group-hover:scale-105 duration-300 ring-2 ring-white/20">
                                        <AvatarImage src={imageSrc} />
                                    </Avatar>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Work section */}
                    <div className="md:col-span-7 order-3">
                        <div className="glass-subtle rounded-xl p-5 h-full transition-all duration-300 hover:border-white/25">
                            <WorkSection />
                        </div>
                    </div>

                    {/* Music section */}
                    <div className="md:col-span-5 order-4">
                        <div className="glass-subtle rounded-xl p-5 h-full transition-all duration-300 hover:border-white/25">
                            <MusicSection />
                        </div>
                    </div>

                    {/* Hobbies section */}
                    <div className="md:col-span-12 order-5">
                        <div className="glass-subtle rounded-xl p-5 transition-all duration-300 hover:border-white/25">
                            <HobbiesSection setActiveHobby={setActiveHobby} activeHobby={activeHobby} />
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
