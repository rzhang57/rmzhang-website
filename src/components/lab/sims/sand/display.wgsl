import { Params, PAPER, INK, PEACH, ACCENT, finish } from "../../../shader/common.wgsl";
import { Grid, cell_index, EMPTY, SAND, WALL } from "./grid.wgsl";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<uniform> grid: Grid;
@group(0) @binding(2) var<storage, read> cells: array<u32>;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let coord = vec2i(floor(uv * vec2f(grid.size)));
  let value = cells[cell_index(coord, grid.size)];

  var color = PAPER;
  if (value == SAND) {
    let grade = hash2(vec2f(coord)).x;
    color = PAPER * mix(mix(vec3f(1.0), PEACH, 0.75), mix(vec3f(1.0), ACCENT, 0.45), grade);
    let above = cells[cell_index(coord - vec2i(0, 1), grid.size)];
    if (above == EMPTY) {
      color = mix(color, vec3f(1.0), 0.28);
    }
  } else if (value == WALL) {
    color = mix(PAPER, INK, 0.78);
  }
  return finish(color, position.xy);
}
