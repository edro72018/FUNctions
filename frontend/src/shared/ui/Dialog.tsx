import { useEffect, useId, useRef, type ReactNode } from 'react';
import { rememberFocus, restoreFocus } from './focus';
export function Dialog({ open, title, onClose, children, returnFocus }: { open: boolean; title: string; onClose: () => void; children: ReactNode; returnFocus?: () => HTMLElement | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const restore = rememberFocus();
    dialog.showModal();
    dialog.querySelector<HTMLElement>('button, [href], input, select, textarea')?.focus();
    return () => {
      dialog.close();
      const target = returnFocus?.() ?? null;
      if (target) restoreFocus(target);
      else restore();
    };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}>
    <h2 id={titleId}>{title}</h2>{children}
  </dialog>;
}
