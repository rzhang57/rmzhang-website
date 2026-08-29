export interface VoxelMesh {
  instances: Float32Array;
  count: number;
}

const GRID_WIDTH = 104;
const BULGE_CELLS = 6;
const MAX_HALF_DEPTH = 0.3;

async function loadPixels(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("2d context unavailable");
  context.drawImage(bitmap, 0, 0);
  const image = context.getImageData(0, 0, bitmap.width, bitmap.height);
  bitmap.close();
  return image;
}

function distanceTransform(mask: Uint8Array, width: number, height: number) {
  const distance = new Float32Array(width * height);
  const far = width + height;

  for (let i = 0; i < distance.length; i++) {
    distance[i] = mask[i] ? far : 0;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!mask[i]) continue;
      let best = distance[i];
      if (x > 0) best = Math.min(best, distance[i - 1] + 1);
      if (y > 0) best = Math.min(best, distance[i - width] + 1);
      if (x > 0 && y > 0) best = Math.min(best, distance[i - width - 1] + 1.414);
      if (x < width - 1 && y > 0) best = Math.min(best, distance[i - width + 1] + 1.414);
      distance[i] = best;
    }
  }

  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x;
      if (!mask[i]) continue;
      let best = distance[i];
      if (x < width - 1) best = Math.min(best, distance[i + 1] + 1);
      if (y < height - 1) best = Math.min(best, distance[i + width] + 1);
      if (x < width - 1 && y < height - 1) best = Math.min(best, distance[i + width + 1] + 1.414);
      if (x > 0 && y < height - 1) best = Math.min(best, distance[i + width - 1] + 1.414);
      distance[i] = best;
    }
  }

  return distance;
}

function isPaper(data: Uint8ClampedArray, pixel: number): boolean {
  const offset = pixel * 4;
  if (data[offset + 3] < 128) return true;
  return data[offset] > 237 && data[offset + 1] > 237 && data[offset + 2] > 237;
}

function outsideMask(image: ImageData): Uint8Array {
  const { width, height, data } = image;
  const outside = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const push = (pixel: number) => {
    if (outside[pixel] || !isPaper(data, pixel)) return;
    outside[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    const y = (pixel / width) | 0;
    if (x > 0) push(pixel - 1);
    if (x < width - 1) push(pixel + 1);
    if (y > 0) push(pixel - width);
    if (y < height - 1) push(pixel + width);
  }

  return outside;
}

export async function voxelize(url: string): Promise<VoxelMesh> {
  const image = await loadPixels(url);
  const outside = outsideMask(image);
  const cell = Math.max(1, Math.round(image.width / GRID_WIDTH));
  const columns = Math.floor(image.width / cell);
  const rows = Math.floor(image.height / cell);

  const mask = new Uint8Array(columns * rows);
  const colors = new Float32Array(columns * rows * 3);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      let red = 0;
      let green = 0;
      let blue = 0;
      let kept = 0;

      for (let sy = 0; sy < cell; sy++) {
        for (let sx = 0; sx < cell; sx++) {
          const pixel = (row * cell + sy) * image.width + (column * cell + sx);
          if (outside[pixel]) continue;
          const offset = pixel * 4;
          red += image.data[offset] / 255;
          green += image.data[offset + 1] / 255;
          blue += image.data[offset + 2] / 255;
          kept++;
        }
      }

      const index = row * columns + column;
      if (kept > cell * cell * 0.45) {
        mask[index] = 1;
        colors[index * 3] = red / kept;
        colors[index * 3 + 1] = green / kept;
        colors[index * 3 + 2] = blue / kept;
      }
    }
  }

  const distance = distanceTransform(mask, columns, rows);

  let count = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) count++;
  }

  const dominant = dominantBody(mask, colors);
  const instances = new Float32Array(count * 12);
  const scale = 2.0 / rows;
  const halfX = (columns * scale) / 2;
  const halfY = (rows * scale) / 2;

  let cursor = 0;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      if (!mask[index]) continue;

      const bulge = Math.sqrt(Math.min(distance[index] / BULGE_CELLS, 1));
      const depth = Math.max(scale * 0.55, MAX_HALF_DEPTH * bulge);

      instances[cursor++] = (column + 0.5) * scale - halfX;
      instances[cursor++] = halfY - (row + 0.5) * scale;
      instances[cursor++] = 0;
      instances[cursor++] = scale * 0.5;
      instances[cursor++] = scale * 0.5;
      instances[cursor++] = depth;
      const r = colors[index * 3];
      const g = colors[index * 3 + 1];
      const b = colors[index * 3 + 2];
      instances[cursor++] = r;
      instances[cursor++] = g;
      instances[cursor++] = b;

      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const cool = b > r + 0.06;
      const foot = r > b + 0.15 && row / rows > 0.62;
      const back = luma <= 0.7 && (cool || foot) ? [r, g, b] : dominant;
      instances[cursor++] = back[0];
      instances[cursor++] = back[1];
      instances[cursor++] = back[2];
    }
  }

  return { instances, count };
}

function dominantBody(mask: Uint8Array, colors: Float32Array): [number, number, number] {
  const buckets = new Map<number, { count: number; r: number; g: number; b: number }>();

  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const r = colors[i * 3];
    const g = colors[i * 3 + 1];
    const b = colors[i * 3 + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma > 0.82 || luma < 0.16) continue;

    const key =
      (Math.min(7, (r * 8) | 0) << 6) |
      (Math.min(7, (g * 8) | 0) << 3) |
      Math.min(7, (b * 8) | 0);
    const bucket = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
    bucket.count++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }

  let best: { count: number; r: number; g: number; b: number } | undefined;
  for (const bucket of buckets.values()) {
    if (!best || bucket.count > best.count) best = bucket;
  }
  if (!best) return [0.23, 0.55, 0.82];
  return [best.r / best.count, best.g / best.count, best.b / best.count];
}

export function cubeVertices(): Float32Array {
  const faces: [number[], number[]][] = [
    [[0, 0, 1], [1, 1, 1]],
    [[0, 0, -1], [1, 1, -1]],
    [[1, 0, 0], [1, 1, 1]],
    [[-1, 0, 0], [-1, 1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[0, -1, 0], [1, -1, 1]],
  ];

  const data: number[] = [];
  const corners: [number, number][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
  ];

  for (const [normal] of faces) {
    const [nx, ny, nz] = normal;
    for (const [u, v] of corners) {
      let position: [number, number, number];
      if (nz !== 0) position = [u, v, nz];
      else if (nx !== 0) position = [nx, v, u];
      else position = [u, ny, v];
      data.push(position[0], position[1], position[2], nx, ny, nz);
    }
  }

  return new Float32Array(data);
}
