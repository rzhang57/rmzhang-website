import type { Gpu, ShaderSource } from "vgpu";
import type { Simulation } from "@/components/shader/engine";
import { createReaction } from "./sims/reaction";
import { createSand } from "./sims/sand";
import { createBacklit } from "./sims/backlit";
import { createFrost } from "./sims/frost";
import { createMarks } from "./sims/marks";
import { createPenguin } from "./sims/penguin";
import { createFluid } from "./sims/fluid";
import halftone from "./effects/halftone.wgsl";
import mercury from "./effects/mercury.wgsl";
import ribbon from "./effects/ribbon.wgsl";
import caustics from "./effects/caustics.wgsl";
import voronoi from "./effects/voronoi.wgsl";
import riso from "./effects/riso.wgsl";
import flowfield from "./effects/flowfield.wgsl";
import glass from "./effects/glass.wgsl";
import contour from "./effects/contour.wgsl";
import truchet from "./effects/truchet.wgsl";
import moire from "./effects/moire.wgsl";
import dither from "./effects/dither.wgsl";
import kaleido from "./effects/kaleido.wgsl";
import ripples from "./effects/ripples.wgsl";
import fractal from "./effects/fractal.wgsl";
import metaballs from "./effects/metaballs.wgsl";
import letterpress from "./effects/letterpress.wgsl";

export interface LabEffect {
  id: string;
  title: string;
  note: string;
  detail: string;
  source?: ShaderSource;
  simulation?: (gpu: Gpu) => Simulation;
}

export const catalog: LabEffect[] = [
  {
    id: "reaction",
    title: "reaction",
    note: "gray-scott, on compute",
    detail:
      "the only tile here that is a real simulation rather than a formula: two chemicals diffusing at different rates across a 320x176 grid, ten compute steps per frame, ping-ponged between buffers. hover to seed, hold to flood it — the pattern it grows is never the same twice.",
    simulation: createReaction,
  },
  {
    id: "frost",
    title: "frost",
    note: "screen-space transmission",
    detail:
      "the page renders to an offscreen target, gets blurred through a separable two-pass chain, and the panel mixes sharp against frosted by roughness while bending each colour channel differently. this is how real frosted glass is done — the analytic version on the home page only fakes it. hold to polish it clear.",
    simulation: createFrost,
  },
  {
    id: "sand",
    title: "sand",
    note: "falling-sand automaton",
    detail:
      "a margolus block automaton: cells are processed in 2x2 blocks whose offset alternates every step, so no two threads ever contend for the same write and the whole grid falls in parallel without locks. click to pour, hold to open the tap.",
    simulation: createSand,
  },
  {
    id: "marks",
    title: "marks",
    note: "instanced geometry",
    detail:
      "the only tile with a real vertex stage: one quad and one instance stream, 3,744 billboarded marks projected by hand-rolled perspective onto a travelling wave. no depth buffer — premultiplied blending keeps it order-independent.",
    simulation: createMarks,
  },
  {
    id: "backlit",
    title: "backlit",
    note: "hdr bloom chain",
    detail:
      "five passes across four rgba16float targets: scene, threshold, horizontal blur, vertical blur, composite. light is stored over-bright and only what exceeds the cutoff blooms, so it bleeds around the ink like paper held to a lamp.",
    simulation: createBacklit,
  },
  {
    id: "letterpress",
    title: "letterpress",
    note: "deboss and rake",
    detail:
      "no colour does the work here — the plate is pressed into the sheet as a height field, and everything you see is its gradient lit at a grazing angle. move across to rake the light, hold to press harder.",
    source: letterpress,
  },
  {
    id: "penguin",
    title: "penguin",
    note: "your pfp, voxelised",
    detail:
      "pfp.png fetched at runtime, keyed off its white background, flood-filled from the border so the white belly counts as body rather than background, downsampled to a 104-wide grid, then run through a two-pass chamfer distance transform so each cell knows how far it sits from the silhouette. that distance becomes depth — the body bulges, the flippers stay thin — and each of the 2,066 surviving cells is one instanced cube carrying two colours — the sampled front and a derived back, so orbiting past 90 degrees shows a solid blue reverse with orange feet instead of a second face. drag to orbit, hold to blow it apart.",
    simulation: createPenguin,
  },
  {
    id: "fluid",
    title: "fluid",
    note: "navier-stokes, on compute",
    detail:
      "semi-lagrangian velocity advection, vorticity confinement and a jacobi pressure projection over a 128x72 grid, dyeing a 512x288 field. nine compute dispatches per step. this ran as the site backdrop for a while; it lives here now.",
    simulation: createFluid,
  },
  {
    id: "mercury",
    title: "mercury",
    note: "raymarched liquid metal",
    detail:
      "signed-distance droplets smooth-unioned into one body, lit by a fake studio env. the fourth droplet chases your cursor.",
    source: mercury,
  },
  {
    id: "halftone",
    title: "halftone",
    note: "the dot grid, alive",
    detail:
      "your existing 26px dotgrid, but every dot sizes itself from a noise field and swells away from the pointer.",
    source: halftone,
  },
  {
    id: "glass",
    title: "glass",
    note: "dispersion lens",
    detail:
      "a rounded slab refracting the page behind it, sampled once per channel for chromatic fringing. drop this on project cards.",
    source: glass,
  },
  {
    id: "ribbon",
    title: "ribbon",
    note: "iridescent bands",
    detail:
      "double domain-warped simplex noise banded into silk. closest sibling to the fluid backdrop, far cheaper.",
    source: ribbon,
  },
  {
    id: "caustics",
    title: "caustics",
    note: "light through water",
    detail:
      "five feedback iterations of a distorted lattice, read as pooled light on paper rather than glow on black.",
    source: caustics,
  },
  {
    id: "flowfield",
    title: "flowfield",
    note: "curl-noise silk",
    detail:
      "line integral convolution — each pixel walks 18 steps along a curl-noise field and averages what it passes.",
    source: flowfield,
  },
  {
    id: "voronoi",
    title: "voronoi",
    note: "crystalline cells",
    detail:
      "f2 minus f1 gives hairline borders. cells scatter outward from the pointer like tapping a sheet of glass.",
    source: voronoi,
  },
  {
    id: "riso",
    title: "riso",
    note: "two-plate print",
    detail:
      "peach and blue halftone plates screened at opposing angles. the pointer knocks them out of registration.",
    source: riso,
  },
  {
    id: "fractal",
    title: "fractal",
    note: "raymarched sierpinski",
    detail:
      "nine fold-and-scale iterations turn a point into a tetrahedron of infinite detail. step count doubles as free ambient occlusion. drag to spin it, hold to fly the camera in.",
    source: fractal,
  },
  {
    id: "contour",
    title: "contour",
    note: "topographic lines",
    detail:
      "fbm read as elevation, banded into isolines whose width comes from fwidth so they stay hairline at any zoom. the pointer raises a hill and the contours bunch around it.",
    source: contour,
  },
  {
    id: "metaballs",
    title: "metaballs",
    note: "surface tension",
    detail:
      "five inverse-square fields summed and thresholded at one, so blobs bulge toward each other before they touch. your pointer is the sixth; clicking spawns one that swells, drifts upward and dissolves.",
    source: metaballs,
  },
  {
    id: "ripples",
    title: "ripples",
    note: "wave interference",
    detail:
      "four radial wave sources summed into a height field, then finite-differenced into a normal for real specular. click to drop a wavefront — it expands, decays, and interferes with everything already there.",
    source: ripples,
  },
  {
    id: "truchet",
    title: "truchet",
    note: "tiled arcs",
    detail:
      "each cell flips a coin and draws one of two quarter-arc pairs. neighbouring cells always meet, so continuous paths emerge from pure randomness.",
    source: truchet,
  },
  {
    id: "moire",
    title: "moire",
    note: "interference print",
    detail:
      "three line gratings at near-identical pitch. the pattern you see exists in neither of them. pointer x splits the angle, pointer y drives the pitch.",
    source: moire,
  },
  {
    id: "dither",
    title: "dither",
    note: "1-bit ordered",
    detail:
      "a bayer threshold matrix built from bit interleaving, quantising smooth noise to pure ink or pure paper. no greys at all — every pixel is one or the other.",
    source: dither,
  },
  {
    id: "kaleido",
    title: "kaleido",
    note: "mirrored wedges",
    detail:
      "polar fold into six wedges before sampling a warped noise field, so every sample is reflected into a rosette. pointer x adds wedges.",
    source: kaleido,
  },
];
