import { getState, setNotes } from "../../state/store";

export function renderNotesTab(container: HTMLElement) {
  container.innerHTML = `
    <div class="l1-notes">
      <label class="l1-notes__label" for="l1-notes-area">ملاحظاتي الشخصية</label>
      <textarea
        id="l1-notes-area"
        class="l1-notes__area"
        placeholder="اكتب ملاحظاتك أثناء التحقيق… (أرقام، أسماء، استنتاجات أولية)"
        dir="rtl"
      >${escapeHtml(getState().notesText)}</textarea>
      <p class="l1-notes__hint">تُحفظ تلقائيًا خلال هذه الجلسة فقط.</p>
    </div>
  `;
  const ta = container.querySelector<HTMLTextAreaElement>("#l1-notes-area")!;
  ta.addEventListener("input", () => setNotes(ta.value));
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
