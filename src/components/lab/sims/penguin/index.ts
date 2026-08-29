import {
  draw,
  effect,
  geometry,
  target,
  type Draw,
  type Frame,
  type Geometry,
  type Gpu,
  type Surface,
} from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import voxelsWgsl from "./voxels.wgsl";
import blitWgsl from "./blit.wgsl";
import { cubeVertices, voxelize } from "./voxelize";
import { consumeAssemble } from "./pulse";

const SCENE_SIZE: readonly [number, number] = [720, 450];
const SOURCE = "/statics/pfp.png";
const PAPER: [number, number, number, number] = [0.9933, 0.9907, 0.9867, 1];
const CLEAR: [number, number, number, number] = [0, 0, 0, 0];

export function createPenguin(
  gpu: Gpu,
  size: readonly [number, number] = SCENE_SIZE,
  transparent = false,
  zoom = 1
): Simulation {
  const scene = target(gpu, { size, depth: true });
  const blit = effect(gpu, blitWgsl, { set: { scene_tex: scene } });

  let mesh: Geometry | undefined;
  let voxels: Draw | undefined;
  let latest: StepInput = { pointer: [0.5, 0.5], hover: 0, press: 0, time: 0 };
  let spinStart = -100;
  let wasHovering = false;
  let wasPressed = false;

  const config = (input: StepInput) => ({
    resolution: size,
    pointer: input.pointer,
    time: input.time,
    hover: input.hover,
    press: input.press,
    zoom,
    spin: input.time - spinStart,
  });

  return {
    display: blit,
    async prepare() {
      const model = await voxelize(SOURCE);

      mesh = geometry(gpu, {
        buffers: [
          {
            data: cubeVertices().buffer as ArrayBuffer,
            stride: 24,
            attributes: { corner: "float32x3", face_normal: "float32x3" },
          },
          {
            data: model.instances.buffer as ArrayBuffer,
            stride: 48,
            stepMode: "instance",
            attributes: {
              instance_center: "float32x3",
              instance_half: "float32x3",
              instance_color: "float32x3",
              instance_back: "float32x3",
            },
          },
        ],
      });

      voxels = draw(gpu, {
        shader: voxelsWgsl,
        geometry: mesh,
        cull: "none",
        set: { config: config(latest) },
      });

      await voxels.compile(scene);
    },
    step(input: StepInput) {
      const pressed = input.press > 0.5;
      const hovering = input.hover > 0.45;
      const clicked = pressed && !wasPressed;
      const entered = hovering && !wasHovering;
      if (clicked || entered || consumeAssemble()) spinStart = input.time;
      wasPressed = pressed;
      wasHovering = hovering;
      latest = input;
      voxels?.set({ config: config(input) });
    },
    passes(current: Frame, output: Surface) {
      if (voxels) {
        current.pass(
          { target: scene, clear: transparent ? CLEAR : PAPER, clearDepth: 1 },
          (pass) =>
          pass.draw(voxels as Draw)
        );
      }
      current.pass(output, blit);
    },
    dispose() {
      mesh?.destroy();
      (scene as unknown as { destroy?: () => void }).destroy?.();
    },
  };
}
