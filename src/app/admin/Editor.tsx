"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAt,
  sectionRoot,
  setAt,
  type Path,
  type Shape,
} from "@/lib/content/shape";
import { Node, label } from "./fields";

export default function Editor({
  initial,
  shape,
}: {
  initial: unknown;
  shape: Shape;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<unknown>(initial);
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const root = useMemo(() => sectionRoot(initial), [initial]);
  const rootShape = useMemo(
    () =>
      root.reduce<Shape>(
        (node, step) =>
          node.kind === "object" ? node.fields[step as string] : node,
        shape
      ),
    [root, shape]
  );

  const sections = useMemo(
    () => (rootShape.kind === "object" ? Object.keys(rootShape.fields) : []),
    [rootShape]
  );
  const [section, setSection] = useState(sections[0] ?? "");

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  );

  function update(path: Path, next: unknown) {
    setDraft((current: unknown) => setAt(current, path, next));
  }

  async function save() {
    setSaving(true);
    setProblems([]);
    setStatus(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await response.json();
      if (!response.ok) {
        setProblems(body.problems ?? []);
        setStatus(body.error ?? "save failed");
        return;
      }
      setStatus("published, live in a few seconds");
      router.refresh();
    } catch {
      setStatus("network error");
    } finally {
      setSaving(false);
    }
  }

  const activeShape =
    rootShape.kind === "object" ? rootShape.fields[section] : rootShape;
  const activePath: Path = [...root, section];

  return (
    <div className="relative z-10 min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[1.5rem] font-normal leading-none tracking-tight">
              content
            </h1>
            <a
              href="/"
              className="font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-900"
            >
              view site
            </a>
          </div>

          <div className="flex items-center gap-3">
            {status && (
              <span className="text-[13px] text-neutral-500">{status}</span>
            )}
            <span className="font-mono text-[11px] text-neutral-400">
              {dirty ? "unsaved" : "in sync"}
            </span>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="rounded border border-neutral-300 px-3 py-1.5 text-[14px] transition-colors hover:border-neutral-500 disabled:pointer-events-none disabled:opacity-40"
            >
              {saving ? "publishing" : "publish"}
            </button>
            <form action="/api/admin/logout" method="post">
              <button className="font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-900">
                sign out
              </button>
            </form>
          </div>
        </header>

        {sections.length > 1 && (
          <nav className="mb-6 flex flex-wrap gap-1">
            {sections.map((name) => (
              <button
                key={name}
                onClick={() => setSection(name)}
                className={`rounded px-3 py-1 text-[14px] transition-colors ${
                  section === name
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {label(name)}
              </button>
            ))}
          </nav>
        )}

        {problems.length > 0 && (
          <ul className="mb-6 space-y-1 rounded border border-red-300 p-3 text-[13px] text-red-600">
            {problems.map((problem) => (
              <li key={problem} className="font-mono">
                {problem}
              </li>
            ))}
          </ul>
        )}

        {activeShape && (
          <Node
            shape={activeShape}
            value={getAt(draft, activePath)}
            path={activePath}
            seed={initial}
            fieldKey={section}
            onChange={update}
          />
        )}
      </div>
    </div>
  );
}
