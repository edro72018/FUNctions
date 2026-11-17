"""REQ-07 / AC-07: exactitud, determinismo e inmutabilidad."""
from copy import deepcopy
import pytest

from app.validation.normalization.normalize import normalize
from app.validation.normalization.rational import parse_rational, serialize_rational
from .helpers import fixture

DATA = fixture("normalization")


@pytest.mark.parametrize("value, expected", DATA["numbers"])
def test_number(value: str, expected: str) -> None:
    assert serialize_rational(parse_rational(value)) == expected


@pytest.mark.parametrize("value", DATA["invalidNumbers"])
def test_invalid_number(value: str) -> None:
    with pytest.raises(ValueError):
        parse_rational(value)


@pytest.mark.parametrize("case", DATA["answers"])
def test_normalization(case: dict) -> None:
    original = deepcopy(case["input"])
    assert normalize(case["input"]) == case["expected"]
    assert normalize(normalize(case["input"])) == case["expected"]
    assert case["input"] == original


def test_order_and_exactness() -> None:
    with pytest.raises(ValueError):
        normalize({"kind": "intervalUnion", "intervals": [{"lower": {"value": "2", "inclusive": True}, "upper": {"value": "1", "inclusive": True}}]})
    assert normalize({"kind": "vertex", "h": "3.0000000000000001", "k": "2"}) != {"kind": "vertex", "h": "3", "k": "2"}
