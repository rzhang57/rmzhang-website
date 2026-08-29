import { Params, PAPER, INK, PEACH, LILAC, ACCENT, centered, finish, pointer_falloff } from "../../shader/common.wgsl";
import { voronoi2d } from "@vgpu/wgsl-std/noise";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> params: Params;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  var p = centered(uv, params.resolution) * 7.0;

  let push = pointer_falloff(uv, params.pointer, params.resolution, 5.0) * params.hover;
  let pivot = centered(params.pointer, params.resolution) * 7.0;
  p += (p - pivot) * push * 0.55;
  p += vec2f(sin(params.time * 0.13), cos(params.time * 0.11)) * 0.6;

  let cells = voronoi2d(p);
  let edge = cells.f2 - cells.f1;
  let border = 1.0 - smoothstep(0.02, 0.09, edge);

  let key = hash2(vec2f(cells.cell) + params.seed);
  let tint = mix(PEACH, LILAC, key.x);
  let fill = 0.05 + 0.11 * key.y;

  var color = PAPER * mix(vec3f(1.0), tint, fill);
  color = mix(color, INK, border * 0.5);
  color = mix(color, ACCENT, border * push * 0.7);
  return finish(color, position.xy);
}
