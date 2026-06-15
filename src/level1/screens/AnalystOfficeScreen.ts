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
      let mode: "locked" | "open" = "locked";

      const render = () => {
        const s = getState();
        const hasFile = s.hasReceivedIndividualPerformanceFile;
        const desired: typeof mode = hasFile ? "open" : "locked";

        // Auto-enter the analysis room the moment the file is available.
        if (hasFile && !s.hasEnteredAnalysisRoom) {
          enterAnalysisRoom();
          return; // store update will re-trigger render
        }

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
            <h3>لا توجد ملفات على الطاولة الآن</h3>
            <p>اجمع ما تحتاجه من المكاتب الأخرى ثم عد إلى هنا.</p>
            <button class="l1-btn l1-btn--ghost" type="button" data-exit>← خروج إلى الخريطة</button>
          `;
          empty.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener(
            "click",
            () => gameEvents.emit("exitRoom", { roomId: "office" }),
          );
          wrap.appendChild(empty);
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
