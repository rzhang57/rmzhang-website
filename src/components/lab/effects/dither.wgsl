import { Params, PAPER, INK, ACCENT, centered, pointer_falloff } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

@group(0) @binding(0) var<uniform> params: Params;

fn ordered(coord: vec2u) -> f32 {
  var x = coord.x;
  var y = coord.y;
  var value = 0u;
  for (var i = 0u; i < 3u; i++) {
    value = (value << 2u) | (((y & 1u) << 1u) | ((x ^ y) & 1u));
    x = x >> 1u;
    y = y >> 1u;
  }
  return f32(value) / 64.0;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution) * 2.6;

  let field = fbmSimplex2d(p + vec2f(params.time * 0.05, params.time * 0.02), 4, 2.0, 0.55) * 0.5 + 0.5;
  let glow = pointer_falloff(uv, params.pointer, params.resolution, 7.0) * params.hover;
  let value = clamp(field * 1.15 - 0.12 + glow * 0.5, 0.0, 1.0);

  let threshold = ordered(vec2u(position.xy));
  let on = step(threshold, 1.0 - value);

  var color = mix(PAPER, INK, on * 0.88);
  color = mix(color, ACCENT, on * glow * 0.8);
  return vec4f(color, 1.0);
}
