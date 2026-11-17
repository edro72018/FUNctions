import type { InfoItem, InfoSection } from './sections';

/**
 * Contenido práctico de Cómo se Juega (REQ-05). Traduce las reglas de
 * Instrucciones a las acciones que se usan dentro de un ejercicio.
 */
export const howToPlaySections = [
  {
    id: 'actions',
    title: 'Acciones del ejercicio',
    paragraphs: ['Cada ejercicio ofrece las mismas acciones básicas.'],
    items: [
      'Probar: comprueba si tu respuesta está completa y si cumple la condición del ejercicio.',
      'Deshacer: revierte el último cambio confirmado. Si no hay cambios, el botón aparece deshabilitado.',
      'Reiniciar: devuelve el ejercicio a su configuración inicial. Si hay cambios, se pide confirmación antes de reiniciar.',
      'Ayudas H1–H3: muestran una explicación adicional. H1 está disponible desde el inicio; H2 se habilita al consultar H1, y H3 al consultar H2. H3 no rellena ni envía la respuesta.',
    ],
  },
] as const satisfies readonly InfoSection[];

export const feedbackGuidance: readonly InfoItem[] = [
  {
    status: 'incomplete',
    term: 'Incompleto',
    description: 'Falta un campo obligatorio. El juego señala qué falta y no envía la respuesta; corrígela y vuelve a probar.',
  },
  {
    status: 'correct',
    term: 'Correcto',
    description: 'La respuesta cumple la condición. El nivel queda resuelto y aparece la acción Continuar.',
  },
  {
    status: 'incorrect',
    term: 'Incorrecto',
    description: 'La respuesta no cumple la condición. Verás un diagnóstico, conservarás tu respuesta y podrás reintentar.',
  },
  {
    status: 'indeterminate',
    term: 'Indeterminado',
    description: 'El verificador no pudo decidir. No se presenta como incorrecto y puedes reintentar.',
  },
  {
    status: 'technical-error',
    term: 'Error técnico',
    description: 'La revisión no se pudo completar. Tu respuesta se conserva, se informa el fallo y puedes reintentar.',
  },
  {
    term: 'Origen del resultado',
    description: 'Cada resultado indica si la revisión fue local o mediante la API. El origen no se guarda en el progreso.',
  },
];

export const inputGuidance: readonly InfoItem[] = [
  {
    status: 'keyboard',
    term: 'Teclado',
    description: 'Usa Tab o Mayús+Tab para recorrer los controles. Activa botones y opciones con Enter o la barra espaciadora (Espacio).',
  },
  {
    status: 'mouse',
    term: 'Ratón (mouse)',
    description: 'Haz clic en los botones y opciones, y escribe en los campos cuando el ejercicio lo pida.',
  },
  {
    status: 'touch',
    term: 'Pantalla táctil',
    description: 'Toca los botones y opciones con el dedo. Cada control tiene un área de toque amplia y no exige precisión de píxel.',
  },
];
