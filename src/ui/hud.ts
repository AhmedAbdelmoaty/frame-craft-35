// HUD = Game phase orchestrator for The Analyst: First Quarter
// Phases: cold-open → field → lab → memo → cutscene → retrospective
//
// Lab redesign (v4 — mobile-first):
//  - 3 tabs: مهمة / تحليل / دفتر
//  - 4 tools only, all run on BOTH teams side-by-side
//  - No team toggle, no "inspect" panel, no dot/box plot tools
//  - Rep details = a tap-only modal on the spreadsheet row

import { briefcaseFiles, company, dialogues, getInspectNote, npcs } from "../data/salesCase";
import { gameEvents } from "../game/events";
import {
  actionDescription,
  actionLabel,
  buildOutcome,
  countAbove,
  evaluateOutcome,
  getDataset,
  maxOf,
  mean,
  median,
  minOf,
  round1,
  sd,
  toolHint,
  toolIcon,
  toolLabel,
  toolShort,
  type ToolUse,
} from "../game/simulation";
import type {
  Action,
  BriefcaseFile,
  BriefcaseFileId,
  ComparisonResult,
  Dataset,
  DatasetVariantId,
  GamePhase,
  NotebookCard,
  NPCId,
  Outcome,
  PlayerProfile,
  Recommendation,
  Rep,
  TeamId,
  ToolId,
} from "../game/types";

type LabTab = "mission" | "analysis" | "notebook";

type State = {
  profile: PlayerProfile;
  variantId: DatasetVariantId;
  phase: GamePhase;
  coldOpenStage: "laptop" | "inbox" | "email";
  collected: Set<BriefcaseFileId>;
  visited: Set<NPCId>;
  // Lab
  notebook: NotebookCard[];
  labTab: LabTab;
  openFile: BriefcaseFileId | null;
  pendingResult: ComparisonResult | null;
  inspectRepId: string | null;
  thresholdValue: number;
  // Memo
  recommendation: Recommendation;
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
    if (state.collected.size >= 3) setPhase("lab");
    else toast("لازم تجمع 3 ملفات قبل ما تدخل مكتبك.");
  });

  render();
}

function freshState(profile: PlayerProfile, variantId: DatasetVariantId): State {
  return {
    profile,
    variantId,
    phase: "cold-open",
    coldOpenStage: "laptop",
    collected: new Set(),
    visited: new Set(),
    notebook: [],
    labTab: "mission",
    openFile: null,
    pendingResult: null,
    inspectRepId: null,
    thresholdValue: 85,
    recommendation: { teamA: "defer", teamB: "defer", primaryMetric: null },
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

function render() {
  switch (state.phase) {
    case "cold-open": renderColdOpen(); break;
    case "field": renderField(); break;
    case "lab": renderLab(); break;
    case "memo": renderMemo(); break;
    case "cutscene": renderCutscene(); break;
    case "retrospective": renderRetrospective(); break;
  }
}

// ═══════════════════════════ COLD OPEN ═══════════════════════════

function renderColdOpen() {
  const stage = state.coldOpenStage;
  if (stage === "laptop") {
    root.innerHTML = `
      <div class="phase-overlay phase-overlay--black" dir="rtl">
        <div class="laptop-scene">
          <div class="laptop-frame">
            <div class="laptop-screen" data-boot>
              <div class="laptop-power">
                <button class="power-btn" data-power title="افتح اللاب توب">
                  <span class="power-icon">⏻</span>
                </button>
                <p class="laptop-hint">صباح الخير يا ${escapeHtml(state.profile.name)}. اضغط زرّ التشغيل تبدأ يومك.</p>
              </div>
            </div>
            <div class="laptop-base"></div>
          </div>
          <p class="env-caption">مكتب المحلل — ${company.arabicName}</p>
        </div>
      </div>`;
    root.querySelector<HTMLButtonElement>("[data-power]")?.addEventListener("click", () => {
      state.coldOpenStage = "inbox";
      render();
    });
    return;
  }

  if (stage === "inbox") {
    root.innerHTML = `
      <div class="phase-overlay phase-overlay--black" dir="rtl">
        <div class="laptop-scene">
          <div class="laptop-frame laptop-frame--on">
            <div class="laptop-screen laptop-screen--inbox">
              <header class="inbox-bar">
                <span>📧 صندوق الوارد</span>
                <span class="inbox-count">1 جديد</span>
              </header>
              <ul class="inbox-list">
                <li class="inbox-item inbox-item--unread" data-open-email>
                  <span class="inbox-dot"></span>
                  <div>
                    <strong>Nader Sami — الرئيس التنفيذي</strong>
                    <small>مراجعة الأداء — مهمة عاجلة</small>
                  </div>
                  <span class="inbox-time">8:42 ص</span>
                </li>
              </ul>
              <p class="inbox-hint">↑ افتح الإيميل</p>
            </div>
          </div>
        </div>
      </div>`;
    root.querySelector<HTMLElement>("[data-open-email]")?.addEventListener("click", () => {
      state.coldOpenStage = "email";
      render();
    });
    return;
  }

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--black" dir="rtl">
      <div class="laptop-scene">
        <div class="laptop-frame laptop-frame--on">
          <div class="laptop-screen laptop-screen--email">
            <article class="email-letter">
              <header class="email-letter__head">
                <div>
                  <strong>Nader Sami</strong>
                  <span>الرئيس التنفيذي — ${company.arabicName}</span>
                </div>
                <span class="email-letter__time">8:42 ص</span>
              </header>
              <h2>الموضوع: مراجعة الأداء — مهمة عاجلة</h2>
              <p>أهلاً ${escapeHtml(state.profile.name)}،</p>
              <p>محتاجك تراجع أداء فريقي المبيعات Q2 وتطلعلي بتوصية واضحة: <strong>مين ياخد المكافأة، ومين يحتاج خطة تطوير</strong>.</p>
              <p>كلّم Karim و Hala و Tarek، اجمع ملفاتهم، ارجع مكتبك وحلّل، وابعتلي مذكرتك.</p>
              <p class="email-letter__sign">— Nader</p>
              <button class="primary-button" data-start>أبدأ يومي ←</button>
            </article>
          </div>
        </div>
      </div>
    </div>`;
  root.querySelector<HTMLButtonElement>("[data-start]")?.addEventListener("click", () => setPhase("field"));
}

// ═══════════════════════════ FIELD ═══════════════════════════

function renderField() {
  const count = state.collected.size;
  const allDone = count >= 3;
  const order: NPCId[] = ["karim", "hala", "tarek"];
  const remaining = order.filter((id) => !state.visited.has(id));

  root.innerHTML = `
    <div class="field-hud" dir="rtl">
      <header class="field-bar">
        <div class="field-bar__brand">
          <strong>${company.name}</strong>
          <small>${state.profile.name} · محلل بيانات</small>
        </div>
        <div class="field-bar__count ${allDone ? "is-ready" : ""}">
          <span>الحقيبة</span><strong>${count}/3</strong>
        </div>
      </header>
      <div class="field-objective ${allDone ? "is-ready" : ""}">
        ${allDone ? "✅ جمعت كل الملفات — افتح مكتبك من الأسفل" : `🎯 المطلوب: كلّم ${remaining.map((id) => npcs[id].name.split(" ")[0]).join("، ")}`}
      </div>
      <nav class="npc-rail">
        ${order.map((id) => {
          const f = briefcaseFiles.find((x) => x.source === id);
          const done = f ? state.collected.has(f.id) : false;
          const emoji = id === "karim" ? "👔" : id === "hala" ? "👩‍💼" : "🧑‍🔧";
          return `<button class="npc-chip ${done ? "is-done" : ""}" data-talk="${id}">
            <span class="npc-chip__avatar">${emoji}</span>
            <span class="npc-chip__body"><strong>${npcs[id].name.split(" ")[0]}</strong><small>${npcs[id].role}</small></span>
            <span class="npc-chip__state">${done ? "✓ تم" : "كلّمه ←"}</span>
          </button>`;
        }).join("")}
      </nav>
      <aside class="briefcase-sheet" data-open="${allDone ? "true" : "false"}">
        <button class="briefcase-sheet__handle" data-toggle-sheet>
          <span>🧰 حقيبتك · ${count}/3 ملفات</span>
          <span class="briefcase-sheet__chev">▾</span>
        </button>
        <div class="briefcase-sheet__body">
          <ul class="briefcase-list">
            ${briefcaseFiles.map((f) => {
              const got = state.collected.has(f.id);
              return `<li class="${got ? "is-got" : "is-missing"}">
                <span class="briefcase-icon">${f.icon}</span>
                <div><strong>${f.title}</strong><small>${got ? "✓ معك" : "من " + npcs[f.source].name.split(" ")[0]}</small></div>
              </li>`;
            }).join("")}
          </ul>
          ${allDone ? `<button class="primary-button" data-open-lab>📂 ادخل مكتبك وحلّل ←</button>` : `<p class="briefcase-hint">اضغط على شخصية فوق علشان تتكلم معاها.</p>`}
        </div>
      </aside>
    </div>`;

  root.querySelectorAll<HTMLButtonElement>("[data-talk]").forEach((b) => {
    b.addEventListener("click", () => gameEvents.emit("npcinteract", { npc: b.dataset.talk as NPCId }));
  });
  root.querySelector<HTMLButtonElement>("[data-toggle-sheet]")?.addEventListener("click", () => {
    const sheet = root.querySelector<HTMLElement>(".briefcase-sheet");
    if (sheet) sheet.dataset.open = sheet.dataset.open === "true" ? "false" : "true";
  });
  root.querySelector<HTMLButtonElement>("[data-open-lab]")?.addEventListener("click", () => setPhase("lab"));
}

function openDialogue(id: NPCId) {
  if (id === "ceo" || id === "alex") return;
  state.visited.add(id);
  const lines = dialogues[id];
  const npc = npcs[id];
  const fileForNpc = briefcaseFiles.find((f) => f.source === id);
  const already = fileForNpc ? state.collected.has(fileForNpc.id) : true;

  const modal = document.createElement("div");
  modal.className = "phase-overlay phase-overlay--soft";
  modal.dir = "rtl";
  modal.innerHTML = `
    <article class="dialogue-card">
      <header>
        <div><strong>${npc.name}</strong><span>${npc.role}</span></div>
        <span class="dialogue-location">${npc.location}</span>
      </header>
      <ol class="dialogue-lines">${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ol>
      <footer class="dialogue-foot">
        ${fileForNpc && !already ? `<button class="primary-button" data-take-file>📂 خد الملف</button>` : `<button class="primary-button" data-close>تمام</button>`}
      </footer>
    </article>`;
  document.body.appendChild(modal);

  modal.querySelector<HTMLButtonElement>("[data-take-file]")?.addEventListener("click", () => {
    if (fileForNpc) {
      state.collected.add(fileForNpc.id);
      gameEvents.emit("filecollected", { file: fileForNpc.id });
      toast(`📂 انضاف للحقيبة: ${fileForNpc.title}`);
    }
    modal.remove();
    if (state.phase === "field") render();
  });
  modal.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", () => {
    modal.remove();
    if (state.phase === "field") render();
  });
}

// ═══════════════════════════ LAB (DESK) — v4 mobile-first ═══════════════════════════

function renderLab() {
  const d = dataset();
  const canMemo = state.notebook.length >= 1;

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full lab-v4" dir="rtl">
      <header class="lab-v4__top">
        <div>
          <span class="eyebrow">${company.name} · مكتب المحلل</span>
          <h2>${d.label}</h2>
        </div>
        <button class="primary-button lab-v4__send" data-go-memo ${canMemo ? "" : "disabled"}>
          📧 اكتب التوصية
        </button>
      </header>

      <nav class="lab-tabs">
        ${tabBtn("mission", "📋", "المهمة", state.collected.size)}
        ${tabBtn("analysis", "🔬", "التحليل", state.notebook.length)}
        ${tabBtn("notebook", "📓", "دفتري", state.notebook.length)}
      </nav>

      <main class="lab-v4__body">
        ${state.labTab === "mission" ? renderMissionTab() : ""}
        ${state.labTab === "analysis" ? renderAnalysisTab() : ""}
        ${state.labTab === "notebook" ? renderNotebookTab() : ""}
      </main>
    </div>`;

  // Tabs
  root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) => {
    b.addEventListener("click", () => {
      state.labTab = b.dataset.tab as LabTab;
      render();
    });
  });

  // File open (modal)
  root.querySelectorAll<HTMLButtonElement>("[data-open-file]").forEach((b) => {
    b.addEventListener("click", () => openFileModal(b.dataset.openFile as BriefcaseFileId));
  });

  // Run tool
  root.querySelectorAll<HTMLButtonElement>("[data-run-tool]").forEach((b) => {
    b.addEventListener("click", () => runTool(b.dataset.runTool as ToolId));
  });

  // Pin / discard
  root.querySelector<HTMLButtonElement>("[data-pin]")?.addEventListener("click", () => {
    if (state.pendingResult) pinResult(state.pendingResult);
  });
  root.querySelector<HTMLButtonElement>("[data-discard]")?.addEventListener("click", () => {
    state.pendingResult = null;
    render();
  });

  // Delete note
  root.querySelectorAll<HTMLButtonElement>("[data-delete-note]").forEach((b) => {
    b.addEventListener("click", () => {
      state.notebook = state.notebook.filter((n) => n.id !== b.dataset.deleteNote);
      render();
    });
  });

  // Threshold slider (countAbove pending result)
  const slider = root.querySelector<HTMLInputElement>("#threshold-slider");
  slider?.addEventListener("input", () => {
    state.thresholdValue = Number(slider.value);
    runTool("countAbove");
  });

  // Memo nav
  root.querySelector<HTMLButtonElement>("[data-go-memo]")?.addEventListener("click", () => setPhase("memo"));
}

function tabBtn(id: LabTab, icon: string, label: string, badge: number): string {
  const on = state.labTab === id;
  return `<button class="lab-tab ${on ? "is-on" : ""}" data-tab="${id}">
    <span class="lab-tab__icon">${icon}</span>
    <span class="lab-tab__label">${label}</span>
    ${badge > 0 ? `<span class="lab-tab__badge">${badge}</span>` : ""}
  </button>`;
}

// ─── Mission tab ───
function renderMissionTab(): string {
  return `
    <section class="mission-panel">
      <article class="brief-card">
        <header><span class="eyebrow">من Alex (زميل)</span></header>
        <p>"${alexLine()}"</p>
        <small>افتح الملفات الـ3 وراجعها قبل ما تبدأ التحليل.</small>
      </article>

      <h3 class="section-title">ملفات في حقيبتك</h3>
      <ul class="mfile-list">
        ${briefcaseFiles.map((f) => `
          <li class="mfile">
            <span class="mfile__icon">${f.icon}</span>
            <div class="mfile__body">
              <strong>${f.title}</strong>
              <small>${f.description}</small>
            </div>
            <button class="mfile__open" data-open-file="${f.id}">افتح</button>
          </li>`).join("")}
      </ul>

      <div class="mission-cta">
        <button class="ghost-cta" data-tab="analysis">
          ابدأ التحليل ←
        </button>
      </div>
    </section>`;
}

// ─── Analysis tab ───
function renderAnalysisTab(): string {
  const d = dataset();
  const tools: ToolId[] = ["mean", "median", "spread", "countAbove"];
  const pinned = state.notebook.length;
  const stepHint = pinned === 0
    ? "ابدأ بأي أداة. كل أداة بتقارن الفريقين جنب بعض."
    : pinned < 2
      ? `كويس، ثبّت أداة كمان عشان تكون متأكد. (${pinned}/2)`
      : `جاهز ✓ — لو حابب جرّب أداة تالتة، أو اضغط "اكتب التوصية" فوق.`;

  return `
    <section class="analysis-panel">
      <div class="progress-strip">
        <strong>الخطوة:</strong> ${escapeHtml(stepHint)}
      </div>

      <div class="teams-banner">
        <span class="team-pill team-pill--a">${d.teamA.name}</span>
        <span class="vs">vs</span>
        <span class="team-pill team-pill--b">${d.teamB.name}</span>
      </div>

      <h3 class="section-title">اختار أداة تحليل</h3>
      <div class="tool-grid">
        ${tools.map((t) => `
          <button class="tool-card" data-run-tool="${t}">
            <span class="tool-card__icon">${toolIcon[t]}</span>
            <span class="tool-card__body">
              <strong>${toolLabel[t]}</strong>
              <small>${toolHint[t]}</small>
            </span>
            <span class="tool-card__cta">شغّل ←</span>
          </button>`).join("")}
      </div>

      ${state.pendingResult ? renderPendingCard(state.pendingResult) : ""}
    </section>`;
}

function renderPendingCard(r: ComparisonResult): string {
  const d = dataset();
  const alreadyPinned = state.notebook.some((n) => n.tool === r.tool && n.threshold === r.threshold);
  return `
    <article class="result-v4">
      <header>
        <span class="result-v4__icon">${toolIcon[r.tool]}</span>
        <div>
          <strong>${r.title}</strong>
          <small>${escapeHtml(r.hint)}</small>
        </div>
      </header>
      <div class="result-v4__compare">
        <div class="rcol rcol--a ${r.winner === "teamA" ? "is-winner" : ""}">
          <small>${d.teamA.name}</small>
          <strong>${escapeHtml(r.displayA)}</strong>
          <p>${escapeHtml(r.summaryA)}</p>
        </div>
        <div class="rcol rcol--b ${r.winner === "teamB" ? "is-winner" : ""}">
          <small>${d.teamB.name}</small>
          <strong>${escapeHtml(r.displayB)}</strong>
          <p>${escapeHtml(r.summaryB)}</p>
        </div>
      </div>
      ${r.tool === "countAbove" ? `
        <div class="threshold-control">
          <label>حدّ القياس: <strong>${state.thresholdValue}%</strong></label>
          <input id="threshold-slider" type="range" min="50" max="150" step="5" value="${state.thresholdValue}" />
        </div>` : ""}
      <footer>
        <button class="text-button" data-discard>🗑 تجاهل</button>
        ${alreadyPinned
          ? `<span class="pinned-tag">✓ مثبّت</span>`
          : `<button class="primary-button" data-pin>📌 ثبّت في دفتري</button>`}
      </footer>
    </article>`;
}

// ─── Notebook tab ───
function renderNotebookTab(): string {
  if (state.notebook.length === 0) {
    return `
      <section class="notebook-empty-v4">
        <p>📓 دفترك فاضي.</p>
        <small>روح لتاب "التحليل"، شغّل أداة، واضغط "ثبّت في دفتري" لو لقيت نتيجة مفيدة.</small>
        <button class="ghost-cta" data-tab="analysis">ادخل التحليل ←</button>
      </section>`;
  }
  const d = dataset();
  return `
    <section class="notebook-v4">
      <h3 class="section-title">ملاحظاتي المثبتة (${state.notebook.length})</h3>
      ${state.notebook.map((n) => `
        <article class="nbcard">
          <header>
            <span>${toolIcon[n.tool]}</span>
            <strong>${n.title}</strong>
            <button class="nbcard__del" data-delete-note="${n.id}">✕</button>
          </header>
          <div class="nbcard__compare">
            <div class="${n.winner === "teamA" ? "is-winner" : ""}">
              <small>${d.teamA.name}</small><strong>${escapeHtml(n.displayA)}</strong>
            </div>
            <div class="${n.winner === "teamB" ? "is-winner" : ""}">
              <small>${d.teamB.name}</small><strong>${escapeHtml(n.displayB)}</strong>
            </div>
          </div>
        </article>`).join("")}
    </section>`;
}

// ─── File modal ───
function openFileModal(id: BriefcaseFileId) {
  state.openFile = id;
  const d = dataset();
  const modal = document.createElement("div");
  modal.className = "phase-overlay phase-overlay--soft file-modal";
  modal.dir = "rtl";
  modal.innerHTML = `
    <article class="file-modal__card">
      <header>
        <h3>${fileTitle(id)}</h3>
        <button class="file-modal__close" data-close-file>✕</button>
      </header>
      <div class="file-modal__body">
        ${renderFileContent(id, d)}
      </div>
    </article>`;
  document.body.appendChild(modal);

  modal.querySelector<HTMLButtonElement>("[data-close-file]")?.addEventListener("click", () => {
    state.openFile = null;
    modal.remove();
  });
  modal.querySelectorAll<HTMLElement>("[data-rep]").forEach((row) => {
    row.addEventListener("click", () => openRepModal(row.dataset.rep!));
  });
}

function fileTitle(id: BriefcaseFileId): string {
  if (id === "salesData") return "📊 بيانات المبيعات الخام";
  if (id === "hrPolicy") return "📑 سياسة الموارد البشرية";
  return "🗒️ ملاحظات Tarek الميدانية";
}

function renderFileContent(id: BriefcaseFileId, d: Dataset): string {
  if (id === "salesData") {
    return `
      <p class="file-hint">اضغط على أي اسم مندوب لتفاصيله.</p>
      ${renderSheet(d.teamA)}
      ${renderSheet(d.teamB)}`;
  }
  if (id === "hrPolicy") {
    return `
      <h4>تعريف الـ Good Performer</h4>
      <p>المندوب الذي يحقق <strong>≥ ${d.threshold}%</strong> من تارجته يعتبر Good Performer.</p>
      <h4>تكلفة فقدان مندوب</h4>
      <p>6 شهور تدريب + خسارة تغطية المنطقة. <strong>فقدان مندوب نجم = خسارة منطقة كاملة.</strong></p>
      <h4>القرارات الممكنة</h4>
      <ul>
        <li><strong>مكافأة + تثبيت</strong> — للفرق اللي تستوفي ${d.threshold}%.</li>
        <li><strong>خطة تطوير</strong> — للفرق اللي محتاجة رفع أداء.</li>
        <li><strong>مراجعة لاحقاً</strong> — لو البيانات قاصرة.</li>
      </ul>`;
  }
  const outlier = d[d.outlierTeam];
  const stars = outlier.reps.filter((r) => r.performance >= 120);
  return `
    <h4>عام</h4>
    <p>الفرق بتشتغل في مناطق مختلفة. فيه ناس بتلفت نظري.</p>
    <h4>مندوبين بأرقام مرتفعة جداً</h4>
    <ul>
      ${stars.map((r) => `<li><strong>${r.name}</strong> (${outlier.name}): قفل صفقة استثنائية. الكلام في الميدان إن المنافس بيعرض عليه.</li>`).join("")}
    </ul>
    <h4>تنبيه</h4>
    <p>متعتمدش على رقم واحد كبير لتقييم فريق كامل.</p>`;
}

function renderSheet(team: { id: TeamId; name: string; region: string; reps: Rep[] }): string {
  return `
    <div class="sheet-v4">
      <header><strong>${team.name}</strong><small>${team.region}</small></header>
      <table>
        <thead><tr><th>الاسم</th><th>الأداء %</th></tr></thead>
        <tbody>
          ${team.reps.map((r) => `
            <tr data-rep="${r.id}">
              <td>${escapeHtml(r.name)}</td>
              <td>${r.performance}%</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openRepModal(repId: string) {
  const d = dataset();
  const allReps = [...d.teamA.reps, ...d.teamB.reps];
  const rep = allReps.find((r) => r.id === repId);
  if (!rep) return;
  const team: TeamId = d.teamA.reps.some((r) => r.id === rep.id) ? "teamA" : "teamB";
  const note = getInspectNote(d, rep.id);

  const modal = document.createElement("div");
  modal.className = "phase-overlay phase-overlay--soft rep-modal";
  modal.dir = "rtl";
  modal.innerHTML = `
    <article class="rep-modal__card">
      <header>
        <strong>${escapeHtml(rep.name)}</strong>
        <button data-close-rep>✕</button>
      </header>
      <ul class="rep-modal__stats">
        <li><span>الفريق</span><strong>${d[team].name}</strong></li>
        <li><span>المنطقة</span><strong>${d[team].region}</strong></li>
        <li><span>الأداء</span><strong>${rep.performance}%</strong></li>
        <li><span>مقابل 85%</span><strong>${rep.performance >= 85 ? "✓ فوق" : "تحت"}</strong></li>
      </ul>
      <div class="rep-modal__note">
        <h5>ملاحظة Tarek</h5>
        <p>${escapeHtml(note)}</p>
      </div>
    </article>`;
  document.body.appendChild(modal);
  modal.querySelector<HTMLButtonElement>("[data-close-rep]")?.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ─── Tool execution (side-by-side) ───

function runTool(tool: ToolId) {
  const d = dataset();
  const aPerfs = d.teamA.reps.map((r) => r.performance);
  const bPerfs = d.teamB.reps.map((r) => r.performance);
  let displayA = "", displayB = "", summaryA = "", summaryB = "";
  let title = toolLabel[tool];
  let winner: TeamId | null = null;
  let threshold: number | undefined;

  switch (tool) {
    case "mean": {
      const a = round1(mean(aPerfs)), b = round1(mean(bPerfs));
      displayA = `${a}%`; displayB = `${b}%`;
      summaryA = "متوسط الأداء";
      summaryB = "متوسط الأداء";
      winner = a > b ? "teamA" : b > a ? "teamB" : null;
      break;
    }
    case "median": {
      const a = round1(median(aPerfs)), b = round1(median(bPerfs));
      displayA = `${a}%`; displayB = `${b}%`;
      summaryA = "القيمة في نص الفريق";
      summaryB = "القيمة في نص الفريق";
      winner = a > b ? "teamA" : b > a ? "teamB" : null;
      break;
    }
    case "spread": {
      const aRange = maxOf(aPerfs) - minOf(aPerfs);
      const bRange = maxOf(bPerfs) - minOf(bPerfs);
      const aSd = round1(sd(aPerfs)), bSd = round1(sd(bPerfs));
      displayA = `${aRange}`; displayB = `${bRange}`;
      summaryA = `من ${minOf(aPerfs)}% لـ ${maxOf(aPerfs)}% · SD=${aSd}`;
      summaryB = `من ${minOf(bPerfs)}% لـ ${maxOf(bPerfs)}% · SD=${bSd}`;
      // Smaller spread = more cohesive (positive)
      winner = aSd < bSd ? "teamA" : bSd < aSd ? "teamB" : null;
      title = "مدى التشتت";
      break;
    }
    case "countAbove": {
      threshold = state.thresholdValue;
      const a = countAbove(aPerfs, threshold);
      const b = countAbove(bPerfs, threshold);
      displayA = `${a}/${aPerfs.length}`;
      displayB = `${b}/${bPerfs.length}`;
      summaryA = `مندوبين فوق ${threshold}%`;
      summaryB = `مندوبين فوق ${threshold}%`;
      winner = a > b ? "teamA" : b > a ? "teamB" : null;
      break;
    }
  }

  const result: ComparisonResult = {
    id: nid(),
    tool,
    title,
    hint: toolHint[tool],
    summaryA, summaryB,
    displayA, displayB,
    winner,
    threshold,
  };
  state.pendingResult = result;
  state.labTab = "analysis";
  render();
}

function pinResult(r: ComparisonResult) {
  // dedupe by tool (countAbove dedupes by threshold)
  state.notebook = state.notebook.filter(
    (n) => !(n.tool === r.tool && (r.tool !== "countAbove" || n.threshold === r.threshold)),
  );
  state.notebook.push({ ...r, pinnedAt: Date.now() });
  state.pendingResult = null;
  toast("📌 اتثبّت في دفترك");
  render();
}

function derivePinnedTools(): ToolUse[] {
  // Each pinned tool covers BOTH teams; emit one ToolUse per team for outcome eval.
  const out: ToolUse[] = [];
  state.notebook.forEach((n) => {
    out.push({ tool: n.tool, team: "teamA", thresholdValue: n.threshold });
    out.push({ tool: n.tool, team: "teamB", thresholdValue: n.threshold });
  });
  return out;
}

function alexLine(): string {
  if (state.notebook.length === 0) return "ليه بتعقّد؟ المتوسط في الجدول الخام كافي.";
  if (state.notebook.length < 2) return "ماشي بتفتح أدوات، بس متضيعش وقت.";
  return "تمام، شكلك بتشوف حاجة أنا ما شفتهاش.";
}

function nid() {
  return Math.random().toString(36).slice(2, 9);
}

// ═══════════════════════════ MEMO ═══════════════════════════

function renderMemo() {
  const d = dataset();
  const metricsPinned = Array.from(new Set(state.notebook.map((n) => n.tool)));
  const rec = state.recommendation;
  const canSubmit =
    metricsPinned.length > 0 &&
    (rec.teamA !== "defer" || rec.teamB !== "defer") &&
    rec.primaryMetric !== null;
  const actions: Action[] = ["reward", "training", "defer"];

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full" dir="rtl">
      <article class="memo-card memo-card--v2">
        <header>
          <span class="eyebrow">${company.name} · مذكرة داخلية</span>
          <h2>توصية مراجعة الأداء — ${d.label}</h2>
          <small>إلى: Nader Sami (CEO) · من: ${state.profile.name}</small>
        </header>
        <section class="memo-body">
          <p>بناءً على تحليل بيانات الفريقين، توصيتي:</p>
          <div class="memo-team">
            <h3>قراري لـ ${d.teamA.name} <small>(${d.teamA.region})</small></h3>
            <div class="action-cards">
              ${actions.map((act) => `<button data-team-action="teamA:${act}" class="action-card ${rec.teamA === act ? "is-on" : ""}">
                <strong>${actionLabel[act]}</strong><small>${actionDescription[act]}</small></button>`).join("")}
            </div>
          </div>
          <div class="memo-team">
            <h3>قراري لـ ${d.teamB.name} <small>(${d.teamB.region})</small></h3>
            <div class="action-cards">
              ${actions.map((act) => `<button data-team-action="teamB:${act}" class="action-card ${rec.teamB === act ? "is-on" : ""}">
                <strong>${actionLabel[act]}</strong><small>${actionDescription[act]}</small></button>`).join("")}
            </div>
          </div>
          <div class="memo-metric">
            <h3>المقياس الأساسي اللي بنيت عليه القرار</h3>
            ${metricsPinned.length === 0
              ? `<p class="memo-warn">⚠ ارجع المكتب وثبّت ولو نتيجة واحدة.</p>`
              : `<select id="memo-metric">
                  <option value="">-- اختار مقياس --</option>
                  ${metricsPinned.map((m) => `<option value="${m}" ${rec.primaryMetric === m ? "selected" : ""}>${toolLabel[m]}</option>`).join("")}
                </select>`}
          </div>
          <p class="memo-warn-soft">⚠ بعد الإرسال، التوصية تروح للـCEO. النتايج تظهر بعد 3 شهور.</p>
        </section>
        <footer class="memo-foot">
          <button class="text-button" data-back-lab>← رجوع للمكتب</button>
          <button class="primary-button memo-send" data-submit ${canSubmit ? "" : "disabled"}>📧 أرسل للـCEO</button>
        </footer>
      </article>
    </div>`;

  root.querySelectorAll<HTMLButtonElement>("[data-team-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [team, act] = String(btn.dataset.teamAction).split(":") as [TeamId, Action];
      if (team === "teamA") state.recommendation.teamA = act;
      else state.recommendation.teamB = act;
      render();
    });
  });
  root.querySelector<HTMLSelectElement>("#memo-metric")?.addEventListener("change", (e) => {
    const v = (e.target as HTMLSelectElement).value;
    state.recommendation.primaryMetric = v ? (v as ToolId) : null;
    render();
  });
  root.querySelector<HTMLButtonElement>("[data-back-lab]")?.addEventListener("click", () => setPhase("lab"));
  root.querySelector<HTMLButtonElement>("[data-submit]")?.addEventListener("click", () => {
    const kind = evaluateOutcome(dataset(), state.recommendation, derivePinnedTools());
    state.outcome = buildOutcome(dataset(), state.recommendation, kind);
    gameEvents.emit("submitrecommendation", { recommendation: state.recommendation });
    sendEmailAnim(() => setPhase("cutscene"));
  });
}

function sendEmailAnim(done: () => void) {
  const fly = document.createElement("div");
  fly.className = "email-fly";
  fly.innerHTML = "📧";
  document.body.appendChild(fly);
  requestAnimationFrame(() => fly.classList.add("is-flying"));
  setTimeout(() => { fly.remove(); done(); }, 900);
}

// ═══════════════════════════ CUTSCENE ═══════════════════════════

function renderCutscene() {
  if (!state.outcome) return;
  const o = state.outcome;
  const tone =
    o.kind === "correct" ? "good"
    : o.kind === "lucky-correct" ? "warn"
    : o.kind === "deferred" || o.kind === "double-reward" || o.kind === "double-training" ? "mixed"
    : "bad";

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--black" dir="rtl">
      <article class="cutscene cutscene--${tone}">
        <header><span class="eyebrow">⏩ بعد 3 شهور</span><h2>${escapeHtml(o.title)}</h2></header>
        <ol class="cutscene-scenes">
          ${o.scenes.map((s, i) => `<li style="animation-delay:${i * 0.25}s">${escapeHtml(s)}</li>`).join("")}
        </ol>
        <article class="reply-email">
          <header><strong>${escapeHtml(o.finalEmail.from)}</strong><span>الآن</span></header>
          <h3>${escapeHtml(o.finalEmail.subject)}</h3>
          <p>${escapeHtml(o.finalEmail.body)}</p>
        </article>
        <button class="primary-button" data-go-retro>شوف التحليل التفصيلي ←</button>
      </article>
    </div>`;
  root.querySelector<HTMLButtonElement>("[data-go-retro]")?.addEventListener("click", () => setPhase("retrospective"));
}

// ═══════════════════════════ RETROSPECTIVE ═══════════════════════════

function renderRetrospective() {
  const d = dataset();
  const usedToolIds = new Set(state.notebook.map((n) => n.tool));
  const allTools = Object.keys(toolLabel) as ToolId[];
  const missed = allTools.filter((t) => !usedToolIds.has(t));

  const aPerfs = d.teamA.reps.map((r) => r.performance);
  const bPerfs = d.teamB.reps.map((r) => r.performance);
  const stats = {
    aMean: round1(mean(aPerfs)), bMean: round1(mean(bPerfs)),
    aMedian: round1(median(aPerfs)), bMedian: round1(median(bPerfs)),
    aSd: round1(sd(aPerfs)), bSd: round1(sd(bPerfs)),
    aAbove: countAbove(aPerfs, d.threshold), bAbove: countAbove(bPerfs, d.threshold),
  };
  const nextVariant: DatasetVariantId = ((state.variantId + 1) % 3) as DatasetVariantId;

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full" dir="rtl">
      <article class="retro">
        <header>
          <span class="eyebrow">Retrospective · ${d.label}</span>
          <h2>اللي شفته vs. اللي كانت البيانات بتقوله</h2>
        </header>
        <div class="retro-grid">
          <section class="retro-col">
            <h3>اللي عملته</h3>
            <ul class="tool-checklist">
              ${allTools.map((t) => `<li class="${usedToolIds.has(t) ? "is-done" : "is-skipped"}">
                ${usedToolIds.has(t) ? "✓" : "✗"} ${toolLabel[t]}</li>`).join("")}
            </ul>
            ${missed.length > 0
              ? `<p class="retro-missed">⚠ ${missed.length} أداة ما فتحتهاش — فيهم أدوات كانت ممكن تغيّر القرار.</p>`
              : `<p class="retro-missed retro-missed--ok">استخدمت كل الأدوات المتاحة.</p>`}
            <p><strong>توصيتك:</strong></p>
            <p>• ${d.teamA.name}: ${actionLabel[state.recommendation.teamA]}</p>
            <p>• ${d.teamB.name}: ${actionLabel[state.recommendation.teamB]}</p>
          </section>
          <section class="retro-col retro-col--truth">
            <h3>اللي البيانات قالته</h3>
            <table class="truth-table">
              <thead><tr><th></th><th>${d.teamA.name}</th><th>${d.teamB.name}</th></tr></thead>
              <tbody>
                <tr><td>المتوسط</td><td>${stats.aMean}%</td><td>${stats.bMean}%</td></tr>
                <tr><td>الوسيط</td><td>${stats.aMedian}%</td><td>${stats.bMedian}%</td></tr>
                <tr><td>الانحراف</td><td>${stats.aSd}</td><td>${stats.bSd}</td></tr>
                <tr class="truth-key"><td>≥ ${d.threshold}%</td><td>${stats.aAbove}/10</td><td>${stats.bAbove}/10</td></tr>
              </tbody>
            </table>
            <p class="retro-lesson">
              <strong>المستحق للمكافأة:</strong> ${d[d.healthyTeam].name} —
              ${stats[d.healthyTeam === "teamA" ? "aAbove" : "bAbove"]}/10 مندوبين فوق سياسة الـ${d.threshold}%، والتشتت صغير.
              <br/>
              <strong>المحتاج تطوير:</strong> ${d[d.outlierTeam].name} —
              المتوسط مضلِّل بسبب 3 مندوبين بأرقام شاذة.
            </p>
          </section>
        </div>
        <footer class="retro-foot">
          <button class="secondary-button" data-replay>🔁 العب تاني (${["Q2", "Q3", "Q4"][nextVariant]})</button>
        </footer>
      </article>
    </div>`;
  root.querySelector<HTMLButtonElement>("[data-replay]")?.addEventListener("click", () => {
    state = freshState(state.profile, nextVariant);
    render();
  });
}

// ═══════════════════════════ UTIL ═══════════════════════════

function toast(msg: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-on"));
  setTimeout(() => { el.classList.remove("is-on"); setTimeout(() => el.remove(), 250); }, 2200);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

// kept for legacy imports
export type { BriefcaseFile };
