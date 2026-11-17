import type { ExactNumber } from '../validation';
export type ExerciseId = 'E01' | 'E08';
export type FlowStep = 'intro' | 'E01' | 'E08' | 'complete';
export type HintLevel = 0 | 1 | 2 | 3;
export interface Mission { missionId: string; startedAt: string; lastSavedAt: string }
export type ExerciseDraft = { kind: 'boolean'; selection: boolean | null; maxHint: HintLevel } | { kind: 'vertex'; h: ExactNumber | null; k: ExactNumber | null; maxHint: HintLevel };
export interface Attempt { exerciseId: ExerciseId; result: 'correct' | 'incorrect'; feedbackCode: string; at: string }
export interface ProgressV1 {
  schemaVersion: 1;
  mission: Mission;
  flow: { step: FlowStep };
  completedExerciseIds: [] | ['E01'] | ['E01', 'E08'];
  activeExerciseId: ExerciseId | null;
  drafts: { E01?: Extract<ExerciseDraft, { kind: 'boolean' }>; E08?: Extract<ExerciseDraft, { kind: 'vertex' }> };
  attempts: Attempt[];
  preferences: Record<string, never>;
}
export type PersistenceStatus = 'available' | 'saved' | 'unavailable' | 'corrupt' | 'unknown-version';
export interface PersistenceState { status: PersistenceStatus; progress: ProgressV1 | null; reason?: 'json' | 'schema' | 'version'; message?: string }
