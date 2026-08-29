import { init, type Gpu } from "vgpu";

let pending: Promise<Gpu> | null = null;
let current: Gpu | undefined;

export function getGpu(): Promise<Gpu> {
  if (!pending) {
    pending = init().then((created) => {
      current = created;
      return created;
    });
  }
  return pending;
}

export function peekGpu(): Gpu | undefined {
  return current;
}
