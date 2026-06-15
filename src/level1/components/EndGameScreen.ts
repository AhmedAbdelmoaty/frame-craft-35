// EndGameScreen — unified final feedback overlay for the three end states.
// success | wrong_decision | timeout.
// After it appears, the round is over. Retry restarts the whole level.

import {
  getState,
  resetLevel,
  LEVEL_DURATION_SECONDS,
} from "../state/store";
import { EVIDENCE_DEFS, type EvidenceId } from "../logic/evaluate";
import { formatTime } from "../logic/timer";
import {
  failureDialogue,
  SUCCESS_DIALOGUE,
  TIMEOUT_DIALOGUE,
  type ResultDialogue,
} from "../data/meetingDialogue";

export type EndKind = "success" | "wrong_decision" | "timeout";

type Mood = "calm" | "alert" | "pounce";

const MOOD: Record<EndKind, Mood> = {
  success: "calm",
  wrong_decision: "alert",
  timeout: "pounce",
};

const FLAVOR: Record<EndKind, string> = {
  success: "نجحت قبل أن يلحق بك Deadline ✨",
  wrong_decision: "وصلت في الوقت… لكن قرارك لم يصمد أمام الأرقام.",
  timeout: "انقضّ عليك Deadline — لم يمنحك ثانية إضافية!",
};

function dialogueFor(kind: EndKind): ResultDialogue {
  if (kind === "success") return SUCCESS_DIALOGUE;
  if (kind === "timeout") return TIMEOUT_DIALOGUE;
  const s = getState();
  return failureDialogue(s.failureReason ?? "midan_weak_evidence");
}

function mascotSvg(mood: Mood): string {
  const eyeColor = mood === "calm" ? "#ffffff" : mood === "alert" ? "#ffb84a" : "#ff3a3a";
  const bodyColor = mood === "pounce" ? "#0d0d12" : "#1a1a22";
  const mouth =
    mood === "pounce"
      ? `<path d="M35 60 Q50 78 65 60 Q60 70 50 72 Q40 70 35 60 Z" fill="#ff3a3a"/>
         <polygon points="40,62 44,68 48,62" fill="#fff"/>
         <polygon points="52,62 56,68 60,62" fill="#fff"/>`
      : mood === "alert"
      ? `<path d="M42 62 Q50 66 58 62" stroke="#ffb84a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<path d="M44 62 Q50 65 56 62" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return `
    <svg viewBox="0 0 100 100" class="l1-end__dl-svg" aria-hidden="true">
      <ellipse cx="50" cy="88" rx="30" ry="5" fill="rgba(0,0,0,.25)"/>
      <polygon points="22,38 30,10 38,38" fill="${bodyColor}"/>
      <polygon points="78,38 70,10 62,38" fill="${bodyColor}"/>
      <circle cx="50" cy="52" r="28" fill="${bodyColor}"/>
      <circle cx="40" cy="48" r="5" fill="${eyeColor}"/>
      <circle cx="60" cy="48" r="5" fill="${eyeColor}"/>
      ${mouth}
      <circle cx="50" cy="74" r="8" fill="#ffb84a" stroke="#7a3a00" stroke-width="1.5"/>
      <line x1="50" y1="74" x2="50" y2="70" stroke="#7a3a00" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="50" y1="74" x2="54" y2="76" stroke="#7a3a00" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `;
}

function renderSummary(kind: EndKind): string {
  const s = getState();
  const branch = s.preparedBranch
    ? s.preparedBranch === "midan"
      ? "فرع الميدان"
      : "فرع الكورنيش"
    : "—";
  const elapsed = LEVEL_DURATION_SECONDS - s.meetingTimeRemaining;
  const picks = s.preparedEvidenceIds.length
    ? `<ul class="l1-end__picks">${s.preparedEvidenceIds
        .map((id) => {
          const e = EVIDENCE_DEFS[id as EvidenceId];
          return e ? `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>` : "";
        })
        .join("")}</ul>`
    : `<p class="l1-end__none">لم تُقدَّم توصية في هذه الجولة.</p>`;

  return `
    <div class="l1-end__summary">
      <div class="l1-end__stat">
        <span class="l1-end__stat-label">الفرع الموصى به</span>
        <strong>${branch}</strong>
      </div>
      <div class="l1-end__stat">
        <span class="l1-end__stat-label">${kind === "timeout" ? "نفد الوقت بعد" : "الوقت المستهلَك"}</span>
        <strong>${formatTime(elapsed)}</strong>
      </div>
      <div class="l1-end__stat">
        <span class="l1-end__stat-label">الوقت المتبقي</span>
        <strong>${formatTime(s.meetingTimeRemaining)}</strong>
      </div>
    </div>
    <div class="l1-end__evidence">
      <h4>الأدلة المعروضة</h4>
      ${picks}
    </div>
  `;
}

export interface EndScreenHandle {
  unmount: () => void;
}

export function mountEndGameScreen(kind: EndKind, onRetry: () => void): EndScreenHandle {
  const overlay = document.createElement("div");
  overlay.className = `l1-end l1-end--${kind}`;
  overlay.dir = "rtl";
  const mood = MOOD[kind];
  const d = dialogueFor(kind);

  overlay.innerHTML = `
    <div class="l1-end__backdrop"></div>
    <div class="l1-end__card l1-end__card--${kind}" role="dialog" aria-modal="true">
      <div class="l1-end__hero">
        <div class="l1-end__mascot l1-end__mascot--${mood}">
          ${mascotSvg(mood)}
        </div>
        <span class="l1-end__badge">${d.badge}</span>
        <h2 class="l1-end__title">${d.title}</h2>
        <p class="l1-end__flavor">${FLAVOR[kind]}</p>
      </div>

      ${renderSummary(kind)}

      <div class="l1-end__bubbles">
        ${bubble("nader", "نادر", d.nader)}
        ${bubble("layla", "ليلى", d.layla)}
        ${bubble("emad", "عماد", d.emad)}
      </div>

      <div class="l1-end__lesson">
        <h4>📘 ماذا تعلّمت؟</h4>
        <ul>${d.lesson.map((l) => `<li>${l}</li>`).join("")}</ul>
      </div>

      <div class="l1-end__cta">
        <button class="l1-btn l1-btn--primary l1-end__retry" type="button" data-retry>
          <span aria-hidden="true">↻</span>
          <span>${kind === "success" ? "إعادة اللعب من البداية" : "إعادة المحاولة"}</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("l1-end-open");
  requestAnimationFrame(() => overlay.classList.add("l1-end--shown"));

  overlay.querySelector<HTMLButtonElement>("[data-retry]")!.addEventListener("click", () => {
    resetLevel();
    onRetry();
  });

  return {
    unmount: () => {
      overlay.classList.remove("l1-end--shown");
      document.body.classList.remove("l1-end-open");
      window.setTimeout(() => overlay.remove(), 220);
    },
  };
}

function bubble(who: string, name: string, text: string): string {
  return `
    <div class="l1-bubble l1-bubble--${who}">
      <span class="l1-bubble__who">${name}</span>
      <p>${text}</p>
    </div>`;
}
