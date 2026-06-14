import { getState } from "../../state/store";
import { availableEvidence, EVIDENCE_DEFS } from "../../logic/evaluate";

export function renderEvidenceTab(container: HTMLElement) {
  const s = getState();
  const ids = availableEvidence(s);
  if (ids.length === 0) {
    container.innerHTML = `
      <div class="l1-placeholder">
        <p class="l1-placeholder__eyebrow">لم تُجمَع أدلة بعد</p>
        <h3>الأدلة المُجمَّعة</h3>
        <p class="l1-placeholder__hint">استخدم الأدوات في مكتب المحلل واحفظ نتائج المكاتب — كل خطوة تضيف دليلًا هنا.</p>
      </div>`;
    return;
  }
  const items = ids
    .map((id) => {
      const e = EVIDENCE_DEFS[id];
      const tag =
        e.strength === "strong"
          ? `<span class="l1-pill l1-pill--success">دليل قوي</span>`
          : `<span class="l1-pill l1-pill--warn">دليل سطحي</span>`;
      return `
        <article class="l1-tabcard">
          <div class="l1-tabcard__head">
            <h4>${e.label}</h4>
            ${tag}
          </div>
          <p class="l1-tabcard__row"><span>التفاصيل</span><strong>${e.detail}</strong></p>
        </article>`;
    })
    .join("");
  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">الأدلة المُجمَّعة (${ids.length})</h3>
      <p class="l1-tab__hint">عند الاجتماع ستختار دليلين بالضبط لدعم توصيتك.</p>
      <div class="l1-tabcards">${items}</div>
    </div>`;
}
