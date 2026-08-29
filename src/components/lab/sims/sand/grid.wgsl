export struct Grid {
  size: vec2u,
  phase: u32,
  frame: u32,
}

export struct Pour {
  pointer: vec2f,
  radius: f32,
  amount: f32,
}

export const EMPTY: u32 = 0u;
export const SAND: u32 = 1u;
export const WALL: u32 = 2u;

export fn cell_index(p: vec2i, size: vec2u) -> u32 {
  let x = clamp(p.x, 0, i32(size.x) - 1);
  let y = clamp(p.y, 0, i32(size.y) - 1);
  return u32(y) * size.x + u32(x);
}

export fn inside(p: vec2i, size: vec2u) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < i32(size.x) && p.y < i32(size.y);
}
