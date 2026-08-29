import content from "@/data/content.v2.json";

export default function Hero() {
  return (
    <section>
      <h1 className="mb-4 text-[2rem] font-normal leading-none tracking-[-0.03em]">
        ryan zhang
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">
        incoming swe intern{" "}
        <a
          href="https://mercury.com"
          target="_blank"
          rel="noreferrer"
          className="link text-ink"
        >
          @ mercury
        </a>
        . third year{" "}
        <a
          href="https://www.cs.ubc.ca"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          cs at ubc
        </a>
        .
      </p>
      <p className="aside mt-5">{content.profile.statement}</p>
    </section>
  );
}
