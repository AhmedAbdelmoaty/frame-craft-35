import {
  getState,
  isGameOver,
  isMeetingUnlocked,
  markMeetingUnlockSeen,
  setMissionFileOpen,
  subscribe,
  LEVEL_DURATION_SECONDS,
  type Level1State,
  type RoomLocation,
} from "../state/store";
import { formatTime } from "../logic/timer";
import { availableEvidence } from "../logic/evaluate";

const LOCATION_LABEL: Record<RoomLocation, string> = {
  map: "خريطة الشركة",
  office: "غرفة التحليل",
  sales: "مكتب المبيعات",
  hr: "مكتب HR",
  decision: "غرفة القرار",
  meeting: "غرفة الاجتماع",
};

type Phase = "calm" | "alert" | "critical" | "zero";

function phaseOf(s: Level1State): Phase {
  const t = s.meetingTimeRemaining;
  if (t <= 0) return "zero";
  if (t <= 30) return "critical";
  if (t <= 60) return "alert";
  return "calm";
}

export function mountTopBar(parent: HTMLElement = document.body) {
  const bar = document.createElement("header");
  bar.className = "l1-topbar";
  bar.dir = "rtl";
  bar.innerHTML = `
    <div class="l1-topbar__timer" data-timer>
      <span class="l1-topbar__timer-icon" aria-hidden="true">⏳</span>
      <span class="l1-topbar__timer-stack">
        <span class="l1-topbar__timer-label">وقت المهمة</span>
        <span class="l1-topbar__timer-text" data-timer-text>03:00</span>
      </span>
      <span class="l1-topbar__timer-bar" aria-hidden="true"><i data-timer-bar></i></span>
    </div>
    <button class="l1-topbar__mission-btn" type="button" data-mission-btn aria-label="فتح ملف المهمة">
      <span aria-hidden="true">▣</span>
      <span>الملف</span>
      <b class="l1-topbar__mission-count" data-mission-count>0</b>
    </button>
    <div class="l1-topbar__location">
      <span class="l1-topbar__location-icon" aria-hidden="true">◆</span>
      <span class="l1-topbar__location-text" data-loc-text>خريطة الشركة</span>
    </div>
  `;
  parent.appendChild(bar);

  const locText = bar.querySelector<HTMLElement>("[data-loc-text]")!;
  const timerEl = bar.querySelector<HTMLElement>("[data-timer]")!;
  const timerText = bar.querySelector<HTMLElement>("[data-timer-text]")!;
  const timerBar = bar.querySelector<HTMLElement>("[data-timer-bar]")!;
  const missionBtn = bar.querySelector<HTMLButtonElement>("[data-mission-btn]")!;
  const missionCount = bar.querySelector<HTMLElement>("[data-mission-count]")!;

  missionBtn.addEventListener("click", () => {
    if (isGameOver()) return;
    setMissionFileOpen(!getState().missionFileOpen);
  });

  const render = () => {
    const s = getState();
    locText.textContent = LOCATION_LABEL[s.currentLocation];
    timerText.textContent = formatTime(s.meetingTimeRemaining);
    timerBar.style.transform = `scaleX(${Math.max(0, Math.min(1, s.meetingTimeRemaining / LEVEL_DURATION_SECONDS))})`;

    const phase = phaseOf(s);
    timerEl.classList.toggle("l1-topbar__timer--calm", phase === "calm");
    timerEl.classList.toggle("l1-topbar__timer--alert", phase === "alert");
    timerEl.classList.toggle("l1-topbar__timer--critical", phase === "critical");
    timerEl.classList.toggle("l1-topbar__timer--zero", phase === "zero");

    missionBtn.classList.toggle("l1-topbar__mission-btn--active", s.missionFileOpen);
    const collectedEvidence = availableEvidence(s).length;
    missionCount.textContent = `${collectedEvidence}`;
    missionCount.hidden = collectedEvidence === 0;

    const over = isGameOver(s);
    const unlocked = isMeetingUnlocked(s);
    missionBtn.disabled = over;

    if (unlocked && !s.meetingUnlockSeen && !over) {
      markMeetingUnlockSeen();
      showToast("التوصية جاهزة - اعرضها في غرفة الاجتماع");
    }
  };

  render();
  const unsub = subscribe(render);

  return {
    root: bar,
    destroy: () => {
      unsub();
      bar.remove();
    },
  };
}

function showToast(message: string) {
  const toast = document.createElement("div");
  toast.className = "l1-toast";
  toast.dir = "rtl";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("l1-toast--show"));
  window.setTimeout(() => {
    toast.classList.remove("l1-toast--show");
    window.setTimeout(() => toast.remove(), 320);
  }, 3200);
}
