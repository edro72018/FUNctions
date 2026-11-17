import { isApiUrl } from '../../app/config';
import { validateRequest } from '../validation';
import { decodeResponse, technicalError, type ValidationGateway } from './types';
export type Transport = (url: string, init: RequestInit) => Promise<Response>;
export function createApiGateway(url: string | undefined, transport: Transport = fetch, timeoutMs = 10_000): ValidationGateway {
  return { async validate(request) {
    if (!isApiUrl(url) || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return technicalError('configuration', 'Error de configuración de la API.');
    if (request.mechanism !== undefined && request.mechanism !== 'api') return technicalError('configuration', 'El mecanismo no coincide con el gateway API.');
    try { validateRequest(request); } catch { return technicalError('format', 'Solicitud de validación inválida.'); }
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const response = await Promise.race([
        transport(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...request, mechanism: 'api' }), signal: controller.signal }),
        new Promise<never>((_resolve, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, timeoutMs); }),
      ]);
      if (!response.ok) return technicalError('service', 'El servicio de validación no está disponible.');
      let body: unknown;
      try { body = await response.json(); } catch { return technicalError('service', 'Respuesta de validación inválida.'); }
      return decodeResponse(body, request, 'api');
    } catch { return technicalError('transport', 'No se pudo conectar con el servicio de validación.'); }
    finally { if (timer !== undefined) clearTimeout(timer); }
  } };
}
