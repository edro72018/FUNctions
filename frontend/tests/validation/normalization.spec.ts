import { describe, expect, it } from 'vitest';
import fixtures from '../../../tests/contract/validation/fixtures/normalization.json';
import { normalize } from '../../src/shared/validation/normalization/normalize';
import { parseRational, serializeRational } from '../../src/shared/validation/normalization/rational';

describe('REQ-07 / AC-07: exactitud y normalización determinista', () => {
  it.each(fixtures.numbers)('normaliza %s a %s', (input, expected) => {
    expect(serializeRational(parseRational(input!))).toBe(expected);
  });
  it.each(fixtures.invalidNumbers)('rechaza %j', (input) => {
    expect(() => parseRational(input)).toThrow();
  });
  it.each(fixtures.answers)('normaliza $input.kind %# sin mutar', ({ input, expected }) => {
    const before = JSON.stringify(input);
    expect(normalize(input)).toEqual(expected);
    expect(normalize(normalize(input))).toEqual(expected);
    expect(JSON.stringify(input)).toBe(before);
  });
  it('rechaza orden inválido y no aplica tolerancia', () => {
    expect(() => normalize({ kind: 'intervalUnion', intervals: [{ lower: { value: '2', inclusive: true }, upper: { value: '1', inclusive: true } }] })).toThrow();
    expect(normalize({ kind: 'vertex', h: '3.0000000000000001', k: '2' })).not.toEqual({ kind: 'vertex', h: '3', k: '2' });
  });
});
