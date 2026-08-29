import Link from "next/link";
import Hero from "@/components/landing/Hero";
import CurrentlyPlaying from "@/components/landing/About/CurrentlyPlaying";
import content from "@/data/content.v2.json";

const { elaboration, closing } = content.profile;

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="row group inline-flex items-baseline gap-1.5 text-[15px] text-faint transition-colors hover:text-ink"
    >
      {children}
      <span className="transition-transform group-hover:translate-x-0.5">→</span>
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="rise flex flex-col gap-14">
      <Hero />

      <section className="space-y-4">
        <p className="max-w-[32rem] text-[15px] leading-relaxed text-muted">
          {elaboration}
        </p>
        <More href="/about">more about me</More>
      </section>

      <section className="space-y-4">
        <ol className="max-w-[32rem] space-y-3">
          {content.work.map((job) => (
            <li
              key={job.company}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 text-[15px]"
            >
              <span className="text-faint">{job.period}</span>
              <div className="flex items-baseline justify-between gap-4">
                {job.link ? (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="link text-[15px] text-ink"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-[15px] text-ink">{job.company}</span>
                )}
                <span className="text-faint">{job.role}</span>
              </div>
            </li>
          ))}
        </ol>
        <More href="/work">full history</More>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <More href="/projects">projects</More>
          <More href="/hobbies">hobbies</More>
          <More href="/contact">contact</More>
        </div>
        <p className="aside">{closing}</p>
      </section>

      <CurrentlyPlaying />
    </div>
  );
}
