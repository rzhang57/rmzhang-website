import { Params, PAPER, INK, PEACH, LILAC, centered, finish } from "../../shader/common.wgsl";
import { rotate2d } from "@vgpu/wgsl-std/math";

@group(0) @binding(0) var<uniform> params: Params;

const MAX_STEPS = 90;
const MAX_DIST = 8.0;
const SURFACE = 0.0012;
const FOLDS = 9;

fn tetra(start: vec3f) -> f32 {
  var p = start;
  let scale = 2.0;
  for (var i = 0; i < FOLDS; i++) {
    if (p.x + p.y < 0.0) { p = vec3f(-p.y, -p.x, p.z); }
    if (p.x + p.z < 0.0) { p = vec3f(-p.z, p.y, -p.x); }
    if (p.y + p.z < 0.0) { p = vec3f(p.x, -p.z, -p.y); }
    p = p * scale - vec3f(1.0, 1.0, 1.0) * (scale - 1.0);
  }
  return length(p) * pow(scale, -f32(FOLDS));
}

fn scene(p: vec3f) -> f32 {
  let spin = params.time * 0.12 + (params.pointer.x - 0.5) * 2.4 * params.hover;
  let tilt = 0.35 + (params.pointer.y - 0.5) * 0.8 * params.hover;
  let xz = rotate2d(p.xz, spin);
  let yz = rotate2d(vec2f(p.y, xz.y), tilt);
  return tetra(vec3f(xz.x, yz.x, yz.y));
}

fn normal_at(p: vec3f) -> vec3f {
  let e = vec2f(1.0, -1.0) * 0.0009;
  return normalize(
    e.xyy * scene(p + e.xyy) +
    e.yyx * scene(p + e.yyx) +
    e.yxy * scene(p + e.yxy) +
    e.xxx * scene(p + e.xxx)
  );
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let origin = vec3f(0.0, 0.0, -2.6 + params.press * 1.05);
  let direction = normalize(vec3f(p.x * 1.7, -p.y * 1.7, 1.4));

  var travelled = 0.0;
  var steps = 0;
  var hit = false;
  for (var i = 0; i < MAX_STEPS; i++) {
    let sample = origin + direction * travelled;
    let dist = scene(sample);
    steps = i;
    if (dist < SURFACE) {
      hit = true;
      break;
    }
    travelled += dist;
    if (travelled > MAX_DIST) { break; }
  }

  var color = PAPER;
  if (hit) {
    let point = origin + direction * travelled;
    let normal = normal_at(point);
    let key = clamp(dot(normal, normalize(vec3f(-0.45, 0.8, -0.4))), 0.0, 1.0);
    let occlusion = 1.0 - clamp(f32(steps) / f32(MAX_STEPS), 0.0, 1.0);

    let shade = 0.16 + 0.72 * key * (0.35 + 0.65 * occlusion);
    var tint = mix(LILAC, PEACH, clamp(normal.y * 0.5 + 0.5, 0.0, 1.0));
    tint = mix(vec3f(1.0), tint, 0.42);

    color = mix(INK, PAPER * tint, shade);
    color = mix(color, PAPER, clamp(travelled / MAX_DIST, 0.0, 1.0) * 0.45);
  }

  return finish(color, position.xy);
}
