import { PERFORMANCE_THRESHOLD } from "../../data/branches";
import { getState } from "../../state/store";

export function renderPolicyTab(container: HTMLElement) {
  const s = getState();
  if (!s.hasSavedHRPolicy) {
    container.innerHTML = `
      <div class="l1-placeholder">
        <p class="l1-placeholder__eyebrow">لم تُحفظ بعد</p>
        <h3>سياسة الأداء</h3>
        <p class="l1-placeholder__hint">زر مكتب الموارد البشرية، افحص ملف السياسة، ثم احفظه ليظهر هنا.</p>
      </div>`;
    return;
  }
  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">سياسة الأداء — ${PERFORMANCE_THRESHOLD}٪</h3>
      <div class="l1-folder l1-folder--mini">
        <p class="l1-folder__rule">
          المندوب يُعتبر محققًا للأداء المطلوب إذا بلغ
          <strong class="l1-folder__num">${PERFORMANCE_THRESHOLD}٪</strong>
          أو أكثر.
        </p>
        <ul class="l1-folder__list">
          <li>تُطبّق السياسة على جميع المندوبين دون استثناء.</li>
          <li>الحكم يكون على مستوى المندوب الفرد، لا على المتوسط فقط.</li>
        </ul>
      </div>
    </div>`;
}
