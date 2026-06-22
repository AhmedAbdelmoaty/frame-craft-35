import { getState } from "../../state/store";
import { availableEvidence, EVIDENCE_DEFS } from "../../logic/evaluate";

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
        <p class="l1-placeholder__eyebrow">لا توجد أدلة بعد</p>
        <h3>قائمة الأدلة فارغة</h3>
        <p class="l1-placeholder__hint">ستظهر هنا نقاط يمكن استخدامها في ملف التوصية.</p>
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
              <span>${e.source}</span>
            </header>
            <h4>${e.label}</h4>
            <p>${e.detail}</p>
          </div>
        </article>`;
    })
    .join("");

  container.innerHTML = `
    <div class="l1-tab">
      <h3 class="l1-tab__title">الأدلة (${ids.length})</h3>
      <p class="l1-tab__hint">اختر من هذه النقاط ما تريد الاعتماد عليه في غرفة القرار.</p>
      <div class="l1-evidence-artifacts">${items}</div>
    </div>`;
}
