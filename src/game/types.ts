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

export type ToolId =
  | "average"
  | "median"
  | "spread"
  | "countAbove"
  | "distribution"
  | "inspect";

export type Action = "reward" | "training" | "restructure" | "hold";

export type NPCId = "karim" | "hala" | "tarek" | "alex";

export type GutCheck = "A" | "B" | "unsure";

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

export type ToolResult =
  | { kind: "average"; team: TeamId; value: number }
  | { kind: "median"; team: TeamId; value: number }
  | { kind: "spread"; team: TeamId; range: number; sd: number }
  | { kind: "countAbove"; team: TeamId; threshold: number; count: number; total: number }
  | { kind: "distribution"; team: TeamId }
  | { kind: "inspect"; team: TeamId; repId: string; note: string };

export type NotebookCard = {
  id: string;
  tool: ToolId;
  team: TeamId;
  title: string;
  summary: string;
};

export type Recommendation = {
  teamA: Action;
  teamB: Action;
  primaryMetric: ToolId;
};

export type OutcomeKind =
  | "correct"
  | "surface-wrong"
  | "double-reward"
  | "double-training"
  | "mixed"
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
