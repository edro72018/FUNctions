import type { Adapter, Validator } from './interfaces';
import { CoreError, fail } from '../errors/errors';

/** El consumidor aporta todos los validadores; no se registra ninguno por defecto. */
export function createLocalAdapter(validators: Readonly<Record<string, Validator>>): Adapter {
  return async (request, registration) => {
    const validator = Object.hasOwn(validators, registration.validatorId) ? validators[registration.validatorId] : undefined;
    if (!validator) fail('SERVICE_UNAVAILABLE');
    try { return await validator(request); }
    catch (error: unknown) {
      if (error instanceof CoreError) throw error;
      return fail('VALIDATOR_ERROR');
    }
  };
}
/** Transporte inyectado: el núcleo no hace HTTP ni reintenta. */
export function createApiAdapter(send: Validator): Adapter {
  return async (request) => {
    try { return await send(request); }
    catch (error: unknown) {
      if (error instanceof CoreError) throw error;
      return fail('TRANSPORT_ERROR');
    }
  };
}
