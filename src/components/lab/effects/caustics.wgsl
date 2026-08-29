import { Params, PAPER, BLUE, ACCENT, finish, pointer_falloff, aspect_of } from "../../shader/common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let base = vec2f(uv.x * aspect_of(params.resolution), uv.y) * 7.0 - 8.0;

  let ripple = pointer_falloff(uv, params.pointer, params.resolution, 7.0) * params.hover;
  var walk = base + vec2f(ripple * 1.6, ripple * -1.2);
  var accum = 1.0;
  let intensity = 0.0055;

  for (var n = 0; n < 5; n++) {
    let t = params.time * 0.32 * (1.0 - 3.5 / (f32(n) + 1.0));
    walk = base + vec2f(
      cos(t - walk.x) + sin(t + walk.y),
      sin(t - walk.y) + cos(t + walk.x),
    );
    let denom = vec2f(
      base.x / (sin(walk.x + t) / intensity),
      base.y / (cos(walk.y + t) / intensity),
    );
    accum += 1.0 / length(max(abs(denom), vec2f(0.0004)));
  }

  accum = 1.16 - pow(accum / 5.0, 1.35);
  let light = clamp(pow(abs(accum), 7.0), 0.0, 1.4);

  let shade = mix(vec3f(0.9, 0.925, 0.985), vec3f(1.0), clamp(light, 0.0, 1.0));
  var color = PAPER * shade;
  color = mix(color, PAPER * BLUE, 0.1 * (1.0 - clamp(light, 0.0, 1.0)));
  color += ACCENT * clamp(light - 0.7, 0.0, 1.0) * ripple * 0.5;
  return finish(color, position.xy);
}
