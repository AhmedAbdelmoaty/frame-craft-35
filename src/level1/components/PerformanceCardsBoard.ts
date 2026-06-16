import { BRANCHES, PERFORMANCE_THRESHOLD, type BranchId, type Rep } from "../data/branches";
import {
  countAboveOrEqual,
  fmt,
  max,
  mean,
  median,
  min,
  quartiles,
  range,
  standardDeviation,
} from "../logic/stats";
import {
  getState,
  markDistributionAnalyzed,
  openPerformanceCards,
  subscribe,
  toggleTool,
  type ToolId,
} from "../state/store";

type ViewMode = BranchId | "compare";

const TEAM_META: Record<BranchId, { team: string; tone: string; color: string; soft: string }> = {
  corniche: { team: "الفريق أ", tone: "فرع الكورنيش", color: "#2b78c5", soft: "rgba(43,120,197,0.14)" },
  midan: { team: "الفريق ب", tone: "فرع الميدان", color: "#d24d57", soft: "rgba(210,77,87,0.14)" },
};

const TOOL_META: Array<{ id: ToolId; icon: string; label: string }> = [
  { id: "mean", icon: "μ", label: "المتوسط" },
  { id: "median", icon: "M", label: "الوسيط" },
  { id: "range", icon: "↔", label: "المدى" },
  { id: "sd", icon: "σ", label: "الانحراف المعياري" },
  { id: "iqr", icon: "▣", label: "IQR" },
  { id: "threshold", icon: "85", label: "حد 85%" },
];

const X_MIN = 0;
const X_MAX = 150;
const BIN_SIZE = 10;
const SVG_W = 640;
const SVG_H = 318;
const PLOT = { x: 52, y: 28, w: 540, h: 214 };

export function createPerformanceCardsBoard(parent: HTMLElement) {
  openPerformanceCards();

  let viewMode: ViewMode = "compare";
  let rawOpen = true;

  const root = document.createElement("div");
  root.className = "l1-workbench";
  root.innerHTML = `
    <header class="l1-workbench__head">
      <div>
        <p class="l1-workbench__eyebrow">طاولة التحليل</p>
        <h3>توزيع أداء الفريقين</h3>
      </div>
      <div class="l1-workbench__modes" role="group" aria-label="اختيار عرض الفريق">
        ${modeButton("corniche", "الفريق أ")}
        ${modeButton("midan", "الفريق ب")}
        ${modeButton("compare", "مقارنة")}
      </div>
    </header>

    <section class="l1-workbench__surface">
      <aside class="l1-workbench__tools" aria-label="أدوات التحليل">
        ${TOOL_META.map((tool) => toolButton(tool)).join("")}
      </aside>
      <div class="l1-workbench__charts" data-charts></div>
    </section>

    <section class="l1-workbench__raw">
      <button class="l1-workbench__raw-toggle" type="button" data-raw-toggle>
        <span>ملف الأداء الخام</span>
        <b data-raw-state>إخفاء</b>
      </button>
      <div class="l1-workbench__raw-grid" data-raw></div>
    </section>
  `;
  parent.appendChild(root);

  const chartsHost = root.querySelector<HTMLElement>("[data-charts]")!;
  const rawHost = root.querySelector<HTMLElement>("[data-raw]")!;
  const rawState = root.querySelector<HTMLElement>("[data-raw-state]")!;

  root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      viewMode = btn.dataset.mode as ViewMode;
      render();
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tool as ToolId;
      toggleTool(id);
      if (id === "median" || id === "range" || id === "sd" || id === "iqr") {
        markDistributionAnalyzed();
      }
      btn.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.95)" }, { transform: "scale(1)" }],
        { duration: 160 },
      );
    });
  });

  root.querySelector<HTMLButtonElement>("[data-raw-toggle]")!.addEventListener("click", () => {
    rawOpen = !rawOpen;
    render();
  });

  const render = () => {
    const s = getState();
    root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.mode === viewMode);
    });
    root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((btn) => {
      const id = btn.dataset.tool as ToolId;
      btn.classList.toggle("is-active", s.toolToggles[id]);
    });

    const branches: BranchId[] = viewMode === "compare" ? ["corniche", "midan"] : [viewMode];
    const yMax = Math.max(...branches.flatMap((bid) => histogram(BRANCHES[bid].reps).map((b) => b.count)), 1);
    chartsHost.classList.toggle("is-compare", viewMode === "compare");
    chartsHost.innerHTML = branches.map((bid) => chartPanel(bid, viewMode === "compare", yMax)).join("");

    rawHost.hidden = !rawOpen;
    rawState.textContent = rawOpen ? "إخفاء" : "عرض";
    rawHost.innerHTML = branches.map((bid) => rawCards(bid)).join("");
  };

  const unsub = subscribe(render);
  render();

  return {
    root,
    destroy: () => {
      unsub();
      root.remove();
    },
  };
}

function modeButton(mode: ViewMode, label: string) {
  return `<button class="l1-workbench__mode" type="button" data-mode="${mode}">${label}</button>`;
}

function toolButton(tool: { id: ToolId; icon: string; label: string }) {
  return `
    <button class="l1-workbench__tool" type="button" data-tool="${tool.id}">
      <span class="l1-workbench__tool-icon" aria-hidden="true">${tool.icon}</span>
      <span>${tool.label}</span>
    </button>
  `;
}

function chartPanel(bid: BranchId, compact: boolean, yMax: number) {
  const branch = BRANCHES[bid];
  const meta = TEAM_META[bid];
  return `
    <article class="l1-hist-card l1-hist-card--${bid}">
      <header class="l1-hist-card__head">
        <div>
          <strong>${meta.team}</strong>
          <span>${meta.tone}</span>
        </div>
        <b>${branch.reps.length} أفراد</b>
      </header>
      ${histogramSvg(bid, compact, yMax)}
      ${measurementTray(bid)}
    </article>
  `;
}

function histogramSvg(bid: BranchId, compact: boolean, yMax: number) {
  const s = getState();
  const meta = TEAM_META[bid];
  const values = BRANCHES[bid].reps.map((r) => r.performance);
  const bins = histogram(BRANCHES[bid].reps);
  const avg = mean(values);
  const med = median(values);
  const lo = min(values);
  const hi = max(values);
  const sd = standardDeviation(values);
  const qs = quartiles(values);
  const bandVisible = s.toolToggles.sd && !compact;

  const x = (value: number) => PLOT.x + ((value - X_MIN) / (X_MAX - X_MIN)) * PLOT.w;
  const y = (count: number) => PLOT.y + PLOT.h - (count / Math.max(yMax, 1)) * PLOT.h;
  const barW = Math.max(8, (BIN_SIZE / (X_MAX - X_MIN)) * PLOT.w - 4);

  const grid = [0, 1, 2, 3, 4].map((i) => {
    const gy = PLOT.y + (PLOT.h / 4) * i;
    return `<line class="l1-hist__grid" x1="${PLOT.x}" y1="${gy}" x2="${PLOT.x + PLOT.w}" y2="${gy}" />`;
  }).join("");

  const ticks = [0, 30, 60, 90, 120, 150].map((tick) => `
    <g class="l1-hist__tick">
      <line x1="${x(tick)}" y1="${PLOT.y + PLOT.h}" x2="${x(tick)}" y2="${PLOT.y + PLOT.h + 6}" />
      <text x="${x(tick)}" y="${PLOT.y + PLOT.h + 23}">${tick}</text>
    </g>
  `).join("");

  const bars = bins.map((bin) => {
    const bh = PLOT.y + PLOT.h - y(bin.count);
    return `
      <rect class="l1-hist__bar" x="${x(bin.start) + 2}" y="${y(bin.count)}" width="${barW}" height="${bh}" rx="4"
        style="--bar-color:${meta.color};--bar-soft:${meta.soft}" />
    `;
  }).join("");

  return `
    <svg class="l1-hist" viewBox="0 0 ${SVG_W} ${SVG_H}" role="img" aria-label="Histogram ${meta.team}">
      <rect class="l1-hist__plot" x="${PLOT.x}" y="${PLOT.y}" width="${PLOT.w}" height="${PLOT.h}" rx="10" />
      ${grid}
      ${bandVisible ? sdBand(x(Math.max(X_MIN, avg - sd)), x(Math.min(X_MAX, avg + sd))) : ""}
      ${s.toolToggles.iqr ? iqrBand(x(qs.q1), x(qs.q3), qs.iqr) : ""}
      ${bars}
      ${s.toolToggles.range ? rangeBracket(x(lo), x(hi), range(values)) : ""}
      ${s.toolToggles.threshold ? verticalLine(x(PERFORMANCE_THRESHOLD), "threshold", "85%") : ""}
      ${s.toolToggles.mean ? verticalLine(x(avg), "mean", `المتوسط: ${fmt(avg)}`) : ""}
      ${s.toolToggles.median ? verticalLine(x(med), "median", `الوسيط: ${fmt(med)}`) : ""}
      <line class="l1-hist__axis" x1="${PLOT.x}" y1="${PLOT.y + PLOT.h}" x2="${PLOT.x + PLOT.w}" y2="${PLOT.y + PLOT.h}" />
      <line class="l1-hist__axis" x1="${PLOT.x}" y1="${PLOT.y}" x2="${PLOT.x}" y2="${PLOT.y + PLOT.h}" />
      ${ticks}
      <text class="l1-hist__axis-label" x="${PLOT.x + PLOT.w}" y="${SVG_H - 10}">الأداء %</text>
      <text class="l1-hist__axis-label" x="${PLOT.x}" y="18">عدد الأفراد</text>
    </svg>
  `;
}

function verticalLine(x: number, kind: "mean" | "median" | "threshold", label: string) {
  const yLabel = kind === "median" ? PLOT.y + 34 : kind === "mean" ? PLOT.y + 16 : PLOT.y + 52;
  return `
    <g class="l1-hist__mark l1-hist__mark--${kind}">
      <line x1="${x}" y1="${PLOT.y}" x2="${x}" y2="${PLOT.y + PLOT.h}" />
      <text x="${x}" y="${yLabel}">${label}</text>
    </g>
  `;
}

function rangeBracket(x1: number, x2: number, value: number) {
  const y = PLOT.y + 8;
  return `
    <g class="l1-hist__range">
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
      <line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 9}" />
      <line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 9}" />
      <text x="${(x1 + x2) / 2}" y="${y - 8}">المدى: ${fmt(value)}</text>
    </g>
  `;
}

function iqrBand(x1: number, x2: number, value: number) {
  const y = PLOT.y + PLOT.h + 34;
  return `
    <g class="l1-hist__iqr">
      <rect x="${x1}" y="${PLOT.y + PLOT.h - 30}" width="${Math.max(2, x2 - x1)}" height="26" rx="6" />
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
      <line x1="${x1}" y1="${y - 8}" x2="${x1}" y2="${y + 8}" />
      <line x1="${x2}" y1="${y - 8}" x2="${x2}" y2="${y + 8}" />
      <text x="${(x1 + x2) / 2}" y="${y + 24}">IQR: ${fmt(value)}</text>
    </g>
  `;
}

function sdBand(x1: number, x2: number) {
  return `<rect class="l1-hist__sd-band" x="${x1}" y="${PLOT.y}" width="${Math.max(2, x2 - x1)}" height="${PLOT.h}" rx="8" />`;
}

function measurementTray(bid: BranchId) {
  const values = BRANCHES[bid].reps.map((r) => r.performance);
  const qs = quartiles(values);
  const above = countAboveOrEqual(values, PERFORMANCE_THRESHOLD);
  const items = [
    ["Mean", fmt(mean(values))],
    ["Median", fmt(median(values))],
    ["Range", fmt(range(values))],
    ["SD", fmt(standardDeviation(values))],
    ["IQR", fmt(qs.iqr)],
    ["فوق 85%", `${Math.round((above / values.length) * 100)}%`],
  ];
  return `
    <div class="l1-measurement-tray">
      ${items.map(([label, value]) => `
        <div class="l1-measurement">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function rawCards(bid: BranchId) {
  const meta = TEAM_META[bid];
  return `
    <div class="l1-raw-team">
      <div class="l1-raw-team__title"><strong>${meta.team}</strong><span>${meta.tone}</span></div>
      <div class="l1-raw-team__cards">
        ${BRANCHES[bid].reps.map((rep) => rawCard(rep, meta.color)).join("")}
      </div>
    </div>
  `;
}

function rawCard(rep: Rep, color: string) {
  return `
    <article class="l1-raw-card" style="--team-color:${color}">
      <strong>${rep.performance}%</strong>
      <span>${rep.name}</span>
    </article>
  `;
}

function histogram(reps: Rep[]) {
  const bins = Array.from({ length: (X_MAX - X_MIN) / BIN_SIZE }, (_, i) => ({
    start: X_MIN + i * BIN_SIZE,
    end: X_MIN + (i + 1) * BIN_SIZE,
    count: 0,
  }));
  reps.forEach((rep) => {
    const index = Math.min(bins.length - 1, Math.max(0, Math.floor((rep.performance - X_MIN) / BIN_SIZE)));
    bins[index].count += 1;
  });
  return bins;
}
