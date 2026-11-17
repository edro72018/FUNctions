import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { aboutEntry } from '../../src/features/info/about';
import { AboutScreen } from '../../src/features/info/AboutScreen';
import { feedbackGuidance, howToPlaySections, inputGuidance } from '../../src/features/info/howToPlay';
import { HowToPlayScreen } from '../../src/features/info/HowToPlayScreen';
import { instructionSections } from '../../src/features/info/instructions';
import { InstructionsScreen } from '../../src/features/info/InstructionsScreen';
import type { AboutEntry } from '../../src/app/content';

const forbidden = /temporizador|vidas|puntos|insignias/i;
const forbiddenAttribution = /NASA|\bANE\b|logotipo/i;

function allText(): string {
  return JSON.stringify([instructionSections, howToPlaySections, feedbackGuidance, inputGuidance]);
}

describe('T043 Instrucciones normativas', () => {
  it('presenta los seis bloques requeridos', () => {
    expect(instructionSections.map(section => section.id)).toEqual([
      'objective',
      'rules',
      'progression',
      'victory',
      'retries',
      'hints',
    ]);
    const text = JSON.stringify(instructionSections);
    for (const expected of ['Objetivo educativo', 'Reglas generales', 'zonas', 'niveles', '15/15', 'reintentos', 'H1', 'H2', 'H3']) {
      expect(text).toContain(expected);
    }
  });

  it('no incluye temporizador, vidas, puntos ni insignias', () => {
    expect(allText()).not.toMatch(forbidden);
  });
});

describe('T044 pantalla Instrucciones', () => {
  it('renderiza los bloques y vuelve al índice en una sola acción', () => {
    const html = renderToStaticMarkup(createElement(InstructionsScreen, { onBackToIndex: () => {} }));
    expect(html).toContain('<h1 id="instructions-title">Instrucciones</h1>');
    for (const section of instructionSections) expect(html).toContain(section.title);
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain('Volver al índice');
    expect(html).toContain('type="button"');
    expect(html).not.toMatch(forbidden);
  });
});

describe('T045 Cómo se Juega práctico', () => {
  it('explica las acciones, la retroalimentación y los modos de entrada', () => {
    const actions = JSON.stringify(howToPlaySections);
    for (const expected of ['Probar', 'Deshacer', 'Reiniciar', 'Ayudas', 'H1', 'H2', 'H3']) {
      expect(actions).toContain(expected);
    }
    const feedback = JSON.stringify(feedbackGuidance);
    for (const expected of ['incomplete', 'correct', 'incorrect', 'indeterminate', 'technical-error', 'Incompleto', 'Correcto', 'Incorrecto', 'Indeterminado', 'Error técnico', 'local', 'API']) {
      expect(feedback).toContain(expected);
    }
    const input = JSON.stringify(inputGuidance);
    for (const expected of ['keyboard', 'mouse', 'touch', 'Teclado', 'Ratón', 'Pantalla táctil', 'Enter', 'Espacio']) {
      expect(input).toContain(expected);
    }
  });

  it('no incluye temporizador, vidas, puntos ni insignias', () => {
    expect(allText()).not.toMatch(forbidden);
  });
});

describe('T046 pantalla Cómo se Juega', () => {
  it('renderiza la práctica y vuelve al índice en una sola acción', () => {
    const html = renderToStaticMarkup(createElement(HowToPlayScreen, { onBackToIndex: () => {} }));
    expect(html).toContain('<h1 id="how-to-play-title">Cómo se Juega</h1>');
    for (const action of ['Probar', 'Deshacer', 'Reiniciar', 'Ayudas']) expect(html).toContain(action);
    for (const status of ['Incompleto', 'Correcto', 'Incorrecto', 'Indeterminado', 'Error técnico']) expect(html).toContain(status);
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain('Volver al índice');
  });
});

describe('T061–T062 Acerca de', () => {
  it('mantiene el contenido pendiente sin datos inventados', () => {
    expect(aboutEntry).toEqual({ id: 'about', approvalStatus: 'pending', fields: {} });
  });

  it('muestra un aviso explícito y ninguna atribución ni logotipo', () => {
    const html = renderToStaticMarkup(createElement(AboutScreen, { onBackToIndex: () => {} }));
    expect(html).toContain('Contenido pendiente de aprobación.');
    expect(html).not.toContain('FUNctions');
    expect(html).not.toMatch(forbiddenAttribution);
    expect(html).not.toContain('<img');
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain('Volver al índice');
  });

  it('renderiza el contenido aprobado con nombre, propósito, equipo, autoría y licencia MIT', () => {
    const approved: AboutEntry = {
      id: 'about',
      approvalStatus: 'approved',
      fields: {
        name: 'FUNctions',
        purpose: 'Aprender funciones mediante retos interactivos.',
        team: ['Equipo de ejemplo'],
        authorship: 'Autoría de ejemplo',
        license: 'MIT',
      },
    };
    const html = renderToStaticMarkup(createElement(AboutScreen, { entry: approved, onBackToIndex: () => {} }));
    for (const expected of ['FUNctions', 'Aprender funciones', 'Equipo de ejemplo', 'Autoría de ejemplo', 'MIT', '<dt>Nombre</dt>', '<dt>Licencia</dt>']) {
      expect(html).toContain(expected);
    }
    expect(html).not.toMatch(forbiddenAttribution);
    expect(html).not.toContain('<img');
  });
});
