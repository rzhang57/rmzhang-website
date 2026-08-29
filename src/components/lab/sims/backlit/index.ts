import { effect, target, type Frame, type Gpu, type Surface, type Target } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import sceneWgsl from "./scene.wgsl";
import thresholdWgsl from "./threshold.wgsl";
import blurWgsl from "./blur.wgsl";
import compositeWgsl from "./composite.wgsl";

const SCENE_SIZE = [640, 400] as const;
const BLOOM_SIZE = [320, 200] as const;
const HDR = "rgba16float" as const;

export function createBacklit(gpu: Gpu): Simulation {
  const owned: Target[] = [];
  const make = (size: readonly [number, number]) => {
    const created = target(gpu, { size, format: HDR });
    owned.push(created);
    return created;
  };

  const scene = make(SCENE_SIZE);
  const bright = make(BLOOM_SIZE);
  const pending = make(BLOOM_SIZE);
  const bloom = make(BLOOM_SIZE);

  const scenePass = effect(gpu, sceneWgsl, {
    set: { config: { resolution: SCENE_SIZE, pointer: [0.5, 0.35], time: 0, hover: 0 } },
  });
  const thresholdPass = effect(gpu, thresholdWgsl, {
    set: { config: { resolution: BLOOM_SIZE, cutoff: 0.85 }, source_tex: scene },
  });
  const blurHorizontal = effect(gpu, blurWgsl, {
    set: {
      config: { resolution: BLOOM_SIZE, direction: [1, 0], radius: 1.6 },
      source_tex: bright,
    },
  });
  const blurVertical = effect(gpu, blurWgsl, {
    set: {
      config: { resolution: BLOOM_SIZE, direction: [0, 1], radius: 1.6 },
      source_tex: pending,
    },
  });
  const composite = effect(gpu, compositeWgsl, {
    set: { scene_tex: scene, bloom_tex: bloom },
  });

  return {
    display: composite,
    async prepare() {
      await Promise.all([
        scenePass.compile(scene),
        thresholdPass.compile(bright),
        blurHorizontal.compile(pending),
        blurVertical.compile(bloom),
      ]);
    },
    step(input: StepInput) {
      scenePass.set({
        config: {
          resolution: SCENE_SIZE,
          pointer: input.pointer,
          time: input.time,
          hover: input.hover,
        },
      });
    },
    passes(current: Frame, output: Surface) {
      current.pass(scene, scenePass);
      current.pass(bright, thresholdPass);
      current.pass(pending, blurHorizontal);
      current.pass(bloom, blurVertical);
      current.pass(output, composite);
    },
    dispose() {
      for (const item of owned) {
        (item as unknown as { destroy?: () => void }).destroy?.();
      }
    },
  };
}
