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
import { gameEvents } from "../../game/events";

const LOCATION_LABEL: Record<RoomLocation, string> = {
  map: "خريطة الشركة",
  office: "مكتب المحلل",
  sales: "مكتب المبيعات",
  hr: "مكتب الموارد البشرية",
  decision: "غرفة القرار",
  meeting: "غرفة الاجتماع",
};

type Phase = "calm" | "alert" | "critical" | "zero";

function phaseOf(s: Level1State): Phase {
  const t = s.meetingTimeRemaining;
  if (t <= 0) return "zero";
  if (t <= 45) return "critical";
  if (t <= LEVEL_DURATION_SECONDS * 0.5) return "alert";
  return "calm";
}

export function mountTopBar(parent: HTMLElement = document.body) {
  const bar = document.createElement("header");
  bar.className = "l1-topbar";
  bar.dir = "rtl";
  bar.innerHTML = `
    <div class="l1-topbar__location">
      <span class="l1-topbar__location-icon" aria-hidden="true">📍</span>
      <span class="l1-topbar__location-text" data-loc-text>خريطة الشركة</span>
    </div>
    <div class="l1-topbar__timer" data-timer>
      <span class="l1-topbar__timer-icon" aria-hidden="true">⏱</span>
      <span class="l1-topbar__timer-text" data-timer-text>03:00</span>
      <span class="l1-topbar__timer-label">قبل أن يلحق Deadline</span>
    </div>
    <button class="l1-topbar__meeting-btn" type="button" data-meeting-btn disabled>
      <span aria-hidden="true">🤝</span>
      <span>اذهب للاجتماع</span>
    </button>
    <button class="l1-topbar__mission-btn" type="button" data-mission-btn>
      <span aria-hidden="true">📁</span>
      <span>ملف المهمة</span>
    </button>
  `;
  parent.appendChild(bar);

  const locText = bar.querySelector<HTMLElement>("[data-loc-text]")!;
  const timerEl = bar.querySelector<HTMLElement>("[data-timer]")!;
  const timerText = bar.querySelector<HTMLElement>("[data-timer-text]")!;
  const missionBtn = bar.querySelector<HTMLButtonElement>("[data-mission-btn]")!;
  const meetingBtn = bar.querySelector<HTMLButtonElement>("[data-meeting-btn]")!;

  missionBtn.addEventListener("click", () => {
    if (isGameOver()) return;
    setMissionFileOpen(!getState().missionFileOpen);
  });

  meetingBtn.addEventListener("click", () => {
    if (isGameOver()) return;
    if (!isMeetingUnlocked()) {
      meetingBtn.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 240, easing: "ease-in-out" },
      );
      return;
    }
    if (getState().currentLocation !== "meeting") {
      gameEvents.emit("enterRoom", { roomId: "meeting" });
    }
  });

  const render = () => {
    const s = getState();
    locText.textContent = LOCATION_LABEL[s.currentLocation];
    timerText.textContent = formatTime(s.meetingTimeRemaining);

    const phase = phaseOf(s);
    timerEl.classList.toggle("l1-topbar__timer--calm", phase === "calm");
    timerEl.classList.toggle("l1-topbar__timer--alert", phase === "alert");
    timerEl.classList.toggle("l1-topbar__timer--critical", phase === "critical");
    timerEl.classList.toggle("l1-topbar__timer--zero", phase === "zero");

    missionBtn.classList.toggle("l1-topbar__mission-btn--active", s.missionFileOpen);

    const over = isGameOver(s);
    const unlocked = isMeetingUnlocked(s);
    meetingBtn.disabled = !unlocked || over;
    meetingBtn.classList.toggle("l1-topbar__meeting-btn--ready", unlocked && !over);
    missionBtn.disabled = over;

    if (unlocked && !s.meetingUnlockSeen && !over) {
      markMeetingUnlockSeen();
      showToast("التوصية جاهزة — اعرضها في الاجتماع 🤝");
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
