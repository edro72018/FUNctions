import type { AppScreen } from './navigation';
import type { PersistenceState, ProgressV1 } from '../shared/storage/progress';
import { canonicalProgress } from '../shared/storage/canonical';
import type { ProgressStore } from '../shared/storage/store';

export interface BootstrapState {
  readonly persistence: PersistenceState;
  readonly progress: ProgressV1 | null;
  readonly screen: AppScreen;
  readonly needsRecovery: boolean;
}

/**
 * Arranque del corte: carga `functions.progress.v1` una sola vez y recompone el
 * paso, los resueltos y los borradores. El origen de validación es estado de
 * sesión y no se restaura. Un contenido ilegible no se sobrescribe: la pantalla
 * inicial pasa a `progress-recovery`.
 */
export function restoreProgress(progress: ProgressV1 | null): ProgressV1 | null {
  return progress === null ? null : canonicalProgress(progress);
}

export function bootstrapProgress(
  store: Pick<ProgressStore, 'load'>,
): BootstrapState {
  const persistence = store.load();
  const needsRecovery =
    persistence.status === 'corrupt' || persistence.status === 'unknown-version';
  return {
    persistence,
    progress: persistence.status === 'available' ? restoreProgress(persistence.progress) : null,
    screen: needsRecovery ? 'progress-recovery' : 'index',
    needsRecovery,
  };
}
