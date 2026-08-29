import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/lab/Gallery";
import SectionHeading from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "lab",
  description: "webgpu shader experiments.",
};

export default function LabPage() {
  return (
    <div className="rise">
      <SectionHeading>lab</SectionHeading>

      <p className="mb-3 max-w-[32rem] text-[15px] leading-relaxed text-muted">
        webgpu shaders, each one a candidate for somewhere on this site. every
        tile reacts to the pointer — move across them, and click into ripples,
        metaballs, reaction and sand. hold on fractal, frost and letterpress.
      </p>
      <p className="aside mb-12">
        twenty-two tiles on one device and one render loop, offscreen ones
        paused. fullscreen fragment passes, compute simulations, offscreen
        render targets, and one instanced mesh.
      </p>

      <p className="mb-12">
        <Link
          href="/lab/nav"
          className="row group inline-flex items-baseline gap-1.5 text-[15px] text-faint transition-colors hover:text-ink"
        >
          five liquid nav treatments, side by side
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </p>

      <Gallery />
    </div>
  );
}
