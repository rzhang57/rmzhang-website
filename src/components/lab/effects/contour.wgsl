import { Params, PAPER, INK, PEACH, BLUE, ACCENT, centered, finish, pointer_falloff } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

@group(0) @binding(0) var<uniform> params: Params;

const BANDS = 14.0;

fn height(p: vec2f) -> f32 {
  return fbmSimplex2d(p * 1.5 + vec2f(params.time * 0.015, params.time * 0.008), 5, 2.0, 0.5);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution) * 2.4;

  let hill = pointer_falloff(uv, params.pointer, params.resolution, 6.0) * params.hover;
  let elevation = height(p) + hill * 0.85;

  let scaled = elevation * BANDS;
  let ridge = abs(fract(scaled) - 0.5);
  let width = max(fwidth(scaled), 0.0001);
  let line = 1.0 - smoothstep(0.0, width * 1.6, ridge);

  let index = floor(scaled);
  let major = 1.0 - smoothstep(0.0, width * 2.4, abs(fract(scaled) - 0.5)) * step(0.5, fract(index * 0.25 + 0.001));

  let band = clamp(elevation * 0.5 + 0.5, 0.0, 1.0);
  var color = PAPER * mix(mix(vec3f(1.0), BLUE, 0.16), mix(vec3f(1.0), PEACH, 0.2), band);
  color = mix(color, INK, line * 0.42 + major * 0.18);
  color = mix(color, ACCENT, line * hill * 0.6);
  return finish(color, position.xy);
}
