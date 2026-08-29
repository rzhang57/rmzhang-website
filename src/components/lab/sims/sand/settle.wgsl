import { Grid, cell_index, inside, EMPTY, SAND } from "./grid.wgsl";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> grid: Grid;
@group(0) @binding(1) var<storage, read_write> cells: array<u32>;

fn movable(value: u32) -> bool {
  return value == SAND;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let offset = i32(grid.phase);
  let origin = vec2i(id.xy) * 2 - vec2i(offset, offset);
  if (!inside(origin, grid.size) || !inside(origin + vec2i(1, 1), grid.size)) { return; }

  let top_left = cell_index(origin, grid.size);
  let top_right = cell_index(origin + vec2i(1, 0), grid.size);
  let bottom_left = cell_index(origin + vec2i(0, 1), grid.size);
  let bottom_right = cell_index(origin + vec2i(1, 1), grid.size);

  var a = cells[top_left];
  var b = cells[top_right];
  var c = cells[bottom_left];
  var d = cells[bottom_right];

  if (movable(a) && c == EMPTY) {
    c = a;
    a = EMPTY;
  }
  if (movable(b) && d == EMPTY) {
    d = b;
    b = EMPTY;
  }

  let roll = hash2(vec2f(id.xy) + f32(grid.frame) * 1.371).y;
  if (movable(a) && d == EMPTY && c != EMPTY && roll > 0.5) {
    d = a;
    a = EMPTY;
  }
  if (movable(b) && c == EMPTY && d != EMPTY && roll <= 0.5) {
    c = b;
    b = EMPTY;
  }

  cells[top_left] = a;
  cells[top_right] = b;
  cells[bottom_left] = c;
  cells[bottom_right] = d;
}
