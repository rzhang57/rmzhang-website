import {motion} from "framer-motion";
import contentData from "@/data/content.json";
import ExpandableCard from "@/components/landing/ExpandableCard";

const WorkSection = () => {
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
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
                            className="font-bold text-[#6ca1ff] italic">{exp.company} {'>'} </span> {exp.role}</h3>
                        <p className="font-light">{exp.overview}</p>
                        {
                            exp.description.length > 0 &&
                            <ExpandableCard
                            title={<span className="text-sm italic text-muted-foreground/80">more details</span>}>
                            <ul className="list-disc list-outside mt-2 pl-6 space-y-1 text-muted-foreground text-base">
                                {exp.description.map((point, i) => (
                                    <li key={i} className="leading-relaxed">{point}</li>
                                ))}
                            </ul>
                            </ExpandableCard>
                        }
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default WorkSection;
