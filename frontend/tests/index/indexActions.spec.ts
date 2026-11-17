import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IndexScreen } from '../../src/features/index/IndexScreen';
import { selectIndexActions } from '../../src/features/index/indexActions';

const forbidden = /temporizador|vidas|puntos|insignias|15\s*\/\s*15|Zona 3 completa|juego completo/i;

describe('T026 AC-01 índice sin progreso', () => {
  const actions = selectIndexActions({ hasReadableProgress: false });

  it('muestra las cuatro acciones base con etiqueta visible y sin Continuar', () => {
    expect(actions.map(action => action.label)).toEqual(['Comenzar', 'Instrucciones', 'Acerca de', 'Cómo se Juega']);
    expect(actions.some(action => action.id === 'continue')).toBe(false);
  });

  it('marca los destinos fuera del corte como no disponibles con mensaje explícito', () => {
    const unavailable = actions.filter(action => !action.enabled);
    expect(unavailable.length).toBeGreaterThan(0);
    for (const action of unavailable) {
      expect(action.unavailableMessage).toBeTruthy();
      expect(action.unavailableMessage).not.toMatch(/error técnico|fallo|excepción/i);
    }
  });

  it('no anuncia temporizador, vidas, puntos, insignias ni progreso inexistente', () => {
    expect(JSON.stringify(actions)).not.toMatch(forbidden);
  });
});

describe('T026 AC-12 Continuar solo con progreso legible', () => {
  it('añade Continuar cuando existe progreso legible', () => {
    const actions = selectIndexActions({ hasReadableProgress: true });
    expect(actions.map(action => action.label)).toEqual(['Comenzar', 'Continuar', 'Instrucciones', 'Acerca de', 'Cómo se Juega']);
    expect(actions.find(action => action.id === 'continue')).toMatchObject({ enabled: true, unavailableMessage: null });
  });

  it('permite deshabilitar Comenzar con un mensaje explícito y sin tono de error técnico', () => {
    const actions = selectIndexActions({
      hasReadableProgress: false,
      overrides: { start: { enabled: false, unavailableMessage: 'El progreso guardado no se pudo leer y no se sobrescribirá.' } },
    });
    expect(actions[0]).toMatchObject({ id: 'start', enabled: false, unavailableMessage: 'El progreso guardado no se pudo leer y no se sobrescribirá.' });
  });
});

describe('T027 presentación del índice', () => {
  it('muestra FUNctions, una descripción breve y las acciones con etiqueta visible', () => {
    const actions = selectIndexActions({ hasReadableProgress: false });
    const html = renderToStaticMarkup(createElement(IndexScreen, { actions, onAction: () => {} }));
    expect(html).toContain('FUNctions');
    expect(html).toContain('Explora funciones');
    for (const label of ['Comenzar', 'Instrucciones', 'Acerca de', 'Cómo se Juega']) expect(html).toContain(label);
    expect(html).not.toContain('Continuar');
    expect(html).not.toMatch(forbidden);
  });

  it('muestra Continuar y conserva botones nativos operables por teclado', () => {
    const actions = selectIndexActions({ hasReadableProgress: true });
    const html = renderToStaticMarkup(createElement(IndexScreen, { actions, onAction: () => {} }));
    expect(html).toContain('Continuar');
    expect(html).toContain('type="button"');
    expect(html.match(/<button/g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).toContain('aria-live="polite"');
  });
});
