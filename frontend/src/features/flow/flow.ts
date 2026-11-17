import type { AppScreen } from '../../app/navigation';
import type { ExerciseId, FlowStep, ProgressV1 } from '../../shared/storage/progress';

function isResolved(progress: ProgressV1, exerciseId: ExerciseId): boolean {
  return (progress.completedExerciseIds as readonly ExerciseId[]).includes(exerciseId);
}

/** Secuencia explícita del corte. `complete` no significa 15/15 ni Zona 3 completa. */
export const flowSequence = ['intro', 'E01', 'E08', 'complete'] as const satisfies readonly FlowStep[];

export const exerciseSequence = ['E01', 'E08'] as const satisfies readonly ExerciseId[];

export type ExerciseAvailability = 'available' | 'resolved' | 'locked';

export interface FlowExerciseView {
  readonly exerciseId: ExerciseId;
  readonly title: string;
  readonly zone: 1 | 3;
  readonly status: ExerciseAvailability;
  readonly statusLabel: string;
  readonly detail: string;
  readonly canOpen: boolean;
}

export interface FlowView {
  readonly step: FlowStep;
  readonly exercises: readonly FlowExerciseView[];
  readonly isComplete: boolean;
  readonly summary: string;
}

/** Progreso inicial de una misión nueva, antes de mostrar la introducción. */
export function createMissionProgress(missionId: string, startedAt: string): ProgressV1 {
  return {
    schemaVersion: 1,
    mission: { missionId, startedAt, lastSavedAt: startedAt },
    flow: { step: 'intro' },
    completedExerciseIds: [],
    activeExerciseId: null,
    drafts: {},
    attempts: [],
    preferences: {},
  };
}

/** Avanza desde la introducción al recorrido de prueba con E01 disponible. */
export function beginFlow(progress: ProgressV1, at: string): ProgressV1 {
  if (progress.flow.step !== 'intro') return progress;
  return {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    flow: { step: 'E01' },
    completedExerciseIds: [],
    activeExerciseId: 'E01',
  };
}

/**
 * Marca un ejercicio como resuelto y avanza el recorrido. E01 solo puede
 * resolverse en el paso E01; E08 exige E01 resuelto. No añade intentos: esos
 * pertenecen a la integración de cada ejercicio.
 */
export function resolveExercise(progress: ProgressV1, exerciseId: ExerciseId, at: string): ProgressV1 {
  if (exerciseId === 'E01') {
    if (progress.flow.step !== 'E01' || isResolved(progress, 'E01')) return progress;
    return {
      ...progress,
      mission: { ...progress.mission, lastSavedAt: at },
      flow: { step: 'E08' },
      completedExerciseIds: ['E01'],
      activeExerciseId: 'E08',
    };
  }
  if (progress.flow.step !== 'E08' || !isResolved(progress, 'E01') || isResolved(progress, 'E08')) {
    return progress;
  }
  return {
    ...progress,
    mission: { ...progress.mission, lastSavedAt: at },
    flow: { step: 'complete' },
    completedExerciseIds: ['E01', 'E08'],
    activeExerciseId: null,
  };
}

/** E01 está disponible al entrar al recorrido; E08 solo con E01 resuelto. */
export function canOpenExercise(progress: ProgressV1, exerciseId: ExerciseId): boolean {
  if (exerciseId === 'E01') return isResolved(progress, 'E01') || progress.flow.step === 'E01';
  return isResolved(progress, 'E08') || (isResolved(progress, 'E01') && progress.flow.step === 'E08');
}

function exerciseView(exerciseId: ExerciseId, progress: ProgressV1): FlowExerciseView {
  const title = exerciseId === 'E01' ? 'El Conector de Energía' : 'Foco del Vértice';
  const zone: 1 | 3 = exerciseId === 'E01' ? 1 : 3;
  if (isResolved(progress, exerciseId)) {
    return {
      exerciseId,
      title,
      zone,
      status: 'resolved',
      statusLabel: 'Resuelto',
      detail: exerciseId === 'E01' ? 'Puedes abrirlo para repasar.' : 'Avance parcial del recorrido de prueba completado.',
      canOpen: true,
    };
  }
  if (exerciseId === 'E08' && !isResolved(progress, 'E01')) {
    return {
      exerciseId,
      title,
      zone,
      status: 'locked',
      statusLabel: 'Se desbloquea al resolver E01',
      detail: 'Completa E01 para habilitar este ejercicio.',
      canOpen: false,
    };
  }
  if (progress.flow.step === exerciseId) {
    return {
      exerciseId,
      title,
      zone,
      status: 'available',
      statusLabel: 'Disponible',
      detail: exerciseId === 'E08' ? 'Avance parcial del recorrido de prueba.' : 'Primer ejercicio del recorrido de prueba.',
      canOpen: true,
    };
  }
  return {
    exerciseId,
    title,
    zone,
    status: 'locked',
    statusLabel: exerciseId === 'E01' ? 'Disponible al entrar al recorrido' : 'Se desbloquea al resolver E01',
    detail: 'El recorrido todavía no ha llegado a este ejercicio.',
    canOpen: false,
  };
}

function summaryFor(step: FlowStep): string {
  switch (step) {
    case 'intro':
      return 'El recorrido de prueba comienza después de la introducción.';
    case 'E01':
      return 'Avance real del recorrido de prueba: E01 está disponible y E08 se desbloquea al resolver E01.';
    case 'E08':
      return 'Avance real del recorrido de prueba: E01 resuelto y E08 disponible como avance parcial.';
    case 'complete':
      return 'Recorrido de prueba completado. Resolviste E01 y E08.';
  }
}

export function describeFlow(progress: ProgressV1): FlowView {
  return {
    step: progress.flow.step,
    exercises: exerciseSequence.map(exerciseId => exerciseView(exerciseId, progress)),
    isComplete: progress.flow.step === 'complete',
    summary: summaryFor(progress.flow.step),
  };
}

/** Continuar restaura el último punto guardado sin crear ni borrar la misión. */
export function resumeScreen(progress: ProgressV1): AppScreen {
  return progress.flow.step === 'intro' ? 'intro' : 'flow';
}
