import { describe, expect, it, vi } from 'vitest';
import fixtures from '../../../tests/contract/validation/fixtures/parity.json';
import contracts from '../../../tests/contract/validation/fixtures/contracts.json';
import type { AnswerKind, ValidationRequest } from '../../src/shared/validation/contracts/types';
import { dispatch } from '../../src/shared/validation/dispatch/dispatcher';
import { ValidatorRegistry } from '../../src/shared/validation/dispatch/registry';
import { createApiAdapter, createLocalAdapter } from '../../src/shared/validation/dispatch/adapters';
import { registration } from './helpers';

describe('US2 / REQ-05–08 / AC-04–06: paridad y ausencia de fallback', () => {
  it.each(fixtures.cases)('misma semántica $answer.kind', async ({ answer, normalized, result }) => {
    const registry = new ValidatorRegistry();
    registry.register(registration({ allowedKinds: [answer.kind as AnswerKind] }));
    const seen: ValidationRequest[] = [];
    const validator = (request: ValidationRequest): unknown => { seen.push(request); return result; };
    const adapters = { test: {
      local: createLocalAdapter({ 'test-only': validator }),
      api: createApiAdapter((request) => validator(JSON.parse(JSON.stringify(request)) as ValidationRequest)),
    } };
    for (const mechanism of ['local', 'api'] as const) {
      const output = await dispatch({ ...contracts.request, answer, mechanism }, registry, adapters);
      expect(output).toEqual({ ...result, origin: mechanism });
      expect(seen.at(-1)?.answer).toEqual(normalized);
      expect(seen.at(-1)?.requestId).toBe(contracts.request.requestId);
    }
  });
  it('respeta configuración y precedencia de solicitud, sin deduplicación', async () => {
    const registry = new ValidatorRegistry(); registry.register(registration());
    const local = vi.fn(() => contracts.results[0]); const api = vi.fn(() => contracts.results[1]);
    const { mechanism: _mechanism, ...request } = contracts.request;
    expect(await dispatch(request, registry, { test: { local, api } }, { mechanism: 'api' })).toMatchObject({ origin: 'api' });
    expect(await dispatch(contracts.request, registry, { test: { local, api } }, { mechanism: 'api' })).toMatchObject({ origin: 'local' });
    expect(local).toHaveBeenCalledTimes(1); expect(api).toHaveBeenCalledTimes(1);
    expect(await dispatch(request, registry, { test: { local, api } })).toMatchObject({ code: 'MECHANISM_NOT_CONFIGURED' });
  });
  it('rechaza fallo API sin llamar local; permite nueva solicitud explícita', async () => {
    const registry = new ValidatorRegistry(); registry.register(registration());
    const local = vi.fn(() => contracts.results[0]);
    const api = createApiAdapter(() => { throw new Error('red privada'); });
    const adapters = { test: { local, api } };
    expect(await dispatch({ ...contracts.request, mechanism: 'api' }, registry, adapters)).toMatchObject({ category: 'transport', code: 'TRANSPORT_ERROR' });
    expect(local).not.toHaveBeenCalled();
    expect(await dispatch(contracts.request, registry, adapters)).toMatchObject({ origin: 'local' });
  });
});
