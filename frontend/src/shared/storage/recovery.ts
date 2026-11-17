import type { PersistenceState } from './progress';
import { createProgressStore, progressKey, unavailable, type StoragePort } from './store';
import { validateProgress } from './schema';
/** No borra el original; si falla el respaldo, jamás intenta reemplazarlo. */
export function recoverProgress(storage: StoragePort, next: unknown, confirmed: boolean, timestamp: number): PersistenceState {
  const previous = createProgressStore(() => storage).load();
  if (!confirmed || !['corrupt', 'unknown-version'].includes(previous.status)) return previous;
  if (!validateProgress(next)) return { status: 'corrupt', progress: null, reason: 'schema' };
  try {
    const raw = storage.getItem(progressKey);
    if (raw === null) return previous;
    const backup = `${progressKey}.backup.${timestamp}`;
    // Evita perder otro respaldo si se reutiliza el mismo timestamp.
    if (storage.getItem(backup) !== null) return unavailable();
    storage.setItem(backup, raw);
    storage.setItem(progressKey, JSON.stringify(next));
    return { status: 'saved', progress: next };
  } catch { return unavailable(); }
}
