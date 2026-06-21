import { createRoomShell } from "./RoomShell";
import { gameEvents } from "../../game/events";
import { getState, setMeetingStage, subscribe } from "../state/store";
import { buildMeetingPresentation } from "../logic/meetingPresentation";

export function createMeetingRoomScreen() {
  return createRoomShell({
    roomId: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "تقرير التوصية",
    onClose: () => {
      if (document.body.classList.contains("l1-playable-overlay-open")) {
        setMeetingStage("dialogue");
        gameEvents.emit("meetingReportReviewed", undefined);
      }
    },
    renderBody: (body) => {
      const root = document.createElement("div");
      root.className = "l1-meeting-report";
      body.appendChild(root);

      const render = () => {
        const s = getState();
        const presentation = buildMeetingPresentation(s.preparedBranch, s.preparedEvidenceIds);

        if (!s.hasPreparedDecision || !presentation) {
          root.innerHTML = `
            <div class="l1-analyst-empty">
              <div class="l1-analyst-empty__icon" aria-hidden="true">▤</div>
              <h3>لا توجد توصية جاهزة بعد</h3>
              <p>جهز التوصية من غرفة القرار أولًا، ثم عد إلى الطاولة لعرض التقرير.</p>
            </div>
          `;
          return;
        }

        root.innerHTML = `
          <article class="l1-report-sheet l1-report-sheet--meeting">
            <section class="l1-report-sheet__stage">
              <div class="l1-report-sheet__table" aria-hidden="true">
                <span class="l1-report-sheet__chair l1-report-sheet__chair--top"></span>
                <span class="l1-report-sheet__chair l1-report-sheet__chair--right"></span>
                <span class="l1-report-sheet__chair l1-report-sheet__chair--left"></span>
                <span class="l1-report-sheet__holo">▥</span>
              </div>
              <div class="l1-report-sheet__callout">
                <span class="l1-report-sheet__eyebrow">لحظة العرض</span>
                <h2>${presentation.report.title}</h2>
                <p>${presentation.report.summary}</p>
              </div>
            </section>

            <aside class="l1-report-sheet__dossier">
              <span class="l1-report-sheet__stamp">جاهز للعرض</span>
              <section class="l1-report-sheet__section">
                <h3>سبب التوصية</h3>
                <p>${presentation.report.rationale}</p>
              </section>
              <section class="l1-report-sheet__section">
                <h3>الأدلة المختارة</h3>
                <ul class="l1-report-sheet__evidence">
                  ${presentation.report.evidenceItems
                    .map(
                      (item) => `
                        <li>
                          <strong>${item.label}</strong>
                          <p>${item.detail}</p>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              </section>
              <footer class="l1-report-sheet__actions">
                <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-close>
                  <span aria-hidden="true">✓</span><span>أكد العرض</span>
                </button>
              </footer>
            </aside>
          </article>
        `;

        root.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", () => {
          setMeetingStage("dialogue");
          gameEvents.emit("closeRoomOverlay", undefined);
          gameEvents.emit("meetingReportReviewed", undefined);
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
      observer.observe(body.parentNode || document.body, { childList: true, subtree: true });
    },
  });
}
