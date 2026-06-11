import { performanceThreshold, salesTeams } from "../data/salesCase";
import type { DecisionType, PlayerDecision, SliceOutcome, TeamId } from "./types";

export type TeamReadout = {
  totalReps: number;
  aboveThreshold: number;
  belowThreshold: number;
  highOutliers: number;
};

export function getTeamReadout(teamId: TeamId): TeamReadout {
  const team = salesTeams[teamId];
  const aboveThreshold = team.reps.filter((rep) => rep.performance >= performanceThreshold).length;
  const highOutliers = team.reps.filter((rep) => rep.performance >= 140).length;

  return {
    totalReps: team.reps.length,
    aboveThreshold,
    belowThreshold: team.reps.length - aboveThreshold,
    highOutliers,
  };
}

export function evaluateDecision(decisions: PlayerDecision): SliceOutcome {
  const teamA = decisions.teamA;
  const teamB = decisions.teamB;

  if (!teamA || !teamB) {
    return "pending";
  }

  if (teamB === "reward" && teamA === "training") {
    return "strong";
  }

  if (teamA === "reward" && teamB !== "reward") {
    return "surface";
  }

  return "mixed";
}

export function getDecisionLabel(decision?: DecisionType) {
  switch (decision) {
    case "reward":
      return "مكافأة";
    case "training":
      return "تدريب";
    case "review":
      return "مراجعة";
    default:
      return "لا يوجد إجراء";
  }
}
