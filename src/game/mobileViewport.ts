export type ViewportMode = "desktop" | "mobile-portrait" | "mobile-landscape";

export const VIEWPORT_MODE_EVENT = "madar:viewport-mode-change";

export type ViewportModeChangeDetail = {
  mode: ViewportMode;
  previousMode: ViewportMode | null;
};

let currentMode: ViewportMode | null = null;
let initialized = false;

function isMobileLike() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const narrowViewport = Math.min(window.innerWidth, window.innerHeight) <= 760;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  return mobileUa || (coarsePointer && narrowViewport);
}

export function getViewportMode(): ViewportMode {
  if (typeof window === "undefined") return "desktop";
  if (!isMobileLike()) return "desktop";
  return window.innerWidth >= window.innerHeight ? "mobile-landscape" : "mobile-portrait";
}

function applyViewportMode() {
  const mode = getViewportMode();
  const previousMode = currentMode;

  document.documentElement.dataset.deviceMode = mode;
  currentMode = mode;

  if (mode !== previousMode) {
    window.dispatchEvent(
      new CustomEvent<ViewportModeChangeDetail>(VIEWPORT_MODE_EVENT, {
        detail: { mode, previousMode },
      }),
    );
  }
}

export function initViewportMode() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  applyViewportMode();

  const scheduleUpdate = () => window.requestAnimationFrame(applyViewportMode);
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
}

