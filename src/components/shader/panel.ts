export interface PanelRect {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export interface PanelSample {
  current: PanelRect;
  spot: PanelRect;
  links: PanelRect[];
  agitation: number;
  presence: number;
  spotPresence: number;
}

export const LINK_COUNT = 10;
const LINK_DELAY = 0.019;
const OMEGA = 9.0;
const ZETA = 0.68;
const HISTORY = 64;
const GROW_IN = 0.055;
const GROW_OUT = 0.115;
const SWAP_OUT = 0.34;
const SWAP_IN = 0.14;

const empty: PanelRect = { x: 0, y: 0, width: 0, height: 0, opacity: 0 };

let glassLive = false;
const listeners = new Set<() => void>();

export function setGlassLive(value: boolean) {
  if (glassLive === value) return;
  glassLive = value;
  for (const listener of listeners) listener();
}

export function subscribeGlass(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isGlassLive() {
  return glassLive;
}

function springed(t: number) {
  if (t <= 0) return 0;
  const wd = OMEGA * Math.sqrt(1 - ZETA * ZETA);
  const decay = Math.exp(-ZETA * OMEGA * t);
  return 1 - decay * (Math.cos(wd * t) + ((ZETA * OMEGA) / wd) * Math.sin(wd * t));
}

function lerpRect(a: PanelRect, b: PanelRect, t: number): PanelRect {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    width: a.width + (b.width - a.width) * t,
    height: a.height + (b.height - a.height) * t,
    opacity: a.opacity,
  };
}

interface Frame {
  time: number;
  rect: PanelRect;
}

const history: Frame[] = [];

let baseRect: PanelRect | null = null;
let baseGroup = "nav";
let hoverRect: PanelRect | null = null;
let hoverGroup = "nav";
let activeGroup = "nav";
let pendingRect: PanelRect | null = null;
let pendingGroup = "nav";

let origin: PanelRect = empty;
let target: PanelRect = empty;
let startedAt = 0;
let presence = 0;
let presenceTarget = 0;
let agitation = 0;

// an independent bubble for ordinary links: it grows where it is and
// shrinks where it is, never travelling between elements
let spotShown: PanelRect = empty;
let spotPending: PanelRect | null = null;
let spotPresence = 0;
let spotTarget = 0;
let spotWarm = false;

export function setSpotPanel(rect: PanelRect | null) {
  if (!rect) {
    spotTarget = 0;
    spotPending = null;
    return;
  }
  spotTarget = 1;
  if (spotPresence < 0.02) {
    spotShown = rect;
    spotPending = null;
  } else if (
    Math.abs(rect.x - spotShown.x) > 0.5 ||
    Math.abs(rect.width - spotShown.width) > 0.5
  ) {
    spotPending = rect;
    spotTarget = 0;
    spotWarm = true;
  }
}

function currentRect(now: number): PanelRect {
  return lerpRect(origin, target, springed(now - startedAt));
}

function sameSlot(a: PanelRect, b: PanelRect) {
  return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.width - b.width) < 0.5;
}

function adopt(rect: PanelRect, group: string) {
  origin = rect;
  target = rect;
  startedAt = performance.now() / 1000;
  activeGroup = group;
  presenceTarget = 1;
  history.length = 0;
}

function retarget() {
  const next = hoverRect ?? baseRect;
  const group = hoverRect ? hoverGroup : baseGroup;
  const now = performance.now() / 1000;

  if (!next) {
    presenceTarget = 0;
    pendingRect = null;
    return;
  }

  // gliding only makes sense between neighbours; across groups it
  // would sweep the blob over unrelated content, so it reforms instead
  if (presence > 0.02 && group !== activeGroup) {
    pendingRect = next;
    pendingGroup = group;
    presenceTarget = 0;
    return;
  }

  pendingRect = null;

  if (presence < 0.02) {
    adopt(next, group);
    return;
  }
  if (!sameSlot(next, target)) {
    origin = currentRect(now);
    target = next;
    startedAt = now;
    activeGroup = group;
    return;
  }
  target = next;
  activeGroup = group;
}

export function setBasePanel(rect: PanelRect | null, group = "nav") {
  baseRect = rect;
  baseGroup = group;
  retarget();
}

export function setHoverPanel(rect: PanelRect | null, group = "body") {
  hoverRect = rect;
  hoverGroup = group;
  retarget();
}

function sampleAt(now: number, delay: number): PanelRect {
  if (history.length === 0) return currentRect(now);
  const want = now - delay;
  if (want <= history[0].time) return history[0].rect;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= want) {
      const a = history[i];
      const b = history[Math.min(i + 1, history.length - 1)];
      const span = b.time - a.time;
      return lerpRect(a.rect, b.rect, span > 1e-6 ? (want - a.time) / span : 0);
    }
  }
  return history[history.length - 1].rect;
}

export function samplePanel(): PanelSample {
  const now = performance.now() / 1000;
  const previous = history.length ? history[history.length - 1].rect : null;
  const rect = currentRect(now);

  history.push({ time: now, rect });
  if (history.length > HISTORY) history.shift();

  presence +=
    (presenceTarget - presence) *
    (presenceTarget > presence ? GROW_IN : GROW_OUT);
  if (presence < 0.002 && presenceTarget === 0) {
    presence = 0;
    if (pendingRect) {
      adopt(pendingRect, pendingGroup);
      pendingRect = null;
    }
  }

  const travelled = previous
    ? Math.abs(rect.x - previous.x) + Math.abs(rect.width - previous.width)
    : 0;
  agitation = Math.max(agitation * 0.974, Math.min(1, travelled / 3.2));

  const spotOut = spotPending ? SWAP_OUT : GROW_OUT;
  const spotIn = spotWarm ? SWAP_IN : GROW_IN;
  spotPresence +=
    (spotTarget - spotPresence) *
    (spotTarget > spotPresence ? spotIn : spotOut);
  if (spotPresence < 0.002 && spotTarget === 0) {
    spotPresence = 0;
    if (spotPending) {
      spotShown = spotPending;
      spotPending = null;
      spotTarget = 1;
    } else {
      spotWarm = false;
    }
  }

  const links: PanelRect[] = [];
  for (let i = 0; i < LINK_COUNT; i++) {
    links.push(sampleAt(now, i * LINK_DELAY));
  }

  return {
    current: { ...rect, opacity: presence },
    spot: spotShown,
    links,
    agitation,
    presence,
    spotPresence,
  };
}
