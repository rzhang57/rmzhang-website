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
                <div className="space-y-1 bg-gray-100 p-4 border border-black">
                    {contentData.aboutMe.hobbies.items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveHobby(index)}
                            className={`w-full text-left px-4 py-2.5 text-sm ${
                                activeHobby === index
                                    ? "bg-white text-black font-semibold border border-black"
                                    : "text-muted-foreground font-medium hover:bg-gray-200"
                            }`}
                        >
                            {item.category}
                        </button>
                    ))}
                </div>
                <div className="bg-gray-100 p-6 min-h-[200px] flex items-start border border-black">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-black mb-3">
                            {contentData.aboutMe.hobbies.items[activeHobby].category}
                        </h3>
                        <p className="text-muted-foreground md:text-base sm:text-sm leading-relaxed">
                            {contentData.aboutMe.hobbies.items[activeHobby].description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}