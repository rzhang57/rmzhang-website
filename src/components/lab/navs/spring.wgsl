import { Params, aspect_of, rounded_box, smin, finish } from "../../shader/common.wgsl";
import { nav_half, nav_backdrop, nav_labels, travel, dome_from, shade_glass } from "./kit.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

fn field(q: vec2f, t: f32) -> f32 {
  let half_size = nav_half();
  let lead = travel(t, 0.0, 9.0, 0.62);
  let tail = travel(t, 0.075, 9.0, 0.62);
  let a = rounded_box(q - lead, half_size, 0.055);
  let b = rounded_box(q - tail, half_size * 0.92, 0.052);
  let gap = length(lead - tail);
  return smin(a, b, 0.045 + gap * 0.6);
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
