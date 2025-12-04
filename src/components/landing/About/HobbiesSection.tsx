import {AnimatePresence, motion} from "framer-motion";
import contentData from "@/data/content.json";

interface HobbiesSectionProps {
    setActiveHobby: (index: number) => void;
    activeHobby: number;
}

export default function HobbiesSection({ setActiveHobby, activeHobby}: HobbiesSectionProps) {
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
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
}