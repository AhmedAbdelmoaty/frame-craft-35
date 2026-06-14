import { BRANCHES } from "../../data/branches";
import { getState } from "../../state/store";

export function renderBranchesTab(container: HTMLElement) {
  const s = getState();
  if (!s.hasSavedSalesSummary) {
    container.innerHTML = `
      <div class="l1-placeholder">
        <p class="l1-placeholder__eyebrow">لم يُحفظ بعد</p>
        <h3>بطاقات الفروع</h3>
        <p class="l1-placeholder__hint">زر مكتب المبيعات، افحص لوحة الأداء، ثم احفظ الملخّص ليظهر هنا.</p>
      </div>`;
    return;
  }
  const cards = (["corniche", "midan"] as const)
    .map((bid) => {
      const b = BRANCHES[bid];
      return `
        <article class="l1-tabcard">
          <h4>${b.name}</h4>
          <p class="l1-tabcard__row"><span>إجمالي المبيعات</span><strong>${b.totalSalesK}K</strong></p>
          <p class="l1-tabcard__row"><span>متوسط الأداء (الرسمي)</span><strong>${b.reportedAverage}٪</strong></p>
          <p class="l1-tabcard__row"><span>عدد المندوبين</span><strong>${b.reps.length}</strong></p>
        </article>`;
    })
    .join("");
  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">بطاقات الفروع</h3>
      <p class="l1-tab__hint">الأرقام كما عُرضت على لوحة المبيعات الرسمية.</p>
      <div class="l1-tabcards">${cards}</div>
    </div>`;
}
