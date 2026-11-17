import { content, pendingContentMessage, type AboutEntry } from '../../app/content';

export { pendingContentMessage };
export type { AboutEntry };

/**
 * Fuente única del contenido de Acerca de. Se toma del registro de contenido
 * existente para no duplicar ni contradecir su estado de aprobación.
 */
export const aboutEntry: AboutEntry = content.about;
