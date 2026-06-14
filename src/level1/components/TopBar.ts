import { getState, setMissionFileOpen, subscribe, type RoomLocation } from "../state/store";
import { formatTime } from "../logic/timer";

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

  missionBtn.addEventListener("click", () => {
    setMissionFileOpen(!getState().missionFileOpen);
  });

  const render = () => {
    const s = getState();
    locText.textContent = LOCATION_LABEL[s.currentLocation];
    timerText.textContent = formatTime(s.meetingTimeRemaining);
    timerEl.classList.toggle("l1-topbar__timer--danger", s.meetingTimeRemaining <= 120);
    timerEl.classList.toggle("l1-topbar__timer--zero", s.meetingTimeRemaining <= 0);
    missionBtn.classList.toggle("l1-topbar__mission-btn--active", s.missionFileOpen);
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
