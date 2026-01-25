import contentData from "@/data/content.json";

const OverviewSection = () => {
    return (
        <div className="h-full flex flex-col justify-center">
            <p className="text-muted-foreground md:text-xl sm:text-sm tracking-tighter leading-relaxed">
                {contentData.aboutMe.overview.intro}
                <a
                    href="#work"
                    className="text-foreground cursor-pointer relative inline-block group underline underline-offset-4"
                >
                    <span className="relative z-10">{contentData.aboutMe.overview.workClickPrompt}</span>
                </a>{". "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.interests}{" "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.hobbiesIntro}{" "}
                <a
                    href="#hobbies"
                    className="text-foreground cursor-pointer relative inline-block group underline underline-offset-4"
                >
                    <span className="relative z-10">{contentData.aboutMe.overview.clickPrompt}</span>
                </a>
                {contentData.aboutMe.overview.closing}
            </p>
        </div>
    );
}

export default OverviewSection;
