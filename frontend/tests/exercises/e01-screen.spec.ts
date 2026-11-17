/// <reference types="vite/client" />
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { E01Screen } from '../../src/features/exercises/e01/E01Screen';
import { beginFlow } from '../../src/features/flow/flow';
import { SagittalDiagram } from '../../src/zones/zone-1/SagittalDiagram';
import type { ProgressV1, PersistenceState } from '../../src/shared/storage/progress';
import type { ValidationGateway } from '../../src/shared/validation-gateway/types';

const startedAt = '2026-11-16T20:00:00.000Z';

function e01Progress(): ProgressV1 {
  return beginFlow(
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
}

const gateway: ValidationGateway = {
  validate: async request => ({
    status: 'correct',
    feedbackCode: 'E01_FUNCTION_CONFIRMED',
    origin: 'local',
    requestId: request.requestId,
    exerciseId: request.exerciseId,
    receivedAt: startedAt,
  }),
};

function render(progress: ProgressV1 = e01Progress()) {
  const save = (): PersistenceState => ({ status: 'saved', progress });
  return renderToStaticMarkup(
    createElement(E01Screen, {
      progress,
      gateway,
      onSave: save,
      onContinue: () => {},
      onBackToFlow: () => {},
    }),
  );
}

it('T038 el diagrama incluye descripción textual equivalente fuera del canvas', () => {
  const html = renderToStaticMarkup(createElement(SagittalDiagram));
  expect(html).toContain('A = {1, 2, 3}');
  expect(html).toContain('B = {4, 5}');
  expect(html).toContain('R = {(1, 4), (2, 4), (3, 5)}');
  expect(html).toContain('1 → 4');
  expect(html).toContain('2 → 4');
  expect(html).toContain('3 → 5');
  expect(html).toContain('aria-hidden="true"');
});

it('T040 ofrece opciones mutuamente excluyentes, acciones y ayudas secuenciales', () => {
  const html = render();
  expect(html).toContain('El Conector de Energía');
  expect(html).toContain('Máquina de Enlaces');
  expect(html).toContain('type="radio"');
  expect(html).toContain('name="e01-selection"');
  expect(html).toContain('Es función');
  expect(html).toContain('No es función');
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
  expect(html.indexOf('Diagrama sagital')).toBeLessThan(html.indexOf('Respuesta'));
});

it('T040 reutiliza el marco común sin duplicar la máquina de interacción de 003', () => {
  const sources = import.meta.glob<string>('../../src/features/exercises/e01/*.{ts,tsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  });
  const screen = sources['../../src/features/exercises/e01/E01Screen.tsx'] ?? '';
  expect(screen).not.toBe('');
  expect(screen).not.toContain('validation-gateway/api');
  expect(screen).not.toContain('shared/validation/dispatch');
  expect(screen).not.toContain('setPointerCapture');
  const adapter = sources['../../src/features/exercises/e01/interactionAdapter.ts'] ?? '';
  expect(adapter).toBe('');
});
