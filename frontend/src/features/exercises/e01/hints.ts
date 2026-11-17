import type { HintLevel } from '../../../shared/storage/progress';

/**
 * Ayudas H1–H3 de E01. Son texto de apoyo: H3 explica la definición formal y
 * nunca rellena ni envía la respuesta.
 */
export const e01Hints = [
  'H1 · Revisa las entradas una por una: 1, 2 y 3. Comprueba si cada una tiene su cable hacia el conjunto B.',
  'H2 · Hazte dos preguntas: 1) ¿Alguna entrada se quedó sin cable? 2) ¿Alguna entrada sacó más de un cable?',
  'H3 · Definición formal: f: A → B es función si ∀x ∈ A, ∃! y ∈ B tal que y = f(x).',
] as const satisfies readonly [string, string, string];

/** H1 está disponible desde el inicio; H2 requiere H1 y H3 requiere H2. */
export function canOpenE01Hint(maxHint: HintLevel, hint: 1 | 2 | 3): boolean {
  return hint <= maxHint + 1;
}

/** Mayor ayuda consultada, sin disminuir nunca. */
export function raiseE01Hint(maxHint: HintLevel, hint: 1 | 2 | 3): HintLevel {
  return Math.max(maxHint, hint) as HintLevel;
}
