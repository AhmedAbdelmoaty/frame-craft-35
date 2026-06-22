import { getState, setMissionFileOpen } from "../../state/store";
import { openEvidencePreview } from "../EvidencePreview";

type SavedFile = {
  id: "sales-summary" | "rep-performance" | "hr-policy";
  title: string;
  source: string;
  meta: string;
};

function savedFiles(): SavedFile[] {
  const s = getState();
  const files: SavedFile[] = [];

  if (s.hasSavedSalesSummary) {
    files.push({
      id: "sales-summary",
      title: "ملخص المبيعات الرسمي",
      source: "مكتب المبيعات",
      meta: "إجمالي المبيعات ومتوسط الأداء المعلن",
    });
  }

  if (s.hasReceivedIndividualPerformanceFile) {
    files.push({
      id: "rep-performance",
      title: "ملف الأداء الفردي",
      source: "مكتب المبيعات",
      meta: "سجل أداء المندوبين في الفرعين",
    });
  }

  if (s.hasSavedHRPolicy) {
    files.push({
      id: "hr-policy",
      title: "سياسة الأداء",
      source: "مكتب HR",
      meta: "وثيقة حد الأداء المقبول",
    });
  }

  return files;
}

export function renderFilesTab(container: HTMLElement) {
  const files = savedFiles();

  if (!files.length) {
    container.innerHTML = `
      <div class="l1-placeholder l1-placeholder--dossier">
        <p class="l1-placeholder__eyebrow">لا توجد ملفات محفوظة</p>
        <h3>رف الملفات فارغ</h3>
        <p class="l1-placeholder__hint">استلم ملفًا من إحدى الغرف ليظهر هنا.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="l1-tab l1-files-tab">
      <h3 class="l1-tab__title">الملفات (${files.length})</h3>
      <div class="l1-file-list">
        ${files.map((file) => `
          <button class="l1-file-item" type="button" data-file="${file.id}">
            <span class="l1-file-item__icon" aria-hidden="true">▣</span>
            <span class="l1-file-item__body">
              <strong>${file.title}</strong>
              <small>${file.source} · ${file.meta}</small>
            </span>
          </button>
        `).join("")}
      </div>
    </div>`;

  container.querySelectorAll<HTMLButtonElement>("[data-file]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.file as SavedFile["id"];
      setMissionFileOpen(false);
      window.setTimeout(() => {
        openEvidencePreview({
          kind,
          alreadyCollected: true,
          onCollect: () => undefined,
        });
      }, 0);
    });
  });
}
