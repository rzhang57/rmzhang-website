import type { Gpu } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import {
  bindDye,
  createFluid as createFluidState,
  destroyFluid,
  stepFluid,
  type StirInput,
} from "./state";

const WARMUP_STEPS = 120;
const IDLE_STEPS = 24;

export function createFluid(gpu: Gpu): Simulation {
  const fluid = createFluidState(gpu);

  let from: [number, number] = [0.5, 0.5];
  let to: [number, number] = [0.5, 0.5];
  let velocity: [number, number] = [0, 0];
  let idle = IDLE_STEPS;

  const stir: StirInput = {
    get active() {
      return idle < IDLE_STEPS;
    },
    get from() {
      return from;
    },
    get to() {
      return to;
    },
    get velocity() {
      return velocity;
    },
    get intensity() {
      return Math.min(1, Math.hypot(velocity[0], velocity[1]) / 1.1);
    },
    consumeStep() {
      from = to;
      if (idle < IDLE_STEPS) {
        idle++;
        velocity = [velocity[0] * 0.86, velocity[1] * 0.86];
      }
    },
  };

  for (let i = 0; i < WARMUP_STEPS; i++) {
    stepFluid(fluid);
  }
  bindDye(fluid);

  return {
    display: fluid.passes.display,
    step(input: StepInput) {
      const next: [number, number] = [input.pointer[0], 1 - input.pointer[1]];
      const moved = Math.hypot(next[0] - to[0], next[1] - to[1]);

      if (input.hover > 0.05 && moved > 0.0005) {
        from = to;
        to = next;
        velocity = [
          Math.max(-2.5, Math.min(2.5, (to[0] - from[0]) * 45)),
          Math.max(-2.5, Math.min(2.5, (to[1] - from[1]) * 45)),
        ];
        idle = 0;
      }

      stepFluid(fluid, stir);
      bindDye(fluid);
    },
    dispose() {
      destroyFluid(fluid);
    },
  };
}
