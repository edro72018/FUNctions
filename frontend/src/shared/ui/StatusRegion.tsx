import type { ReactNode } from 'react';
export function StatusRegion({ children }: { children: ReactNode }) {
  return <div role="status" aria-live="polite" aria-atomic="true">{children}</div>;
}
