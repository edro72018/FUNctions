import { aboutEntry, pendingContentMessage } from './about';
import type { AboutEntry } from './about';
import { Button } from '../../shared/ui/Button';

export interface AboutScreenProps {
  entry?: AboutEntry;
  onBackToIndex: () => void;
}

/** Acerca de: solo contenido aprobado o un aviso explícito de contenido pendiente. */
export function AboutScreen({ entry = aboutEntry, onBackToIndex }: AboutScreenProps) {
  return (
    <main id="app" aria-labelledby="about-title">
      <h1 id="about-title">Acerca de</h1>
      {entry.approvalStatus === 'approved' ? (
        <dl>
          <dt>Nombre</dt>
          <dd>{entry.fields.name}</dd>
          <dt>Propósito</dt>
          <dd>{entry.fields.purpose}</dd>
          <dt>Equipo</dt>
          <dd>
            <ul>
              {entry.fields.team.map(member => <li key={member}>{member}</li>)}
            </ul>
          </dd>
          <dt>Autoría</dt>
          <dd>{entry.fields.authorship}</dd>
          <dt>Licencia</dt>
          <dd>{entry.fields.license}</dd>
        </dl>
      ) : (
        <section aria-label="Contenido pendiente">
          <p><strong>{pendingContentMessage}</strong></p>
          <p>La información de esta sección se publicará cuando haya sido revisada y aprobada.</p>
        </section>
      )}
      <Button onClick={onBackToIndex}>Volver al índice</Button>
    </main>
  );
}
