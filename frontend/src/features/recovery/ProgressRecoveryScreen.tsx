import { useState } from 'react';
import type { PersistenceState } from '../../shared/storage/progress';
import { Button } from '../../shared/ui/Button';
import { Dialog } from '../../shared/ui/Dialog';
import { StatusRegion } from '../../shared/ui/StatusRegion';

export interface ProgressRecoveryScreenProps {
  readonly persistence: Pick<PersistenceState, 'status' | 'reason'> &
    Partial<Pick<PersistenceState, 'message'>>;
  readonly onBackToIndex: () => void;
  /** Debe confirmar, respaldar el contenido anterior y crear la misión nueva. */
  readonly onStartNewMission: () => PersistenceState;
}

function reasonText(reason: PersistenceState['reason']): string {
  if (reason === 'version') {
    return 'La versión del progreso guardado no es compatible con esta aplicación.';
  }
  if (reason === 'json') return 'El progreso guardado no es un contenido legible.';
  return 'El progreso guardado no cumple el formato esperado.';
}

/**
 * Progreso ilegible o de versión desconocida. No sobrescribe, no descarta y no
 * ofrece Continuar. Iniciar una misión nueva exige confirmación explícita y
 * conserva el contenido anterior en una clave de respaldo.
 */
export function ProgressRecoveryScreen({
  persistence,
  onBackToIndex,
  onStartNewMission,
}: ProgressRecoveryScreenProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function confirmNewMission() {
    const result = onStartNewMission();
    setConfirmationOpen(false);
    if (result.status === 'saved') setNotice(null);
    else {
      setNotice(
        result.status === 'unavailable'
          ? 'No se pudo guardar la misión nueva ni el respaldo. El progreso anterior sigue sin sobrescribirse.'
          : 'La misión nueva no se pudo iniciar. El progreso anterior sigue sin sobrescribirse.',
      );
    }
  }

  return (
    <main id="app" aria-labelledby="recovery-title">
      <h1 id="recovery-title">Progreso no disponible</h1>
      <p>El progreso guardado no se pudo leer. No se sobrescribió ni se descartó.</p>
      <p>{reasonText(persistence.reason)}</p>
      <p>Puedes volver al índice sin cambiar el contenido guardado.</p>
      <Button onClick={onBackToIndex}>Volver al índice</Button>
      <Button onClick={() => setConfirmationOpen(true)}>Iniciar misión nueva</Button>
      <StatusRegion>{notice ?? persistence.message ?? ''}</StatusRegion>
      <Dialog
        open={confirmationOpen}
        title="Iniciar misión nueva"
        onClose={() => setConfirmationOpen(false)}
      >
        <p>
          Se guardará una copia de respaldo del progreso anterior antes de escribir la misión
          nueva.
        </p>
        <p>Después del respaldo, el progreso ilegible dejará de ser la misión activa.</p>
        <Button onClick={() => setConfirmationOpen(false)}>Cancelar</Button>
        <Button onClick={confirmNewMission}>Iniciar misión nueva y respaldar</Button>
      </Dialog>
    </main>
  );
}
