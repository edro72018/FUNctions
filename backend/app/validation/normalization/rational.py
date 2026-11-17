"""Racionales exactos, sin tolerancia ni punto flotante (REQ-07)."""
from fractions import Fraction

from ..contracts.answers import NUMBER_PATTERNS
from ..contracts.validate import matches
from ..errors.errors import CoreError


def parse_rational(value: str) -> Fraction:
    if not any(matches(pattern, value) for pattern in NUMBER_PATTERNS):
        raise CoreError("NUMBER_GRAMMAR_INVALID")
    return Fraction(value)


def serialize_rational(value: Fraction) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def canonical_number(value: str) -> str:
    return serialize_rational(parse_rational(value))


def compare_numbers(a: str, b: str) -> int:
    difference = parse_rational(a) - parse_rational(b)
    return (difference > 0) - (difference < 0)
