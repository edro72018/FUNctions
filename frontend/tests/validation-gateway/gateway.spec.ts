import { expect, it, vi } from 'vitest';
import { createLocalGateway } from '../../src/shared/validation-gateway/local';
import { createApiGateway } from '../../src/shared/validation-gateway/api';
import { acceptCurrentResponse, isEvaluatedOutcome } from '../../src/shared/validation-gateway/types';
import type { ValidationRequest, ValidatorRegistration } from '../../src/shared/validation';
const request: ValidationRequest = { requestId: '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d', exerciseId: 'E01', answer: { kind: 'boolean', value: true }, mechanism: 'local' };
const registration: ValidatorRegistration = { exerciseId: 'E01', allowedKinds: ['boolean'], requiredFields: [], mechanisms: ['local'], adapterId: 'test', validatorId: 'test', contractVersion: '1', associationStatus: 'ratified' };
it('A-14/17 usa dispatcher, conserva correlación y no cuenta indeterminate', async () => {
  const gateway = createLocalGateway([{ registration, validator: () => ({ status: 'indeterminate', feedbackCode: 'UNDECIDED' }) }]);
  const result = await gateway.validate(request);
  expect(result).toMatchObject({ requestId: request.requestId, exerciseId: request.exerciseId, status: 'indeterminate', origin: 'local' });
  expect(isEvaluatedOutcome(result)).toBe(false);
});
it('rechaza origen local falsificado antes de que dispatcher lo sobrescriba', async () => {
  const gateway = createLocalGateway([{ registration, validator: () => ({ status: 'correct', feedbackCode: 'OK', origin: 'api' }) }]);
  expect(await gateway.validate(request)).toMatchObject({ category: 'service' });
});
it('A-15/18 errores no mutan entrada ni invocan local; sin URL no transporta', async () => {
  const transport = vi.fn(async (_url: string, _init: RequestInit) => { throw Error('offline'); });
  const before = structuredClone(request);
  expect(await createApiGateway(undefined, transport).validate(request)).toMatchObject({ category: 'configuration' });
  expect(transport).not.toHaveBeenCalled();
  const apiRequest = { ...request, mechanism: 'api' as const };
  expect(await createApiGateway('https://example.test', transport).validate(apiRequest)).toMatchObject({ category: 'transport' });
  expect(transport).toHaveBeenCalledTimes(1);
  expect(JSON.parse(String(transport.mock.calls[0]?.[1]?.body))).toEqual(apiRequest);
  expect(request).toEqual(before);
});
it('A-15 aplica tiempo límite sin reintentos ni fallback', async () => {
  const transport = vi.fn(() => new Promise<Response>(() => {}));
  const started = Date.now();
  expect(await createApiGateway('https://example.test', transport, 10).validate({ ...request, mechanism: 'api' })).toMatchObject({ category: 'transport' });
  expect(Date.now() - started).toBeLessThan(1_000);
  expect(transport).toHaveBeenCalledTimes(1);
});
it('A-14 incomplete es estado del cliente, nunca resultado evaluado', () => {
  expect(isEvaluatedOutcome({ category: 'incomplete', code: 'MISSING', message: 'Falta un campo' })).toBe(false);
});
it('T021 permite compartir adaptador y enruta por ejercicio', async () => {
  const e08Registration: ValidatorRegistration = { ...registration, exerciseId: 'E08', allowedKinds: ['vertex'] };
  const e08Request: ValidationRequest = { ...request, exerciseId: 'E08', answer: { kind: 'vertex', h: '3', k: '2' } };
  const gateway = createLocalGateway([
    { registration, validator: () => ({ status: 'correct', feedbackCode: 'E01_OK' }) },
    { registration: e08Registration, validator: () => ({ status: 'incorrect', feedbackCode: 'E08_NO' }) },
  ]);
  expect(await gateway.validate(e08Request)).toMatchObject({ exerciseId: 'E08', feedbackCode: 'E08_NO', origin: 'local' });
});
it('A-16 descarta correlación/generación obsoleta sin mantener máquina de interacción', async () => {
  const result = await createLocalGateway([{ registration, validator: () => ({ status: 'correct', feedbackCode: 'OK' }) }]).validate(request);
  const current = { requestId: request.requestId, exerciseId: 'E01', generation: 2 };
  expect(acceptCurrentResponse(result, { ...current, generation: 1 }, current)).toBeNull();
  expect(acceptCurrentResponse(result, current, { ...current, requestId: 'new' })).toBeNull();
  expect(acceptCurrentResponse(result, current, current)).toEqual(result);
});
it('A-17 API POST, origen y errores de contrato/HTTP', async () => {
  for (const [body, status, expected] of [
    [{ status: 'correct', feedbackCode: 'OK', origin: 'api' }, 200, { origin: 'api' }],
    [{ status: 'correct', feedbackCode: 'OK', origin: 'local' }, 200, { category: 'service' }],
    [{ status: 'correct', feedbackCode: 'OK' }, 503, { category: 'service' }],
    [{ status: 'incomplete' }, 200, { category: 'service' }],
    [{ category: 'service', code: 'DOWN', message: 'No disponible' }, 200, { category: 'service' }],
  ] as const) {
    const transport = vi.fn(async (_url: string, _init: RequestInit) => new Response(JSON.stringify(body), { status }));
    const result = await createApiGateway('https://example.test', transport).validate({ ...request, mechanism: 'api' });
    expect(result).toMatchObject(expected);
    expect(transport.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' });
  }
});
