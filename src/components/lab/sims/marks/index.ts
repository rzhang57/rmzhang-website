import { draw, effect, geometry, type Frame, type Gpu, type Surface } from "vgpu";
import type { Simulation, StepInput } from "@/components/shader/engine";
import backdropWgsl from "./backdrop.wgsl";
import marksWgsl from "./marks.wgsl";

const COLUMNS = 78;
const ROWS = 48;
const EXTENT = 1.15;

function quadVertices(): Float32Array {
  return new Float32Array([
    -1, -1, 1, -1, 1, 1,
    -1, -1, 1, 1, -1, 1,
  ]);
}

function instanceData(): Float32Array {
  const data = new Float32Array(COLUMNS * ROWS * 3);
  let cursor = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const x = ((column + 0.5) / COLUMNS - 0.5) * 2 * EXTENT;
      const y = ((row + 0.5) / ROWS - 0.5) * 2 * EXTENT;
      data[cursor++] = x;
      data[cursor++] = y;
      data[cursor++] = Math.sin(x * 2.3) * 0.5 + Math.cos(y * 1.9) * 0.5;
    }
  }
  return data;
}

export function createMarks(gpu: Gpu): Simulation {
  const mesh = geometry(gpu, {
    buffers: [
      {
        data: quadVertices().buffer as ArrayBuffer,
        stride: 8,
        attributes: { corner: "float32x2" },
      },
      {
        data: instanceData().buffer as ArrayBuffer,
        stride: 12,
        stepMode: "instance",
        attributes: { instance_origin: "float32x2", instance_tone: "float32" },
      },
    ],
  });

  const backdrop = effect(gpu, backdropWgsl);
  const marks = draw(gpu, {
    shader: marksWgsl,
    geometry: mesh,
    blend: "premultiplied",
    set: {
      config: { resolution: [640, 400], pointer: [0.5, 0.5], time: 0, hover: 0 },
    },
  });

  return {
    display: backdrop,
    async prepare(output: Surface) {
      await marks.compile({ colors: [output.format] });
    },
    step(input: StepInput) {
      marks.set({
        config: {
          resolution: [640, 400],
          pointer: input.pointer,
          time: input.time,
          hover: input.hover,
        },
      });
    },
    passes(current: Frame, output: Surface) {
      current.pass(output, (pass) => {
        pass.draw(backdrop);
        pass.draw(marks);
      });
    },
    dispose() {
      mesh.destroy();
    },
  };
}
