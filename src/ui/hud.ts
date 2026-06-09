// HUD = Game phase orchestrator for The Analyst: First Quarter
// Phases: cold-open → field → lab → memo → cutscene → retrospective
//
// The Phaser scene runs continuously in #game-root behind the HUD.
// During "field" phase, only a minimal HUD overlay is visible (HQ branding +
// remaining NPCs to visit). For all other phases, a full-screen panel
// covers the office.

import { company, datasetVariants, dialogues, getInspectNote, npcs } from "../data/salesCase";
import { gameEvents } from "../game/events";
import {
  actionLabel,
  buildOutcome,
  countAbove,
  evaluateOutcome,
  getDataset,
  mean,
  median,
  range,
  round1,
  sd,
  toolLabel,
  type ToolUse,
} from "../game/simulation";
import type {
  Action,
  Dataset,
  DatasetVariantId,
  GamePhase,
  GutCheck,
  NPCId,
  NotebookCard,
  Outcome,
  PlayerProfile,
  Recommendation,
  TeamId,
  ToolId,
} from "../game/types";

type State = {
  profile: PlayerProfile;
  variantId: DatasetVariantId;
  phase: GamePhase;
  // Cold open
  gutCheck?: GutCheck;
  // Field
  visited: Set<NPCId>;
  // Lab
  toolUses: ToolUse[];
  notebook: NotebookCard[];
  selectedToolTeam: TeamId;
  thresholdValue: number;
  thresholdEverDragged: boolean;
  distributionOpened: Set<TeamId>;
  // Memo
  recommendation?: Recommendation;
  // Cutscene
  outcome?: Outcome;
};

let root: HTMLElement;
let state: State;

export function createHud(profile: PlayerProfile) {
  const el = document.querySelector<HTMLElement>("#hud-root");
  if (!el) throw new Error("Missing HUD root");
  root = el;

  state = freshState(profile, 0);

  gameEvents.on("npcinteract", (e) => {
    if (!e.detail) return;
    openDialogue(e.detail.npc);
  });
  gameEvents.on("opendesk", () => {
    setPhase("lab");
  });

  render();
}

function freshState(profile: PlayerProfile, variantId: DatasetVariantId): State {
  return {
    profile,
    variantId,
    phase: "cold-open",
    visited: new Set(),
    toolUses: [],
    notebook: [],
    selectedToolTeam: "teamA",
    thresholdValue: 85,
    thresholdEverDragged: false,
    distributionOpened: new Set(),
  };
}

function setPhase(phase: GamePhase) {
  state.phase = phase;
  gameEvents.emit("phasechange", { phase });
  render();
}

function dataset(): Dataset {
  return getDataset(state.variantId);
}

// ───────────────────────────── RENDER ─────────────────────────────

function render() {
  switch (state.phase) {
    case "cold-open":
      renderColdOpen();
      break;
    case "field":
      renderField();
      break;
    case "lab":
      renderLab();
      break;
    case "memo":
      renderMemo();
      break;
    case "cutscene":
      renderCutscene();
      break;
    case "retrospective":
      renderRetrospective();
      break;
  }
}

// ─── Cold Open ───

function renderColdOpen() {
  root.innerHTML = `
    <div class="phase-overlay phase-overlay--dark" dir="rtl">
      <article class="email-card">
        <header class="email-card__header">
          <div>
            <strong>${npcs.karim.name}</strong>
            <span>${npcs.karim.role} — ${company.name}</span>
          </div>
          <span class="email-card__time">8:42 ص</span>
        </header>
        <h2>Subject: مراجعة Q2 — محتاج رأيك بسرعة</h2>
        <p>أهلاً ${state.profile.name}،</p>
        <p>
          الإدارة هتقرر بعد بكره مين ياخد بونص Q2 ومين يدخل خطة تطوير.
          الملفات هتلاقيها على مكتبك. <strong>قبل ما تفتح أي حاجة</strong> —
          حدسك بيقولك إيه؟ أنا مش هلزمك برأيك ده، بس عايز أعرفه.
        </p>
        <p class="email-card__signoff">— Karim</p>
        <div class="gut-check-row">
          <button data-gut="A" class="gut-btn">Team A أحسن</button>
          <button data-gut="B" class="gut-btn">Team B أحسن</button>
          <button data-gut="unsure" class="gut-btn gut-btn--ghost">مش قادر أحكم دلوقتي</button>
        </div>
      </article>
    </div>
  `;
  root.querySelectorAll<HTMLButtonElement>("[data-gut]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.gutCheck = btn.dataset.gut as GutCheck;
      setPhase("field");
    });
  });
}

// ─── Field Visit (minimal HUD over Phaser scene) ───

function renderField() {
  const remaining: NPCId[] = (["karim", "hala", "tarek", "alex"] as NPCId[]).filter(
    (id) => !state.visited.has(id),
  );
  const canEnterLab = state.visited.has("hala"); // must know HR policy

  root.innerHTML = `
    <div class="field-hud" dir="rtl">
      <div class="field-hud__top">
        <div class="field-hud__brand">
          <strong>${company.name}</strong>
          <small>${company.arabicName} · ${dataset().label}</small>
        </div>
        <div class="field-hud__objective">
          <span>المهمة</span>
          <strong>${
            canEnterLab
              ? "ادخل مكتبك (The Lab) وقدّم التوصية"
              : "اتكلم مع الفريق — على الأقل HR Director"
          }</strong>
        </div>
      </div>
      <aside class="field-hud__roster">
        <h3>اللي في المكتب</h3>
        <ul>
          ${(["karim", "hala", "tarek", "alex"] as NPCId[])
            .map((id) => {
              const seen = state.visited.has(id);
              return `<li class="${seen ? "is-seen" : ""}" data-npc="${id}">
                <strong>${npcs[id].name}</strong>
                <small>${npcs[id].role}</small>
                <span>${seen ? "✓ اتكلمت معاه" : "اضغط للتكلم"}</span>
              </li>`;
            })
            .join("")}
        </ul>
        <button class="primary-button ${canEnterLab ? "" : "is-disabled"}" data-open-lab ${
          canEnterLab ? "" : "disabled"
        }>
          ${canEnterLab ? "ادخل The Lab" : "اتكلم مع HR الأول"}
        </button>
      </aside>
      ${remaining.length === 0 ? "" : ""}
    </div>
  `;

  root.querySelectorAll<HTMLLIElement>("[data-npc]").forEach((li) => {
    li.addEventListener("click", () => openDialogue(li.dataset.npc as NPCId));
  });
  root.querySelector<HTMLButtonElement>("[data-open-lab]")?.addEventListener("click", () => {
    setPhase("lab");
  });
}

function openDialogue(id: NPCId) {
  state.visited.add(id);
  const lines = dialogues[id];
  const npc = npcs[id];
  const modal = document.createElement("div");
  modal.className = "phase-overlay phase-overlay--soft";
  modal.dir = "rtl";
  modal.innerHTML = `
    <article class="dialogue-card">
      <header>
        <strong>${npc.name}</strong>
        <span>${npc.role}</span>
      </header>
      <ol class="dialogue-lines">
        ${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}
      </ol>
      <button class="primary-button" data-close>تمام</button>
    </article>
  `;
  document.body.appendChild(modal);
  modal.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", () => {
    modal.remove();
    if (state.phase === "field") render();
  });
}

// ─── The Lab ───

function renderLab() {
  const d = dataset();
  const teamA = d.teamA;
  const teamB = d.teamB;
  const team = state.selectedToolTeam;
  const usedTools = new Set(state.toolUses.map((u) => `${u.tool}-${u.team}`));

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full" dir="rtl">
      <header class="lab__header">
        <div>
          <span class="eyebrow">${company.name} · The Lab</span>
          <h2>${d.label} — بيانات الأداء الخام</h2>
          <small>الهدف الشهري لكل مندوب: ${d.targetK}K · سياسة HR: Good Performer ≥ ${d.threshold}%</small>
        </div>
        <div class="lab__alex">
          <strong>Alex (المنافس)</strong>
          <p>"${alexLine()}"</p>
        </div>
      </header>

      <div class="lab__grid">
        <section class="lab__col lab__col--data">
          <h3>البيانات الخام</h3>
          ${renderRawTeam(teamA)}
          ${renderRawTeam(teamB)}
        </section>

        <section class="lab__col lab__col--canvas">
          <h3>لوحة العمل</h3>
          <div class="canvas-area" id="canvas-area">
            ${renderCanvas()}
          </div>
        </section>

        <section class="lab__col lab__col--tools">
          <h3>صندوق الأدوات</h3>
          <div class="team-toggle">
            <button class="${team === "teamA" ? "is-on" : ""}" data-team-toggle="teamA">${teamA.name}</button>
            <button class="${team === "teamB" ? "is-on" : ""}" data-team-toggle="teamB">${teamB.name}</button>
          </div>
          <div class="tool-list">
            ${renderToolBtn("average", "📊", "Compute Average", usedTools.has(`average-${team}`))}
            ${renderToolBtn("median", "📍", "Find Middle Value", usedTools.has(`median-${team}`))}
            ${renderToolBtn("spread", "📏", "Measure Spread", usedTools.has(`spread-${team}`))}
            ${renderToolBtn("countAbove", "🎯", "Count Above Target", usedTools.has(`countAbove-${team}`))}
            ${renderToolBtn("distribution", "📈", "Plot Distribution", usedTools.has(`distribution-${team}`))}
            ${renderToolBtn("inspect", "🔍", "Inspect Individual", false)}
          </div>

          <h3 class="notebook-title">Notebook (${state.notebook.length})</h3>
          <div class="notebook">
            ${
              state.notebook.length === 0
                ? `<p class="notebook__empty">استخدم أداة عشان نتيجتها تتسجل هنا.</p>`
                : state.notebook
                    .slice()
                    .reverse()
                    .map(
                      (c) => `
                <article class="note-card note-card--${c.tool}">
                  <header>
                    <strong>${c.title}</strong>
                    <span>${dataset()[c.team].name}</span>
                  </header>
                  <p>${c.summary}</p>
                </article>`,
                    )
                    .join("")
            }
          </div>

          <button class="primary-button" data-go-memo>
            اكتب التوصية الرسمية ←
          </button>
        </section>
      </div>
    </div>
  `;

  // Tool bar
  root.querySelectorAll<HTMLButtonElement>("[data-team-toggle]").forEach((b) => {
    b.addEventListener("click", () => {
      state.selectedToolTeam = b.dataset.teamToggle as TeamId;
      render();
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((b) => {
    b.addEventListener("click", () => useTool(b.dataset.tool as ToolId));
  });
  root.querySelector<HTMLButtonElement>("[data-go-memo]")?.addEventListener("click", () => {
    setPhase("memo");
  });

  // Threshold slider
  const slider = root.querySelector<HTMLInputElement>("#threshold-slider");
  slider?.addEventListener("input", () => {
    state.thresholdValue = Number(slider.value);
    state.thresholdEverDragged = true;
    updateCountAboveLive();
  });

  // Inspect dropdown
  root.querySelector<HTMLSelectElement>("#inspect-select")?.addEventListener("change", (e) => {
    const select = e.target as HTMLSelectElement;
    const repId = select.value;
    if (!repId) return;
    runInspect(repId);
    select.value = "";
  });
}

function renderToolBtn(id: ToolId, icon: string, label: string, used: boolean) {
  return `
    <button class="tool-btn ${used ? "is-used" : ""}" data-tool="${id}">
      <span class="tool-btn__icon">${icon}</span>
      <span class="tool-btn__label">${label}</span>
      ${used ? `<span class="tool-btn__check">✓</span>` : ""}
    </button>
  `;
}

function renderRawTeam(team: { id: TeamId; name: string; region: string; reps: { id: string; name: string; performance: number }[] }) {
  return `
    <div class="raw-team">
      <header>
        <strong>${team.name}</strong>
        <small>${team.region}</small>
      </header>
      <table class="raw-table">
        <thead>
          <tr><th>المندوب</th><th>الاسم</th><th>الأداء %</th></tr>
        </thead>
        <tbody>
          ${team.reps
            .map(
              (r) =>
                `<tr><td>${r.id.toUpperCase()}</td><td>${r.name}</td><td>${r.performance}%</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function alexLine(): string {
  if (state.notebook.length === 0) return "بتضيع وقت. المتوسط واضح من البيانات الخام.";
  if (state.distributionOpened.size > 0)
    return "بتبص في الرسومات؟ أنا قدّمت من ساعة بالأرقام الأساسية.";
  if (state.thresholdEverDragged)
    return "ليه بتعد الناس فوق وتحت خط؟ المتوسط هو الـ KPI الوحيد.";
  return "أنا بقالي خلصت. ليه بتعقّد الموضوع؟";
}

// ─ Canvas (visualization area) ─

function renderCanvas(): string {
  if (state.notebook.length === 0) {
    return `<div class="canvas-empty">
      <p>اللوحة فاضية.</p>
      <p>كل أداة بتستخدمها، نتيجتها هتظهر هنا.</p>
    </div>`;
  }

  const d = dataset();
  const showA = state.distributionOpened.has("teamA");
  const showB = state.distributionOpened.has("teamB");

  let html = "";
  if (showA || showB) {
    html += `<div class="dot-plot-wrap">
      <h4>Distribution Plot</h4>
      ${showA ? renderDotPlot(d.teamA) : ""}
      ${showB ? renderDotPlot(d.teamB) : ""}
      <div class="threshold-control">
        <label>خط القياس: <strong id="threshold-display">${state.thresholdValue}%</strong></label>
        <input id="threshold-slider" type="range" min="0" max="200" step="5" value="${state.thresholdValue}" />
        <div class="threshold-counts" id="threshold-counts">${renderThresholdCounts()}</div>
      </div>
    </div>`;
  }

  // Recent stat panels
  const recentStats = state.notebook.slice(-4).reverse();
  html += `<div class="stat-strip">${recentStats
    .map((c) => `<div class="stat-pill stat-pill--${c.tool}"><strong>${c.title}</strong><span>${c.summary}</span></div>`)
    .join("")}</div>`;

  // Inspect dropdown
  html += `<div class="inspect-row">
    <label>فحص فردي:</label>
    <select id="inspect-select">
      <option value="">-- اختر مندوب --</option>
      <optgroup label="${d.teamA.name}">
        ${d.teamA.reps.map((r) => `<option value="${r.id}">${r.id.toUpperCase()} — ${r.name} (${r.performance}%)</option>`).join("")}
      </optgroup>
      <optgroup label="${d.teamB.name}">
        ${d.teamB.reps.map((r) => `<option value="${r.id}">${r.id.toUpperCase()} — ${r.name} (${r.performance}%)</option>`).join("")}
      </optgroup>
    </select>
  </div>`;

  return html;
}

function renderDotPlot(team: { id: TeamId; name: string; reps: { id: string; performance: number }[] }): string {
  const maxX = 200;
  const dots = team.reps
    .map((r) => {
      const left = (r.performance / maxX) * 100;
      const below = r.performance < state.thresholdValue;
      return `<span class="dot ${below ? "dot--below" : "dot--above"}" style="left:${left}%" title="${r.id.toUpperCase()}: ${r.performance}%"></span>`;
    })
    .join("");
  const thresholdLeft = (state.thresholdValue / maxX) * 100;
  return `
    <div class="dot-plot">
      <header>${team.name}</header>
      <div class="dot-plot__axis">
        ${dots}
        <span class="dot-plot__threshold" style="left:${thresholdLeft}%"></span>
        <div class="dot-plot__ticks">
          ${[0, 50, 85, 100, 150, 200].map((v) => `<span style="left:${(v / maxX) * 100}%">${v}%</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderThresholdCounts(): string {
  const d = dataset();
  const a = countAbove(d.teamA.reps.map((r) => r.performance), state.thresholdValue);
  const b = countAbove(d.teamB.reps.map((r) => r.performance), state.thresholdValue);
  return `
    <span><strong>${d.teamA.name}:</strong> ${a}/10 فوق ${state.thresholdValue}%</span>
    <span><strong>${d.teamB.name}:</strong> ${b}/10 فوق ${state.thresholdValue}%</span>
  `;
}

function updateCountAboveLive() {
  const disp = document.getElementById("threshold-display");
  const counts = document.getElementById("threshold-counts");
  if (disp) disp.textContent = `${state.thresholdValue}%`;
  if (counts) counts.innerHTML = renderThresholdCounts();
  // Move threshold line in any visible dot plots
  root.querySelectorAll<HTMLElement>(".dot-plot__threshold").forEach((line) => {
    line.style.left = `${(state.thresholdValue / 200) * 100}%`;
  });
  root.querySelectorAll<HTMLElement>(".dot").forEach((dot) => {
    const title = dot.getAttribute("title") || "";
    const m = title.match(/(\d+(?:\.\d+)?)%/);
    if (!m) return;
    const v = Number(m[1]);
    dot.classList.toggle("dot--below", v < state.thresholdValue);
    dot.classList.toggle("dot--above", v >= state.thresholdValue);
  });
}

// ─ Tools ─

function useTool(tool: ToolId) {
  const team = state.selectedToolTeam;
  const d = dataset();
  const perfs = d[team].reps.map((r) => r.performance);

  if (tool === "inspect") {
    // Inspect is handled via the dropdown in the canvas.
    if (!state.distributionOpened.has(team)) {
      // Surface the dropdown by recording a "view" intent.
      addNotebookCard({
        id: nid(),
        tool: "inspect",
        team,
        title: "Inspect جاهز",
        summary: "اختر مندوب من القائمة في اللوحة.",
      });
      state.toolUses.push({ tool, team });
      render();
    }
    return;
  }

  let card: NotebookCard;
  switch (tool) {
    case "average": {
      const v = round1(mean(perfs));
      card = {
        id: nid(),
        tool,
        team,
        title: "Average",
        summary: `متوسط ${d[team].name} = ${v}%`,
      };
      state.toolUses.push({ tool, team });
      break;
    }
    case "median": {
      const v = round1(median(perfs));
      card = {
        id: nid(),
        tool,
        team,
        title: "Median",
        summary: `وسيط ${d[team].name} = ${v}%`,
      };
      state.toolUses.push({ tool, team });
      break;
    }
    case "spread": {
      const r = round1(range(perfs));
      const s = round1(sd(perfs));
      card = {
        id: nid(),
        tool,
        team,
        title: "Spread",
        summary: `Range = ${r} · SD = ${s}`,
      };
      state.toolUses.push({ tool, team });
      break;
    }
    case "countAbove": {
      const c = countAbove(perfs, state.thresholdValue);
      card = {
        id: nid(),
        tool,
        team,
        title: "Count Above",
        summary: `${c}/${perfs.length} مندوب فوق ${state.thresholdValue}%`,
      };
      state.toolUses.push({ tool, team, thresholdValue: state.thresholdValue });
      state.distributionOpened.add(team); // unlock dot plot too so slider is visible
      break;
    }
    case "distribution": {
      state.distributionOpened.add(team);
      card = {
        id: nid(),
        tool,
        team,
        title: "Distribution",
        summary: `مخطط ${d[team].name} ظاهر على اللوحة.`,
      };
      state.toolUses.push({ tool, team });
      break;
    }
    default:
      return;
  }
  addNotebookCard(card);
  render();
}

function runInspect(repId: string) {
  const d = dataset();
  const allReps = [...d.teamA.reps, ...d.teamB.reps];
  const rep = allReps.find((r) => r.id === repId);
  if (!rep) return;
  const team: TeamId = d.teamA.reps.some((r) => r.id === repId) ? "teamA" : "teamB";
  const note = getInspectNote(d, repId);
  addNotebookCard({
    id: nid(),
    tool: "inspect",
    team,
    title: `Inspect ${rep.id.toUpperCase()}`,
    summary: note,
  });
  state.toolUses.push({ tool: "inspect", team });
  render();
}

function addNotebookCard(card: NotebookCard) {
  // de-dup: replace previous card with same tool+team
  state.notebook = state.notebook.filter((c) => !(c.tool === card.tool && c.team === card.team && card.tool !== "inspect"));
  state.notebook.push(card);
}

function nid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Memo (Commitment Gate) ───

function renderMemo() {
  const d = dataset();
  const metricsUsed = uniqueMetricsUsed();
  const a: Action = state.recommendation?.teamA ?? "hold";
  const b: Action = state.recommendation?.teamB ?? "hold";
  const metric: ToolId = state.recommendation?.primaryMetric ?? metricsUsed[0] ?? "average";
  const canSubmit = metricsUsed.length > 0;

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full" dir="rtl">
      <article class="memo-card">
        <header>
          <span class="eyebrow">${company.name} · Internal Memo</span>
          <h2>توصية مراجعة الأداء — ${d.label}</h2>
          <small>إلى: Karim Halim (VP Sales) · من: ${state.profile.name} (Senior Data Analyst)</small>
        </header>

        <section class="memo-body">
          <p>بناءً على تحليل بيانات الفريقين، توصيتي كما يلي:</p>

          <div class="memo-grid">
            <div class="memo-field">
              <label>قراري لـ ${d.teamA.name} (${d.teamA.region})</label>
              <div class="action-grid">
                ${(["reward", "training", "restructure", "hold"] as Action[])
                  .map(
                    (act) =>
                      `<button data-team-action="teamA:${act}" class="${a === act ? "is-on" : ""}">${actionLabel[act]}</button>`,
                  )
                  .join("")}
              </div>
            </div>

            <div class="memo-field">
              <label>قراري لـ ${d.teamB.name} (${d.teamB.region})</label>
              <div class="action-grid">
                ${(["reward", "training", "restructure", "hold"] as Action[])
                  .map(
                    (act) =>
                      `<button data-team-action="teamB:${act}" class="${b === act ? "is-on" : ""}">${actionLabel[act]}</button>`,
                  )
                  .join("")}
              </div>
            </div>

            <div class="memo-field memo-field--metric">
              <label>المقياس الأساسي اللي بنيت عليه القرار</label>
              ${
                metricsUsed.length === 0
                  ? `<p class="memo-warning">⚠ ما استخدمتش أي أداة في The Lab. ارجع وافتح ولو أداة واحدة.</p>`
                  : `<select id="memo-metric">
                      ${metricsUsed.map((m) => `<option value="${m}" ${m === metric ? "selected" : ""}>${toolLabel[m]}</option>`).join("")}
                    </select>`
              }
            </div>
          </div>

          <p class="memo-warning-soft">
            ⚠ بعد الاعتماد، التوصية بتروح للإدارة على طول. النتايج هتظهر بعد 3 شهور. مفيش رجوع.
          </p>
        </section>

        <footer class="memo-actions">
          <button class="text-button" data-back-lab>← رجوع للـ Lab</button>
          <button class="primary-button" data-submit ${canSubmit ? "" : "disabled"}>اعتمد التوصية</button>
        </footer>
      </article>
    </div>
  `;

  root.querySelectorAll<HTMLButtonElement>("[data-team-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [team, act] = String(btn.dataset.teamAction).split(":") as [TeamId, Action];
      state.recommendation = {
        teamA: team === "teamA" ? act : (state.recommendation?.teamA ?? "hold"),
        teamB: team === "teamB" ? act : (state.recommendation?.teamB ?? "hold"),
        primaryMetric: state.recommendation?.primaryMetric ?? metric,
      };
      render();
    });
  });
  root.querySelector<HTMLSelectElement>("#memo-metric")?.addEventListener("change", (e) => {
    const sel = (e.target as HTMLSelectElement).value as ToolId;
    state.recommendation = {
      teamA: state.recommendation?.teamA ?? "hold",
      teamB: state.recommendation?.teamB ?? "hold",
      primaryMetric: sel,
    };
  });
  root.querySelector<HTMLButtonElement>("[data-back-lab]")?.addEventListener("click", () => setPhase("lab"));
  root.querySelector<HTMLButtonElement>("[data-submit]")?.addEventListener("click", () => {
    if (!state.recommendation) return;
    const outcomeKind = evaluateOutcome(dataset(), state.recommendation, state.toolUses);
    state.outcome = buildOutcome(dataset(), state.recommendation, outcomeKind);
    gameEvents.emit("submitrecommendation", { recommendation: state.recommendation });
    setPhase("cutscene");
  });
}

function uniqueMetricsUsed(): ToolId[] {
  const set = new Set<ToolId>();
  state.toolUses.forEach((u) => set.add(u.tool));
  return Array.from(set);
}

// ─── Cutscene (Q+3 Months) ───

function renderCutscene() {
  if (!state.outcome) return;
  const o = state.outcome;
  const tone = o.kind === "correct" ? "good" : o.kind === "mixed" ? "mixed" : "bad";
  root.innerHTML = `
    <div class="phase-overlay phase-overlay--dark" dir="rtl">
      <article class="cutscene cutscene--${tone}">
        <header>
          <span class="eyebrow">⏩ 3 شهور بعدين</span>
          <h2>${o.title}</h2>
        </header>
        <ol class="cutscene__scenes">
          ${o.scenes.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
        </ol>
        <article class="email-card email-card--compact">
          <header class="email-card__header">
            <div><strong>${o.finalEmail.from}</strong></div>
            <span class="email-card__time">الآن</span>
          </header>
          <h3>${o.finalEmail.subject}</h3>
          <p>${escapeHtml(o.finalEmail.body)}</p>
        </article>
        <button class="primary-button" data-go-retro>شوف التحليل التفصيلي ←</button>
      </article>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("[data-go-retro]")?.addEventListener("click", () => setPhase("retrospective"));
}

// ─── Retrospective ───

function renderRetrospective() {
  const d = dataset();
  const o = state.outcome!;
  const usedTools = new Set(state.toolUses.map((u) => u.tool));
  const allTools: ToolId[] = ["average", "median", "spread", "countAbove", "distribution", "inspect"];
  const missed = allTools.filter((t) => !usedTools.has(t));

  // Compute the "true" stats for reveal
  const aPerfs = d.teamA.reps.map((r) => r.performance);
  const bPerfs = d.teamB.reps.map((r) => r.performance);
  const stats = {
    aMean: round1(mean(aPerfs)),
    bMean: round1(mean(bPerfs)),
    aMedian: round1(median(aPerfs)),
    bMedian: round1(median(bPerfs)),
    aSd: round1(sd(aPerfs)),
    bSd: round1(sd(bPerfs)),
    aAbove: countAbove(aPerfs, d.threshold),
    bAbove: countAbove(bPerfs, d.threshold),
  };

  const nextVariant: DatasetVariantId = ((state.variantId + 1) % 3) as DatasetVariantId;

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full" dir="rtl">
      <article class="retro">
        <header>
          <span class="eyebrow">Retrospective · ${d.label}</span>
          <h2>اللي شفته vs. اللي كانت البيانات بتقوله</h2>
        </header>

        <div class="retro__grid">
          <section class="retro__col">
            <h3>اللي عملته</h3>
            <p><strong>حدسك الأول:</strong> ${gutLabel(state.gutCheck)}</p>
            <p><strong>الأدوات اللي فتحتها:</strong></p>
            <ul class="tool-checklist">
              ${allTools
                .map(
                  (t) => `<li class="${usedTools.has(t) ? "is-done" : "is-skipped"}">
                  ${usedTools.has(t) ? "✓" : "✗"} ${toolLabel[t]}
                </li>`,
                )
                .join("")}
            </ul>
            ${
              missed.length > 0
                ? `<p class="retro__missed">⚠ ${missed.length} أداة ما فتحتهاش، وفي وسطهم أدوات كانت هتغيّر القرار.</p>`
                : `<p class="retro__missed retro__missed--ok">استخدمت كل الأدوات المتاحة.</p>`
            }
            <p><strong>توصيتك:</strong></p>
            <p>• ${d.teamA.name}: ${actionLabel[state.recommendation!.teamA]}</p>
            <p>• ${d.teamB.name}: ${actionLabel[state.recommendation!.teamB]}</p>
            <p><strong>بنيتها على:</strong> ${toolLabel[state.recommendation!.primaryMetric]}</p>
          </section>

          <section class="retro__col retro__col--truth">
            <h3>اللي البيانات قالته</h3>
            <table class="truth-table">
              <thead><tr><th></th><th>${d.teamA.name}</th><th>${d.teamB.name}</th></tr></thead>
              <tbody>
                <tr><td>Mean</td><td>${stats.aMean}%</td><td>${stats.bMean}%</td></tr>
                <tr><td>Median</td><td>${stats.aMedian}%</td><td>${stats.bMedian}%</td></tr>
                <tr><td>SD</td><td>${stats.aSd}</td><td>${stats.bSd}</td></tr>
                <tr class="truth-table__key"><td>≥ ${d.threshold}%</td><td>${stats.aAbove}/10</td><td>${stats.bAbove}/10</td></tr>
              </tbody>
            </table>
            <div class="dot-plot-wrap retro__plots">
              ${renderDotPlot(d.teamA)}
              ${renderDotPlot(d.teamB)}
            </div>
            <p class="retro__lesson">
              <strong>الفريق المستحق للمكافأة:</strong> ${d[d.healthyTeam].name} —
              لأن ${stats[d.healthyTeam === "teamA" ? "aAbove" : "bAbove"]}/10 مندوبين فوق خط HR،
              والـ SD صغير (فريق متماسك).
              <br/>
              <strong>الفريق المحتاج تطوير:</strong> ${d[d.outlierTeam].name} —
              المتوسط مضلِّل بسبب 3 outliers، والـMedian = ${
                d.outlierTeam === "teamA" ? stats.aMedian : stats.bMedian
              }% بيكشف القصة الحقيقية.
            </p>
          </section>
        </div>

        <div class="retro__alex">
          <strong>Alex:</strong> "${
            o.kind === "correct"
              ? "هممم. كنت متأكد من نفسي. غلطت في القراءة."
              : "أنا قدّمت نفس توصيتك. الإدارة بتراجع الاتنين دلوقتي."
          }"
        </div>

        <footer class="retro__actions">
          <button class="primary-button" data-replay="${nextVariant}">
            العب تاني (${datasetVariants[nextVariant].label}) — Dataset جديد، نفس المبدأ
          </button>
        </footer>
      </article>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("[data-replay]")?.addEventListener("click", (e) => {
    const v = Number((e.currentTarget as HTMLButtonElement).dataset.replay) as DatasetVariantId;
    state = freshState(state.profile, v);
    setPhase("cold-open");
  });
}

function gutLabel(g?: GutCheck): string {
  if (g === "A") return "Team A أحسن";
  if (g === "B") return "Team B أحسن";
  if (g === "unsure") return "مش قادر أحكم";
  return "—";
}

// ─── utils ───

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
