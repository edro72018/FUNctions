import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { StatusRegion } from '../../../shared/ui/StatusRegion';
import type { HintLevel, PersistenceState, ProgressV1 } from '../../../shared/storage/progress';
import { technicalError } from '../../../shared/validation-gateway/types';
import type {
  TechnicalError,
  ValidationGateway,
  ValidationOutcome,
} from '../../../shared/validation-gateway/types';
import { SagittalDiagram } from '../../../zones/zone-1/SagittalDiagram';
import { ExerciseScreen } from '../ExerciseScreen';
import { HelpPanel } from '../HelpPanel';
import { e01Definition, e01Diagnosis } from './definition';
import { createE01Gateway } from './gateway';
import { canOpenE01Hint, e01Hints, raiseE01Hint } from './hints';
import { applyE01Outcome, withE01Hint, withE01Selection } from './progress';
import { buildE01Request, validateE01 } from './validateE01';

export interface E01ScreenProps {
  readonly progress: ProgressV1;
  readonly onSave: (next: ProgressV1) => PersistenceState;
  readonly onContinue: () => void;
  readonly onBackToFlow: () => void;
  readonly gateway?: ValidationGateway;
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * E01 — El Conector de Energía. La pantalla conserva la selección, el historial
 * mínimo de deshacer/reiniciar y la presentación; la evaluación ocurre en el
 * gateway. La máquina de interacción de 003 no se duplica aquí.
 */
export function E01Screen({ progress, onSave, onContinue, onBackToFlow, gateway }: E01ScreenProps) {
  const localGateway = useMemo(() => createE01Gateway(), []);
  const activeGateway = gateway ?? localGateway;
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const activeRequest = useRef<string | null>(null);

  const [selection, setSelection] = useState<boolean | null>(progress.drafts.E01?.selection ?? null);
  const [history, setHistory] = useState<readonly (boolean | null)[]>([]);
  const [maxHint, setMaxHint] = useState<HintLevel>(progress.drafts.E01?.maxHint ?? 0);
  const [openHint, setOpenHint] = useState<1 | 2 | 3 | null>(null);
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<ValidationOutcome | null>(null);
  const [error, setError] = useState<TechnicalError | null>(null);
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(
    () => () => {
      activeRequest.current = null;
    },
    [],
  );

  function persist(next: ProgressV1): PersistenceState {
    const result = onSave(next);
    setNotice(result.status === 'saved' ? null : (result.message ?? 'No se pudo guardar el progreso.'));
    return result;
  }

  function choose(value: boolean) {
    if (pending || selection === value) return;
    setHistory(list => [...list, selection]);
    setSelection(value);
    setOutcome(null);
    setError(null);
    persist(withE01Selection(progressRef.current, value, nowIso()));
  }

  function undo() {
    if (pending) return;
    const previous = history.at(-1);
    if (previous === undefined) return;
    setHistory(history.slice(0, -1));
    setSelection(previous);
    setOutcome(null);
    setError(null);
    persist(withE01Selection(progressRef.current, previous, nowIso()));
  }

  function reset() {
    setResetConfirmationOpen(false);
    setHistory([]);
    setSelection(null);
    setOutcome(null);
    setError(null);
    setOpenHint(null);
    persist(withE01Selection(progressRef.current, null, nowIso()));
  }

  function retry() {
    setOutcome(null);
    setError(null);
  }

  async function handleTry() {
    if (pending) return;
    const client = validateE01(selection);
    if (client.status === 'incomplete') {
      setOutcome(null);
      setError({
        category: 'incomplete',
        code: 'E01_SELECTION_REQUIRED',
        message: 'Selecciona «Es función» o «No es función» antes de probar.',
      });
      return;
    }
    const request = buildE01Request(selection, globalThis.crypto.randomUUID());
    if (!request) return;

    setOutcome(null);
    setError(null);
    setPending(true);
    activeRequest.current = request.requestId;
    try {
      const response = await activeGateway.validate(request);
      if (activeRequest.current !== request.requestId) return;
      activeRequest.current = null;
      const next = applyE01Outcome(progressRef.current, response, nowIso());
      if (next !== progressRef.current) persist(next);
      if ('category' in response) {
        setOutcome(null);
        setError(response);
      } else {
        setError(null);
        setOutcome(response);
      }
      setPending(false);
    } catch {
      if (activeRequest.current !== request.requestId) return;
      activeRequest.current = null;
      setError(technicalError('service', 'La validación no pudo completarse.'));
      setPending(false);
    }
  }

  function openHelp(hint: 1 | 2 | 3) {
    if (pending || !canOpenE01Hint(maxHint, hint)) return;
    setOpenHint(hint);
    if (hint > maxHint) {
      setMaxHint(raiseE01Hint(maxHint, hint));
      persist(withE01Hint(progressRef.current, hint, nowIso()));
    }
  }

  const message = outcome ? e01Diagnosis(outcome.feedbackCode) : undefined;

  return (
    <main id="app" aria-labelledby="e01-title">
      <Button onClick={onBackToFlow}>Volver al recorrido</Button>
      <ExerciseScreen
        title={e01Definition.title}
        titleId="e01-title"
        zone={`${e01Definition.zone} — ${e01Definition.zoneName}`}
        objective={e01Definition.objective}
        statement={e01Definition.statement}
        visual={<SagittalDiagram />}
        pending={pending}
        canUndo={history.length > 0}
        hasChanges={history.length > 0}
        resetConfirmationOpen={resetConfirmationOpen}
        onTry={() => {
          void handleTry();
        }}
        onUndo={undo}
        onReset={reset}
        onRequestReset={() => setResetConfirmationOpen(true)}
        onCancelReset={() => setResetConfirmationOpen(false)}
        onRetry={retry}
        onContinue={onContinue}
        outcome={outcome}
        error={error}
        {...(message === undefined ? {} : { message })}
        help={
          <div>
            <Button disabled={pending} onClick={() => openHelp(1)}>
              Ayudas
            </Button>
            <HelpPanel
              maxHint={maxHint}
              openHint={openHint}
              hints={e01Hints}
              onHint={openHelp}
              onClose={() => setOpenHint(null)}
              disabled={pending}
            />
          </div>
        }
      >
        {e01Definition.options.map(option => (
          <label key={String(option.value)}>
            <input
              type="radio"
              name="e01-selection"
              value={String(option.value)}
              checked={selection === option.value}
              disabled={pending}
              aria-invalid={error?.category === 'incomplete'}
              onChange={() => choose(option.value)}
            />{' '}
            {option.label}
          </label>
        ))}
      </ExerciseScreen>
      <StatusRegion>{notice ?? ''}</StatusRegion>
    </main>
  );
}
