// Statistical helpers + consequence evaluation for NovaPharm case.

import { datasetVariants } from "../data/salesCase";
import type {
  Action,
  Dataset,
  DatasetVariantId,
  Outcome,
  OutcomeKind,
  Recommendation,
  TeamId,
  ToolId,
} from "./types";

// --- Descriptive statistics ---

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

export const range = (xs: number[]) => Math.max(...xs) - Math.min(...xs);

export const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / xs.length);
};

export const countAbove = (xs: number[], threshold: number) =>
  xs.filter((x) => x >= threshold).length;

export const round1 = (n: number) => Math.round(n * 10) / 10;

// --- Dataset access ---

export const getDataset = (id: DatasetVariantId): Dataset => datasetVariants[id];

// --- Consequence evaluation ---

export type ToolUse = { tool: ToolId; team: TeamId; thresholdValue?: number };

export function evaluateOutcome(
  dataset: Dataset,
  rec: Recommendation,
  toolUses: ToolUse[],
): OutcomeKind {
  const healthyAction = rec[dataset.healthyTeam];
  const outlierAction = rec[dataset.outlierTeam];

  // Did the player ever use a revealing tool on the outlier team?
  const revealingTools: ToolId[] = ["median", "distribution", "countAbove", "spread"];
  const usedRevealingOnOutlier = toolUses.some(
    (t) => t.team === dataset.outlierTeam && revealingTools.includes(t.tool),
  );
  // Did they set the threshold close to the policy threshold (85%)?
  const draggedToThreshold = toolUses.some(
    (t) =>
      t.tool === "countAbove" &&
      t.thresholdValue !== undefined &&
      Math.abs(t.thresholdValue - dataset.threshold) <= 5,
  );

  // "Uninformed" = rewarded outlier team without ever digging beneath the mean.
  if (outlierAction === "reward" && !usedRevealingOnOutlier && !draggedToThreshold) {
    return "uninformed";
  }

  if (
    healthyAction === "reward" &&
    (outlierAction === "training" || outlierAction === "restructure")
  ) {
    return "correct";
  }

  if (outlierAction === "reward" && healthyAction !== "reward") {
    return "surface-wrong";
  }

  if (healthyAction === "reward" && outlierAction === "reward") {
    return "double-reward";
  }

  if (healthyAction !== "reward" && outlierAction !== "reward") {
    return "double-training";
  }

  return "mixed";
}

const teamLabel = (dataset: Dataset, team: TeamId) =>
  dataset[team].name + " (" + dataset[team].region + ")";

export function buildOutcome(dataset: Dataset, rec: Recommendation, kind: OutcomeKind): Outcome {
  const healthy = teamLabel(dataset, dataset.healthyTeam);
  const outlier = teamLabel(dataset, dataset.outlierTeam);
  const outlierReps = dataset[dataset.outlierTeam].reps.filter((r) => r.performance >= 120);
  const outlierNames = outlierReps.map((r) => r.name.split(" ")[0]).join("، ");

  switch (kind) {
    case "correct":
      return {
        kind,
        title: "Q3 Quarterly Review — قرارك أثبت نفسه",
        scenes: [
          `${healthy} احتفظ بكل المندوبين. Attrition = صفر.`,
          `${outlier} دخل خطة تطوير. 6 من 7 مندوبين تحت الخط طلعوا فوق 85%.`,
          "Pipeline coverage في كل المناطق +18%. الإدارة المالية وافقت على ميزانية Q4 بدون اعتراض.",
        ],
        finalEmail: {
          from: "Karim Halim — VP Sales",
          subject: "شغل ممتاز",
          body: "كنت محتاج المنطق ده من زمان. ادخل اجتماع القيادة بكره الساعة 10.",
        },
      };

    case "surface-wrong":
      return {
        kind,
        title: "Q3 Quarterly Review — القرار اتفجّر",
        scenes: [
          `بعد شهر: ${outlierNames} استقالوا من ${outlier} بعد ما استلموا البونص — كانوا أصلاً ماشيين مع المنافس.`,
          `باقي ${outlier} فضلوا تحت 85%. متوسط الفريق نزل لـ69%. 4 مناطق توزيع وقفت أو ضعفت.`,
          `${healthy} اللي كان مفروض ياخد المكافأة، استلم خطة تدريب بدل كده. الـMorale نزل والـattrition بدأ يتحرك.`,
        ],
        finalEmail: {
          from: "Karim Halim — VP Sales",
          subject: "محتاجين نتكلم",
          body: "أنا محتاج أفهم التحليل اللي وصلك للقرار ده. تعالى مكتبي بكره 9 الصبح.",
        },
      };

    case "uninformed":
      return {
        kind,
        title: "Q3 Quarterly Review — قرّرت من غير ما تشوف",
        scenes: [
          "Alex (المنافس) قدّم نفس توصيتك بنفس المتوسط. الإدارة اعتمدت القرار.",
          `${outlier} خسر مندوبيه النجوم خلال شهرين. القصة المتكررة: مكافأة لمن لا يستحق، تدريب لمن يستحق المكافأة.`,
          "في ال Retrospective هتشوف الأدوات اللي ما فتحتهاش — كانت في إيدك من البداية.",
        ],
        finalEmail: {
          from: "Hala Mostafa — HR Director",
          subject: "تقرير ما بعد القرار",
          body: "محتاج نراجع منهجية التحليل في الجلسة الجاية. ابعتلي ملف بكل المقاييس اللي بنيت عليها التوصية.",
        },
      };

    case "double-reward":
      return {
        kind,
        title: "Q3 Quarterly Review — صرفت البونص على الكل",
        scenes: [
          "الميزانية صُرفت بالكامل. الفرقتين فرحت في الأول.",
          `بس ${outlier} نجومه مشوا برضه بعد ما استلموا الفلوس. مفيش خطة تطوير لباقي الفريق.`,
          "النتيجة Mixed: Team B استقر، Team A تعرّى. CFO سأل عن ROI القرار، مفيش إجابة واضحة.",
        ],
        finalEmail: {
          from: "Karim Halim — VP Sales",
          subject: "إعادة تقييم",
          body: "البونص للكل = مكافأة للا أحد. خلينا نراجع نموذج اتخاذ القرار.",
        },
      };

    case "double-training":
      return {
        kind,
        title: "Q3 Quarterly Review — رسالة سلبية للجميع",
        scenes: [
          `${healthy} اللي عمل اللي عليه استلم خطة تدريب بدل المكافأة. الـMorale انهار.`,
          `${outlier} برضه دخل تدريب، بس النجوم استقالوا قبل ما يبدأ.`,
          "الفرقتين شعروا إن الشركة مش بتقدّر، Attrition عام زاد 12%.",
        ],
        finalEmail: {
          from: "Hala Mostafa — HR Director",
          subject: "ملاحظات على القرار",
          body: "التدريب وحده مش بديل للتقدير. نحتاج إعادة هيكلة لسياسة المكافآت.",
        },
      };

    case "mixed":
    default:
      return {
        kind: "mixed",
        title: "Q3 Quarterly Review — نتايج ملخبطة",
        scenes: [
          "القرار كان جزئي. بعض الأمور تحسّنت وبعضها ساء.",
          `${outlier} ما اتعالجش بشكل واضح، ${healthy} استلم رسالة مش متسقة.`,
          "الإدارة طلبت توضيح للمنطق وراء التوصية.",
        ],
        finalEmail: {
          from: "Karim Halim — VP Sales",
          subject: "محتاج توضيح",
          body: "ابعتلي مذكرة تشرح ليه اخترت كل قرار على حدة.",
        },
      };
  }
}

// --- Action labels (Arabic) ---

export const actionLabel: Record<Action, string> = {
  reward: "مكافأة",
  training: "خطة تطوير",
  restructure: "إعادة هيكلة",
  hold: "تأجيل القرار",
};

export const toolLabel: Record<ToolId, string> = {
  average: "Average (المتوسط)",
  median: "Median (الوسيط)",
  spread: "Spread (التشتت)",
  countAbove: "Count Above Target (العدّ فوق الهدف)",
  distribution: "Distribution Plot (مخطط التوزيع)",
  inspect: "Inspect Individual (فحص فردي)",
};

// --- Legacy compat (kept so old imports don't break) ---
export const performanceThreshold = 85;
export type SliceOutcome = OutcomeKind | "pending";
export const getDecisionLabel = (a?: Action) => (a ? actionLabel[a] : "");
export const getTeamReadout = (teamId: TeamId) => {
  const t = datasetVariants[0][teamId];
  const above = countAbove(
    t.reps.map((r) => r.performance),
    85,
  );
  return {
    totalReps: t.reps.length,
    aboveThreshold: above,
    belowThreshold: t.reps.length - above,
    highOutliers: t.reps.filter((r) => r.performance >= 120).length,
  };
};
export const evaluateDecision = (): SliceOutcome => "pending";
