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
  ToolCategory,
  ToolId,
} from "./types";

// --- Descriptive statistics ---

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

export const mode = (xs: number[]): { values: number[]; freq: number } => {
  const counts = new Map<number, number>();
  xs.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
  let max = 0;
  counts.forEach((c) => {
    if (c > max) max = c;
  });
  const values: number[] = [];
  counts.forEach((c, v) => {
    if (c === max) values.push(v);
  });
  values.sort((a, b) => a - b);
  return { values, freq: max };
};

export const range = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
export const minOf = (xs: number[]) => Math.min(...xs);
export const maxOf = (xs: number[]) => Math.max(...xs);

export const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / xs.length);
};

export const quartiles = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  const med = median(s);
  const lower = s.slice(0, Math.floor(n / 2));
  const upper = s.slice(Math.ceil(n / 2));
  return { q1: median(lower), med, q3: median(upper) };
};

export const countAbove = (xs: number[], threshold: number) =>
  xs.filter((x) => x >= threshold).length;

export const round1 = (n: number) => Math.round(n * 10) / 10;

// --- Dataset access ---

export const getDataset = (id: DatasetVariantId): Dataset => datasetVariants[id];

// --- Tool metadata ---

export const toolCategory: Record<ToolId, ToolCategory> = {
  mean: "central",
  median: "central",
  mode: "central",
  range: "spread",
  sd: "spread",
  dotplot: "distribution",
  boxplot: "distribution",
  countAbove: "conditional",
};

export const toolLabel: Record<ToolId, string> = {
  mean: "المتوسط الحسابي (Mean)",
  median: "الوسيط (Median)",
  mode: "المنوال (Mode)",
  range: "المدى (Range)",
  sd: "الانحراف المعياري (SD)",
  dotplot: "مخطط النقاط (Dot Plot)",
  boxplot: "مخطط الصندوق (Box Plot)",
  countAbove: "العدّ فوق حدّ (Count Above)",
};

export const toolShort: Record<ToolId, string> = {
  mean: "Mean",
  median: "Median",
  mode: "Mode",
  range: "Range",
  sd: "SD",
  dotplot: "Dot Plot",
  boxplot: "Box Plot",
  countAbove: "Count Above",
};

export const categoryLabel: Record<ToolCategory, string> = {
  central: "مقاييس النزعة المركزية",
  spread: "مقاييس التشتت",
  distribution: "رسم التوزيع",
  conditional: "العدّ الشرطي",
};

export const categoryHint: Record<ToolCategory, string> = {
  central: "أين يتمركز الأداء؟",
  spread: "هل الفريق متماسك أم متفرّق؟",
  distribution: "كيف تتوزع القيم بصرياً؟",
  conditional: "كم مندوب يحقق المعيار؟",
};

// --- Consequence evaluation ---

export type ToolUse = { tool: ToolId; team: TeamId; thresholdValue?: number };

export function evaluateOutcome(
  dataset: Dataset,
  rec: Recommendation,
  pinnedTools: ToolUse[],
): OutcomeKind {
  const healthyAction = rec[dataset.healthyTeam];
  const outlierAction = rec[dataset.outlierTeam];

  if (healthyAction === "defer" || outlierAction === "defer") {
    return "deferred";
  }

  // Did the player ever pin a revealing tool on the outlier team?
  const revealingTools: ToolId[] = ["median", "dotplot", "boxplot", "countAbove", "sd"];
  const usedRevealingOnOutlier = pinnedTools.some(
    (t) => t.team === dataset.outlierTeam && revealingTools.includes(t.tool),
  );
  const draggedToThreshold = pinnedTools.some(
    (t) =>
      t.tool === "countAbove" &&
      t.thresholdValue !== undefined &&
      Math.abs(t.thresholdValue - dataset.threshold) <= 5,
  );

  // "Uninformed" = rewarded outlier team without ever digging beneath the mean.
  if (outlierAction === "reward" && !usedRevealingOnOutlier && !draggedToThreshold) {
    return "uninformed";
  }

  if (healthyAction === "reward" && outlierAction === "training") {
    // Correct decision; was it informed?
    if (usedRevealingOnOutlier || draggedToThreshold) return "correct";
    return "lucky-correct";
  }

  if (outlierAction === "reward" && healthyAction !== "reward") {
    return "surface-wrong";
  }

  if (healthyAction === "reward" && outlierAction === "reward") {
    return "double-reward";
  }

  if (healthyAction === "training" && outlierAction === "training") {
    return "double-training";
  }

  return "deferred";
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
        title: "بعد 3 شهور — قرارك أثبت نفسه",
        scenes: [
          `${healthy} احتفظ بكل المندوبين. معدل الترك صفر.`,
          `${outlier} دخل خطة تطوير، و6 من 7 مندوبين تحت الخط طلعوا فوق سياسة الـ85%.`,
          "تغطية الصيدليات في كل المناطق زادت 18%. الإدارة المالية وافقت على ميزانية الربع الجاي.",
        ],
        finalEmail: {
          from: "Nader Sami — الرئيس التنفيذي",
          subject: "شغل ممتاز",
          body: "كنت محتاج المنطق ده من زمان. تعالى اجتماع القيادة بكره الساعة 10.",
        },
      };

    case "lucky-correct":
      return {
        kind,
        title: "بعد 3 شهور — القرار طلع صح، بس بالصدفة",
        scenes: [
          `${healthy} اتكافأ، و${outlier} دخل تطوير. النتيجة الإجمالية إيجابية.`,
          "بس Alex راجع تحليلك وقالك: 'بنيت قرارك على المتوسط بس. لو الأرقام كانت اتقلبت، كنت غلطت.'",
          "في الـRetrospective هتشوف ليه القرار طلع صح من غير ما تكون فاتح كل البيانات.",
        ],
        finalEmail: {
          from: "Karim Halim — مدير المبيعات",
          subject: "ملاحظة سريعة",
          body: "النتيجة كويسة بس عايز أعرف بنيت القرار ازاي بالظبط. ابعتلي تفصيل أكتر.",
        },
      };

    case "surface-wrong":
      return {
        kind,
        title: "بعد 3 شهور — القرار اتفجّر",
        scenes: [
          `بعد شهر: ${outlierNames} استقالوا من ${outlier} بعد ما استلموا البونص — كانوا أصلاً ماشيين مع المنافس.`,
          `باقي ${outlier} فضلوا تحت 85%. متوسط الفريق نزل لـ69%. 4 مناطق توزيع وقفت أو ضعفت.`,
          `${healthy} اللي كان مفروض ياخد المكافأة استلم خطة تدريب بدل كده. الـMorale نزل وبدأ ناس يفكروا يستقيلوا.`,
        ],
        finalEmail: {
          from: "Nader Sami — الرئيس التنفيذي",
          subject: "محتاجين نتكلم",
          body: "محتاج أفهم التحليل اللي وصلك للقرار ده. تعالى مكتبي بكره 9 الصبح.",
        },
      };

    case "uninformed":
      return {
        kind,
        title: "بعد 3 شهور — قرّرت من غير ما تشوف",
        scenes: [
          "Alex قدّم نفس توصيتك بنفس المتوسط. الإدارة اعتمدت القرار.",
          `${outlier} خسر نجومه خلال شهرين. القصة المتكررة: مكافأة لمن لا يستحق، تدريب لمن يستحق.`,
          "هتشوف في الـ Retrospective الأدوات اللي ما فتحتهاش — كانت في إيدك من البداية.",
        ],
        finalEmail: {
          from: "Hala Mostafa — مديرة الموارد البشرية",
          subject: "مراجعة منهجية التحليل",
          body: "محتاج نراجع منهجية التحليل في الجلسة الجاية. ابعتلي ملف بكل المقاييس اللي بنيت عليها التوصية.",
        },
      };

    case "double-reward":
      return {
        kind,
        title: "بعد 3 شهور — كافأت الكل",
        scenes: [
          "الميزانية اتصرفت بالكامل. الفريقين فرحوا في الأول.",
          `بس ${outlier} نجومه مشوا برضه بعد ما استلموا الفلوس. مفيش خطة تطوير لباقي الفريق.`,
          "النتيجة مختلطة. الـCFO سأل عن العائد على القرار، مفيش إجابة واضحة.",
        ],
        finalEmail: {
          from: "Nader Sami — الرئيس التنفيذي",
          subject: "إعادة تقييم",
          body: "البونص للكل = مكافأة للا أحد. خلينا نراجع منهجية اتخاذ القرار.",
        },
      };

    case "double-training":
      return {
        kind,
        title: "بعد 3 شهور — رسالة سلبية للجميع",
        scenes: [
          `${healthy} اللي عمل اللي عليه استلم خطة تدريب بدل المكافأة. المعنويات انهارت.`,
          `${outlier} برضه دخل تدريب، بس النجوم استقالوا قبل ما يبدأ.`,
          "الفريقين شعروا إن الشركة مش بتقدّر، معدل الترك العام زاد 12%.",
        ],
        finalEmail: {
          from: "Hala Mostafa — مديرة الموارد البشرية",
          subject: "ملاحظات على القرار",
          body: "التدريب وحده مش بديل للتقدير. محتاجين نراجع سياسة المكافآت.",
        },
      };

    case "deferred":
    default:
      return {
        kind: "deferred",
        title: "بعد 3 شهور — أجّلت القرار، الإدارة قرّرت بدالك",
        scenes: [
          "أرسلت توصية مؤجلة. الإدارة كانت محتاجة قرار، فأخدته بناءً على المتوسط.",
          `${outlier} اتكافأ، نجومه استقالوا. ${healthy} دخل تطوير.`,
          "Karim علّق: 'محتاجينك تاخد قرار، مش تأجّله. ده شغلك.'",
        ],
        finalEmail: {
          from: "Nader Sami — الرئيس التنفيذي",
          subject: "ملاحظة على أسلوبك",
          body: "التأجيل مش قرار. لو البيانات مش كفاية، قول كده وحدّد إيه اللي ناقصك. مش تسيب الكورة في الملعب.",
        },
      };
  }
}

// --- Action labels (Arabic) ---

export const actionLabel: Record<Action, string> = {
  reward: "مكافأة + تثبيت",
  training: "خطة تطوير",
  defer: "مراجعة بعد ربع تاني",
};

export const actionDescription: Record<Action, string> = {
  reward: "الفريق بيؤدي بمستوى يستحق المكافأة، نحافظ عليه.",
  training: "الأداء تحت المطلوب رغم أي مظاهر، نستثمر في تطويره.",
  defer: "البيانات الحالية مش كافية لقرار قاطع، نراجع الربع الجاي.",
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
