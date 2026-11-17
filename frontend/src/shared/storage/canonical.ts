import type { Attempt, ProgressV1 } from './progress';

function clampHint(value: number): 0 | 1 | 2 | 3 {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return (integer <= 0 ? 0 : integer >= 3 ? 3 : integer) as 0 | 1 | 2 | 3;
}

function canonicalAttempts(attempts: readonly Attempt[]): Attempt[] {
  return attempts
    .filter(attempt => attempt.result === 'correct' || attempt.result === 'incorrect')
    .map(attempt => ({
      exerciseId: attempt.exerciseId,
      result: attempt.result,
      feedbackCode: attempt.feedbackCode,
      at: attempt.at,
    }));
}

/**
 * Forma persistible canónica. Copia solo los campos del esquema v1, de modo que
 * el origen de validación u otros datos de sesión nunca lleguen al almacenamiento.
 * No inventa progreso: conserva paso, resueltos, borradores e intentos.
 */
export function canonicalProgress(progress: ProgressV1): ProgressV1 {
  const drafts: ProgressV1['drafts'] = {};
  const e01 = progress.drafts.E01;
  if (e01) {
    drafts.E01 = { kind: 'boolean', selection: e01.selection, maxHint: clampHint(e01.maxHint) };
  }
  const e08 = progress.drafts.E08;
  if (e08) {
    drafts.E08 = {
      kind: 'vertex',
      h: e08.h,
      k: e08.k,
      maxHint: clampHint(e08.maxHint),
    };
  }

  return {
    schemaVersion: 1,
    mission: {
      missionId: progress.mission.missionId,
      startedAt: progress.mission.startedAt,
      lastSavedAt: progress.mission.lastSavedAt,
    },
    flow: { step: progress.flow.step },
    completedExerciseIds: [...progress.completedExerciseIds] as ProgressV1['completedExerciseIds'],
    activeExerciseId: progress.activeExerciseId,
    drafts,
    attempts: canonicalAttempts(progress.attempts),
    preferences: {},
  };
}
