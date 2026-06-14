import { createRoomShell } from "./RoomShell";
import { PERFORMANCE_THRESHOLD } from "../data/branches";
import {
  getState,
  inspectHRPolicy,
  saveHRPolicy,
  subscribe,
  visitHR,
} from "../state/store";
import { gameEvents } from "../../game/events";

const LAYLA_LINES = [
  "أهلًا. أنا ليلى، مديرة الموارد البشرية.",
  "سياسة الشركة تعتبر المندوب محققًا للأداء المطلوب إذا وصل إلى ٨٥٪ أو أكثر.",
  "الملف على الطاولة يحتوي على نص السياسة الرسمي. راجعه إذا أردت.",
];

export function createHROfficeScreen() {
  visitHR();
  return createRoomShell({
    roomId: "hr",
    title: "مكتب الموارد البشرية",
    subtitle: "ليلى · مديرة HR",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="l1-office l1-office--hr">
          <aside class="l1-office__npc">
            <div class="l1-npc">
              <img class="l1-npc__img" src="/assets/characters/hr-manager.svg" alt="ليلى" />
              <div class="l1-npc__nameplate">
                <strong>ليلى</strong><span>مديرة HR</span>
              </div>
            </div>
            <div class="l1-dialogue">
              <p class="l1-dialogue__text" data-dialogue-text>${LAYLA_LINES[0]}</p>
              <div class="l1-dialogue__actions">
                <button class="l1-btn l1-btn--ghost l1-btn--sm" type="button" data-next>التالي ›</button>
                <span class="l1-dialogue__counter" data-counter>1 / ${LAYLA_LINES.length}</span>
              </div>
            </div>
          </aside>

          <section class="l1-office__main">
            <div class="l1-actionbar">
              <button class="l1-btn l1-btn--primary l1-pulse" type="button" data-inspect>
                <span aria-hidden="true">📐</span>
                <span>فحص سياسة الأداء</span>
              </button>
              <button class="l1-btn l1-btn--exit" type="button" data-exit>← خروج إلى الخريطة</button>
            </div>

            <div class="l1-folder" data-board hidden>
              <header class="l1-folder__head">
                <span class="l1-folder__tab">سياسة الأداء</span>
                <h3>وثيقة سياسة المكافأة — الربع الحالي</h3>
              </header>
              <div class="l1-folder__body">
                <p class="l1-folder__rule">
                  المندوب يُعتبر محققًا للأداء المطلوب إذا بلغ
                  <strong class="l1-folder__num">${PERFORMANCE_THRESHOLD}٪</strong>
                  أو أكثر.
                </p>
                <ul class="l1-folder__list">
                  <li>تُطبّق السياسة على جميع المندوبين دون استثناء.</li>
                  <li>الحكم يكون على مستوى المندوب الفرد، لا على المتوسط فقط.</li>
                  <li>اعتماد المكافأة يتطلب توصية موثّقة من المحلل.</li>
                </ul>
              </div>
              <footer class="l1-folder__foot" data-save-wrap hidden>
                <button class="l1-btn l1-btn--save" type="button" data-save>
                  <span aria-hidden="true">💾</span><span>احفظ السياسة في ملف المهمة</span>
                </button>
              </footer>
              <p class="l1-board__saved" data-saved hidden>✓ تم حفظ السياسة.</p>
            </div>
          </section>
        </div>
      `;

      let idx = 0;
      const textEl = body.querySelector<HTMLElement>("[data-dialogue-text]")!;
      const counter = body.querySelector<HTMLElement>("[data-counter]")!;
      body.querySelector<HTMLButtonElement>("[data-next]")!.addEventListener("click", () => {
        idx = (idx + 1) % LAYLA_LINES.length;
        textEl.textContent = LAYLA_LINES[idx];
        counter.textContent = `${idx + 1} / ${LAYLA_LINES.length}`;
      });

      const board = body.querySelector<HTMLElement>("[data-board]")!;
      const inspectBtn = body.querySelector<HTMLButtonElement>("[data-inspect]")!;
      const saveWrap = body.querySelector<HTMLElement>("[data-save-wrap]")!;
      const saveBtn = body.querySelector<HTMLButtonElement>("[data-save]")!;
      const savedMsg = body.querySelector<HTMLElement>("[data-saved]")!;

      const render = () => {
        const s = getState();
        if (s.hasInspectedHRPolicy) {
          board.hidden = false;
          inspectBtn.classList.remove("l1-pulse");
          inspectBtn.textContent = "✓ تمّ الفحص";
          inspectBtn.disabled = true;
          saveWrap.hidden = s.hasSavedHRPolicy;
          savedMsg.hidden = !s.hasSavedHRPolicy;
          saveBtn.disabled = s.hasSavedHRPolicy;
        }
      };
      const unsub = subscribe(render);
      render();

      inspectBtn.addEventListener("click", () => {
        inspectHRPolicy();
        board.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, easing: "ease-out" },
        );
      });
      saveBtn.addEventListener("click", () => {
        saveHRPolicy();
        saveBtn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
          { duration: 280, easing: "ease-out" },
        );
      });
      body.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener("click", () => {
        gameEvents.emit("exitRoom", { roomId: "hr" });
      });

      const observer = new MutationObserver(() => {
        if (!body.isConnected) {
          unsub();
          observer.disconnect();
        }
      });
      observer.observe(body.parentNode || body, { childList: true });
    },
  });
}
