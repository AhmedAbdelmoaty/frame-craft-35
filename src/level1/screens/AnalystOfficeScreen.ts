import { createRoomShell } from "./RoomShell";
import { briefMessage } from "../data/briefMessage";
import { getState, markBriefRead, setMissionFileOpen, subscribe } from "../state/store";
import { gameEvents } from "../../game/events";
import { createPerformanceCardsBoard } from "../components/PerformanceCardsBoard";

export function createAnalystOfficeScreen() {
  return createRoomShell({
    roomId: "office",
    title: "مكتب المحلل",
    subtitle: "شاشة الكمبيوتر · رسالة من المدير المالي",
    renderBody: (body) => {
      const wrap = document.createElement("div");
      wrap.className = "l1-analyst-wrap";
      body.appendChild(wrap);

      const render = () => {
        const s = getState();
        wrap.innerHTML = "";

        // Email panel (always)
        const mail = document.createElement("div");
        mail.className = "l1-analyst";
        mail.innerHTML = `
          <div class="l1-monitor">
            <div class="l1-monitor__bezel">
              <div class="l1-monitor__screen">
                <header class="l1-mail__head">
                  <div class="l1-mail__avatar" aria-hidden="true">ن</div>
                  <div class="l1-mail__meta">
                    <p class="l1-mail__from">${briefMessage.from}</p>
                    <p class="l1-mail__role">${briefMessage.role}</p>
                  </div>
                  ${s.hasReadBrief ? `<span class="l1-pill l1-pill--success">تمت القراءة</span>` : `<span class="l1-pill l1-pill--warn">جديد</span>`}
                </header>
                <h3 class="l1-mail__subject">${briefMessage.subject}</h3>
                <div class="l1-mail__body">
                  <p>${briefMessage.greeting}</p>
                  ${briefMessage.body.map((p) => `<p>${p}</p>`).join("")}
                  <p class="l1-mail__sign">${briefMessage.signature}</p>
                </div>
                <div class="l1-mail__actions">
                  ${
                    s.hasReadBrief
                      ? `<button class="l1-btn l1-btn--ghost" type="button" data-open-mission>افتح ملف المهمة</button>
                         <button class="l1-btn l1-btn--ghost" type="button" data-exit>الخروج إلى الخريطة</button>`
                      : `<button class="l1-btn l1-btn--primary" type="button" data-read>✓ قرأت — لنبدأ التحقيق</button>`
                  }
                </div>
              </div>
              <div class="l1-monitor__stand" aria-hidden="true"></div>
            </div>
          </div>
        `;
        wrap.appendChild(mail);

        // Analysis table
        if (s.hasReadBrief) {
          const ready = s.hasSavedSalesSummary && s.hasSavedHRPolicy;
          if (ready) {
            createPerformanceCardsBoard(wrap);
          } else {
            const hint = document.createElement("div");
            hint.className = "l1-hint";
            hint.innerHTML = `
              <h4>🧭 طاولة التحليل بانتظار البيانات</h4>
              <p>لفتح بطاقات الأداء، احفظ أولًا:</p>
              <ul>
                <li class="${s.hasSavedSalesSummary ? "l1-hint--done" : ""}">${s.hasSavedSalesSummary ? "✓" : "•"} ملخّص مكتب المبيعات</li>
                <li class="${s.hasSavedHRPolicy ? "l1-hint--done" : ""}">${s.hasSavedHRPolicy ? "✓" : "•"} سياسة الموارد البشرية</li>
              </ul>
            `;
            wrap.appendChild(hint);
          }
        }

        // Wire actions
        wrap.querySelector<HTMLButtonElement>("[data-read]")?.addEventListener("click", () => {
          markBriefRead();
        });
        wrap.querySelector<HTMLButtonElement>("[data-exit]")?.addEventListener("click", () => {
          gameEvents.emit("exitRoom", { roomId: "office" });
        });
        wrap.querySelector<HTMLButtonElement>("[data-open-mission]")?.addEventListener("click", () => {
          setMissionFileOpen(true);
        });
      };

      render();
      const unsub = subscribe(render);

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
