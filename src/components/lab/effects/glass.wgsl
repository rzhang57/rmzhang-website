import { Params, PAPER, INK, PEACH, BLUE, LILAC, centered, finish, aspect_of } from "../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

fn behind(uv: vec2f) -> vec3f {
  let p = centered(uv, params.resolution);
  var wash = PAPER;
  wash *= mix(vec3f(1.0), PEACH, exp(-dot(p - vec2f(-0.42, -0.22), p - vec2f(-0.42, -0.22)) * 5.0) * 0.5);
  wash *= mix(vec3f(1.0), BLUE, exp(-dot(p - vec2f(0.45, 0.18), p - vec2f(0.45, 0.18)) * 6.0) * 0.45);
  wash *= mix(vec3f(1.0), LILAC, exp(-dot(p - vec2f(0.05, 0.4), p - vec2f(0.05, 0.4)) * 8.0) * 0.4);

  let dots = uv * params.resolution / 24.0;
  let cell = fract(dots) - 0.5;
  let dot_mask = 1.0 - smoothstep(0.06, 0.14, length(cell));
  return mix(wash, INK, dot_mask * 0.14);
}

fn slab(p: vec2f, half_size: vec2f, radius: f32) -> f32 {
  let q = abs(p) - half_size + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let p = centered(uv, params.resolution);

  let idle = vec2f(sin(params.time * 0.42) * 0.16, cos(params.time * 0.31) * 0.08);
  let aim = centered(params.pointer, params.resolution);
  let lens = mix(idle, aim, params.hover);

  let dist = slab(p - lens, vec2f(0.3, 0.17), 0.085);
  let inside = 1.0 - smoothstep(-0.004, 0.004, dist);

  let thickness = sqrt(clamp(-dist / 0.14, 0.0, 1.0));
  let e = 0.004;
  let normal = vec2f(
    slab(p - lens + vec2f(e, 0.0), vec2f(0.3, 0.17), 0.085) - slab(p - lens - vec2f(e, 0.0), vec2f(0.3, 0.17), 0.085),
    slab(p - lens + vec2f(0.0, e), vec2f(0.3, 0.17), 0.085) - slab(p - lens - vec2f(0.0, e), vec2f(0.3, 0.17), 0.085),
  ) / (2.0 * e);

  let bend = normal * (1.0 - thickness) * 0.12;
  let scale = vec2f(1.0 / aspect_of(params.resolution), 1.0);

  var refracted = vec3f(
    behind(uv + bend * scale * 0.92).r,
    behind(uv + bend * scale * 1.0).g,
    behind(uv + bend * scale * 1.1).b,
  );

  let rim = 1.0 - smoothstep(0.0, 0.03, abs(dist));
  let sheen = pow(clamp(dot(normalize(normal + vec2f(0.0001)), normalize(vec2f(-0.6, -0.8))), 0.0, 1.0), 3.0);

  var color = behind(uv);
  color = mix(color, refracted * (1.0 + 0.06 * thickness), inside);
  color = mix(color, vec3f(1.0), inside * sheen * 0.3 * (1.0 - thickness));
  color = mix(color, mix(LILAC, vec3f(1.0), 0.4), rim * 0.55);

  let shadow = smoothstep(0.16, 0.0, slab(p - lens - vec2f(0.012, 0.02), vec2f(0.3, 0.17), 0.085));
  color *= 1.0 - shadow * (1.0 - inside) * 0.09;
  return finish(color, position.xy);
}
