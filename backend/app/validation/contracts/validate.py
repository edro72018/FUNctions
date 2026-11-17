"""Validación manual; jsonschema solo es un oráculo de desarrollo."""
import re
from typing import cast

from .answers import ANSWER_KINDS, NUMBER_PATTERNS, Answer
from .types import (CODE_PATTERN, EXERCISE_PATTERN, UUID_PATTERN,
                    ValidationError, ValidationRequest, ValidationResult)
from ..errors.errors import CoreError


def matches(pattern: str, value: object) -> bool:
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def shape(value: object, required: tuple[str, ...], optional: tuple[str, ...] = (),
          code: str = "INVALID_ANSWER", missing: str | None = None) -> dict:
    if not isinstance(value, dict) or any(not isinstance(k, str) for k in value):
        raise CoreError(code)
    if any(key not in value for key in required):
        raise CoreError(missing or code)
    if any(key not in required + optional for key in value):
        raise CoreError(code)
    return value


def numeric(value: object) -> None:
    if not any(matches(pattern, value) for pattern in NUMBER_PATTERNS):
        raise CoreError("NUMBER_GRAMMAR_INVALID")


def array(value: object) -> list:
    if not isinstance(value, list):
        raise CoreError("INVALID_ANSWER")
    return value


def validate_answer(value: object) -> Answer:
    if not isinstance(value, dict) or value.get("kind") not in ANSWER_KINDS:
        raise CoreError("INVALID_ANSWER")
    fields = {
        "number": ("value",), "expression": ("tokens",), "finiteSet": ("values",),
        "intervalUnion": ("intervals",), "mapping": ("pairs",), "boolean": ("value",),
        "vertex": ("h", "k"), "point": ("x", "y"),
        "asymptote": ("orientation", "value"), "composite": ("fields",),
    }
    kind = value["kind"]
    shape(value, ("kind",) + fields[kind], missing="MISSING_ANSWER_FIELD")
    if kind == "number":
        numeric(value["value"])
    elif kind == "boolean":
        if type(value["value"]) is not bool:
            raise CoreError("INVALID_ANSWER")
    elif kind in ("vertex", "point"):
        for key in fields[kind]:
            numeric(value[key])
    elif kind == "asymptote":
        if value["orientation"] not in ("horizontal", "vertical"):
            raise CoreError("INVALID_ANSWER")
        numeric(value["value"])
    elif kind == "expression":
        tokens = array(value["tokens"])
        if not tokens or any(not matches(r"(0|[1-9][0-9]*|x|\+|-|\(|\))", token) for token in tokens):
            raise CoreError("EXPRESSION_TOKEN_INVALID")
    elif kind == "finiteSet":
        for number in array(value["values"]):
            numeric(number)
    elif kind == "mapping":
        for pair in array(value["pairs"]):
            if len(array(pair)) != 2:
                raise CoreError("INVALID_ANSWER")
            for number in pair:
                numeric(number)
    elif kind == "intervalUnion":
        for interval in array(value["intervals"]):
            shape(interval, ("lower", "upper"), code="INTERVAL_INVALID")
            for side, infinity in (("lower", "-inf"), ("upper", "+inf")):
                bound = shape(interval[side], ("value", "inclusive"), code="INTERVAL_INVALID")
                if type(bound["inclusive"]) is not bool:
                    raise CoreError("INTERVAL_INVALID")
                if bound["value"] == infinity:
                    if bound["inclusive"]:
                        raise CoreError("INTERVAL_INVALID")
                else:
                    if bound["value"] in ("-inf", "+inf"):
                        raise CoreError("INTERVAL_INVALID")
                    numeric(bound["value"])
    elif kind == "composite":
        components = value["fields"]
        if not isinstance(components, dict) or not components or any(not isinstance(k, str) or not k for k in components):
            raise CoreError("INVALID_ANSWER")
        for component in components.values():
            validate_answer(component)
    return cast(Answer, value)


def validate_request(value: object) -> ValidationRequest:
    data = shape(value, ("requestId", "exerciseId", "answer"), ("mechanism",), "INVALID_REQUEST")
    if not matches(UUID_PATTERN, data["requestId"]) or not matches(EXERCISE_PATTERN, data["exerciseId"]):
        raise CoreError("INVALID_REQUEST")
    if "mechanism" in data and data["mechanism"] not in ("local", "api"):
        raise CoreError("INVALID_REQUEST")
    validate_answer(data["answer"])
    return cast(ValidationRequest, data)


def validate_result(value: object) -> ValidationResult:
    data = shape(value, ("status", "feedbackCode"), ("origin",), "VALIDATOR_ERROR")
    if data["status"] not in ("correct", "incorrect", "indeterminate") or not matches(CODE_PATTERN, data["feedbackCode"]):
        raise CoreError("VALIDATOR_ERROR")
    if "origin" in data and data["origin"] not in ("local", "api"):
        raise CoreError("VALIDATOR_ERROR")
    return cast(ValidationResult, data)


def validate_error(value: object) -> ValidationError:
    data = shape(value, ("category", "code", "message"), code="VALIDATOR_ERROR")
    if data["category"] not in ("format", "incomplete", "unsupported", "configuration", "transport", "service") or not matches(CODE_PATTERN, data["code"]) or not isinstance(data["message"], str) or not data["message"]:
        raise CoreError("VALIDATOR_ERROR")
    return cast(ValidationError, data)
