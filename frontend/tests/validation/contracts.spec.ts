import { describe, expect, it } from 'vitest';
import fixtures from '../../../tests/contract/validation/fixtures/contracts.json';
import examples from '../../../specs/001-nucleo-validacion/contracts/examples/answer.types.valid.json';
import { validateAnswer, validateRequest, validateResult, validateError } from '../../src/shared/validation/contracts/validate';
import { schemas } from './helpers';

describe('REQ-01–04 / AC-01–04: espejos contra los cuatro esquemas', () => {
  it('mantiene los diez ejemplos canónicos', () => {
    expect(fixtures.validAnswers).toEqual(examples);
    expect(new Set(fixtures.validAnswers.map((a) => a.kind)).size).toBe(10);
  });
  it.each(fixtures.validAnswers)('acepta $kind', (answer) => {
    expect(schemas.answer(answer)).toBe(true);
    expect(validateAnswer(answer)).toEqual(answer);
  });
  it.each(fixtures.invalidAnswers)('rechaza respuesta inválida %#', (answer) => {
    expect(schemas.answer(answer)).toBe(false);
    expect(() => validateAnswer(answer)).toThrow();
  });
  it('conserva UUID y Ejercicio y rechaza sobre inválido', () => {
    expect(schemas.request(fixtures.request)).toBe(true);
    expect(validateRequest(fixtures.request)).toEqual(fixtures.request);
    for (const request of [
      { ...fixtures.request, requestId: 'no-uuid' },
      { ...fixtures.request, exerciseId: 'E16' },
      { ...fixtures.request, mechanism: 'auto' },
      { ...fixtures.request, extra: true },
      { exerciseId: 'E01', answer: fixtures.request.answer },
    ]) {
      expect(schemas.request(request)).toBe(false);
      expect(() => validateRequest(request)).toThrow();
    }
  });
  it.each(fixtures.results)('acepta resultado $status', (result) => {
    expect(schemas.result(result)).toBe(true);
    expect(validateResult(result)).toEqual(result);
  });
  it.each(fixtures.invalidResults)('rechaza resultado inválido %#', (result) => {
    expect(schemas.result(result)).toBe(false);
    expect(() => validateResult(result)).toThrow();
  });
  it('valida errores separados y rechaza categorías y campos desconocidos', () => {
    expect(schemas.error(fixtures.error)).toBe(true);
    expect(validateError(fixtures.error)).toEqual(fixtures.error);
    for (const error of [{ ...fixtures.error, category: 'incorrect' }, { ...fixtures.error, status: 'incorrect' }, { ...fixtures.error, message: '' }]) {
      expect(schemas.error(error)).toBe(false);
      expect(() => validateError(error)).toThrow();
    }
  });
});
