import { PEACH, BLUE, LILAC } from "../../../shader/common.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

struct SceneConfig {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  hover: f32,
}
@group(0) @binding(0) var<uniform> config: SceneConfig;

fn shape(p: vec2f) -> f32 {
  let warp = fbmSimplex2d(p * 1.4 + vec2f(config.time * 0.05, 0.0), 4, 2.0, 0.5);
  var mask = smoothstep(0.02, -0.06, length(p - vec2f(-0.16, 0.05)) - 0.26 - warp * 0.09);
  mask = max(mask, smoothstep(0.02, -0.05, abs(p.y + 0.22) - 0.022 - warp * 0.01));
  mask = max(mask, smoothstep(0.02, -0.05, length(p - vec2f(0.3, -0.05)) - 0.13 + warp * 0.05));
  return clamp(mask, 0.0, 1.0);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / config.resolution;
  let aspect = config.resolution.x / max(config.resolution.y, 1.0);
  let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);

  let ink = shape(p);
  let glow = 1.0 - ink;

  let source = mix(config.pointer, vec2f(0.5, 0.35), 1.0 - config.hover);
  let lamp = exp(-length((uv - source) * vec2f(aspect, 1.0)) * 2.1);
  var light = vec3f(0.55 + 2.6 * lamp);
  light *= mix(vec3f(1.0), mix(PEACH, LILAC, 0.4), 0.22);
  light = mix(light, light * BLUE, 0.12);

  return vec4f(light * glow, 1.0);
}
