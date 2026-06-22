// EndGameScreen — unified final feedback overlay for the three end states.
// success | wrong_decision | timeout.
// After it appears, the round is over. Retry restarts the whole level.

import {
  getState,
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
  success: "نجحت قبل أن يلحق بك Deadline. التقرير صمد، والقرار اتاخد في الوقت.",
  wrong_decision: "وصلت قبل Deadline، لكن التحليل لم يكن كافيًا للدفاع عن القرار.",
  timeout: "Deadline لحق بك قبل اعتماد التوصية. لا وقت إضافي في هذه المهمة.",
};

function dialogueFor(kind: EndKind): ResultDialogue {
  if (kind === "success") return SUCCESS_DIALOGUE;
  if (kind === "timeout") return TIMEOUT_DIALOGUE;
  const s = getState();
  return failureDialogue(s.failureReason ?? "midan_weak_evidence");
}

function mascotSvg(mood: Mood): string {
  const eyeColor = mood === "calm" ? "#ffffff" : mood === "alert" ? "#ffb84a" : "#ff3a3a";
  const glowColor = mood === "calm" ? "#2f8a4e" : mood === "alert" ? "#ffb84a" : "#ff3a3a";
  const bodyColor = mood === "pounce" ? "#09090d" : "#17171e";
  const tilt = mood === "pounce" ? "rotate(-8 54 54)" : mood === "alert" ? "rotate(-3 54 54)" : "";
  const trail =
    mood === "calm"
      ? `<path d="M35 43 C18 34 15 53 4 44" stroke="#16161b" stroke-width="4" fill="none" stroke-linecap="round" opacity=".45"/>`
      : mood === "alert"
      ? `<path d="M34 38 C14 20 12 52 -2 36" stroke="${glowColor}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>
         <path d="M30 51 C11 61 11 36 -5 49" stroke="#111116" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75"/>`
      : `<path d="M32 35 C7 8 5 50 -12 28" stroke="#ff3a3a" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
         <path d="M27 55 C2 70 4 28 -15 52" stroke="#111116" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`;
  const eyes =
    mood === "calm"
      ? `<ellipse cx="58" cy="39" rx="5" ry="7" fill="${eyeColor}"/>
         <ellipse cx="75" cy="40" rx="5" ry="7" fill="${eyeColor}"/>
         <circle cx="59" cy="40" r="1.8" fill="#07070a"/>
         <circle cx="74" cy="41" r="1.8" fill="#07070a"/>`
      : `<polygon points="52,34 67,39 53,45" fill="${eyeColor}"/>
         <polygon points="82,34 68,39 81,45" fill="${eyeColor}"/>
         <path d="M51 29 L67 34 M83 29 L68 34" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round"/>`;
  const mouth =
    mood === "pounce"
      ? `<ellipse cx="67" cy="56" rx="15" ry="10" fill="#ff3a3a"/>
         <polygon points="57,51 62,62 67,51" fill="#fff"/>
         <polygon points="72,51 77,62 82,51" fill="#fff"/>`
      : mood === "alert"
      ? `<path d="M61 55 Q69 58 77 54" stroke="#ffb84a" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M61 55 Q68 61 76 55" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  return `
    <svg viewBox="-18 0 136 108" class="l1-end__dl-svg" aria-hidden="true">
      <ellipse cx="55" cy="94" rx="48" ry="7" fill="rgba(0,0,0,.24)"/>
      <circle cx="68" cy="52" r="${mood === "pounce" ? 42 : 34}" fill="${glowColor}" opacity="${mood === "calm" ? ".12" : ".2"}"/>
      <g transform="${tilt}">
        ${trail}
        <ellipse cx="42" cy="63" rx="30" ry="21" fill="${bodyColor}"/>
        <circle cx="67" cy="45" r="26" fill="${bodyColor}"/>
        <polygon points="50,29 58,5 67,29" fill="${bodyColor}"/>
        <polygon points="82,31 95,12 91,40" fill="${bodyColor}"/>
        <ellipse cx="25" cy="67" rx="19" ry="10" fill="#101014"/>
        <rect x="28" y="75" width="11" height="22" rx="5" fill="#111116"/>
        <rect x="51" y="76" width="11" height="21" rx="5" fill="#111116"/>
        <rect x="69" y="72" width="12" height="24" rx="5" fill="#111116"/>
        <rect x="85" y="70" width="11" height="22" rx="5" fill="#111116"/>
        <ellipse cx="57" cy="59" rx="28" ry="18" fill="#08080b" opacity=".4"/>
        ${eyes}
        ${mouth}
        <circle cx="56" cy="72" r="10" fill="${mood === "pounce" ? "#ff3a3a" : "#ffb84a"}" stroke="#6b3600" stroke-width="2"/>
        <line x1="56" y1="72" x2="56" y2="65" stroke="#6b3600" stroke-width="2" stroke-linecap="round"/>
        <line x1="56" y1="72" x2="62" y2="75" stroke="#6b3600" stroke-width="2" stroke-linecap="round"/>
      </g>
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
    ? `<ul class="l1-end__picks">${s.preparedEvidenceIds.slice(0, 2)
        .map((id) => {
          const e = EVIDENCE_DEFS[id as EvidenceId];
          return e ? `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>` : "";
        })
        .join("")}</ul>`
    : `<p class="l1-end__none">لم تُقدَّم توصية في هذه الجولة.</p>`;
  const verdict =
    kind === "success"
      ? "الحكم: توصية معتمدة"
      : kind === "wrong_decision"
      ? "الحكم: توصية غير كافية"
      : "الحكم: لم تصل التوصية";

  return `
    <div class="l1-end__summary-grid">
      <section class="l1-end__case-file">
        <span>كشف التحقيق</span>
        <strong>${verdict}</strong>
      </section>
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
    </div>
  `;
}

function scoreFor(kind: EndKind): { label: string; stars: string; note: string } {
  if (kind === "success") {
    return { label: "تقييم المهمة", stars: "★★★", note: "قرار قابل للدفاع" };
  }
  if (kind === "wrong_decision") {
    return { label: "تقييم المهمة", stars: "★☆☆", note: "وصلت في الوقت، لكن الدفاع ضعيف" };
  }
  return { label: "تقييم المهمة", stars: "☆☆☆", note: "نفد الوقت قبل اعتماد القرار" };
}

function endingVisual(kind: EndKind, mood: Mood): string {
  const playerFace = kind === "success" ? "✓" : kind === "timeout" ? "!" : "?";
  return `
    <div class="l1-end__visual l1-end__visual--${kind}">
      <div class="l1-end__player" aria-hidden="true">
        <span class="l1-end__player-head">${playerFace}</span>
        <span class="l1-end__player-body"></span>
      </div>
      <div class="l1-end__mascot l1-end__mascot--${mood}">
        ${mascotSvg(mood)}
      </div>
    </div>`;
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
  const score = scoreFor(kind);

  overlay.innerHTML = `
    <div class="l1-end__backdrop"></div>
    <div class="l1-end__card l1-end__card--${kind}" role="dialog" aria-modal="true">
      <div class="l1-end__hero">
        ${endingVisual(kind, mood)}
        <span class="l1-end__badge">${d.badge}</span>
        <h2 class="l1-end__title">${d.title}</h2>
        <p class="l1-end__flavor">${FLAVOR[kind]}</p>
        <div class="l1-end__score" aria-label="${score.label}">
          <span>${score.stars}</span>
          <strong>${score.note}</strong>
        </div>
      </div>

      <div class="l1-end__content">
        ${renderSummary(kind)}
        <div class="l1-end__lesson">
          <h4>ماذا تتعلم من الجولة؟</h4>
          <ul>${d.lesson.slice(0, 2).map((l) => `<li>${l}</li>`).join("")}</ul>
        </div>
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
