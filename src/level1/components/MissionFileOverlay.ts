import { getState, setActiveTab, setMissionFileOpen, subscribe, type MissionTabId } from "../state/store";
import { renderBriefTab } from "./tabs/BriefTab";
import { renderEvidenceTab } from "./tabs/EvidenceTab";
import { renderFilesTab } from "./tabs/FilesTab";

const TABS: { id: MissionTabId; label: string; icon: string }[] = [
  { id: "brief", label: "الملخص", icon: "▤" },
  { id: "files", label: "الملفات", icon: "▣" },
  { id: "evidence", label: "الأدلة", icon: "⌕" },
];

export function mountMissionFileOverlay(parent: HTMLElement = document.body) {
  const root = document.createElement("div");
  root.className = "l1-mission";
  root.dir = "rtl";
  root.hidden = true;
  root.innerHTML = `
    <div class="l1-mission__backdrop" data-close></div>
    <section class="l1-mission__panel" role="dialog" aria-label="ملف المهمة">
      <header class="l1-mission__header">
        <div>
          <span class="l1-mission__eyebrow">دوسييه المهمة</span>
          <h2>ملف المهمة</h2>
        </div>
        <span class="l1-mission__last-update" data-last-update hidden></span>
        <button class="l1-mission__close" type="button" data-close aria-label="إغلاق">×</button>
      </header>
      <div class="l1-mission__layout">
        <nav class="l1-mission__tabs" role="tablist">
          ${TABS.map(
            (t) => `
            <button class="l1-mission__tab" type="button" role="tab" data-tab="${t.id}">
              <span aria-hidden="true">${t.icon}</span>
              <span>${t.label}</span>
            </button>`,
          ).join("")}
        </nav>
        <div class="l1-mission__content" data-content></div>
      </div>
    </section>
  `;
  parent.appendChild(root);

  const contentEl = root.querySelector<HTMLElement>("[data-content]")!;
  const tabBtns = Array.from(root.querySelectorAll<HTMLButtonElement>(".l1-mission__tab"));
  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab as MissionTabId));
  });

  root.querySelectorAll<HTMLElement>("[data-close]").forEach((el) =>
    el.addEventListener("click", () => setMissionFileOpen(false)),
  );

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && getState().missionFileOpen) setMissionFileOpen(false);
  };
  window.addEventListener("keydown", handleKey);

  const renderActiveTab = (tab: MissionTabId) => {
    if (tab === "brief") renderBriefTab(contentEl);
    if (tab === "files") renderFilesTab(contentEl);
    if (tab === "evidence") renderEvidenceTab(contentEl);
  };

  const lastUpdateEl = root.querySelector<HTMLElement>("[data-last-update]")!;

  const render = () => {
    const s = getState();
    root.hidden = !s.missionFileOpen;
    tabBtns.forEach((b) => b.classList.toggle("l1-mission__tab--active", b.dataset.tab === s.missionFileTab));
    if (s.lastMissionUpdate) {
      lastUpdateEl.hidden = false;
      lastUpdateEl.textContent = s.lastMissionUpdate;
    } else {
      lastUpdateEl.hidden = true;
    }
    if (s.missionFileOpen) renderActiveTab(s.missionFileTab);
  };

  render();
  const unsub = subscribe(render);

  return {
    root,
    destroy: () => {
      unsub();
      window.removeEventListener("keydown", handleKey);
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
      root.remove();
    },
  };
}
