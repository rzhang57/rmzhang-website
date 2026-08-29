export struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  hover: f32,
  seed: f32,
  press: f32,
  click_a: vec4f,
  click_b: vec4f,
  click_c: vec4f,
  click_d: vec4f,
  panel: vec4f,
  panel_spot: vec4f,
  panel_style: vec4f,
  panel_links: array<vec4f, 10>,
}

export fn rounded_box(p: vec2f, half_size: vec2f, radius: f32) -> f32 {
  let q = abs(p) - half_size + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

export const PAPER = vec3f(0.9933, 0.9907, 0.9867);
export const INK = vec3f(0.0935, 0.1045, 0.1265);
export const PEACH = vec3f(1.0, 0.725, 0.639);
export const BLUE = vec3f(0.663, 0.784, 1.0);
export const LILAC = vec3f(0.843, 0.737, 1.0);
export const ACCENT = vec3f(0.946, 0.339, 0.154);

export fn aspect_of(resolution: vec2f) -> f32 {
  return resolution.x / max(resolution.y, 1.0);
}

export fn centered(uv: vec2f, resolution: vec2f) -> vec2f {
  return vec2f((uv.x - 0.5) * aspect_of(resolution), uv.y - 0.5);
}

export fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

export fn grain(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(12.9898, 78.233))) * 43758.5453) - 0.5;
}

export fn finish(color: vec3f, position: vec2f) -> vec4f {
  return vec4f(clamp(color + grain(position) * 0.007, vec3f(0.0), vec3f(1.0)), 1.0);
}

export fn pointer_falloff(p: vec2f, pointer: vec2f, resolution: vec2f, tightness: f32) -> f32 {
  let d = (p - pointer) * vec2f(aspect_of(resolution), 1.0);
  return exp(-dot(d, d) * tightness);
}

export fn click_age(click: vec4f, now: f32) -> f32 {
  if (click.w < 0.5) {
    return -1.0;
  }
  return now - click.z;
}
