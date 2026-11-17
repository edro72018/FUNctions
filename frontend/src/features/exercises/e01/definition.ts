import { e01Hints } from './hints';

export type E01FeedbackCode = 'E01_FUNCTION_CONFIRMED' | 'E01_SHARED_IMAGE_VALID';

export interface E01Option {
  readonly value: boolean;
  readonly label: string;
}

export interface E01Definition {
  readonly exerciseId: 'E01';
  readonly zone: 1;
  readonly zoneName: string;
  readonly title: string;
  readonly objective: string;
  readonly statement: string;
  readonly answerKind: 'boolean';
  readonly requiredFields: readonly ['selection'];
  readonly options: readonly [E01Option, E01Option];
  readonly expected: true;
  readonly correctFeedback: 'E01_FUNCTION_CONFIRMED';
  readonly incorrectFeedback: 'E01_SHARED_IMAGE_VALID';
  readonly diagram: {
    readonly A: readonly [1, 2, 3];
    readonly B: readonly [4, 5];
    readonly R: readonly [
      readonly [1, 4],
      readonly [2, 4],
      readonly [3, 5],
    ];
  };
  readonly hints: readonly [string, string, string];
}

/**
 * Ficha fija de E01. Compartir la salida 4 no viola la unicidad: lo prohibido
 * es que una misma entrada tenga dos imágenes.
 */
export const e01Definition = {
  exerciseId: 'E01',
  zone: 1,
  zoneName: 'Máquina de Enlaces',
  title: 'El Conector de Energía',
  objective:
    'Reconocer la existencia y la unicidad en una relación discreta: cada entrada tiene exactamente una imagen.',
  statement:
    'A = {1,2,3}, B = {4,5} y R = {(1,4), (2,4), (3,5)}. ¿La corriente fluirá de forma válida? ¿Es una función formal?',
  answerKind: 'boolean',
  requiredFields: ['selection'],
  options: [
    { value: true, label: 'Es función' },
    { value: false, label: 'No es función' },
  ],
  expected: true,
  correctFeedback: 'E01_FUNCTION_CONFIRMED',
  incorrectFeedback: 'E01_SHARED_IMAGE_VALID',
  diagram: {
    A: [1, 2, 3],
    B: [4, 5],
    R: [
      [1, 4],
      [2, 4],
      [3, 5],
    ],
  },
  hints: e01Hints,
} as const satisfies E01Definition;

/** Diagnóstico localizado por código; un código desconocido no inventa uno. */
export function e01Diagnosis(feedbackCode: string): string {
  if (feedbackCode === e01Definition.correctFeedback) {
    return 'Cada entrada tiene una única imagen; compartir la salida 4 es válido.';
  }
  if (feedbackCode === e01Definition.incorrectFeedback) {
    return 'Varios cables pueden llegar al mismo nodo de salida; lo prohibido es que de una sola entrada salgan dos cables.';
  }
  return 'El verificador devolvió un resultado sin diagnóstico localizado.';
}
