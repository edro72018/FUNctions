import { parseProgress, validateProgress } from './schema';
import type { PersistenceState } from './progress';
export const progressKey = 'functions.progress.v1';
export type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const unavailable = (): PersistenceState => ({ status: 'unavailable', progress: null, message: 'No se pudo guardar el progreso.' });
export function createProgressStore(getStorage: () => StoragePort = () => window.localStorage) {
  function load(): PersistenceState {
    try {
      const raw = getStorage().getItem(progressKey);
      return raw === null ? { status: 'available', progress: null } : parseProgress(raw);
    } catch { return unavailable(); }
  }
  function save(value: unknown): PersistenceState {
    const previous = load();
    if (previous.status !== 'available') return previous;
    if (!validateProgress(value)) return { status: 'corrupt', progress: null, reason: 'schema' };
    if (previous.progress?.mission.missionId === value.mission.missionId) {
      for (const id of ['E01', 'E08'] as const) {
        if ((value.drafts[id]?.maxHint ?? 0) < (previous.progress.drafts[id]?.maxHint ?? 0)) return { status: 'corrupt', progress: null, reason: 'schema' };
      }
    }
    try {
      getStorage().setItem(progressKey, JSON.stringify(value));
      return { status: 'saved', progress: value };
    } catch { return unavailable(); }
  }
  function remove(): PersistenceState {
    const previous = load();
    if (previous.status !== 'available') return previous;
    try { getStorage().removeItem(progressKey); return { status: 'available', progress: null }; } catch { return unavailable(); }
  }
  return { load, save, remove };
}
export type ProgressStore = ReturnType<typeof createProgressStore>;
