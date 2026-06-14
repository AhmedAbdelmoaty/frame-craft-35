export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const min = (xs: number[]) => Math.min(...xs);
export const max = (xs: number[]) => Math.max(...xs);
export const range = (xs: number[]) => max(xs) - min(xs);
export const countBelow = (xs: number[], t: number) => xs.filter((x) => x < t).length;
export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
