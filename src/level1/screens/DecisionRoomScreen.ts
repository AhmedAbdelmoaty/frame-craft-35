import { createRoomShell } from "./RoomShell";
import {
  getState,
  isDecisionUnlocked,
  prepareDecision,
  resetDecision,
  selectBranch,
  subscribe,
  toggleEvidence,
  type Branch,
} from "../state/store";
import { gameEvents } from "../../game/events";
import { availableEvidence, EVIDENCE_DEFS, type EvidenceId } from "../logic/evaluate";

export function createDecisionRoomScreen() {
  return createRoomShell({
    roomId: "decision",
    title: "غرفة القرار",
    subtitle: "اختر الفرع الذي يستحق المكافأة وحدد الأدلة قبل دخول الاجتماع",
    renderBody: (body) => {
      const root = document.createElement("div");
      root.className = "l1-decision";
      body.appendChild(root);

      const render = () => {
        const s = getState();
        root.innerHTML = "";

        if (!isDecisionUnlocked(s)) {
          root.innerHTML = `
            <div class="l1-analyst-empty">
              <div class="l1-analyst-empty__icon" aria-hidden="true">🗒</div>
              <h3>لا توجد ملفات بعد</h3>
              <p>استلم ملفًا واحدًا على الأقل من المبيعات أو HR، أو افتح طاولة التحليل، ثم عد إلى غرفة القرار.</p>
            </div>`;
          return;
        }

        if (s.hasPreparedDecision) {
          root.innerHTML = `
            <div class="l1-decision__ready">
              <span class="l1-pill l1-pill--success">التوصية محضّرة</span>
              <h3>توصيتك جاهزة للاجتماع</h3>
              <p>الفرع المرشح للمكافأة: <strong>${s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش"}</strong></p>
              <ul class="l1-decision__picks">
                ${s.preparedEvidenceIds
                  .map((id) => {
                    const e = EVIDENCE_DEFS[id as EvidenceId];
                    return `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>`;
                  })
                  .join("")}
              </ul>
              <div class="l1-meeting__cta">
                <button class="l1-btn l1-btn--ghost" type="button" data-edit>تعديل التوصية</button>
                <button class="l1-btn l1-btn--primary" type="button" data-go>الذهاب للاجتماع ›</button>
              </div>
            </div>`;
          root.querySelector<HTMLButtonElement>("[data-edit]")!.addEventListener("click", () =>
            resetDecision(),
          );
          root.querySelector<HTMLButtonElement>("[data-go]")!.addEventListener("click", () => {
            gameEvents.emit("enterRoom", { roomId: "meeting" });
          });
          return;
        }

        const ids = availableEvidence(s);
        const picked = s.selectedEvidenceIds;
        root.innerHTML = `
          <div class="l1-decision__layout">
            <section class="l1-decision__col">
              <h3 class="l1-meeting__prompt">١) اختر الفرع الذي يستحق المكافأة</h3>
              <p class="l1-meeting__hint">اختر الفرع الذي ستوصي بمكافأته في الاجتماع.</p>
              <div class="l1-branch-choices">
                ${branchCard("corniche", "فرع الكورنيش", "متوسط معلن 96% · 960K", s.selectedBranch === "corniche")}
                ${branchCard("midan", "فرع الميدان", "متوسط معلن 89.5% · 895K", s.selectedBranch === "midan")}
              </div>
            </section>
            <section class="l1-decision__col">
              <h3 class="l1-meeting__prompt">٢) اختر دليلين يدعمان توصيتك</h3>
              <p class="l1-meeting__hint">المختار: <strong>${picked.length} / 2</strong></p>
              <div class="l1-evidence-list">
                ${
                  ids.length === 0
                    ? `<p class="l1-decision__empty">لا توجد أدلة متاحة بعد. استلم ملفات أو استخدم أدوات التحليل.</p>`
                    : ids
                        .map((id) => {
                          const e = EVIDENCE_DEFS[id];
                          const isPicked = picked.includes(id);
                          const disabled = !isPicked && picked.length >= 2;
                          return `
                            <button class="l1-evidence ${isPicked ? "l1-evidence--picked" : ""}"
                                    type="button" data-ev="${id}" ${disabled ? "disabled" : ""}>
                              <span class="l1-evidence__check">${isPicked ? "✓" : ""}</span>
                              <span class="l1-evidence__main">
                                <strong>${e.label}</strong>
                                <em>${e.detail}</em>
                              </span>
                            </button>`;
                        })
                        .join("")
                }
              </div>
            </section>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-prepare
              ${s.selectedBranch && picked.length === 2 ? "" : "disabled"}>
              <span aria-hidden="true">🖋</span><span>اعتماد التوصية والذهاب للاجتماع</span>
            </button>
          </div>
        `;

        root.querySelectorAll<HTMLButtonElement>("[data-branch]").forEach((btn) => {
          btn.addEventListener("click", () => selectBranch(btn.dataset.branch as Branch));
        });
        root.querySelectorAll<HTMLButtonElement>("[data-ev]").forEach((btn) => {
          btn.addEventListener("click", () => toggleEvidence(btn.dataset.ev as EvidenceId));
        });
        root.querySelector<HTMLButtonElement>("[data-prepare]")!.addEventListener("click", () => {
          prepareDecision();
          if (document.body.classList.contains("l1-playable-overlay-open")) {
            gameEvents.emit("decisionPreparedForMeeting", undefined);
            gameEvents.emit("closeRoomOverlay", undefined);
          } else {
            gameEvents.emit("enterRoom", { roomId: "meeting" });
          }
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
      observer.observe(body.parentNode || document.body, { childList: true });
    },
  });
}

function branchCard(id: Branch, name: string, detail: string, selected: boolean): string {
  return `
    <button class="l1-branch ${selected ? "l1-branch--selected" : ""}" type="button" data-branch="${id}">
      <h4>${name}</h4>
      <p>${detail}</p>
      ${selected ? `<span class="l1-branch__check">✓ مختار</span>` : ""}
    </button>`;
}
