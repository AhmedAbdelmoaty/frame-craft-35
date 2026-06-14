// Branch data — verbatim from Master Prompt. Do NOT round or modify.
export type BranchId = "corniche" | "midan";

export interface Rep {
  id: string;
  name: string;
  performance: number; // percent
}

export interface BranchData {
  id: BranchId;
  name: string;
  totalSalesK: number;
  reportedAverage: number; // as shown on the sales dashboard (may differ slightly from raw mean)
  reps: Rep[];
}

export const BRANCHES: Record<BranchId, BranchData> = {
  corniche: {
    id: "corniche",
    name: "فرع الكورنيش",
    totalSalesK: 960,
    reportedAverage: 96,
    reps: [
      { id: "c1", name: "سامح", performance: 60 },
      { id: "c2", name: "عادل", performance: 65 },
      { id: "c3", name: "منى", performance: 70 },
      { id: "c4", name: "ياسر", performance: 75 },
      { id: "c5", name: "مها", performance: 80 },
      { id: "c6", name: "كريم", performance: 82 },
      { id: "c7", name: "دينا", performance: 84 },
      { id: "c8", name: "شادي", performance: 150 },
      { id: "c9", name: "هالة", performance: 150 },
      { id: "c10", name: "فادي", performance: 150 },
    ],
  },
  midan: {
    id: "midan",
    name: "فرع الميدان",
    totalSalesK: 895,
    reportedAverage: 89.5,
    reps: [
      { id: "m1", name: "نيرمين", performance: 85 },
      { id: "m2", name: "تامر", performance: 86 },
      { id: "m3", name: "رنا", performance: 87 },
      { id: "m4", name: "سليم", performance: 88 },
      { id: "m5", name: "ندى", performance: 89 },
      { id: "m6", name: "حسام", performance: 90 },
      { id: "m7", name: "مريم", performance: 91 },
      { id: "m8", name: "وليد", performance: 92 },
      { id: "m9", name: "فاطمة", performance: 93 },
      { id: "m10", name: "مازن", performance: 94 },
    ],
  },
};

export const PERFORMANCE_THRESHOLD = 85;
