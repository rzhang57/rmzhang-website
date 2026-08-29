import { compute, effect, storage, type Gpu } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import resetWgsl from "./reset.wgsl";
import pourWgsl from "./pour.wgsl";
import settleWgsl from "./settle.wgsl";
import displayWgsl from "./display.wgsl";

const SIZE = [192, 120] as const;
const CELLS = SIZE[0] * SIZE[1];
const FULL_GROUPS = [SIZE[0] / 8, SIZE[1] / 8] as const;
const BLOCK_GROUPS = [Math.ceil(SIZE[0] / 2 / 8), Math.ceil(SIZE[1] / 2 / 8)] as const;
const SETTLE_STEPS = 4;

export function createSand(gpu: Gpu): Simulation {
  const cells = storage(gpu, CELLS * 4, "read-write");

  const base = { size: SIZE, phase: 0, frame: 0 };
  const reset = compute(gpu, resetWgsl, { set: { grid: base, cells } });
  const pour = compute(gpu, pourWgsl, { set: { grid: base } });
  const settle = compute(gpu, settleWgsl, { set: { grid: base } });
  const display = effect(gpu, displayWgsl, { set: { grid: base, cells } });

  reset.dispatch(FULL_GROUPS[0], FULL_GROUPS[1]);

  let frame = 0;

  return {
    display,
    step(input: StepInput) {
      frame++;

      const idle = 0.5 + 0.42 * Math.sin(input.time * 0.55);
      const pointer = input.hover > 0.05 ? input.pointer : [idle, 0.06];
      const amount = input.hover > 0.05 ? 0.1 + 0.5 * input.press : 0.05;

      pour
        .set({
          grid: { size: SIZE, phase: 0, frame },
          pour: { pointer, radius: 0.045 + 0.03 * input.press, amount },
          cells,
        })
        .dispatch(FULL_GROUPS[0], FULL_GROUPS[1]);

      for (let i = 0; i < SETTLE_STEPS; i++) {
        settle
          .set({ grid: { size: SIZE, phase: (frame + i) % 2, frame: frame + i }, cells })
          .dispatch(BLOCK_GROUPS[0], BLOCK_GROUPS[1]);
      }

      display.set({ grid: { size: SIZE, phase: 0, frame }, cells });
    },
    dispose() {
      (cells as unknown as { destroy(): void }).destroy();
    },
  };
}
