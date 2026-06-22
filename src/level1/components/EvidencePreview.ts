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
    subtitle: "سجل أداء المندوبين في الفرعين",
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
        <p>احفظ المستند إذا أردت الرجوع إليه داخل ملف المهمة.</p>
        <button class="l1-artifact__collect" type="button" data-collect ${options.alreadyCollected ? "disabled" : ""}>
          <span aria-hidden="true">${options.alreadyCollected ? "✓" : "↗"}</span>
          <span>${options.alreadyCollected ? "محفوظ في الدفتر" : meta.collectLabel}</span>
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(root);
  document.body.classList.add("l1-transient-overlay-open");

  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);

  const close = () => {
    root.classList.add("l1-artifact--closing");
    window.setTimeout(() => {
      root.remove();
      document.body.classList.remove("l1-transient-overlay-open");
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
    }, 180);
  };

  root.querySelectorAll<HTMLElement>("[data-close]").forEach((el) => el.addEventListener("click", close));
  const collectBtn = root.querySelector<HTMLButtonElement>("[data-collect]");
  collectBtn?.addEventListener("click", () => {
    if (collectBtn.disabled) return;
    options.onCollect();
    collectBtn.disabled = true;
    collectBtn.innerHTML = `<span aria-hidden="true">✓</span><span>محفوظ في الدفتر</span>`;
    showCollectToast("تم حفظ الملف");
    playCollectFeedback(meta.icon, collectBtn);
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
        <thead><tr><th>الفرع</th><th>إجمالي المبيعات</th><th>متوسط الأداء المعلن</th></tr></thead>
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
      <p>سجل صادر من قسم المبيعات.</p>
    </div>
  `;
}

function renderRepPerformance() {
  return `
    <div class="l1-artifact-sheet">
      <div class="l1-artifact-sheet__stamp">تفصيلي</div>
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
      <p>سجل تفصيلي مرفق بملف المبيعات.</p>
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
        <div><dt>نطاق التطبيق</dt><dd>جميع المندوبين المسجلين في الملف</dd></div>
        <div><dt>ملاحظة تنفيذية</dt><dd>تطبق السياسة دون استثناءات مسجلة.</dd></div>
      </dl>
      <p>وثيقة داخلية صادرة من HR.</p>
    </div>
  `;
}

function showCollectToast(message: string) {
  const toast = document.createElement("div");
  toast.className = "l1-toast";
  toast.dir = "rtl";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("l1-toast--show"));
  window.setTimeout(() => {
    toast.classList.remove("l1-toast--show");
    window.setTimeout(() => toast.remove(), 320);
  }, 1700);
}

function playCollectFeedback(icon: string, sourceEl?: HTMLElement) {
  const fly = document.createElement("div");
  fly.className = "l1-artifact-fly";
  fly.textContent = icon;

  const sourceRect = sourceEl?.getBoundingClientRect();
  const notebook = document.querySelector<HTMLElement>(".l1-topbar__mission-btn");
  const targetRect = notebook?.getBoundingClientRect();
  const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth - 64;
  const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight * 0.56;
  const endX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 48;
  const endY = targetRect ? targetRect.top + targetRect.height / 2 : 72;

  fly.style.left = `${startX}px`;
  fly.style.top = `${startY}px`;
  fly.style.setProperty("--l1-fly-dx", `${endX - startX}px`);
  fly.style.setProperty("--l1-fly-dy", `${endY - startY}px`);
  document.body.appendChild(fly);
  window.setTimeout(() => fly.remove(), 900);

  notebook?.classList.remove("l1-topbar__mission-btn--pulse");
  void notebook?.offsetWidth;
  notebook?.classList.add("l1-topbar__mission-btn--pulse");
  window.setTimeout(() => notebook?.classList.remove("l1-topbar__mission-btn--pulse"), 700);
  notebook?.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.18) rotate(-3deg)" },
      { transform: "scale(1)" },
    ],
    { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
  );
}
