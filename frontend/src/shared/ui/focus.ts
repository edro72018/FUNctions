export function restoreFocus(target: HTMLElement | null): void {
  if (target?.isConnected) target.focus();
}
export function rememberFocus(): () => void {
  const target = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  return () => restoreFocus(target);
}
