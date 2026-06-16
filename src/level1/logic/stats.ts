export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const min = (xs: number[]) => Math.min(...xs);
export const max = (xs: number[]) => Math.max(...xs);
export const range = (xs: number[]) => max(xs) - min(xs);
export const countBelow = (xs: number[], t: number) => xs.filter((x) => x < t).length;
export const countAboveOrEqual = (xs: number[], t: number) => xs.filter((x) => x >= t).length;
export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export function quartiles(xs: number[]): { q1: number; q3: number; iqr: number } {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  const lower = s.slice(0, mid);
  const upper = s.length % 2 === 0 ? s.slice(mid) : s.slice(mid + 1);
  const q1 = median(lower);
  const q3 = median(upper);
  return { q1, q3, iqr: q3 - q1 };
}
export function standardDeviation(xs: number[]): number {
  const avg = mean(xs);
  const variance = xs.reduce((sum, x) => sum + (x - avg) ** 2, 0) / xs.length;
  return Math.sqrt(variance);
}
export const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
