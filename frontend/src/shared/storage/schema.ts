import Ajv2020 from 'ajv/dist/2020';
import schema from '../../../../specs/002-primer-recorrido/contracts/progress.schema.json';
import type { ProgressV1 } from './progress';
const ajv = new Ajv2020({ strict: true, allErrors: true });
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
ajv.addFormat('date-time', (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:[Zz]|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute, second, offsetHour = '0', offsetMinute = '0'] = match;
  const days = new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
  return Number(month) >= 1 && Number(month) <= 12 && Number(day) >= 1 && Number(day) <= days && Number(hour) < 24 && Number(minute) < 60 && Number(second) < 60 && Number(offsetHour) < 24 && Number(offsetMinute) < 60;
});
export const validateProgress = ajv.compile<ProgressV1>(schema);
export type ParsedProgress = { status: 'available'; progress: ProgressV1 } | { status: 'corrupt' | 'unknown-version'; progress: null; reason: 'json' | 'schema' | 'version' };
export function parseProgress(raw: string): ParsedProgress {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return { status: 'corrupt', progress: null, reason: 'json' }; }
  if (value && typeof value === 'object' && 'schemaVersion' in value && value.schemaVersion !== 1) return { status: 'unknown-version', progress: null, reason: 'version' };
  return validateProgress(value) ? { status: 'available', progress: value } : { status: 'corrupt', progress: null, reason: 'schema' };
}
