import type { AppScreen } from '../../app/navigation';

export type IndexActionId = 'start' | 'continue' | 'instructions' | 'about' | 'how-to-play';

export interface IndexAction {
  readonly id: IndexActionId;
  readonly label: string;
  readonly description: string;
  /** Destino conocido; Continuar decide su pantalla según el progreso guardado. */
  readonly destination: AppScreen | null;
  readonly enabled: boolean;
  readonly unavailableMessage: string | null;
}

export interface IndexActionOverride {
  readonly enabled: boolean;
  readonly unavailableMessage?: string;
}

export interface IndexActionsInput {
  readonly hasReadableProgress: boolean;
  readonly overrides?: Partial<Record<IndexActionId, IndexActionOverride>>;
}

export const defaultUnavailableMessage = 'Disponible en una próxima actualización.';

interface ActionDefinition {
  readonly id: IndexActionId;
  readonly label: string;
  readonly description: string;
  readonly destination: AppScreen | null;
  readonly enabledByDefault: boolean;
}

const baseDefinitions: readonly ActionDefinition[] = [
  { id: 'start', label: 'Comenzar', description: 'Inicia una misión nueva desde la introducción.', destination: 'intro', enabledByDefault: true },
  { id: 'instructions', label: 'Instrucciones', description: 'Consulta el objetivo, las reglas y la progresión.', destination: 'instructions', enabledByDefault: false },
  { id: 'about', label: 'Acerca de', description: 'Conoce el propósito del proyecto y su licencia.', destination: 'about', enabledByDefault: false },
  { id: 'how-to-play', label: 'Cómo se Juega', description: 'Aprende a probar, deshacer, reiniciar y pedir ayudas.', destination: 'how-to-play', enabledByDefault: false },
];

const continueDefinition: ActionDefinition = {
  id: 'continue',
  label: 'Continuar',
  description: 'Retoma tu último punto guardado.',
  destination: null,
  enabledByDefault: true,
};

function toAction(definition: ActionDefinition, input: IndexActionsInput): IndexAction {
  const override = input.overrides?.[definition.id];
  const enabled = override?.enabled ?? definition.enabledByDefault;
  return {
    id: definition.id,
    label: definition.label,
    description: definition.description,
    destination: definition.destination,
    enabled,
    unavailableMessage: enabled ? null : (override?.unavailableMessage ?? defaultUnavailableMessage),
  };
}

/**
 * Selector puro del índice. Las cuatro acciones base siempre están presentes;
 * Continuar solo se añade con progreso legible. No modela temporizador, vidas,
 * puntos, insignias ni progreso inexistente.
 */
export function selectIndexActions(input: IndexActionsInput): IndexAction[] {
  const actions: IndexAction[] = [];
  for (const definition of baseDefinitions) {
    actions.push(toAction(definition, input));
    if (definition.id === 'start' && input.hasReadableProgress) actions.push(toAction(continueDefinition, input));
  }
  return actions;
}
