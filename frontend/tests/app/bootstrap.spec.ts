import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import complete from '../../../specs/002-primer-recorrido/contracts/examples/progress.complete.valid.json';
import e01 from '../../../specs/002-primer-recorrido/contracts/examples/progress.e01-complete.valid.json';
import fresh from '../../../specs/002-primer-recorrido/contracts/examples/progress.fresh.valid.json';
import { AppShell } from '../../src/app/AppShell';
import { bootstrapProgress, restoreProgress } from '../../src/app/bootstrap';
import type { ProgressV1 } from '../../src/shared/storage/progress';
import { createProgressStore, progressKey, type StoragePort } from '../../src/shared/storage/store';

function memory() {
  const data = new Map<string, string>();
  const storage: StoragePort = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: key => {
      data.delete(key);
    },
  };
  return { data, storage, store: createProgressStore(() => storage) };
}

const fixtures = [fresh, e01, complete] as const;

it('T055 arranca en el índice y restaura paso, resueltos y borradores', () => {
  for (const fixture of fixtures) {
    const { data, store } = memory();
    data.set(progressKey, JSON.stringify(fixture));
    const boot = bootstrapProgress(store);
    expect(boot.screen).toBe('index');
    expect(boot.needsRecovery).toBe(false);
    expect(boot.persistence.status).toBe('available');
    expect(boot.progress).toEqual(fixture);
    expect(boot.progress?.flow.step).toBe(fixture.flow.step);
    expect(boot.progress?.completedExerciseIds).toEqual(fixture.completedExerciseIds);
    expect(boot.progress?.drafts).toEqual(fixture.drafts);
  }
});

it('T055 deriva a progress-recovery ante JSON, esquema o versión ilegibles', () => {
  for (const [raw, reason] of [
    ['{', 'json'],
    ['{}', 'schema'],
    ['{"schemaVersion":2}', 'version'],
  ] as const) {
    const { data, store } = memory();
    data.set(progressKey, raw);
    const boot = bootstrapProgress(store);
    expect(boot.screen).toBe('progress-recovery');
    expect(boot.needsRecovery).toBe(true);
    expect(boot.progress).toBeNull();
    expect(boot.persistence.reason).toBe(reason);
    expect(data.get(progressKey)).toBe(raw);
  }
});

it('T055 no restaura el origen aunque el contenido de prueba lo incluya', () => {
  const dirty = {
    ...e01,
    origin: 'api',
    drafts: {
      E01: { ...e01.drafts.E01, origin: 'api' },
      E08: { ...e01.drafts.E08, origin: 'api' },
    },
    attempts: e01.attempts.map(attempt => ({ ...attempt, origin: 'api' })),
  } as unknown as ProgressV1;
  const restored = restoreProgress(dirty);
  expect(restored).not.toBeNull();
  expect(restored).not.toHaveProperty('origin');
  expect(JSON.stringify(restored)).not.toMatch(/origin/i);
  expect(restored?.flow.step).toBe('E08');
  expect(restored?.completedExerciseIds).toEqual(['E01']);
});

it('T055 sin contenido deja el índice disponible y sin progreso', () => {
  const boot = bootstrapProgress(memory().store);
  expect(boot.screen).toBe('index');
  expect(boot.needsRecovery).toBe(false);
  expect(boot.progress).toBeNull();
  expect(boot.persistence.status).toBe('available');
});

it('T055/T059 AppShell reanuda desde el índice y deriva a recuperación sin Continuar', () => {
  const readable = memory();
  readable.data.set(progressKey, JSON.stringify(e01));
  vi.stubGlobal('window', { localStorage: readable.storage });
  try {
    const html = renderToStaticMarkup(createElement(AppShell));
    expect(html).toContain('FUNctions');
    expect(html).toContain('>Continuar<');
    expect(html).not.toContain('Progreso no disponible');
  } finally {
    vi.unstubAllGlobals();
  }

  const unreadable = memory();
  unreadable.data.set(progressKey, '{');
  vi.stubGlobal('window', { localStorage: unreadable.storage });
  try {
    const html = renderToStaticMarkup(createElement(AppShell));
    expect(html).toContain('Progreso no disponible');
    expect(html).toContain('Iniciar misión nueva');
    expect(html).toContain('Volver al índice');
    expect(html).not.toContain('>Continuar<');
  } finally {
    vi.unstubAllGlobals();
  }
});
