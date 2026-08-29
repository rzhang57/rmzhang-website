import { PAPER, INK, PEACH, BLUE, LILAC, rounded_box, smin } from "../../shader/common.wgsl";

export const NAV_COUNT = 5.0;
export const NAV_PERIOD = 2.1;

export fn nav_center(index: f32) -> vec2f {
  return vec2f(0.22 + index * 0.29, 0.5);
}

export fn nav_half() -> vec2f {
  return vec2f(0.12, 0.072);
}

export fn nav_slot(step: f32) -> f32 {
  let n = NAV_COUNT;
  let wrapped = step - floor(step / (2.0 * n - 2.0)) * (2.0 * n - 2.0);
  return select(wrapped, (2.0 * n - 2.0) - wrapped, wrapped >= n);
}

export fn spring_step(t: f32, omega: f32, zeta: f32) -> f32 {
  if (t <= 0.0) {
    return 0.0;
  }
  let wd = omega * sqrt(max(1.0 - zeta * zeta, 0.0001));
  let decay = exp(-zeta * omega * t);
  return 1.0 - decay * (cos(wd * t) + (zeta * omega / wd) * sin(wd * t));
}

export fn viscous_step(t: f32, rate: f32) -> f32 {
  let x = clamp(t * rate, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

export fn travel(t: f32, delay: f32, omega: f32, zeta: f32) -> vec2f {
  let raw = max(t - delay, 0.0);
  let step_index = floor(raw / NAV_PERIOD);
  let elapsed = raw - step_index * NAV_PERIOD;
  let origin = nav_center(nav_slot(step_index));
  let to = nav_center(nav_slot(step_index + 1.0));
  return mix(origin, to, spring_step(elapsed, omega, zeta));
}

export fn travel_viscous(t: f32, delay: f32, rate: f32) -> vec2f {
  let raw = max(t - delay, 0.0);
  let step_index = floor(raw / NAV_PERIOD);
  let elapsed = raw - step_index * NAV_PERIOD;
  let origin = nav_center(nav_slot(step_index));
  let to = nav_center(nav_slot(step_index + 1.0));
  return mix(origin, to, viscous_step(elapsed, rate));
}

export fn nav_backdrop(q: vec2f, uv: vec2f, pixels: vec2f) -> vec3f {
  var tint = vec3f(1.0);
  let a = vec2f(0.30, 0.16);
  let b = vec2f(1.28, 0.22);
  let c = vec2f(0.78, 0.94);
  tint *= mix(vec3f(1.0), PEACH, (1.0 - smoothstep(0.0, 1.0, length(q - a) / 0.62)) * 0.55);
  tint *= mix(vec3f(1.0), BLUE, (1.0 - smoothstep(0.0, 1.0, length(q - b) / 0.60)) * 0.52);
  tint *= mix(vec3f(1.0), LILAC, (1.0 - smoothstep(0.0, 1.0, length(q - c) / 0.55)) * 0.48);

  var color = PAPER * tint;
  let cell = fract(pixels / 22.0) - 0.5;
  let dots = 1.0 - smoothstep(0.016, 0.05, length(cell));
  color = mix(color, INK, dots * 0.10);
  return color;
}

export fn nav_labels(q: vec2f) -> f32 {
  var mask = 0.0;
  for (var i = 0.0; i < NAV_COUNT; i = i + 1.0) {
    let width = 0.052 + fract(i * 0.37) * 0.030;
    let d = rounded_box(q - nav_center(i), vec2f(width, 0.011), 0.010);
    mask = max(mask, 1.0 - smoothstep(0.0, 0.006, d));
  }
  return mask;
}

export fn dome_from(dist: f32, bevel: f32) -> f32 {
  let e = clamp(-dist / bevel, 0.0, 1.0);
  let inv = 1.0 - e;
  return sqrt(clamp(1.0 - inv * inv, 0.0, 1.0));
}

export fn shade_glass(
  base: vec3f,
  refracted: vec3f,
  dist: f32,
  grad: vec2f,
  dome: f32,
  bevel: f32,
  q: vec2f,
  aa: f32,
) -> vec3f {
  let normal = normalize(vec3f(-grad * bevel * 1.15, 1.0));
  let view = vec3f(0.0, 0.0, 1.0);
  let to_light = normalize(vec3f(0.34, -0.26, 0.60) - vec3f(q, 0.0));
  let halfway = normalize(to_light + view);
  let ndh = max(dot(normal, halfway), 0.0);
  let spec = pow(ndh, 110.0) * 0.85 + pow(ndh, 16.0) * 0.14;
  let fresnel = pow(1.0 - max(dot(normal, view), 0.0), 4.0);

  var glass = refracted * (1.0 + 0.05 * dome);
  glass = mix(glass, vec3f(1.0), clamp(fresnel, 0.0, 1.0) * 0.22);
  glass += spec * 0.75;

  let rim = 1.0 - smoothstep(0.0, bevel * 0.42, abs(dist));
  glass = mix(glass, mix(LILAC, vec3f(1.0), 0.35), rim * 0.55);

  var color = base;
  let halo = exp(-abs(dist) / (bevel * 2.4));
  color = mix(color, mix(LILAC, vec3f(1.0), 0.25), halo * 0.15);
  let shadow = smoothstep(bevel * 2.0, 0.0, dist);
  let inside = 1.0 - smoothstep(-aa, aa, dist);
  color *= 1.0 - shadow * (1.0 - inside) * 0.055;

  return mix(color, glass, inside);
}
