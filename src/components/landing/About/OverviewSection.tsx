import contentData from "@/data/content.json";

const OverviewSection = () => {
    return (
        <div className="h-full flex flex-col justify-center">
            <p className="text-muted-foreground md:text-xl sm:text-sm tracking-tighter leading-relaxed">
                {contentData.aboutMe.overview.intro}
                <a
                    href="#work"
                    className="text-black cursor-pointer relative inline-block group"
                >
                    <span className="relative z-10">{contentData.aboutMe.overview.workClickPrompt}</span>
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-all duration-300 group-hover:h-[6px]"></span>
                </a>{". "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.interests}{" "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.hobbiesIntro}{" "}
                <a
                    href="#hobbies"
                    className="text-black cursor-pointer relative inline-block group"
                >
                    <span className="relative z-10">{contentData.aboutMe.overview.clickPrompt}</span>
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-all duration-300 group-hover:h-[6px]"></span>
                </a>
                {contentData.aboutMe.overview.closing}
            </p>
        </div>
    );
}

export default OverviewSection;