"use client";

import { blank, getAt, type Path, type Shape } from "@/lib/content/shape";

const LONG_KEYS = new Set([
  "blurb",
  "body",
  "closing",
  "description",
  "detail",
  "details",
  "elaboration",
  "intro",
  "interests",
  "note",
  "overview",
  "statement",
  "summary",
  "text",
]);

const TITLE_KEYS = ["name", "company", "category", "title", "label", "role"];

const INPUT =
  "w-full rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-[14px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500";

export function label(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

// decided from the committed content so a field never swaps between an input
// and a textarea while it is being typed into.
function isLong(seed: unknown, path: Path, key: string) {
  if (LONG_KEYS.has(key)) return true;
  const original = getAt(seed, path);
  return typeof original === "string" && original.length > 60;
}

function rowTitle(value: unknown, shape: Shape) {
  if (shape.kind !== "object" || value === null || typeof value !== "object") {
    return "";
  }
  const record = value as Record<string, unknown>;
  for (const key of TITLE_KEYS) {
    if (typeof record[key] === "string" && record[key]) {
      return record[key] as string;
    }
  }
  for (const [key, child] of Object.entries(shape.fields)) {
    if (child.kind === "text" && typeof record[key] === "string" && record[key]) {
      return record[key] as string;
    }
  }
  return "";
}

function IconButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="rounded px-1.5 py-0.5 font-mono text-[12px] text-neutral-400 transition-colors hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function Node({
  shape,
  value,
  path,
  seed,
  fieldKey,
  onChange,
}: {
  shape: Shape;
  value: unknown;
  path: Path;
  seed: unknown;
  fieldKey: string;
  onChange: (path: Path, next: unknown) => void;
}) {
  if (shape.kind === "text") {
    const text = typeof value === "string" ? value : "";
    return isLong(seed, path, fieldKey) ? (
      <textarea
        rows={3}
        value={text}
        onChange={(event) => onChange(path, event.target.value)}
        className={`${INPUT} resize-y`}
      />
    ) : (
      <input
        type="text"
        value={text}
        onChange={(event) => onChange(path, event.target.value)}
        className={INPUT}
      />
    );
  }

  if (shape.kind === "object") {
    return (
      <div className="space-y-2.5">
        {Object.entries(shape.fields).map(([key, child]) => (
          <label key={key} className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-neutral-400">
              {label(key)}
            </span>
            <Node
              shape={child}
              value={(value as Record<string, unknown>)?.[key]}
              path={[...path, key]}
              seed={seed}
              fieldKey={key}
              onChange={onChange}
            />
          </label>
        ))}
      </div>
    );
  }

  const items = Array.isArray(value) ? value : [];
  const flat = shape.item.kind === "text";

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={flat ? "flex items-start gap-1" : "rounded border border-neutral-200 p-3"}
        >
          {flat ? (
            <>
              <textarea
                rows={2}
                value={typeof item === "string" ? item : ""}
                onChange={(event) =>
                  onChange([...path, index], event.target.value)
                }
                className={`${INPUT} resize-y`}
              />
              <div className="flex shrink-0 flex-col pt-1">
                <IconButton
                  title="move up"
                  disabled={index === 0}
                  onClick={() => onChange(path, move(items, index, index - 1))}
                >
                  ↑
                </IconButton>
                <IconButton
                  title="move down"
                  disabled={index === items.length - 1}
                  onClick={() => onChange(path, move(items, index, index + 1))}
                >
                  ↓
                </IconButton>
                <IconButton
                  title="delete"
                  onClick={() =>
                    onChange(
                      path,
                      items.filter((_, i) => i !== index)
                    )
                  }
                >
                  ✕
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[11px] text-neutral-400">
                  {String(index + 1).padStart(2, "0")} ·{" "}
                  {rowTitle(item, shape.item) || "untitled"}
                </span>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconButton
                    title="move up"
                    disabled={index === 0}
                    onClick={() => onChange(path, move(items, index, index - 1))}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    title="move down"
                    disabled={index === items.length - 1}
                    onClick={() => onChange(path, move(items, index, index + 1))}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    title="delete"
                    onClick={() =>
                      onChange(
                        path,
                        items.filter((_, i) => i !== index)
                      )
                    }
                  >
                    ✕
                  </IconButton>
                </div>
              </div>
              <Node
                shape={shape.item}
                value={item}
                path={[...path, index]}
                seed={seed}
                fieldKey={fieldKey}
                onChange={onChange}
              />
            </>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange(path, [...items, blank(shape.item)])}
        className="w-full rounded border border-dashed border-neutral-300 py-1.5 text-[13px] text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-900"
      >
        + {label(fieldKey).replace(/s$/, "") || "item"}
      </button>
    </div>
  );
}
