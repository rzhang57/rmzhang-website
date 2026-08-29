import { PAPER, INK, PEACH, BLUE, LILAC } from "../../../shader/common.wgsl";

struct PageConfig {
  resolution: vec2f,
  time: f32,
}
@group(0) @binding(0) var<uniform> config: PageConfig;

fn rule(p: vec2f, y: f32, width: f32, height: f32) -> f32 {
  let d = abs(p - vec2f(0.0, y)) - vec2f(width, height);
  return select(0.0, 1.0, max(d.x, d.y) < 0.0);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / config.resolution;
  let aspect = config.resolution.x / max(config.resolution.y, 1.0);
  let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);

  var color = PAPER;
  let drift = config.time * 0.05;
  color *= mix(vec3f(1.0), PEACH, exp(-length(p - vec2f(-0.45 + sin(drift) * 0.1, -0.24)) * 2.6) * 0.55);
  color *= mix(vec3f(1.0), BLUE, exp(-length(p - vec2f(0.48, 0.2 + cos(drift) * 0.08)) * 2.9) * 0.5);
  color *= mix(vec3f(1.0), LILAC, exp(-length(p - vec2f(0.05, 0.42)) * 3.4) * 0.45);

  let cell = fract(uv * config.resolution / 22.0) - 0.5;
  let dots = 1.0 - smoothstep(0.06, 0.15, length(cell));
  color = mix(color, INK, dots * 0.14);

  var bars = rule(p, -0.3, 0.36, 0.014);
  bars = max(bars, rule(p, -0.22, 0.3, 0.009));
  bars = max(bars, rule(p, -0.15, 0.33, 0.009));
  bars = max(bars, rule(p, 0.02, 0.26, 0.009));
  bars = max(bars, rule(p, 0.09, 0.31, 0.009));
  bars = max(bars, rule(p, 0.28, 0.2, 0.014));
  color = mix(color, INK, bars * 0.72);

  return vec4f(color, 1.0);
}
