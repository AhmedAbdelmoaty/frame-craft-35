import { createRoomShell } from "./RoomShell";
import { PERFORMANCE_THRESHOLD } from "../data/branches";
import {
  getState,
  saveHRPolicy,
  subscribe,
  visitHR,
} from "../state/store";

export function createHROfficeScreen() {
  visitHR();
  return createRoomShell({
    roomId: "hr",
    title: "مكتب الموارد البشرية",
    subtitle: "ليلى · مديرة HR",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="l1-office l1-office--hr">
          <aside class="l1-office__npc">
            <div class="l1-npc">
              <img class="l1-npc__img" src="/assets/characters/hr-manager.svg" alt="ليلى" />
              <div class="l1-npc__nameplate">
                <strong>ليلى</strong><span>مديرة HR</span>
              </div>
            </div>
            <div class="l1-dialogue">
              <p class="l1-dialogue__text">سياسة الأداء الرسمية أمامك. خذها معك قبل بناء التوصية.</p>
            </div>
          </aside>

          <section class="l1-office__main">
            <div class="l1-folder" data-board>
              <header class="l1-folder__head">
                <span class="l1-folder__tab">سياسة الأداء</span>
                <h3>وثيقة سياسة المكافأة — الربع الحالي</h3>
              </header>
              <div class="l1-folder__body">
                <p class="l1-folder__rule">
                  المندوب يعتبر محققًا للأداء المطلوب إذا بلغ
                  <strong class="l1-folder__num">${PERFORMANCE_THRESHOLD}%</strong>
                  أو أكثر من الهدف الشهري.
                </p>
                <ul class="l1-folder__list">
                  <li>تطبق السياسة على جميع المندوبين دون استثناء.</li>
                  <li>الحكم يكون على مستوى المندوب الفرد.</li>
                </ul>
              </div>
              <footer class="l1-folder__foot" data-save-wrap>
                <button class="l1-btn l1-btn--save" type="button" data-save>
                  <span aria-hidden="true">📥</span><span>استلام سياسة الأداء</span>
                </button>
              </footer>
              <p class="l1-board__saved" data-saved hidden>✓ تم استلام سياسة الأداء.</p>
            </div>
          </section>
        </div>
      `;

      const saveWrap = body.querySelector<HTMLElement>("[data-save-wrap]")!;
      const saveBtn = body.querySelector<HTMLButtonElement>("[data-save]")!;
      const savedMsg = body.querySelector<HTMLElement>("[data-saved]")!;

      const render = () => {
        const s = getState();
        saveWrap.hidden = s.hasSavedHRPolicy;
        savedMsg.hidden = !s.hasSavedHRPolicy;
        saveBtn.disabled = s.hasSavedHRPolicy;
      };
      const unsub = subscribe(render);
      render();

      saveBtn.addEventListener("click", () => {
        saveHRPolicy();
        saveBtn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
          { duration: 220, easing: "ease-out" },
        );
      });

      const observer = new MutationObserver(() => {
        if (!body.isConnected) {
          unsub();
          observer.disconnect();
        }
      });
      observer.observe(body.parentNode || body, { childList: true });
    },
  });
}
