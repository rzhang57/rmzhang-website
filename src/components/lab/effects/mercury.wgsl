import { Params, PAPER, PEACH, BLUE, LILAC, smin, centered, finish } from "../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

const MAX_STEPS = 80;
const MAX_DIST = 9.0;
const SURFACE = 0.0016;

fn droplets(p: vec3f) -> f32 {
  let t = params.time * 0.6;
  var d = length(p - vec3f(sin(t * 0.7) * 0.42, cos(t * 0.5) * 0.26, 0.0)) - 0.66;
  d = smin(d, length(p - vec3f(cos(t * 0.43) * 0.72, sin(t * 0.61) * 0.4, sin(t * 0.3) * 0.35)) - 0.46, 0.55);
  d = smin(d, length(p - vec3f(sin(t * 0.31 + 2.0) * 0.6, cos(t * 0.77 + 1.0) * 0.5, cos(t * 0.5) * 0.3)) - 0.38, 0.5);

  let aim = vec3f(
    (params.pointer.x - 0.5) * 2.3,
    -(params.pointer.y - 0.5) * 1.7,
    -0.55,
  );
  d = smin(d, length(p - aim) - (0.16 + 0.22 * params.hover), 0.62);
  return d;
}

fn surface_normal(p: vec3f) -> vec3f {
  let e = vec2f(1.0, -1.0) * 0.0012;
  return normalize(
    e.xyy * droplets(p + e.xyy) +
    e.yyx * droplets(p + e.yyx) +
    e.yxy * droplets(p + e.yxy) +
    e.xxx * droplets(p + e.xxx)
  );
}

fn studio(d: vec3f) -> vec3f {
  let up = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
  var c = mix(vec3f(0.6, 0.63, 0.68), vec3f(1.0, 0.997, 0.99), up * up);
  c += vec3f(1.0) * pow(max(dot(d, normalize(vec3f(0.45, 0.82, -0.35))), 0.0), 28.0) * 1.9;
  c += PEACH * pow(max(dot(d, normalize(vec3f(-0.75, 0.15, -0.4))), 0.0), 7.0) * 0.3;
  c += BLUE * pow(max(dot(d, normalize(vec3f(0.25, -0.85, 0.2))), 0.0), 5.0) * 0.26;
  return c;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let origin = vec3f(0.0, 0.0, -3.2);
  let direction = normalize(vec3f(p.x * 1.55, -p.y * 1.55, 1.35));

  var travelled = 0.0;
  var hit = false;
  for (var i = 0; i < MAX_STEPS; i++) {
    let sample = origin + direction * travelled;
    let dist = droplets(sample);
    if (dist < SURFACE) {
      hit = true;
      break;
    }
    travelled += dist;
    if (travelled > MAX_DIST) {
      break;
    }
  }

  let shadow = exp(-dot(p - vec2f(0.0, 0.34), vec2f(1.6, 5.0) * (p - vec2f(0.0, 0.34))) * 3.0);
  var color = PAPER * (1.0 - shadow * 0.14);

  if (hit) {
    let point = origin + direction * travelled;
    let normal = surface_normal(point);
    let view = -direction;
    let fresnel = pow(clamp(1.0 - max(dot(normal, view), 0.0), 0.0, 1.0), 4.0);

    var metal = studio(reflect(direction, normal));
    let rim = LILAC * fresnel * 0.5 + BLUE * fresnel * fresnel * 0.35;
    metal = metal * (0.72 + 0.4 * fresnel) + rim;
    metal += vec3f(1.0) * pow(max(dot(reflect(direction, normal), normalize(vec3f(0.4, 0.75, -0.5))), 0.0), 90.0) * 1.4;

    let depth = clamp(1.0 - travelled / MAX_DIST, 0.0, 1.0);
    color = mix(color, 1.0 - exp(-metal * 1.15), clamp(depth * 3.0, 0.0, 1.0));
  }

  return finish(color, position.xy);
}
