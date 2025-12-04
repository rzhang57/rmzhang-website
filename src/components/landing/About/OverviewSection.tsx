import {motion} from "framer-motion";
import contentData from "@/data/content.json";
import {ActiveView} from "@/components/landing/About/About";
import {Dispatch, SetStateAction} from "react";

export interface OverviewSectionProps {
    setActiveView: Dispatch<SetStateAction<ActiveView>>;
}

const OverviewSection = ({setActiveView} : OverviewSectionProps) => {
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
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
}

export default OverviewSection;