// Evaluation logic — Level 1: فخ المتوسط
// Two outcomes only: success | failure.
// Success requires: midan branch + exactly 2 STRONG analytical evidence.
// hr_policy is contextual only — NOT counted as strong.

import type { Level1State, Branch } from "../state/store";

export type EvidenceId =
  | "sales_summary"
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
  /** Internal classification — never shown to player. */
  _strong: boolean;
}

export const EVIDENCE_DEFS: Record<EvidenceId, EvidenceDef> = {
  sales_summary: {
    id: "sales_summary",
    label: "لوحة المبيعات",
    detail: "فرع الكورنيش أعلى في الإجمالي والمتوسط.",
    _strong: false,
  },
  hr_policy: {
    id: "hr_policy",
    label: "سياسة HR",
    detail: "حد الأداء المقبول للمندوب هو ٨٥٪.",
    _strong: false,
  },
  mean: {
    id: "mean",
    label: "المتوسط الحسابي",
    detail: "الكورنيش ٩٦٪ — الميدان ٨٩٫٥٪.",
    _strong: false,
  },
  threshold: {
    id: "threshold",
    label: "توزيع الأداء حول ٨٥٪",
    detail: "الكورنيش ٧ من ١٠ أقل من ٨٥٪ — الميدان ١٠ من ١٠ عند ٨٥٪ أو أكثر.",
    _strong: true,
  },
  median: {
    id: "median",
    label: "الأداء المعتاد (الوسيط)",
    detail: "الكورنيش حول ٨١٪ — الميدان ٨٩٫٥٪.",
    _strong: true,
  },
  stability: {
    id: "stability",
    label: "استقرار الأداء",
    detail: "الكورنيش بين ٦٠٪ و١٥٠٪ — الميدان بين ٨٥٪ و٩٤٪.",
    _strong: true,
  },
  corniche_outliers: {
    id: "corniche_outliers",
    label: "قيم استثنائية في الكورنيش",
    detail: "ثلاث بطاقات عند ١٥٠٪ ترفع الصورة العامة.",
    _strong: true,
  },
};

/** Returns the evidence IDs available to the player based on what they did. */
export function availableEvidence(s: Level1State): EvidenceId[] {
  const out: EvidenceId[] = [];
  if (s.hasSavedSalesSummary) out.push("sales_summary");
  if (s.hasSavedHRPolicy) out.push("hr_policy");
  if (s.usedQuickNumber) out.push("mean");
  if (s.usedThresholdLine) out.push("threshold");
  if (s.usedTypicalPerformance && s.hasSortedCorniche && s.hasSortedMidan) out.push("median");
  if (s.usedStability) out.push("stability");
  if (s.hasSortedCorniche && (s.usedStability || s.usedTypicalPerformance))
    out.push("corniche_outliers");
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
  const strong = picks.filter(
    (id) => EVIDENCE_DEFS[id as EvidenceId]?._strong === true,
  ).length;

  if (branch === "midan" && strong === 2) {
    return { outcome: "success", strongCount: strong };
  }
  if (branch === "corniche") {
    return { outcome: "failure", failureReason: "chose_corniche", strongCount: strong };
  }
  return { outcome: "failure", failureReason: "midan_weak_evidence", strongCount: strong };
}
