import { describe, expect, it } from 'vitest';
import {
  canOpenE08Hint,
  e08Definition,
  e08Diagnosis,
  e08Hints,
  raiseE08Hint,
} from '../../src/features/exercises/e08/definition';
import { createE08Gateway, e08Registration } from '../../src/features/exercises/e08/gateway';
import { normalizeNumberInput } from '../../src/features/exercises/e08/numberInput';
import { applyE08Outcome, withE08Draft, withE08Hint } from '../../src/features/exercises/e08/progress';
import { buildE08Request, e08Validator, validateE08 } from '../../src/features/exercises/e08/validateE08';
import { beginFlow, resolveExercise } from '../../src/features/flow/flow';
import type { ProgressV1 } from '../../src/shared/storage/progress';
import { validateProgress } from '../../src/shared/storage/schema';
import type { GatewayResponse, ValidationOutcome } from '../../src/shared/validation-gateway/types';

const startedAt = '2026-11-16T20:00:00.000Z';
const later = '2026-11-16T20:05:00.000Z';
const requestId = '7a1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5d';

function e08Progress(): ProgressV1 {
  const begun = beginFlow(
    {
      schemaVersion: 1,
      mission: {
        missionId: '8f14e45f-ea8b-4b7c-9a1d-3c2b1a0f9e8d',
        startedAt,
        lastSavedAt: startedAt,
      },
      flow: { step: 'intro' },
      completedExerciseIds: [],
      activeExerciseId: null,
      drafts: {},
      attempts: [],
      preferences: {},
    },
    startedAt,
  );
  return resolveExercise(begun, 'E01', startedAt);
}

function outcome(
  status: ValidationOutcome['status'],
  feedbackCode: string,
): ValidationOutcome {
  return {
    status,
    feedbackCode,
    origin: 'local',
    requestId,
    exerciseId: 'E08',
    receivedAt: later,
  };
}

describe('T047 definición de E08', () => {
  it('declara zona 3, respuesta vertex, a = 1 fijo y el vértice objetivo', () => {
    expect(e08Definition).toMatchObject({
      exerciseId: 'E08',
      zone: 3,
      zoneName: 'Sintonizador de Trayectorias',
      title: 'Foco del Vértice',
      answerKind: 'vertex',
      requiredFields: ['h', 'k'],
      expected: { h: '3', k: '2' },
      fixed: { a: 1 },
      correctFeedback: 'E08_VERTEX_CONFIRMED',
      signFeedback: 'E08_VERTEX_SIGN',
      mismatchFeedback: 'E08_VERTEX_MISMATCH',
    });
    expect(e08Definition.targetPoint).toEqual({ x: 3, y: 2 });
    expect(e08Definition.expected).not.toHaveProperty('a');
    expect(e08Definition.fixed.a).toBe(1);
    expect(e08Hints).toHaveLength(3);
  });

  it('ofrece diagnóstico localizado solo para sus códigos y no lo inventa para otros', () => {
    expect(e08Diagnosis('E08_VERTEX_CONFIRMED')).toContain('vértice');
    expect(e08Diagnosis('E08_VERTEX_SIGN')).toContain('signo');
    expect(e08Diagnosis('E08_VERTEX_MISMATCH')).toContain('coinciden');
    expect(e08Diagnosis('OTRO_CODIGO')).toMatch(/sin diagnóstico localizado/i);
  });

  it('habilita las ayudas de forma secuencial sin rellenar la respuesta en H3', () => {
    expect(canOpenE08Hint(0, 1)).toBe(true);
    expect(canOpenE08Hint(0, 2)).toBe(false);
    expect(canOpenE08Hint(0, 3)).toBe(false);
    expect(canOpenE08Hint(1, 2)).toBe(true);
    expect(canOpenE08Hint(1, 3)).toBe(false);
    expect(canOpenE08Hint(2, 3)).toBe(true);
    expect(raiseE08Hint(2, 1)).toBe(2);
    expect(raiseE08Hint(2, 3)).toBe(3);
    expect(e08Hints[2]).not.toMatch(/h\s*=\s*3/);
    expect(e08Hints[2]).not.toMatch(/k\s*=\s*2/);
  });
});

describe('T048/T049 A-20 formatos numéricos exactos', () => {
  it.each([
    ['3', '3'],
    ['3,0', '3'],
    ['3.0', '3'],
    ['2,99', '2.99'],
    ['2.99', '2.99'],
    ['-2,50', '-2.5'],
    [' 3 ', '3'],
  ])('normaliza %s a %s', (raw, expected) => {
    expect(normalizeNumberInput(raw)).toBe(expected);
  });

  it.each(['', '   ', '+3', '3e0', '03', '3.', '.5', '1 000', '3/1', '1,2,3'])(
    'rechaza %s para que el campo quede incompleto',
    raw => {
      expect(normalizeNumberInput(raw)).toBeNull();
    },
  );
});

describe('T050 A-10 A-11 A-12 A-13 validador puro de E08', () => {
  it('A-10 solo h = 3 y k = 2 son correctos con E08_VERTEX_CONFIRMED', () => {
    expect(validateE08('3', '2')).toEqual({
      status: 'correct',
      feedbackCode: 'E08_VERTEX_CONFIRMED',
    });
    expect(validateE08('3.0', '2.0')).toMatchObject({ status: 'correct' });
  });

  it('A-11 h = -3 produce incorrecto con E08_VERTEX_SIGN sin redondear', () => {
    expect(validateE08('-3', '2')).toEqual({
      status: 'incorrect',
      feedbackCode: 'E08_VERTEX_SIGN',
    });
    expect(validateE08('-3.0', '2')).toMatchObject({ feedbackCode: 'E08_VERTEX_SIGN' });
  });

  it('A-12 h = 2.99 u otro par distinto produce E08_VERTEX_MISMATCH', () => {
    expect(validateE08('2.99', '2')).toEqual({
      status: 'incorrect',
      feedbackCode: 'E08_VERTEX_MISMATCH',
    });
    expect(validateE08('4', '2')).toMatchObject({ feedbackCode: 'E08_VERTEX_MISMATCH' });
    expect(validateE08('3', '3')).toMatchObject({ feedbackCode: 'E08_VERTEX_MISMATCH' });
  });

  it('A-13 h o k nulos producen incomplete y no construyen solicitud', () => {
    expect(validateE08(null, '2')).toEqual({ status: 'incomplete', fields: ['h'] });
    expect(validateE08('3', null)).toEqual({ status: 'incomplete', fields: ['k'] });
    expect(validateE08(null, null)).toEqual({ status: 'incomplete', fields: ['h', 'k'] });
    expect(buildE08Request(null, '2', requestId)).toBeNull();
    expect(buildE08Request('3', null, requestId)).toBeNull();
    expect(e08Progress().attempts).toHaveLength(0);
  });

  it('construye una respuesta vertex sin a y el gateway conserva origen y correlación', async () => {
    const request = buildE08Request('3', '2', requestId);
    expect(request).toEqual({
      requestId,
      exerciseId: 'E08',
      answer: { kind: 'vertex', h: '3', k: '2' },
      mechanism: 'local',
    });
    expect(request?.answer).not.toHaveProperty('a');

    const gateway = createE08Gateway();
    const correct = await gateway.validate(request!);
    expect(correct).toMatchObject({
      requestId,
      exerciseId: 'E08',
      status: 'correct',
      feedbackCode: 'E08_VERTEX_CONFIRMED',
      origin: 'local',
    });

    const decimal = await gateway.validate(buildE08Request('2.99', '2', requestId)!);
    expect(decimal).toMatchObject({
      status: 'incorrect',
      feedbackCode: 'E08_VERTEX_MISMATCH',
      origin: 'local',
    });

    const sign = await gateway.validate(buildE08Request('-3', '2', requestId)!);
    expect(sign).toMatchObject({ status: 'incorrect', feedbackCode: 'E08_VERTEX_SIGN' });

    expect(e08Registration).toMatchObject({
      exerciseId: 'E08',
      allowedKinds: ['vertex'],
      requiredFields: ['h', 'k'],
      mechanisms: ['local'],
    });
    expect(e08Validator).toBeTypeOf('function');
  });
});

describe('T054 integración de E08 con el progreso', () => {
  it('guarda el borrador confirmado y conserva maxHint', () => {
    const hinted = withE08Hint(e08Progress(), 2, later);
    const edited = withE08Draft(hinted, '3', '2.99', later);
    expect(edited.drafts.E08).toEqual({ kind: 'vertex', h: '3', k: '2.99', maxHint: 2 });
    expect(edited.mission.lastSavedAt).toBe(later);
    expect(edited.attempts).toHaveLength(0);
    expect(validateProgress(edited)).toBe(true);
  });

  it('mantiene maxHint monótono sin perder h ni k', () => {
    const first = withE08Draft(withE08Hint(e08Progress(), 2, later), '3', '2', later);
    expect(first.drafts.E08?.maxHint).toBe(2);
    expect(withE08Hint(first, 1, later).drafts.E08?.maxHint).toBe(2);
    const third = withE08Hint(first, 3, later);
    expect(third.drafts.E08).toEqual({ kind: 'vertex', h: '3', k: '2', maxHint: 3 });
  });

  it('A-10 añade Attempt y pasa el recorrido a complete al resolver', () => {
    const draft = withE08Draft(e08Progress(), '3', '2', later);
    const next = applyE08Outcome(draft, outcome('correct', 'E08_VERTEX_CONFIRMED'), later);
    expect(next.attempts).toEqual([
      { exerciseId: 'E08', result: 'correct', feedbackCode: 'E08_VERTEX_CONFIRMED', at: later },
    ]);
    expect(next.flow).toEqual({ step: 'complete' });
    expect(next.completedExerciseIds).toEqual(['E01', 'E08']);
    expect(next.activeExerciseId).toBeNull();
    expect(next.drafts.E08).toEqual(draft.drafts.E08);
    expect(validateProgress(next)).toBe(true);
  });

  it('A-11/A-12 añade Attempt incorrecto y conserva el paso E08 para reintentar', () => {
    const draft = withE08Draft(e08Progress(), '2.99', '2', later);
    const next = applyE08Outcome(draft, outcome('incorrect', 'E08_VERTEX_MISMATCH'), later);
    expect(next.attempts).toEqual([
      { exerciseId: 'E08', result: 'incorrect', feedbackCode: 'E08_VERTEX_MISMATCH', at: later },
    ]);
    expect(next.flow).toEqual({ step: 'E08' });
    expect(next.completedExerciseIds).toEqual(['E01']);
    expect(next.activeExerciseId).toBe('E08');
    expect(validateProgress(next)).toBe(true);
  });

  it('indeterminate y error técnico no crean Attempt y conservan el borrador', () => {
    const draft = withE08Draft(e08Progress(), '3', '2', later);
    const undecided = applyE08Outcome(draft, outcome('indeterminate', 'UNDECIDED'), later);
    expect(undecided.attempts).toHaveLength(0);
    expect(undecided.drafts.E08).toEqual(draft.drafts.E08);
    const technical: GatewayResponse = { category: 'transport', code: 'TRANSPORT_ERROR', message: 'Sin red' };
    const failed = applyE08Outcome(draft, technical, later);
    expect(failed).toBe(draft);
    expect(failed.attempts).toHaveLength(0);
    expect(failed.drafts.E08).toEqual({ kind: 'vertex', h: '3', k: '2', maxHint: 0 });
  });
});
