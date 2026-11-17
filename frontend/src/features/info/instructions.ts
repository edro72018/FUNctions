import type { InfoSection } from './sections';

/**
 * Contenido normativo de Instrucciones (REQ-04). Explica qué es el juego y
 * cuándo se gana; la práctica de las acciones vive en Cómo se Juega.
 */
export const instructionSections = [
  {
    id: 'objective',
    title: 'Objetivo educativo',
    paragraphs: [
      'Comprender cómo se relacionan dos conjuntos mediante una función y reconocer cuándo cada entrada tiene exactamente una salida.',
      'Practicar con diagramas, gráficas y expresiones para construir funciones y justificar tus respuestas.',
    ],
  },
  {
    id: 'rules',
    title: 'Reglas generales',
    paragraphs: [
      'Lee el enunciado y observa la representación del ejercicio antes de responder.',
      'Elige una opción o escribe los valores que faltan; después, pulsa Probar para revisar tu respuesta.',
      'Si la respuesta está incompleta, el juego señala qué falta y no la envía a revisión.',
      'Puedes corregir tu respuesta y volver a probar las veces que necesites.',
      'Tu avance y el borrador del nivel activo se guardan en este dispositivo.',
    ],
  },
  {
    id: 'progression',
    title: 'Progresión por zonas y niveles',
    paragraphs: [
      'El juego se organiza en cinco zonas temáticas y cada zona agrupa tres niveles.',
      'Los niveles se abren en orden: al resolver uno, se habilita el siguiente del recorrido.',
      'Los niveles resueltos quedan disponibles para repasarlos sin perder el avance.',
      'La versión de práctica actual incluye E01 y E08 como recorrido de prueba; completarlo no equivale a completar el juego.',
    ],
  },
  {
    id: 'victory',
    title: 'Condición de victoria: 15/15',
    paragraphs: [
      'La victoria se alcanza al resolver los 15 niveles del juego: tres niveles en cada una de las cinco zonas.',
      'El recorrido de prueba de esta versión muestra el avance real de sus dos niveles y no declara la victoria 15/15.',
    ],
  },
  {
    id: 'retries',
    title: 'Reintentos ilimitados',
    paragraphs: [
      'Los reintentos son ilimitados: puedes intentar cada nivel las veces que necesites.',
      'Un resultado incorrecto no bloquea el nivel: muestra un diagnóstico y habilita Reintentar.',
      'No se exige esperar entre un intento y el siguiente.',
    ],
  },
  {
    id: 'hints',
    title: 'Ayudas H1–H3',
    paragraphs: [
      'Cada ejercicio ofrece tres ayudas ordenadas. H1 está disponible desde el inicio.',
      'H2 se habilita después de consultar H1, y H3 después de consultar H2.',
      'H3 explica el concepto, pero no rellena ni envía la respuesta por ti.',
      'Consultar ayudas no reduce tu avance.',
    ],
  },
] as const satisfies readonly InfoSection[];
