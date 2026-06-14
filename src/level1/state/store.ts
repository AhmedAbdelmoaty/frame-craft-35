// Reactive store for Level 1 — The Analyst: فخ المتوسط
// Mirrors state variables from Master Prompt §23.

export type Branch = "corniche" | "midan";
export type Outcome = "strong_success" | "partial_success" | "failure" | null;
export type RoomLocation = "office" | "sales" | "hr" | "meeting" | "map";

export interface Level1State {
  currentLocation: RoomLocation;
  meetingTimeRemaining: number; // seconds
  hasReadBrief: boolean;
  hasVisitedSales: boolean;
  hasSavedSalesSummary: boolean;
  hasVisitedHR: boolean;
  hasSavedHRPolicy: boolean;
  hasOpenedPerformanceCards: boolean;
  hasSortedCorniche: boolean;
  hasSortedMidan: boolean;
  usedQuickNumber: boolean;
  usedThresholdLine: boolean;
  usedTypicalPerformance: boolean;
  usedStability: boolean;
  selectedBranch: Branch | null;
  selectedEvidenceIds: string[];
  finalOutcome: Outcome;
}

const initialState: Level1State = {
  currentLocation: "map",
  meetingTimeRemaining: 600,
  hasReadBrief: false,
  hasVisitedSales: false,
  hasSavedSalesSummary: false,
  hasVisitedHR: false,
  hasSavedHRPolicy: false,
  hasOpenedPerformanceCards: false,
  hasSortedCorniche: false,
  hasSortedMidan: false,
  usedQuickNumber: false,
  usedThresholdLine: false,
  usedTypicalPerformance: false,
  usedStability: false,
  selectedBranch: null,
  selectedEvidenceIds: [],
  finalOutcome: null,
};

type Listener = (state: Level1State) => void;

let state: Level1State = { ...initialState };
const listeners = new Set<Listener>();

export function getState(): Level1State {
  return state;
}

export function setState(patch: Partial<Level1State>) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isMeetingUnlocked(s: Level1State = state): boolean {
  return (
    s.hasSavedSalesSummary &&
    s.hasSavedHRPolicy &&
    s.hasOpenedPerformanceCards &&
    s.hasSortedCorniche &&
    s.hasSortedMidan &&
    s.usedThresholdLine &&
    (s.usedTypicalPerformance || s.usedStability || s.usedQuickNumber)
  );
}
