import { evidenceLibrary, performanceThreshold, salesTeams, stationCopy } from "../data/salesCase";
import { gameEvents } from "../game/events";
import { evaluateDecision, getDecisionLabel, getTeamReadout } from "../game/simulation";
import type {
  DecisionType,
  EvidenceId,
  HotspotId,
  PlayerDecision,
  PlayerProfile,
  StationId,
  TeamId,
} from "../game/types";

const stationOrder: StationId[] = ["lobby", "desk", "sales", "hr", "decision"];

const stationLabels: Record<StationId, string> = {
  lobby: "الاستقبال",
  desk: "مكتبي",
  sales: "المبيعات",
  hr: "HR",
  decision: "القرار",
};

const decisionLabels: Record<DecisionType, string> = {
  reward: "مكافأة",
  training: "تدريب",
  review: "مراجعة",
};

type HudState = {
  station: StationId;
  evidence: Set<EvidenceId>;
  markedReps: Set<string>;
  decisions: PlayerDecision;
  submitted: boolean;
  briefingOpen: boolean;
  notebookOpen: boolean;
  activeHotspot?: HotspotId;
  recentEvidence?: EvidenceId;
};

export function createHud(profile: PlayerProfile) {
  const root = document.querySelector<HTMLElement>("#hud-root");

  if (!root) {
    throw new Error("Missing HUD root");
  }

  const state: HudState = {
    station: "lobby",
    evidence: new Set(["missionBrief"]),
    markedReps: new Set(),
    decisions: {},
    submitted: false,
    briefingOpen: true,
    notebookOpen: false,
    activeHotspot: "reception",
    recentEvidence: "missionBrief",
  };

  const render = () => {
    root.innerHTML = `
      <div class="top-hud" dir="rtl">
        <div class="identity-chip">
          <span class="mini-avatar mini-avatar--${profile.avatar}"></span>
          <span><strong>${escapeHtml(profile.name)}</strong><small>محلل بيانات - مدار</small></span>
        </div>
        <div class="objective-chip">
          <strong>المهمة</strong>
          <span>${getObjectiveLine(state)}</span>
        </div>
      </div>

      <button class="notebook-fab ${state.notebookOpen ? "is-active" : ""}" data-toggle-notebook aria-expanded="${state.notebookOpen}">
        <strong>دفتر الأدلة</strong>
        <span>${state.evidence.size}/6</span>
      </button>

      <aside class="context-panel ${state.notebookOpen ? "context-panel--notebook" : ""}" dir="rtl">
        ${state.notebookOpen ? renderNotebook(state) : `${renderMissionGuide(state)}${renderStation(state)}`}
      </aside>

      <nav class="mini-map" dir="rtl" aria-label="خريطة الشركة المصغرة">
        ${stationOrder
          .map(
            (station) => `
              <button class="map-node ${state.station === station ? "is-active" : ""}" data-move="${station}">
                <span></span>${stationLabels[station]}
              </button>
            `,
          )
          .join("")}
      </nav>

      <section class="dialogue-strip" dir="rtl">
        <span class="speaker">${stationCopy[state.station].speaker}</span>
        <p>${getCoachLine(state)}</p>
      </section>

      ${state.briefingOpen ? renderBriefing() : ""}
    `;

    root.querySelectorAll<HTMLButtonElement>("[data-move]").forEach((button) => {
      button.addEventListener("click", () => {
        state.notebookOpen = false;
        gameEvents.emit("movetostation", { station: button.dataset.move as StationId });
      });
    });

    root.querySelector<HTMLButtonElement>("[data-toggle-notebook]")?.addEventListener("click", () => {
      state.notebookOpen = !state.notebookOpen;
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-close-notebook]")?.addEventListener("click", () => {
      state.notebookOpen = false;
      render();
    });

    root.querySelectorAll<HTMLButtonElement>("[data-interact]").forEach((button) => {
      button.addEventListener("click", () => {
        const hotspot = button.dataset.interact as HotspotId;
        const station = hotspotToStation(hotspot);
        state.notebookOpen = false;
        gameEvents.emit("movetostation", { station });
        applyHotspot(state, hotspot);
        render();
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-marker]").forEach((button) => {
      button.addEventListener("click", () => {
        const repId = button.dataset.marker ?? "";
        if (state.markedReps.has(repId)) {
          state.markedReps.delete(repId);
        } else {
          state.markedReps.add(repId);
        }
        render();
      });
    });

    root.querySelectorAll<HTMLElement>("[data-decision-chip]").forEach((chip) => {
      chip.addEventListener("dragstart", (event) => {
        event.dataTransfer?.setData("text/plain", chip.dataset.decisionChip ?? "");
      });
    });

    root.querySelectorAll<HTMLElement>("[data-team-drop]").forEach((dropZone) => {
      dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("is-over");
      });
      dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-over"));
      dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        const decision = event.dataTransfer?.getData("text/plain") as DecisionType;
        const teamId = dropZone.dataset.teamDrop as TeamId;
        if (decision && teamId) {
          state.decisions[teamId] = decision;
          state.submitted = false;
          render();
        }
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-quick-decision]").forEach((button) => {
      button.addEventListener("click", () => {
        const [teamId, decision] = String(button.dataset.quickDecision).split(":") as [TeamId, DecisionType];
        state.decisions[teamId] = decision;
        state.submitted = false;
        render();
      });
    });

    root.querySelector<HTMLButtonElement>("[data-submit-decision]")?.addEventListener("click", () => {
      if (!state.decisions.teamA || !state.decisions.teamB) return;
      state.submitted = true;
      addEvidence(state, "decisionSubmitted");
      gameEvents.emit("decisionsubmitted", { decisions: state.decisions });
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-reset-decision]")?.addEventListener("click", () => {
      state.decisions = {};
      state.submitted = false;
      gameEvents.emit("resetdecision", undefined);
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-close-briefing]")?.addEventListener("click", () => {
      state.briefingOpen = false;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      render();
    });
  };

  gameEvents.on("stationchange", (event) => {
    state.station = event.detail.station;
    state.activeHotspot = stationToDefaultHotspot(state.station);
    render();
  });

  gameEvents.on("hotspotinteract", (event) => {
    applyHotspot(state, event.detail.hotspot);
    render();
  });

  render();
}

function renderBriefing() {
  return `
    <section class="briefing-overlay" dir="rtl" role="dialog" aria-label="مقدمة المهمة">
      <article class="briefing-card">
        <p class="eyebrow">ابدأ المهمة</p>
        <h2>أول يوم لك داخل شركة مدار</h2>
        <p>
          الإدارة على وشك اتخاذ قرار مكافآت وتدريب لفريقي مبيعات. دورك أن تتحرك داخل الشركة،
          تجمع الأدلة الكافية، ثم تقدم توصية مهنية يمكن الدفاع عنها.
        </p>
        <div class="briefing-steps">
          <span>تحرك بين الغرف</span>
          <span>افتح الملفات</span>
          <span>قابل المسؤولين</span>
          <span>اجمع الأدلة</span>
          <span>اعتمد القرار</span>
        </div>
        <p class="briefing-note">
          لن تخبرك اللعبة أين المشكلة. ستمنحك موقف عمل، وأنت من يقرر ما يكفي من الفحص قبل التوصية.
        </p>
        <button class="primary-button" data-close-briefing>ادخل الشركة</button>
      </article>
    </section>
  `;
}

function renderStation(state: HudState) {
  switch (state.station) {
    case "lobby":
      return renderLobby(state);
    case "desk":
      return renderDesk(state);
    case "sales":
      return renderSales(state);
    case "hr":
      return renderHr(state);
    case "decision":
      return renderDecisionRoom(state);
  }
}

function renderMissionGuide(state: HudState) {
  const steps: Array<{ key: string; label: string; done: boolean; current: boolean }> = [
    {
      key: "brief",
      label: "استلم التكليف",
      done: state.evidence.has("missionBrief"),
      current: !state.evidence.has("missionBrief"),
    },
    {
      key: "summary",
      label: "افتح التقرير المختصر",
      done: state.evidence.has("summaryReport"),
      current: state.evidence.has("missionBrief") && !state.evidence.has("summaryReport"),
    },
    {
      key: "policy",
      label: "اعرف قاعدة HR",
      done: state.evidence.has("hrPolicy"),
      current: state.evidence.has("summaryReport") && !state.evidence.has("hrPolicy"),
    },
    {
      key: "reps",
      label: "افتح بطاقات المندوبين",
      done: state.evidence.has("repCards"),
      current: state.evidence.has("hrPolicy") && !state.evidence.has("repCards"),
    },
    {
      key: "decision",
      label: "اعتمد التوصية",
      done: state.submitted,
      current: state.evidence.has("repCards") && !state.submitted,
    },
  ];

  return `
    <section class="mission-guide" aria-label="مسار المهمة">
      <header>
        <span>مسار المهمة</span>
        <strong>${getCurrentStepTitle(state)}</strong>
      </header>
      <ol>
        ${steps
          .map(
            (step) => `
              <li class="${step.done ? "is-done" : ""} ${step.current ? "is-current" : ""}">
                <span></span>
                <strong>${step.label}</strong>
              </li>
            `,
          )
          .join("")}
      </ol>
    </section>
  `;
}

function renderLobby(state: HudState) {
  return `
    ${renderPanelHeader("الاستقبال", "هنا تبدأ المهمة قبل الدخول إلى تفاصيل الأرقام.")}
    ${renderNewEvidence(state)}
    <div class="action-stack">
      <button class="action-card" data-interact="reception">
        <strong>استلم تكليف المراجعة</strong>
        <span>افهم المطلوب منك بدون أي تلميح للحل.</span>
      </button>
      <button class="action-card" data-interact="summaryReport">
        <strong>اذهب إلى مكتب التحليل</strong>
        <span>ابدأ من الملف الموجود على مكتبك.</span>
      </button>
    </div>
  `;
}

function renderDesk(state: HudState) {
  const hasReport = state.evidence.has("summaryReport");
  return `
    ${renderPanelHeader("مكتب التحليل", "ملف التقرير المختصر موجود على المكتب. افتحه كبداية للتحقيق.")}
    ${renderNewEvidence(state)}
    <div class="action-stack">
      <button class="action-card" data-interact="summaryReport">
        <strong>افتح التقرير المختصر</strong>
        <span>يعرض صورة عامة عن فريقي المبيعات.</span>
      </button>
    </div>
    ${hasReport ? renderSummaryReport() : renderLockedHint("افتح الملف أولًا حتى تظهر أرقامه في دفتر الأدلة.")}
  `;
}

function renderSummaryReport() {
  return `
    <section class="evidence-card">
      <header>
        <span>ملف داخلي</span>
        <strong>تقرير الأداء المختصر</strong>
      </header>
      <div class="summary-grid">
        ${renderSummaryCard("teamA")}
        ${renderSummaryCard("teamB")}
      </div>
    </section>
  `;
}

function renderSummaryCard(teamId: TeamId) {
  const team = salesTeams[teamId];
  return `
    <article class="team-summary ${teamId === "teamA" ? "team-summary--a" : "team-summary--b"}">
      <span class="team-label">${team.name}</span>
      <strong>${team.averagePerformance}%</strong>
      <small>متوسط الأداء</small>
      <strong>${team.totalSalesK}K</strong>
      <small>إجمالي المبيعات</small>
    </article>
  `;
}

function renderHr(state: HudState) {
  const hasPolicy = state.evidence.has("hrPolicy");
  return `
    ${renderPanelHeader("إدارة HR", "سارة تحتفظ بملف سياسة المراجعة لهذه الدورة.")}
    ${renderNewEvidence(state)}
    <div class="action-stack">
      <button class="action-card" data-interact="hrFolder">
        <strong>افتح ملف سياسة HR</strong>
        <span>اعرف قاعدة الحكم قبل تفسير النتائج.</span>
      </button>
    </div>
    ${
      hasPolicy
        ? `<div class="policy-card"><span>حد الأداء الجيد</span><strong>${performanceThreshold}%+</strong><small>هدف كل مندوب شهريًا هو 100K.</small></div>`
        : renderLockedHint("ملف السياسة لم يفتح بعد.")
    }
  `;
}

function renderSales(state: HudState) {
  const hasContext = state.evidence.has("salesContext");
  const hasCards = state.evidence.has("repCards");
  return `
    ${renderPanelHeader("قسم المبيعات", "هنا تسمع سياق الفريق وتفتح بطاقات أداء الأفراد.")}
    ${renderNewEvidence(state)}
    <div class="action-stack">
      <button class="action-card" data-interact="salesBoard">
        <strong>تحدث مع عمر وافحص اللوحة</strong>
        <span>اجمع سياقًا قبل النظر إلى التفاصيل.</span>
      </button>
      <button class="action-card" data-interact="repCabinet">
        <strong>افتح درج بطاقات المندوبين</strong>
        <span>راجع أداء الأفراد وعلّم ما تراه مهمًا.</span>
      </button>
    </div>
    ${hasContext ? `<article class="note-card">عمر: "أحتاج توصية عادلة. لا أريد رقمًا سريعًا يخلق اعتراضات داخل الفريق."</article>` : ""}
    ${hasCards ? renderRepCards(state) : renderLockedHint("بطاقات المندوبين مغلقة حتى تفتح الدرج داخل قسم المبيعات.")}
  `;
}

function renderRepCards(state: HudState) {
  return `
    <div class="team-detail-stack">
      ${renderTeamDetail("teamA", state)}
      ${renderTeamDetail("teamB", state)}
    </div>
  `;
}

function renderTeamDetail(teamId: TeamId, state: HudState) {
  const team = salesTeams[teamId];
  const readout = getTeamReadout(teamId);
  return `
    <section class="team-detail">
      <header>
        <strong>${team.name}</strong>
        <span>${readout.aboveThreshold}/${readout.totalReps} عند ${performanceThreshold}% أو أكثر</span>
      </header>
      <div class="rep-grid">
        ${team.reps
          .map((rep) => {
            const below = rep.performance < performanceThreshold;
            const marked = state.markedReps.has(rep.id);
            return `
              <button class="rep-card ${below ? "is-below" : "is-above"} ${marked ? "is-marked" : ""}" data-marker="${rep.id}">
                <span>${rep.label}</span>
                <strong>${rep.performance}%</strong>
                <small>${marked ? "تم التعليم" : below ? "تحت الخط" : "على المسار"}</small>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderDecisionRoom(state: HudState) {
  const enoughEvidence = state.evidence.has("summaryReport") && state.evidence.has("hrPolicy") && state.evidence.has("repCards");
  return `
    ${renderPanelHeader("غرفة القرار", "هنا تقدم التوصية النهائية. القرار متاح حتى لو لم تجمع كل شيء، لكن العواقب ستظهر.")}
    ${renderNewEvidence(state)}
    ${!enoughEvidence ? `<article class="warning-card">دفتر الأدلة ليس مكتملًا بعد. يمكنك الاعتماد الآن، لكنك تتحمل عاقبة قرار ناقص.</article>` : ""}
    ${renderDecision(state)}
  `;
}

function renderDecision(state: HudState) {
  const outcome = evaluateDecision(state.decisions);

  return `
    <div class="decision-bank">
      ${(["reward", "training", "review"] as DecisionType[])
        .map(
          (decision) => `
            <div class="decision-chip decision-chip--${decision}" draggable="true" data-decision-chip="${decision}">
              ${decisionLabels[decision]}
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="drop-grid">
      ${(["teamA", "teamB"] as TeamId[]).map((teamId) => renderTeamDrop(teamId, state)).join("")}
    </div>
    <button class="primary-button" data-submit-decision ${!state.decisions.teamA || !state.decisions.teamB ? "disabled" : ""}>
      اعتماد التوصية
    </button>
    <button class="text-button" data-reset-decision>إعادة الاختيار</button>
    ${state.submitted ? renderOutcome(outcome) : ""}
  `;
}

function renderTeamDrop(teamId: TeamId, state: HudState) {
  const team = salesTeams[teamId];
  const decision = state.decisions[teamId];
  return `
    <section class="team-drop" data-team-drop="${teamId}">
      <strong>${team.name}</strong>
      <span class="assigned-action">${getDecisionLabel(decision)}</span>
      <div class="quick-actions">
        ${(["reward", "training", "review"] as DecisionType[])
          .map(
            (item) => `
              <button data-quick-decision="${teamId}:${item}" class="${decision === item ? "is-selected" : ""}">
                ${decisionLabels[item]}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderOutcome(outcome: ReturnType<typeof evaluateDecision>) {
  const copy = {
    strong: {
      title: "توصية قوية",
      text: "الإدارة اعتمدت مكافأة للفريق المستقر، وخطة تدريب للفريق الذي يحتاج دعمًا. الاعتراضات قليلة لأن التوصية مبنية على تفاصيل واضحة.",
      meters: ["الثقة +", "العدالة +", "الاستقرار +"],
      scene: "سارة ترسل القرار بهدوء، وعمر يطلب خطة متابعة للنجوم الفرديين.",
    },
    surface: {
      title: "قرار سريع",
      text: "الرقم الأعلى بدا مقنعًا في البداية، لكن HR تلقى اعتراضات بعد إعلان التوصية. بعض الموظفين شعروا أن القرار لم ير تفاصيل الأداء.",
      meters: ["الثقة -", "العدالة -", "الاستقرار -"],
      scene: "تظهر رسائل اعتراض على لوحة HR، ويتوقف اجتماع المبيعات لمراجعة القرار.",
    },
    mixed: {
      title: "توصية جزئية",
      text: "القرار ليس عشوائيًا، لكنه لم يربط بوضوح بين سياسة HR وتفاصيل أداء الأفراد.",
      meters: ["الثقة ~", "العدالة ~", "الاستقرار ~"],
      scene: "الإدارة تطلب منك توضيحًا إضافيًا قبل تثبيت القرار.",
    },
    pending: {
      title: "غير مكتملة",
      text: "ضع إجراءً على كل فريق قبل الاعتماد.",
      meters: [],
      scene: "",
    },
  }[outcome];

  return `
    <article class="outcome-card outcome-card--${outcome}">
      <span class="cutscene-label">مشهد العاقبة</span>
      <h3>${copy.title}</h3>
      <p>${copy.text}</p>
      ${copy.scene ? `<p class="scene-line">${copy.scene}</p>` : ""}
      <div class="meter-row">${copy.meters.map((meter) => `<span>${meter}</span>`).join("")}</div>
    </article>
  `;
}

function renderNotebook(state: HudState) {
  const items = Object.values(evidenceLibrary);
  return `
    <div class="panel-title-row">
      <div>${renderPanelHeader("دفتر الأدلة", "هذا ليس درسًا؛ هو سجل ما جمعته داخل الشركة.")}</div>
      <button class="icon-button" data-close-notebook aria-label="إغلاق دفتر الأدلة">×</button>
    </div>
    <div class="progress-bar"><span style="width:${Math.round((state.evidence.size / items.length) * 100)}%"></span></div>
    <div class="notebook-list">
      ${items
        .map((item) =>
          state.evidence.has(item.id)
            ? `<article class="notebook-entry is-found"><strong>${item.title}</strong><p>${item.note}</p></article>`
            : `<article class="notebook-entry"><strong>دليل غير مكتشف</strong><p>اذهب إلى ${stationLabels[item.station]} وتفاعل مع العناصر هناك.</p></article>`,
        )
        .join("")}
    </div>
  `;
}

function getCurrentStepTitle(state: HudState) {
  if (!state.evidence.has("summaryReport")) return "ابدأ من مكتبك وافتح التقرير المختصر.";
  if (!state.evidence.has("hrPolicy")) return "لا تفسر الأرقام قبل معرفة قاعدة HR.";
  if (!state.evidence.has("repCards")) return "اذهب للمبيعات وافتح تفاصيل أداء الأفراد.";
  if (!state.submitted) return "قارن الأدلة ثم اتخذ قرارًا لكل فريق.";
  return "راجع العاقبة: هل كان القرار عادلًا ومدعومًا؟";
}

function renderPanelHeader(title: string, copy: string) {
  return `
    <p class="panel-kicker">داخل الشركة</p>
    <h2>${title}</h2>
    <p class="panel-copy">${copy}</p>
  `;
}

function renderNewEvidence(state: HudState) {
  if (!state.recentEvidence) return "";
  const item = evidenceLibrary[state.recentEvidence];
  if (!item) return "";
  return `
    <article class="new-evidence">
      <span>دليل مضاف للدفتر</span>
      <strong>${item.title}</strong>
      <p>${item.note}</p>
    </article>
  `;
}

function renderLockedHint(copy: string) {
  return `<article class="locked-detail"><strong>مغلق الآن</strong><span>${copy}</span></article>`;
}

function applyHotspot(state: HudState, hotspot: HotspotId) {
  state.activeHotspot = hotspot;
  state.recentEvidence = undefined;

  switch (hotspot) {
    case "reception":
      addEvidence(state, "missionBrief");
      break;
    case "summaryReport":
      addEvidence(state, "summaryReport");
      break;
    case "hrFolder":
      addEvidence(state, "hrPolicy");
      break;
    case "salesBoard":
      addEvidence(state, "salesContext");
      break;
    case "repCabinet":
      addEvidence(state, "repCards");
      break;
    case "decisionBoard":
      break;
  }
}

function addEvidence(state: HudState, evidence: EvidenceId) {
  const wasKnown = state.evidence.has(evidence);
  state.evidence.add(evidence);
  state.recentEvidence = evidence;
  if (wasKnown) {
    state.recentEvidence = evidence;
  }
}

function stationToDefaultHotspot(station: StationId): HotspotId {
  switch (station) {
    case "lobby":
      return "reception";
    case "desk":
      return "summaryReport";
    case "sales":
      return "salesBoard";
    case "hr":
      return "hrFolder";
    case "decision":
      return "decisionBoard";
  }
}

function hotspotToStation(hotspot: HotspotId): StationId {
  switch (hotspot) {
    case "reception":
      return "lobby";
    case "summaryReport":
      return "desk";
    case "hrFolder":
      return "hr";
    case "salesBoard":
    case "repCabinet":
      return "sales";
    case "decisionBoard":
      return "decision";
  }
}

function getObjectiveLine(state: HudState) {
  if (!state.evidence.has("summaryReport")) return "افتح ملف التقرير على مكتبك";
  if (!state.evidence.has("hrPolicy")) return "اعرف سياسة HR قبل التفسير";
  if (!state.evidence.has("repCards")) return "افتح بطاقات المندوبين في المبيعات";
  if (!state.submitted) return "قدّم توصية في غرفة القرار";
  return "راجع أثر القرار في دفتر الأدلة";
}

function getCoachLine(state: HudState) {
  if (state.submitted) {
    const outcome = evaluateDecision(state.decisions);
    if (outcome === "strong") {
      return "قرارك ربط بين السياسة وتفاصيل أداء الأشخاص، لذلك ظهر أثره بثبات أكبر.";
    }
    if (outcome === "surface") {
      return "القرار السريع يبدو مريحًا لحظة الاعتماد، لكنه يترك أثرًا اجتماعيًا عندما تظهر تفاصيل الأداء.";
    }
    return "التوصية لها اتجاه، لكن الشركة تحتاج قرارًا أوضح أمام سياسة HR وتفاصيل الأفراد.";
  }

  if (state.station === "decision") {
    return "يمكنك الاعتماد الآن، لكن قوة القرار تعتمد على الأدلة التي جمعتها قبل دخول الغرفة.";
  }

  return stationCopy[state.station].message;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
