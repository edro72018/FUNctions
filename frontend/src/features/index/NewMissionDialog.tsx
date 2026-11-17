import { Button } from '../../shared/ui/Button';
import { Dialog } from '../../shared/ui/Dialog';

export interface NewMissionDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Foco explícito al cerrar; garantiza el retorno a Comenzar. */
  returnFocus?: () => HTMLElement | null;
}

/**
 * Confirmación explícita antes de reemplazar una misión existente.
 * Cancelar no escribe en el almacenamiento; el diálogo devuelve el foco al abrirse y al cerrarse.
 */
export function NewMissionDialog({ open, onConfirm, onCancel, returnFocus }: NewMissionDialogProps) {
  return (
    <Dialog open={open} title="Comenzar una misión nueva" onClose={onCancel} {...(returnFocus ? { returnFocus } : {})}>
      <p>Ya hay una misión en curso.</p>
      <p>Si inicias una misión nueva, se reemplazará el progreso guardado de la misión actual.</p>
      <p>Cancelar conserva el progreso actual.</p>
      {/* Cancelar va primero para que el diálogo abra el foco en la opción no destructiva. */}
      <Button onClick={onCancel}>Cancelar</Button>
      <Button onClick={onConfirm}>Iniciar misión nueva</Button>
    </Dialog>
  );
}
