import type { ValidationError, ValidationResult, ValidationRequest } from '../contracts/types';
import { isRecord, validateError, validateRequest, validateResult } from '../contracts/validate';
import { normalize } from '../normalization/normalize';
import { CoreError, fail, makeError } from '../errors/errors';
import type { Adapters, Registry, DispatchOptions } from './interfaces';

export async function dispatch(input: unknown, registry: Registry, adapters: Adapters, options: DispatchOptions = {}): Promise<ValidationResult | ValidationError> {
  try {
    const request = validateRequest(input);
    const normalized: ValidationRequest = { ...request, answer: normalize(request.answer) };
    const entry = registry.get(request.exerciseId);
    if (!entry) fail('EXERCISE_NOT_REGISTERED');
    if (!entry.allowedKinds.includes(normalized.answer.kind)) fail('TYPE_NOT_ALLOWED');
    if (normalized.answer.kind === 'composite') {
      const fields = normalized.answer.fields;
      if (entry.requiredFields.some((key) => !Object.hasOwn(fields, key))) fail('MISSING_COMPOSITE_FIELD');
      if (Object.keys(fields).some((key) => !entry.requiredFields.includes(key))) fail('EXTRA_COMPOSITE_FIELD');
    }
    const mechanism = request.mechanism ?? options.mechanism;
    if (!mechanism || !entry.mechanisms.includes(mechanism)) fail('MECHANISM_NOT_CONFIGURED');
    const adapter = adapters[entry.adapterId]?.[mechanism];
    if (!adapter) fail(mechanism === 'api' ? 'TRANSPORT_ERROR' : 'SERVICE_UNAVAILABLE');
    const response = await adapter(normalized, entry);
    if (isRecord(response) && Object.hasOwn(response, 'category')) return { ...validateError(response) };
    const result = validateResult(response);
    return { ...result, origin: mechanism };
  } catch (error: unknown) {
    return error instanceof CoreError ? error.detail : makeError('VALIDATOR_ERROR');
  }
}
