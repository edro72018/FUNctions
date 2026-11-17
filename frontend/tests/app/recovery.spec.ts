import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { PersistenceNotice } from '../../src/features/recovery/PersistenceNotice';
import { ProgressRecoveryScreen } from '../../src/features/recovery/ProgressRecoveryScreen';
import type { PersistenceState } from '../../src/shared/storage/progress';

const notSaved: PersistenceState = { status: 'corrupt', progress: null, reason: 'json' };

function renderRecovery(persistence: PersistenceState) {
  return renderToStaticMarkup(
    createElement(ProgressRecoveryScreen, {
      persistence,
      onBackToIndex: () => {},
      onStartNewMission: () => persistence,
    }),
  );
}

it('T057 explica el progreso ilegible sin Continuar y ofrece volver al índice', () => {
  const html = renderRecovery(notSaved);
  expect(html).toContain('El progreso guardado no se pudo leer');
  expect(html).toContain('No se sobrescribió');
  expect(html).toContain('Volver al índice');
  expect(html).toContain('>Iniciar misión nueva<');
  expect(html).not.toContain('>Continuar<');
});

it('T057 explica la versión desconocida y exige confirmación con respaldo', () => {
  const html = renderRecovery({ status: 'unknown-version', progress: null, reason: 'version' });
  expect(html).toContain('versión');
  expect(html).toContain('respaldo');
  expect(html).toContain('Cancelar');
  expect(html).toContain('Iniciar misión nueva y respaldar');
  expect(html).toContain('aria-live="polite"');
});

it('T058 informa que no se pudo guardar sin afirmar que se conservó', () => {
  const visible = renderToStaticMarkup(createElement(PersistenceNotice, { visible: true }));
  expect(visible).toContain('No se pudo guardar el progreso');
  expect(visible).not.toMatch(/se conservó|guardado correctamente/i);
  expect(visible).toContain('aria-live="polite"');
  const hidden = renderToStaticMarkup(createElement(PersistenceNotice, { visible: false }));
  expect(hidden).toBe('');
});
