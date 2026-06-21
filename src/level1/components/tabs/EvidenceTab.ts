import { getState } from "../../state/store";
import { availableEvidence, EVIDENCE_DEFS } from "../../logic/evaluate";

const ARTIFACT_LABEL = {
  report: "تقرير رسمي",
  policy: "سياسة داخلية",
  analysis: "استنتاج تحليلي",
} as const;

const ARTIFACT_ICON = {
  report: "▤",
  policy: "▣",
  analysis: "⌁",
} as const;

export function renderEvidenceTab(container: HTMLElement) {
  const s = getState();
  const ids = availableEvidence(s);

  if (ids.length === 0) {
    container.innerHTML = `
      <div class="l1-placeholder l1-placeholder--dossier">
        <p class="l1-placeholder__eyebrow">لم تُجمع أدلة بعد</p>
        <h3>حافظة الأدلة فارغة</h3>
        <p class="l1-placeholder__hint">استلم الملفات من المكاتب، ثم استخدم أدوات التحليل. كل فعل مهم سيترك ملفًا يمكن الرجوع إليه هنا.</p>
      </div>`;
    return;
  }

  const items = ids
    .map((id) => {
      const e = EVIDENCE_DEFS[id];
      return `
        <article class="l1-evidence-artifact l1-evidence-artifact--${e.artifact}">
          <div class="l1-evidence-artifact__icon" aria-hidden="true">${ARTIFACT_ICON[e.artifact]}</div>
          <div class="l1-evidence-artifact__body">
            <header class="l1-evidence-artifact__head">
              <span>${ARTIFACT_LABEL[e.artifact]}</span>
              <strong>${e.source}</strong>
            </header>
            <h4>${e.label}</h4>
            <p>${e.detail}</p>
            <footer>
              <span>محفوظ في دوسييه المهمة</span>
              <b>${e._strong ? "دليل قوي" : "سياق مساعد"}</b>
            </footer>
          </div>
        </article>`;
    })
    .join("");

  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">حافظة الأدلة (${ids.length})</h3>
      <p class="l1-tab__hint">كل ملف هنا جاء من فعل داخل اللعبة: استلام، فتح، أو تحليل. في غرفة القرار ستختار دليلين فقط.</p>
      <div class="l1-evidence-artifacts">${items}</div>
    </div>`;
}
