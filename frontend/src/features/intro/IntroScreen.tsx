import { content, pendingContentMessage, type IntroEntry } from '../../app/content';
import { Button } from '../../shared/ui/Button';

export interface IntroScreenProps {
  entry?: IntroEntry;
  onContinue: () => void;
}

/**
 * Introducción breve real y mínima. Con contenido pendiente muestra un aviso
 * explícito; su única acción de avance conduce al recorrido de prueba.
 */
export function IntroScreen({ entry = content.intro, onContinue }: IntroScreenProps) {
  return (
    <main id="app" aria-labelledby="intro-title">
      <h1 id="intro-title">Introducción</h1>
      {entry.approvalStatus === 'approved' ? (
        <p>{entry.fields.text}</p>
      ) : (
        <section aria-label="Contenido pendiente">
          <p><strong>{pendingContentMessage}</strong></p>
          <p>La introducción aprobada se mostrará aquí cuando esté disponible.</p>
        </section>
      )}
      <Button onClick={onContinue}>Comenzar el recorrido</Button>
    </main>
  );
}
