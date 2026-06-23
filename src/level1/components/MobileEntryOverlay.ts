import { getViewportMode, type ViewportMode } from "../../game/mobileViewport";

let acceptedMobileMode = false;

function isMobile(mode: ViewportMode) {
  return mode === "mobile-portrait" || mode === "mobile-landscape";
}

export function mountMobileEntryOverlay(
  parent: HTMLElement = document.body,
  options: { onAccepted?: () => void } = {},
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
    const shouldShow = isMobile(mode) && !acceptedMobileMode;
    root.hidden = !shouldShow;
    root.classList.toggle("mobile-entry--portrait", mode === "mobile-portrait");
    root.classList.toggle("mobile-entry--landscape", mode === "mobile-landscape");
    copy.textContent =
      mode === "mobile-portrait"
        ? "الأفضل للعب هو الوضع العرضي. اضغط الزر ثم لف الموبايل لو لم يلف تلقائيًا."
        : "اضغط الزر لتشغيل ملء الشاشة وتجربة الموبايل بأكبر مساحة ممكنة.";
  };

  const startMobileMode = () => {
    acceptedMobileMode = true;
    fallback.hidden = true;
    root.hidden = true;
    render();
    options.onAccepted?.();
  };

  button.addEventListener("click", startMobileMode);
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);
  parent.appendChild(root);
  render();

  return {
    root,
    destroy: () => {
      button.removeEventListener("click", startMobileMode);
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
      root.remove();
    },
  };
}
