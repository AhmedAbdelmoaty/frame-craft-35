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
    subtitle: "جهز التوصية قبل دخول الاجتماع",
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
              <div class="l1-analyst-empty__icon" aria-hidden="true">▣</div>
              <h3>غرفة القرار تنتظر ملفاتك</h3>
              <p>اجمع ملفًا واحدًا على الأقل من المبيعات أو HR، أو افتح طاولة التحليل، ثم عد لتجهيز التوصية.</p>
            </div>`;
          return;
        }

        if (s.hasPreparedDecision) {
          root.innerHTML = `
            <div class="l1-decision__ready">
              <span class="l1-pill l1-pill--success">ملف التوصية مختوم</span>
              <h3>التوصية جاهزة للعرض</h3>
              <p>الفرع المرشح للمكافأة: <strong>${s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش"}</strong></p>
              <ul class="l1-decision__picks">
                ${s.preparedEvidenceIds
                  .map((id) => {
                    const e = EVIDENCE_DEFS[id as EvidenceId];
                    return `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>`;
                  })
                  .join("")}
              </ul>
              <div class="l1-meeting__cta l1-decision__dock">
                <button class="l1-btn l1-btn--ghost" type="button" data-edit>تعديل الملف</button>
                <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-go>
                  <span aria-hidden="true">→</span><span>ادخل الاجتماع</span>
                </button>
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
          <header class="l1-decision__brief">
            <span class="l1-decision__seal" aria-hidden="true">⚖</span>
            <div>
              <p>غرفة القرار</p>
              <h3>جهز توصيتك كملف اعتماد</h3>
            </div>
            <strong>${picked.length}/2 أدلة</strong>
          </header>
          <div class="l1-decision__layout">
            <section class="l1-decision__col">
              <h3 class="l1-meeting__prompt">بطاقة الفرع</h3>
              <p class="l1-meeting__hint">اختر الفرع الذي ستدافع عنه أمام الإدارة.</p>
              <div class="l1-branch-choices">
                ${branchCard("corniche", "فرع الكورنيش", "متوسط معلن 96% · 960K", s.selectedBranch === "corniche")}
                ${branchCard("midan", "فرع الميدان", "متوسط معلن 89.5% · 895K", s.selectedBranch === "midan")}
              </div>
            </section>
            <section class="l1-decision__col">
              <h3 class="l1-meeting__prompt">حافظة الأدلة</h3>
              <p class="l1-meeting__hint">ضع دليلين فقط في ملف التوصية.</p>
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
          <div class="l1-meeting__cta l1-decision__dock">
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-prepare
              ${s.selectedBranch && picked.length === 2 ? "" : "disabled"}>
              <span aria-hidden="true">✒</span><span>اعتمد التوصية</span>
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
      <span class="l1-branch__emblem" aria-hidden="true">${id === "midan" ? "M" : "K"}</span>
      <h4>${name}</h4>
      <p>${detail}</p>
      ${selected ? `<span class="l1-branch__check">✓ مختار</span>` : ""}
    </button>`;
}
