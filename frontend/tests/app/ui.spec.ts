import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Button } from '../../src/shared/ui/Button';
import { Dialog } from '../../src/shared/ui/Dialog';
import { StatusRegion } from '../../src/shared/ui/StatusRegion';
import { restoreFocus } from '../../src/shared/ui/focus';
it('T013 botón nativo con nombre accesible y estado', () => {
  const html = renderToStaticMarkup(createElement(Button, { disabled: true, 'aria-label': 'Comenzar' }, 'Comenzar'));
  expect(html).toContain('type="button"'); expect(html).toContain('disabled=""'); expect(html).toContain('aria-label="Comenzar"');
});
it('T013 región polite y diálogo nativo etiquetado', () => {
  expect(renderToStaticMarkup(createElement(StatusRegion, null, 'Guardado'))).toContain('aria-live="polite"');
  const html = renderToStaticMarkup(createElement(Dialog, { open: true, title: 'Confirmar', onClose: () => {}, children: 'Contenido' }));
  expect(html).toContain('<dialog'); expect(html).toContain('Confirmar'); expect(html).toContain('Contenido');
});
it('T013 retorno de foco solo a un objetivo conectado', () => {
  const focus = vi.fn(); const disconnected = vi.fn();
  restoreFocus({ isConnected: true, focus } as unknown as HTMLElement);
  restoreFocus({ isConnected: false, focus: disconnected } as unknown as HTMLElement);
  expect(focus).toHaveBeenCalledOnce(); expect(disconnected).not.toHaveBeenCalled();
});
