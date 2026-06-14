import { createRoomShell } from "./RoomShell";
import {
  getState,
  resetLevel,
  resetMeeting,
  selectBranch,
  setMeetingStage,
  submitRecommendation,
  subscribe,
  toggleEvidence,
  type Branch,
} from "../state/store";
import { gameEvents } from "../../game/events";
import {
  availableEvidence,
  EVIDENCE_DEFS,
  evaluate,
  type EvidenceId,
} from "../logic/evaluate";
import {
  BRANCH_PROMPT,
  EVIDENCE_PROMPT,
  NADER_OPENING,
  SUCCESS_DIALOGUE,
  failureDialogue,
} from "../data/meetingDialogue";

const CHARACTERS = [
  { id: "nader", name: "نادر", role: "المدير المالي", initial: "ن", color: "#2b78c5" },
  { id: "emad", name: "عماد", role: "مدير المبيعات", initial: "ع", color: "#c56b2b" },
  { id: "layla", name: "ليلى", role: "مديرة HR", initial: "ل", color: "#7b3fb0" },
];

export function createMeetingRoomScreen() {
  return createRoomShell({
    roomId: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "اعتماد مكافأة الفرع · نادر، عماد، ليلى",
    renderBody: (body) => {
      // reset if entering fresh after a previous result
      if (getState().meetingStage === "result" && getState().finalOutcome === null) {
        setMeetingStage("intro");
      } else if (getState().meetingStage === "intro" && getState().finalOutcome) {
        // keep result visible if not reset
      }

      const root = document.createElement("div");
      root.className = "l1-meeting";
      body.appendChild(root);

      const render = () => {
        const s = getState();
        root.innerHTML = "";

        // table with characters
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

        // stage content
        const stage = document.createElement("div");
        stage.className = "l1-meeting__stage";
        root.appendChild(stage);

        if (s.meetingStage === "intro") renderIntro(stage);
        else if (s.meetingStage === "branch") renderBranch(stage);
        else if (s.meetingStage === "evidence") renderEvidence(stage);
        else if (s.meetingStage === "result") renderResult(stage);
      };

      const renderIntro = (host: HTMLElement) => {
        host.innerHTML = `
          <div class="l1-bubble l1-bubble--nader">
            <span class="l1-bubble__who">نادر</span>
            <p>${NADER_OPENING[0]}</p>
            <p>${NADER_OPENING[1]}</p>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary" type="button" data-go>أبدأ التوصية ›</button>
          </div>
        `;
        host
          .querySelector<HTMLButtonElement>("[data-go]")!
          .addEventListener("click", () => setMeetingStage("branch"));
      };

      const renderBranch = (host: HTMLElement) => {
        const s = getState();
        host.innerHTML = `
          <h3 class="l1-meeting__prompt">${BRANCH_PROMPT}</h3>
          <div class="l1-branch-choices">
            ${branchCard("corniche", "فرع الكورنيش", "متوسط مُعلَن ٩٦٪ · 960K", s.selectedBranch === "corniche")}
            ${branchCard("midan", "فرع الميدان", "متوسط مُعلَن ٨٩٫٥٪ · 895K", s.selectedBranch === "midan")}
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--ghost" type="button" data-back>‹ رجوع</button>
            <button class="l1-btn l1-btn--primary" type="button" data-next ${s.selectedBranch ? "" : "disabled"}>
              التالي: اختيار الأدلة ›
            </button>
          </div>
        `;
        host.querySelectorAll<HTMLButtonElement>("[data-branch]").forEach((btn) => {
          btn.addEventListener("click", () => selectBranch(btn.dataset.branch as Branch));
        });
        host.querySelector<HTMLButtonElement>("[data-back]")!.addEventListener("click", () =>
          setMeetingStage("intro"),
        );
        host.querySelector<HTMLButtonElement>("[data-next]")!.addEventListener("click", () => {
          if (getState().selectedBranch) setMeetingStage("evidence");
        });
      };

      const renderEvidence = (host: HTMLElement) => {
        const s = getState();
        const ids = availableEvidence(s);
        const picked = s.selectedEvidenceIds;
        host.innerHTML = `
          <h3 class="l1-meeting__prompt">${EVIDENCE_PROMPT}</h3>
          <p class="l1-meeting__hint">المختار: <strong>${picked.length} / 2</strong></p>
          <div class="l1-evidence-list">
            ${ids
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
              .join("")}
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--ghost" type="button" data-back>‹ رجوع</button>
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-submit
              ${picked.length === 2 ? "" : "disabled"}>
              <span aria-hidden="true">🖋</span><span>قدّم التوصية</span>
            </button>
          </div>
        `;
        host.querySelectorAll<HTMLButtonElement>("[data-ev]").forEach((btn) => {
          btn.addEventListener("click", () => toggleEvidence(btn.dataset.ev as EvidenceId));
        });
        host.querySelector<HTMLButtonElement>("[data-back]")!.addEventListener("click", () =>
          setMeetingStage("branch"),
        );
        host.querySelector<HTMLButtonElement>("[data-submit]")!.addEventListener("click", () => {
          const r = evaluate(getState());
          submitRecommendation(r.outcome, r.failureReason ?? null);
        });
      };

      const renderResult = (host: HTMLElement) => {
        const s = getState();
        const d =
          s.finalOutcome === "success"
            ? SUCCESS_DIALOGUE
            : failureDialogue(s.failureReason ?? "incomplete");
        const isSuccess = s.finalOutcome === "success";
        host.innerHTML = `
          <div class="l1-result l1-result--${isSuccess ? "success" : "failure"}">
            <div class="l1-result__stamp">${isSuccess ? "✓" : "✗"}</div>
            <span class="l1-result__badge">${d.badge}</span>
            <h3 class="l1-result__title">${d.title}</h3>

            <div class="l1-result__bubbles">
              ${bubble("nader", "نادر", d.nader)}
              ${bubble("layla", "ليلى", d.layla)}
              ${bubble("emad", "عماد", d.emad)}
            </div>

            <div class="l1-lesson">
              <h4>📘 ماذا تعلّمت؟</h4>
              <ul>${d.lesson.map((l) => `<li>${l}</li>`).join("")}</ul>
            </div>

            <div class="l1-meeting__cta">
              <button class="l1-btn l1-btn--ghost" type="button" data-retry>أعد المحاولة</button>
              <button class="l1-btn l1-btn--primary" type="button" data-exit>إنهاء — العودة للخريطة</button>
            </div>
          </div>
        `;
        host.querySelector<HTMLButtonElement>("[data-retry]")!.addEventListener("click", () => {
          resetMeeting();
        });
        host.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener("click", () =>
          gameEvents.emit("exitRoom", { roomId: "meeting" }),
        );
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
      ${selected ? `<span class="l1-branch__check">✓ مُختار</span>` : ""}
    </button>`;
}

function bubble(who: string, name: string, text: string): string {
  return `
    <div class="l1-bubble l1-bubble--${who}">
      <span class="l1-bubble__who">${name}</span>
      <p>${text}</p>
    </div>`;
}
