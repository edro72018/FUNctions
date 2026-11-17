import { validateError, validateResult } from '../validation';
import type { Mechanism, ValidationError, ValidationRequest, ValidationResult } from '../validation';
export type TechnicalError = ValidationError;
export interface ValidationOutcome extends ValidationResult { requestId: string; exerciseId: string; origin: Mechanism; receivedAt: string }
/** Estado de entrada del cliente: no es resultado matemático y nunca se envía a la API. */
export interface ClientIncomplete { status: 'incomplete'; fields: readonly string[] }
export type GatewayResponse = ValidationOutcome | TechnicalError;
export interface ValidationGateway { validate(request: ValidationRequest): Promise<GatewayResponse> }
export const technicalError = (category: TechnicalError['category'], message: string): TechnicalError => ({ category, code: 'GATEWAY_ERROR', message });
export function decodeResponse(value: unknown, request: ValidationRequest, origin: Mechanism): GatewayResponse {
  try {
    if (value !== null && typeof value === 'object' && 'category' in value) return validateError(value);
    const result = validateResult(value);
    if (result.origin !== undefined && result.origin !== origin) return technicalError('service', 'El origen no coincide con el mecanismo de validación.');
    return { ...result, origin, requestId: request.requestId, exerciseId: request.exerciseId, receivedAt: new Date().toISOString() };
  } catch { return technicalError('service', 'Respuesta de validación inválida.'); }
}
/** incomplete nunca es un resultado; los errores e indeterminate no crean intentos. */
export function isEvaluatedOutcome(response: GatewayResponse): response is ValidationOutcome & { status: 'correct' | 'incorrect' } {
  return 'status' in response && (response.status === 'correct' || response.status === 'incorrect');
}
export interface RequestCorrelation { requestId: string; exerciseId: string; generation: number }
/** Filtro puro: el dueño de 003 suministra la generación y solicitud vigentes. */
export function acceptCurrentResponse(response: GatewayResponse, sent: RequestCorrelation, current: RequestCorrelation | null): GatewayResponse | null {
  if (!current || sent.requestId !== current.requestId || sent.exerciseId !== current.exerciseId || sent.generation !== current.generation) return null;
  if ('status' in response && (response.requestId !== sent.requestId || response.exerciseId !== sent.exerciseId)) return null;
  return response;
}
