import { Button } from '../../shared/ui/Button';
import { StatusRegion } from '../../shared/ui/StatusRegion';
import type { IndexAction, IndexActionId } from './indexActions';

export interface IndexScreenProps {
  actions: readonly IndexAction[];
  onAction: (id: IndexActionId) => void;
  statusMessage?: string;
}

/** Pantalla inicial: nombre canónico, descripción breve y acciones nativas. */
export function IndexScreen({ actions, onAction, statusMessage }: IndexScreenProps) {
  return (
    <main id="app" aria-labelledby="index-title">
      <h1 id="index-title">FUNctions</h1>
      <p>Explora funciones y resuelve retos matemáticos en un recorrido de práctica.</p>
      <nav aria-label="Acciones principales">
        {actions.map(action => {
          const noteId = `index-action-${action.id}-note`;
          return (
            <div key={action.id}>
              <Button
                id={`index-action-${action.id}`}
                onClick={() => onAction(action.id)}
                disabled={!action.enabled}
                {...(action.enabled ? {} : { 'aria-describedby': noteId })}
              >
                {action.label}
              </Button>
              <p id={noteId}>{action.enabled ? action.description : action.unavailableMessage}</p>
            </div>
          );
        })}
      </nav>
      <StatusRegion>{statusMessage ?? ''}</StatusRegion>
    </main>
  );
}
