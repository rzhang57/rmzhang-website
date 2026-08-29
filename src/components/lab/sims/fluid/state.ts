import type { Gpu } from "vgpu";
import { compute, effect, pingPongStorage, storage } from "vgpu";
import advectVelocityWgsl from "./advect-velocity.wgsl";
import curlWgsl from "./curl.wgsl";
import vorticityWgsl from "./vorticity.wgsl";
import divergenceWgsl from "./divergence.wgsl";
import pressureWgsl from "./pressure.wgsl";
import projectWgsl from "./project.wgsl";
import advectDyeWgsl from "./advect-dye.wgsl";
import displayWgsl from "./display.wgsl";

const GRID_SIZE = [128, 72] as const;
const DYE_SIZE = [GRID_SIZE[0] * 4, GRID_SIZE[1] * 4] as const;
const CELLS = GRID_SIZE[0] * GRID_SIZE[1];
const DYE_CELLS = DYE_SIZE[0] * DYE_SIZE[1];

export function createFluid(gpu: Gpu) {
  const allocated: object[] = [];
  try {
    const velocity = pingPongStorage(gpu, CELLS * 8);
    allocated.push(velocity.read, velocity.write);
    const dye = pingPongStorage(gpu, DYE_CELLS * 16);
    allocated.push(dye.read, dye.write);
    const pressure = pingPongStorage(gpu, CELLS * 4);
    allocated.push(pressure.read, pressure.write);
    const divergence = storage(gpu, CELLS * 4, "read-write");
    allocated.push(divergence);
    const curl = storage(gpu, CELLS * 4, "read-write");
    allocated.push(curl);
    const passes = createPasses(gpu);
    return {
      gpu,
      velocity,
      dye,
      pressure,
      divergence,
      curl,
      passes,
      step: 0,
      lastInputStep: -1000,
    };
  } catch (error) {
    for (const buffer of allocated) {
      destroyBuffer(buffer);
    }
    throw error;
  }
}

export type Fluid = ReturnType<typeof createFluid>;

export function destroyFluid(fluid: Fluid): void {
  const buffers = [
    fluid.velocity.read,
    fluid.velocity.write,
    fluid.dye.read,
    fluid.dye.write,
    fluid.pressure.read,
    fluid.pressure.write,
    fluid.divergence,
    fluid.curl,
  ];
  for (const buffer of buffers) {
    destroyBuffer(buffer);
  }
}

function destroyBuffer(buffer: object) {
  (buffer as { destroy(): void }).destroy();
}

function createPasses(gpu: Gpu) {
  const withGrid = (shader: typeof advectVelocityWgsl) =>
    compute(gpu, shader, {
      set: { grid: { size: GRID_SIZE, dye_size: DYE_SIZE } },
    });
  return {
    advectVelocity: withGrid(advectVelocityWgsl),
    curl: withGrid(curlWgsl),
    vorticity: withGrid(vorticityWgsl),
    divergence: withGrid(divergenceWgsl),
    pressure: withGrid(pressureWgsl),
    project: withGrid(projectWgsl),
    advectDye: withGrid(advectDyeWgsl),
    display: effect(gpu, displayWgsl),
  };
}

export interface StirInput {
  active: boolean;
  from: [number, number];
  to: [number, number];
  velocity: [number, number];
  intensity: number;
  consumeStep(): void;
}

export function stepFluid(fluid: Fluid, input?: StirInput): void {
  if (input?.active) fluid.lastInputStep = fluid.step;
  const dynamic = inputUniforms(fluid, input);
  const p = fluid.passes;

  p.advectVelocity
    .set({ input: dynamic, src: fluid.velocity.read, dst: fluid.velocity.write })
    .dispatch(16, 9);
  fluid.velocity.swap();

  p.curl.set({ velocity: fluid.velocity.read, curl: fluid.curl }).dispatch(16, 9);
  p.vorticity
    .set({ src: fluid.velocity.read, curl: fluid.curl, dst: fluid.velocity.write })
    .dispatch(16, 9);
  fluid.velocity.swap();

  p.divergence
    .set({ velocity: fluid.velocity.read, divergence: fluid.divergence })
    .dispatch(16, 9);
  for (let i = 0; i < 3; i++) {
    p.pressure
      .set({
        params: { decay: i === 0 ? 0.8 : 1 },
        src: fluid.pressure.read,
        divergence: fluid.divergence,
        dst: fluid.pressure.write,
      })
      .dispatch(16, 9);
    fluid.pressure.swap();
  }

  p.project
    .set({
      src: fluid.velocity.read,
      pressure: fluid.pressure.read,
      dst: fluid.velocity.write,
    })
    .dispatch(16, 9);
  fluid.velocity.swap();

  p.advectDye
    .set({
      input: dynamic,
      src: fluid.dye.read,
      velocity: fluid.velocity.read,
      dst: fluid.dye.write,
    })
    .dispatch(64, 36);
  fluid.dye.swap();
  fluid.step++;
  input?.consumeStep();
}

export function bindDye(fluid: Fluid): void {
  fluid.passes.display.set({ dye: fluid.dye.read });
}

function inputUniforms(fluid: Fluid, input?: StirInput) {
  const time = fluid.step / 60;
  const [a, b, c] = idleEmitters(time);
  const ramp = Math.min(1, (fluid.step + 1) / 180);
  const sinceInput = fluid.step - fluid.lastInputStep;
  const settle = sinceInput < 120 ? 0.62 : 1;
  const strength = ramp * settle;
  let pointerVelocity = input?.velocity ?? ([0, 0] as [number, number]);
  const speed = Math.hypot(pointerVelocity[0], pointerVelocity[1]);
  if (input?.active && speed < 0.02) {
    pointerVelocity = [0.05 * Math.cos(time * 4), 0.05 * Math.sin(time * 4)];
  }
  const direction =
    speed > 1e-4 ? [pointerVelocity[0] / speed, pointerVelocity[1] / speed] : [0, 0];
  return {
    step: fluid.step,
    pointer_active: input?.active ? 1 : 0,
    pointer_from: input?.from ?? [0.5, 0.5],
    pointer_to: input?.to ?? [0.5, 0.5],
    pointer_velocity: pointerVelocity,
    pointer_color: [
      0.5 + 0.5 * direction[0],
      0.5 + 0.5 * direction[1],
      1,
      input?.intensity ?? 0,
    ],
    idle_a: [a[0], a[1], 0.9 * strength, 0.016],
    idle_b: [b[0], b[1], 0.85 * strength, 0.014],
    idle_c: [c[0], c[1], 0.8 * strength, 0.02],
  };
}

function idleEmitters(
  t: number
): [[number, number], [number, number], [number, number]] {
  return [
    [0.5 + 0.28 * Math.sin(0.73 * t), 0.5 + 0.22 * Math.sin(1.09 * t + 0.4)],
    [
      0.5 + 0.26 * Math.sin(0.61 * t + Math.PI),
      0.5 + 0.24 * Math.sin(0.97 * t + 2.1),
    ],
    [0.42 + 0.3 * Math.sin(0.41 * t + 1.7), 0.34 + 0.2 * Math.sin(0.53 * t + 4.2)],
  ];
}
