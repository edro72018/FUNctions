import { useCallback, useState } from 'react';
import type { PersistenceState, ProgressV1 } from '../shared/storage/progress';
import { bootstrapProgress } from './bootstrap';
import { canonicalProgress } from '../shared/storage/canonical';
import { recoverProgress } from '../shared/storage/recovery';
import {
  createProgressStore,
  type ProgressStore,
  type StoragePort,
} from '../shared/storage/store';

const browserStore = createProgressStore();

/** Forma persistible: sin origen de validación ni campos de sesión. */
export const sanitizeProgress = canonicalProgress;

/**
 * Persistencia del recorrido. Carga una vez al arrancar con `bootstrap.ts`,
 * guarda tras cada cambio confirmado y permite la recuperación con respaldo.
 * El origen de validación nunca se persiste.
 */
export function useProgress(
  store: ProgressStore = browserStore,
  getStorage: () => StoragePort = () => window.localStorage,
  timestamp: () => number = Date.now,
) {
  const [boot] = useState(() => bootstrapProgress(store));
  const [persistence, setPersistence] = useState(boot.persistence);
  const [progress, setProgress] = useState(boot.progress);

  const save = useCallback(
    (next: ProgressV1) => {
      const safe = sanitizeProgress(next);
      const result = store.save(safe);
      if (result.status === 'saved' || result.status === 'unavailable') setProgress(safe);
      setPersistence(result);
      return result;
    },
    [store],
  );

  const load = useCallback(() => {
    const result = store.load();
    setPersistence(result);
    setProgress(
      result.status === 'available' && result.progress !== null
        ? sanitizeProgress(result.progress)
        : result.progress,
    );
    return result;
  }, [store]);

  const remove = useCallback(() => {
    const result = store.remove();
    setPersistence(result);
    if (result.status === 'available') setProgress(null);
    return result;
  }, [store]);

  /** Inicia una misión nueva solo con confirmación y respaldo previo. */
  const recover = useCallback(
    (next: ProgressV1, confirmed: boolean): PersistenceState => {
      const safe = sanitizeProgress(next);
      const result = recoverProgress(getStorage(), safe, confirmed, timestamp());
      if (result.status === 'saved') setProgress(result.progress);
      setPersistence(result);
      return result;
    },
    [getStorage, timestamp],
  );

  return {
    progress,
    persistence,
    initialScreen: boot.screen,
    needsRecovery: boot.needsRecovery,
    save,
    load,
    remove,
    recover,
  };
}
