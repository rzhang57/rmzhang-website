import { Params, PAPER, grain } from "../../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var scene_tex: texture_2d<f32>;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let size = vec2f(textureDimensions(scene_tex));
  let texel = vec2u(clamp(uv * size, vec2f(0.0), size - 1.0));
  let scene = textureLoad(scene_tex, texel, 0);

  let vignette = 1.0 - smoothstep(0.45, 1.05, length((uv - vec2f(0.5, 0.52)) * vec2f(1.05, 1.3)));
  var color = mix(PAPER, scene.rgb, 0.94 + 0.06 * vignette);
  color = clamp(color + grain(position.xy) * 0.007, vec3f(0.0), vec3f(1.0));

  return vec4f(color * scene.a, scene.a);
}
