/// <reference types="vite/client" />
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { E08Screen } from '../../src/features/exercises/e08/E08Screen';
import { withE08Draft } from '../../src/features/exercises/e08/progress';
import { beginFlow, resolveExercise } from '../../src/features/flow/flow';
import type { PersistenceState, ProgressV1 } from '../../src/shared/storage/progress';
import type { ValidationGateway } from '../../src/shared/validation-gateway/types';
import { VertexGraph } from '../../src/zones/zone-3/VertexGraph';

const startedAt = '2026-11-16T20:00:00.000Z';
const later = '2026-11-16T20:05:00.000Z';

function e08Progress(): ProgressV1 {
  const begun = beginFlow(
    {
      schemaVersion: 1,
      mission: {
        missionId: '8f14e45f-ea8b-4b7c-9a1d-3c2b1a0f9e8d',
        startedAt,
        lastSavedAt: startedAt,
      },
      flow: { step: 'intro' },
      completedExerciseIds: [],
      activeExerciseId: null,
      drafts: {},
      attempts: [],
      preferences: {},
    },
    startedAt,
  );
  return withE08Draft(resolveExercise(begun, 'E01', startedAt), '3', '2', later);
}

const gateway: ValidationGateway = {
  validate: async request => ({
    status: 'correct',
    feedbackCode: 'E08_VERTEX_CONFIRMED',
    origin: 'local',
    requestId: request.requestId,
    exerciseId: request.exerciseId,
    receivedAt: startedAt,
  }),
};

function renderE08(progress: ProgressV1 = e08Progress()) {
  const save = (): PersistenceState => ({ status: 'saved', progress });
  return renderToStaticMarkup(
    createElement(E08Screen, {
      progress,
      gateway,
      onSave: save,
      onContinue: () => {},
      onBackToFlow: () => {},
    }),
  );
}

it('T051 la gráfica describe el punto objetivo y la fórmula con a = 1', () => {
  const html = renderToStaticMarkup(createElement(VertexGraph, { h: '3', k: '2' }));
  expect(html).toContain('punto objetivo es (3, 2)');
  expect(html).toContain('f(x) = (x − h)² + k');
  expect(html).toContain('a = 1');
  expect(html).toContain('Vértice actual: (3, 2)');
  expect(html).toContain('aria-hidden="true"');
});

it('T052 ofrece campos h y k etiquetados, acciones, ayudas y estado accesible', () => {
  const html = renderE08();
  expect(html).toContain('Foco del Vértice');
  expect(html).toContain('Sintonizador de Trayectorias');
  expect(html).toContain('Gráfica de la trayectoria');
  expect(html).toContain('id="e08-h"');
  expect(html).toContain('id="e08-k"');
  expect(html).toContain('for="e08-h"');
  expect(html).toContain('for="e08-k"');
  expect(html).toMatch(/inputmode="decimal"/i);
  expect(html).toContain('>Probar<');
  expect(html).toContain('>Deshacer<');
  expect(html).toContain('>Reiniciar<');
  expect(html).toContain('>Ayudas<');
  expect(html).toContain('>H1<');
  expect(html).toContain('Volver al recorrido');
  expect(html).toContain('aria-live="polite"');
  expect(html).not.toContain('>Continuar<');
  expect(html).not.toContain('Origen:');
  expect(html.match(/disabled/g)?.length).toBeGreaterThanOrEqual(3);
  expect(html.indexOf('Gráfica de la trayectoria')).toBeLessThan(html.indexOf('Respuesta'));
});

it('T051/T052 reutiliza el marco común sin persistir ni duplicar 003', () => {
  const screenSources = import.meta.glob<string>('../../src/features/exercises/e08/*.{ts,tsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  });
  const screen = screenSources['../../src/features/exercises/e08/E08Screen.tsx'] ?? '';
  expect(screen).not.toBe('');
  expect(screen).not.toContain('validation-gateway/api');
  expect(screen).not.toContain('shared/validation/dispatch');
  expect(screen).not.toContain('setPointerCapture');
  const adapter = screenSources['../../src/features/exercises/e08/interactionAdapter.ts'] ?? '';
  expect(adapter).toBe('');

  const graphSources = import.meta.glob<string>('../../src/zones/zone-3/*.{ts,tsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  });
  const graph = graphSources['../../src/zones/zone-3/VertexGraph.tsx'] ?? '';
  expect(graph).toContain("import { Coordinates, Mafs, Plot, Point, Theme } from 'mafs';");
  expect(graph).not.toContain('localStorage');
  expect(graph).not.toContain('validateE08');
  expect(graph).not.toContain('onSave');
});
