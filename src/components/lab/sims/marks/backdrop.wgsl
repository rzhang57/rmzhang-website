import { Params, PAPER, INK, finish } from "../../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let cell = fract(uv * params.resolution / 26.0) - 0.5;
  let dots = 1.0 - smoothstep(0.05, 0.13, length(cell));
  let fade = 1.0 - smoothstep(0.2, 0.95, length((uv - vec2f(0.5, 0.55)) * vec2f(1.1, 1.4)));
  var color = mix(PAPER, INK, dots * 0.09 * fade);
  color *= 1.0 - 0.05 * smoothstep(0.3, 1.0, length(uv - vec2f(0.5)));
  return finish(color, position.xy);
}
