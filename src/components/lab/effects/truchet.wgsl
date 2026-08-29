import { Params, PAPER, INK, ACCENT, finish, aspect_of } from "../../shader/common.wgsl";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> params: Params;

const CELLS = 9.0;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let scaled = vec2f(uv.x * aspect_of(params.resolution), uv.y) * CELLS;
  let id = floor(scaled);
  var f = fract(scaled) - 0.5;

  let flip = hash2(id + params.seed).x;
  let turn = step(0.5, flip + 0.06 * sin(params.time * 0.5 + id.x * 1.3 + id.y * 0.7));
  if (turn > 0.5) {
    f.x = -f.x;
  }

  let arc_a = abs(length(f - vec2f(0.5, 0.5)) - 0.5);
  let arc_b = abs(length(f + vec2f(0.5, 0.5)) - 0.5);
  let dist = min(arc_a, arc_b);

  let cell_center = (id + 0.5) / CELLS;
  let toward = (vec2f(cell_center.x / aspect_of(params.resolution), cell_center.y) - params.pointer)
    * vec2f(aspect_of(params.resolution), 1.0);
  let near = exp(-dot(toward, toward) * 16.0) * params.hover;

  let weight = 0.055 + 0.05 * near;
  let width = max(fwidth(dist), 0.0001);
  let stroke = 1.0 - smoothstep(weight - width, weight + width, dist);

  var color = mix(PAPER, INK, stroke * 0.7);
  color = mix(color, ACCENT, stroke * near * 0.75);
  return finish(color, position.xy);
}
