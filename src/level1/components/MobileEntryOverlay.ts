import { getViewportMode, VIEWPORT_MODE_EVENT, type ViewportMode } from "../../game/mobileViewport";

type OrientationScreen = Screen & {
  orientation?: ScreenOrientation & {
    lock?: (orientation: "landscape") => Promise<void>;
  };
};

let acceptedMobileMode = false;

function isMobile(mode: ViewportMode) {
  return mode === "mobile-portrait" || mode === "mobile-landscape";
}

async function requestMobileFullscreen() {
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) {
    await root.requestFullscreen();
  }
}

async function lockLandscape() {
  const orientation = (screen as OrientationScreen).orientation;
  if (orientation?.lock) {
    await orientation.lock("landscape");
  }
}

function guardMapInput() {
  document.body.classList.add("madar-input-guard");
  window.setTimeout(() => document.body.classList.remove("madar-input-guard"), 900);
}

export function mountMobileEntryOverlay(
  parent: HTMLElement = document.body,
  options: { onAccepted?: () => void; requestFullscreenOnStart?: boolean } = {},
) {
  const root = document.createElement("section");
  root.className = "mobile-entry";
  root.dir = "rtl";
  root.hidden = true;
  root.innerHTML = `
    <div class="mobile-entry__panel">
      <p class="mobile-entry__kicker">وضع الموبايل</p>
      <h2>جهّز اللعبة للشاشة العرضية</h2>
      <p class="mobile-entry__copy" data-mobile-entry-copy>
        اضغط الزر لتشغيل ملء الشاشة ومحاولة تثبيت اللعبة بالوضع العرضي.
      </p>
      <button class="mobile-entry__button" type="button">
        ابدأ وضع الموبايل / تشغيل بملء الشاشة
      </button>
      <p class="mobile-entry__fallback" data-mobile-entry-fallback hidden>
        لو المتصفح لم يسمح بملء الشاشة أو تثبيت الاتجاه، لف الموبايل للوضع العرضي وستعمل اللعبة كنسخة ويب موبايل.
      </p>
    </div>
  `;

  const button = root.querySelector<HTMLButtonElement>(".mobile-entry__button")!;
  const fallback = root.querySelector<HTMLElement>("[data-mobile-entry-fallback]")!;
  const copy = root.querySelector<HTMLElement>("[data-mobile-entry-copy]")!;
  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };

  const render = () => {
    const mode = getViewportMode();
    const shouldShow = isMobile(mode) && (!acceptedMobileMode || mode === "mobile-portrait");
    root.hidden = !shouldShow;
    root.classList.toggle("mobile-entry--portrait", mode === "mobile-portrait");
    root.classList.toggle("mobile-entry--landscape", mode === "mobile-landscape");
    copy.textContent =
      mode === "mobile-portrait"
        ? "الأفضل للعب هو الوضع العرضي. اضغط الزر ثم لف الموبايل لو لم يلف تلقائيًا."
        : "اضغط الزر لتشغيل ملء الشاشة وتجربة الموبايل بأكبر مساحة ممكنة.";
  };

  const startMobileMode = async () => {
    guardMapInput();
    fallback.hidden = true;
    let hadFallback = false;

    if (options.requestFullscreenOnStart) {
      try {
        await requestMobileFullscreen();
      } catch {
        hadFallback = true;
      }

      try {
        await lockLandscape();
      } catch {
        hadFallback = true;
      }
    }

    acceptedMobileMode = true;
    fallback.hidden = !hadFallback;
    render();
    options.onAccepted?.();
  };

  button.addEventListener("click", startMobileMode);
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);
  window.addEventListener(VIEWPORT_MODE_EVENT, render);
  parent.appendChild(root);
  render();

  return {
    root,
    destroy: () => {
      button.removeEventListener("click", startMobileMode);
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
      window.removeEventListener(VIEWPORT_MODE_EVENT, render);
      root.remove();
    },
  };
}
