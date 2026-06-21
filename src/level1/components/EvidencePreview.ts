import { BRANCHES, PERFORMANCE_THRESHOLD } from "../data/branches";

type EvidencePreviewKind = "sales-summary" | "rep-performance" | "hr-policy";

interface EvidencePreviewOptions {
  kind: EvidencePreviewKind;
  alreadyCollected: boolean;
  onCollect: () => void;
}

const PREVIEW_META: Record<EvidencePreviewKind, { icon: string; title: string; subtitle: string; collectLabel: string }> = {
  "sales-summary": {
    icon: "▥",
    title: "ملخص المبيعات الرسمي",
    subtitle: "إجمالي المبيعات ومتوسط الأداء المعلن للفرعين",
    collectLabel: "احفظ الملخص في الدفتر",
  },
  "rep-performance": {
    icon: "▦",
    title: "ملف الأداء الفردي",
    subtitle: "أرقام خام لكل مندوب قبل التحليل",
    collectLabel: "احفظ الملف في الدفتر",
  },
  "hr-policy": {
    icon: "▣",
    title: "سياسة الأداء",
    subtitle: "وثيقة HR الرسمية لحد الأداء المقبول",
    collectLabel: "احفظ السياسة في الدفتر",
  },
};

export function openEvidencePreview(options: EvidencePreviewOptions) {
  const meta = PREVIEW_META[options.kind];
  const root = document.createElement("div");
  root.className = "l1-artifact";
  root.dir = "rtl";
  root.innerHTML = `
    <div class="l1-artifact__backdrop" data-close></div>
    <section class="l1-artifact__panel" role="dialog" aria-label="${meta.title}">
      <button class="l1-artifact__close" type="button" data-close aria-label="إغلاق">×</button>
      <header class="l1-artifact__header">
        <span class="l1-artifact__icon" aria-hidden="true">${meta.icon}</span>
        <div>
          <p>مستند قابل للحفظ</p>
          <h2>${meta.title}</h2>
          <small>${meta.subtitle}</small>
        </div>
      </header>
      <div class="l1-artifact__paper">
        ${renderPreviewBody(options.kind)}
      </div>
      <footer class="l1-artifact__footer">
        <p>المعاينة تعرض بيانات خام فقط. التفسير الحقيقي يتم داخل غرفة التحليل.</p>
        <button class="l1-artifact__collect" type="button" data-collect ${options.alreadyCollected ? "disabled" : ""}>
          <span aria-hidden="true">${options.alreadyCollected ? "✓" : "↗"}</span>
          <span>${options.alreadyCollected ? "محفوظ في الدفتر" : meta.collectLabel}</span>
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(root);

  const close = () => {
    root.classList.add("l1-artifact--closing");
    window.setTimeout(() => root.remove(), 180);
  };

  root.querySelectorAll<HTMLElement>("[data-close]").forEach((el) => el.addEventListener("click", close));
  const collectBtn = root.querySelector<HTMLButtonElement>("[data-collect]");
  collectBtn?.addEventListener("click", () => {
    if (collectBtn.disabled) return;
    options.onCollect();
    collectBtn.disabled = true;
    collectBtn.innerHTML = `<span aria-hidden="true">✓</span><span>محفوظ في الدفتر</span>`;
    playCollectFeedback(meta.icon);
    window.setTimeout(close, 520);
  });

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };
  window.addEventListener("keydown", onKey, { once: true });
}

function renderPreviewBody(kind: EvidencePreviewKind) {
  if (kind === "sales-summary") return renderSalesSummary();
  if (kind === "rep-performance") return renderRepPerformance();
  return renderHrPolicy();
}

function renderSalesSummary() {
  return `
    <div class="l1-artifact-sheet">
      <div class="l1-artifact-sheet__stamp">معتمد</div>
      <h3>لوحة الأداء الرسمية · الربع الحالي</h3>
      <table>
        <thead><tr><th>الفرع</th><th>إجمالي المبيعات</th><th>المتوسط المعلن</th></tr></thead>
        <tbody>
          ${Object.values(BRANCHES)
            .map(
              (branch) => `
                <tr>
                  <td>${branch.name}</td>
                  <td>${branch.totalSalesK}K</td>
                  <td>${branch.reportedAverage}%</td>
                </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <p>ملاحظة: هذه لوحة مختصرة من قسم المبيعات، وليست تحليلًا نهائيًا.</p>
    </div>
  `;
}

function renderRepPerformance() {
  return `
    <div class="l1-artifact-sheet">
      <div class="l1-artifact-sheet__stamp">خام</div>
      <h3>أداء المندوبين · عينة الفرعين</h3>
      <div class="l1-artifact__rep-grid">
        ${Object.values(BRANCHES)
          .map(
            (branch) => `
              <section>
                <h4>${branch.name}</h4>
                <table>
                  <thead><tr><th>مندوب</th><th>أداء</th></tr></thead>
                  <tbody>
                    ${branch.reps
                      .map(
                        (rep) => `
                          <tr>
                            <td>${rep.name}</td>
                            <td>${rep.performance}%</td>
                          </tr>`,
                      )
                      .join("")}
                  </tbody>
                </table>
              </section>`,
          )
          .join("")}
      </div>
      <p>الأرقام هنا خام. غرفة التحليل هي المكان المناسب لاكتشاف النمط.</p>
    </div>
  `;
}

function renderHrPolicy() {
  return `
    <div class="l1-artifact-sheet l1-artifact-sheet--policy">
      <div class="l1-artifact-sheet__stamp">HR</div>
      <h3>وثيقة سياسة المكافأة · الربع الحالي</h3>
      <dl>
        <div><dt>حد الأداء المقبول</dt><dd>${PERFORMANCE_THRESHOLD}% أو أكثر</dd></div>
        <div><dt>نطاق الحكم</dt><dd>كل مندوب على حدة</dd></div>
        <div><dt>ملاحظة تنفيذية</dt><dd>تطبق السياسة على جميع المندوبين دون استثناء.</dd></div>
      </dl>
      <p>السياسة لا تختار الفرع الفائز وحدها، لكنها تحدد معيار الحكم.</p>
    </div>
  `;
}

function playCollectFeedback(icon: string) {
  const fly = document.createElement("div");
  fly.className = "l1-artifact-fly";
  fly.textContent = icon;
  document.body.appendChild(fly);
  window.setTimeout(() => fly.remove(), 900);

  const notebook = document.querySelector<HTMLElement>(".l1-topbar__mission-btn");
  notebook?.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.18) rotate(-3deg)" },
      { transform: "scale(1)" },
    ],
    { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
  );
}
