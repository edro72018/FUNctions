import { resolveExercise } from '../../flow/flow';
import type { ExerciseDraft, HintLevel, ProgressV1 } from '../../../shared/storage/progress';
import { isEvaluatedOutcome } from '../../../shared/validation-gateway/types';
import type { GatewayResponse } from '../../../shared/validation-gateway/types';

type E01Draft = Extract<ExerciseDraft, { kind: 'boolean' }>;

function currentDraft(progress: ProgressV1): E01Draft | undefined {
  return progress.drafts.E01;
}

function draftFor(selection: boolean | null, maxHint: HintLevel): E01Draft {
  return { kind: 'boolean', selection, maxHint };
}

function withDraft(progress: ProgressV1, draft: E01Draft, at: string): ProgressV1 {
  return {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    drafts: { ...progress.drafts, E01: draft },
  };
}

/** Guarda la selección confirmada sin perder la mayor ayuda consultada. */
export function withE01Selection(progress: ProgressV1, selection: boolean | null, at: string): ProgressV1 {
  const maxHint = currentDraft(progress)?.maxHint ?? 0;
  return withDraft(progress, draftFor(selection, maxHint), at);
}

/** Actualiza `maxHint` de forma monótona y conserva la selección. */
export function withE01Hint(progress: ProgressV1, hint: 1 | 2 | 3, at: string): ProgressV1 {
  const draft = currentDraft(progress);
  const maxHint = draft?.maxHint ?? 0;
  if (hint <= maxHint) return progress;
  return withDraft(progress, draftFor(draft?.selection ?? null, hint), at);
}

/**
 * Aplica un resultado del gateway. Solo `correct` e `incorrect` crean Attempt;
 * `indeterminate` y los errores técnicos conservan el borrador sin persistir
 * ni cambiar el recorrido. Un `correct` pasa el recorrido a E08.
 */
export function applyE01Outcome(progress: ProgressV1, response: GatewayResponse, at: string): ProgressV1 {
  if (!isEvaluatedOutcome(response)) return progress;
  const withAttempt: ProgressV1 = {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    attempts: [
      ...progress.attempts,
      { exerciseId: 'E01', result: response.status, feedbackCode: response.feedbackCode, at },
    ],
  };
  return response.status === 'correct' ? resolveExercise(withAttempt, 'E01', at) : withAttempt;
}
