struct ThresholdConfig {
  resolution: vec2f,
  cutoff: f32,
}
@group(0) @binding(0) var<uniform> config: ThresholdConfig;
@group(0) @binding(1) var source_tex: texture_2d<f32>;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(source_tex));
  let uv = position.xy / config.resolution;
  let texel = vec2u(clamp(uv * size, vec2f(0.0), size - 1.0));
  let value = textureLoad(source_tex, texel, 0).rgb;
  let luma = dot(value, vec3f(0.2126, 0.7152, 0.0722));
  let keep = max(luma - config.cutoff, 0.0) / max(luma, 0.0001);
  return vec4f(value * keep, 1.0);
}
