import contentData from "@/data/content.json";
import ExpandableCard from "@/components/landing/ExpandableCard";

const WorkSection = () => {
    return (
        <div id="work" className="scroll-mt-24">
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
        </div>
    );
}

export default WorkSection;
