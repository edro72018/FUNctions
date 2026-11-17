import { describe, expect, it } from 'vitest';
import { readConfig } from '../../src/app/config';

describe('T008–T009 configuración explícita', () => {
  it('acepta local y API con URL HTTP válida', () => {
    expect(readConfig({ validationMechanism: 'local' })).toEqual({ validationMechanism: 'local' });
    expect(readConfig({ validationMechanism: 'api', apiUrl: 'https://example.test/validate' })).toEqual({ validationMechanism: 'api', apiUrl: 'https://example.test/validate' });
  });
  it.each([{}, { validationMechanism: 'other' }, { validationMechanism: 'api' }, { validationMechanism: 'api', apiUrl: 'javascript:bad' }])('no infiere respaldo: %j', (input) => {
    expect(() => readConfig(input)).toThrow(/configuración/i);
  });
});
