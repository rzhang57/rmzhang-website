import type { Metadata } from "next";
import Compare from "@/components/lab/navs/Compare";
import SectionHeading from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "lab — nav",
  description: "liquid nav treatments, side by side.",
};

export default function NavLabPage() {
  return (
    <div className="rise">
      <SectionHeading>nav</SectionHeading>

      <p className="mb-3 max-w-[34rem] text-[15px] leading-relaxed text-muted">
        five ways to move the glass between nav items. every tile runs the same
        route on the same clock, so what differs is only how the shape behaves
        on the way there.
      </p>
      <p className="aside mb-12">
        motion is analytic rather than simulated — the spring has a closed form,
        so a trailing blob is just the same curve evaluated a few milliseconds
        in the past. that is what makes eight of them cost nothing.
      </p>

      <Compare />
    </div>
  );
}
