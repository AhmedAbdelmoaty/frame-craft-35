export type AvatarChoice = "female" | "male";

export type PlayerProfile = {
  name: string;
  avatar: AvatarChoice;
};

export type StationId = "lobby" | "desk" | "sales" | "hr" | "decision";

export type TeamId = "teamA" | "teamB";

export type DecisionType = "reward" | "training" | "review";

export type EvidenceId =
  | "missionBrief"
  | "summaryReport"
  | "hrPolicy"
  | "salesContext"
  | "repCards"
  | "decisionSubmitted";

export type HotspotId = "reception" | "summaryReport" | "hrFolder" | "salesBoard" | "repCabinet" | "decisionBoard";

export type SalesRep = {
  id: string;
  label: string;
  performance: number;
};

export type SalesTeam = {
  id: TeamId;
  name: string;
  totalSalesK: number;
  averagePerformance: number;
  reps: SalesRep[];
};

export type PlayerDecision = Partial<Record<TeamId, DecisionType>>;

export type SliceOutcome = "pending" | "strong" | "surface" | "mixed";

export type EvidenceItem = {
  id: EvidenceId;
  title: string;
  note: string;
  station: StationId;
};
