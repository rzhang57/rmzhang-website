import { Params, PAPER, PEACH, BLUE, LILAC, ACCENT, centered, finish, pointer_falloff } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { rotate2d } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

fn warp(p: vec2f, t: f32) -> vec2f {
  let a = fbmSimplex2d(p + vec2f(0.0, t * 0.08), 4, 2.0, 0.5);
  let b = fbmSimplex2d(p + vec2f(3.7, -1.2) + vec2f(t * 0.05, 0.0), 4, 2.0, 0.5);
  return p + vec2f(a, b) * 0.85;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  var p = centered(uv, params.resolution) * 2.2;

  let swirl = pointer_falloff(uv, params.pointer, params.resolution, 9.0) * params.hover;
  let pivot = centered(params.pointer, params.resolution) * 2.2;
  p = pivot + rotate2d(p - pivot, swirl * 1.9);

  let q = warp(warp(p, params.time), params.time * 0.7);
  let bands = sin(q.y * 4.6 + q.x * 1.8 + params.time * 0.35) * 0.5 + 0.5;
  let sheen = sin(q.x * 2.4 - q.y * 1.1 - params.time * 0.22) * 0.5 + 0.5;

  var tint = mix(PEACH, BLUE, bands);
  tint = mix(tint, LILAC, sheen * 0.65);
  tint = mix(tint, ACCENT, swirl * 0.35);

  let density = 0.32 + 0.3 * bands * sheen + 0.25 * swirl;
  var color = PAPER * mix(vec3f(1.0), tint, density);
  color = mix(color, PAPER, 0.18);
  return finish(color, position.xy);
}
