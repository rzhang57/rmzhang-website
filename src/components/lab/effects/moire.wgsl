import { Params, PAPER, INK, PEACH, BLUE, centered, finish } from "../../shader/common.wgsl";
import { rotate2d } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

fn rules(p: vec2f, angle: f32, freq: f32) -> f32 {
  let q = rotate2d(p, angle);
  return 0.5 + 0.5 * sin(q.y * freq);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let lead = params.time * 0.04;
  let spread = 0.035 + (params.pointer.x - 0.5) * 0.14 * params.hover;
  let pitch = 150.0 + (params.pointer.y - 0.5) * 90.0 * params.hover;

  let a = rules(p, lead, pitch);
  let b = rules(p, lead + spread, pitch * 1.015);
  let c = rules(p - vec2f(0.0, 0.02), lead - spread * 0.6, pitch * 0.985);

  let warm = smoothstep(0.42, 0.72, a * b);
  let cool = smoothstep(0.45, 0.75, b * c);

  var color = PAPER;
  color *= mix(vec3f(1.0), PEACH, warm * 0.55);
  color *= mix(vec3f(1.0), BLUE, cool * 0.5);
  color = mix(color, INK, warm * cool * 0.35);
  return finish(color, position.xy);
}
