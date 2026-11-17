export type AppConfig = { validationMechanism: 'local'; apiUrl?: string } | { validationMechanism: 'api'; apiUrl: string };
export class ConfigurationError extends Error {
  constructor() { super('Error de configuración: indique local o api con una URL HTTP válida.'); }
}
export function isApiUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}
/** El consumidor presenta el mensaje del error; nunca elige un mecanismo implícito. */
export function readConfig(input: { validationMechanism?: unknown; apiUrl?: unknown }): AppConfig {
  if (input.validationMechanism === 'local') return { validationMechanism: 'local' };
  if (input.validationMechanism === 'api' && isApiUrl(input.apiUrl)) return { validationMechanism: 'api', apiUrl: input.apiUrl };
  throw new ConfigurationError();
}
