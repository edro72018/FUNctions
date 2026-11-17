import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../../shared/ui/Button';
import { Dialog } from '../../shared/ui/Dialog';
import { FeedbackPanel, type FeedbackProps } from './FeedbackPanel';
export interface ExerciseScreenProps extends FeedbackProps {
  title: string; titleId?: string; zone: string; objective: string; statement: string; children?: ReactNode; visual?: ReactNode; help: ReactNode;
  pending: boolean; canUndo: boolean; hasChanges: boolean; resetConfirmationOpen: boolean;
  onTry: () => void; onUndo: () => void; onReset: () => void; onRequestReset: () => void; onCancelReset: () => void; onRetry: () => void; onContinue: () => void;
}
/** Presentación controlada. Historia, borrador, reinicio y pending pertenecen a 003. */
export function ExerciseScreen(props: ExerciseScreenProps) {
  const continueRef = useRef<HTMLButtonElement>(null);
  const correct = !props.error && props.outcome?.status === 'correct';
  useEffect(() => { if (correct && !props.pending) continueRef.current?.focus(); }, [correct, props.pending]);
  return <section aria-label={props.title} aria-busy={props.pending}>
    <h1 id={props.titleId}>{props.title}</h1><p>Zona {props.zone}</p><p>{props.objective}</p><p>{props.statement}</p>
    {props.visual}
    <fieldset disabled={props.pending}><legend>Respuesta</legend>{props.children}</fieldset>
    <Button disabled={props.pending} onClick={props.onTry}>Probar</Button>
    <Button disabled={props.pending || !props.canUndo} onClick={props.onUndo}>Deshacer</Button>
    <Button disabled={props.pending} onClick={props.hasChanges ? props.onRequestReset : props.onReset}>Reiniciar</Button>
    {props.help}
    <FeedbackPanel outcome={props.pending ? null : props.outcome} error={props.pending ? null : props.error} message={props.pending ? 'Validando…' : props.message ?? ''} />
    {!props.pending && (correct ? <Button ref={continueRef} onClick={props.onContinue}>Continuar</Button> : (props.error || props.outcome) ? <Button onClick={props.onRetry}>Reintentar</Button> : null)}
    <Dialog open={props.resetConfirmationOpen} title="¿Reiniciar el reto?" onClose={props.onCancelReset}>
      <p>Se restaurará la configuración inicial.</p>
      <Button disabled={props.pending} onClick={props.onReset}>Reiniciar</Button><Button onClick={props.onCancelReset}>Cancelar</Button>
    </Dialog>
  </section>;
}
