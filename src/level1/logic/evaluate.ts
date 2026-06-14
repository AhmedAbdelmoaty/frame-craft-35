// Evaluation logic — Level 1: فخ المتوسط
// Two outcomes only: success | failure.
// Success requires: midan branch + exactly 2 STRONG evidence supporting midan.

import type { Level1State, Branch } from "../state/store";

export type EvidenceId =
  | "mean"
  | "threshold"
  | "median"
  | "stability"
  | "hr_policy"
  | "sales_summary";

export type EvidenceStrength = "strong" | "weak";

export interface EvidenceDef {
  id: EvidenceId;
  label: string;
  detail: string;
  strength: EvidenceStrength; // "strong" = strong support for midan / against the mean trap
  supports: Branch; // which branch this evidence naturally argues for
}

export const EVIDENCE_DEFS: Record<EvidenceId, EvidenceDef> = {
  mean: {
    id: "mean",
    label: "المتوسط الحسابي للفرعين",
    detail: "الكورنيش ٩٦٪ — الميدان ٨٩٫٥٪",
    strength: "weak",
    supports: "corniche",
  },
  sales_summary: {
    id: "sales_summary",
    label: "ملخّص المبيعات الإجمالية",
    detail: "الكورنيش 960K — الميدان 895K",
    strength: "weak",
    supports: "corniche",
  },
  threshold: {
    id: "threshold",
    label: "نسبة من تحت ٨٥٪ في كل فرع",
    detail: "الكورنيش ٧ من ١٠ تحت العتبة — الميدان ٠ من ١٠",
    strength: "strong",
    supports: "midan",
  },
  median: {
    id: "median",
    label: "الوسيط (الأداء النموذجي)",
    detail: "الكورنيش ≈ ٨١٪ — الميدان ٨٩٫٥٪",
    strength: "strong",
    supports: "midan",
  },
  stability: {
    id: "stability",
    label: "مدى الأداء واستقراره",
    detail: "الكورنيش 60→150 (مدى ٩٠) — الميدان 85→94 (مدى ٩)",
    strength: "strong",
    supports: "midan",
  },
  hr_policy: {
    id: "hr_policy",
    label: "سياسة ٨٥٪ من الموارد البشرية",
    detail: "الأداء المطلوب على مستوى المندوب لا المتوسط",
    strength: "strong",
    supports: "midan",
  },
};

/** Returns the evidence IDs available to the player based on what they did. */
export function availableEvidence(s: Level1State): EvidenceId[] {
  const out: EvidenceId[] = [];
  if (s.usedQuickNumber) out.push("mean");
  if (s.hasSavedSalesSummary) out.push("sales_summary");
  if (s.usedThresholdLine) out.push("threshold");
  if (s.usedTypicalPerformance) out.push("median");
  if (s.usedStability) out.push("stability");
  if (s.hasSavedHRPolicy) out.push("hr_policy");
  return out;
}

export type Outcome = "success" | "failure";
export type FailureReason = "chose_corniche" | "midan_weak_evidence" | "incomplete";

export interface EvalResult {
  outcome: Outcome;
  failureReason?: FailureReason;
  strongCount: number;
}

export function evaluate(s: Level1State): EvalResult {
  const branch = s.selectedBranch;
  const picks = s.selectedEvidenceIds;
  if (!branch || picks.length !== 2) {
    return { outcome: "failure", failureReason: "incomplete", strongCount: 0 };
  }
  const strongForMidan = picks.filter(
    (id) => EVIDENCE_DEFS[id as EvidenceId]?.strength === "strong",
  ).length;

  if (branch === "midan" && strongForMidan === 2) {
    return { outcome: "success", strongCount: strongForMidan };
  }
  if (branch === "corniche") {
    return { outcome: "failure", failureReason: "chose_corniche", strongCount: strongForMidan };
  }
  return { outcome: "failure", failureReason: "midan_weak_evidence", strongCount: strongForMidan };
}
