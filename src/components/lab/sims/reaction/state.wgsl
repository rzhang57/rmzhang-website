export struct Grid {
  size: vec2u,
}

export struct Brush {
  pointer: vec2f,
  radius: f32,
  strength: f32,
}

export fn wrap_index(p: vec2i, size: vec2u) -> u32 {
  let w = i32(size.x);
  let h = i32(size.y);
  let x = ((p.x % w) + w) % w;
  let y = ((p.y % h) + h) % h;
  return u32(y) * size.x + u32(x);
}
