import { Params, PAPER, PEACH, BLUE, LILAC, INK, centered, finish } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

@group(0) @binding(0) var<uniform> params: Params;

const TAU = 6.2831855;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution) * 2.0;

  let wedges = 6.0 + floor(params.pointer.x * 6.0) * params.hover;
  let segment = TAU / wedges;

  let radius = length(p);
  var angle = atan2(p.y, p.x) + params.time * 0.06;
  angle = abs(fract(angle / segment) - 0.5) * segment;

  let folded = vec2f(cos(angle), sin(angle)) * radius;
  let warped = folded + vec2f(
    fbmSimplex2d(folded * 1.7 + vec2f(0.0, params.time * 0.07), 3, 2.0, 0.5),
    fbmSimplex2d(folded * 1.7 + vec2f(5.1, -params.time * 0.05), 3, 2.0, 0.5),
  ) * 0.35;

  let shape = fbmSimplex2d(warped * 2.1, 4, 2.0, 0.5) * 0.5 + 0.5;
  let rings = 0.5 + 0.5 * sin(radius * 9.0 - params.time * 0.5 + shape * 4.0);

  var tint = mix(PEACH, BLUE, shape);
  tint = mix(tint, LILAC, rings * 0.6);

  var color = PAPER * mix(vec3f(1.0), tint, 0.22 + 0.34 * shape);
  color = mix(color, INK, smoothstep(0.86, 0.99, rings) * 0.18);
  color = mix(color, PAPER, smoothstep(0.9, 1.6, radius));
  return finish(color, position.xy);
}
