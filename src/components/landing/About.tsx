"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ExpandableCard from "@/components/landing/ExpandableCard";
import contentData from "@/data/content.json";
import GlassCard from "@/components/ui/GlassCard";
import SpotifySection from "@/components/landing/SpotifySection";

type ActiveView = "overview" | "work" | "hobbies" | "music";

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

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const overviewContent = (
        <motion.div
            key="overview"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
        >
            <p className="text-muted-foreground md:text-xl sm:text-sm tracking-tighter">
                {contentData.aboutMe.overview.intro}
                <span
                    className="text-[#6ca1ff] cursor-pointer relative"
                    onClick={() => setActiveView("work")}
                >
                    <span className="hover-underline">{contentData.aboutMe.overview.workClickPrompt}</span>
                    <style jsx>{`
                        .hover-underline {
                            position: relative;
                            display: inline-block;
                        }

                        .hover-underline::after {
                            content: "";
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 0;
                            height: 2px;
                            background: #6ca1ff;
                            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        }

                        .hover-underline:hover::after {
                            width: 100%;
                        }
                    `}</style>
                </span>{". "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.interests}{" "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.hobbiesIntro}{" "}
                <span
                    className="text-pink-400 cursor-pointer relative"
                    onClick={() => setActiveView("hobbies")}
                >
                    <span className="hover-underline">{contentData.aboutMe.overview.clickPrompt}</span>
                    <style jsx>{`
                        .hover-underline {
                            position: relative;
                            display: inline-block;
                        }

                        .hover-underline::after {
                            content: "";
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 0;
                            height: 2px;
                            background: #ec4899;
                            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        }

                        .hover-underline:hover::after {
                            width: 100%;
                        }
                    `}</style>
                </span>
                {contentData.aboutMe.overview.closing}
            </p>
        </motion.div>
    );

    const workContent = (
        <motion.div
            key="work"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
        >
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-3">
                {contentData.aboutMe.work.title}
            </h2>
            <div className="space-y-4 text-muted-foreground md:text-xl sm:text-sm tracking-tighter">
                {contentData.aboutMe.work.experiences.map((exp, index) => (
                    <div key={index}>
                        <h3 className="text-foreground font-medium"><span
                            className="font-bold text-[#6ca1ff] italic pl-0.5">{exp.company} {'>'} </span> {exp.role}</h3>
                        <p className="font-light">{exp.overview}</p>
                        <ExpandableCard
                            title={<span className="text-sm italic text-muted-foreground/80">more details</span>}>
                            <ul className="list-disc list-outside mt-2 pl-6 space-y-1 text-muted-foreground text-base">
                                {exp.description.map((point, i) => (
                                    <li key={i} className="leading-relaxed">{point}</li>
                                ))}
                            </ul>
                        </ExpandableCard>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const hobbiesContent = (
        <motion.div
            key="hobbies"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
        >
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-4">
                {contentData.aboutMe.hobbies.title}
            </h2>
            <div className="grid md:grid-cols-[200px_1fr] sm:grid-cols-1 gap-6">
                <div className="space-y-1 bg-muted/30 rounded-lg p-4">
                    {contentData.aboutMe.hobbies.items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveHobby(index)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm ${
                                activeHobby === index
                                    ? "bg-gray-200 text-[#ec4899] font-semibold shadow-[0_6px_0_0_rgba(236,72,153,0.3)] translate-y-[-2px]"
                                    : "text-muted-foreground font-medium hover:bg-muted/50 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:translate-y-[-1px]"
                            }`}
                        >
                            {item.category}
                        </button>
                    ))}
                </div>
                <div className="bg-muted/30 rounded-lg p-6 min-h-[200px] flex items-start">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeHobby}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <h3 className="text-lg font-semibold text-[#ec4899] mb-3">
                                {contentData.aboutMe.hobbies.items[activeHobby].category}
                            </h3>
                            <p className="text-muted-foreground md:text-base sm:text-sm leading-relaxed">
                                {contentData.aboutMe.hobbies.items[activeHobby].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );

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
                className="relative flex w-fit items-center justify-start rounded-full border border-border bg-muted/50 p-1 ml-0 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as ActiveView)}
                        className={`relative rounded-full h-8 px-2 md:px-4 transition-colors text-xs tracking-tighter md:text-sm font-medium whitespace-nowrap ${
                            activeView === tab.id ? "" : "hover:text-primary"
                        }`}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {activeView === tab.id && (
                            <motion.span
                                layoutId="bubble"
                                className="absolute inset-0 z-10 rounded-full"
                                style={{
                                    backgroundColor: tabColors[activeView],
                                }}
                                transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                            />
                        )}
                        <span
                            className={`relative z-20 ${
                                activeView === tab.id
                                    ? "text-white"
                                    : "text-muted-foreground"
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
                            {activeView === "overview" && overviewContent}
                            {activeView === "work" && workContent}
                            {activeView === "hobbies" && hobbiesContent}
                            {activeView === "music" && <SpotifySection/>}
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