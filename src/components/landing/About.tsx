"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LinkCustom from "@/components/landing/LinkCustom";
import ExpandableCard from "@/components/landing/ExpandableCard";
import contentData from "@/data/content.json";

export default function About() {
    const [activeView, setActiveView] = useState<"overview" | "hobbies">(
        "overview"
    );

    const imageSrc =
        activeView === "overview"
            ? "/statics/myface.jpg"
            : "/statics/otherimage.png";

    function handleAvatarClick() {
        setActiveView((prev) => (prev === "overview" ? "hobbies" : "overview"));
    }

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const aboutMeNormal = (
        <motion.div
            key="overview"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
        >
            <p className="text-muted-foreground md:text-xl sm:text-sm tracking-tighter">
                {contentData.aboutMe.normal.intro}{" "}
                <LinkCustom
                    href={contentData.aboutMe.normal.copilotLink.href}
                    label={contentData.aboutMe.normal.copilotLink.label}
                />
                {contentData.aboutMe.normal.description}
                <br />
                <br />
                {contentData.aboutMe.normal.hobbiesIntro}{" "}
                <span
                    className="text-pink-400 cursor-pointer relative"
                    onClick={() => setActiveView("hobbies")}
                >
                    <span className="hover-underline">{contentData.aboutMe.normal.clickPrompt}</span>
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
                            transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
                        }
                        .hover-underline:hover::after {
                            width: 100%;
                        }
                    `}</style>
                </span>{" "}
                {contentData.aboutMe.normal.closing}
            </p>
        </motion.div>
    );

    const aboutHobbies = (
        <motion.div
            key="hobbies"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
        >
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-3">
                {contentData.aboutMe.hobbies.title}
            </h2>
            <div className="space-y-1">
                {contentData.aboutMe.hobbies.items.map((item, index) => (
                    <ExpandableCard key={index} title={item.category}>
                        {item.description}
                    </ExpandableCard>
                ))}
            </div>
        </motion.div>
    );

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "hobbies", label: "Deep dive" },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="md:text-3xl sm:text-xl font-extrabold tracking-tighter">
                    who am i?
                </h1>
            </div>

            <div
                className="relative flex w-fit items-center justify-start rounded-full border border-border bg-muted/50 p-1 ml-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as "overview" | "hobbies")}
                        className={`relative rounded-full h-8 px-4 transition-colors text-sm font-medium ${
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
                                    backgroundColor:
                                        activeView === "overview"
                                            ? "#ff91c1"
                                            : "#ff3189",
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
                    <AnimatePresence mode="wait">
                        {activeView === "overview" ? aboutMeNormal : aboutHobbies}
                    </AnimatePresence>
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
                                <Avatar className="md:w-48 md:h-48 sm:h-32 sm:w-32">
                                    <AvatarImage src={imageSrc}/>
                                </Avatar>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}