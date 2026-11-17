import type { HintLevel } from '../../../shared/storage/progress';

export type E08FeedbackCode =
  | 'E08_VERTEX_CONFIRMED'
  | 'E08_VERTEX_SIGN'
  | 'E08_VERTEX_MISMATCH';

export interface E08Definition {
  readonly exerciseId: 'E08';
  readonly zone: 3;
  readonly zoneName: string;
  readonly title: string;
  readonly objective: string;
  readonly statement: string;
  readonly answerKind: 'vertex';
  readonly requiredFields: readonly ['h', 'k'];
  /** `a = 1` es una restricción fija y no forma parte de la respuesta `vertex`. */
  readonly fixed: { readonly a: 1 };
  readonly expected: { readonly h: '3'; readonly k: '2' };
  readonly targetPoint: { readonly x: 3; readonly y: 2 };
  readonly correctFeedback: 'E08_VERTEX_CONFIRMED';
  readonly signFeedback: 'E08_VERTEX_SIGN';
  readonly mismatchFeedback: 'E08_VERTEX_MISMATCH';
  readonly hints: readonly [string, string, string];
}

/**
 * Ayudas H1–H3 de E08. H3 explica la correspondencia del vértice, pero nunca
 * rellena los campos ni envía la respuesta.
 */
export const e08Hints = [
  'H1 · Contrasta el vértice actual con el objetivo: observa dónde está el punto más bajo de la parábola y dónde debería estar (3, 2).',
  'H2 · Relaciona cada control con una coordenada: el control h desplaza la parábola en horizontal y el control k en vertical.',
  'H3 · El vértice de f(x) = (x − h)² + k es (h, k). Sustituye el punto objetivo (3, 2) en esa correspondencia para decidir qué valor corresponde a cada control.',
] as const satisfies readonly [string, string, string];

/**
 * Ficha fija de E08. La comparación es exacta y no hay tolerancia: el redondeo
 * es solo visual. `a = 1` no se serializa en la respuesta.
 */
export const e08Definition = {
  exerciseId: 'E08',
  zone: 3,
  zoneName: 'Sintonizador de Trayectorias',
  title: 'Foco del Vértice',
  objective:
    'Construir f(x) = (x − h)² + k desde su vértice, con a = 1 fijo.',
  statement:
    'Construye la trayectoria f(x) = (x − h)² + k, con dominio real, para que su vértice sea (3,2). Ajusta h y k; a permanece fijo en 1.',
  answerKind: 'vertex',
  requiredFields: ['h', 'k'],
  fixed: { a: 1 },
  expected: { h: '3', k: '2' },
  targetPoint: { x: 3, y: 2 },
  correctFeedback: 'E08_VERTEX_CONFIRMED',
  signFeedback: 'E08_VERTEX_SIGN',
  mismatchFeedback: 'E08_VERTEX_MISMATCH',
  hints: e08Hints,
} as const satisfies E08Definition;

/** Diagnóstico localizado por código; un código desconocido no inventa uno. */
export function e08Diagnosis(feedbackCode: string): string {
  if (feedbackCode === e08Definition.correctFeedback) {
    return 'El vértice es (3, 2) con a = 1; ambos parámetros son exactos.';
  }
  if (feedbackCode === e08Definition.signFeedback) {
    return 'Atención con el signo: en la fórmula es (x − h), por lo que (x − 3) significa h = +3.';
  }
  if (feedbackCode === e08Definition.mismatchFeedback) {
    return 'El vértice o los parámetros no coinciden con (3, 2); la comparación es exacta y no se redondea.';
  }
  return 'El verificador devolvió un resultado sin diagnóstico localizado.';
}

/** H1 está disponible desde el inicio; H2 requiere H1 y H3 requiere H2. */
export function canOpenE08Hint(maxHint: HintLevel, hint: 1 | 2 | 3): boolean {
  return hint <= maxHint + 1;
}

/** Mayor ayuda consultada, sin disminuir nunca. */
export function raiseE08Hint(maxHint: HintLevel, hint: 1 | 2 | 3): HintLevel {
  return Math.max(maxHint, hint) as HintLevel;
}
