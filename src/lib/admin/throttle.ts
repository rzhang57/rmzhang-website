const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

function current(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) return null;
  return entry;
}

export function isThrottled(key: string) {
  return (current(key)?.count ?? 0) >= MAX_ATTEMPTS;
}

export function recordFailure(key: string) {
  const entry = current(key);
  if (entry) {
    entry.count += 1;
    return;
  }
  attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });

  for (const [name, value] of attempts) {
    if (value.resetAt < Date.now()) attempts.delete(name);
  }
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
