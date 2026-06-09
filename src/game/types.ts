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

// Simplified analyst toolbox — 4 tools, always run on BOTH teams side-by-side.
//  - mean       → where does the team center?
//  - median     → middle value (robust to outliers)
//  - spread     → range + standard deviation, merged
//  - countAbove → how many reps clear the policy threshold?
export type ToolId = "mean" | "median" | "spread" | "countAbove";

// 3 clear business actions
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

export type BriefcaseFileId = "salesData" | "hrPolicy" | "fieldNotes";

export type BriefcaseFile = {
  id: BriefcaseFileId;
  title: string;
  source: NPCId;
  icon: string;
  description: string;
};

// A side-by-side comparison result. Always covers both teams.
export type ComparisonResult = {
  id: string;
  tool: ToolId;
  title: string;
  hint: string; // short Arabic line explaining what this measures
  summaryA: string;
  summaryB: string;
  // raw display values (string-formatted, e.g. "95%" or "8/10")
  displayA: string;
  displayB: string;
  // which team scores "better" by this metric (or null = tie / not applicable)
  winner: TeamId | null;
  threshold?: number;
};

export type NotebookCard = ComparisonResult & { pinnedAt: number };

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

// Legacy compatibility shims (kept for any old imports)
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
// kept so any stale references compile during transition
export type ToolCategory = "central" | "spread" | "distribution" | "conditional";
export type PendingResult = ComparisonResult;
