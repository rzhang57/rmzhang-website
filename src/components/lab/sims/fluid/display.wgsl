import { Params, PAPER, finish } from "../../../shader/common.wgsl";
import { index_of } from "./fluid-common.wgsl";

const DYE_SIZE = vec2u(512, 288);
const DYE_ASPECT = 512.0 / 288.0;

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> dye: array<vec4f>;

fn sample_dye(p: vec2f) -> vec3f {
  let grid = clamp(p * vec2f(DYE_SIZE) - 0.5, vec2f(0), vec2f(DYE_SIZE) - 1.0);
  let cell = vec2i(floor(grid));
  let f = fract(grid);
  let bottom = mix(dye[index_of(cell, DYE_SIZE)].rgb, dye[index_of(cell + vec2i(1, 0), DYE_SIZE)].rgb, f.x);
  let top = mix(dye[index_of(cell + vec2i(0, 1), DYE_SIZE)].rgb, dye[index_of(cell + vec2i(1, 1), DYE_SIZE)].rgb, f.x);
  return mix(bottom, top, f.y);
}

fn cover(uv: vec2f) -> vec2f {
  let output_aspect = params.resolution.x / max(params.resolution.y, 1.0);
  var scale = vec2f(1.0);
  if (output_aspect > DYE_ASPECT) {
    scale.y = DYE_ASPECT / output_aspect;
  } else {
    scale.x = output_aspect / DYE_ASPECT;
  }
  return 0.5 + (uv - 0.5) * scale;
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var uv = position.xy / params.resolution;
  uv.y = 1.0 - uv.y;
  let absorbance = sample_dye(cover(uv));
  let color = PAPER * exp(-absorbance * 1.25);
  return finish(color, position.xy);
}
