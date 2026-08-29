import { Params, PAPER, PEACH, BLUE, centered, finish, pointer_falloff } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { rotate2d } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

fn plate(pixel: vec2f, field: vec2f, angle: f32, t: f32) -> f32 {
  let value = fbmSimplex2d(field, 4, 2.05, 0.55) * 0.5 + 0.5;
  let screened = rotate2d(pixel, angle) / 5.5;
  let cell = fract(screened) - 0.5;
  let radius = clamp(value * 0.78, 0.0, 0.7);
  return 1.0 - smoothstep(radius - 0.09, radius + 0.02, length(cell));
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution) * 3.0;

  let drift = pointer_falloff(uv, params.pointer, params.resolution, 4.0) * params.hover;
  let offset = (params.pointer - vec2f(0.5)) * drift * 9.0;

  let warm = plate(position.xy + offset, p + vec2f(params.time * 0.05, 0.0), 0.35, params.time);
  let cool = plate(position.xy - offset, p * 1.08 + vec2f(4.2, -2.1) - vec2f(0.0, params.time * 0.04), -0.52, params.time);

  var color = PAPER;
  color *= mix(vec3f(1.0), PEACH, warm * 0.85);
  color *= mix(vec3f(1.0), BLUE, cool * 0.8);
  return finish(color, position.xy);
}
