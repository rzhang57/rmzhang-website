import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/landing/SectionHeading";
import content from "@/data/content.v2.json";

const years = Array.from(new Set(content.projects.map((p) => p.year)));

export default function Projects() {
  return (
    <div className="rise">
      <SectionHeading>projects</SectionHeading>

      <div className="space-y-8">
        {years.map((year) => (
          <section key={year} className="grid grid-cols-[4.5rem_1fr] gap-x-4">
            <span className="pt-2 text-[15px] text-faint">{year}</span>

            <ul>
              {content.projects
                .filter((project) => project.year === year)
                .map((project) => (
                  <ProjectCard
                    key={project.name}
                    name={project.name}
                    blurb={project.blurb}
                    lang={project.lang}
                    link={project.link}
                  />
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
