import { head, put } from "@vercel/blob";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import seed from "@/data/content.json";
import { checkShape, shapeOf, type Shape } from "./shape";

export const CONTENT_TAG = "site-content";

// the stored override is keyed by the shape it was written against. a branch
// that changes content.json reads its own key instead of silently falling back
// to the seed because someone else's shape is sitting there.
function fingerprint(shape: Shape) {
  const text = JSON.stringify(shape);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

const BLOB_PATH = `content/site-${fingerprint(shapeOf(seed))}.json`;

// the shape of whatever this branch ships, so pages keep full type inference
// without the admin knowing anything about the field names.
export type Content = typeof seed;

export function seedContent(): Content {
  return seed;
}

export function contentShape(): Shape {
  return shapeOf(seed);
}

// head() is an api call rather than a cdn read, so its uploadedAt is always
// current and makes a query param that busts the blob's edge cache.
const loadOverride = unstable_cache(
  async (): Promise<unknown | null> => {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
    try {
      const meta = await head(BLOB_PATH);
      const response = await fetch(
        `${meta.url}?v=${meta.uploadedAt.getTime()}`,
        { cache: "no-store" }
      );
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },
  ["site-content-override"],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

export async function getContent(): Promise<Content> {
  const override = await loadOverride();
  if (override) {
    const problems = checkShape(override, contentShape());
    if (problems.length === 0) return override as Content;
    console.error("[content] stored content no longer matches the seed", problems);
  }
  return seed;
}

// next 14 takes one argument here and next 16 takes two; the cast keeps this
// file identical on both branches.
function purge(tag: string) {
  (revalidateTag as (name: string, profile?: { expire: number }) => void)(tag, {
    expire: 0,
  });
}

export async function saveContent(content: unknown) {
  const problems = checkShape(content, contentShape());
  if (problems.length > 0) throw new ShapeError(problems);

  await put(BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

  purge(CONTENT_TAG);
  revalidatePath("/", "layout");
}

export async function saveSnapshot(content: unknown) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await put(
    `content/history/${stamp}.json`,
    JSON.stringify({ savedAt: stamp, content }, null, 2),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    }
  );
}

export class ShapeError extends Error {
  problems: string[];

  constructor(problems: string[]) {
    super("content no longer matches the committed shape");
    this.name = "ShapeError";
    this.problems = problems;
  }
}
