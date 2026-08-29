import type { ShaderSource } from "vgpu";
import spring from "./spring.wgsl";
import chain from "./chain.wgsl";
import stretch from "./stretch.wgsl";
import droplet from "./droplet.wgsl";
import viscous from "./viscous.wgsl";

export interface NavVariant {
  id: string;
  title: string;
  note: string;
  detail: string;
  source: ShaderSource;
}

export const navVariants: NavVariant[] = [
  {
    id: "spring",
    title: "spring",
    note: "what the site runs now",
    detail:
      "two rounded boxes — the pill and one lagging copy — merged with a smooth minimum. underdamped spring, 3% overshoot, settles in about 750ms. the baseline to judge the rest against.",
    source: spring,
  },
  {
    id: "chain",
    title: "chain",
    note: "eight-link metaball rope",
    detail:
      "the same spring curve sampled at eight points in the past, each one smaller than the last, all melted together. the blend radius grows with the gap between links so the body never snaps. the most literally liquid of the five.",
    source: chain,
  },
  {
    id: "stretch",
    title: "stretch",
    note: "squash and stretch",
    detail:
      "one blob, no trail. velocity comes from differentiating the spring, and the shape elongates along travel while thinning across it — volume roughly preserved. a leading bulge runs slightly ahead of centre so it reads as being pulled rather than dragged.",
    source: stretch,
  },
  {
    id: "droplet",
    title: "droplet",
    note: "surface tension, breaks and reforms",
    detail:
      "a deliberately weak blend, so at speed the body tears into beads that trail behind and get reabsorbed on arrival. the beads shrink the further back they are. closest to water, furthest from a nav.",
    source: droplet,
  },
  {
    id: "viscous",
    title: "viscous",
    note: "honey — slow, no overshoot",
    detail:
      "a ten-link chain on a quintic ease instead of a spring, so it never overshoots: it accelerates slowly, glides, and thickens to a stop. a standing ripple runs around the perimeter the whole time.",
    source: viscous,
  },
];
