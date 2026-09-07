export type Shape =
  | { kind: "text" }
  | { kind: "object"; fields: Record<string, Shape> }
  | { kind: "list"; item: Shape };

export type Path = (string | number)[];

// list items are unified rather than sampled, so one row missing a key does not
// make every other row look wrong.
function unify(shapes: Shape[]): Shape {
  if (shapes.length === 0) return { kind: "text" };
  if (shapes.length === 1) return shapes[0];

  if (shapes.every((shape) => shape.kind === "object")) {
    const fields: Record<string, Shape> = {};
    for (const shape of shapes) {
      if (shape.kind !== "object") continue;
      for (const [key, child] of Object.entries(shape.fields)) {
        fields[key] = fields[key] ? unify([fields[key], child]) : child;
      }
    }
    return { kind: "object", fields };
  }

  if (shapes.every((shape) => shape.kind === "list")) {
    return {
      kind: "list",
      item: unify(
        shapes.map((shape) => (shape.kind === "list" ? shape.item : shape))
      ),
    };
  }

  return shapes[0];
}

// the committed content.json is the contract. everything the editor writes has
// to still match its structure, so a saved override can never drop a key the
// pages read.
export function shapeOf(value: unknown): Shape {
  if (Array.isArray(value)) {
    return { kind: "list", item: unify(value.map(shapeOf)) };
  }
  if (value !== null && typeof value === "object") {
    const fields: Record<string, Shape> = {};
    for (const [key, child] of Object.entries(value)) {
      fields[key] = shapeOf(child);
    }
    return { kind: "object", fields };
  }
  return { kind: "text" };
}

export function checkShape(value: unknown, shape: Shape, path = ""): string[] {
  const at = path || "root";

  if (shape.kind === "text") {
    return typeof value === "string" ? [] : [`${at}: expected text`];
  }

  if (shape.kind === "list") {
    if (!Array.isArray(value)) return [`${at}: expected a list`];
    return value.flatMap((item, index) =>
      checkShape(item, shape.item, `${at}[${index}]`)
    );
  }

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [`${at}: expected a group of fields`];
  }

  const expected = Object.keys(shape.fields);
  const actual = Object.keys(value as Record<string, unknown>);
  const problems: string[] = [];

  for (const key of actual) {
    if (!expected.includes(key)) problems.push(`${at}.${key}: unknown field`);
  }
  for (const key of expected) {
    if (!actual.includes(key)) {
      problems.push(`${at}.${key}: missing`);
      continue;
    }
    problems.push(
      ...checkShape(
        (value as Record<string, unknown>)[key],
        shape.fields[key],
        path ? `${path}.${key}` : key
      )
    );
  }

  return problems;
}

export function blank(shape: Shape): unknown {
  if (shape.kind === "text") return "";
  if (shape.kind === "list") return [];
  return Object.fromEntries(
    Object.entries(shape.fields).map(([key, child]) => [key, blank(child)])
  );
}

export function getAt(value: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (node, step) => (node as Record<string | number, unknown>)?.[step],
    value
  );
}

export function setAt(value: unknown, path: Path, next: unknown): unknown {
  if (path.length === 0) return next;

  const [step, ...rest] = path;
  if (typeof step === "number") {
    const list = (value as unknown[]).slice();
    list[step] = setAt(list[step], rest, next);
    return list;
  }
  return {
    ...(value as Record<string, unknown>),
    [step]: setAt((value as Record<string, unknown>)[step], rest, next),
  };
}

// content.json wraps everything in a single key on some branches and spreads it
// across several on others. the tab strip wants whichever level actually holds
// the sections, so walk past any lone object wrapper.
export function sectionRoot(value: unknown): Path {
  const path: Path = [];
  let node = value;

  while (
    node !== null &&
    typeof node === "object" &&
    !Array.isArray(node) &&
    Object.keys(node).length === 1
  ) {
    const [key] = Object.keys(node);
    const child = (node as Record<string, unknown>)[key];
    if (child === null || typeof child !== "object" || Array.isArray(child)) {
      break;
    }
    path.push(key);
    node = child;
  }

  return path;
}
