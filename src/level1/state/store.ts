// Reactive store for Level 1 — The Analyst: فخ المتوسط
// Mirrors state variables from Master Prompt §23.

export type Branch = "corniche" | "midan";
export type Outcome = "strong_success" | "partial_success" | "failure" | null;
export type RoomLocation = "office" | "sales" | "hr" | "meeting" | "map";
export type MissionTabId = "brief" | "branches" | "evidence" | "policy" | "notes";

export interface Level1State {
  currentLocation: RoomLocation;
  meetingTimeRemaining: number; // seconds
  timerRunning: boolean;
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
  missionFileOpen: boolean;
  missionFileTab: MissionTabId;
  notesText: string;
}

const initialState: Level1State = {
  currentLocation: "map",
  meetingTimeRemaining: 600,
  timerRunning: false,
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
  missionFileOpen: false,
  missionFileTab: "brief",
  notesText: "",
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

// ----- Phase 2 actions -----

export function tickTimer() {
  if (!state.timerRunning) return;
  if (state.meetingTimeRemaining <= 0) return;
  setState({ meetingTimeRemaining: Math.max(0, state.meetingTimeRemaining - 1) });
}

export function startTimer() {
  if (state.timerRunning) return;
  setState({ timerRunning: true });
}

export function markBriefRead() {
  if (state.hasReadBrief) return;
  setState({ hasReadBrief: true });
}

export function setMissionFileOpen(open: boolean) {
  setState({ missionFileOpen: open });
}

export function setActiveTab(tab: MissionTabId) {
  setState({ missionFileTab: tab, missionFileOpen: true });
}

export function setNotes(text: string) {
  setState({ notesText: text });
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
