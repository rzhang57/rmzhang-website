import SectionHeading from "@/components/landing/SectionHeading";
import ResumeIcon from "@/components/landing/ResumeIcon";
import content from "@/data/content.v2.json";

export default function WorkSection() {
  return (
    <div className="rise">
      <SectionHeading>work</SectionHeading>

      <ol className="space-y-9">
        {content.work.map((job) => (
          <li
            key={job.company}
            className="grid grid-cols-[4.5rem_1fr] gap-x-4 text-[15px]"
          >
            <span className="pt-[2px] text-faint">{job.period}</span>

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] text-ink">{job.company}</span>
                <span className="text-faint">{job.role}</span>
              </div>

              {job.notes.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {job.notes.map((note) => (
                    <li key={note} className="leading-relaxed text-muted">
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-14">
        <ResumeIcon />
      </p>
    </div>
  );
}
