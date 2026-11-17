/** Espejo manual de answer.schema.json (REQ-01, REQ-12). */
export type ExactNumber = string;
export interface Bound { value: ExactNumber; inclusive: boolean }
export interface Interval { lower: Bound; upper: Bound }
export type Answer =
  | { kind: 'number'; value: ExactNumber }
  | { kind: 'expression'; tokens: string[] }
  | { kind: 'finiteSet'; values: ExactNumber[] }
  | { kind: 'intervalUnion'; intervals: Interval[] }
  | { kind: 'mapping'; pairs: [ExactNumber, ExactNumber][] }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'vertex'; h: ExactNumber; k: ExactNumber }
  | { kind: 'point'; x: ExactNumber; y: ExactNumber }
  | { kind: 'asymptote'; orientation: 'horizontal' | 'vertical'; value: ExactNumber }
  | { kind: 'composite'; fields: Record<string, Answer> };
export type AnswerKind = Answer['kind'];
export const answerKinds: readonly AnswerKind[] = [
  'number', 'expression', 'finiteSet', 'intervalUnion', 'mapping',
  'boolean', 'vertex', 'point', 'asymptote', 'composite',
];
export const numberPatterns = [
  /^-?(0|[1-9][0-9]*)$/,
  /^-?(0|[1-9][0-9]*)\.[0-9]+$/,
  /^-?(0|[1-9][0-9]*)\/[1-9][0-9]*$/,
] as const;
