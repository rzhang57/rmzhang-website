import { Params, aspect_of, rounded_box, smin, finish } from "../../shader/common.wgsl";
import { nav_half, nav_backdrop, nav_labels, travel_viscous, dome_from, shade_glass } from "./kit.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

const LINKS = 10;

fn field(q: vec2f, t: f32) -> f32 {
  let half_size = nav_half();
  var d = rounded_box(q - travel_viscous(t, 0.0, 0.85), half_size, 0.055);
  var previous = travel_viscous(t, 0.0, 0.85);
  for (var i = 1; i < LINKS; i = i + 1) {
    let f = f32(i);
    let at = travel_viscous(t, f * 0.045, 0.85);
    let shrink = 1.0 - f / f32(LINKS) * 0.42;
    let link = rounded_box(q - at, half_size * shrink, 0.05 * shrink);
    let gap = length(at - previous);
    d = smin(d, link, 0.040 + gap * 1.7);
    previous = at;
  }

  let local = q - travel_viscous(t, 0.0, 0.85);
  let angle = atan2(local.y, local.x);
  let ripple = sin(angle * 3.0 - t * 1.6) * 0.6 + sin(angle * 5.0 + t * 1.1) * 0.4;
  return d + ripple * 0.0035;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let a = aspect_of(params.resolution);
  let q = vec2f(uv.x * a, uv.y);
  let t = params.time;

  let base = nav_backdrop(q, uv, position.xy);
  let dist = field(q, t);
  let bevel = 0.034;
  let e = 1.4 / params.resolution.y;
  let grad = vec2f(
    dome_from(field(q + vec2f(e, 0.0), t), bevel) - dome_from(field(q - vec2f(e, 0.0), t), bevel),
    dome_from(field(q + vec2f(0.0, e), t), bevel) - dome_from(field(q - vec2f(0.0, e), t), bevel),
  ) / (2.0 * e);
  let dome = dome_from(dist, bevel);

  let bend = -grad * bevel * 2.2;
  let scale = vec2f(1.0 / a, 1.0);
  let refracted = vec3f(
    nav_backdrop(q + bend * 0.86, uv + bend * scale * 0.86, position.xy).r,
    nav_backdrop(q + bend, uv + bend * scale, position.xy).g,
    nav_backdrop(q + bend * 1.20, uv + bend * scale * 1.20, position.xy).b,
  );

  var color = shade_glass(base, refracted, dist, grad, dome, bevel, q, 1.2 / params.resolution.y);
  color = mix(color, vec3f(0.10, 0.11, 0.13), nav_labels(q) * 0.55);
  return finish(color, position.xy);
}
