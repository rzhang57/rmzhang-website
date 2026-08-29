import { Params, PAPER, INK, ACCENT, finish, aspect_of } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { safeNormalize2 } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

const CELL = 20.0;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let grid = position.xy / CELL;
  let id = floor(grid);
  let f = fract(grid) - 0.5;
  let center = (id + 0.5) * CELL / params.resolution;

  let drift = vec2f(params.time * 0.05, params.time * 0.018);
  let field = fbmSimplex2d(id * 0.055 + drift, 3, 2.0, 0.5) * 0.5 + 0.5;

  let toward = (center - params.pointer) * vec2f(aspect_of(params.resolution), 1.0);
  let pull = exp(-dot(toward, toward) * 22.0) * params.hover;

  let radius = 0.1 + 0.2 * field + 0.34 * pull;
  let lean = safeNormalize2(toward, vec2f(0.0, 0.0)) * pull * 0.3;
  let mask = 1.0 - smoothstep(radius - 0.11, radius, length(f + lean));

  var color = mix(PAPER, INK, mask * 0.62);
  color = mix(color, ACCENT, mask * pull * 0.55);
  return finish(color, position.xy);
}
