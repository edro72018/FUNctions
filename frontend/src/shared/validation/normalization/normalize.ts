import type { Answer, Interval } from '../contracts/answers';
import { validateAnswer } from '../contracts/validate';
import { fail } from '../errors/errors';
import { canonicalNumber, compareNumbers } from './rational';

function compareBounds(a: string, b: string): number {
  if (a === b) return 0;
  if (a === '-inf' || b === '+inf') return -1;
  if (a === '+inf' || b === '-inf') return 1;
  return compareNumbers(a, b);
}
function normalizeIntervals(intervals: Interval[]): Interval[] {
  const sorted: Interval[] = [];
  for (const interval of intervals) {
    const lower = { ...interval.lower, value: interval.lower.value === '-inf' ? '-inf' : canonicalNumber(interval.lower.value) };
    const upper = { ...interval.upper, value: interval.upper.value === '+inf' ? '+inf' : canonicalNumber(interval.upper.value) };
    const order = compareBounds(lower.value, upper.value);
    if (order > 0) fail('INTERVAL_INVALID');
    // Extremos iguales abiertos representan el vacío, no un punto.
    if (order === 0 && !(lower.inclusive && upper.inclusive)) continue;
    sorted.push({ lower, upper });
  }
  sorted.sort((a, b) => compareBounds(a.lower.value, b.lower.value)
    || Number(b.lower.inclusive) - Number(a.lower.inclusive)
    || compareBounds(a.upper.value, b.upper.value));
  const merged: Interval[] = [];
  for (const next of sorted) {
    const current = merged.at(-1);
    const contact = current ? compareBounds(next.lower.value, current.upper.value) : 1;
    if (!current || contact > 0 || (contact === 0 && !current.upper.inclusive && !next.lower.inclusive)) {
      merged.push(next); continue;
    }
    const end = compareBounds(next.upper.value, current.upper.value);
    if (end > 0) current.upper = next.upper;
    else if (end === 0) current.upper.inclusive ||= next.upper.inclusive;
  }
  return merged;
}
function normalizeTyped(answer: Answer): Answer {
  switch (answer.kind) {
    case 'number': return { kind: answer.kind, value: canonicalNumber(answer.value) };
    case 'boolean': return { ...answer };
    case 'expression': return fail('GRAMMAR_NOT_APPROVED');
    case 'finiteSet': return { kind: answer.kind, values: [...new Set(answer.values.map(canonicalNumber))].sort(compareNumbers) };
    case 'intervalUnion': return { kind: answer.kind, intervals: normalizeIntervals(answer.intervals) };
    case 'mapping': {
      const pairs = answer.pairs.map(([a, b]): [string, string] => [canonicalNumber(a), canonicalNumber(b)]);
      const unique = new Map(pairs.map((pair) => [JSON.stringify(pair), pair]));
      return { kind: answer.kind, pairs: [...unique.values()].sort((a, b) => compareNumbers(a[0], b[0]) || compareNumbers(a[1], b[1])) };
    }
    case 'vertex': return { kind: answer.kind, h: canonicalNumber(answer.h), k: canonicalNumber(answer.k) };
    case 'point': return { kind: answer.kind, x: canonicalNumber(answer.x), y: canonicalNumber(answer.y) };
    case 'asymptote': return { ...answer, value: canonicalNumber(answer.value) };
    case 'composite': return { kind: answer.kind, fields: Object.fromEntries(Object.keys(answer.fields).sort().map((key) => [key, normalizeTyped(answer.fields[key]!)])) };
  }
}
export function normalize(input: unknown): Answer { return normalizeTyped(validateAnswer(input)); }
