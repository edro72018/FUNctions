import type { TechnicalError, ValidationOutcome } from '../../shared/validation-gateway/types';
import { StatusRegion } from '../../shared/ui/StatusRegion';
export interface FeedbackProps { outcome: ValidationOutcome | null; error: TechnicalError | null; message?: string }
export function FeedbackPanel({ outcome, error, message }: FeedbackProps) {
  return <StatusRegion>{error ? <p>{error.category === 'incomplete' ? 'Respuesta incompleta' : 'Error técnico'}: {error.message}</p> : outcome ? <>
    <p>{outcome.status === 'correct' ? 'Respuesta correcta.' : outcome.status === 'incorrect' ? 'Respuesta incorrecta.' : 'El verificador no pudo decidir.'} {message}</p>
    <p>Origen: {outcome.origin === 'api' ? 'API' : 'local'}</p>
  </> : message ? <p>{message}</p> : null}</StatusRegion>;
}
