"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import GlassCard from "@/components/ui/GlassCard";
import HobbiesSection from "@/components/landing/About/HobbiesSection";
import OverviewSection from "@/components/landing/About/OverviewSection";
import WorkSection from "@/components/landing/About/WorkSection";
import MusicSection from "@/components/landing/About/MusicSection";

export default function About() {
    const [activeHobby, setActiveHobby] = useState(0);
    const [showAltImage, setShowAltImage] = useState(false);

    const imageSrc = showAltImage ? "/statics/otherimage.png" : "/statics/potential2.jpg";

    function handleAvatarClick() {
        setShowAltImage((prev) => !prev);
    }

    return (
        <GlassCard className="w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold tracking-tighter">
                    who am i?
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 flex flex-col justify-center order-2 md:order-1">
                    <OverviewSection />
                </div>

                <div className="md:col-span-4 flex justify-center items-start md:items-center order-1 md:order-2 mb-6 md:mb-0">
                    <div onClick={handleAvatarClick} className="cursor-pointer">
                        <Avatar className="w-36 h-36 md:w-72 md:h-72">
                            <AvatarImage src={imageSrc} />
                        </Avatar>
                    </div>
                </div>

                <div className="md:col-span-7 order-3">
                    <div className="bg-gray-50 p-6 border border-black h-full">
                        <WorkSection />
                    </div>
                </div>

                <div className="md:col-span-5 order-4">
                     <div className="bg-gray-50 p-6 border border-black h-full">
                        <MusicSection />
                    </div>
                </div>

                <div className="md:col-span-12 order-5">
                     <div className="bg-gray-50 p-6 border border-black">
                        <HobbiesSection setActiveHobby={setActiveHobby} activeHobby={activeHobby} />
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}