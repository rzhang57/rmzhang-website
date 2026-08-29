import { Grid, Pour, cell_index, EMPTY, SAND } from "./grid.wgsl";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> grid: Grid;
@group(0) @binding(1) var<uniform> pour: Pour;
@group(0) @binding(2) var<storage, read_write> cells: array<u32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (any(id.xy >= grid.size)) { return; }
  if (pour.amount < 0.001) { return; }

  let p = vec2i(id.xy);
  let uv = (vec2f(id.xy) + 0.5) / vec2f(grid.size);
  let aspect = f32(grid.size.x) / f32(grid.size.y);
  let d = (uv - pour.pointer) * vec2f(aspect, 1.0);
  if (dot(d, d) > pour.radius * pour.radius) { return; }

  let roll = hash2(vec2f(id.xy) + f32(grid.frame) * 0.719).x;
  let index = cell_index(p, grid.size);
  if (cells[index] == EMPTY && roll < pour.amount) {
    cells[index] = SAND;
  }
}
