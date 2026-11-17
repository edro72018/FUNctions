import { expect, it } from 'vitest';
import fresh from '../../../specs/002-primer-recorrido/contracts/examples/progress.fresh.valid.json';
import e01 from '../../../specs/002-primer-recorrido/contracts/examples/progress.e01-complete.valid.json';
import complete from '../../../specs/002-primer-recorrido/contracts/examples/progress.complete.valid.json';
import { createProgressStore, progressKey, type StoragePort } from '../../src/shared/storage/store';
import { recoverProgress } from '../../src/shared/storage/recovery';
import { parseProgress } from '../../src/shared/storage/schema';
function memory() {
  const data = new Map<string, string>();
  const storage: StoragePort = { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); }, removeItem: key => { data.delete(key); } };
  return { data, storage, store: createProgressStore(() => storage) };
}
it('A-01…03 carga, guarda y elimina los tres estados canónicos', () => {
  const { store } = memory();
  expect(store.load()).toMatchObject({ status: 'available', progress: null });
  for (const fixture of [fresh, e01, complete]) {
    const parsed = parseProgress(JSON.stringify(fixture));
    if (parsed.status !== 'available') throw Error('fixture inválido');
    expect(store.save(parsed.progress).status).toBe('saved');
    expect(store.load().progress).toEqual(fixture);
  }
  expect(store.remove().status).toBe('available');
  expect(store.load().progress).toBeNull();
});
it('A-04 distingue JSON, esquema y versión, sin sobrescribir ni borrar', () => {
  for (const [raw, reason] of [['{', 'json'], ['{}', 'schema'], ['{"schemaVersion":2}', 'version']] as const) {
    const { data, store } = memory(); data.set(progressKey, raw);
    expect(store.load().reason).toBe(reason);
    expect(store.save(fresh).status).not.toBe('saved');
    expect(store.remove().status).not.toBe('available');
    expect(data.get(progressKey)).toBe(raw);
  }
});
it('A-05 exige confirmación y respaldo previo; no reemplaza si falla respaldo', () => {
  const { storage, data } = memory(); data.set(progressKey, '{');
  expect(recoverProgress(storage, fresh, false, 123).status).toBe('corrupt');
  expect(data.size).toBe(1);
  expect(recoverProgress(storage, fresh, true, 123).status).toBe('saved');
  expect(data.get(`${progressKey}.backup.123`)).toBe('{');
  data.set(progressKey, 'bad');
  const failing = { ...storage, setItem: () => { throw Error('quota'); } };
  expect(recoverProgress(failing, fresh, true, 124).status).toBe('unavailable');
  expect(data.get(progressKey)).toBe('bad');
});
it('A-06 informa fallo de setItem/acceso, sin éxito ficticio', () => {
  const { storage } = memory();
  storage.setItem = () => { throw Error('quota'); };
  expect(createProgressStore(() => storage).save(fresh)).toMatchObject({ status: 'unavailable', message: 'No se pudo guardar el progreso.' });
  expect(createProgressStore(() => { throw Error('denied'); }).load().status).toBe('unavailable');
});
it('rechaza origen, números JSON y disminución de maxHint en la misma misión', () => {
  const { store } = memory();
  expect(store.save({ ...fresh, origin: 'api' }).status).toBe('corrupt');
  expect(store.save({ ...fresh, drafts: { E08: { kind: 'vertex', h: 3, k: '2', maxHint: 0 } } }).status).toBe('corrupt');
  expect(store.save({ ...fresh, drafts: { E01: { kind: 'boolean', selection: null, maxHint: 3 } } }).status).toBe('saved');
  expect(store.save(fresh).status).toBe('corrupt');
});
