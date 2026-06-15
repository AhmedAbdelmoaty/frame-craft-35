import { createRoomShell } from "./RoomShell";
import { BRANCHES } from "../data/branches";
import {
  getState,
  inspectSalesBoard,
  receiveIndividualPerformanceFile,
  saveSalesSummary,
  subscribe,
  visitSales,
} from "../state/store";
import { gameEvents } from "../../game/events";

const EMAD_LINES = [
  "أهلًا! أنا عماد، مدير المبيعات. هذا الربع كان قويًا جدًا لفريقي.",
  "متوسط أداء فرع الكورنيش وصل ٩٦٪ — أعلى من الميدان بفارق كبير.",
  "اللوحة هناك تعرض الأرقام الرسمية. لو احتجت تفاصيل المندوبين، عندي ملف الأداء الفردي.",
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
                  <span aria-hidden="true">💾</span><span>استلام ملخص المبيعات</span>
                </button>
              </footer>
              <p class="l1-board__saved" data-saved hidden>✓ تم استلام ملخص المبيعات.</p>
            </div>

            <div class="l1-files-shelf" data-file-wrap hidden>
              <h4 class="l1-files-shelf__title">ملفات إضافية على المكتب</h4>
              <div class="l1-file-card" data-file-card>
                <div class="l1-file-card__icon" aria-hidden="true">
                  <div class="l1-file-card__envelope"></div>
                </div>
                <div class="l1-file-card__body">
                  <strong>ملف الأداء الفردي للمندوبين</strong>
                  <small>أرقام خام — تُفتح وتُحلَّل في مكتب المحلل.</small>
                </div>
                <button class="l1-btn l1-btn--save l1-btn--sm" type="button" data-receive>
                  <span aria-hidden="true">📥</span><span>استلام الملف</span>
                </button>
              </div>
              <p class="l1-files-shelf__received" data-received hidden>
                ✓ تم استلام ملف الأداء الفردي — افتحه في مكتب المحلل.
              </p>
            </div>
          </section>
        </div>
      `;

      // Dialogue cycling
      let idx = 0;
      const textEl = body.querySelector<HTMLElement>("[data-dialogue-text]")!;
      const counter = body.querySelector<HTMLElement>("[data-counter]")!;
      body.querySelector<HTMLButtonElement>("[data-next]")!.addEventListener("click", () => {
        idx = (idx + 1) % EMAD_LINES.length;
        textEl.textContent = EMAD_LINES[idx];
        counter.textContent = `${idx + 1} / ${EMAD_LINES.length}`;
      });

      const board = body.querySelector<HTMLElement>("[data-board]")!;
      const inspectBtn = body.querySelector<HTMLButtonElement>("[data-inspect]")!;
      const saveWrap = body.querySelector<HTMLElement>("[data-save-wrap]")!;
      const saveBtn = body.querySelector<HTMLButtonElement>("[data-save]")!;
      const savedMsg = body.querySelector<HTMLElement>("[data-saved]")!;
      const fileWrap = body.querySelector<HTMLElement>("[data-file-wrap]")!;
      const receiveBtn = body.querySelector<HTMLButtonElement>("[data-receive]")!;
      const receivedMsg = body.querySelector<HTMLElement>("[data-received]")!;

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
          fileWrap.hidden = false;
          receiveBtn.disabled = s.hasReceivedIndividualPerformanceFile;
          receivedMsg.hidden = !s.hasReceivedIndividualPerformanceFile;
          if (s.hasReceivedIndividualPerformanceFile) {
            receiveBtn.innerHTML = `<span aria-hidden="true">✓</span><span>تم الاستلام</span>`;
          }
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
        saveBtn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
          { duration: 280, easing: "ease-out" },
        );
      });
      receiveBtn.addEventListener("click", () => {
        receiveIndividualPerformanceFile();
        const env = body.querySelector<HTMLElement>(".l1-file-card__envelope");
        env?.animate(
          [
            { transform: "translateY(0) rotate(0)" },
            { transform: "translateY(-8px) rotate(-4deg)" },
            { transform: "translateY(0) rotate(0)" },
          ],
          { duration: 360, easing: "ease-out" },
        );
      });
      body.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener("click", () => {
        gameEvents.emit("exitRoom", { roomId: "sales" });
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
