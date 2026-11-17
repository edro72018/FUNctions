import { describe, expect, it, vi } from 'vitest';
import fixtures from '../../../tests/contract/validation/fixtures/errors.json';
import contracts from '../../../tests/contract/validation/fixtures/contracts.json';
import { answerKinds, type AnswerKind } from '../../src/shared/validation/contracts/answers';
import { CoreError, makeError, categories } from '../../src/shared/validation/errors/errors';
import { createApiAdapter, createLocalAdapter } from '../../src/shared/validation/dispatch/adapters';
import { dispatch } from '../../src/shared/validation/dispatch/dispatcher';
import { ValidatorRegistry } from '../../src/shared/validation/dispatch/registry';
import type { Mechanism } from '../../src/shared/validation/contracts/types';
import { registration, schemas } from './helpers';

describe('US3 / REQ-02,05,08,12 / AC-04,05,11,12: errores separados', () => {
  it.each(fixtures.cases)('$code %# bloquea antes del adaptador', async (scenario) => {
    const registry = new ValidatorRegistry();
    registry.register(registration({
      allowedKinds: (scenario.allowedKinds ?? answerKinds) as AnswerKind[],
      requiredFields: scenario.requiredFields ?? [],
      mechanisms: (scenario.mechanisms ?? ['local', 'api']) as Mechanism[],
    }));
    const local = vi.fn(() => contracts.results[0]); const api = vi.fn(() => contracts.results[0]);
    const output = await dispatch({ ...contracts.request, ...scenario.patch }, registry, { test: { local, api } });
    expect(output).toMatchObject({ category: scenario.category, code: scenario.code });
    expect(schemas.error(output)).toBe(true);
    expect(output).not.toHaveProperty('status');
    expect(local).not.toHaveBeenCalled(); expect(api).not.toHaveBeenCalled();
  });
  it('conserva campos y tipos de un compuesto completo', async () => {
    const registry = new ValidatorRegistry(); registry.register(registration({ allowedKinds: ['composite'], requiredFields: ['a', 'b'] }));
    const local = vi.fn(() => contracts.results[0]);
    const answer = { kind: 'composite', fields: { a: { kind: 'boolean', value: true }, b: { kind: 'vertex', h: '3', k: '2' } } };
    expect(await dispatch({ ...contracts.request, answer }, registry, { test: { local } })).toMatchObject({ status: 'correct' });
    expect(local).toHaveBeenCalledWith({ ...contracts.request, answer }, registry.get('E01'));
  });
  it('clasifica indisponibilidad, excepciones y respuestas inválidas', async () => {
    const registry = new ValidatorRegistry(); registry.register(registration());
    for (const [adapter, expected] of [
      [createLocalAdapter({}), 'SERVICE_UNAVAILABLE'],
      [createLocalAdapter({ 'test-only': () => { throw new Error('traza secreta'); } }), 'VALIDATOR_ERROR'],
      [createApiAdapter(async () => { throw new Error('red secreta'); }), 'TRANSPORT_ERROR'],
      [createApiAdapter(() => { throw new CoreError('SERVICE_UNAVAILABLE'); }), 'SERVICE_UNAVAILABLE'],
      [createApiAdapter(() => makeError('SERVICE_UNAVAILABLE')), 'SERVICE_UNAVAILABLE'],
      [createLocalAdapter({ 'test-only': () => ({ status: 'incomplete' }) }), 'VALIDATOR_ERROR'],
    ] as const) {
      const output = await dispatch(contracts.request, registry, { test: { local: adapter } });
      expect(output).toMatchObject({ code: expected });
      expect(schemas.error(output)).toBe(true);
      expect(JSON.stringify(output)).not.toMatch(/secreta|stack/);
    }
    expect(await dispatch(contracts.request, registry, {})).toMatchObject({ code: 'SERVICE_UNAVAILABLE' });
    expect(await dispatch({ ...contracts.request, mechanism: 'api' }, registry, {})).toMatchObject({ code: 'TRANSPORT_ERROR' });
  });
  it('todos los constructores cumplen el esquema de error', () => {
    for (const code of Object.keys(categories) as (keyof typeof categories)[]) expect(schemas.error(makeError(code))).toBe(true);
  });
});
