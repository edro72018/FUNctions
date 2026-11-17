import { numberPatterns } from '../contracts/answers';
import { fullMatch } from '../contracts/validate';
import { fail } from '../errors/errors';

export interface Rational { numerator: bigint; denominator: bigint }
function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
export function parseRational(value: string): Rational {
  if (!numberPatterns.some((pattern) => fullMatch(pattern, value))) fail('NUMBER_GRAMMAR_INVALID');
  let numerator: bigint;
  let denominator = 1n;
  if (value.includes('/')) {
    const [n, d] = value.split('/');
    numerator = BigInt(n!); denominator = BigInt(d!);
  } else if (value.includes('.')) {
    const [whole, fraction] = value.split('.');
    denominator = 10n ** BigInt(fraction!.length);
    numerator = BigInt(whole! + fraction!);
  } else numerator = BigInt(value);
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}
export function serializeRational(value: Rational): string {
  return value.denominator === 1n ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
}
export function canonicalNumber(value: string): string { return serializeRational(parseRational(value)); }
export function compareNumbers(a: string, b: string): number {
  const x = parseRational(a); const y = parseRational(b);
  const difference = x.numerator * y.denominator - y.numerator * x.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}
