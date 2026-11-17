import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import fresh from '../../../specs/002-primer-recorrido/contracts/examples/progress.fresh.valid.json';
import { bootstrapProgress } from '../../src/app/bootstrap';
import { sanitizeProgress } from '../../src/app/useProgress';
import { FeedbackPanel } from '../../src/features/exercises/FeedbackPanel';
import {
  applyE01Outcome,
  withE01Hint,
  withE01Selection,
} from '../../src/features/exercises/e01/progress';
import { buildE01Request } from '../../src/features/exercises/e01/validateE01';
import { applyE08Outcome, withE08Draft } from '../../src/features/exercises/e08/progress';
import { buildE08Request } from '../../src/features/exercises/e08/validateE08';
import { beginFlow } from '../../src/features/flow/flow';
import type { ValidatorRegistration } from '../../src/shared/validation';
import { createApiGateway } from '../../src/shared/validation-gateway/api';
import { createLocalGateway } from '../../src/shared/validation-gateway/local';
import type {
  GatewayResponse,
  ValidationGateway,
  ValidationOutcome,
} from '../../src/shared/validation-gateway/types';
import type { ProgressV1 } from '../../src/shared/storage/progress';
import { createProgressStore, progressKey, type StoragePort } from '../../src/shared/storage/store';

const atStart = '2026-11-17T10:00:00.000Z';
const atE01 = '2026-11-17T10:10:00.000Z';
const atE08 = '2026-11-17T10:20:00.000Z';
const missionId = '8f14e45f-ea8b-4b7c-9a1d-3c2b1a0f9e8d';
const freshProgress = fresh as unknown as ProgressV1;

const e01Registration: ValidatorRegistration = {
  exerciseId: 'E01',
  allowedKinds: ['boolean'],
  requiredFields: [],
  mechanisms: ['local'],
  adapterId: 'journey-e01',
  validatorId: 'E01',
  contractVersion: '0.1.0',
  associationStatus: 'ratified',
};

function memory() {
  const data = new Map<string, string>();
  const storage: StoragePort = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: key => {
      data.delete(key);
    },
  };
  return { data, storage, store: createProgressStore(() => storage) };
}

function fakeGateway(
  origin: 'local' | 'api',
  result: { status: 'correct' | 'incorrect' | 'indeterminate'; feedbackCode: string },
): ValidationGateway {
  return {
    async validate(request) {
      return {
        ...result,
        origin,
        requestId: request.requestId,
        exerciseId: request.exerciseId,
        receivedAt: atStart,
      };
    },
  };
}

function asOutcome(response: GatewayResponse): ValidationOutcome {
  if ('category' in response) throw new Error('Se esperaba un resultado y llegó un error técnico.');
  return response;
}

function journeyProgress(): ProgressV1 {
  return beginFlow({ ...freshProgress, mission: { ...freshProgress.mission, missionId } }, atStart);
}

it('T060 E01 correcto → paso E08; E08 correcto → complete; la recarga restaura sin origen', async () => {
  const { store } = memory();
  expect(store.save(journeyProgress()).status).toBe('saved');

  const e01Request = buildE01Request(true, '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d');
  if (!e01Request) throw new Error('E01 requiere solicitud.');
  const e01 = await fakeGateway('local', {
    status: 'correct',
    feedbackCode: 'E01_FUNCTION_CONFIRMED',
  }).validate(e01Request);
  const afterE01 = applyE01Outcome(journeyProgress(), e01, atE01);
  expect(afterE01).toMatchObject({
    flow: { step: 'E08' },
    completedExerciseIds: ['E01'],
    activeExerciseId: 'E08',
  });
  expect(afterE01.attempts).toHaveLength(1);
  expect(JSON.stringify(afterE01)).not.toMatch(/origin/i);
  expect(store.save(afterE01).status).toBe('saved');

  const reloaded = bootstrapProgress(store);
  expect(reloaded.screen).toBe('index');
  expect(reloaded.progress).toMatchObject({
    flow: { step: 'E08' },
    completedExerciseIds: ['E01'],
    activeExerciseId: 'E08',
  });
  expect(reloaded.progress?.attempts).toHaveLength(1);
  expect(JSON.stringify(reloaded.progress)).not.toMatch(/origin/i);

  const e08Request = buildE08Request('3', '2', '7a1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5d');
  if (!e08Request) throw new Error('E08 requiere solicitud.');
  const e08 = await fakeGateway('local', {
    status: 'correct',
    feedbackCode: 'E08_VERTEX_CONFIRMED',
  }).validate(e08Request);
  const afterE08 = applyE08Outcome(reloaded.progress!, e08, atE08);
  expect(afterE08).toMatchObject({
    flow: { step: 'complete' },
    completedExerciseIds: ['E01', 'E08'],
    activeExerciseId: null,
  });
  expect(store.save(afterE08).status).toBe('saved');

  const finished = bootstrapProgress(store);
  expect(finished.progress?.flow.step).toBe('complete');
  expect(JSON.stringify(finished.progress)).not.toMatch(/origin|15\s*\/\s*15|Zona 3 completa/i);
});

it('T056 guarda edición, ayuda y resultado evaluado; maxHint monótono y sin intentos no evaluados', async () => {
  const { store } = memory();
  const started = journeyProgress();

  const edited = withE01Selection(started, false, atE01);
  expect(store.save(edited).status).toBe('saved');
  expect(bootstrapProgress(store).progress?.drafts.E01).toEqual({
    kind: 'boolean',
    selection: false,
    maxHint: 0,
  });

  const hint3 = withE01Hint(edited, 3, atE01);
  expect(store.save(hint3).status).toBe('saved');
  const hint1 = withE01Hint(hint3, 1, atE08);
  expect(hint1).toBe(hint3);
  expect(hint1.drafts.E01).toEqual({ kind: 'boolean', selection: false, maxHint: 3 });
  expect(bootstrapProgress(store).progress?.drafts.E01?.maxHint).toBe(3);

  const indeterminate = await fakeGateway('local', {
    status: 'indeterminate',
    feedbackCode: 'UNDECIDED',
  }).validate(buildE01Request(false, '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d')!);
  expect(applyE01Outcome(hint3, indeterminate, atE08)).toBe(hint3);

  const error: GatewayResponse = {
    category: 'transport',
    code: 'TRANSPORT_ERROR',
    message: 'No se pudo conectar.',
  };
  expect(applyE01Outcome(hint3, error, atE08)).toBe(hint3);

  const incorrect = await fakeGateway('local', {
    status: 'incorrect',
    feedbackCode: 'E01_SHARED_IMAGE_VALID',
  }).validate(buildE01Request(false, '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d')!);
  const withAttempt = applyE01Outcome(hint3, incorrect, atE08);
  expect(withAttempt.attempts).toHaveLength(1);
  expect(store.save(withAttempt).status).toBe('saved');
  expect(bootstrapProgress(store).progress?.attempts).toEqual(withAttempt.attempts);
  expect(JSON.stringify(bootstrapProgress(store).progress)).not.toMatch(/origin/i);

  const dirty = {
    ...withAttempt,
    origin: 'api',
    attempts: withAttempt.attempts.map(attempt => ({ ...attempt, origin: 'api' })),
  } as unknown as ProgressV1;
  expect(sanitizeProgress(dirty)).not.toHaveProperty('origin');
  expect(JSON.stringify(sanitizeProgress(dirty))).not.toMatch(/origin/i);
});

it('T060 el resultado local se etiqueta local y el de API se etiqueta API', async () => {
  const request = buildE01Request(true, '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d')!;
  const local = await createLocalGateway([
    {
      registration: e01Registration,
      validator: () => ({ status: 'correct', feedbackCode: 'E01_FUNCTION_CONFIRMED' }),
    },
  ]).validate(request);
  expect(local).toMatchObject({ origin: 'local' });
  const localHtml = renderToStaticMarkup(
    createElement(FeedbackPanel, { outcome: asOutcome(local), error: null }),
  );
  expect(localHtml).toContain('Origen: local');
  expect(localHtml).not.toContain('Origen: API');

  const transport = vi.fn(
    async () =>
      new Response(
        JSON.stringify({ status: 'correct', feedbackCode: 'E01_FUNCTION_CONFIRMED', origin: 'api' }),
        { status: 200 },
      ),
  );
  const api = await createApiGateway('https://example.test', transport).validate({
    ...request,
    mechanism: 'api',
  });
  expect(api).toMatchObject({ origin: 'api' });
  const apiHtml = renderToStaticMarkup(
    createElement(FeedbackPanel, { outcome: asOutcome(api), error: null }),
  );
  expect(apiHtml).toContain('Origen: API');
  expect(apiHtml).not.toContain('Origen: local');
});

it('T060 un fallo de API no activa el validador local ni crea intento', async () => {
  const localValidator = vi.fn(() => ({
    status: 'correct' as const,
    feedbackCode: 'E01_FUNCTION_CONFIRMED',
  }));
  const localGateway = createLocalGateway([
    { registration: e01Registration, validator: localValidator },
  ]);
  const request = buildE01Request(true, '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d')!;
  const failure = await createApiGateway('https://example.test', async () => {
    throw new Error('offline');
  }).validate({ ...request, mechanism: 'api' });

  expect(failure).toMatchObject({ category: 'transport' });
  expect(localValidator).not.toHaveBeenCalled();
  expect(applyE01Outcome(journeyProgress(), failure, atE01)).toEqual(journeyProgress());
  expect(await localGateway.validate(request)).toMatchObject({ origin: 'local' });
  expect(localValidator).toHaveBeenCalledTimes(1);
});

it('T059 un borrador guardado de E08 se restaura y el índice sigue siendo la entrada', () => {
  const { data, store } = memory();
  const started = journeyProgress();
  const afterE01 = applyE01Outcome(
    started,
    {
      status: 'correct',
      feedbackCode: 'E01_FUNCTION_CONFIRMED',
      origin: 'local',
      requestId: '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d',
      exerciseId: 'E01',
      receivedAt: atE01,
    },
    atE01,
  );
  const withDraft = withE08Draft(afterE01, '3', null, atE08);
  data.set(progressKey, JSON.stringify(withDraft));

  const boot = bootstrapProgress(store);
  expect(boot.screen).toBe('index');
  expect(boot.progress?.flow.step).toBe('E08');
  expect(boot.progress?.drafts.E08).toEqual({ kind: 'vertex', h: '3', k: null, maxHint: 0 });
});
