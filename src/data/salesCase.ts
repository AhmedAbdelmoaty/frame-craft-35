import type { EvidenceItem, SalesTeam } from "../game/types";

export const performanceThreshold = 85;

export const salesTeams: Record<string, SalesTeam> = {
  teamA: {
    id: "teamA",
    name: "Team A",
    totalSalesK: 966,
    averagePerformance: 96.6,
    reps: [60, 65, 70, 75, 80, 82, 84, 150, 150, 150].map((performance, index) => ({
      id: `a-${index + 1}`,
      label: `A${index + 1}`,
      performance,
    })),
  },
  teamB: {
    id: "teamB",
    name: "Team B",
    totalSalesK: 895,
    averagePerformance: 89.5,
    reps: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94].map((performance, index) => ({
      id: `b-${index + 1}`,
      label: `B${index + 1}`,
      performance,
    })),
  },
};

export const stationCopy = {
  lobby: {
    title: "الاستقبال",
    speaker: "مديرة المكتب",
    message: "دورة مراجعة الأداء تبدأ الآن. اجمع ما يكفي من الأدلة قبل أن تقدم توصية للإدارة.",
  },
  desk: {
    title: "مكتب التحليل",
    speaker: "ليلى - مدربة البيانات",
    message: "افتح ملف التقرير المختصر من على المكتب. هو نقطة بداية، وليس نهاية التحقيق.",
  },
  sales: {
    title: "قسم المبيعات",
    speaker: "عمر - مدير المبيعات",
    message: "الفريقان اشتغلا بجد هذا الشهر. راجع لوحة المبيعات وبطاقات الأفراد قبل القرار.",
  },
  hr: {
    title: "إدارة الموارد البشرية",
    speaker: "سارة - مديرة HR",
    message: "سياسة المراجعة موجودة في ملف HR. افتحه قبل أن تفسر نتائج الفرق.",
  },
  decision: {
    title: "لوحة القرار",
    speaker: "سارة - مديرة HR",
    message: "هذه غرفة الاعتماد. قدم توصية عندما يكون دفتر الأدلة كافيًا بالنسبة لك.",
  },
} as const;

export const evidenceLibrary: Record<string, EvidenceItem> = {
  missionBrief: {
    id: "missionBrief",
    title: "تكليف المراجعة",
    note: "الإدارة تحتاج توصية لفريقين مبيعات قبل إغلاق دورة المكافآت والتدريب.",
    station: "lobby",
  },
  summaryReport: {
    id: "summaryReport",
    title: "التقرير المختصر",
    note: "Team A: إجمالي 966K ومتوسط 96.6%. Team B: إجمالي 895K ومتوسط 89.5%.",
    station: "desk",
  },
  hrPolicy: {
    id: "hrPolicy",
    title: "سياسة HR",
    note: "حد الأداء الجيد في هذه الدورة هو 85% أو أكثر من هدف كل مندوب.",
    station: "hr",
  },
  salesContext: {
    id: "salesContext",
    title: "ملاحظة مدير المبيعات",
    note: "عمر يريد توصية لا تظلم فريقًا مستقرًا ولا تتجاهل أصحاب الأداء العالي.",
    station: "sales",
  },
  repCards: {
    id: "repCards",
    title: "بطاقات المندوبين",
    note: "فتحت تفاصيل أداء الأفراد. يمكنك الآن تعليم البطاقات فوق أو تحت حد HR.",
    station: "sales",
  },
  decisionSubmitted: {
    id: "decisionSubmitted",
    title: "تم اعتماد توصية",
    note: "القرار أُرسل للإدارة، وبدأت آثاره تظهر داخل الشركة.",
    station: "decision",
  },
};
