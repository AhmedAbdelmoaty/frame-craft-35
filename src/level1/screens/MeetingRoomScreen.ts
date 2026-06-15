import { createRoomShell } from "./RoomShell";
import {
  getState,
  submitRecommendation,
  subscribe,
} from "../state/store";
import { evaluate, EVIDENCE_DEFS, type EvidenceId } from "../logic/evaluate";

const CHARACTERS = [
  { id: "nader", name: "نادر", role: "المدير المالي", initial: "ن", color: "#2b78c5" },
  { id: "emad", name: "عماد", role: "مدير المبيعات", initial: "ع", color: "#c56b2b" },
  { id: "layla", name: "ليلى", role: "مديرة HR", initial: "ل", color: "#7b3fb0" },
];

export function createMeetingRoomScreen() {
  return createRoomShell({
    roomId: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "عرض التوصية والحكم النهائي",
    renderBody: (body) => {
      const root = document.createElement("div");
      root.className = "l1-meeting";
      body.appendChild(root);

      const render = () => {
        const s = getState();
        root.innerHTML = "";

        if (!s.hasPreparedDecision) {
          root.innerHTML = `
            <div class="l1-analyst-empty">
              <div class="l1-analyst-empty__icon" aria-hidden="true">🤝</div>
              <h3>لا توجد توصية محضّرة بعد</h3>
              <p>توجه إلى غرفة القرار أولًا لاختيار الفرع والأدلة.</p>
            </div>`;
          return;
        }

        const table = document.createElement("div");
        table.className = "l1-meeting__table";
        table.innerHTML = CHARACTERS.map(
          (c) => `
          <div class="l1-meeting__seat">
            <div class="l1-meeting__avatar" style="background:${c.color}">${c.initial}</div>
            <div class="l1-meeting__nameplate">
              <strong>${c.name}</strong><span>${c.role}</span>
            </div>
          </div>`,
        ).join("");
        root.appendChild(table);

        const stage = document.createElement("div");
        stage.className = "l1-meeting__stage";
        root.appendChild(stage);
        renderSummary(stage);
      };

      const renderSummary = (host: HTMLElement) => {
        const s = getState();
        host.innerHTML = `
          <h3 class="l1-meeting__prompt">التوصية المقدّمة:</h3>
          <div class="l1-meeting__summary">
            <p class="l1-meeting__branch">الفرع المرشح للمكافأة: <strong>${s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش"}</strong></p>
            <ul class="l1-decision__picks">
              ${s.preparedEvidenceIds
                .map((id) => {
                  const e = EVIDENCE_DEFS[id as EvidenceId];
                  return `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>`;
                })
                .join("")}
            </ul>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-submit>
              <span aria-hidden="true">🖋</span><span>اعتماد ومناقشة</span>
            </button>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-submit]")!.addEventListener("click", () => {
          const sNow = getState();
          const r = evaluate(sNow.preparedBranch, sNow.preparedEvidenceIds);
          submitRecommendation(r.outcome, r.failureReason ?? null);
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
