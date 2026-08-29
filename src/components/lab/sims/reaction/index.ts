import { compute, effect, pingPongStorage, type Gpu } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import seedWgsl from "./seed.wgsl";
import stepWgsl from "./step.wgsl";
import displayWgsl from "./display.wgsl";

const SIZE = [320, 176] as const;
const GROUPS = [SIZE[0] / 8, SIZE[1] / 8] as const;
const CELLS = SIZE[0] * SIZE[1];
const STEPS_PER_FRAME = 10;

export function createReaction(gpu: Gpu): Simulation {
  const grid = { size: SIZE };
  const cells = pingPongStorage(gpu, CELLS * 8);

  const seed = compute(gpu, seedWgsl, { set: { grid } });
  const advance = compute(gpu, stepWgsl, { set: { grid } });
  const display = effect(gpu, displayWgsl, { set: { grid } });

  seed.set({ cells: cells.read }).dispatch(GROUPS[0], GROUPS[1]);

  return {
    display,
    step(input: StepInput) {
      const brush = {
        pointer: input.pointer,
        radius: 0.045 + 0.05 * input.press,
        strength: input.hover > 0.02 ? (0.45 + 0.5 * input.press) * input.hover : 0,
      };

      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        advance
          .set({ brush, src: cells.read, dst: cells.write })
          .dispatch(GROUPS[0], GROUPS[1]);
        cells.swap();
      }

      display.set({ cells: cells.read });
    },
    dispose() {
      (cells.read as unknown as { destroy(): void }).destroy();
      (cells.write as unknown as { destroy(): void }).destroy();
    },
  };
}
