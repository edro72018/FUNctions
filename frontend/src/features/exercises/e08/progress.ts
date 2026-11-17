import { resolveExercise } from '../../flow/flow';
import type { ExerciseDraft, HintLevel, ProgressV1 } from '../../../shared/storage/progress';
import type { ExactNumber } from '../../../shared/validation';
import { isEvaluatedOutcome } from '../../../shared/validation-gateway/types';
import type { GatewayResponse } from '../../../shared/validation-gateway/types';

type E08Draft = Extract<ExerciseDraft, { kind: 'vertex' }>;

function currentDraft(progress: ProgressV1): E08Draft | undefined {
  return progress.drafts.E08;
}

function draftFor(h: ExactNumber | null, k: ExactNumber | null, maxHint: HintLevel): E08Draft {
  return { kind: 'vertex', h, k, maxHint };
}

function withDraft(progress: ProgressV1, draft: E08Draft, at: string): ProgressV1 {
  return {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    drafts: { ...progress.drafts, E08: draft },
  };
}

/** Guarda los valores confirmados sin perder la mayor ayuda consultada. */
export function withE08Draft(
  progress: ProgressV1,
  h: ExactNumber | null,
  k: ExactNumber | null,
  at: string,
): ProgressV1 {
  const maxHint = currentDraft(progress)?.maxHint ?? 0;
  return withDraft(progress, draftFor(h, k, maxHint), at);
}

/** Actualiza `maxHint` de forma monótona y conserva `h` y `k`. */
export function withE08Hint(progress: ProgressV1, hint: 1 | 2 | 3, at: string): ProgressV1 {
  const draft = currentDraft(progress);
  const maxHint = draft?.maxHint ?? 0;
  if (hint <= maxHint) return progress;
  return withDraft(progress, draftFor(draft?.h ?? null, draft?.k ?? null, hint), at);
}

/**
 * Aplica un resultado del gateway. Solo `correct` e `incorrect` crean Attempt;
 * `indeterminate` y los errores técnicos conservan el borrador sin persistir
 * ni cambiar el recorrido. Un `correct` completa el recorrido de prueba.
 */
export function applyE08Outcome(progress: ProgressV1, response: GatewayResponse, at: string): ProgressV1 {
  if (!isEvaluatedOutcome(response)) return progress;
  const withAttempt: ProgressV1 = {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    attempts: [
      ...progress.attempts,
      { exerciseId: 'E08', result: response.status, feedbackCode: response.feedbackCode, at },
    ],
  };
  return response.status === 'correct' ? resolveExercise(withAttempt, 'E08', at) : withAttempt;
}
