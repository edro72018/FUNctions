import { describe, expect, it, vi } from 'vitest';
import fixtures from '../../../tests/contract/validation/fixtures/contracts.json';
import { ValidatorRegistry } from '../../src/shared/validation/dispatch/registry';
import { dispatch } from '../../src/shared/validation/dispatch/dispatcher';
import { registration, schemas } from './helpers';
import type { ValidationRequest } from '../../src/shared/validation/contracts/types';

describe('US1 / REQ-02–05,09,11 / AC-02–05,09,10', () => {
  it.each(fixtures.results)('devuelve $status y conserva correlación', async (result) => {
    const registry = new ValidatorRegistry();
    const entry = registration();
    registry.register(entry);
    const local = vi.fn(() => ({ status: result.status, feedbackCode: result.feedbackCode }));
    const output = await dispatch(fixtures.request, registry, { test: { local } });
    expect(output).toEqual({ status: result.status, feedbackCode: result.feedbackCode, origin: 'local' });
    expect(schemas.result(output)).toBe(true);
    expect(local).toHaveBeenCalledWith(fixtures.request, entry);
    await dispatch(fixtures.request, registry, { test: { local } });
    expect(local).toHaveBeenCalledTimes(2); // Correlación no es deduplicación.
  });
  it('rechaza antes del adaptador y nunca infiere registros', async () => {
    const registry = new ValidatorRegistry();
    const local = vi.fn();
    for (let id = 1; id <= 15; id++) expect(registry.get(`E${String(id).padStart(2, '0')}`)).toBeUndefined();
    expect(await dispatch(fixtures.request, registry, { test: { local } })).toMatchObject({ category: 'unsupported', code: 'EXERCISE_NOT_REGISTERED' });
    registry.register(registration());
    for (const answer of fixtures.invalidAnswers) {
      expect(schemas.error(await dispatch({ ...fixtures.request, answer }, registry, { test: { local } }))).toBe(true);
    }
    expect(await dispatch({ ...fixtures.request, answer: { kind: 'number', value: '1' } }, registry, { test: { local } })).toMatchObject({ code: 'TYPE_NOT_ALLOWED' });
    expect(local).not.toHaveBeenCalled();
  });
  it('normaliza antes de entregar una copia al validador', async () => {
    const registry = new ValidatorRegistry();
    registry.register(registration({ allowedKinds: ['number'] }));
    const local = vi.fn((_request: ValidationRequest) => fixtures.results[0]);
    await dispatch({ ...fixtures.request, answer: { kind: 'number', value: '6/4' } }, registry, { test: { local } });
    expect(local.mock.calls[0]?.[0].answer).toEqual({ kind: 'number', value: '3/2' });
  });
});
