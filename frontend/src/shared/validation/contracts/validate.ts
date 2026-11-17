import { answerKinds, numberPatterns, type Answer, type AnswerKind } from './answers';
import { codePattern, exercisePattern, uuidPattern, type ValidationRequest, type ValidationResult, type ValidationError } from './types';
import { fail, type ErrorCode } from '../errors/errors';

export function fullMatch(pattern: RegExp, value: unknown): value is string {
  return typeof value === 'string' && pattern.exec(value)?.[0] === value;
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && [Object.prototype, null].includes(Object.getPrototypeOf(value) as object | null);
}
function shape(value: unknown, required: readonly string[], optional: readonly string[] = [], code: ErrorCode = 'INVALID_ANSWER', missing: ErrorCode = code): asserts value is Record<string, unknown> {
  if (!isRecord(value)) fail(code);
  if (required.some((key) => !Object.hasOwn(value, key))) fail(missing);
  if (Object.keys(value).some((key) => !required.includes(key) && !optional.includes(key))) fail(code);
}
function numeric(value: unknown): void {
  if (!numberPatterns.some((pattern) => fullMatch(pattern, value))) fail('NUMBER_GRAMMAR_INVALID');
}
function array(value: unknown): asserts value is unknown[] {
  if (!Array.isArray(value)) fail('INVALID_ANSWER');
}

/** Espejo manual; Ajv se usa exclusivamente como oráculo en desarrollo. */
export function validateAnswer(value: unknown): Answer {
  if (!isRecord(value) || !answerKinds.includes(value.kind as AnswerKind)) fail('INVALID_ANSWER');
  const fields: Record<AnswerKind, string[]> = {
    number: ['value'], expression: ['tokens'], finiteSet: ['values'], intervalUnion: ['intervals'],
    mapping: ['pairs'], boolean: ['value'], vertex: ['h', 'k'], point: ['x', 'y'],
    asymptote: ['orientation', 'value'], composite: ['fields'],
  };
  shape(value, ['kind', ...fields[value.kind as AnswerKind]], [], 'INVALID_ANSWER', 'MISSING_ANSWER_FIELD');
  switch (value.kind) {
    case 'number': numeric(value.value); break;
    case 'boolean': if (typeof value.value !== 'boolean') fail('INVALID_ANSWER'); break;
    case 'vertex': numeric(value.h); numeric(value.k); break;
    case 'point': numeric(value.x); numeric(value.y); break;
    case 'asymptote':
      if (value.orientation !== 'horizontal' && value.orientation !== 'vertical') fail('INVALID_ANSWER');
      numeric(value.value); break;
    case 'expression':
      array(value.tokens);
      if (!value.tokens.length || value.tokens.some((token) => !fullMatch(/^(0|[1-9][0-9]*|x|\+|-|\(|\))$/, token))) fail('EXPRESSION_TOKEN_INVALID');
      break;
    case 'finiteSet': array(value.values); value.values.forEach(numeric); break;
    case 'mapping':
      array(value.pairs);
      for (const pair of value.pairs) {
        array(pair);
        if (pair.length !== 2) fail('INVALID_ANSWER');
        pair.forEach(numeric);
      }
      break;
    case 'intervalUnion':
      array(value.intervals);
      for (const interval of value.intervals) {
        shape(interval, ['lower', 'upper'], [], 'INTERVAL_INVALID');
        for (const [side, infinity] of [['lower', '-inf'], ['upper', '+inf']] as const) {
          const bound = interval[side];
          shape(bound, ['value', 'inclusive'], [], 'INTERVAL_INVALID');
          if (typeof bound.inclusive !== 'boolean') fail('INTERVAL_INVALID');
          if (bound.value === infinity) {
            if (bound.inclusive) fail('INTERVAL_INVALID');
          } else {
            if (bound.value === '-inf' || bound.value === '+inf') fail('INTERVAL_INVALID');
            numeric(bound.value);
          }
        }
      }
      break;
    case 'composite':
      if (!isRecord(value.fields) || !Object.keys(value.fields).length || Object.keys(value.fields).includes('')) fail('INVALID_ANSWER');
      Object.values(value.fields).forEach(validateAnswer);
      break;
  }
  return value as Answer;
}

export function validateRequest(value: unknown): ValidationRequest {
  shape(value, ['requestId', 'exerciseId', 'answer'], ['mechanism'], 'INVALID_REQUEST');
  if (!fullMatch(uuidPattern, value.requestId) || !fullMatch(exercisePattern, value.exerciseId)) fail('INVALID_REQUEST');
  if (Object.hasOwn(value, 'mechanism') && value.mechanism !== 'local' && value.mechanism !== 'api') fail('INVALID_REQUEST');
  validateAnswer(value.answer);
  return value as unknown as ValidationRequest;
}
export function validateResult(value: unknown): ValidationResult {
  shape(value, ['status', 'feedbackCode'], ['origin'], 'VALIDATOR_ERROR');
  if (!['correct', 'incorrect', 'indeterminate'].includes(value.status as string) || !fullMatch(codePattern, value.feedbackCode)) fail('VALIDATOR_ERROR');
  if (Object.hasOwn(value, 'origin') && value.origin !== 'local' && value.origin !== 'api') fail('VALIDATOR_ERROR');
  return value as unknown as ValidationResult;
}
export function validateError(value: unknown): ValidationError {
  shape(value, ['category', 'code', 'message'], [], 'VALIDATOR_ERROR');
  if (!['format', 'incomplete', 'unsupported', 'configuration', 'transport', 'service'].includes(value.category as string)
      || !fullMatch(codePattern, value.code) || typeof value.message !== 'string' || !value.message.length) fail('VALIDATOR_ERROR');
  return value as unknown as ValidationError;
}
