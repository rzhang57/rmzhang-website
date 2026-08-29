import { setSpotPanel } from "./panel";

function targetOf(node: EventTarget | null): HTMLElement | null {
  if (!(node instanceof Element)) return null;
  const found = node.closest<HTMLElement>("a[href], [data-glass]");
  if (!found) return null;
  if (found.hasAttribute("data-noglass")) return null;
  if (found.closest("[data-noglass]")) return null;
  if (found.closest("nav")) return null;
  return found;
}

// links carry their own padding inconsistently — inline ones have none,
// button-ish ones already have 12px — so top the shortfall up to make
// every bubble sit the same distance from its text
const PAD_X = 12;
const MIN_HEIGHT = 22.5;

function publish(element: HTMLElement) {
  const rects = element.getClientRects();
  const box = rects.length ? rects[0] : element.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return;

  const style = getComputedStyle(element);
  const left = Math.max(0, PAD_X - (parseFloat(style.paddingLeft) || 0));
  const right = Math.max(0, PAD_X - (parseFloat(style.paddingRight) || 0));
  const vertical = Math.max(0, (MIN_HEIGHT - box.height) / 2);

  setSpotPanel({
    x: box.left + window.scrollX - left,
    y: box.top + window.scrollY - vertical,
    width: box.width + left + right,
    height: box.height + vertical * 2,
    opacity: 1,
  });
}

export function watchLinks() {
  let active: HTMLElement | null = null;

  const enter = (event: Event) => {
    const element = targetOf(event.target);
    if (!element || element === active) return;
    active = element;
    publish(element);
  };

  const leave = (event: Event) => {
    if (!active) return;
    const next = targetOf((event as PointerEvent).relatedTarget ?? null);
    if (next === active) return;
    active = null;
    setSpotPanel(null);
  };

  const reflow = () => {
    if (active) publish(active);
  };

  document.addEventListener("pointerover", enter, { passive: true });
  document.addEventListener("pointerout", leave, { passive: true });
  document.addEventListener("focusin", enter, { passive: true });
  document.addEventListener("focusout", leave, { passive: true });
  window.addEventListener("scroll", reflow, { passive: true });
  window.addEventListener("resize", reflow, { passive: true });

  return () => {
    document.removeEventListener("pointerover", enter);
    document.removeEventListener("pointerout", leave);
    document.removeEventListener("focusin", enter);
    document.removeEventListener("focusout", leave);
    window.removeEventListener("scroll", reflow);
    window.removeEventListener("resize", reflow);
    setSpotPanel(null);
  };
}
