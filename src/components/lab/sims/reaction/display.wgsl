import { Params, PAPER, INK, PEACH, BLUE, LILAC, finish } from "../../../shader/common.wgsl";
import { Grid, wrap_index } from "./state.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<uniform> grid: Grid;
@group(0) @binding(2) var<storage, read> cells: array<vec2f>;

fn sample_cells(uv: vec2f) -> vec2f {
  let coord = uv * vec2f(grid.size) - 0.5;
  let base = vec2i(floor(coord));
  let f = fract(coord);
  let bottom = mix(cells[wrap_index(base, grid.size)], cells[wrap_index(base + vec2i(1, 0), grid.size)], f.x);
  let top = mix(
    cells[wrap_index(base + vec2i(0, 1), grid.size)],
    cells[wrap_index(base + vec2i(1, 1), grid.size)],
    f.x,
  );
  return mix(bottom, top, f.y);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let state = sample_cells(uv);

  let texel = 1.0 / vec2f(grid.size);
  let slope = vec2f(
    sample_cells(uv + vec2f(texel.x, 0.0)).y - sample_cells(uv - vec2f(texel.x, 0.0)).y,
    sample_cells(uv + vec2f(0.0, texel.y)).y - sample_cells(uv - vec2f(0.0, texel.y)).y,
  );
  let relief = clamp(dot(normalize(slope + vec2f(1e-6)), normalize(vec2f(-0.7, -0.7))) * length(slope) * 6.0, -1.0, 1.0);

  let density = smoothstep(0.08, 0.34, state.y);
  let edge = 1.0 - smoothstep(0.0, 0.16, abs(state.y - 0.21));

  var tint = mix(PEACH, BLUE, clamp(state.x * 1.4 - 0.2, 0.0, 1.0));
  tint = mix(tint, LILAC, edge * 0.5);

  var color = PAPER * mix(vec3f(1.0), tint, density * 0.7);
  color = mix(color, INK, density * 0.42 + edge * 0.16);
  color *= 1.0 + relief * 0.16;
  return finish(color, position.xy);
}
