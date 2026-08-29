import { Params, PAPER, INK, BLUE, ACCENT, centered, finish, pointer_falloff } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { safeNormalize2 } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

const STEPS = 18;

fn curl(p: vec2f) -> vec2f {
  let e = 0.09;
  let dy = fbmSimplex2d(p + vec2f(0.0, e), 3, 2.0, 0.5) - fbmSimplex2d(p - vec2f(0.0, e), 3, 2.0, 0.5);
  let dx = fbmSimplex2d(p + vec2f(e, 0.0), 3, 2.0, 0.5) - fbmSimplex2d(p - vec2f(e, 0.0), 3, 2.0, 0.5);
  return vec2f(dy, -dx) / (2.0 * e);
}

fn fibres(p: vec2f) -> f32 {
  return fract(sin(dot(floor(p * 190.0), vec2f(12.9898, 78.233))) * 43758.5453);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let start = centered(uv, params.resolution) * 2.6;

  let stir = pointer_falloff(uv, params.pointer, params.resolution, 6.0) * params.hover;
  let pivot = centered(params.pointer, params.resolution) * 2.6;

  var walk = start;
  var accum = 0.0;
  var total = 0.0;

  for (var i = 0; i < STEPS; i++) {
    var flow = curl(walk * 1.15 + vec2f(0.0, params.time * 0.06));
    let radial = walk - pivot;
    flow += vec2f(-radial.y, radial.x) * stir * 2.4;
    walk += safeNormalize2(flow, vec2f(1.0, 0.0)) * 0.016;
    let weight = 1.0 - f32(i) / f32(STEPS);
    accum += fibres(walk + vec2f(params.time * 0.02, 0.0)) * weight;
    total += weight;
  }

  let lic = clamp((accum / total - 0.5) * 2.6 + 0.5, 0.0, 1.0);
  let silk = smoothstep(0.28, 0.78, lic);

  var color = mix(PAPER, PAPER * BLUE, 0.35);
  color = mix(color, PAPER, silk);
  color = mix(color, INK, (1.0 - silk) * 0.16);
  color = mix(color, ACCENT, (1.0 - silk) * stir * 0.5);
  return finish(color, position.xy);
}
