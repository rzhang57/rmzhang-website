import { INK, PEACH, BLUE } from "../../../shader/common.wgsl";

struct MarkConfig {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  hover: f32,
}
@group(0) @binding(0) var<uniform> config: MarkConfig;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) corner: vec2f,
  @location(1) tone: f32,
  @location(2) depth: f32,
}

@vertex
fn vs_main(
  @location(0) corner: vec2f,
  @location(1) instance_origin: vec2f,
  @location(2) instance_tone: f32,
) -> VertexOut {
  let t = config.time * 0.5;
  let o = instance_origin;
  let radius = length(o);
  let height = sin(radius * 5.0 - t * 1.6) * 0.14 * exp(-radius * 0.6)
    + sin(o.x * 3.1 + t) * 0.045
    + cos(o.y * 2.7 - t * 0.8) * 0.045;

  let spin = t * 0.25 + (config.pointer.x - 0.5) * 1.7 * config.hover;
  let cs = cos(spin);
  let sn = sin(spin);
  let rotated = vec2f(o.x * cs - o.y * sn, o.x * sn + o.y * cs);

  let tilt = 0.5 - (config.pointer.y - 0.5) * 0.55 * config.hover;
  let ct = cos(tilt);
  let st = sin(tilt);
  let world = vec3f(rotated.x, height, rotated.y);
  let camera = vec3f(world.x, world.y * ct - world.z * st, world.y * st + world.z * ct + 2.7);

  var out: VertexOut;
  out.corner = corner;
  out.tone = instance_tone + height * 2.4;
  out.depth = camera.z;

  if (camera.z < 0.2) {
    out.position = vec4f(4.0, 4.0, 0.0, 1.0);
    return out;
  }

  let focal = 1.55;
  let projected = vec2f(camera.x, camera.y) * focal / camera.z;
  let aspect = config.resolution.x / max(config.resolution.y, 1.0);
  let size = 0.05 / camera.z;
  out.position = vec4f(
    (projected.x + corner.x * size) / aspect,
    projected.y + corner.y * size,
    0.0,
    1.0,
  );
  return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4f {
  let mask = 1.0 - smoothstep(0.72, 1.0, length(in.corner));
  if (mask <= 0.002) {
    discard;
  }
  let fade = clamp(1.0 - (in.depth - 1.5) / 3.2, 0.12, 1.0);
  let tint = mix(BLUE, PEACH, clamp(in.tone * 0.5 + 0.5, 0.0, 1.0));
  let ink = mix(INK, tint * 0.5, 0.6);
  let alpha = mask * fade * 0.8;
  return vec4f(ink * alpha, alpha);
}
