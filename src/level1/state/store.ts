// Reactive store for Level 1 — The Analyst: فخ المتوسط

import type { BranchId } from "../data/branches";

export type Branch = BranchId;
export type Outcome = "success" | "failure" | null;
export type FailureReason = "chose_corniche" | "midan_weak_evidence" | "incomplete" | null;
export type RoomLocation = "office" | "sales" | "hr" | "decision" | "meeting" | "map";
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
  hasReceivedIndividualPerformanceFile: boolean;
  hasVisitedHR: boolean;
  hasInspectedHRPolicy: boolean;
  hasSavedHRPolicy: boolean;
  hasEnteredAnalysisRoom: boolean;
  hasOpenedPerformanceCards: boolean;
  hasSortedCorniche: boolean;
  hasSortedMidan: boolean;
  usedQuickNumber: boolean;
  usedThresholdLine: boolean;
  usedTypicalPerformance: boolean; // median
  usedStability: boolean;
  toolToggles: Record<ToolId, boolean>;
  hasPreparedDecision: boolean;
  preparedBranch: Branch | null;
  preparedEvidenceIds: string[];
  selectedBranch: Branch | null;
  selectedEvidenceIds: string[];
  finalOutcome: Outcome;
  failureReason: FailureReason;
  meetingStage: "intro" | "summary" | "result";
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
  hasReceivedIndividualPerformanceFile: false,
  hasVisitedHR: false,
  hasInspectedHRPolicy: false,
  hasSavedHRPolicy: false,
  hasEnteredAnalysisRoom: false,
  hasOpenedPerformanceCards: false,
  hasSortedCorniche: false,
  hasSortedMidan: false,
  usedQuickNumber: false,
  usedThresholdLine: false,
  usedTypicalPerformance: false,
  usedStability: false,
  toolToggles: { mean: false, threshold: false, median: false, stability: false },
  hasPreparedDecision: false,
  preparedBranch: null,
  preparedEvidenceIds: [],
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

// ----- Mission File / Brief -----
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
  if (!state.hasSavedSalesSummary)
    setState({ hasSavedSalesSummary: true, lastMissionUpdate: "حُفظ ملخّص المبيعات في ملف المهمة" });
}
export function receiveIndividualPerformanceFile() {
  if (!state.hasReceivedIndividualPerformanceFile)
    setState({
      hasReceivedIndividualPerformanceFile: true,
      lastMissionUpdate: "استُلم ملف الأداء الفردي للمندوبين",
    });
}
export function visitHR() {
  if (!state.hasVisitedHR) setState({ hasVisitedHR: true });
}
export function inspectHRPolicy() {
  if (!state.hasInspectedHRPolicy) setState({ hasInspectedHRPolicy: true });
}
export function saveHRPolicy() {
  if (!state.hasSavedHRPolicy)
    setState({ hasSavedHRPolicy: true, lastMissionUpdate: "استُلمت سياسة الأداء من HR" });
}

// ----- Analyst / cards / tools -----
export function enterAnalysisRoom() {
  if (!state.hasEnteredAnalysisRoom) setState({ hasEnteredAnalysisRoom: true });
}
export function openPerformanceCards() {
  if (!state.hasOpenedPerformanceCards)
    setState({ hasOpenedPerformanceCards: true, lastMissionUpdate: "فُتحت طاولة التحليل" });
}
export function markSorted(branch: Branch) {
  if (branch === "corniche" && !state.hasSortedCorniche)
    setState({ hasSortedCorniche: true, lastMissionUpdate: "رُتّبت بطاقات فرع الكورنيش" });
  if (branch === "midan" && !state.hasSortedMidan)
    setState({ hasSortedMidan: true, lastMissionUpdate: "رُتّبت بطاقات فرع الميدان" });
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

export function markMeetingUnlockSeen() {
  if (!state.meetingUnlockSeen) setState({ meetingUnlockSeen: true });
}

// ----- Gating -----
export function isDecisionUnlocked(s: Level1State = state): boolean {
  return (
    s.hasSavedSalesSummary ||
    s.hasSavedHRPolicy ||
    s.hasReceivedIndividualPerformanceFile
  );
}
export function isMeetingUnlocked(s: Level1State = state): boolean {
  return s.hasPreparedDecision;
}

// ----- Decision Room -----
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
export function prepareDecision() {
  if (!state.selectedBranch || state.selectedEvidenceIds.length !== 2) return;
  setState({
    hasPreparedDecision: true,
    preparedBranch: state.selectedBranch,
    preparedEvidenceIds: [...state.selectedEvidenceIds],
    lastMissionUpdate: "حُضّرت التوصية — جاهزة للاجتماع",
    meetingUnlockSeen: false,
  });
}
export function resetDecision() {
  setState({
    hasPreparedDecision: false,
    preparedBranch: null,
    preparedEvidenceIds: [],
    selectedBranch: null,
    selectedEvidenceIds: [],
    finalOutcome: null,
    failureReason: null,
    meetingStage: "intro",
  });
}

// ----- Meeting -----
export function setMeetingStage(stage: Level1State["meetingStage"]) {
  setState({ meetingStage: stage });
}
export function submitRecommendation(outcome: Outcome, reason: FailureReason) {
  setState({ finalOutcome: outcome, failureReason: reason, meetingStage: "result", timerRunning: false });
}
export function resetMeeting() {
  setState({
    finalOutcome: null,
    failureReason: null,
    meetingStage: "intro",
  });
}

export function resetLevel() {
  setState({ ...initialState });
}
