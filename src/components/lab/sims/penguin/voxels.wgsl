struct VoxelConfig {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  hover: f32,
  press: f32,
  zoom: f32,
  spin: f32,
}
@group(0) @binding(0) var<uniform> config: VoxelConfig;

const NEAR = 0.2;
const FAR = 9.0;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) tint: vec3f,
  @location(2) depth: f32,
}

fn rotate_y(p: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
}

fn rotate_x(p: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
}

@vertex
fn vs_main(
  @location(0) corner: vec3f,
  @location(1) face_normal: vec3f,
  @location(2) instance_center: vec3f,
  @location(3) instance_half: vec3f,
  @location(4) instance_color: vec3f,
  @location(5) instance_back: vec3f,
) -> VertexOut {
  let flourish = clamp(config.spin / 0.70, 0.0, 1.0);
  let eased = 1.0 - pow(1.0 - flourish, 3.0);
  let yaw = config.time * 0.30 + eased * 6.2832;
  let pitch = 0.12;

  var local = instance_center + corner * instance_half;
  local = rotate_x(rotate_y(local, yaw), pitch);
  let camera = local + vec3f(0.0, 0.0, 3.1);

  var normal = rotate_x(rotate_y(face_normal, yaw), pitch);

  var out: VertexOut;
  out.normal = normal;
  var tint = instance_color;
  if (face_normal.z > 0.5) {
    tint = instance_back;
  } else if (abs(face_normal.z) < 0.5) {
    tint = mix(instance_color, instance_back, 0.5);
  }
  out.tint = tint;
  out.depth = camera.z;

  if (camera.z < NEAR) {
    out.position = vec4f(4.0, 4.0, 0.5, 1.0);
    return out;
  }

  let focal = 2.1 * config.zoom;
  let aspect = config.resolution.x / max(config.resolution.y, 1.0);
  let projected = vec2f(camera.x, camera.y) * focal / camera.z;
  out.position = vec4f(
    projected.x / aspect,
    projected.y,
    clamp((camera.z - NEAR) / (FAR - NEAR), 0.0, 1.0),
    1.0,
  );
  return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4f {
  let normal = normalize(in.normal);
  let key = normalize(vec3f(-0.45, 0.7, -0.55));
  let fill = normalize(vec3f(0.7, 0.15, -0.4));

  let lambert = clamp(dot(normal, key), 0.0, 1.0);
  let bounce = clamp(dot(normal, fill), 0.0, 1.0);
  let rim = pow(1.0 - clamp(dot(normal, vec3f(0.0, 0.0, -1.0)), 0.0, 1.0), 3.0);

  var color = in.tint * (0.42 + 0.62 * lambert + 0.22 * bounce);
  color += vec3f(1.0) * pow(lambert, 26.0) * 0.28;
  color = mix(color, vec3f(1.0), rim * 0.16);

  let haze = clamp((in.depth - 2.2) / 2.6, 0.0, 1.0);
  color = mix(color, vec3f(0.9933, 0.9907, 0.9867), haze * 0.45);
  return vec4f(color, 1.0);
}
