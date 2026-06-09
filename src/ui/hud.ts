// HUD = Game phase orchestrator for The Analyst: First Quarter
// Phases: cold-open → field → lab → memo → cutscene → retrospective
//
// Design rules (from approved plan):
//  - Analyst language, not statistician jargon. Tools live in 4 named categories.
//  - Nothing auto-saves. Player explicitly pins a result to the notebook, or discards it.
//  - Inspect is a side panel on rep names; it never enters the notebook.
//  - Field visit hands the player 3 physical files. Desk only unlocks when 3/3 collected.
//  - Cold open is an interactive laptop boot → inbox → CEO email. No premature gut-check.

import { briefcaseFiles, company, dialogues, getInspectNote, npcs } from "../data/salesCase";
import { gameEvents } from "../game/events";
import {
  actionDescription,
  actionLabel,
  buildOutcome,
  categoryHint,
  categoryLabel,
  countAbove,
  evaluateOutcome,
  getDataset,
  maxOf,
  mean,
  median,
  minOf,
  mode,
  quartiles,
  range,
  round1,
  sd,
  toolCategory,
  toolLabel,
  toolShort,
  type ToolUse,
} from "../game/simulation";
import type {
  Action,
  BriefcaseFile,
  BriefcaseFileId,
  Dataset,
  DatasetVariantId,
  GamePhase,
  NPCId,
  NotebookCard,
  Outcome,
  PendingResult,
  PlayerProfile,
  Recommendation,
  TeamId,
  ToolCategory,
  ToolId,
} from "../game/types";

type DeskTab = "files" | "tools" | "notebook";
type WorkspaceView =
  | { kind: "empty" }
  | { kind: "file"; file: BriefcaseFileId }
  | { kind: "result"; result: PendingResult };

type State = {
  profile: PlayerProfile;
  variantId: DatasetVariantId;
  phase: GamePhase;
  // Cold open
  coldOpenStage: "laptop" | "inbox" | "email";
  // Field — files collected from NPCs
  collected: Set<BriefcaseFileId>;
  visited: Set<NPCId>;
  // Lab
  pinnedTools: ToolUse[];
  notebook: NotebookCard[];
  deskTab: DeskTab;
  workspace: WorkspaceView;
  toolTeam: TeamId; // which team the next tool applies to
  selectedRepId?: string; // for inspect side panel
  thresholdValue: number;
  thresholdEverDragged: boolean;
  // Memo
  recommendation: Recommendation;
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
    pinnedTools: [],
    notebook: [],
    deskTab: "files",
    workspace: { kind: "empty" },
    toolTeam: "teamA",
    thresholdValue: 85,
    thresholdEverDragged: false,
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

// ═══════════════════════════ COLD OPEN ═══════════════════════════
// Interactive sequence: dark laptop → boot → inbox → click email → start day.

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
      </div>
    `;
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
                <li class="inbox-item inbox-item--read">
                  <span class="inbox-dot inbox-dot--read"></span>
                  <div>
                    <strong>HR Bulletin</strong>
                    <small>تذكير: تحديث بيانات الموظفين</small>
                  </div>
                  <span class="inbox-time">أمس</span>
                </li>
                <li class="inbox-item inbox-item--read">
                  <span class="inbox-dot inbox-dot--read"></span>
                  <div>
                    <strong>IT Support</strong>
                    <small>ترحيب باللاب توب الجديد</small>
                  </div>
                  <span class="inbox-time">أمس</span>
                </li>
              </ul>
              <p class="inbox-hint">↑ افتح الإيميل اللي من CEO</p>
            </div>
          </div>
        </div>
      </div>
    `;
    root.querySelector<HTMLElement>("[data-open-email]")?.addEventListener("click", () => {
      state.coldOpenStage = "email";
      render();
    });
    return;
  }

  // stage === "email"
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
              <p>
                النهارده محتاجك تراجع أداء فريقي المبيعات Q2 وتطلعلي بتوصية واضحة:
                <strong>مين ياخد المكافأة، ومين يحتاج خطة تطوير</strong>.
              </p>
              <p>
                اللي محتاجه منك ترتيب بسيط:
                <br/>1. روح اقعد مع <strong>Karim</strong> (مدير المبيعات) ياخدك على السياق.
                <br/>2. عدّي على <strong>Hala</strong> (الموارد البشرية) تاخد منها السياسة الرسمية.
                <br/>3. اتكلم مع <strong>Tarek</strong> (العمليات الميدانية) — هو الوحيد اللي شايف المندوبين على الأرض.
                <br/>4. ارجع مكتبك وحلّل البيانات وابعتلي مذكرتك الرسمية بالتوصية.
              </p>
              <p>القرار النهائي هيتم بناءً على توصيتك. اعتمد على نفسك.</p>
              <p class="email-letter__sign">— Nader</p>
              <button class="primary-button" data-start>أبدأ يومي ←</button>
            </article>
          </div>
        </div>
      </div>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("[data-start]")?.addEventListener("click", () => {
    setPhase("field");
  });
}

// ═══════════════════════════ FIELD ═══════════════════════════
// Phaser scene visible behind. Minimal HUD: briefcase counter + objective.

function renderField() {
  const count = state.collected.size;
  const allDone = count >= 3;
  const order: NPCId[] = ["karim", "hala", "tarek"];
  const remaining: NPCId[] = order.filter((id) => !state.visited.has(id));

  root.innerHTML = `
    <div class="field-hud" dir="rtl">
      <header class="field-bar">
        <div class="field-bar__brand">
          <strong>${company.name}</strong>
          <small>${state.profile.name} · محلل بيانات</small>
        </div>
        <div class="field-bar__count ${allDone ? "is-ready" : ""}">
          <span>الحقيبة</span>
          <strong>${count}/3</strong>
        </div>
      </header>

      <div class="field-objective ${allDone ? "is-ready" : ""}">
        ${
          allDone
            ? "✅ جمعت كل الملفات — افتح مكتبك من الأسفل"
            : `🎯 المطلوب: كلّم ${remaining.map((id) => npcs[id].name.split(" ")[0]).join("، ")}`
        }
      </div>

      <nav class="npc-rail" aria-label="الشخصيات">
        ${order
          .map((id) => {
            const f = briefcaseFiles.find((x) => x.source === id);
            const done = f ? state.collected.has(f.id) : false;
            const emoji = id === "karim" ? "👔" : id === "hala" ? "👩‍💼" : "🧑‍🔧";
            return `<button class="npc-chip ${done ? "is-done" : ""}" data-talk="${id}">
              <span class="npc-chip__avatar">${emoji}</span>
              <span class="npc-chip__body">
                <strong>${npcs[id].name.split(" ")[0]}</strong>
                <small>${npcs[id].role}</small>
              </span>
              <span class="npc-chip__state">${done ? "✓ تم" : "كلّمه ←"}</span>
            </button>`;
          })
          .join("")}
      </nav>

      <aside class="briefcase-sheet" data-open="${allDone ? "true" : "false"}">
        <button class="briefcase-sheet__handle" data-toggle-sheet aria-label="فتح/قفل الحقيبة">
          <span>🧰 حقيبتك · ${count}/3 ملفات</span>
          <span class="briefcase-sheet__chev">▾</span>
        </button>
        <div class="briefcase-sheet__body">
          <ul class="briefcase-list">
            ${briefcaseFiles
              .map((f) => {
                const got = state.collected.has(f.id);
                return `<li class="${got ? "is-got" : "is-missing"}">
                  <span class="briefcase-icon">${f.icon}</span>
                  <div>
                    <strong>${f.title}</strong>
                    <small>${got ? "✓ معك" : "من " + npcs[f.source].name.split(" ")[0]}</small>
                  </div>
                </li>`;
              })
              .join("")}
          </ul>
          ${
            allDone
              ? `<button class="primary-button" data-open-lab>📂 ادخل مكتبك وحلّل ←</button>`
              : `<p class="briefcase-hint">اضغط على شخصية فوق علشان تتكلم معاها وتاخد ملفها.</p>`
          }
        </div>
      </aside>
    </div>
  `;

  root.querySelectorAll<HTMLButtonElement>("[data-talk]").forEach((b) => {
    b.addEventListener("click", () => {
      gameEvents.emit("npcinteract", { npc: b.dataset.talk as NPCId });
    });
  });
  root.querySelector<HTMLButtonElement>("[data-toggle-sheet]")?.addEventListener("click", () => {
    const sheet = root.querySelector<HTMLElement>(".briefcase-sheet");
    if (!sheet) return;
    sheet.dataset.open = sheet.dataset.open === "true" ? "false" : "true";
  });
  root.querySelector<HTMLButtonElement>("[data-open-lab]")?.addEventListener("click", () => {
    setPhase("lab");
  });
}

function openDialogue(id: NPCId) {
  if (id === "ceo" || id === "alex") return; // not in field
  state.visited.add(id);
  const lines = dialogues[id];
  const npc = npcs[id];
  const fileForNpc = briefcaseFiles.find((f) => f.source === id);
  const alreadyCollected = fileForNpc ? state.collected.has(fileForNpc.id) : true;

  const modal = document.createElement("div");
  modal.className = "phase-overlay phase-overlay--soft";
  modal.dir = "rtl";
  modal.innerHTML = `
    <article class="dialogue-card">
      <header>
        <div>
          <strong>${npc.name}</strong>
          <span>${npc.role}</span>
        </div>
        <span class="dialogue-location">${npc.location}</span>
      </header>
      <ol class="dialogue-lines">
        ${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}
      </ol>
      <footer class="dialogue-foot">
        ${
          fileForNpc && !alreadyCollected
            ? `<button class="primary-button" data-take-file>📂 خد الملف</button>`
            : `<button class="primary-button" data-close>تمام</button>`
        }
      </footer>
    </article>
  `;
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

// ═══════════════════════════ LAB (DESK) ═══════════════════════════

function renderLab() {
  const d = dataset();
  root.innerHTML = `
    <div class="phase-overlay phase-overlay--full lab-shell" dir="rtl">
      <header class="lab-top">
        <div>
          <span class="eyebrow">${company.name} · مكتب المحلل</span>
          <h2>${d.label}</h2>
          <small>${state.profile.name} — Senior Data Analyst</small>
        </div>
        <div class="lab-top__right">
          <div class="alex-chip">
            <strong>Alex (زميل)</strong>
            <p>"${alexLine()}"</p>
          </div>
          <button class="primary-button" data-go-memo ${
            state.notebook.length === 0 ? "disabled" : ""
          }>📧 اكتب التوصية</button>
        </div>
      </header>

      <div class="lab-grid">
        <aside class="lab-dock">
          ${dockBtn("files", "📁", "ملفاتي", `${state.collected.size}`)}
          ${dockBtn("tools", "🧮", "أدوات التحليل", "")}
          ${dockBtn("notebook", "📝", "دفتر الملاحظات", `${state.notebook.length}`)}
        </aside>

        <section class="lab-side">
          ${renderDockContent()}
        </section>

        <section class="lab-workspace">
          ${renderWorkspace()}
        </section>

        <aside class="lab-inspect">
          ${renderInspectPanel()}
        </aside>
      </div>
    </div>
  `;

  // Dock tabs
  root.querySelectorAll<HTMLButtonElement>("[data-dock]").forEach((b) => {
    b.addEventListener("click", () => {
      state.deskTab = b.dataset.dock as DeskTab;
      render();
    });
  });

  // Open file
  root.querySelectorAll<HTMLElement>("[data-open-file]").forEach((b) => {
    b.addEventListener("click", () => {
      state.workspace = { kind: "file", file: b.dataset.openFile as BriefcaseFileId };
      state.selectedRepId = undefined;
      render();
    });
  });

  // Tool team toggle
  root.querySelectorAll<HTMLButtonElement>("[data-tool-team]").forEach((b) => {
    b.addEventListener("click", () => {
      state.toolTeam = b.dataset.toolTeam as TeamId;
      render();
    });
  });

  // Run tool
  root.querySelectorAll<HTMLButtonElement>("[data-run-tool]").forEach((b) => {
    b.addEventListener("click", () => runTool(b.dataset.runTool as ToolId));
  });

  // Pin / discard
  root.querySelector<HTMLButtonElement>("[data-pin]")?.addEventListener("click", () => {
    if (state.workspace.kind === "result") pinResult(state.workspace.result);
  });
  root.querySelector<HTMLButtonElement>("[data-discard]")?.addEventListener("click", () => {
    state.workspace = { kind: "empty" };
    render();
  });

  // Notebook delete
  root.querySelectorAll<HTMLButtonElement>("[data-delete-note]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.dataset.deleteNote!;
      state.notebook = state.notebook.filter((n) => n.id !== id);
      state.pinnedTools = derivePinnedTools();
      render();
    });
  });

  // Rep selection from spreadsheet
  root.querySelectorAll<HTMLElement>("[data-select-rep]").forEach((b) => {
    b.addEventListener("click", () => {
      state.selectedRepId = b.dataset.selectRep!;
      render();
    });
  });
  root.querySelector<HTMLButtonElement>("[data-close-inspect]")?.addEventListener("click", () => {
    state.selectedRepId = undefined;
    render();
  });

  // Threshold slider (in workspace when countAbove result is showing)
  const slider = root.querySelector<HTMLInputElement>("#threshold-slider");
  slider?.addEventListener("input", () => {
    state.thresholdValue = Number(slider.value);
    state.thresholdEverDragged = true;
    if (state.workspace.kind === "result" && state.workspace.result.tool === "countAbove") {
      runTool("countAbove", false); // refresh result without re-pinning
    } else {
      const lbl = document.getElementById("threshold-display");
      if (lbl) lbl.textContent = `${state.thresholdValue}%`;
    }
  });

  // Memo nav
  root.querySelector<HTMLButtonElement>("[data-go-memo]")?.addEventListener("click", () => {
    setPhase("memo");
  });
}

function dockBtn(id: DeskTab, icon: string, label: string, badge: string) {
  const active = state.deskTab === id;
  return `<button class="dock-btn ${active ? "is-on" : ""}" data-dock="${id}">
    <span class="dock-btn__icon">${icon}</span>
    <span class="dock-btn__label">${label}</span>
    ${badge ? `<span class="dock-btn__badge">${badge}</span>` : ""}
  </button>`;
}

function renderDockContent(): string {
  if (state.deskTab === "files") return renderFilesDock();
  if (state.deskTab === "tools") return renderToolsDock();
  return renderNotebookDock();
}

function renderFilesDock(): string {
  return `
    <h3 class="dock-title">ملفات في حقيبتك</h3>
    <ul class="file-list">
      ${briefcaseFiles
        .map((f) => {
          const got = state.collected.has(f.id);
          return `<li class="file-row ${got ? "is-got" : "is-missing"}" ${
            got ? `data-open-file="${f.id}"` : ""
          }>
            <span class="file-icon">${f.icon}</span>
            <div>
              <strong>${f.title}</strong>
              <small>${f.description}</small>
            </div>
            ${got ? `<span class="file-cta">افتح</span>` : `<span class="file-missing">مفقود</span>`}
          </li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderToolsDock(): string {
  const d = dataset();
  const cats: ToolCategory[] = ["central", "spread", "distribution", "conditional"];
  return `
    <h3 class="dock-title">أدوات التحليل</h3>
    <div class="team-toggle">
      <span>طبّق على:</span>
      <button class="${state.toolTeam === "teamA" ? "is-on" : ""}" data-tool-team="teamA">${d.teamA.name}</button>
      <button class="${state.toolTeam === "teamB" ? "is-on" : ""}" data-tool-team="teamB">${d.teamB.name}</button>
    </div>
    <div class="tool-cats">
      ${cats
        .map((cat) => {
          const tools = (Object.keys(toolLabel) as ToolId[]).filter(
            (t) => toolCategory[t] === cat,
          );
          return `<section class="tool-cat">
            <header>
              <strong>${categoryLabel[cat]}</strong>
              <small>${categoryHint[cat]}</small>
            </header>
            <div class="tool-cat__list">
              ${tools
                .map(
                  (t) => `<button class="tool-pill" data-run-tool="${t}">
                    ${toolLabel[t]}
                  </button>`,
                )
                .join("")}
            </div>
          </section>`;
        })
        .join("")}
    </div>
  `;
}

function renderNotebookDock(): string {
  if (state.notebook.length === 0) {
    return `<h3 class="dock-title">دفتر الملاحظات</h3>
      <p class="notebook-empty">الدفتر فاضي. لما تشغّل أداة وتشوف نتيجة، اضغط <strong>"📌 ثبّت في الدفتر"</strong> لو شفتها مهمة.</p>`;
  }
  const groups: Record<TeamId | "compare", NotebookCard[]> = {
    teamA: state.notebook.filter((n) => n.team === "teamA"),
    teamB: state.notebook.filter((n) => n.team === "teamB"),
    compare: [],
  };
  const d = dataset();
  return `<h3 class="dock-title">دفتر الملاحظات (${state.notebook.length})</h3>
    ${(["teamA", "teamB"] as TeamId[])
      .map((t) => {
        const items = groups[t];
        if (items.length === 0) return "";
        return `<div class="note-group">
          <header>${d[t].name}</header>
          <ul>
            ${items
              .map(
                (n) => `<li class="note-item">
                  <div>
                    <strong>${toolShort[n.tool]}</strong>
                    <span>${escapeHtml(n.summary)}</span>
                  </div>
                  <button class="note-del" data-delete-note="${n.id}" title="احذف">✕</button>
                </li>`,
              )
              .join("")}
          </ul>
        </div>`;
      })
      .join("")}
  `;
}

function renderWorkspace(): string {
  const w = state.workspace;
  if (w.kind === "empty") {
    return `<div class="workspace-empty">
      <p>منطقة العمل فاضية.</p>
      <small>افتح ملف من حقيبتك، أو شغّل أداة من القائمة على اليمين.</small>
    </div>`;
  }

  if (w.kind === "file") {
    return renderFileView(w.file);
  }

  // result
  const r = w.result;
  const pinned = state.notebook.some((n) => n.tool === r.tool && n.team === r.team);
  return `
    <article class="result-card">
      <header>
        <span class="eyebrow">${categoryLabel[toolCategory[r.tool]]}</span>
        <h3>${r.title}</h3>
        <small>على ${dataset()[r.team].name}</small>
      </header>
      <div class="result-body">${renderResultVisual(r)}</div>
      <footer class="result-actions">
        <button class="text-button" data-discard>🗑 امسح</button>
        ${
          pinned
            ? `<span class="pinned-tag">✓ مثبّت في الدفتر</span>`
            : `<button class="primary-button" data-pin>📌 ثبّت في الدفتر</button>`
        }
      </footer>
    </article>
  `;
}

function renderFileView(id: BriefcaseFileId): string {
  const d = dataset();
  if (id === "salesData") {
    return `
      <article class="file-view">
        <header>
          <span class="eyebrow">📊 ملف</span>
          <h3>بيانات المبيعات الخام — ${d.label}</h3>
          <small>اضغط على اسم مندوب لتفاصيله. اختار فريق من قائمة الأدوات لتشغيل أداة.</small>
        </header>
        <div class="sheet-wrap">
          ${renderSheet(d.teamA)}
          ${renderSheet(d.teamB)}
        </div>
      </article>
    `;
  }
  if (id === "hrPolicy") {
    return `
      <article class="file-view file-view--doc">
        <header>
          <span class="eyebrow">📑 وثيقة رسمية</span>
          <h3>سياسة الموارد البشرية — التقييم والمكافآت</h3>
        </header>
        <div class="doc-body">
          <h4>1. تعريف الـ Good Performer</h4>
          <p>المندوب الذي يحقق <strong>≥ ${d.threshold}%</strong> من تارجته الشهري (${d.targetK} ألف جنيه) يعتبر "Good Performer" وفقاً للسياسة المعتمدة.</p>
          <h4>2. معدل ترك المندوبين (Attrition)</h4>
          <p>متوسط تكلفة استبدال مندوب في قطاع توزيع الدوا: 6 أشهر تدريب + خسارة تغطية المنطقة. <strong>فقدان مندوب نجم = خسارة منطقة كاملة لفترة طويلة.</strong></p>
          <h4>3. القرارات الممكنة في مراجعة الربع</h4>
          <ul>
            <li><strong>مكافأة + تثبيت:</strong> للفرق التي تستوفي معيار الـ${d.threshold}%.</li>
            <li><strong>خطة تطوير:</strong> للفرق التي تحتاج رفع الأداء.</li>
            <li><strong>مراجعة لاحقاً:</strong> فقط حين تكون البيانات قاصرة.</li>
          </ul>
        </div>
      </article>
    `;
  }
  // fieldNotes
  const outlierTeam = d[d.outlierTeam];
  const outlierReps = outlierTeam.reps.filter((r) => r.performance >= 120);
  return `
    <article class="file-view file-view--doc">
      <header>
        <span class="eyebrow">🗒️ ملاحظات ميدانية — Tarek</span>
        <h3>زيارات الربع</h3>
      </header>
      <div class="doc-body">
        <h4>عام</h4>
        <p>الفرق بتشتغل في مناطق مختلفة، ظروف السوق مش متطابقة 100%. بس فيه ناس بتلفت نظري.</p>
        <h4>مندوبين بأرقام مرتفعة جداً</h4>
        <ul>
          ${outlierReps
            .map(
              (r) => `<li><strong>${r.name}</strong> (${outlierTeam.name}): قفل صفقة استثنائية الربع ده. الكلام في الميدان إن المنافس بيعرض عليه. الموضوع مش مستقر.</li>`,
            )
            .join("")}
        </ul>
        <h4>تنبيه</h4>
        <p>متعتمدش على رقم واحد كبير لتقييم فريق كامل. ابص على باقي الفريق برضه.</p>
      </div>
    </article>
  `;
}

function renderSheet(team: { id: TeamId; name: string; region: string; reps: { id: string; name: string; performance: number }[] }) {
  return `
    <div class="sheet">
      <header>
        <strong>${team.name}</strong>
        <small>${team.region} · ${team.reps.length} مندوب</small>
      </header>
      <table>
        <thead>
          <tr><th>الرقم</th><th>الاسم</th><th>الأداء %</th></tr>
        </thead>
        <tbody>
          ${team.reps
            .map((r) => {
              const selected = state.selectedRepId === r.id;
              return `<tr class="${selected ? "is-selected" : ""}" data-select-rep="${r.id}">
                <td>${r.id.toUpperCase()}</td>
                <td>${escapeHtml(r.name)}</td>
                <td>${r.performance}%</td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderInspectPanel(): string {
  if (!state.selectedRepId) {
    return `<div class="inspect-empty">
      <h4>تفاصيل المندوب</h4>
      <p>اضغط على أي مندوب في الجدول لقراءة تفاصيله.</p>
      <small>الملاحظات الفردية مش بتترسب في الدفتر — مجرد قراءة.</small>
    </div>`;
  }
  const d = dataset();
  const allReps = [...d.teamA.reps, ...d.teamB.reps];
  const rep = allReps.find((r) => r.id === state.selectedRepId);
  if (!rep) return "";
  const team: TeamId = d.teamA.reps.some((r) => r.id === rep.id) ? "teamA" : "teamB";
  const note = getInspectNote(d, rep.id);
  return `
    <div class="inspect-card">
      <header>
        <strong>${escapeHtml(rep.name)}</strong>
        <button class="inspect-close" data-close-inspect>✕</button>
      </header>
      <ul class="inspect-stats">
        <li><span>الرقم</span><strong>${rep.id.toUpperCase()}</strong></li>
        <li><span>الفريق</span><strong>${d[team].name}</strong></li>
        <li><span>المنطقة</span><strong>${d[team].region}</strong></li>
        <li><span>الأداء %</span><strong>${rep.performance}%</strong></li>
        <li><span>مقابل سياسة 85%</span><strong>${rep.performance >= 85 ? "✓ فوق" : "تحت"}</strong></li>
      </ul>
      <div class="inspect-note">
        <h5>ملاحظة Tarek</h5>
        <p>${escapeHtml(note)}</p>
      </div>
    </div>
  `;
}

function renderResultVisual(r: PendingResult): string {
  const d = dataset();
  const perfs = d[r.team].reps.map((p) => p.performance);

  switch (r.tool) {
    case "mean":
    case "median":
    case "mode":
    case "sd": {
      return `<div class="stat-big">${escapeHtml(r.summary)}</div>`;
    }
    case "range": {
      return `<div class="stat-big">${escapeHtml(r.summary)}</div>`;
    }
    case "dotplot": {
      return `<div class="viz-wrap">${renderDotPlot(d[r.team], perfs)}</div>
        <p class="viz-cap">${escapeHtml(r.summary)}</p>`;
    }
    case "boxplot": {
      return `<div class="viz-wrap">${renderBoxPlot(d[r.team], perfs)}</div>
        <p class="viz-cap">${escapeHtml(r.summary)}</p>`;
    }
    case "countAbove": {
      const c = countAbove(perfs, state.thresholdValue);
      return `
        <div class="count-result">
          <div class="count-big">${c} <small>من ${perfs.length}</small></div>
          <p>مندوبين <strong>فوق ${state.thresholdValue}%</strong> في ${d[r.team].name}.</p>
        </div>
        <div class="threshold-control">
          <label>حدّ القياس: <strong id="threshold-display">${state.thresholdValue}%</strong></label>
          <input id="threshold-slider" type="range" min="0" max="200" step="5" value="${state.thresholdValue}" />
          <small>سحبت الـ slider؟ ثبّت النتيجة لمّا توصل لرقم بيقولّك حاجة.</small>
        </div>
      `;
    }
    default:
      return `<p>${escapeHtml(r.summary)}</p>`;
  }
}

// ─── Tool execution ─────────────────────────

function runTool(tool: ToolId, switchView = true) {
  const team = state.toolTeam;
  const d = dataset();
  const perfs = d[team].reps.map((r) => r.performance);
  const tName = d[team].name;
  let title = toolShort[tool];
  let summary = "";

  switch (tool) {
    case "mean": {
      const v = round1(mean(perfs));
      summary = `متوسط ${tName} = ${v}%`;
      break;
    }
    case "median": {
      const v = round1(median(perfs));
      summary = `وسيط ${tName} = ${v}%`;
      break;
    }
    case "mode": {
      const m = mode(perfs);
      if (m.freq <= 1) {
        summary = `${tName}: لا يوجد منوال واضح (كل القيم متفرّدة). المنوال غير مفيد في هذه البيانات.`;
      } else {
        summary = `منوال ${tName} = ${m.values.join("، ")}% (تكرر ${m.freq} مرات)`;
      }
      break;
    }
    case "range": {
      const lo = minOf(perfs);
      const hi = maxOf(perfs);
      summary = `مدى ${tName}: من ${lo}% إلى ${hi}% (الفرق ${round1(hi - lo)})`;
      break;
    }
    case "sd": {
      const s = round1(sd(perfs));
      summary = `الانحراف المعياري لـ${tName} = ${s} — ${s > 20 ? "فريق متفرّق، فيه تباين كبير" : "فريق متماسك، الأداء متقارب"}`;
      break;
    }
    case "dotplot": {
      summary = `مخطط نقاط لـ${tName} يوضّح كل قيمة على محور الأداء.`;
      break;
    }
    case "boxplot": {
      const q = quartiles(perfs);
      summary = `${tName}: الوسيط ${round1(q.med)}%، الربع الأول ${round1(q.q1)}%، الربع الثالث ${round1(q.q3)}%.`;
      break;
    }
    case "countAbove": {
      const c = countAbove(perfs, state.thresholdValue);
      summary = `${c}/${perfs.length} مندوب من ${tName} فوق ${state.thresholdValue}%`;
      break;
    }
  }

  const result: PendingResult = {
    id: nid(),
    tool,
    team,
    title,
    summary,
    threshold: tool === "countAbove" ? state.thresholdValue : undefined,
  };

  if (switchView) {
    state.workspace = { kind: "result", result };
    state.deskTab = "tools";
  } else {
    state.workspace = { kind: "result", result };
  }
  render();
}

function pinResult(r: PendingResult) {
  // dedupe: replace previous pin of same tool+team (except countAbove which may differ by threshold)
  state.notebook = state.notebook.filter(
    (n) => !(n.tool === r.tool && n.team === r.team && r.tool !== "countAbove"),
  );
  state.notebook.push({
    id: r.id,
    tool: r.tool,
    team: r.team,
    title: r.title,
    summary: r.summary,
    pinnedAt: Date.now(),
  });
  state.pinnedTools = derivePinnedTools();
  toast("📌 اتثبّت في الدفتر");
  render();
}

function derivePinnedTools(): ToolUse[] {
  return state.notebook.map((n) => {
    const use: ToolUse = { tool: n.tool, team: n.team };
    if (n.tool === "countAbove") {
      const m = n.summary.match(/فوق\s+(\d+)%/);
      if (m) use.thresholdValue = Number(m[1]);
    }
    return use;
  });
}

function alexLine(): string {
  if (state.notebook.length === 0) return "ليه بتعقّد؟ المتوسط في الجدول الخام كافي.";
  if (state.notebook.length < 3) return "أنا بقالي قدّمت. متضيعش وقتك.";
  return "ماشي، لو لقيت حاجة تستحق، قولّي.";
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
          <small>إلى: Nader Sami (CEO) · من: ${state.profile.name} (محلل بيانات)</small>
        </header>

        <section class="memo-body">
          <p>بناءً على تحليل بيانات الفريقين، توصيتي كما يلي:</p>

          <div class="memo-team">
            <h3>قراري لـ ${d.teamA.name} <small>(${d.teamA.region})</small></h3>
            <div class="action-cards">
              ${actions
                .map(
                  (act) => `<button data-team-action="teamA:${act}" class="action-card ${rec.teamA === act ? "is-on" : ""}">
                    <strong>${actionLabel[act]}</strong>
                    <small>${actionDescription[act]}</small>
                  </button>`,
                )
                .join("")}
            </div>
          </div>

          <div class="memo-team">
            <h3>قراري لـ ${d.teamB.name} <small>(${d.teamB.region})</small></h3>
            <div class="action-cards">
              ${actions
                .map(
                  (act) => `<button data-team-action="teamB:${act}" class="action-card ${rec.teamB === act ? "is-on" : ""}">
                    <strong>${actionLabel[act]}</strong>
                    <small>${actionDescription[act]}</small>
                  </button>`,
                )
                .join("")}
            </div>
          </div>

          <div class="memo-metric">
            <h3>المقياس الأساسي اللي بنيت عليه القرار</h3>
            ${
              metricsPinned.length === 0
                ? `<p class="memo-warn">⚠ ما ثبّتش أي نتيجة في دفتر الملاحظات. ارجع للمكتب وثبّت ولو نتيجة واحدة.</p>`
                : `<select id="memo-metric">
                    <option value="">-- اختار مقياس من اللي ثبّتهم --</option>
                    ${metricsPinned
                      .map(
                        (m) =>
                          `<option value="${m}" ${rec.primaryMetric === m ? "selected" : ""}>${toolLabel[m]}</option>`,
                      )
                      .join("")}
                  </select>`
            }
          </div>

          <p class="memo-warn-soft">
            ⚠ بعد الإرسال، التوصية بتروح للـCEO على طول. النتايج هتظهر بعد 3 شهور. مفيش رجوع.
          </p>
        </section>

        <footer class="memo-foot">
          <button class="text-button" data-back-lab>← رجوع للمكتب</button>
          <button class="primary-button memo-send" data-submit ${canSubmit ? "" : "disabled"}>
            📧 أرسل الإيميل للـCEO
          </button>
        </footer>
      </article>
    </div>
  `;

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
  root.querySelector<HTMLButtonElement>("[data-back-lab]")?.addEventListener("click", () =>
    setPhase("lab"),
  );
  root.querySelector<HTMLButtonElement>("[data-submit]")?.addEventListener("click", () => {
    const kind = evaluateOutcome(dataset(), state.recommendation, state.pinnedTools);
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
  setTimeout(() => {
    fly.remove();
    done();
  }, 900);
}

// ═══════════════════════════ CUTSCENE ═══════════════════════════

function renderCutscene() {
  if (!state.outcome) return;
  const o = state.outcome;
  const tone =
    o.kind === "correct"
      ? "good"
      : o.kind === "lucky-correct"
        ? "warn"
        : o.kind === "deferred"
          ? "mixed"
          : o.kind === "double-reward" || o.kind === "double-training"
            ? "mixed"
            : "bad";

  root.innerHTML = `
    <div class="phase-overlay phase-overlay--black" dir="rtl">
      <article class="cutscene cutscene--${tone}">
        <header>
          <span class="eyebrow">⏩ بعد 3 شهور</span>
          <h2>${escapeHtml(o.title)}</h2>
        </header>
        <ol class="cutscene-scenes">
          ${o.scenes.map((s, i) => `<li style="animation-delay:${i * 0.25}s">${escapeHtml(s)}</li>`).join("")}
        </ol>
        <article class="reply-email">
          <header>
            <strong>${escapeHtml(o.finalEmail.from)}</strong>
            <span>الآن</span>
          </header>
          <h3>${escapeHtml(o.finalEmail.subject)}</h3>
          <p>${escapeHtml(o.finalEmail.body)}</p>
        </article>
        <button class="primary-button" data-go-retro>شوف التحليل التفصيلي ←</button>
      </article>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("[data-go-retro]")?.addEventListener("click", () =>
    setPhase("retrospective"),
  );
}

// ═══════════════════════════ RETROSPECTIVE ═══════════════════════════

function renderRetrospective() {
  const d = dataset();
  const o = state.outcome!;
  const usedToolIds = new Set(state.notebook.map((n) => n.tool));
  const allTools = Object.keys(toolLabel) as ToolId[];
  const missed = allTools.filter((t) => !usedToolIds.has(t));

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

        <div class="retro-grid">
          <section class="retro-col">
            <h3>اللي عملته</h3>
            <p><strong>الأدوات اللي ثبّتها في دفترك:</strong></p>
            <ul class="tool-checklist">
              ${allTools
                .map(
                  (t) =>
                    `<li class="${usedToolIds.has(t) ? "is-done" : "is-skipped"}">
                      ${usedToolIds.has(t) ? "✓" : "✗"} ${toolLabel[t]}
                    </li>`,
                )
                .join("")}
            </ul>
            ${
              missed.length > 0
                ? `<p class="retro-missed">⚠ ${missed.length} أداة ما فتحتهاش — فيهم أدوات كانت ممكن تغيّر القرار.</p>`
                : `<p class="retro-missed retro-missed--ok">استخدمت كل الأدوات المتاحة.</p>`
            }
            <p><strong>توصيتك:</strong></p>
            <p>• ${d.teamA.name}: ${actionLabel[state.recommendation.teamA]}</p>
            <p>• ${d.teamB.name}: ${actionLabel[state.recommendation.teamB]}</p>
            ${
              state.recommendation.primaryMetric
                ? `<p><strong>بنيتها على:</strong> ${toolLabel[state.recommendation.primaryMetric]}</p>`
                : ""
            }
          </section>

          <section class="retro-col retro-col--truth">
            <h3>اللي البيانات قالته</h3>
            <table class="truth-table">
              <thead><tr><th></th><th>${d.teamA.name}</th><th>${d.teamB.name}</th></tr></thead>
              <tbody>
                <tr><td>المتوسط</td><td>${stats.aMean}%</td><td>${stats.bMean}%</td></tr>
                <tr><td>الوسيط</td><td>${stats.aMedian}%</td><td>${stats.bMedian}%</td></tr>
                <tr><td>الانحراف المعياري</td><td>${stats.aSd}</td><td>${stats.bSd}</td></tr>
                <tr class="truth-key"><td>≥ ${d.threshold}%</td><td>${stats.aAbove}/10</td><td>${stats.bAbove}/10</td></tr>
              </tbody>
            </table>
            <div class="viz-wrap retro-plots">
              <h4>${d.teamA.name}</h4>${renderDotPlot(d.teamA, aPerfs)}
              <h4>${d.teamB.name}</h4>${renderDotPlot(d.teamB, bPerfs)}
            </div>
            <p class="retro-lesson">
              <strong>الفريق المستحق للمكافأة:</strong> ${d[d.healthyTeam].name} —
              لأن ${stats[d.healthyTeam === "teamA" ? "aAbove" : "bAbove"]}/10 مندوبين فوق سياسة الـ${d.threshold}%،
              والتشتت صغير.
              <br/>
              <strong>الفريق المحتاج تطوير:</strong> ${d[d.outlierTeam].name} —
              المتوسط مضلِّل بسبب 3 مندوبين بأرقام شاذة.
            </p>
          </section>
        </div>

        <footer class="retro-foot">
          <button class="secondary-button" data-replay>🔁 العب تاني بأرقام جديدة (${["Q2", "Q3", "Q4"][nextVariant]})</button>
        </footer>
      </article>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("[data-replay]")?.addEventListener("click", () => {
    state = freshState(state.profile, nextVariant);
    render();
  });
}

// ═══════════════════════════ SHARED VISUAL HELPERS ═══════════════════════════

function renderDotPlot(team: { name: string }, perfs: number[]): string {
  const maxX = 200;
  const t = state.thresholdValue || 85;
  const dots = perfs
    .map((p) => {
      const left = (p / maxX) * 100;
      const below = p < t;
      return `<span class="dot ${below ? "dot--below" : "dot--above"}" style="left:${left}%" title="${p}%"></span>`;
    })
    .join("");
  const threshLeft = (t / maxX) * 100;
  return `
    <div class="dot-plot">
      <div class="dot-plot__axis">
        ${dots}
        <span class="dot-plot__threshold" style="left:${threshLeft}%"></span>
        <div class="dot-plot__ticks">
          ${[0, 50, 85, 100, 150, 200].map((v) => `<span style="left:${(v / maxX) * 100}%">${v}%</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderBoxPlot(team: { name: string }, perfs: number[]): string {
  const q = quartiles(perfs);
  const lo = minOf(perfs);
  const hi = maxOf(perfs);
  const maxX = 200;
  const pct = (v: number) => (v / maxX) * 100;
  return `
    <div class="box-plot">
      <div class="box-plot__axis">
        <span class="box-whisker" style="left:${pct(lo)}%;width:${pct(q.q1) - pct(lo)}%"></span>
        <span class="box-body" style="left:${pct(q.q1)}%;width:${pct(q.q3) - pct(q.q1)}%"></span>
        <span class="box-median" style="left:${pct(q.med)}%"></span>
        <span class="box-whisker" style="left:${pct(q.q3)}%;width:${pct(hi) - pct(q.q3)}%"></span>
        <div class="dot-plot__ticks">
          ${[0, 50, 85, 100, 150, 200].map((v) => `<span style="left:${(v / maxX) * 100}%">${v}%</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════ UTIL ═══════════════════════════

function toast(msg: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-on"));
  setTimeout(() => {
    el.classList.remove("is-on");
    setTimeout(() => el.remove(), 250);
  }, 2200);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}
