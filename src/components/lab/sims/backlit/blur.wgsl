struct BlurConfig {
  resolution: vec2f,
  direction: vec2f,
  radius: f32,
}
@group(0) @binding(0) var<uniform> config: BlurConfig;
@group(0) @binding(1) var source_tex: texture_2d<f32>;

fn tap(base: vec2f, offset: f32, size: vec2f) -> vec3f {
  let point = clamp(base + config.direction * offset * config.radius, vec2f(0.0), size - 1.0);
  return textureLoad(source_tex, vec2u(point), 0).rgb;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(source_tex));
  let base = clamp(position.xy / config.resolution * size, vec2f(0.0), size - 1.0);

  var total = tap(base, 0.0, size) * 0.2270270;
  total += (tap(base, 1.3846153, size) + tap(base, -1.3846153, size)) * 0.3162162;
  total += (tap(base, 3.2307692, size) + tap(base, -3.2307692, size)) * 0.0702702;
  return vec4f(total, 1.0);
}
