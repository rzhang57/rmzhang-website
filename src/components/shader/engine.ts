import {
  effect,
  frame,
  surface,
  type Effect,
  type Frame,
  type Gpu,
  type ShaderSource,
  type Surface,
} from "vgpu";
import { getGpu } from "./context";

export type Click = [number, number, number, number];

export interface StepInput {
  pointer: [number, number];
  hover: number;
  press: number;
  time: number;
}

export interface Simulation {
  display: Effect;
  step(input: StepInput): void;
  prepare?(output: Surface): Promise<void>;
  passes?(current: Frame, output: Surface): void;
  dispose?(): void;
}

interface Tile {
  surface: Surface;
  shader: Effect;
  pointer: [number, number];
  hover: number;
  hoverTarget: number;
  seed: number;
  visible: boolean;
  press: number;
  clicks: Click[];
  clickSlot: number;
  step?: (input: StepInput) => void;
  passes?: (current: Frame, output: Surface) => void;
  cleanup?: () => void;
  panel?: () => Panel;
}

export type Panel = {
  rect: [number, number, number, number];
  spot: [number, number, number, number];
  links: [number, number, number, number][];
  style: [number, number, number, number];
};

const EMPTY_LINKS: [number, number, number, number][] = Array.from(
  { length: 10 },
  () => [0, 0, 0, 0] as [number, number, number, number]
);

const NO_PANEL: Panel = {
  rect: [0, 0, 0, 0],
  spot: [0, 0, 0, 0],
  links: EMPTY_LINKS,
  style: [0, 0, 0, 0],
};

let gpu: Gpu | undefined;
let observer: IntersectionObserver | undefined;
let animationFrame = 0;
let origin = 0;

const tiles = new Map<HTMLCanvasElement, Tile>();

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const tile = tiles.get(entry.target as HTMLCanvasElement);
          if (tile) tile.visible = entry.isIntersecting;
        }
      },
      { rootMargin: "120px" }
    );
  }
  return observer;
}

function loop(now: number) {
  animationFrame = requestAnimationFrame(loop);
  if (!gpu || document.hidden) return;

  const seconds = (now - origin) / 1000;
  const active: Tile[] = [];

  for (const tile of tiles.values()) {
    if (!tile.visible) continue;
    tile.hover += (tile.hoverTarget - tile.hover) * 0.09;
    tile.step?.({
      pointer: tile.pointer,
      hover: tile.hover,
      press: tile.press,
      time: seconds,
    });
    const panel = tile.panel?.() ?? NO_PANEL;
    tile.shader.set({
      params: {
        resolution: tile.surface.size,
        pointer: tile.pointer,
        time: seconds,
        hover: tile.hover,
        seed: tile.seed,
        press: tile.press,
        click_a: tile.clicks[0],
        click_b: tile.clicks[1],
        click_c: tile.clicks[2],
        click_d: tile.clicks[3],
        panel: panel.rect,
        panel_spot: panel.spot,
        panel_style: panel.style,
        panel_links: panel.links,
      },
    });
    active.push(tile);
  }

  if (active.length === 0) return;

  frame(gpu, (current) => {
    for (const tile of active) {
      if (tile.passes) {
        tile.passes(current, tile.surface);
      } else {
        current.pass(tile.surface, tile.shader);
      }
    }
  });
}

function startLoop() {
  if (animationFrame) return;
  origin = performance.now();
  animationFrame = requestAnimationFrame(loop);
}

function stopLoop() {
  if (!animationFrame) return;
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
}

export interface ShaderHandle {
  dispose(): void;
}

export interface MountOptions {
  seed?: number;
  alphaMode?: "opaque" | "premultiplied";
  pointer?: "canvas" | "window";
  panel?: () => Panel;
  host?: HTMLElement | null;
}

function register(
  canvas: HTMLCanvasElement,
  canvasSurface: Surface,
  shader: Effect,
  options: MountOptions,
  hooks?: {
    step?: (input: StepInput) => void;
    passes?: (current: Frame, output: Surface) => void;
    cleanup?: () => void;
  }
): ShaderHandle {
  const tile: Tile = {
    surface: canvasSurface,
    shader,
    pointer: [0.5, 0.5],
    hover: 0,
    hoverTarget: 0,
    seed: options.seed ?? 0,
    visible: true,
    press: 0,
    clicks: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    clickSlot: 0,
    step: hooks?.step,
    passes: hooks?.passes,
    cleanup: hooks?.cleanup,
    panel: options.panel,
  };

  const global = options.pointer === "window";

  const move = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    tile.pointer = [
      (event.clientX - rect.left) / Math.max(1, rect.width),
      (event.clientY - rect.top) / Math.max(1, rect.height),
    ];
    tile.hoverTarget = 1;
  };
  const leave = () => {
    tile.hoverTarget = 0;
  };

  const down = (event: PointerEvent) => {
    move(event);
    tile.press = 1;
    const rect = canvas.getBoundingClientRect();
    tile.clicks[tile.clickSlot] = [
      (event.clientX - rect.left) / Math.max(1, rect.width),
      (event.clientY - rect.top) / Math.max(1, rect.height),
      (performance.now() - origin) / 1000,
      1,
    ];
    tile.clickSlot = (tile.clickSlot + 1) % tile.clicks.length;
  };
  const release = () => {
    tile.press = 0;
  };

  const surfaceHost = options.host ?? canvas;
  const host: HTMLElement | Window = global ? window : surfaceHost;
  host.addEventListener("pointermove", move as EventListener, { passive: true });
  surfaceHost.addEventListener("pointerdown", down, { passive: true });
  window.addEventListener("pointerup", release, { passive: true });
  window.addEventListener("pointercancel", release, { passive: true });
  if (!global) {
    surfaceHost.addEventListener("pointerenter", move, { passive: true });
    surfaceHost.addEventListener("pointerleave", leave);
  } else {
    tile.hoverTarget = 1;
  }

  tiles.set(canvas, tile);
  getObserver().observe(canvas);
  startLoop();

  return {
    dispose() {
      host.removeEventListener("pointermove", move as EventListener);
      surfaceHost.removeEventListener("pointerenter", move);
      surfaceHost.removeEventListener("pointerleave", leave);
      surfaceHost.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      getObserver().unobserve(canvas);
      tiles.delete(canvas);
      tile.cleanup?.();
      canvasSurface.dispose();
      if (tiles.size === 0) stopLoop();
    },
  };
}

export async function mountShader(
  canvas: HTMLCanvasElement,
  source: ShaderSource,
  options: MountOptions = {}
): Promise<ShaderHandle> {
  const context = await getGpu();
  gpu = context;
  const canvasSurface = surface(context, canvas, {
    dpr: [1, 1.5],
    alphaMode: options.alphaMode ?? "opaque",
  });
  const shader = effect(context, source);

  try {
    await shader.compile({ colors: [canvasSurface.format] });
  } catch (error) {
    canvasSurface.dispose();
    throw error;
  }

  return register(canvas, canvasSurface, shader, options);
}

export async function mountSimulation(
  canvas: HTMLCanvasElement,
  create: (gpu: Gpu) => Simulation,
  options: MountOptions = {}
): Promise<ShaderHandle> {
  const context = await getGpu();
  gpu = context;
  const canvasSurface = surface(context, canvas, {
    dpr: [1, 1.5],
    alphaMode: options.alphaMode ?? "opaque",
  });

  let simulation: Simulation;
  try {
    simulation = create(context);
    await simulation.prepare?.(canvasSurface);
    await simulation.display.compile({ colors: [canvasSurface.format] });
  } catch (error) {
    canvasSurface.dispose();
    throw error;
  }

  return register(canvas, canvasSurface, simulation.display, options, {
    step: (input) => simulation.step(input),
    passes: simulation.passes
      ? (current, output) => simulation.passes?.(current, output)
      : undefined,
    cleanup: () => simulation.dispose?.(),
  });
}
