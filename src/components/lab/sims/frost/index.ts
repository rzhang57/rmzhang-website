import { effect, target, type Frame, type Gpu, type Surface, type Target } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import pageWgsl from "./page.wgsl";
import glassWgsl from "./glass.wgsl";
import blurWgsl from "../backlit/blur.wgsl";

const PAGE_SIZE = [640, 400] as const;
const BLUR_SIZE = [320, 200] as const;

export function createFrost(gpu: Gpu): Simulation {
  const owned: Target[] = [];
  const make = (size: readonly [number, number]) => {
    const created = target(gpu, { size });
    owned.push(created);
    return created;
  };

  const page = make(PAGE_SIZE);
  const pending = make(BLUR_SIZE);
  const blurred = make(BLUR_SIZE);

  const pagePass = effect(gpu, pageWgsl, {
    set: { config: { resolution: PAGE_SIZE, time: 0 } },
  });
  const blurHorizontal = effect(gpu, blurWgsl, {
    set: {
      config: { resolution: BLUR_SIZE, direction: [1, 0], radius: 2.4 },
      source_tex: page,
    },
  });
  const blurVertical = effect(gpu, blurWgsl, {
    set: {
      config: { resolution: BLUR_SIZE, direction: [0, 1], radius: 2.4 },
      source_tex: pending,
    },
  });
  const glass = effect(gpu, glassWgsl, {
    set: { sharp_tex: page, blurred_tex: blurred },
  });

  return {
    display: glass,
    async prepare() {
      await Promise.all([
        pagePass.compile(page),
        blurHorizontal.compile(pending),
        blurVertical.compile(blurred),
      ]);
    },
    step(input: StepInput) {
      pagePass.set({ config: { resolution: PAGE_SIZE, time: input.time } });
    },
    passes(current: Frame, output: Surface) {
      current.pass(page, pagePass);
      current.pass(pending, blurHorizontal);
      current.pass(blurred, blurVertical);
      current.pass(output, glass);
    },
    dispose() {
      for (const item of owned) {
        (item as unknown as { destroy?: () => void }).destroy?.();
      }
    },
  };
}
