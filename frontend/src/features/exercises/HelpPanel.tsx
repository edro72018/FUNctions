import type { HintLevel } from '../../shared/storage/progress';
import { Button } from '../../shared/ui/Button';
import { Dialog } from '../../shared/ui/Dialog';
export interface HelpPanelProps {
  maxHint: HintLevel; openHint: 1 | 2 | 3 | null; hints: readonly [string, string, string];
  onHint: (hint: 1 | 2 | 3) => void; onClose: () => void; disabled?: boolean;
}
export function HelpPanel({ maxHint, openHint, hints, onHint, onClose, disabled = false }: HelpPanelProps) {
  return <section aria-label="Ayudas">
    {([1, 2, 3] as const).map(hint => <Button key={hint} disabled={disabled || hint > maxHint + 1} onClick={() => onHint(hint)}>H{hint}</Button>)}
    <Dialog open={openHint !== null} title={`Ayuda H${openHint ?? 1}`} onClose={onClose}>
      <p>{openHint !== null && openHint <= maxHint + 1 ? hints[openHint - 1] : null}</p>
      <Button onClick={onClose}>Cerrar ayuda</Button>
    </Dialog>
  </section>;
}
