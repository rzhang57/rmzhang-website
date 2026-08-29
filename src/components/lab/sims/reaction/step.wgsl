import { Grid, Brush, wrap_index } from "./state.wgsl";

@group(0) @binding(0) var<uniform> grid: Grid;
@group(0) @binding(1) var<uniform> brush: Brush;
@group(0) @binding(2) var<storage, read> src: array<vec2f>;
@group(0) @binding(3) var<storage, read_write> dst: array<vec2f>;

const FEED = 0.037;
const KILL = 0.06;
const DIFFUSE_U = 0.2097;
const DIFFUSE_V = 0.105;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (any(id.xy >= grid.size)) { return; }
  let p = vec2i(id.xy);
  let center = src[wrap_index(p, grid.size)];

  var laplacian = center * -1.0;
  laplacian += src[wrap_index(p + vec2i(-1, 0), grid.size)] * 0.2;
  laplacian += src[wrap_index(p + vec2i(1, 0), grid.size)] * 0.2;
  laplacian += src[wrap_index(p + vec2i(0, -1), grid.size)] * 0.2;
  laplacian += src[wrap_index(p + vec2i(0, 1), grid.size)] * 0.2;
  laplacian += src[wrap_index(p + vec2i(-1, -1), grid.size)] * 0.05;
  laplacian += src[wrap_index(p + vec2i(1, -1), grid.size)] * 0.05;
  laplacian += src[wrap_index(p + vec2i(-1, 1), grid.size)] * 0.05;
  laplacian += src[wrap_index(p + vec2i(1, 1), grid.size)] * 0.05;

  let reaction = center.x * center.y * center.y;
  var u = center.x + DIFFUSE_U * laplacian.x - reaction + FEED * (1.0 - center.x);
  var v = center.y + DIFFUSE_V * laplacian.y + reaction - (FEED + KILL) * center.y;

  if (brush.strength > 0.001) {
    let uv = (vec2f(p) + 0.5) / vec2f(grid.size);
    let aspect = f32(grid.size.x) / f32(grid.size.y);
    let d = (uv - brush.pointer) * vec2f(aspect, 1.0);
    if (dot(d, d) < brush.radius * brush.radius) {
      v = mix(v, 1.0, brush.strength);
    }
  }

  dst[wrap_index(p, grid.size)] = vec2f(clamp(u, 0.0, 1.0), clamp(v, 0.0, 1.0));
}
