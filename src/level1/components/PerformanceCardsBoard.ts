import { BRANCHES, PERFORMANCE_THRESHOLD, type BranchId, type Rep } from "../data/branches";
import { countBelow, fmt, max, mean, median, min, range } from "../logic/stats";
import {
  getState,
  markSorted,
  openPerformanceCards,
  subscribe,
  toggleTool,
  type ToolId,
} from "../state/store";

interface BoardState {
  // current visual order of card IDs per branch
  order: Record<BranchId, string[]>;
  sorted: Record<BranchId, boolean>;
}

const branchOrderInitial = (): Record<BranchId, string[]> => ({
  corniche: BRANCHES.corniche.reps.map((r) => r.id),
  midan: BRANCHES.midan.reps.map((r) => r.id),
});

export function createPerformanceCardsBoard(parent: HTMLElement) {
  openPerformanceCards();

  const local: BoardState = {
    order: branchOrderInitial(),
    sorted: { corniche: false, midan: false },
  };

  const root = document.createElement("div");
  root.className = "l1-cards";
  root.innerHTML = `
    <header class="l1-cards__head">
      <h3>طاولة التحليل — بطاقات أداء المندوبين</h3>
      <p>راجع البطاقات بنفسك، رتّبها، واستخدم الأدوات على اليسار للكشف عن نمط الأداء الحقيقي.</p>
    </header>

    <div class="l1-cards__layout">
      <aside class="l1-tools" aria-label="أدوات التحليل">
        ${toolButton("mean", "📏", "المتوسط", "أظهر متوسط أداء كل فرع.")}
        ${toolButton("threshold", "🚩", "خط الحدّ الأدنى ٨٥٪", "ارسم الخط واكشف من تحته.")}
        ${toolButton("median", "🎯", "الوسيط", "أبرز قيمة منتصف الصف بعد الترتيب.")}
        ${toolButton("stability", "📊", "استقرار الأداء", "قارن المدى بين الأدنى والأعلى.")}
      </aside>

      <div class="l1-cards__rows" data-rows></div>
    </div>

    <footer class="l1-cards__foot">
      <button class="l1-btn l1-btn--meeting" type="button" data-meeting>
        <span aria-hidden="true">🤝</span>
        <span>اذهب إلى اجتماع الاعتماد</span>
      </button>
    </footer>
  `;
  parent.appendChild(root);

  const rowsHost = root.querySelector<HTMLElement>("[data-rows]")!;
  (Object.keys(BRANCHES) as BranchId[]).forEach((bid) => rowsHost.appendChild(buildRow(bid, local)));

  // Tool buttons
  root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tool as ToolId;
      toggleTool(id);
      btn.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.94)" }, { transform: "scale(1)" }],
        { duration: 180 },
      );
    });
  });

  const meetingBtn = root.querySelector<HTMLButtonElement>("[data-meeting]")!;
  meetingBtn.disabled = true;
  meetingBtn.setAttribute("aria-disabled", "true");

  const renderAll = () => {
    const s = getState();
    // Update tool button active states
    root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((btn) => {
      const id = btn.dataset.tool as ToolId;
      btn.classList.toggle("l1-tool--active", s.toolToggles[id]);
    });
    // Re-decorate rows (mean pill, threshold line, median highlight, stability bar)
    (Object.keys(BRANCHES) as BranchId[]).forEach((bid) => decorateRow(bid, local, root));
  };

  const unsub = subscribe(renderAll);
  renderAll();

  return {
    root,
    destroy: () => {
      unsub();
      root.remove();
    },
  };
}

// ---------- Internals ----------

function toolButton(id: ToolId, icon: string, label: string, hint: string) {
  return `
    <button class="l1-tool" type="button" data-tool="${id}" title="${hint}">
      <span class="l1-tool__icon" aria-hidden="true">${icon}</span>
      <span class="l1-tool__label">${label}</span>
    </button>
  `;
}

function buildRow(bid: BranchId, local: BoardState): HTMLElement {
  const branch = BRANCHES[bid];
  const row = document.createElement("section");
  row.className = "l1-row";
  row.dataset.branch = bid;
  row.innerHTML = `
    <header class="l1-row__head">
      <div>
        <h4>${branch.name}</h4>
        <p class="l1-row__sub">${branch.reps.length} مندوبين</p>
      </div>
      <button class="l1-btn l1-btn--ghost l1-btn--sm" type="button" data-sort>↕ رتّب من الأقل للأعلى</button>
    </header>
    <div class="l1-row__overlay" data-overlay>
      <div class="l1-row__cards-wrap">
        <div class="l1-row__threshold" data-threshold hidden>
          <span class="l1-row__threshold-tag">٨٥٪</span>
        </div>
        <div class="l1-row__cards" data-cards></div>
      </div>
      <div class="l1-row__mean" data-mean hidden></div>
      <div class="l1-row__stability" data-stability hidden></div>
    </div>
  `;

  const cardsHost = row.querySelector<HTMLElement>("[data-cards]")!;
  branch.reps.forEach((rep) => cardsHost.appendChild(buildCard(rep)));

  row.querySelector<HTMLButtonElement>("[data-sort]")!.addEventListener("click", () => {
    sortRow(bid, local, row);
  });

  return row;
}

function buildCard(rep: Rep): HTMLElement {
  const el = document.createElement("article");
  el.className = "l1-card";
  el.dataset.id = rep.id;
  el.dataset.perf = String(rep.performance);
  el.innerHTML = `
    <div class="l1-card__perf">${rep.performance}<span>٪</span></div>
    <div class="l1-card__name">${rep.name}</div>
    <div class="l1-card__bar"><span style="width:${Math.min(100, (rep.performance / 150) * 100)}%"></span></div>
  `;
  return el;
}

function sortRow(bid: BranchId, local: BoardState, row: HTMLElement) {
  const cardsHost = row.querySelector<HTMLElement>("[data-cards]")!;
  const cards = Array.from(cardsHost.children) as HTMLElement[];

  // FLIP: record first positions
  const firstRects = new Map<string, DOMRect>();
  cards.forEach((c) => firstRects.set(c.dataset.id!, c.getBoundingClientRect()));

  // Re-order DOM ascending by perf
  cards
    .slice()
    .sort((a, b) => Number(a.dataset.perf) - Number(b.dataset.perf))
    .forEach((c) => cardsHost.appendChild(c));

  // Last positions
  cards.forEach((c) => {
    const first = firstRects.get(c.dataset.id!)!;
    const last = c.getBoundingClientRect();
    const dx = first.left - last.left;
    if (Math.abs(dx) > 0.5) {
      c.animate(
        [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }],
        { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    }
  });

  local.sorted[bid] = true;
  local.order[bid] = (Array.from(cardsHost.children) as HTMLElement[]).map((c) => c.dataset.id!);
  markSorted(bid);
}

function decorateRow(bid: BranchId, local: BoardState, root: HTMLElement) {
  const row = root.querySelector<HTMLElement>(`.l1-row[data-branch="${bid}"]`);
  if (!row) return;
  const s = getState();
  const toggles = s.toolToggles;
  const reps = BRANCHES[bid].reps;
  const perfs = reps.map((r) => r.performance);

  // 1) Per-card threshold coloring
  const cardsHost = row.querySelector<HTMLElement>("[data-cards]")!;
  Array.from(cardsHost.children).forEach((cEl) => {
    const c = cEl as HTMLElement;
    const v = Number(c.dataset.perf);
    c.classList.toggle("l1-card--below", toggles.threshold && v < PERFORMANCE_THRESHOLD);
    c.classList.toggle("l1-card--above", toggles.threshold && v >= PERFORMANCE_THRESHOLD);
  });
  const thrEl = row.querySelector<HTMLElement>("[data-threshold]")!;
  thrEl.hidden = !toggles.threshold;
  if (toggles.threshold) {
    const tag = thrEl.querySelector<HTMLElement>(".l1-row__threshold-tag")!;
    tag.textContent = `٨٥٪ · ${countBelow(perfs, PERFORMANCE_THRESHOLD)} تحت الحدّ`;
  }

  // 2) Mean pill
  const meanEl = row.querySelector<HTMLElement>("[data-mean]")!;
  if (toggles.mean) {
    meanEl.hidden = false;
    meanEl.innerHTML = `
      <span class="l1-row__mean-label">المتوسط الحسابي</span>
      <span class="l1-row__mean-val">${fmt(mean(perfs))}٪</span>
    `;
  } else {
    meanEl.hidden = true;
  }

  // 3) Median highlight (requires sorted)
  const sorted = local.sorted[bid];
  Array.from(cardsHost.children).forEach((cEl) => (cEl as HTMLElement).classList.remove("l1-card--median"));
  if (toggles.median) {
    if (sorted) {
      const kids = Array.from(cardsHost.children) as HTMLElement[];
      const n = kids.length;
      const midIdxA = Math.floor((n - 1) / 2);
      const midIdxB = Math.ceil((n - 1) / 2);
      kids[midIdxA]?.classList.add("l1-card--median");
      if (midIdxB !== midIdxA) kids[midIdxB]?.classList.add("l1-card--median");
      // Show median tag inside mean area as small chip
      const chip = document.createElement("span");
      chip.className = "l1-row__median-chip";
      chip.textContent = `الوسيط: ${fmt(median(perfs))}٪`;
      // Replace any existing chip
      row.querySelector(".l1-row__median-chip")?.remove();
      row.querySelector(".l1-row__head > div")!.appendChild(chip);
    } else {
      // Hint
      row.querySelector(".l1-row__median-chip")?.remove();
      const chip = document.createElement("span");
      chip.className = "l1-row__median-chip l1-row__median-chip--hint";
      chip.textContent = "رتّب الصف أولًا لرؤية الوسيط";
      row.querySelector(".l1-row__head > div")!.appendChild(chip);
    }
  } else {
    row.querySelector(".l1-row__median-chip")?.remove();
  }

  // 4) Stability bar
  const stab = row.querySelector<HTMLElement>("[data-stability]")!;
  if (toggles.stability) {
    stab.hidden = false;
    const lo = min(perfs);
    const hi = max(perfs);
    const r = range(perfs);
    const scaleMin = 50, scaleMax = 160;
    const left = ((lo - scaleMin) / (scaleMax - scaleMin)) * 100;
    const width = ((hi - lo) / (scaleMax - scaleMin)) * 100;
    stab.innerHTML = `
      <div class="l1-stab__head">
        <span>الاستقرار</span>
        <span class="l1-stab__range">${lo}٪ ← ${hi}٪ · مدى ${r}</span>
      </div>
      <div class="l1-stab__track">
        <div class="l1-stab__fill" style="inset-inline-start:${left}%;width:${width}%"></div>
        <div class="l1-stab__tick" style="inset-inline-start:${left}%"><b>${lo}</b></div>
        <div class="l1-stab__tick" style="inset-inline-start:${left + width}%"><b>${hi}</b></div>
      </div>
    `;
  } else {
    stab.hidden = true;
  }
}
