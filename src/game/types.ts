export type AvatarChoice = "female" | "male";

export type PlayerProfile = {
  name: string;
  avatar: AvatarChoice;
};

export type TeamId = "teamA" | "teamB";

export type DatasetVariantId = 0 | 1 | 2;

export type GamePhase =
  | "cold-open"
  | "field"
  | "lab"
  | "memo"
  | "cutscene"
  | "retrospective";

// Tools = categorized "analyst toolbox"
// Central tendency: mean, median, mode
// Spread: range, sd
// Distribution: dotplot, boxplot
// Conditional: countAbove
export type ToolId =
  | "mean"
  | "median"
  | "mode"
  | "range"
  | "sd"
  | "dotplot"
  | "boxplot"
  | "countAbove";

export type ToolCategory = "central" | "spread" | "distribution" | "conditional";

// 3 clear business actions (restructure removed per design)
export type Action = "reward" | "training" | "defer";

export type NPCId = "karim" | "hala" | "tarek" | "alex" | "ceo";

export type Rep = {
  id: string;
  name: string;
  performance: number;
};

export type Team = {
  id: TeamId;
  name: string;
  region: string;
  reps: Rep[];
};

export type Dataset = {
  id: DatasetVariantId;
  label: string;
  description: string;
  teamA: Team;
  teamB: Team;
  threshold: number;
  targetK: number;
  healthyTeam: TeamId;
  outlierTeam: TeamId;
};

// Files the player collects from NPCs and opens at the desk
export type BriefcaseFileId = "salesData" | "hrPolicy" | "fieldNotes";

export type BriefcaseFile = {
  id: BriefcaseFileId;
  title: string;
  source: NPCId;
  icon: string;
  description: string;
};

export type ToolResult =
  | { kind: "mean"; team: TeamId; value: number }
  | { kind: "median"; team: TeamId; value: number }
  | { kind: "mode"; team: TeamId; values: number[]; freq: number }
  | { kind: "range"; team: TeamId; min: number; max: number; value: number }
  | { kind: "sd"; team: TeamId; value: number }
  | { kind: "dotplot"; team: TeamId }
  | { kind: "boxplot"; team: TeamId; q1: number; med: number; q3: number; min: number; max: number }
  | { kind: "countAbove"; team: TeamId; threshold: number; count: number; total: number };

export type NotebookCard = {
  id: string;
  tool: ToolId;
  team: TeamId;
  title: string;
  summary: string;
  pinnedAt: number;
};

// Pending result shown in the workspace before user pins or discards it
export type PendingResult = {
  id: string;
  tool: ToolId;
  team: TeamId;
  title: string;
  summary: string;
  threshold?: number;
};

export type Recommendation = {
  teamA: Action;
  teamB: Action;
  primaryMetric: ToolId | null;
};

export type OutcomeKind =
  | "correct"
  | "lucky-correct"
  | "surface-wrong"
  | "double-reward"
  | "double-training"
  | "deferred"
  | "uninformed";

export type Outcome = {
  kind: OutcomeKind;
  title: string;
  scenes: string[];
  finalEmail: { from: string; subject: string; body: string };
};

// Legacy compatibility (kept for any old imports during transition)
export type StationId = "lobby" | "desk" | "sales" | "hr" | "decision";
export type EvidenceId = string;
export type HotspotId = string;
export type DecisionType = Action;
export type PlayerDecision = Partial<Record<TeamId, Action>>;
export type SliceOutcome = OutcomeKind | "pending";
export type SalesRep = Rep;
export type SalesTeam = Team & { totalSalesK: number; averagePerformance: number };
export type EvidenceItem = { id: string; title: string; note: string; station: StationId };
export type GutCheck = "A" | "B" | "unsure";
