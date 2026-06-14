import {
  getState,
  isMeetingUnlocked,
  markMeetingUnlockSeen,
  setMissionFileOpen,
  subscribe,
  type RoomLocation,
} from "../state/store";
import { formatTime } from "../logic/timer";
import { gameEvents } from "../../game/events";

const LOCATION_LABEL: Record<RoomLocation, string> = {
  map: "خريطة الشركة",
  office: "مكتب المحلل",
  sales: "مكتب المبيعات",
  hr: "مكتب الموارد البشرية",
  meeting: "غرفة الاجتماع",
};

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
      <span class="l1-topbar__timer-text" data-timer-text>10:00</span>
      <span class="l1-topbar__timer-label">حتى الاجتماع</span>
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
    setMissionFileOpen(!getState().missionFileOpen);
  });

  meetingBtn.addEventListener("click", () => {
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
    timerEl.classList.toggle("l1-topbar__timer--danger", s.meetingTimeRemaining <= 120);
    timerEl.classList.toggle("l1-topbar__timer--zero", s.meetingTimeRemaining <= 0);
    missionBtn.classList.toggle("l1-topbar__mission-btn--active", s.missionFileOpen);

    const unlocked = isMeetingUnlocked(s);
    meetingBtn.disabled = !unlocked;
    meetingBtn.classList.toggle("l1-topbar__meeting-btn--ready", unlocked);

    if (unlocked && !s.meetingUnlockSeen) {
      markMeetingUnlockSeen();
      showToast("اجتماع نادر جاهز — اضغط للدخول 🤝");
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
  // trigger enter
  requestAnimationFrame(() => toast.classList.add("l1-toast--show"));
  window.setTimeout(() => {
    toast.classList.remove("l1-toast--show");
    window.setTimeout(() => toast.remove(), 320);
  }, 3200);
}
