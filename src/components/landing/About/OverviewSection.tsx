import contentData from "@/data/content.json";

const OverviewSection = () => {
    return (
        <div className="h-full flex flex-col justify-center">
            <p className="text-muted-foreground md:text-xl sm:text-sm tracking-tighter leading-relaxed">
                {contentData.aboutMe.overview.intro}
                <a
                    href="#work"
                    className="text-black underline cursor-pointer"
                >
                    {contentData.aboutMe.overview.workClickPrompt}
                </a>{". "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.interests}{" "}
                <br/>
                <br/>
                {contentData.aboutMe.overview.hobbiesIntro}{" "}
                <a
                    href="#hobbies"
                    className="text-black underline cursor-pointer"
                >
                    {contentData.aboutMe.overview.clickPrompt}
                </a>
                {contentData.aboutMe.overview.closing}
            </p>
        </div>
    );
}

export default OverviewSection;