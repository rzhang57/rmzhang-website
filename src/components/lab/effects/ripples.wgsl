import { Params, PAPER, INK, BLUE, ACCENT, centered, finish, click_age } from "../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

fn wave(p: vec2f, source: vec2f, freq: f32, speed: f32, decay: f32) -> f32 {
  let d = length(p - source);
  return sin(d * freq - params.time * speed) * exp(-d * decay);
}

fn burst(p: vec2f, click: vec4f) -> f32 {
  let age = click_age(click, params.time);
  if (age < 0.0 || age > 5.0) {
    return 0.0;
  }
  let source = centered(click.xy, params.resolution);
  let offset = length(p - source) - age * 0.5;
  return sin(offset * -38.0) * exp(-offset * offset * 26.0) * exp(-age * 0.7) * 3.2;
}

fn surface(p: vec2f) -> f32 {
  var h = wave(p, vec2f(-0.42, -0.24), 22.0, 1.7, 1.5);
  h += wave(p, vec2f(0.38, 0.3), 26.0, 2.1, 1.7);
  h += wave(p, vec2f(0.1, -0.36), 18.0, 1.3, 1.3);
  let pointer = centered(params.pointer, params.resolution);
  h += wave(p, pointer, 30.0, 2.6, 1.1) * params.hover * 2.2;
  h += burst(p, params.click_a);
  h += burst(p, params.click_b);
  h += burst(p, params.click_c);
  h += burst(p, params.click_d);
  return h;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let e = 0.0025;
  let h = surface(p);
  let slope = vec2f(
    surface(p + vec2f(e, 0.0)) - surface(p - vec2f(e, 0.0)),
    surface(p + vec2f(0.0, e)) - surface(p - vec2f(0.0, e)),
  ) / (2.0 * e);

  let normal = normalize(vec3f(-slope * 0.012, 1.0));
  let light = normalize(vec3f(-0.4, 0.72, 0.56));
  let lambert = clamp(dot(normal, light), 0.0, 1.0);
  let spec = pow(lambert, 42.0);

  var color = PAPER * mix(vec3f(1.0), BLUE, 0.14 + 0.1 * clamp(-h * 0.4, 0.0, 1.0));
  color *= 0.88 + 0.16 * lambert;
  color = mix(color, INK, clamp(-h * 0.06, 0.0, 0.12));
  color += vec3f(1.0) * spec * 0.5;
  color += ACCENT * spec * params.hover * 0.35;
  return finish(color, position.xy);
}
