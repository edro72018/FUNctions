import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { pendingContentMessage, type IntroEntry } from '../../src/app/content';
import { NewMissionDialog } from '../../src/features/index/NewMissionDialog';
import { IntroScreen } from '../../src/features/intro/IntroScreen';

describe('T031 introducción breve', () => {
  it('con contenido pendiente muestra el aviso explícito y no inventa narrativa', () => {
    const html = renderToStaticMarkup(createElement(IntroScreen, { onContinue: () => {} }));
    expect(html).toContain(pendingContentMessage);
    expect(html).toContain('Comenzar el recorrido');
    expect(html.match(/<button/g)).toHaveLength(1);
  });

  it('con contenido aprobado muestra su texto y una única acción de avance', () => {
    const entry: IntroEntry = { id: 'intro', approvalStatus: 'approved', fields: { text: 'Texto aprobado de prueba.' } };
    const html = renderToStaticMarkup(createElement(IntroScreen, { entry, onContinue: () => {} }));
    expect(html).toContain('Texto aprobado de prueba.');
    expect(html).not.toContain(pendingContentMessage);
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain('Comenzar el recorrido');
  });
});

describe('T032 diálogo de misión nueva', () => {
  it('ofrece las dos acciones explícitas y un diálogo nativo etiquetado', () => {
    const html = renderToStaticMarkup(createElement(NewMissionDialog, { open: true, onConfirm: () => {}, onCancel: () => {} }));
    expect(html).toContain('<dialog');
    expect(html).toContain('Iniciar misión nueva');
    expect(html).toContain('Cancelar');
    expect(html).toContain('Cancelar conserva el progreso actual.');
    expect(html).toContain('aria-labelledby');
  });
});
