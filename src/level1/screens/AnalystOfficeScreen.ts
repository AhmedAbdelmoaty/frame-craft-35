import { createRoomShell } from "./RoomShell";
import { briefMessage } from "../data/briefMessage";
import { getState, markBriefRead, setMissionFileOpen } from "../state/store";
import { gameEvents } from "../../game/events";

export function createAnalystOfficeScreen() {
  return createRoomShell({
    roomId: "office",
    title: "مكتب المحلل",
    subtitle: "شاشة الكمبيوتر · رسالة من المدير المالي",
    renderBody: (body) => {
      const alreadyRead = getState().hasReadBrief;
      body.innerHTML = `
        <div class="l1-analyst">
          <div class="l1-monitor">
            <div class="l1-monitor__bezel">
              <div class="l1-monitor__screen">
                <header class="l1-mail__head">
                  <div class="l1-mail__avatar" aria-hidden="true">ن</div>
                  <div class="l1-mail__meta">
                    <p class="l1-mail__from">${briefMessage.from}</p>
                    <p class="l1-mail__role">${briefMessage.role}</p>
                  </div>
                  ${alreadyRead ? `<span class="l1-pill l1-pill--success">تمت القراءة</span>` : `<span class="l1-pill l1-pill--warn">جديد</span>`}
                </header>
                <h3 class="l1-mail__subject">${briefMessage.subject}</h3>
                <div class="l1-mail__body">
                  <p>${briefMessage.greeting}</p>
                  ${briefMessage.body.map((p) => `<p>${p}</p>`).join("")}
                  <p class="l1-mail__sign">${briefMessage.signature}</p>
                </div>
                <div class="l1-mail__actions">
                  ${
                    alreadyRead
                      ? `<button class="l1-btn l1-btn--ghost" type="button" data-open-mission>افتح ملف المهمة</button>
                         <button class="l1-btn l1-btn--primary" type="button" data-exit>الخروج إلى الخريطة</button>`
                      : `<button class="l1-btn l1-btn--primary" type="button" data-read>✓ قرأت — لنبدأ التحقيق</button>`
                  }
                </div>
              </div>
              <div class="l1-monitor__stand" aria-hidden="true"></div>
            </div>
            <p class="l1-monitor__caption">شاشة مكتب المحلل · مجموعة رواج للتجزئة</p>
          </div>
        </div>
      `;

      body.querySelector<HTMLButtonElement>("[data-read]")?.addEventListener("click", () => {
        markBriefRead();
        gameEvents.emit("exitRoom", { roomId: "office" });
      });
      body.querySelector<HTMLButtonElement>("[data-exit]")?.addEventListener("click", () => {
        gameEvents.emit("exitRoom", { roomId: "office" });
      });
      body.querySelector<HTMLButtonElement>("[data-open-mission]")?.addEventListener("click", () => {
        setMissionFileOpen(true);
      });
    },
  });
}
