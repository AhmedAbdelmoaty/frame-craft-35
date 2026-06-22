import {
  getState,
  markBriefRead,
  startTimer,
  subscribe,
} from "../state/store";
import { briefMessage } from "../data/briefMessage";

export function mountBriefingModal(parent: HTMLElement = document.body) {
  if (getState().hasReadBrief) return null;

  const root = document.createElement("div");
  root.className = "l1-briefing";
  root.dir = "rtl";
  root.innerHTML = `
    <div class="l1-briefing__backdrop"></div>
    <section class="l1-briefing__panel" role="dialog" aria-label="${briefMessage.subject}">
      <header class="l1-briefing__head">
        <div class="l1-briefing__avatar" aria-hidden="true">ن</div>
        <div class="l1-briefing__meta">
          <p class="l1-briefing__from">${briefMessage.from}</p>
          <p class="l1-briefing__role">${briefMessage.role}</p>
        </div>
        <span class="l1-briefing__pill">إشعار عاجل</span>
      </header>
      <h2 class="l1-briefing__subject">${briefMessage.subject}</h2>
      <div class="l1-briefing__body">
        ${briefMessage.body.map((p) => `<p>${p}</p>`).join("")}
      </div>
      <footer class="l1-briefing__foot">
        <button class="l1-btn l1-btn--primary l1-briefing__cta" type="button" data-start>
          <span aria-hidden="true">▶</span><span>ابدأ المهمة</span>
        </button>
      </footer>
    </section>
  `;
  parent.appendChild(root);

  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };
  const guardMapInput = () => {
    document.body.classList.add("madar-input-guard");
    window.setTimeout(() => document.body.classList.remove("madar-input-guard"), 900);
  };
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);

  const close = () => {
    root.classList.add("l1-briefing--leaving");
    window.setTimeout(() => root.remove(), 260);
  };

  root.querySelector<HTMLButtonElement>("[data-start]")!.addEventListener("click", () => {
    guardMapInput();
    markBriefRead();
    startTimer();
    close();
  });

  // Defensive: if briefing state externally flips, also close.
  const unsub = subscribe((s) => {
    if (s.hasReadBrief && root.isConnected) {
      unsub();
      close();
    }
  });

  return {
    root,
    destroy: () => {
      unsub();
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
      root.remove();
    },
  };
}
