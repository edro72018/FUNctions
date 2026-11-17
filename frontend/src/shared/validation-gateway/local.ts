import { dispatch, ValidatorRegistry, validateResult, validateError } from '../validation';
import type { Adapters, Validator, ValidatorRegistration } from '../validation';
import { decodeResponse, technicalError, type ValidationGateway } from './types';
/** Registra validadores puros por ejercicio; el despachador de 001 sigue siendo la única evaluación local. */
export function createLocalGateway(entries: readonly { registration: ValidatorRegistration; validator: Validator }[]): ValidationGateway {
  const registry = new ValidatorRegistry();
  const byAdapter = new Map<string, Map<string, Validator>>();
  for (const { registration, validator } of entries) {
    registry.register(registration);
    if (!registration.mechanisms.includes('local')) throw new TypeError('El registro no admite el mecanismo local.');
    const validators = byAdapter.get(registration.adapterId) ?? new Map<string, Validator>();
    if (validators.has(registration.exerciseId)) throw new TypeError('Validador local duplicado.');
    validators.set(registration.exerciseId, validator);
    byAdapter.set(registration.adapterId, validators);
  }
  const adapters: Record<string, Adapters[string]> = {};
  for (const [adapterId, validators] of byAdapter) adapters[adapterId] = { local: async (request, entry) => {
    const validator = validators.get(entry.exerciseId);
    if (!validator) throw new TypeError('Validador local no registrado.');
    const raw = await validator(request);
    if (raw !== null && typeof raw === 'object' && 'category' in raw) return validateError(raw);
    const result = validateResult(raw);
    // 001 añade el origen después del adaptador: comprobarlo aquí evita una atribución falsa.
    return result.origin === 'api' ? technicalError('service', 'El validador local declaró un origen API.') : result;
  } };
  return { async validate(request) {
    if (request.mechanism !== undefined && request.mechanism !== 'local') return technicalError('configuration', 'El mecanismo no coincide con el gateway local.');
    return decodeResponse(await dispatch({ ...request, mechanism: 'local' }, registry, adapters), request, 'local');
  } };
}
