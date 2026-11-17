import type { ExactNumber } from '../../../shared/validation';

/**
 * Gramática decimal aceptada por los campos de E08. Se admite coma o punto
 * como separador; no se aceptan exponentes, signo `+` inicial, separador de
 * miles ni fracciones.
 */
const decimalInputPattern = /^-?(0|[1-9][0-9]*)(?:[.,][0-9]+)?$/;

/**
 * Normaliza una entrada decimal a la gramática `exactNumber` de 001: punto
 * decimal, sin exponente, sin `+` inicial, sin separador de miles y sin
 * redondeo. `null` significa campo vacío o no parseable; la pantalla lo trata
 * como `incomplete` y no lo envía.
 */
export function normalizeNumberInput(raw: string): ExactNumber | null {
  const text = raw.trim();
  if (!decimalInputPattern.test(text)) return null;

  const [whole = '', fraction] = text.replace(',', '.').split('.');
  if (fraction === undefined) return whole === '-0' ? '0' : whole;

  const significant = fraction.replace(/0+$/, '');
  if (significant === '') return whole === '-0' ? '0' : whole;
  return `${whole}.${significant}`;
}
