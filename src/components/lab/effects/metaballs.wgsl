import { Params, PAPER, INK, PEACH, BLUE, LILAC, ACCENT, centered, finish, click_age } from "../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

fn blob(p: vec2f, center: vec2f, radius: f32) -> f32 {
  let d = p - center;
  return radius / max(dot(d, d), 0.0004);
}

fn spawned(p: vec2f, click: vec4f) -> f32 {
  let age = click_age(click, params.time);
  if (age < 0.0 || age > 7.0) {
    return 0.0;
  }
  let source = centered(click.xy, params.resolution);
  let drift = source + vec2f(sin(age * 0.8 + click.z) * 0.07, -age * 0.04);
  let grow = smoothstep(0.0, 0.4, age) * (1.0 - smoothstep(5.0, 7.0, age));
  return blob(p, drift, 0.026 * grow);
}

fn field(p: vec2f) -> f32 {
  let t = params.time * 0.5;
  var f = blob(p, vec2f(sin(t * 0.8) * 0.4, cos(t * 0.6) * 0.26), 0.028);
  f += blob(p, vec2f(cos(t * 0.53 + 1.2) * 0.46, sin(t * 0.71) * 0.3), 0.022);
  f += blob(p, vec2f(sin(t * 0.37 + 2.6) * 0.5, cos(t * 0.44 + 0.8) * 0.32), 0.018);
  f += blob(p, vec2f(cos(t * 0.62 + 4.1) * 0.34, sin(t * 0.83 + 1.9) * 0.24), 0.015);
  let pointer = centered(params.pointer, params.resolution);
  f += blob(p, pointer, 0.03 * params.hover);
  f += spawned(p, params.click_a);
  f += spawned(p, params.click_b);
  f += spawned(p, params.click_c);
  f += spawned(p, params.click_d);
  return f;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let f = field(p);
  let width = max(fwidth(f), 0.0001);
  let mass = smoothstep(1.0 - width * 2.0, 1.0 + width * 2.0, f);
  let shell = 1.0 - smoothstep(0.0, width * 3.0, abs(f - 1.0));

  let e = 0.004;
  let slope = normalize(vec2f(
    field(p + vec2f(e, 0.0)) - field(p - vec2f(e, 0.0)),
    field(p + vec2f(0.0, e)) - field(p - vec2f(0.0, e)),
  ) + vec2f(1e-5));

  let sheen = clamp(dot(slope, normalize(vec2f(-0.6, -0.8))), 0.0, 1.0);
  var tint = mix(PEACH, BLUE, clamp(p.x + 0.5, 0.0, 1.0));
  tint = mix(tint, LILAC, sheen * 0.5);

  var color = PAPER;
  color = mix(color, PAPER * mix(vec3f(1.0), tint, 0.55), mass);
  color = mix(color, INK, shell * 0.4);
  color = mix(color, ACCENT, shell * params.hover * 0.5);
  return finish(color, position.xy);
}
