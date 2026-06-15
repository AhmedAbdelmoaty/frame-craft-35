import { createRoomShell } from "./RoomShell";
import {
  enterAnalysisRoom,
  getState,
  subscribe,
} from "../state/store";
import { gameEvents } from "../../game/events";
import { createPerformanceCardsBoard } from "../components/PerformanceCardsBoard";

export function createAnalystOfficeScreen() {
  return createRoomShell({
    roomId: "office",
    title: "مكتب المحلل",
    subtitle: "طاولة التحليل — بطاقات وأدوات",
    renderBody: (body) => {
      const wrap = document.createElement("div");
      wrap.className = "l1-analyst-room";
      body.appendChild(wrap);

      let boardInstance: { destroy: () => void } | null = null;
      let mode: "locked" | "ready" | "open" = "locked";

      const render = () => {
        const s = getState();
        const hasFile = s.hasReceivedIndividualPerformanceFile;
        const desired: typeof mode = !hasFile
          ? "locked"
          : s.hasEnteredAnalysisRoom
            ? "open"
            : "ready";

        if (desired === mode) return;
        mode = desired;
        boardInstance?.destroy();
        boardInstance = null;
        wrap.innerHTML = "";

        if (desired === "locked") {
          const empty = document.createElement("div");
          empty.className = "l1-analyst-empty";
          empty.innerHTML = `
            <div class="l1-analyst-empty__icon" aria-hidden="true">🗂</div>
            <h3>لا توجد ملفات أداء فردية للتحليل بعد</h3>
            <p>استلم ملف الأداء الفردي من مكتب المبيعات لتتمكن من فتح طاولة التحليل.</p>
            <button class="l1-btn l1-btn--ghost" type="button" data-exit>← خروج إلى الخريطة</button>
          `;
          empty.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener(
            "click",
            () => gameEvents.emit("exitRoom", { roomId: "office" }),
          );
          wrap.appendChild(empty);
        } else if (desired === "ready") {
          const ready = document.createElement("div");
          ready.className = "l1-analyst-ready";
          ready.innerHTML = `
            <div class="l1-analyst-ready__file" aria-hidden="true">
              <div class="l1-analyst-ready__file-tab"></div>
              <div class="l1-analyst-ready__file-body">
                <span>ملف الأداء الفردي</span>
                <small>للمندوبين — الكورنيش والميدان</small>
              </div>
            </div>
            <h3>الملف على الطاولة — جاهز للفحص</h3>
            <p>افتح طاولة التحليل لمعاينة البطاقات واستخدام الأدوات.</p>
            <div class="l1-analyst-ready__actions">
              <button class="l1-btn l1-btn--primary l1-pulse" type="button" data-open>
                <span aria-hidden="true">🔬</span><span>فتح طاولة التحليل</span>
              </button>
              <button class="l1-btn l1-btn--ghost" type="button" data-exit>← خروج</button>
            </div>
          `;
          ready.querySelector<HTMLButtonElement>("[data-open]")!.addEventListener(
            "click",
            () => enterAnalysisRoom(),
          );
          ready.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener(
            "click",
            () => gameEvents.emit("exitRoom", { roomId: "office" }),
          );
          wrap.appendChild(ready);
        } else {
          boardInstance = createPerformanceCardsBoard(wrap);
        }
      };

      render();
      const unsub = subscribe(render);

      const observer = new MutationObserver(() => {
        if (!body.isConnected) {
          unsub();
          boardInstance?.destroy();
          observer.disconnect();
        }
      });
      observer.observe(body.parentNode || document.body, { childList: true, subtree: true });
    },
  });
}
