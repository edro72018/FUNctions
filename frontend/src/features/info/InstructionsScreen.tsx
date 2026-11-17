import { Button } from '../../shared/ui/Button';
import { instructionSections } from './instructions';
import type { InfoSection } from './sections';

export interface InstructionsScreenProps {
  sections?: readonly InfoSection[];
  onBackToIndex: () => void;
}

/** Instrucciones: reglas normativas del juego y regreso al índice en una acción. */
export function InstructionsScreen({ sections = instructionSections, onBackToIndex }: InstructionsScreenProps) {
  return (
    <main id="app" aria-labelledby="instructions-title">
      <h1 id="instructions-title">Instrucciones</h1>
      <p>Estas reglas explican qué es FUNctions y cuándo se considera completado el juego.</p>
      {sections.map(section => (
        <section key={section.id} aria-labelledby={`instructions-${section.id}`}>
          <h2 id={`instructions-${section.id}`}>{section.title}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.items === undefined ? null : (
            <ul>
              {section.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}
      <Button onClick={onBackToIndex}>Volver al índice</Button>
    </main>
  );
}
