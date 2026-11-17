import { Button } from '../../shared/ui/Button';
import type { ExerciseId, ProgressV1 } from '../../shared/storage/progress';
import { describeFlow } from './flow';

export interface FlowScreenProps {
  progress: ProgressV1;
  onOpenExercise: (exerciseId: ExerciseId) => void;
  onBackToIndex: () => void;
}

/** Recorrido de prueba: avance real de E01/E08, sin mapa de zonas ni victoria 15/15. */
export function FlowScreen({ progress, onOpenExercise, onBackToIndex }: FlowScreenProps) {
  const view = describeFlow(progress);
  return (
    <main id="app" aria-labelledby="flow-title">
      <h1 id="flow-title">Recorrido de prueba</h1>
      <p>{view.summary}</p>
      <ol>
        {view.exercises.map(exercise => (
          <li key={exercise.exerciseId}>
            <h2>{exercise.title}</h2>
            <p>Zona {exercise.zone}</p>
            <p><strong>{exercise.statusLabel}</strong> — {exercise.detail}</p>
            <Button disabled={!exercise.canOpen} onClick={() => onOpenExercise(exercise.exerciseId)}>
              Abrir {exercise.exerciseId}
            </Button>
          </li>
        ))}
      </ol>
      {view.isComplete ? <p>Puedes volver al índice.</p> : null}
      <Button onClick={onBackToIndex}>Volver al índice</Button>
    </main>
  );
}
