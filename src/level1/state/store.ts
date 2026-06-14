// Reactive store for Level 1 — The Analyst: فخ المتوسط

import type { BranchId } from "../data/branches";

export type Branch = BranchId;
export type Outcome = "success" | "failure" | null;
export type FailureReason = "chose_corniche" | "midan_weak_evidence" | "incomplete" | null;
export type RoomLocation = "office" | "sales" | "hr" | "meeting" | "map";
export type MissionTabId = "brief" | "branches" | "evidence" | "policy" | "notes";
export type ToolId = "mean" | "threshold" | "median" | "stability";

export interface Level1State {
  currentLocation: RoomLocation;
  meetingTimeRemaining: number;
  timerRunning: boolean;
  hasReadBrief: boolean;
  hasVisitedSales: boolean;
  hasInspectedSalesBoard: boolean;
  hasSavedSalesSummary: boolean;
  hasVisitedHR: boolean;
  hasInspectedHRPolicy: boolean;
  hasSavedHRPolicy: boolean;
  hasOpenedPerformanceCards: boolean;
  hasSortedCorniche: boolean;
  hasSortedMidan: boolean;
  usedQuickNumber: boolean;
  usedThresholdLine: boolean;
  usedTypicalPerformance: boolean; // median
  usedStability: boolean;
  toolToggles: Record<ToolId, boolean>;
  selectedBranch: Branch | null;
  selectedEvidenceIds: string[];
  finalOutcome: Outcome;
  failureReason: FailureReason;
  meetingStage: "intro" | "branch" | "evidence" | "result";
  missionFileOpen: boolean;
  missionFileTab: MissionTabId;
  notesText: string;
  meetingUnlockSeen: boolean;
  lastMissionUpdate: string | null;
}

const initialState: Level1State = {
  currentLocation: "map",
  meetingTimeRemaining: 600,
  timerRunning: false,
  hasReadBrief: false,
  hasVisitedSales: false,
  hasInspectedSalesBoard: false,
  hasSavedSalesSummary: false,
  hasVisitedHR: false,
  hasInspectedHRPolicy: false,
  hasSavedHRPolicy: false,
  hasOpenedPerformanceCards: false,
  hasSortedCorniche: false,
  hasSortedMidan: false,
  usedQuickNumber: false,
  usedThresholdLine: false,
  usedTypicalPerformance: false,
  usedStability: false,
  toolToggles: { mean: false, threshold: false, median: false, stability: false },
  selectedBranch: null,
  selectedEvidenceIds: [],
  finalOutcome: null,
  failureReason: null,
  meetingStage: "intro",
  missionFileOpen: false,
  missionFileTab: "brief",
  notesText: "",
  meetingUnlockSeen: false,
  lastMissionUpdate: null,
};

type Listener = (state: Level1State) => void;
let state: Level1State = { ...initialState };
const listeners = new Set<Listener>();

export const getState = () => state;
export function setState(patch: Partial<Level1State>) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn(state));
}
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ----- Timer -----
export function tickTimer() {
  if (!state.timerRunning || state.meetingTimeRemaining <= 0) return;
  setState({ meetingTimeRemaining: Math.max(0, state.meetingTimeRemaining - 1) });
}
export function startTimer() {
  if (state.timerRunning) return;
  setState({ timerRunning: true });
}

// ----- Mission File -----
export function markBriefRead() {
  if (!state.hasReadBrief) setState({ hasReadBrief: true });
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

// ----- Sales / HR -----
export function visitSales() {
  if (!state.hasVisitedSales) setState({ hasVisitedSales: true });
}
export function inspectSalesBoard() {
  if (!state.hasInspectedSalesBoard) setState({ hasInspectedSalesBoard: true });
}
export function saveSalesSummary() {
  if (!state.hasSavedSalesSummary) setState({ hasSavedSalesSummary: true });
}
export function visitHR() {
  if (!state.hasVisitedHR) setState({ hasVisitedHR: true });
}
export function inspectHRPolicy() {
  if (!state.hasInspectedHRPolicy) setState({ hasInspectedHRPolicy: true });
}
export function saveHRPolicy() {
  if (!state.hasSavedHRPolicy) setState({ hasSavedHRPolicy: true });
}

// ----- Performance cards / tools -----
export function openPerformanceCards() {
  if (!state.hasOpenedPerformanceCards) setState({ hasOpenedPerformanceCards: true });
}
export function markSorted(branch: Branch) {
  if (branch === "corniche" && !state.hasSortedCorniche) setState({ hasSortedCorniche: true });
  if (branch === "midan" && !state.hasSortedMidan) setState({ hasSortedMidan: true });
}
export function toggleTool(tool: ToolId) {
  const next = { ...state.toolToggles, [tool]: !state.toolToggles[tool] };
  const patch: Partial<Level1State> = { toolToggles: next };
  if (next.mean) patch.usedQuickNumber = true;
  if (next.threshold) patch.usedThresholdLine = true;
  if (next.median) patch.usedTypicalPerformance = true;
  if (next.stability) patch.usedStability = true;
  setState(patch);
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

// ----- Meeting -----
export function setMeetingStage(stage: Level1State["meetingStage"]) {
  setState({ meetingStage: stage });
}
export function selectBranch(branch: Branch) {
  setState({ selectedBranch: branch });
}
export function toggleEvidence(id: string) {
  const cur = state.selectedEvidenceIds;
  if (cur.includes(id)) {
    setState({ selectedEvidenceIds: cur.filter((x) => x !== id) });
  } else if (cur.length < 2) {
    setState({ selectedEvidenceIds: [...cur, id] });
  }
}
export function submitRecommendation(outcome: Outcome, reason: FailureReason) {
  setState({ finalOutcome: outcome, failureReason: reason, meetingStage: "result", timerRunning: false });
}
export function resetMeeting() {
  setState({
    selectedBranch: null,
    selectedEvidenceIds: [],
    finalOutcome: null,
    failureReason: null,
    meetingStage: "intro",
  });
}
