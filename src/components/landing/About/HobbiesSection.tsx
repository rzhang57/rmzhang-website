import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import contentData from "@/data/content.json";

export default function HobbiesSection() {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div id="hobbies" className="scroll-mt-24">
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-6">
                {contentData.aboutMe.hobbies.title} & interests
            </h2>

            <ul>
                {contentData.aboutMe.hobbies.items.map((item, index) => {
                    const isOpen = expanded === index;
                    return (
                        <li
                            key={index}
                            className="border-t border-b border-gray-300 -mt-px transition-colors hover:bg-gray-500/5"
                        >
                            <button
                                onClick={() => setExpanded(isOpen ? null : index)}
                                className="w-full flex items-center gap-4 py-4 px-2 text-left"
                            >
                                <span className="flex-1 font-semibold text-sm md:text-base">
                                    {item.category}
                                </span>
                                <motion.span
                                    animate={{ rotate: isOpen ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-muted-foreground"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </motion.span>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pl-12 pr-8 pb-5 text-muted-foreground md:text-base sm:text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
