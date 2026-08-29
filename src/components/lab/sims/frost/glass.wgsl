import { Params, LILAC, centered, finish } from "../../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var sharp_tex: texture_2d<f32>;
@group(0) @binding(2) var blurred_tex: texture_2d<f32>;

fn fetch(tex: texture_2d<f32>, uv: vec2f) -> vec3f {
  let size = vec2f(textureDimensions(tex));
  return textureLoad(tex, vec2u(clamp(uv * size, vec2f(0.0), size - 1.0)), 0).rgb;
}

fn panel(p: vec2f, half_size: vec2f, radius: f32) -> f32 {
  let q = abs(p) - half_size + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let idle = vec2f(sin(params.time * 0.35) * 0.12, cos(params.time * 0.27) * 0.07);
  let lens = mix(idle, centered(params.pointer, params.resolution), params.hover);

  let half_size = vec2f(0.34, 0.2) * (1.0 + 0.06 * params.press);
  let dist = panel(p - lens, half_size, 0.07);
  let inside = 1.0 - smoothstep(-0.002, 0.002, dist);
  let thickness = sqrt(clamp(-dist / 0.14, 0.0, 1.0));

  let e = 0.0025;
  let normal = vec2f(
    panel(p - lens + vec2f(e, 0.0), half_size, 0.07) - panel(p - lens - vec2f(e, 0.0), half_size, 0.07),
    panel(p - lens + vec2f(0.0, e), half_size, 0.07) - panel(p - lens - vec2f(0.0, e), half_size, 0.07),
  ) / (2.0 * e);

  let bend = normal * (1.0 - thickness) * 0.075;
  let scale = vec2f(1.0 / max(params.resolution.x / params.resolution.y, 0.0001), 1.0);

  let sharp = vec3f(
    fetch(sharp_tex, uv + bend * scale * 0.9).r,
    fetch(sharp_tex, uv + bend * scale).g,
    fetch(sharp_tex, uv + bend * scale * 1.14).b,
  );
  let frosted = vec3f(
    fetch(blurred_tex, uv + bend * scale * 0.9).r,
    fetch(blurred_tex, uv + bend * scale).g,
    fetch(blurred_tex, uv + bend * scale * 1.14).b,
  );

  let roughness = clamp(0.72 - 0.5 * params.press, 0.0, 1.0);
  var glass = mix(sharp, frosted, roughness);
  glass *= 1.0 + 0.05 * thickness;

  let sheen = pow(clamp(dot(normalize(normal + vec2f(1e-5)), normalize(vec2f(-0.55, -0.84))), 0.0, 1.0), 3.0);
  glass = mix(glass, vec3f(1.0), sheen * (1.0 - thickness) * 0.3);

  var color = fetch(sharp_tex, uv);
  color = mix(color, glass, inside);

  let rim = 1.0 - smoothstep(0.0, 0.012, abs(dist));
  color = mix(color, mix(LILAC, vec3f(1.0), 0.35), rim * 0.6);

  let halo = exp(-abs(dist) / 0.09);
  color = mix(color, mix(LILAC, vec3f(1.0), 0.25), halo * 0.16);

  let shadow = smoothstep(0.1, 0.0, dist) * (1.0 - inside);
  color *= 1.0 - shadow * 0.07;
  return finish(color, position.xy);
}
