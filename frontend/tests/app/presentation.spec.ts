import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { content } from '../../src/app/content';
import { HelpPanel } from '../../src/features/exercises/HelpPanel';
import { FeedbackPanel } from '../../src/features/exercises/FeedbackPanel';
import { ExerciseScreen } from '../../src/features/exercises/ExerciseScreen';
it('T012 mantiene contenido pendiente sin atribuciones', () => {
  for (const entry of Object.values(content)) expect(entry).toMatchObject({ approvalStatus: 'pending', fields: {} });
  expect(JSON.stringify(content)).not.toMatch(/NASA|ANE|logotipo|licencia|equipo|autoría/i);
});
it('T024 ayudas secuenciales controladas: H3 no contiene respuesta ni envía', () => {
  const html = renderToStaticMarkup(createElement(HelpPanel, { maxHint: 0, openHint: null, hints: ['uno', 'dos', 'tres'], onHint: () => {}, onClose: () => {} }));
  expect(html.match(/disabled/g)).toHaveLength(2);
  expect(html).toContain('H1');
});
it('T024 indeterminate y errores tienen texto, sin resultado incorrecto ni origen inventado', () => {
  const outcome = { status: 'indeterminate' as const, origin: 'local' as const, feedbackCode: 'UNKNOWN', requestId: 'r', exerciseId: 'E01', receivedAt: 'now' };
  const html = renderToStaticMarkup(createElement(FeedbackPanel, { outcome, error: null }));
  expect(html).toContain('no pudo decidir'); expect(html).toContain('local'); expect(html).toContain('aria-live="polite"');
  const errorHtml = renderToStaticMarkup(createElement(FeedbackPanel, { outcome: null, error: { category: 'transport', code: 'DOWN', message: 'No disponible' } }));
  expect(errorHtml).toContain('Error técnico'); expect(errorHtml).not.toContain('Origen');
});
it('T024 marco deshabilita Deshacer y ofrece Continuar solo tras correct', () => {
  const props = { title: 'Prueba', zone: '1', objective: 'Objetivo', statement: 'Enunciado', pending: false, canUndo: false, hasChanges: false, resetConfirmationOpen: false, onTry: () => {}, onUndo: () => {}, onReset: () => {}, onRequestReset: () => {}, onCancelReset: () => {}, onRetry: () => {}, onContinue: () => {}, outcome: null, error: null, help: null };
  const html = renderToStaticMarkup(createElement(ExerciseScreen, props));
  expect(html).toContain('disabled="" type="button">Deshacer'); expect(html).not.toContain('>Continuar<');
  expect(html).toContain('aria-live="polite"');
  const correct = renderToStaticMarkup(createElement(ExerciseScreen, { ...props, outcome: { status: 'correct', origin: 'api', feedbackCode: 'OK', requestId: 'r', exerciseId: 'E01', receivedAt: 'now' } }));
  expect(correct).toContain('>Continuar<'); expect(correct).toContain('API');
  const incorrect = renderToStaticMarkup(createElement(ExerciseScreen, { ...props, outcome: { status: 'incorrect', origin: 'local', feedbackCode: 'NO', requestId: 'r', exerciseId: 'E01', receivedAt: 'now' } }));
  expect(incorrect).toContain('>Reintentar<'); expect(incorrect).not.toContain('>Continuar<');
  const failed = renderToStaticMarkup(createElement(ExerciseScreen, { ...props, error: { category: 'transport', code: 'DOWN', message: 'No disponible' } }));
  expect(failed).toContain('>Reintentar<');
  const reset = renderToStaticMarkup(createElement(ExerciseScreen, { ...props, hasChanges: true, resetConfirmationOpen: true }));
  expect(reset).toContain('¿Reiniciar el reto?');
});
