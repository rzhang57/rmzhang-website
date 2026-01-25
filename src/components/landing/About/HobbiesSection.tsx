import {AnimatePresence, motion} from "framer-motion";
import contentData from "@/data/content.json";

interface HobbiesSectionProps {
    setActiveHobby: (index: number) => void;
    activeHobby: number;
}

export default function HobbiesSection({ setActiveHobby, activeHobby}: HobbiesSectionProps) {
    return (
        <div id="hobbies" className="scroll-mt-24">
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-4">
                {contentData.aboutMe.hobbies.title}
            </h2>
            <div className="grid md:grid-cols-[200px_1fr] sm:grid-cols-1 gap-6">
                <div className="space-y-1 bg-muted/30 p-4 border border-foreground/10">
                    {contentData.aboutMe.hobbies.items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveHobby(index)}
                            className={`w-full text-left px-4 py-2.5 transition-all text-sm ${
                                activeHobby === index
                                    ? "bg-foreground text-background font-semibold"
                                    : "text-muted-foreground font-medium hover:bg-muted/50"
                            }`}
                        >
                            {item.category}
                        </button>
                    ))}
                </div>
                <div className="bg-muted/30 p-6 min-h-[200px] flex items-start border border-foreground/10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeHobby}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <h3 className="text-lg font-semibold text-foreground mb-3">
                                {contentData.aboutMe.hobbies.items[activeHobby].category}
                            </h3>
                            <p className="text-muted-foreground md:text-base sm:text-sm leading-relaxed">
                                {contentData.aboutMe.hobbies.items[activeHobby].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
