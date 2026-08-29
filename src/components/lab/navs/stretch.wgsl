import { Params, aspect_of, rounded_box, smin, finish } from "../../shader/common.wgsl";
import { nav_half, nav_backdrop, nav_labels, travel, dome_from, shade_glass } from "./kit.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

fn field(q: vec2f, t: f32) -> f32 {
  let half_size = nav_half();
  let here = travel(t, 0.0, 8.5, 0.64);
  let before = travel(t - 0.032, 0.0, 8.5, 0.64);
  let velocity = (here - before) / 0.032;
  let speed = clamp(length(velocity) * 0.42, 0.0, 1.6);

  let stretched = half_size * vec2f(1.0 + speed * 0.85, 1.0 / (1.0 + speed * 0.55));
  let centre = here - velocity * 0.030;
  var d = rounded_box(q - centre, stretched, min(stretched.x, stretched.y) * 0.85);

  let bulge = rounded_box(q - (here + velocity * 0.012), half_size * vec2f(0.7, 1.0 - speed * 0.18), 0.05);
  d = smin(d, bulge, 0.05 + speed * 0.06);
  return d;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let a = aspect_of(params.resolution);
  let q = vec2f(uv.x * a, uv.y);
  let t = params.time;

  let base = nav_backdrop(q, uv, position.xy);
  let dist = field(q, t);
  let bevel = 0.030;
  let e = 1.4 / params.resolution.y;
  let grad = vec2f(
    dome_from(field(q + vec2f(e, 0.0), t), bevel) - dome_from(field(q - vec2f(e, 0.0), t), bevel),
    dome_from(field(q + vec2f(0.0, e), t), bevel) - dome_from(field(q - vec2f(0.0, e), t), bevel),
  ) / (2.0 * e);
  let dome = dome_from(dist, bevel);

  let bend = -grad * bevel * 1.85;
  let scale = vec2f(1.0 / a, 1.0);
  let refracted = vec3f(
    nav_backdrop(q + bend * 0.88, uv + bend * scale * 0.88, position.xy).r,
    nav_backdrop(q + bend, uv + bend * scale, position.xy).g,
    nav_backdrop(q + bend * 1.16, uv + bend * scale * 1.16, position.xy).b,
  );

  var color = shade_glass(base, refracted, dist, grad, dome, bevel, q, 1.2 / params.resolution.y);
  color = mix(color, vec3f(0.10, 0.11, 0.13), nav_labels(q) * 0.55);
  return finish(color, position.xy);
}
