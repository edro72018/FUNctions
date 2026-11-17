import { makeError, makeResult } from '../../../shared/validation';
import type { ValidationResult, ValidationRequest, Validator } from '../../../shared/validation';
import type { ClientIncomplete } from '../../../shared/validation-gateway/types';

export type E01Selection = boolean | null;
export type E01Validation = ValidationResult | ClientIncomplete;

/**
 * Regla pura de E01. Sin selección el estado es `incomplete` del cliente y no
 * se envía; `true` confirma la función y `false` explica la salida compartida.
 */
export function validateE01(selection: E01Selection): E01Validation {
  if (selection === null) return { status: 'incomplete', fields: ['selection'] };
  return selection
    ? makeResult('correct', 'E01_FUNCTION_CONFIRMED')
    : makeResult('incorrect', 'E01_SHARED_IMAGE_VALID');
}

/** La UI no llama al gateway si la selección está vacía. */
export function buildE01Request(selection: E01Selection, requestId: string): ValidationRequest | null {
  if (selection === null) return null;
  return {
    requestId,
    exerciseId: 'E01',
    answer: { kind: 'boolean', value: selection },
    mechanism: 'local',
  };
}

/** Adaptador puro para el registro local de 001. */
export const e01Validator: Validator = request => {
  if (request.answer.kind !== 'boolean') return makeError('TYPE_NOT_ALLOWED');
  const result = validateE01(request.answer.value);
  return result.status === 'incomplete' ? makeError('MISSING_ANSWER_FIELD') : result;
};
