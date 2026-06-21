import { BRANCHES, PERFORMANCE_THRESHOLD, type BranchId, type Rep } from "../data/branches";
import {
  countAboveOrEqual,
  fmt,
  max,
  mean,
  median,
  min,
  quartiles,
  range,
  standardDeviation,
} from "./stats";

export type ViewMode = BranchId;

export interface BranchAnalysis {
  id: BranchId;
  label: string;
  branchName: string;
  color: string;
  softColor: string;
  domain: [number, number];
  binSize: number;
  values: number[];
  reps: Rep[];
  metrics: {
    mean: number;
    median: number;
    range: number;
    sd: number;
    q1: number;
    q3: number;
    iqr: number;
    thresholdCount: number;
    thresholdPercent: number;
    min: number;
    max: number;
  };
}

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
  reps: Rep[];
}

export const SHARED_DOMAIN: [number, number] = [0, 150];
export const SHARED_BIN_SIZE = 5;

export const TEAM_STYLE: Record<BranchId, Pick<BranchAnalysis, "label" | "color" | "softColor">> = {
  corniche: {
    label: "الفريق أ",
    color: "#3f96ff",
    softColor: "rgba(63, 150, 255, 0.18)",
  },
  midan: {
    label: "الفريق ب",
    color: "#ff5f70",
    softColor: "rgba(255, 95, 112, 0.18)",
  },
};

export function getBranchAnalysis(id: BranchId): BranchAnalysis {
  const branch = BRANCHES[id];
  const values = branch.reps.map((rep) => rep.performance);
  const qs = quartiles(values);
  const thresholdCount = countAboveOrEqual(values, PERFORMANCE_THRESHOLD);
  const style = TEAM_STYLE[id];

  return {
    id,
    label: style.label,
    branchName: branch.name,
    color: style.color,
    softColor: style.softColor,
    domain: SHARED_DOMAIN,
    binSize: SHARED_BIN_SIZE,
    values,
    reps: [...branch.reps].sort((a, b) => a.performance - b.performance),
    metrics: {
      mean: mean(values),
      median: median(values),
      range: range(values),
      sd: standardDeviation(values),
      q1: qs.q1,
      q3: qs.q3,
      iqr: qs.iqr,
      thresholdCount,
      thresholdPercent: Math.round((thresholdCount / values.length) * 100),
      min: min(values),
      max: max(values),
    },
  };
}

export function getHistogramBins(analysis: BranchAnalysis): HistogramBin[] {
  const [domainMin, domainMax] = analysis.domain;
  const bins: HistogramBin[] = [];
  for (let start = domainMin; start < domainMax; start += analysis.binSize) {
    bins.push({ start, end: start + analysis.binSize, count: 0, reps: [] });
  }

  analysis.reps.forEach((rep) => {
    const rawIndex = Math.floor((rep.performance - domainMin) / analysis.binSize);
    const index = Math.max(0, Math.min(bins.length - 1, rawIndex));
    bins[index].count += 1;
    bins[index].reps.push(rep);
  });

  return bins;
}

export function formatMetric(value: number, suffix = "") {
  return `${fmt(value)}${suffix}`;
}
