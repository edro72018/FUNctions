import { canonicalNumber, makeError, makeResult } from '../../../shared/validation';
import type {
  ExactNumber,
  ValidationRequest,
  ValidationResult,
  Validator,
} from '../../../shared/validation';
import type { ClientIncomplete } from '../../../shared/validation-gateway/types';

export type E08Validation = ValidationResult | ClientIncomplete;

/**
 * Regla pura de E08. Sin `h` o `k` el estado es `incomplete` del cliente y no
 * se envía. La comparación es exacta y sin tolerancia: solo (3, 2) es correcto;
 * `h = -3` usa el diagnóstico de signo y el resto, el de vértice.
 */
export function validateE08(h: ExactNumber | null, k: ExactNumber | null): E08Validation {
  if (h === null || k === null) {
    const fields: string[] = [];
    if (h === null) fields.push('h');
    if (k === null) fields.push('k');
    return { status: 'incomplete', fields };
  }

  const canonicalH = canonicalNumber(h);
  const canonicalK = canonicalNumber(k);
  if (canonicalH === '3' && canonicalK === '2') {
    return makeResult('correct', 'E08_VERTEX_CONFIRMED');
  }
  if (canonicalH === '-3') return makeResult('incorrect', 'E08_VERTEX_SIGN');
  return makeResult('incorrect', 'E08_VERTEX_MISMATCH');
}

/** La UI no llama al gateway si falta un campo obligatorio. */
export function buildE08Request(
  h: ExactNumber | null,
  k: ExactNumber | null,
  requestId: string,
): ValidationRequest | null {
  if (h === null || k === null) return null;
  return {
    requestId,
    exerciseId: 'E08',
    answer: { kind: 'vertex', h, k },
    mechanism: 'local',
  };
}

/** Adaptador puro para el registro local de 001; `a = 1` no se serializa. */
export const e08Validator: Validator = request => {
  if (request.answer.kind !== 'vertex') return makeError('TYPE_NOT_ALLOWED');
  const result = validateE08(request.answer.h, request.answer.k);
  return result.status === 'incomplete' ? makeError('MISSING_ANSWER_FIELD') : result;
};
