import type { Level1State, Branch } from "../state/store.ts";

export type EvidenceId =
  | "sales_summary"
  | "rep_performance"
  | "hr_policy"
  | "mean"
  | "threshold"
  | "median"
  | "stability"
  | "corniche_outliers";

export interface EvidenceDef {
  id: EvidenceId;
  label: string;
  detail: string;
  source: string;
  artifact: "report" | "policy" | "analysis";
  /** Internal classification - never shown to player. */
  _strong: boolean;
}

export const EVIDENCE_DEFS: Record<EvidenceId, EvidenceDef> = {
  sales_summary: {
    id: "sales_summary",
    label: "ملخص المبيعات الرسمي",
    detail: "الكورنيش: 960K ومتوسط 96% · الميدان: 895K ومتوسط 89.5%.",
    source: "مكتب المبيعات",
    artifact: "report",
    _strong: false,
  },
  rep_performance: {
    id: "rep_performance",
    label: "سجل الأداء الفردي",
    detail: "ملف يضم سجلات أداء المندوبين في فرعي الكورنيش والميدان.",
    source: "مكتب المبيعات",
    artifact: "report",
    _strong: false,
  },
  hr_policy: {
    id: "hr_policy",
    label: "سياسة HR",
    detail: "حد الأداء المقبول للمندوب هو 85%.",
    source: "مكتب HR",
    artifact: "policy",
    _strong: false,
  },
  mean: {
    id: "mean",
    label: "المتوسط الحسابي",
    detail: "الكورنيش: 96% · الميدان: 89.5%.",
    source: "طاولة التحليل",
    artifact: "analysis",
    _strong: false,
  },
  threshold: {
    id: "threshold",
    label: "توزيع الأداء حول 85%",
    detail: "الكورنيش: 7 من 10 أقل من 85% · الميدان: 10 من 10 عند 85% أو أكثر.",
    source: "طاولة التحليل",
    artifact: "analysis",
    _strong: true,
  },
  median: {
    id: "median",
    label: "الأداء المعتاد (الوسيط)",
    detail: "الكورنيش: حول 81% · الميدان: 89.5%.",
    source: "طاولة التحليل",
    artifact: "analysis",
    _strong: true,
  },
  stability: {
    id: "stability",
    label: "نطاق الأداء",
    detail: "الكورنيش: بين 60% و150% · الميدان: بين 85% و94%.",
    source: "طاولة التحليل",
    artifact: "analysis",
    _strong: true,
  },
  corniche_outliers: {
    id: "corniche_outliers",
    label: "قيم مرتفعة في الكورنيش",
    detail: "ثلاث بطاقات في الكورنيش مسجلة عند 150%.",
    source: "طاولة التحليل",
    artifact: "analysis",
    _strong: true,
  },
};

export function availableEvidence(s: Level1State): EvidenceId[] {
  const out: EvidenceId[] = [];
  if (s.hasSavedSalesSummary) out.push("sales_summary");
  if (s.hasReceivedIndividualPerformanceFile) out.push("rep_performance");
  if (s.hasSavedHRPolicy) out.push("hr_policy");
  if (s.usedQuickNumber) out.push("mean");
  if (s.usedThresholdLine) out.push("threshold");
  if (s.usedTypicalPerformance && s.hasSortedCorniche && s.hasSortedMidan) out.push("median");
  if (s.usedStability) out.push("stability");
  if (s.hasSortedCorniche && (s.usedStability || s.usedTypicalPerformance)) out.push("corniche_outliers");
  return out;
}

export type Outcome = "success" | "failure";
export type FailureReason = "chose_corniche" | "midan_weak_evidence" | "incomplete";

export interface EvalResult {
  outcome: Outcome;
  failureReason?: FailureReason;
  strongCount: number;
}

export function evaluate(branch: Branch | null, picks: string[]): EvalResult {
  if (!branch || picks.length !== 2) {
    return { outcome: "failure", failureReason: "incomplete", strongCount: 0 };
  }
  const strong = picks.filter((id) => EVIDENCE_DEFS[id as EvidenceId]?._strong === true).length;

  if (branch === "midan" && strong === 2) {
    return { outcome: "success", strongCount: strong };
  }
  if (branch === "corniche") {
    return { outcome: "failure", failureReason: "chose_corniche", strongCount: strong };
  }
  return { outcome: "failure", failureReason: "midan_weak_evidence", strongCount: strong };
}
