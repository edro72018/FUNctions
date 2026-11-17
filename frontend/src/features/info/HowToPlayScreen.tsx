import { Button } from '../../shared/ui/Button';
import { feedbackGuidance, howToPlaySections, inputGuidance } from './howToPlay';
import type { InfoItem, InfoSection } from './sections';

export interface HowToPlayScreenProps {
  sections?: readonly InfoSection[];
  feedback?: readonly InfoItem[];
  inputs?: readonly InfoItem[];
  onBackToIndex: () => void;
}

/** Cómo se Juega: práctica de las acciones, la retroalimentación y los modos de entrada. */
export function HowToPlayScreen({
  sections = howToPlaySections,
  feedback = feedbackGuidance,
  inputs = inputGuidance,
  onBackToIndex,
}: HowToPlayScreenProps) {
  return (
    <main id="app" aria-labelledby="how-to-play-title">
      <h1 id="how-to-play-title">Cómo se Juega</h1>
      <p>Esta guía explica qué hace cada acción y qué significa cada respuesta mientras juegas.</p>
      {sections.map(section => (
        <section key={section.id} aria-labelledby={`how-to-play-${section.id}`}>
          <h2 id={`how-to-play-${section.id}`}>{section.title}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.items === undefined ? null : (
            <ul>
              {section.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}
      <InfoTermList id="how-to-play-feedback" title="Qué significa la retroalimentación" items={feedback} />
      <InfoTermList id="how-to-play-input" title="Cómo usar la interfaz" items={inputs} />
      <Button onClick={onBackToIndex}>Volver al índice</Button>
    </main>
  );
}

function InfoTermList({ id, title, items }: { id: string; title: string; items: readonly InfoItem[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <dl>
        {items.map(item => (
          <div key={item.term}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
