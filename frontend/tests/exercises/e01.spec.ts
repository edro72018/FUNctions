import { describe, expect, it } from 'vitest';
import { e01Definition, e01Diagnosis } from '../../src/features/exercises/e01/definition';
import { createE01Gateway, e01Registration } from '../../src/features/exercises/e01/gateway';
import { canOpenE01Hint, e01Hints } from '../../src/features/exercises/e01/hints';
import { applyE01Outcome, withE01Hint, withE01Selection } from '../../src/features/exercises/e01/progress';
import { buildE01Request, validateE01 } from '../../src/features/exercises/e01/validateE01';
import { beginFlow } from '../../src/features/flow/flow';
import type { ProgressV1 } from '../../src/shared/storage/progress';
import { validateProgress } from '../../src/shared/storage/schema';
import type { GatewayResponse, ValidationOutcome } from '../../src/shared/validation-gateway/types';

const startedAt = '2026-11-16T20:00:00.000Z';
const later = '2026-11-16T20:05:00.000Z';
const requestId = '2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d';

function e01Progress(): ProgressV1 {
  return beginFlow(
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
    exerciseId: 'E01',
    receivedAt: later,
  };
}

describe('T035 definición de E01', () => {
  it('declara zona 1, respuesta boolean y la relación fija aprobada', () => {
    expect(e01Definition).toMatchObject({
      exerciseId: 'E01',
      zone: 1,
      zoneName: 'Máquina de Enlaces',
      title: 'El Conector de Energía',
      answerKind: 'boolean',
      requiredFields: ['selection'],
      expected: true,
      correctFeedback: 'E01_FUNCTION_CONFIRMED',
      incorrectFeedback: 'E01_SHARED_IMAGE_VALID',
    });
    expect(e01Definition.options.map(option => [option.value, option.label])).toEqual([
      [true, 'Es función'],
      [false, 'No es función'],
    ]);
    expect(e01Definition.diagram.A).toEqual([1, 2, 3]);
    expect(e01Definition.diagram.B).toEqual([4, 5]);
    expect(e01Definition.diagram.R).toEqual([[1, 4], [2, 4], [3, 5]]);
    expect(e01Definition.hints).toHaveLength(3);
  });

  it('ofrece diagnóstico localizado solo para sus códigos y no lo inventa para otros', () => {
    expect(e01Diagnosis('E01_FUNCTION_CONFIRMED')).toContain('única imagen');
    expect(e01Diagnosis('E01_SHARED_IMAGE_VALID')).toContain('mismo nodo de salida');
    expect(e01Diagnosis('OTRO_CODIGO')).toMatch(/sin diagnóstico localizado/i);
  });
});

describe('T036/T037 A-08 A-09 A-13 validador puro de E01', () => {
  it('A-13 sin selección produce incomplete y no construye solicitud', () => {
    expect(validateE01(null)).toEqual({ status: 'incomplete', fields: ['selection'] });
    expect(buildE01Request(null, requestId)).toBeNull();
    expect(e01Progress().attempts).toHaveLength(0);
  });

  it('A-08 true es correcto con E01_FUNCTION_CONFIRMED', () => {
    expect(validateE01(true)).toEqual({ status: 'correct', feedbackCode: 'E01_FUNCTION_CONFIRMED' });
  });

  it('A-09 false es incorrecto con E01_SHARED_IMAGE_VALID', () => {
    expect(validateE01(false)).toEqual({ status: 'incorrect', feedbackCode: 'E01_SHARED_IMAGE_VALID' });
  });

  it('A-08 el par compartido en la salida 4 no viola la unicidad', () => {
    const shared = e01Definition.diagram.R.filter(pair => pair[1] === 4);
    expect(shared).toEqual([[1, 4], [2, 4]]);
    expect(validateE01(true)).toMatchObject({ status: 'correct' });
  });

  it('A-08/A-09 el gateway local conserva origen, correlación y ejercicio', async () => {
    const gateway = createE01Gateway();
    const correct = await gateway.validate(buildE01Request(true, requestId)!);
    expect(correct).toMatchObject({
      requestId,
      exerciseId: 'E01',
      status: 'correct',
      feedbackCode: 'E01_FUNCTION_CONFIRMED',
      origin: 'local',
    });
    const incorrect = await gateway.validate(buildE01Request(false, requestId)!);
    expect(incorrect).toMatchObject({
      status: 'incorrect',
      feedbackCode: 'E01_SHARED_IMAGE_VALID',
      origin: 'local',
    });
    expect(e01Registration).toMatchObject({
      exerciseId: 'E01',
      allowedKinds: ['boolean'],
      mechanisms: ['local'],
    });
  });
});

describe('T039 ayudas secuenciales H1–H3', () => {
  it('habilita H1 desde el inicio, H2 tras H1 y H3 tras H2', () => {
    expect(e01Hints).toHaveLength(3);
    expect(canOpenE01Hint(0, 1)).toBe(true);
    expect(canOpenE01Hint(0, 2)).toBe(false);
    expect(canOpenE01Hint(0, 3)).toBe(false);
    expect(canOpenE01Hint(1, 2)).toBe(true);
    expect(canOpenE01Hint(1, 3)).toBe(false);
    expect(canOpenE01Hint(2, 3)).toBe(true);
  });

  it('H3 explica la definición formal y no rellena ni envía la respuesta', () => {
    expect(e01Hints[2]).toContain('∀');
    expect(e01Hints[2]).toContain('∃!');
    expect(e01Hints[2]).not.toContain('Es función');
    const progress = withE01Hint(e01Progress(), 3, later);
    expect(progress.drafts.E01).toMatchObject({ selection: null, maxHint: 3 });
    expect(progress.attempts).toHaveLength(0);
  });
});

describe('T042 integración de E01 con el progreso', () => {
  it('guarda el borrador tras una edición confirmada y conserva maxHint', () => {
    const hinted = withE01Hint(e01Progress(), 2, later);
    const edited = withE01Selection(hinted, true, later);
    expect(edited.drafts.E01).toEqual({ kind: 'boolean', selection: true, maxHint: 2 });
    expect(edited.mission.lastSavedAt).toBe(later);
    expect(edited.attempts).toHaveLength(0);
  });

  it('mantiene maxHint monótono', () => {
    const first = withE01Hint(e01Progress(), 2, later);
    expect(first.drafts.E01?.maxHint).toBe(2);
    expect(withE01Hint(first, 1, later).drafts.E01?.maxHint).toBe(2);
    expect(withE01Hint(first, 3, later).drafts.E01?.maxHint).toBe(3);
  });

  it('A-08 añade Attempt y pasa el recorrido a E08 al resolver', () => {
    const next = applyE01Outcome(
      withE01Selection(e01Progress(), true, later),
      outcome('correct', 'E01_FUNCTION_CONFIRMED'),
      later,
    );
    expect(next.attempts).toEqual([
      { exerciseId: 'E01', result: 'correct', feedbackCode: 'E01_FUNCTION_CONFIRMED', at: later },
    ]);
    expect(next.flow).toEqual({ step: 'E08' });
    expect(next.completedExerciseIds).toEqual(['E01']);
    expect(next.activeExerciseId).toBe('E08');
    expect(next.drafts.E01).toMatchObject({ selection: true });
    expect(validateProgress(next)).toBe(true);
  });

  it('A-09 añade Attempt incorrecto y conserva el paso E01 para reintentar', () => {
    const next = applyE01Outcome(
      withE01Selection(e01Progress(), false, later),
      outcome('incorrect', 'E01_SHARED_IMAGE_VALID'),
      later,
    );
    expect(next.attempts).toEqual([
      { exerciseId: 'E01', result: 'incorrect', feedbackCode: 'E01_SHARED_IMAGE_VALID', at: later },
    ]);
    expect(next.flow).toEqual({ step: 'E01' });
    expect(next.completedExerciseIds).toEqual([]);
    expect(validateProgress(next)).toBe(true);
  });

  it('indeterminate y error técnico no crean Attempt y conservan el borrador', () => {
    const draft = withE01Selection(e01Progress(), true, later);
    const undecided = applyE01Outcome(draft, outcome('indeterminate', 'UNDECIDED'), later);
    expect(undecided.attempts).toHaveLength(0);
    expect(undecided.drafts.E01).toEqual(draft.drafts.E01);
    const technical: GatewayResponse = { category: 'transport', code: 'TRANSPORT_ERROR', message: 'Sin red' };
    const failed = applyE01Outcome(draft, technical, later);
    expect(failed).toBe(draft);
    expect(failed.attempts).toHaveLength(0);
    expect(failed.drafts.E01).toMatchObject({ selection: true });
  });
});
