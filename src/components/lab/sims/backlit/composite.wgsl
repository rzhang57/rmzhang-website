import { Params, PAPER, INK, finish } from "../../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var scene_tex: texture_2d<f32>;
@group(0) @binding(2) var bloom_tex: texture_2d<f32>;

fn fetch(tex: texture_2d<f32>, uv: vec2f) -> vec3f {
  let size = vec2f(textureDimensions(tex));
  return textureLoad(tex, vec2u(clamp(uv * size, vec2f(0.0), size - 1.0)), 0).rgb;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let scene = fetch(scene_tex, uv);
  let bloom = fetch(bloom_tex, uv);

  let lit = scene + bloom * (0.85 + 0.5 * params.hover);
  let exposed = 1.0 - exp(-lit * 1.35);
  var color = mix(INK, PAPER, clamp(exposed, vec3f(0.0), vec3f(1.0)));
  color = mix(color, PAPER, 0.06);
  return finish(color, position.xy);
}
