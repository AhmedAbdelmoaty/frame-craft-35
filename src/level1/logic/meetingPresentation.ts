import { EVIDENCE_DEFS, evaluate, type EvidenceId } from "./evaluate.ts";
import type { Branch, FailureReason, Outcome } from "../state/store.ts";

export type MeetingPresentationStage = "intro" | "report_open" | "dialogue" | "result";
export type MeetingSpeakerId = "player" | "nader" | "layla" | "emad";

export interface MeetingDialogueLine {
  speaker: MeetingSpeakerId;
  text: string;
}

export interface MeetingReport {
  recommendedBranchName: string;
  otherBranchName: string;
  title: string;
  summary: string;
  rationale: string;
  otherBranchNote: string;
  evidenceItems: Array<{ id: EvidenceId; label: string; detail: string }>;
}

export interface MeetingPresentation {
  report: MeetingReport;
  dialogue: MeetingDialogueLine[];
  evaluation: {
    outcome: Outcome;
    failureReason?: FailureReason;
    strongCount: number;
  };
}

export function buildMeetingPresentation(
  branch: Branch | null,
  picks: string[],
): MeetingPresentation | null {
  if (!branch || picks.length !== 2) return null;

  const evidenceItems = picks
    .map((id) => EVIDENCE_DEFS[id as EvidenceId])
    .filter((item): item is (typeof EVIDENCE_DEFS)[EvidenceId] => Boolean(item))
    .map((item) => ({ id: item.id, label: item.label, detail: item.detail }));

  if (evidenceItems.length !== 2) return null;

  const evaluation = evaluate(branch, picks);
  const recommendedBranchName = branchName(branch);
  const otherBranchName = branch === "midan" ? "فرع الكورنيش" : "فرع الميدان";
  const evidenceLabels = evidenceItems.map((item) => item.label).join(" و");

  const report: MeetingReport = {
    recommendedBranchName,
    otherBranchName,
    title: "تقرير توصية الاجتماع",
    summary: `أوصي بمكافأة ${recommendedBranchName} بناءً على ${evidenceLabels}.`,
    rationale: `هذه التوصية مبنية على الأدلة المسجلة في التقرير: ${evidenceItems[0].detail} ${evidenceItems[1].detail}`,
    otherBranchNote: `أما ${otherBranchName} فيحتاج مراجعة أو دعمًا إضافيًا قبل اعتماد المكافأة في هذه الجولة.`,
    evidenceItems,
  };

  return {
    report,
    dialogue: buildDialogue(report, evaluation.outcome, evaluation.failureReason ?? null),
    evaluation,
  };
}

function buildDialogue(
  report: MeetingReport,
  outcome: Outcome,
  failureReason: FailureReason | null,
): MeetingDialogueLine[] {
  const lines: MeetingDialogueLine[] = [
    {
      speaker: "player",
      text: report.summary,
    },
  ];

  if (outcome === "success") {
    lines.push(
      { speaker: "nader", text: "التوصية واضحة وقابلة للدفاع. عندنا قرار يمكن اعتماده بثقة." },
      { speaker: "layla", text: "الاختيار يحافظ على عدالة السياسة، لأن المكافأة تذهب لفريق حقق الأداء جماعيًا." },
      { speaker: "emad", text: "الرقم الأعلى كان مغريًا، لكن قراءتك للفريق كانت أقوى من قراءة رقم واحد." },
    );
    return lines;
  }

  if (failureReason === "chose_corniche") {
    lines.push(
      { speaker: "nader", text: "لا أستطيع اعتماد توصية تعتمد على الرقم الأعلى وحده. القرار لن يصمد أمام الإدارة." },
      { speaker: "layla", text: "السياسة تقيس أداء الأفراد داخل الفريق، وليس متوسطًا قد يخفي المشكلة." },
      { speaker: "emad", text: "المبيعات الإجمالية مهمة، لكن لازم نعرف هل الفريق كله قوي أم أن قلة رفعت المتوسط." },
    );
    return lines;
  }

  lines.push(
    { speaker: "nader", text: "اتجاهك مفهوم، لكن الدفاع غير كافٍ. أحتاج دليلين أقوى قبل اعتماد المكافأة." },
    { speaker: "layla", text: "اختيار الفرع الصحيح لا يكفي وحده؛ العدالة تحتاج إثباتًا واضحًا من البيانات." },
    { speaker: "emad", text: "هات تحليلًا يوضح صورة الفريق، لا مجرد سياق عام أو رقم سريع." },
  );
  return lines;
}

function branchName(branch: Branch): string {
  return branch === "midan" ? "فرع الميدان" : "فرع الكورنيش";
}
