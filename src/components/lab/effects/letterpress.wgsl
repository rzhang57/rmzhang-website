import { Params, PAPER, INK, PEACH, centered, finish, smin } from "../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

@group(0) @binding(0) var<uniform> params: Params;

fn bar(p: vec2f, center: vec2f, half_size: vec2f, radius: f32) -> f32 {
  let q = abs(p - center) - half_size + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn plate(p: vec2f) -> f32 {
  var d = abs(length(p - vec2f(-0.22, 0.0)) - 0.19) - 0.012;
  d = min(d, bar(p, vec2f(0.16, -0.13), vec2f(0.22, 0.011), 0.008));
  d = min(d, bar(p, vec2f(0.12, -0.04), vec2f(0.18, 0.011), 0.008));
  d = min(d, bar(p, vec2f(0.2, 0.05), vec2f(0.26, 0.011), 0.008));
  d = min(d, bar(p, vec2f(0.1, 0.14), vec2f(0.16, 0.011), 0.008));
  d = smin(d, length(p - vec2f(-0.22, 0.0)) - 0.045, 0.03);
  return d;
}

fn impression(p: vec2f) -> f32 {
  let d = plate(p);
  let bite = 0.014 + 0.01 * params.press;
  return smoothstep(bite, -bite * 0.5, d);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let fibre = fbmSimplex2d(p * 90.0, 3, 2.1, 0.55) * 0.0012;
  let e = 0.0022;
  let depth = impression(p) * 0.03 + fibre;
  let slope = vec2f(
    (impression(p + vec2f(e, 0.0)) - impression(p - vec2f(e, 0.0))) * 0.03,
    (impression(p + vec2f(0.0, e)) - impression(p - vec2f(0.0, e))) * 0.03,
  ) / (2.0 * e);

  let rake = mix(2.4, 0.6, clamp(params.pointer.x, 0.0, 1.0)) + mix(0.0, 0.9, params.hover);
  let light = normalize(vec3f(cos(rake), sin(rake), 0.55));
  let normal = normalize(vec3f(-slope, 1.0));

  let lambert = clamp(dot(normal, light), 0.0, 1.0);
  let specular = pow(lambert, 30.0);
  let occlusion = 1.0 - clamp(-depth * 14.0, 0.0, 0.5);

  var color = PAPER * (0.82 + 0.26 * lambert) * occlusion;
  color += vec3f(1.0) * specular * 0.22;
  color = mix(color, PAPER * mix(vec3f(1.0), PEACH, 0.5), impression(p) * 0.24);
  color = mix(color, INK, impression(p) * 0.1);
  return finish(color, position.xy);
}
