import { briefMessage } from "../../data/briefMessage";
import { getState } from "../../state/store";

export function renderBriefTab(container: HTMLElement) {
  const m = briefMessage;
  const read = getState().hasReadBrief;
  container.innerHTML = `
    <article class="l1-brief">
      <header class="l1-brief__head">
        <div>
          <p class="l1-brief__from">من: <strong>${m.from}</strong></p>
          <p class="l1-brief__role">${m.role}</p>
        </div>
        ${read ? `<span class="l1-pill l1-pill--success">تمت القراءة</span>` : `<span class="l1-pill l1-pill--warn">جديد</span>`}
      </header>
      <h3 class="l1-brief__subject">${m.subject}</h3>
      <p class="l1-brief__line">${m.greeting}</p>
      ${m.body.map((p) => `<p class="l1-brief__line">${p}</p>`).join("")}
      <p class="l1-brief__sign">${m.signature}</p>
      <ul class="l1-brief__facts">
        <li><strong>الوقت:</strong> 10 دقائق حتى الاجتماع</li>
        <li><strong>الفرعان:</strong> الكورنيش · الميدان</li>
        <li><strong>المطلوب:</strong> توصية واحدة + دليلان على الأقل</li>
      </ul>
    </article>
  `;
}
