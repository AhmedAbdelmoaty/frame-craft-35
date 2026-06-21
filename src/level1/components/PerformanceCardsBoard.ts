import { PERFORMANCE_THRESHOLD, type BranchId, type Rep } from "../data/branches";
import {
  formatMetric,
  getBranchAnalysis,
  getHistogramBins,
  SHARED_DOMAIN,
  type BranchAnalysis,
  type HistogramBin,
  type ViewMode,
} from "../logic/analysisModel";
import {
  getState,
  markDistributionAnalyzed,
  openPerformanceCards,
  subscribe,
  toggleTool,
  type ToolId,
} from "../state/store";

const TOOL_ORDER: ToolId[] = ["mean", "median", "range", "sd", "iqr", "threshold"];
const SVG_W = 980;
const SVG_H = 450;
const PLOT = { x: 80, y: 54, w: 820, h: 265 };

const TOOL_META: Record<ToolId, { icon: string; label: string; short: string }> = {
  mean: { icon: "µ", label: "المتوسط", short: "Mean" },
  median: { icon: "M", label: "الوسيط", short: "Median" },
  range: { icon: "↔", label: "المدى", short: "Range" },
  sd: { icon: "σ", label: "الانحراف", short: "SD" },
  iqr: { icon: "▭", label: "IQR", short: "IQR" },
  threshold: { icon: "85", label: "حد 85%", short: "≥85%" },
};

export function createPerformanceCardsBoard(parent: HTMLElement) {
  openPerformanceCards();

  let viewMode: ViewMode = "midan";
  let hoverRepId: string | null = null;

  const root = document.createElement("div");
  root.className = "l1-analysis";
  root.dir = "rtl";
  root.innerHTML = `
    <header class="l1-analysis__top">
      <button class="l1-analysis__file-btn" type="button" aria-label="ملف المهمة">
        <span>ملف المهمة</span>
        <b>▣</b>
      </button>
      <div class="l1-analysis__title">
        <h3>طاولة التحليل</h3>
        <span>افحص توزيع الأداء قبل القرار</span>
      </div>
      <div class="l1-analysis__switcher" role="group" aria-label="اختيار الفريق">
        ${modeButton("corniche", "الفريق أ")}
        ${modeButton("midan", "الفريق ب")}
      </div>
    </header>

    <div class="l1-analysis__body">
      <aside class="l1-analysis__raw" aria-label="البيانات الخام">
        <header class="l1-analysis__raw-head">
          <span>البيانات الخام</span>
          <b data-card-count></b>
        </header>
        <div class="l1-analysis__raw-list" data-raw></div>
      </aside>

      <main class="l1-analysis__stage">
        <header class="l1-analysis__stage-head">
          <div>
            <span data-branch-name></span>
            <h4 data-stage-title></h4>
          </div>
          <b>النطاق 0-150</b>
        </header>
        <div class="l1-analysis__chart-wrap" data-chart></div>
        <footer class="l1-analysis__dock" data-dock></footer>
      </main>

      <aside class="l1-analysis__tools" aria-label="أدوات التحليل">
        <span class="l1-analysis__tools-title">الأدوات</span>
        ${TOOL_ORDER.map((id) => toolButton(id)).join("")}
      </aside>
    </div>
  `;
  parent.appendChild(root);

  const tooltip = document.createElement("div");
  tooltip.className = "l1-analysis-tip";
  tooltip.hidden = true;
  root.appendChild(tooltip);

  const chartHost = root.querySelector<HTMLElement>("[data-chart]")!;
  const rawHost = root.querySelector<HTMLElement>("[data-raw]")!;
  const dockHost = root.querySelector<HTMLElement>("[data-dock]")!;
  const stageTitle = root.querySelector<HTMLElement>("[data-stage-title]")!;
  const branchName = root.querySelector<HTMLElement>("[data-branch-name]")!;
  const cardCount = root.querySelector<HTMLElement>("[data-card-count]")!;

  root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      viewMode = button.dataset.mode as ViewMode;
      hoverRepId = null;
      render();
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.tool as ToolId;
      toggleTool(id);
      if (id !== "mean") markDistributionAnalyzed();
      button.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(1px) scale(0.96)" },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 150 },
      );
    });
  });

  const setHover = (id: string | null) => {
    if (hoverRepId === id) return;
    hoverRepId = id;
    root.querySelectorAll("[data-rep-id]").forEach((el) => {
      el.classList.toggle("is-hovered", !!id && (el as HTMLElement).dataset.repId === id);
    });
  };

  const moveTooltip = (event: MouseEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>("[data-tip]");
    if (!target) {
      tooltip.hidden = true;
      return;
    }
    const rect = root.getBoundingClientRect();
    tooltip.textContent = target.dataset.tip || "";
    tooltip.style.left = `${event.clientX - rect.left + 12}px`;
    tooltip.style.top = `${event.clientY - rect.top + 12}px`;
    tooltip.hidden = false;
  };

  root.addEventListener("mousemove", moveTooltip);
  root.addEventListener("mouseleave", () => {
    tooltip.hidden = true;
    setHover(null);
  });
  root.addEventListener("mouseover", (event) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>("[data-rep-id]");
    if (target) setHover(target.dataset.repId || null);
  });
  root.addEventListener("mouseout", (event) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>("[data-rep-id]");
    if (target) setHover(null);
  });

  const render = () => {
    const state = getState();
    const analysis = getBranchAnalysis(viewMode);

    root.style.setProperty("--team", analysis.color);
    root.style.setProperty("--team-soft", analysis.softColor);
    root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === viewMode);
    });
    root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((button) => {
      const id = button.dataset.tool as ToolId;
      button.classList.toggle("is-active", state.toolToggles[id]);
    });

    stageTitle.textContent = `توزيع الأداء - ${analysis.label}`;
    branchName.textContent = analysis.branchName;
    cardCount.textContent = `${analysis.reps.length} بطاقات`;
    rawHost.innerHTML = rawCards(analysis);
    chartHost.innerHTML = chartSvg(analysis, state.toolToggles, hoverRepId);
    dockHost.innerHTML = metricDock(analysis, state.toolToggles);
    setHover(hoverRepId);
  };

  const unsub = subscribe(render);
  render();

  return {
    root,
    destroy: () => {
      unsub();
      root.removeEventListener("mousemove", moveTooltip);
      root.remove();
    },
  };
}

function modeButton(mode: ViewMode, label: string) {
  return `<button class="l1-analysis__mode" type="button" data-mode="${mode}">${label}</button>`;
}

function toolButton(id: ToolId) {
  const meta = TOOL_META[id];
  return `
    <button class="l1-analysis-tool" type="button" data-tool="${id}" title="${meta.label}">
      <span aria-hidden="true">${meta.icon}</span>
      <b>${meta.label}</b>
    </button>
  `;
}

function rawCards(analysis: BranchAnalysis) {
  return analysis.reps.map((rep) => `
    <article class="l1-analysis-card" data-rep-id="${rep.id}" data-tip="${escapeAttr(`${rep.name}: ${rep.performance}%`)}">
      <span>${rep.name}</span>
      <strong>${rep.performance}%</strong>
    </article>
  `).join("");
}

function chartSvg(analysis: BranchAnalysis, toggles: Record<ToolId, boolean>, hoverRepId: string | null) {
  const bins = getHistogramBins(analysis);
  const yMax = 10;
  const x = xScale();
  const y = (count: number) => PLOT.y + PLOT.h - (count / yMax) * PLOT.h;
  const barWidth = Math.max(3, (analysis.binSize / domainWidth()) * PLOT.w - 3);

  return `
    <svg class="l1-analysis-chart" viewBox="0 0 ${SVG_W} ${SVG_H}" role="img" aria-label="توزيع أداء ${analysis.label}">
      <defs>
        <linearGradient id="l1-bar-${analysis.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${analysis.color}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${analysis.color}" stop-opacity="0.6" />
        </linearGradient>
      </defs>
      <rect class="l1-analysis-chart__paper" x="18" y="16" width="${SVG_W - 36}" height="${SVG_H - 34}" rx="20" />
      <rect class="l1-analysis-chart__plot" x="${PLOT.x}" y="${PLOT.y}" width="${PLOT.w}" height="${PLOT.h}" rx="8" />
      ${gridLines()}
      ${toggles.sd ? sdBand(analysis, x) : ""}
      ${toggles.iqr ? iqrBand(analysis, x) : ""}
      ${bins.map((bin) => bar(bin, x, y, barWidth, analysis)).join("")}
      ${toggles.range ? rangeMark(analysis, x) : ""}
      ${toggles.threshold ? verticalMark(x(PERFORMANCE_THRESHOLD), "threshold", "حد 85%", "85%") : ""}
      ${toggles.mean ? verticalMark(x(analysis.metrics.mean), "mean", "المتوسط", formatMetric(analysis.metrics.mean)) : ""}
      ${toggles.median ? verticalMark(x(analysis.metrics.median), "median", "الوسيط", formatMetric(analysis.metrics.median)) : ""}
      ${analysis.reps.map((rep, index) => repRug(rep, index, x, hoverRepId)).join("")}
      ${axisTicks()}
      <line class="l1-analysis-chart__axis" x1="${PLOT.x}" y1="${PLOT.y + PLOT.h}" x2="${PLOT.x + PLOT.w}" y2="${PLOT.y + PLOT.h}" />
      <line class="l1-analysis-chart__axis" x1="${PLOT.x}" y1="${PLOT.y}" x2="${PLOT.x}" y2="${PLOT.y + PLOT.h}" />
      <text class="l1-analysis-chart__label" x="${PLOT.x + PLOT.w}" y="${SVG_H - 16}">الأداء %</text>
      <text class="l1-analysis-chart__label l1-analysis-chart__label--y" x="${PLOT.x}" y="37">عدد الأفراد</text>
    </svg>
  `;
}

function bar(
  bin: HistogramBin,
  x: (value: number) => number,
  y: (count: number) => number,
  barWidth: number,
  analysis: BranchAnalysis,
) {
  if (!bin.count) return "";
  const height = PLOT.y + PLOT.h - y(bin.count);
  const names = bin.reps.map((rep) => `${rep.name} ${rep.performance}%`).join("، ");
  return `
    <rect class="l1-analysis-chart__bar"
      x="${x(bin.start) + 1.5}"
      y="${y(bin.count)}"
      width="${barWidth}"
      height="${height}"
      rx="3"
      fill="url(#l1-bar-${analysis.id})"
      data-tip="${escapeAttr(`${bin.start}-${bin.end}: ${bin.count} أفراد | ${names}`)}" />
  `;
}

function repRug(rep: Rep, index: number, x: (value: number) => number, hoverRepId: string | null) {
  const lane = index % 2;
  const y = PLOT.y + PLOT.h + 18 + lane * 13;
  return `
    <line class="l1-analysis-chart__rug ${hoverRepId === rep.id ? "is-hovered" : ""}"
      x1="${x(rep.performance)}"
      y1="${y - 5}"
      x2="${x(rep.performance)}"
      y2="${y + 5}"
      data-rep-id="${rep.id}"
      data-tip="${escapeAttr(`${rep.name}: ${rep.performance}%`)}" />
  `;
}

function gridLines() {
  const horizontals = [0, 2, 4, 6, 8, 10].map((tick) => {
    const y = PLOT.y + PLOT.h - (tick / 10) * PLOT.h;
    return `
      <g>
        <line class="l1-analysis-chart__grid" x1="${PLOT.x}" y1="${y}" x2="${PLOT.x + PLOT.w}" y2="${y}" />
        <text class="l1-analysis-chart__ytick" x="${PLOT.x - 18}" y="${y + 4}">${tick}</text>
      </g>
    `;
  });
  const verticals = tickValues().map((tick) => {
    const x = xScale()(tick);
    return `<line class="l1-analysis-chart__grid is-vertical" x1="${x}" y1="${PLOT.y}" x2="${x}" y2="${PLOT.y + PLOT.h}" />`;
  });
  return [...horizontals, ...verticals].join("");
}

function axisTicks() {
  const x = xScale();
  return tickValues().map((tick) => `
    <g class="l1-analysis-chart__tick">
      <line x1="${x(tick)}" y1="${PLOT.y + PLOT.h}" x2="${x(tick)}" y2="${PLOT.y + PLOT.h + 8}" />
      <text x="${x(tick)}" y="${PLOT.y + PLOT.h + 30}">${tick}</text>
    </g>
  `).join("");
}

function verticalMark(x: number, kind: ToolId | "threshold", label: string, value: string) {
  const labelY = kind === "median" ? PLOT.y + 62 : kind === "mean" ? PLOT.y + 28 : PLOT.y + 96;
  return `
    <g class="l1-analysis-chart__mark l1-analysis-chart__mark--${kind}">
      <line x1="${x}" y1="${PLOT.y - 8}" x2="${x}" y2="${PLOT.y + PLOT.h + 8}" />
      <rect x="${x - 44}" y="${labelY - 24}" width="88" height="38" rx="9" />
      <text x="${x}" y="${labelY - 8}">${label}</text>
      <text x="${x}" y="${labelY + 8}">${value}</text>
    </g>
  `;
}

function rangeMark(analysis: BranchAnalysis, x: (value: number) => number) {
  const x1 = x(analysis.metrics.min);
  const x2 = x(analysis.metrics.max);
  const y = PLOT.y - 20;
  return `
    <g class="l1-analysis-chart__range">
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
      <line x1="${x1}" y1="${y - 8}" x2="${x1}" y2="${y + 10}" />
      <line x1="${x2}" y1="${y - 8}" x2="${x2}" y2="${y + 10}" />
      <text x="${(x1 + x2) / 2}" y="${y - 10}">المدى ${formatMetric(analysis.metrics.range)}</text>
    </g>
  `;
}

function sdBand(analysis: BranchAnalysis, x: (value: number) => number) {
  const start = clamp(x(analysis.metrics.mean - analysis.metrics.sd), PLOT.x, PLOT.x + PLOT.w);
  const end = clamp(x(analysis.metrics.mean + analysis.metrics.sd), PLOT.x, PLOT.x + PLOT.w);
  return `
    <g class="l1-analysis-chart__sd">
      <rect x="${start}" y="${PLOT.y}" width="${Math.max(3, end - start)}" height="${PLOT.h}" rx="10" />
    </g>
  `;
}

function iqrBand(analysis: BranchAnalysis, x: (value: number) => number) {
  const x1 = x(analysis.metrics.q1);
  const x2 = x(analysis.metrics.q3);
  return `
    <g class="l1-analysis-chart__iqr">
      <rect x="${x1}" y="${PLOT.y + 14}" width="${Math.max(3, x2 - x1)}" height="${PLOT.h - 28}" rx="9" />
    </g>
  `;
}

function metricDock(analysis: BranchAnalysis, toggles: Record<ToolId, boolean>) {
  return TOOL_ORDER.map((id) => {
    const meta = TOOL_META[id];
    const active = toggles[id];
    return `
      <article class="l1-analysis-metric ${active ? "is-active" : ""}">
        <span>${meta.short}</span>
        <strong>${active ? singleToolValue(id, analysis) : "—"}</strong>
        <small>${meta.label}</small>
      </article>
    `;
  }).join("");
}

function singleToolValue(id: ToolId, analysis: BranchAnalysis) {
  switch (id) {
    case "mean":
      return formatMetric(analysis.metrics.mean);
    case "median":
      return formatMetric(analysis.metrics.median);
    case "range":
      return formatMetric(analysis.metrics.range);
    case "sd":
      return formatMetric(analysis.metrics.sd);
    case "iqr":
      return formatMetric(analysis.metrics.iqr);
    case "threshold":
      return `${analysis.metrics.thresholdPercent}%`;
  }
}

function tickValues() {
  return [0, 30, 60, 90, 120, 150];
}

function xScale() {
  const [domainMin] = SHARED_DOMAIN;
  return (value: number) => PLOT.x + ((value - domainMin) / domainWidth()) * PLOT.w;
}

function domainWidth() {
  return SHARED_DOMAIN[1] - SHARED_DOMAIN[0];
}

function clamp(value: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value));
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
