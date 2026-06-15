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
        <p class="l1-placeholder__hint">استلم ملفات المكاتب واستخدم أدوات التحليل في مكتب المحلل — كل خطوة تضيف معلومة هنا.</p>
      </div>`;
    return;
  }
  const items = ids
    .map((id) => {
      const e = EVIDENCE_DEFS[id];
      return `
        <article class="l1-tabcard">
          <div class="l1-tabcard__head">
            <h4>${e.label}</h4>
          </div>
          <p class="l1-tabcard__row"><span>التفاصيل</span><strong>${e.detail}</strong></p>
        </article>`;
    })
    .join("");
  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">الأدلة المُجمَّعة (${ids.length})</h3>
      <p class="l1-tab__hint">في غرفة القرار ستختار دليلين بالضبط لدعم توصيتك.</p>
      <div class="l1-tabcards">${items}</div>
    </div>`;
}
