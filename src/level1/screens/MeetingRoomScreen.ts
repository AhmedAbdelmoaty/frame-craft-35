import { createRoomShell } from "./RoomShell";
import {
  getState,
  setMeetingStage,
  submitRecommendation,
  subscribe,
} from "../state/store";
import { evaluate, EVIDENCE_DEFS, type EvidenceId } from "../logic/evaluate";
import type { FailureReason, Outcome } from "../state/store";

const CHARACTERS = [
  { id: "nader", name: "نادر", role: "CEO", initial: "ن", color: "#2b78c5" },
  { id: "emad", name: "عماد", role: "مدير المبيعات", initial: "ع", color: "#c56b2b" },
  { id: "layla", name: "ليلى", role: "مديرة HR", initial: "ل", color: "#7b3fb0" },
];

export function createMeetingRoomScreen() {
  return createRoomShell({
    roomId: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "عرض التوصية والحكم النهائي",
    renderBody: (body) => {
      const root = document.createElement("div");
      root.className = "l1-meeting";
      body.appendChild(root);

      let meetingView: "summary" | "discussion" = getState().meetingStage === "summary" ? "discussion" : "summary";
      let pendingResult: { outcome: Outcome; failureReason: FailureReason } | null = null;

      const render = () => {
        const s = getState();
        root.innerHTML = "";

        if (!s.hasPreparedDecision) {
          root.innerHTML = `
            <div class="l1-analyst-empty">
              <div class="l1-analyst-empty__icon" aria-hidden="true">🤝</div>
              <h3>لا توجد توصية محضّرة بعد</h3>
              <p>توجه إلى غرفة القرار أولًا لاختيار الفرع والأدلة.</p>
            </div>`;
          return;
        }

        const table = document.createElement("div");
        table.className = "l1-meeting__table";
        table.innerHTML = CHARACTERS.map(
          (c) => `
          <div class="l1-meeting__seat">
            <div class="l1-meeting__avatar" style="background:${c.color}">${c.initial}</div>
            <div class="l1-meeting__nameplate">
              <strong>${c.name}</strong><span>${c.role}</span>
            </div>
          </div>`,
        ).join("");
        root.appendChild(table);

        const stage = document.createElement("div");
        stage.className = "l1-meeting__stage";
        root.appendChild(stage);
        if (meetingView === "discussion" && pendingResult) {
          renderDiscussion(stage, pendingResult);
        } else {
          renderSummary(stage);
        }
      };

      const renderSummary = (host: HTMLElement) => {
        const s = getState();
        host.innerHTML = `
          <h3 class="l1-meeting__prompt">التوصية المقدّمة:</h3>
          <div class="l1-meeting__summary">
            <p class="l1-meeting__branch">الفرع المرشح للمكافأة: <strong>${s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش"}</strong></p>
            <ul class="l1-decision__picks">
              ${s.preparedEvidenceIds
                .map((id) => {
                  const e = EVIDENCE_DEFS[id as EvidenceId];
                  return `<li><strong>${e.label}:</strong> <em>${e.detail}</em></li>`;
                })
                .join("")}
            </ul>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-submit>
              <span aria-hidden="true">🖋</span><span>اعتماد ومناقشة</span>
            </button>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-submit]")!.addEventListener("click", () => {
          const sNow = getState();
          const r = evaluate(sNow.preparedBranch, sNow.preparedEvidenceIds);
          pendingResult = { outcome: r.outcome, failureReason: r.failureReason ?? null };
          meetingView = "discussion";
          setMeetingStage("summary");
          render();
        });
      };

      const renderDiscussion = (host: HTMLElement, result: { outcome: Outcome; failureReason: FailureReason }) => {
        const s = getState();
        const branchName = s.preparedBranch === "midan" ? "فرع الميدان" : "فرع الكورنيش";
        host.innerHTML = `
          <div class="l1-meeting__discussion">
            <h3 class="l1-meeting__prompt">المناقشة داخل الاجتماع</h3>
            <div class="l1-meeting__dialogue">
              ${discussionLine("analyst", "أنت", "المحلل", `أوصي بمكافأة ${branchName} بناءً على التقرير والأدلة التي تم عرضها.`)}
              ${discussionLines(result).join("")}
            </div>
          </div>
          <div class="l1-meeting__cta">
            <button class="l1-btn l1-btn--primary l1-btn--stamp" type="button" data-final>
              <span aria-hidden="true">★</span><span>عرض النتيجة النهائية</span>
            </button>
          </div>`;
        host.querySelector<HTMLButtonElement>("[data-final]")!.addEventListener("click", () => {
          submitRecommendation(result.outcome, result.failureReason);
        });
      };

      render();
      const unsub = subscribe(render);

      const observer = new MutationObserver(() => {
        if (!body.isConnected) {
          unsub();
          observer.disconnect();
        }
      });
      observer.observe(body.parentNode || document.body, { childList: true });
    },
  });
}

function discussionLines(result: { outcome: Outcome; failureReason: FailureReason }): string[] {
  if (result.outcome === "success") {
    return [
      discussionLine("nader", "نادر", "CEO", "التوصية واضحة وقابلة للدفاع. عندنا قرار يمكن اعتماده بثقة."),
      discussionLine("layla", "ليلى", "مديرة HR", "الاختيار يحافظ على عدالة السياسة، لأن المكافأة تذهب لفريق حقق الأداء جماعيًا."),
      discussionLine("emad", "عماد", "مدير المبيعات", "الرقم الأعلى كان مغريًا، لكن قراءتك للفريق كانت أقوى من قراءة رقم واحد."),
    ];
  }

  if (result.failureReason === "chose_corniche") {
    return [
      discussionLine("nader", "نادر", "CEO", "لا أستطيع اعتماد توصية تعتمد على الرقم الأعلى وحده. القرار لن يصمد أمام الإدارة."),
      discussionLine("layla", "ليلى", "مديرة HR", "السياسة تقيس أداء الأفراد داخل الفريق، وليس متوسطًا قد يخفي المشكلة."),
      discussionLine("emad", "عماد", "مدير المبيعات", "المبيعات الإجمالية مهمة، لكن لازم نعرف هل الفريق كله قوي أم أن قلة رفعت المتوسط."),
    ];
  }

  return [
    discussionLine("nader", "نادر", "CEO", "اتجاهك مفهوم، لكن الدفاع غير كافٍ. أحتاج دليلين أقوى قبل اعتماد المكافأة."),
    discussionLine("layla", "ليلى", "مديرة HR", "اختيار الفرع الصحيح لا يكفي وحده؛ العدالة تحتاج إثباتًا واضحًا من البيانات."),
    discussionLine("emad", "عماد", "مدير المبيعات", "هات تحليلًا يوضح صورة الفريق، لا مجرد سياق عام أو رقم سريع."),
  ];
}

function discussionLine(kind: string, name: string, role: string, text: string): string {
  return `
    <div class="l1-meeting-line l1-meeting-line--${kind}">
      <span class="l1-meeting-line__avatar">${name.charAt(0)}</span>
      <div class="l1-meeting-line__bubble">
        <strong>${name}<small>${role}</small></strong>
        <p>${text}</p>
      </div>
    </div>`;
}
