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
import { VertexGraph } from '../../../zones/zone-3/VertexGraph';
import { ExerciseScreen } from '../ExerciseScreen';
import { HelpPanel } from '../HelpPanel';
import {
  canOpenE08Hint,
  e08Definition,
  e08Diagnosis,
  e08Hints,
  raiseE08Hint,
} from './definition';
import { createE08Gateway } from './gateway';
import { normalizeNumberInput } from './numberInput';
import { applyE08Outcome, withE08Draft, withE08Hint } from './progress';
import { buildE08Request, validateE08 } from './validateE08';

export interface E08ScreenProps {
  readonly progress: ProgressV1;
  readonly onSave: (next: ProgressV1) => PersistenceState;
  readonly onContinue: () => void;
  readonly onBackToFlow: () => void;
  readonly gateway?: ValidationGateway;
}

type FieldId = 'h' | 'k';
interface FieldText {
  readonly h: string;
  readonly k: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function isFieldId(field: string): field is FieldId {
  return field === 'h' || field === 'k';
}

/**
 * E08 — Foco del Vértice. La pantalla conserva el texto de los campos, el
 * historial mínimo de deshacer/reiniciar y la presentación; la evaluación
 * ocurre en el gateway. La máquina de interacción de 003 no se duplica aquí.
 */
export function E08Screen({ progress, onSave, onContinue, onBackToFlow, gateway }: E08ScreenProps) {
  const localGateway = useMemo(() => createE08Gateway(), []);
  const activeGateway = gateway ?? localGateway;

  const progressRef = useRef(progress);
  const incomingProgress = useRef(progress);
  if (progress !== incomingProgress.current) {
    incomingProgress.current = progress;
    progressRef.current = progress;
  }
  const activeRequest = useRef<string | null>(null);

  const savedH = progress.drafts.E08?.h ?? '';
  const savedK = progress.drafts.E08?.k ?? '';
  const [hText, setHText] = useState(savedH);
  const [kText, setKText] = useState(savedK);
  const committed = useRef<FieldText>({ h: savedH, k: savedK });
  const [history, setHistory] = useState<readonly FieldText[]>([]);
  const [maxHint, setMaxHint] = useState<HintLevel>(progress.drafts.E08?.maxHint ?? 0);
  const [openHint, setOpenHint] = useState<1 | 2 | 3 | null>(null);
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<ValidationOutcome | null>(null);
  const [error, setError] = useState<TechnicalError | null>(null);
  const [invalidFields, setInvalidFields] = useState<readonly FieldId[]>([]);
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(
    () => () => {
      activeRequest.current = null;
    },
    [],
  );

  function persist(next: ProgressV1): PersistenceState {
    progressRef.current = next;
    const result = onSave(next);
    setNotice(result.status === 'saved' ? null : (result.message ?? 'No se pudo guardar el progreso.'));
    return result;
  }

  /** Confirma el texto actual como borrador; solo persiste si cambió. */
  function commit(nextH: string, nextK: string) {
    const previous = committed.current;
    if (previous.h === nextH && previous.k === nextK) return;
    committed.current = { h: nextH, k: nextK };
    setHistory(list => [...list, previous]);
    persist(
      withE08Draft(
        progressRef.current,
        normalizeNumberInput(nextH),
        normalizeNumberInput(nextK),
        nowIso(),
      ),
    );
  }

  function edit(field: FieldId, value: string) {
    if (pending) return;
    if (field === 'h') setHText(value);
    else setKText(value);
    setOutcome(null);
    setError(null);
    setInvalidFields([]);
  }

  function undo() {
    if (pending) return;
    const previous = history.at(-1);
    if (previous === undefined) return;
    setHistory(history.slice(0, -1));
    setHText(previous.h);
    setKText(previous.k);
    committed.current = previous;
    setOutcome(null);
    setError(null);
    setInvalidFields([]);
    persist(
      withE08Draft(
        progressRef.current,
        normalizeNumberInput(previous.h),
        normalizeNumberInput(previous.k),
        nowIso(),
      ),
    );
  }

  function reset() {
    setResetConfirmationOpen(false);
    setHistory([]);
    setHText('');
    setKText('');
    committed.current = { h: '', k: '' };
    setOutcome(null);
    setError(null);
    setInvalidFields([]);
    setOpenHint(null);
    persist(withE08Draft(progressRef.current, null, null, nowIso()));
  }

  function retry() {
    setOutcome(null);
    setError(null);
    setInvalidFields([]);
  }

  async function handleTry() {
    if (pending) return;
    commit(hText, kText);

    const h = normalizeNumberInput(hText);
    const k = normalizeNumberInput(kText);
    const client = validateE08(h, k);
    if (client.status === 'incomplete') {
      setOutcome(null);
      setInvalidFields(client.fields.filter(isFieldId));
      setError({
        category: 'incomplete',
        code: 'E08_FIELDS_REQUIRED',
        message: 'Completa h y k con valores numéricos exactos antes de probar.',
      });
      return;
    }

    setInvalidFields([]);
    const request = buildE08Request(h, k, globalThis.crypto.randomUUID());
    if (!request) return;

    setOutcome(null);
    setError(null);
    setPending(true);
    activeRequest.current = request.requestId;
    try {
      const response = await activeGateway.validate(request);
      if (activeRequest.current !== request.requestId) return;
      activeRequest.current = null;
      const next = applyE08Outcome(progressRef.current, response, nowIso());
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
    if (pending || !canOpenE08Hint(maxHint, hint)) return;
    commit(hText, kText);
    setOpenHint(hint);
    if (hint > maxHint) {
      setMaxHint(raiseE08Hint(maxHint, hint));
      persist(withE08Hint(progressRef.current, hint, nowIso()));
    }
  }

  const message = outcome ? e08Diagnosis(outcome.feedbackCode) : undefined;
  const hValue = normalizeNumberInput(hText);
  const kValue = normalizeNumberInput(kText);
  const hasChanges =
    history.length > 0 || hText !== committed.current.h || kText !== committed.current.k;

  return (
    <main id="app" aria-labelledby="e08-title">
      <Button onClick={onBackToFlow}>Volver al recorrido</Button>
      <ExerciseScreen
        title={e08Definition.title}
        titleId="e08-title"
        zone={`${e08Definition.zone} — ${e08Definition.zoneName}`}
        objective={e08Definition.objective}
        statement={e08Definition.statement}
        visual={<VertexGraph h={hValue} k={kValue} />}
        pending={pending}
        canUndo={history.length > 0}
        hasChanges={hasChanges}
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
              hints={e08Hints}
              onHint={openHelp}
              onClose={() => setOpenHint(null)}
              disabled={pending}
            />
          </div>
        }
      >
        <div className="e08-fields">
          <p id="e08-fields-help">
            Acepta coma o punto decimal. La comparación es exacta; no se redondea. a permanece
            fijo en 1.
          </p>
          <p>
            <label htmlFor="e08-h">h — coordenada horizontal del vértice</label>
          </p>
          <p>
            <input
              id="e08-h"
              name="e08-h"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={hText}
              disabled={pending}
              aria-invalid={invalidFields.includes('h')}
              aria-describedby="e08-fields-help"
              onBlur={() => commit(hText, kText)}
              onChange={event => edit('h', event.target.value)}
            />
          </p>
          <p>
            <label htmlFor="e08-k">k — coordenada vertical del vértice</label>
          </p>
          <p>
            <input
              id="e08-k"
              name="e08-k"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={kText}
              disabled={pending}
              aria-invalid={invalidFields.includes('k')}
              aria-describedby="e08-fields-help"
              onBlur={() => commit(hText, kText)}
              onChange={event => edit('k', event.target.value)}
            />
          </p>
        </div>
      </ExerciseScreen>
      <StatusRegion>{notice ?? ''}</StatusRegion>
    </main>
  );
}
