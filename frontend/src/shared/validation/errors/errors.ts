import type { ErrorCategory, ValidationError } from '../contracts/types';

/** Catálogo manual de error-codes.yaml y normalization.yaml. */
export const categories = {
  INVALID_REQUEST: 'format', INVALID_ANSWER: 'format', NUMBER_GRAMMAR_INVALID: 'format',
  EXPRESSION_TOKEN_INVALID: 'format', INTERVAL_INVALID: 'format',
  MISSING_ANSWER_FIELD: 'incomplete', MISSING_COMPOSITE_FIELD: 'incomplete',
  EXTRA_COMPOSITE_FIELD: 'format', EXERCISE_NOT_REGISTERED: 'unsupported',
  TYPE_NOT_ALLOWED: 'unsupported', MECHANISM_NOT_CONFIGURED: 'configuration',
  GRAMMAR_NOT_APPROVED: 'configuration', NORMALIZATION_NOT_APPROVED: 'configuration',
  TRANSPORT_ERROR: 'transport', SERVICE_UNAVAILABLE: 'service', VALIDATOR_ERROR: 'service',
} as const satisfies Record<string, ErrorCategory>;
export type ErrorCode = keyof typeof categories;
export function makeError(code: ErrorCode): ValidationError {
  return { category: categories[code], code, message: `Validación detenida: ${code}.` };
}
export class CoreError extends Error {
  readonly detail: ValidationError;
  constructor(code: ErrorCode) {
    const detail = makeError(code);
    super(detail.message);
    this.name = 'CoreError';
    this.detail = detail;
  }
}
export function fail(code: ErrorCode): never { throw new CoreError(code); }
