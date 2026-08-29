import content from "@/data/content.v2.json";

const { statement, elaboration, facts, closing } = content.profile;

export default function OverviewSection() {
  return (
    <div className="space-y-10">
      <p className="text-[15px] leading-[1.45] tracking-[-0.015em]">
        {statement}
      </p>

      <p className="max-w-[32rem] text-[15px] leading-relaxed text-muted">
        {elaboration}
      </p>

      <dl className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 text-[15px]">
        {facts.map((fact) => (
          <div key={fact.label} className="contents">
            <dt className="text-faint">{fact.label}</dt>
            <dd className="text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <p className="aside">{closing}</p>
    </div>
  );
}
