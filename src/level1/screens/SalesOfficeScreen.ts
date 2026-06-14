import { createRoomShell } from "./RoomShell";
import { BRANCHES } from "../data/branches";
import {
  getState,
  inspectSalesBoard,
  saveSalesSummary,
  subscribe,
  visitSales,
} from "../state/store";
import { gameEvents } from "../../game/events";

const EMAD_LINES = [
  "أهلًا! أنا عماد، مدير المبيعات. هذا الربع كان قويًا جدًا لفريقي.",
  "متوسط أداء فرع الكورنيش وصل ٩٦٪ — أعلى من الميدان بفارق كبير.",
  "اللوحة هناك تعرض الأرقام الرسمية. خذ راحتك في مراجعتها.",
];

export function createSalesOfficeScreen() {
  visitSales();
  const corniche = BRANCHES.corniche;
  const midan = BRANCHES.midan;

  return createRoomShell({
    roomId: "sales",
    title: "مكتب المبيعات",
    subtitle: "عماد · مدير المبيعات",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="l1-office l1-office--sales">
          <aside class="l1-office__npc">
            <div class="l1-npc">
              <img class="l1-npc__img" src="/assets/characters/sales-manager.svg" alt="عماد" />
              <div class="l1-npc__nameplate">
                <strong>عماد</strong><span>مدير المبيعات</span>
              </div>
            </div>
            <div class="l1-dialogue" data-dialogue>
              <p class="l1-dialogue__text" data-dialogue-text>${EMAD_LINES[0]}</p>
              <div class="l1-dialogue__actions">
                <button class="l1-btn l1-btn--ghost l1-btn--sm" type="button" data-next>التالي ›</button>
                <span class="l1-dialogue__counter" data-counter>1 / ${EMAD_LINES.length}</span>
              </div>
            </div>
          </aside>

          <section class="l1-office__main">
            <div class="l1-actionbar">
              <button class="l1-btn l1-btn--primary l1-pulse" type="button" data-inspect>
                <span aria-hidden="true">🔍</span>
                <span>فحص لوحة الأداء</span>
              </button>
              <button class="l1-btn l1-btn--exit" type="button" data-exit>← خروج إلى الخريطة</button>
            </div>

            <div class="l1-board l1-board--sales" data-board hidden>
              <header class="l1-board__head">
                <h3>لوحة الأداء الرسمية · الربع الحالي</h3>
                <span class="l1-board__stamp">معتمدة من قسم المبيعات</span>
              </header>
              <div class="l1-board__grid">
                <article class="l1-board__card">
                  <p class="l1-board__label">${corniche.name}</p>
                  <p class="l1-board__big">${corniche.totalSalesK}<span>K</span></p>
                  <p class="l1-board__sub">إجمالي المبيعات</p>
                  <p class="l1-board__avg">متوسط الأداء: <strong>${corniche.reportedAverage}٪</strong></p>
                </article>
                <article class="l1-board__card">
                  <p class="l1-board__label">${midan.name}</p>
                  <p class="l1-board__big">${midan.totalSalesK}<span>K</span></p>
                  <p class="l1-board__sub">إجمالي المبيعات</p>
                  <p class="l1-board__avg">متوسط الأداء: <strong>${midan.reportedAverage}٪</strong></p>
                </article>
              </div>
              <footer class="l1-board__foot" data-save-wrap hidden>
                <button class="l1-btn l1-btn--save" type="button" data-save>
                  <span aria-hidden="true">💾</span><span>احفظ الملخّص في ملف المهمة</span>
                </button>
              </footer>
              <p class="l1-board__saved" data-saved hidden>✓ تم حفظ الملخّص.</p>
            </div>
          </section>
        </div>
      `;

      // Dialogue cycling
      let idx = 0;
      const textEl = body.querySelector<HTMLElement>("[data-dialogue-text]")!;
      const counter = body.querySelector<HTMLElement>("[data-counter]")!;
      const nextBtn = body.querySelector<HTMLButtonElement>("[data-next]")!;
      nextBtn.addEventListener("click", () => {
        idx = (idx + 1) % EMAD_LINES.length;
        textEl.style.animation = "none";
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        textEl.offsetWidth;
        textEl.style.animation = "";
        textEl.textContent = EMAD_LINES[idx];
        counter.textContent = `${idx + 1} / ${EMAD_LINES.length}`;
      });

      const board = body.querySelector<HTMLElement>("[data-board]")!;
      const inspectBtn = body.querySelector<HTMLButtonElement>("[data-inspect]")!;
      const saveWrap = body.querySelector<HTMLElement>("[data-save-wrap]")!;
      const saveBtn = body.querySelector<HTMLButtonElement>("[data-save]")!;
      const savedMsg = body.querySelector<HTMLElement>("[data-saved]")!;

      const render = () => {
        const s = getState();
        if (s.hasInspectedSalesBoard) {
          board.hidden = false;
          inspectBtn.classList.remove("l1-pulse");
          inspectBtn.textContent = "✓ تمّ الفحص";
          inspectBtn.disabled = true;
          saveWrap.hidden = s.hasSavedSalesSummary;
          savedMsg.hidden = !s.hasSavedSalesSummary;
          saveBtn.disabled = s.hasSavedSalesSummary;
        }
      };
      const unsub = subscribe(render);
      render();

      inspectBtn.addEventListener("click", () => {
        inspectSalesBoard();
        board.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, easing: "ease-out" },
        );
      });
      saveBtn.addEventListener("click", () => {
        saveSalesSummary();
        flashSave(saveBtn);
      });
      body.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener("click", () => {
        gameEvents.emit("exitRoom", { roomId: "sales" });
      });

      // cleanup
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

function flashSave(btn: HTMLButtonElement) {
  btn.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
    { duration: 280, easing: "ease-out" },
  );
}
