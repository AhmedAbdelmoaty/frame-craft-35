import { getState, setActiveTab, setMissionFileOpen, subscribe, type MissionTabId } from "../state/store";
import { renderBriefTab } from "./tabs/BriefTab";
import { renderPlaceholderTab } from "./tabs/PlaceholderTab";
import { renderNotesTab } from "./tabs/NotesTab";

const TABS: { id: MissionTabId; label: string; icon: string }[] = [
  { id: "brief", label: "الملخّص", icon: "📋" },
  { id: "branches", label: "الفروع", icon: "🏬" },
  { id: "evidence", label: "الأدلة", icon: "🔎" },
  { id: "policy", label: "السياسة", icon: "📐" },
  { id: "notes", label: "ملاحظاتي", icon: "✍️" },
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
        <h2>📁 ملف المهمة</h2>
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
    switch (tab) {
      case "brief":
        renderBriefTab(contentEl);
        break;
      case "branches":
        renderPlaceholderTab(contentEl, {
          title: "بطاقات الفروع",
          hint: "ستظهر هنا تلقائيًا بعد زيارة مكتب المبيعات وفتح بطاقات الأداء.",
          items: ["فرع الكورنيش — في الانتظار", "فرع الميدان — في الانتظار"],
        });
        break;
      case "evidence":
        renderPlaceholderTab(contentEl, {
          title: "الأدلة المُجمَّعة",
          hint: "كل دليل تلتقطه أثناء التحقيق سيُسجَّل هنا تلقائيًا.",
          items: ["لم تُجمَع أدلة بعد"],
        });
        break;
      case "policy":
        renderPlaceholderTab(contentEl, {
          title: "سياسة الأداء",
          hint: "ستظهر بعد زيارة مكتب الموارد البشرية وفتح ملف السياسة.",
          items: ["حد الأداء الأدنى — لم يُكشف بعد"],
        });
        break;
      case "notes":
        renderNotesTab(contentEl);
        break;
    }
  };

  const render = () => {
    const s = getState();
    root.hidden = !s.missionFileOpen;
    tabBtns.forEach((b) => b.classList.toggle("l1-mission__tab--active", b.dataset.tab === s.missionFileTab));
    if (s.missionFileOpen) renderActiveTab(s.missionFileTab);
  };

  render();
  const unsub = subscribe(render);

  return {
    root,
    destroy: () => {
      unsub();
      window.removeEventListener("keydown", handleKey);
      root.remove();
    },
  };
}
