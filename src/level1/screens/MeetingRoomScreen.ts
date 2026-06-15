import { createRoomShell } from "./RoomShell";
import {
  getState,
  resetDecision,
  resetLevel,
  resetMeeting,
  setMeetingStage,
  submitRecommendation,
  subscribe,
} from "../state/store";
import { gameEvents } from "../../game/events";
import { evaluate, EVIDENCE_DEFS, type EvidenceId } from "../logic/evaluate";
import {
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
    subtitle: "عرض التوصية والحكم النهائي",
    renderBody: (body) => {
      const root = document.createElement("div");
      root.className = "l1-meeting";
      body.appendChild(root);

      const render = () => {
        const s = getState();
        root.innerHTML = "";

        // No prepared decision yet
        if (!s.hasPreparedDecision && s.finalOutcome === null) {
          root.innerHTML = `
            <div class="l1-analyst-empty">
              <div class="l1-analyst-empty__icon" aria-hidden="true">🤝</div>
              <h3>لا توجد توصية محضّرة بعد</h3>
              <p>توجّه إلى غرفة القرار أولًا لبناء توصيتك واختيار الأدلة.</p>
              <button class="l1-btn l1-btn--ghost" type="button" data-exit>← خروج إلى الخريطة</button>
            </div>`;
          root.querySelector<HTMLButtonElement>("[data-exit]")!.addEventListener("click", () =>
            gameEvents.emit("exitRoom", { roomId: "meeting" }),
          );
          return;
        }

        // Table with characters
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

        if (s.meetingStage === "result") renderResult(stage);
        else if (s.meetingStage === "summary") renderSummary(stage);
        else renderIntro(stage);
      };

      const renderIntro = (host: HTMLElement) => {
        host.innerHTML = `
          <div class="l1-bubble l1-bubble--nader">
            <span class="l1-bubble__who">نادر</span>
            <p>${NADER_OPENING[0]}</p>
            <p>${NADER_OPENING[1]}</p>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary" type="button" data-go>اعرض التوصية ›</button>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-go]")!.addEventListener("click", () =>
          setMeetingStage("summary"),
        );
      };

      const renderSummary = (host: HTMLElement) => {
        const s = getState();
        host.innerHTML = `
          <h3 class="l1-meeting__prompt">التوصية المقدَّمة:</h3>
          <div class="l1-meeting__summary">
            <p class="l1-meeting__branch">الفرع الموصى به: <strong>${s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش"}</strong></p>
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
            <button class="l1-btn l1-btn--ghost" type="button" data-back>‹ رجوع</button>
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-submit>
              <span aria-hidden="true">🖋</span><span>اعتماد ومناقشة</span>
            </button>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-back]")!.addEventListener("click", () =>
          setMeetingStage("intro"),
        );
        host.querySelector<HTMLButtonElement>("[data-submit]")!.addEventListener("click", () => {
          const sNow = getState();
          const r = evaluate(sNow.preparedBranch, sNow.preparedEvidenceIds);
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
            ${isSuccess ? `<div class="l1-result__complete">🏆 المستوى الأول مكتمل — فخ المتوسط</div>` : ""}
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
              ${
                isSuccess
                  ? `<button class="l1-btn l1-btn--ghost" type="button" data-replay>↻ إعادة اللعب من البداية</button>
                     <button class="l1-btn l1-btn--primary" type="button" data-exit>إنهاء — العودة للخريطة</button>`
                  : `<button class="l1-btn l1-btn--ghost" type="button" data-retry>عدّل التوصية</button>
                     <button class="l1-btn l1-btn--primary" type="button" data-exit>العودة للخريطة</button>`
              }
            </div>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-retry]")?.addEventListener("click", () => {
          resetDecision();
          resetMeeting();
          gameEvents.emit("exitRoom", { roomId: "meeting" });
        });
        host.querySelector<HTMLButtonElement>("[data-replay]")?.addEventListener("click", () => {
          resetLevel();
          gameEvents.emit("exitRoom", { roomId: "meeting" });
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

function bubble(who: string, name: string, text: string): string {
  return `
    <div class="l1-bubble l1-bubble--${who}">
      <span class="l1-bubble__who">${name}</span>
      <p>${text}</p>
    </div>`;
}
