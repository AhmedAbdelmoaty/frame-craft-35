// NovaPharm Distribution — Quarterly Performance Review Case
// Source case: "Misunderstanding Statistics" (Why Analysis Fails, IMP)
//
// Three dataset variants share the same statistical structure:
// one team has high mean driven by 3 outliers but few above threshold;
// the other team has lower mean but consistent performance above threshold.
// The "trap team" (outlierTeam) rotates across variants so replays don't
// rely on memorization.

import type { BriefcaseFile, Dataset, NPCId, Rep, Team } from "../game/types";

const arabicNamesPool = [
  "أحمد سامي",
  "محمود حسن",
  "كريم فؤاد",
  "يوسف عماد",
  "هاني صبري",
  "وليد إبراهيم",
  "شريف منير",
  "ياسر علاء",
  "طارق نبيل",
  "بسام فاروق",
  "إيهاب رشاد",
  "خالد مجدي",
  "سامح وحيد",
  "علي ناصر",
  "حسام عاطف",
  "نادر زكي",
  "أيمن صلاح",
  "ماجد حلمي",
  "رامي عوض",
  "أنس بدر",
];

function makeTeam(
  id: "teamA" | "teamB",
  name: string,
  region: string,
  performances: number[],
  nameOffset: number,
): Team {
  const reps: Rep[] = performances.map((p, i) => ({
    id: `${id}-${i + 1}`,
    name: arabicNamesPool[(nameOffset + i) % arabicNamesPool.length],
    performance: p,
  }));
  return { id, name, region, reps };
}

// Variant 0 — Trap is Team A (original case)
const variant0: Dataset = {
  id: 0,
  label: "Q2 — مراجعة الربع الثاني",
  description: "بيانات أداء مندوبي Team A و Team B في الربع الثاني.",
  teamA: makeTeam(
    "teamA",
    "Team A",
    "القاهرة الكبرى",
    [60, 65, 70, 75, 80, 82, 84, 150, 150, 150],
    0,
  ),
  teamB: makeTeam(
    "teamB",
    "Team B",
    "الدلتا",
    [85, 86, 87, 88, 89, 90, 91, 92, 93, 94],
    10,
  ),
  threshold: 85,
  targetK: 100,
  healthyTeam: "teamB",
  outlierTeam: "teamA",
};

// Variant 1 — Trap is Team B (mirrored for replay)
const variant1: Dataset = {
  id: 1,
  label: "Q3 — مراجعة الربع الثالث",
  description: "بيانات أداء جديدة بعد إعادة توزيع المناطق.",
  teamA: makeTeam(
    "teamA",
    "Team A",
    "الإسكندرية والساحل",
    [86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
    5,
  ),
  teamB: makeTeam(
    "teamB",
    "Team B",
    "الصعيد",
    [55, 62, 68, 73, 79, 83, 84, 145, 148, 152],
    14,
  ),
  threshold: 85,
  targetK: 100,
  healthyTeam: "teamA",
  outlierTeam: "teamB",
};

// Variant 2 — Subtler outliers, trap is Team A again
const variant2: Dataset = {
  id: 2,
  label: "Q4 — مراجعة الربع الرابع",
  description: "بيانات نهاية السنة بعد ضم مندوبين جدد.",
  teamA: makeTeam(
    "teamA",
    "Team A",
    "القناة وسيناء",
    [70, 72, 75, 77, 79, 81, 83, 120, 125, 130],
    2,
  ),
  teamB: makeTeam(
    "teamB",
    "Team B",
    "الجيزة والفيوم",
    [86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
    11,
  ),
  threshold: 85,
  targetK: 100,
  healthyTeam: "teamB",
  outlierTeam: "teamA",
};

export const datasetVariants: [Dataset, Dataset, Dataset] = [variant0, variant1, variant2];

export const company = {
  name: "NovaPharm Distribution",
  tagline: "B2B Pharmaceutical Distribution",
  arabicName: "نوفافارم للتوزيع الدوائي",
};

export const npcs: Record<NPCId, { name: string; role: string; tone: string; location: string }> = {
  ceo: {
    name: "Nader Sami",
    role: "الرئيس التنفيذي (CEO)",
    tone: "صاحب القرار النهائي، بيبعت ويستقبل عبر الإيميل",
    location: "الإدارة العليا",
  },
  karim: {
    name: "Karim Halim",
    role: "مدير المبيعات",
    tone: "مباشر، تحت ضغط، عايز قرار بسرعة",
    location: "مكتب مدير المبيعات",
  },
  hala: {
    name: "Hala Mostafa",
    role: "مديرة الموارد البشرية",
    tone: "هادية، بتفكر في صحة الفرق على المدى الطويل",
    location: "غرفة اجتماعات الموارد البشرية",
  },
  tarek: {
    name: "Tarek Anwar",
    role: "مشرف العمليات الميدانية",
    tone: "خبير ميدان، عنده شك بس مش متأكد",
    location: "مكتب العمليات الميدانية",
  },
  alex: {
    name: "Alex Mounir",
    role: "محلل بيانات (زميل)",
    tone: "واثق من نفسه، بيستعجل، بيشوف المتوسط بس",
    location: "مكتب اللاب",
  },
};

// Story-driven dialogues. No statistical hints.
// Each NPC's last line gives the player a tangible file for their briefcase.
export const dialogues: Record<NPCId, string[]> = {
  ceo: [],
  karim: [
    "أهلاً. عارف إنك لسه جديد، بس عندنا قرار بونص الربع لازم يطلع الأسبوع ده.",
    "كل مندوب تارجته 100 ألف في الشهر. أنا شخصياً مرشّح Team A — أرقامهم مذهلة.",
    "بس مش هلزمك برأيي. خد ملف بيانات المبيعات الخام واشتغل عليه براحتك.",
    "📂 [Karim سلّمك: ملف بيانات المبيعات الخام]",
  ],
  hala: [
    "أهلاً. أنا قلقانة من القرار ده، مش من زاوية الأرقام، من زاوية تأثيره على الناس.",
    "في صناعة الدوا، فقدان مندوب واحد ممكن يخسّرنا منطقة كاملة لشهور.",
    "خدت الملف ده، فيه سياسة المكافآت بتاعتنا بالضبط ومعدلات الترك الموثّقة.",
    "📂 [Hala سلّمتك: ملف سياسة الموارد البشرية]",
  ],
  tarek: [
    "أنا في الميدان من 12 سنة. بشوف الأمور اللي ما بتطلعش في الأرقام.",
    "خد بالك — في Team A أو Team B، أنا حاسس بحاجة مش مظبوطة، بس مش هقولك مين.",
    "كتبتلك ملاحظاتي على المندوبين اللي زرتهم الشهر ده. اقراها بنفسك.",
    "📂 [Tarek سلّمك: ملف الملاحظات الميدانية]",
  ],
  alex: [
    "أنا خلّصت التحليل من بدري. المتوسط واضح، مش محتاج كل ده.",
    "أنا قدّمت توصيتي للإدارة. اللي متوسطه أعلى، خلاص.",
    "بتضيع وقتك في تفاصيل. القرار بسيط.",
  ],
};

// Files the player collects in the field, then opens at the desk
export const briefcaseFiles: BriefcaseFile[] = [
  {
    id: "salesData",
    title: "بيانات المبيعات الخام",
    source: "karim",
    icon: "📊",
    description: "جدول أداء كل المندوبين في الفريقين خلال الربع.",
  },
  {
    id: "hrPolicy",
    title: "سياسة الموارد البشرية",
    source: "hala",
    icon: "📑",
    description: "معايير الـGood Performer ومعدلات الترك التاريخية.",
  },
  {
    id: "fieldNotes",
    title: "ملاحظات Tarek الميدانية",
    source: "tarek",
    icon: "🗒️",
    description: "تعليقات قصيرة على مندوبين بعينهم من زيارات الميدان.",
  },
];

// Per-rep inspection notes. Shown in a side panel; never auto-saved to the notebook.
export function getInspectNote(dataset: Dataset, repId: string): string {
  const allReps = [...dataset.teamA.reps, ...dataset.teamB.reps];
  const rep = allReps.find((r) => r.id === repId);
  if (!rep) return "لا تتوفر معلومات إضافية.";

  const outlierReps = dataset[dataset.outlierTeam].reps.filter((r) => r.performance >= 120);
  if (outlierReps.some((r) => r.id === repId)) {
    return `${rep.name}: قفل صفقة كبيرة مع شبكة صيدليات هذا الربع. حسب ملاحظات Tarek، تلقى عرض توظيف من منافس الأسبوع الماضي ولم يرد بعد.`;
  }

  const healthyReps = dataset[dataset.healthyTeam].reps;
  if (healthyReps.some((r) => r.id === repId)) {
    return `${rep.name}: أداء مستقر منذ 3 أرباع. لا يوجد ملاحظات سلبية من HR.`;
  }

  return `${rep.name}: مندوب في فترة تطوير. لم يصل لخط 85% هذا الربع.`;
}

// Backwards-compat exports (some legacy files may still import these)
export const performanceThreshold = 85;
export const salesTeams = {
  teamA: variant0.teamA,
  teamB: variant0.teamB,
};
export const stationCopy = {
  lobby: { title: "Lobby", speaker: "", message: "" },
  desk: { title: "Desk", speaker: "", message: "" },
  sales: { title: "Sales", speaker: "", message: "" },
  hr: { title: "HR", speaker: "", message: "" },
  decision: { title: "Decision", speaker: "", message: "" },
} as const;
export const evidenceLibrary = {} as Record<string, { id: string; title: string; note: string; station: string }>;
