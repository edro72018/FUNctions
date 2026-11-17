import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import fresh from '../../../specs/002-primer-recorrido/contracts/examples/progress.fresh.valid.json';
import { FlowScreen } from '../../src/features/flow/FlowScreen';
import { beginFlow, canOpenExercise, createMissionProgress, describeFlow, resolveExercise, resumeScreen } from '../../src/features/flow/flow';
import type { ProgressV1 } from '../../src/shared/storage/progress';
import { validateProgress } from '../../src/shared/storage/schema';

const freshProgress = fresh as unknown as ProgressV1;
const atStart = '2026-11-17T10:00:00.000Z';
const atE01 = '2026-11-17T10:10:00.000Z';
const atE08 = '2026-11-17T10:20:00.000Z';

describe('T029 secuencia intro → E01 → E08 → complete', () => {
  it('crea una misión nueva en intro sin progreso inventado', () => {
    const mission = createMissionProgress('8f14e45f-ea8b-4b7c-9a1d-3c2b1a0f9e8d', atStart);
    expect(mission).toMatchObject({
      schemaVersion: 1,
      flow: { step: 'intro' },
      completedExerciseIds: [],
      activeExerciseId: null,
      drafts: {},
      attempts: [],
      preferences: {},
    });
    expect(validateProgress(mission)).toBe(true);
  });

  it('no permite saltar la introducción ni repetir un paso ya resuelto', () => {
    const mission = createMissionProgress('8f14e45f-ea8b-4b7c-9a1d-3c2b1a0f9e8d', atStart);
    expect(resolveExercise(mission, 'E01', atE01)).toBe(mission);
    const e01 = resolveExercise(beginFlow(mission, atStart), 'E01', atE01);
    expect(resolveExercise(e01, 'E01', atE08)).toBe(e01);
    expect(resolveExercise(e01, 'E08', atE08).flow.step).toBe('complete');
  });
});

describe('T030 A-02 E01 resuelto', () => {
  it('pasa al paso E08 con E01 resuelto y E08 activo', () => {
    const started = beginFlow(freshProgress, atStart);
    expect(started).toMatchObject({ flow: { step: 'E01' }, completedExerciseIds: [], activeExerciseId: 'E01' });
    expect(validateProgress(started)).toBe(true);

    const e01 = resolveExercise(started, 'E01', atE01);
    expect(e01).toMatchObject({ flow: { step: 'E08' }, completedExerciseIds: ['E01'], activeExerciseId: 'E08' });
    expect(e01.mission.lastSavedAt).toBe(atE01);
    expect(e01.drafts).toEqual(freshProgress.drafts);
    expect(validateProgress(e01)).toBe(true);
  });

  it('retoma el último punto guardado sin crear ni borrar la misión', () => {
    expect(resumeScreen(freshProgress)).toBe('intro');
    expect(resumeScreen(beginFlow(freshProgress, atStart))).toBe('flow');
    expect(resumeScreen(resolveExercise(beginFlow(freshProgress, atStart), 'E01', atE01))).toBe('flow');
  });
});

describe('T030 A-07 desbloqueo E01 → E08', () => {
  it('bloquea E08 antes de resolver E01 con el mensaje explícito', () => {
    const started = beginFlow(freshProgress, atStart);
    expect(canOpenExercise(started, 'E01')).toBe(true);
    expect(canOpenExercise(started, 'E08')).toBe(false);
    expect(describeFlow(started).exercises.find(exercise => exercise.exerciseId === 'E08')).toMatchObject({
      status: 'locked',
      canOpen: false,
      statusLabel: 'Se desbloquea al resolver E01',
    });
    expect(resolveExercise(started, 'E08', atE01)).toBe(started);
  });

  it('abre E08 después de resolver E01 y lo rotula como avance parcial', () => {
    const e01 = resolveExercise(beginFlow(freshProgress, atStart), 'E01', atE01);
    const e08 = describeFlow(e01).exercises.find(exercise => exercise.exerciseId === 'E08');
    expect(canOpenExercise(e01, 'E08')).toBe(true);
    expect(e08).toMatchObject({ status: 'available', canOpen: true });
    expect(e08?.detail).toContain('Avance parcial del recorrido de prueba');
  });

  it('complete significa recorrido terminado, nunca 15/15 ni Zona 3 completa', () => {
    const e01 = resolveExercise(beginFlow(freshProgress, atStart), 'E01', atE01);
    const complete = resolveExercise(e01, 'E08', atE08);
    expect(complete).toMatchObject({ flow: { step: 'complete' }, completedExerciseIds: ['E01', 'E08'], activeExerciseId: null });
    expect(validateProgress(complete)).toBe(true);
    expect(describeFlow(complete).isComplete).toBe(true);
    expect(JSON.stringify(describeFlow(complete))).not.toMatch(/15\s*\/\s*15|Zona 3 completa/i);
  });
});

describe('T033 presentación del recorrido de prueba', () => {
  it('muestra el avance real, E01 disponible y E08 bloqueado, sin mapa de zonas', () => {
    const started = beginFlow(freshProgress, atStart);
    const html = renderToStaticMarkup(createElement(FlowScreen, { progress: started, onOpenExercise: () => {}, onBackToIndex: () => {} }));
    expect(html).toContain('Recorrido de prueba');
    expect(html).toContain('El Conector de Energía');
    expect(html).toContain('Foco del Vértice');
    expect(html).toContain('Se desbloquea al resolver E01');
    expect(html).toContain('Abrir E01');
    expect(html).not.toMatch(/mapa de zonas|15\s*\/\s*15/i);
  });

  it('al resolver E01 muestra E08 como avance parcial y al completar cierra el recorrido', () => {
    const e01 = resolveExercise(beginFlow(freshProgress, atStart), 'E01', atE01);
    const e01Html = renderToStaticMarkup(createElement(FlowScreen, { progress: e01, onOpenExercise: () => {}, onBackToIndex: () => {} }));
    expect(e01Html).toContain('Avance parcial del recorrido de prueba');

    const complete = resolveExercise(e01, 'E08', atE08);
    const completeHtml = renderToStaticMarkup(createElement(FlowScreen, { progress: complete, onOpenExercise: () => {}, onBackToIndex: () => {} }));
    expect(completeHtml).toContain('Recorrido de prueba completado');
    expect(completeHtml).not.toMatch(/15\s*\/\s*15|Zona 3 completa|mapa de zonas/i);
  });
});
