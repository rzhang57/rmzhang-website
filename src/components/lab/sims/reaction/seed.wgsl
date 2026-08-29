import { Grid, wrap_index } from "./state.wgsl";
import { hash2 } from "@vgpu/wgsl-std/hash";

@group(0) @binding(0) var<uniform> grid: Grid;
@group(0) @binding(1) var<storage, read_write> cells: array<vec2f>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (any(id.xy >= grid.size)) { return; }
  let p = (vec2f(id.xy) + 0.5) / vec2f(grid.size);
  let aspect = f32(grid.size.x) / f32(grid.size.y);

  var v = 0.0;
  for (var i = 0; i < 9; i++) {
    let center = hash2(vec2f(f32(i) * 4.13 + 0.7, f32(i) * 1.91 + 2.3));
    let d = (p - center) * vec2f(aspect, 1.0);
    if (dot(d, d) < 0.0014) {
      v = 1.0;
    }
  }
  cells[wrap_index(vec2i(id.xy), grid.size)] = vec2f(1.0, v);
}
