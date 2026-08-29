import { Grid, cell_index, EMPTY, WALL } from "./grid.wgsl";

@group(0) @binding(0) var<uniform> grid: Grid;
@group(0) @binding(1) var<storage, read_write> cells: array<u32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (any(id.xy >= grid.size)) { return; }
  let p = vec2i(id.xy);
  let uv = (vec2f(id.xy) + 0.5) / vec2f(grid.size);

  var value = EMPTY;
  if (uv.y > 0.955) {
    value = WALL;
  }
  let ledge = abs(uv.y - 0.62) < 0.018 && uv.x > 0.16 && uv.x < 0.62;
  let ramp = abs(uv.y - 0.34 - (uv.x - 0.5) * 0.12) < 0.016 && uv.x > 0.42 && uv.x < 0.9;
  if (ledge || ramp) {
    value = WALL;
  }
  cells[cell_index(p, grid.size)] = value;
}
