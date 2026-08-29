import { Params, PAPER, INK, aspect_of, rounded_box, smin, finish } from "./common.wgsl";

@group(0) @binding(0) var<uniform> params: Params;

const LIGHT = vec3f(0.26, -0.30, 0.62);

fn chain_field(q: vec2f, aspect: f32, t: f32) -> f32 {
  let grow = clamp(params.panel_style.x, 0.0, 1.0);
  let swell = mix(0.06, 1.0, pow(grow, 0.75));
  let half0 = vec2f(params.panel_links[0].z * aspect * 0.5, params.panel_links[0].w * 0.5) * swell;
  let unit = max(half0.y, 0.0005);

  var lead = vec2f(
    (params.panel_links[0].x + params.panel_links[0].z * 0.5) * aspect,
    params.panel_links[0].y + params.panel_links[0].w * 0.5,
  );
  var d = rounded_box(q - lead, half0, unit * 0.764);
  var previous = lead;

  for (var i = 1; i < 10; i = i + 1) {
    let link = params.panel_links[i];
    let at = vec2f(
      (link.x + link.z * 0.5) * aspect,
      link.y + link.w * 0.5,
    );
    let f = f32(i);
    let shrink = 1.0 - f / 10.0 * 0.58;
    let half_i = vec2f(link.z * aspect * 0.5, link.w * 0.5) * shrink * swell;
    let box = rounded_box(q - at, half_i, unit * 0.694 * shrink);
    let gap = length(at - previous);
    d = smin(d, box, unit * 0.42 + gap * 1.05);
    previous = at;
  }

  let local = q - lead;
  let angle = atan2(local.y, local.x);
  let ripple = sin(angle * 3.0 - t * 1.6) * 0.6 + sin(angle * 5.0 + t * 1.1) * 0.4;
  let agitation = params.panel_style.z;
  let forming = 1.0 - grow;
  return d + ripple * unit * (0.026 + 0.075 * agitation + 0.09 * forming);
}

fn spot_unit(aspect: f32) -> f32 {
  let grow = clamp(params.panel_style.w, 0.0, 1.0);
  let swell = mix(0.06, 1.0, pow(grow, 0.75));
  return max(params.panel_spot.w * 0.5 * swell, 0.0005);
}

fn spot_field(q: vec2f, aspect: f32, t: f32) -> f32 {
  let grow = clamp(params.panel_style.w, 0.0, 1.0);
  if (grow < 0.003 || params.panel_spot.z < 0.0001) {
    return 1000.0;
  }
  let swell = mix(0.06, 1.0, pow(grow, 0.75));
  let half_size = vec2f(
    params.panel_spot.z * aspect * 0.5,
    params.panel_spot.w * 0.5,
  ) * swell;
  let unit = max(half_size.y, 0.0005);
  let centre = vec2f(
    (params.panel_spot.x + params.panel_spot.z * 0.5) * aspect,
    params.panel_spot.y + params.panel_spot.w * 0.5,
  );
  let local = q - centre;
  let d = rounded_box(local, half_size, unit * 0.764);
  let angle = atan2(local.y, local.x);
  let ripple = sin(angle * 3.0 - t * 1.6) * 0.6 + sin(angle * 5.0 + t * 1.1) * 0.4;
  let forming = 1.0 - grow;
  return d + ripple * unit * (0.026 + 0.09 * forming);
}

fn glass_field(q: vec2f, aspect: f32, t: f32) -> f32 {
  return min(chain_field(q, aspect, t), spot_field(q, aspect, t));
}

fn dome_glass(q: vec2f, aspect: f32, t: f32, bevel: f32) -> f32 {
  let d = glass_field(q, aspect, t);
  let e = clamp(-d / bevel, 0.0, 1.0);
  let inv = 1.0 - e;
  return sqrt(clamp(1.0 - inv * inv, 0.0, 1.0));
}

fn dome_chain(q: vec2f, aspect: f32, t: f32, bevel: f32) -> f32 {
  let d = chain_field(q, aspect, t);
  let e = clamp(-d / bevel, 0.0, 1.0);
  let inv = 1.0 - e;
  return sqrt(clamp(1.0 - inv * inv, 0.0, 1.0));
}

fn dome_at(local: vec2f, half_size: vec2f, radius: f32, bevel: f32) -> f32 {
  let d = rounded_box(local, half_size, radius);
  let e = clamp(-d / bevel, 0.0, 1.0);
  let inv = 1.0 - e;
  return sqrt(clamp(1.0 - inv * inv, 0.0, 1.0));
}

fn hash11(n: f32) -> f32 {
  return fract(sin(n * 127.1 + 311.7) * 43758.5453123);
}

fn pastel(hue: f32) -> vec3f {
  let x = fract(hue) * 6.0;
  let rgb = clamp(
    vec3f(abs(x - 3.0) - 1.0, 2.0 - abs(x - 2.0), 2.0 - abs(x - 4.0)),
    vec3f(0.0),
    vec3f(1.0),
  );
  return mix(vec3f(1.0), rgb, 0.32);
}

fn drift(index: f32, anchor: vec2f, aspect: f32, t: f32, seed: f32) -> vec2f {
  let pa = hash11(seed + index * 13.1);
  let pb = hash11(seed + index * 27.3);
  let jx = (hash11(seed + index * 41.7) - 0.5) * 0.15;
  let jy = (hash11(seed + index * 53.9) - 0.5) * 0.15;
  return vec2f(
    aspect * (anchor.x + jx + sin(t * (0.07 + pa * 0.06) + pa * 6.2832) * 0.05),
    anchor.y + jy + cos(t * (0.07 + pb * 0.06) + pb * 6.2832) * 0.07,
  );
}

fn blob(q: vec2f, at: vec2f, radius: f32) -> f32 {
  return 1.0 - smoothstep(0.0, 1.0, length(q - at) / radius);
}

fn palette(seed: f32, index: f32) -> vec3f {
  let r = hash11(seed * 1.37 + index * 19.7);
  let warm = index < 0.5 || index > 2.5;
  let hue = select(0.56 + r * 0.22, 0.93 + r * 0.15, warm);
  return pastel(hue);
}

fn blob_field(q: vec2f, aspect: f32, t: f32, seed: f32) -> vec4f {
  let a = drift(0.0, vec2f(0.17, 0.20), aspect, t, seed);
  let b = drift(1.0, vec2f(0.82, 0.24), aspect, t, seed);
  let c = drift(2.0, vec2f(0.50, 0.86), aspect, t, seed);
  let d = drift(3.0, vec2f(0.30, 0.62), aspect, t, seed);

  let wa = blob(q, a, 0.40);
  let wb = blob(q, b, 0.44);
  let wc = blob(q, c, 0.38);
  let wd = blob(q, d, 0.30);

  let total = wa + wb + wc + wd;
  if (total < 0.0001) {
    return vec4f(1.0, 1.0, 1.0, 0.0);
  }

  let tint = (palette(seed, 0.0) * wa + palette(seed, 1.0) * wb
    + palette(seed, 2.0) * wc + palette(seed, 3.0) * wd) / total;
  return vec4f(tint, clamp(total, 0.0, 1.0));
}

fn accent(seed: f32) -> vec3f {
  let mixed = (palette(seed, 0.0) + palette(seed, 1.0)
    + palette(seed, 2.0) + palette(seed, 3.0)) * 0.25;
  return mix(mixed, vec3f(1.0), 0.15);
}

fn blobs(q: vec2f, aspect: f32, t: f32, seed: f32) -> vec3f {
  let field = blob_field(q, aspect, t, seed);
  return mix(vec3f(1.0), field.rgb, field.w * 0.62);
}

fn dotgrid(uv: vec2f, pixels: vec2f) -> f32 {
  let cell = fract(pixels / 26.0) - 0.5;
  let dot_mask = 1.0 - smoothstep(0.014, 0.044, length(cell));

  let d = (uv - vec2f(0.5, 0.4)) / vec2f(0.8, 0.7);
  let fade = 1.0 - smoothstep(0.25, 1.0, length(d));
  return dot_mask * fade;
}

fn backdrop(uv: vec2f) -> vec3f {
  let a = aspect_of(params.resolution);
  let q = vec2f(uv.x * a, uv.y);

  var color = PAPER * blobs(q, a, params.time, params.seed);
  color = mix(color, PAPER, 0.22);
  color = mix(color, INK, dotgrid(uv, uv * params.resolution) * 0.11);

  return color;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / params.resolution;
  let a = aspect_of(params.resolution);
  let q = vec2f(uv.x * a, uv.y);

  var color = backdrop(uv);

  let presence = max(params.panel_style.x, params.panel_style.w);
  let opacity = smoothstep(0.0, 0.32, presence);
  if (presence < 0.003) {
    return finish(color, position.xy);
  }

  let half_size = vec2f(params.panel.z * a * 0.5, params.panel.w * 0.5);
  let nav_unit = max(half_size.y, 0.0005);

  let d_nav = chain_field(q, a, params.time);
  let d_spot = spot_field(q, a, params.time);
  let unit = select(nav_unit, spot_unit(a), d_spot < d_nav);
  let bevel = max(unit * 0.472, 0.0005);

  let dist = min(d_nav, d_spot);
  let aa = 1.2 / params.resolution.y;
  let inside = 1.0 - smoothstep(-aa, aa, dist);
  let dome = dome_glass(q, a, params.time, bevel);

  let e = 1.4 / params.resolution.y;
  let grad = vec2f(
    dome_glass(q + vec2f(e, 0.0), a, params.time, bevel)
      - dome_glass(q - vec2f(e, 0.0), a, params.time, bevel),
    dome_glass(q + vec2f(0.0, e), a, params.time, bevel)
      - dome_glass(q - vec2f(0.0, e), a, params.time, bevel),
  ) / (2.0 * e);

  let normal = normalize(vec3f(-grad * bevel * 1.15, 1.0));
  let view = vec3f(0.0, 0.0, 1.0);
  let to_light = normalize(LIGHT - vec3f(q, 0.0));
  let halfway = normalize(to_light + view);
  let ndh = max(dot(normal, halfway), 0.0);
  let spec = pow(ndh, 110.0) * 0.85 + pow(ndh, 16.0) * 0.14;
  let fresnel = pow(1.0 - max(dot(normal, view), 0.0), 4.0);

  let bend = -grad * bevel * 2.2;
  let scale = vec2f(1.0 / a, 1.0);
  let refracted = vec3f(
    backdrop(uv + bend * scale * 0.86).r,
    backdrop(uv + bend * scale).g,
    backdrop(uv + bend * scale * 1.20).b,
  );

  let under = blob_field(q, a, params.time, params.seed);
  let energy = under.w;

  var glass = refracted * (1.0 + 0.05 * dome);
  glass = mix(glass, vec3f(1.0), clamp(fresnel, 0.0, 1.0) * 0.22);
  glass += spec * (0.42 + 0.75 * energy);

  let rim = 1.0 - smoothstep(0.0, bevel * 0.42, abs(dist));
  glass = mix(glass, mix(accent(params.seed), vec3f(1.0), 0.35), rim * 0.55);

  let halo = exp(-abs(dist) / (bevel * 2.4));
  color = mix(color, mix(accent(params.seed), vec3f(1.0), 0.25), halo * 0.15 * opacity);

  let shadow = smoothstep(bevel * 2.0, 0.0, dist);
  color *= 1.0 - shadow * (1.0 - inside) * 0.055 * opacity;

  color = mix(color, glass, inside * opacity);
  return finish(color, position.xy);
}
