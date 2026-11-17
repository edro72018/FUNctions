import { StatusRegion } from '../../shared/ui/StatusRegion';

export interface PersistenceNoticeProps {
  readonly visible: boolean;
  readonly message?: string;
}

/**
 * Aviso de almacenamiento no disponible. Informa el fallo de guardado sin
 * afirmar que el progreso se conservó.
 */
export function PersistenceNotice({ visible, message }: PersistenceNoticeProps) {
  if (!visible) return null;
  return (
    <StatusRegion>
      {message ??
        'No se pudo guardar el progreso. El avance de esta sesión no se conservará al recargar.'}
    </StatusRegion>
  );
}
