"""Oráculo de esquemas canónicos y fixtures compartidos."""
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

from app.validation.contracts.types import Mechanism, ValidatorRegistration

ROOT = Path(__file__).resolve().parents[3]
CONTRACTS = ROOT / "specs/001-nucleo-validacion/contracts"
FIXTURES = ROOT / "tests/contract/validation/fixtures"


def fixture(name: str) -> dict:
    return json.loads((FIXTURES / f"{name}.json").read_text())


def schema(name: str) -> Draft202012Validator:
    answer = json.loads((CONTRACTS / "answer.schema.json").read_text())
    value = json.loads((CONTRACTS / f"{name}.schema.json").read_text())
    Draft202012Validator.check_schema(value)
    registry = Registry().with_resource("answer.schema.json", Resource.from_contents(answer))
    return Draft202012Validator(value, registry=registry, format_checker=FormatChecker())


def registration(**overrides: object) -> ValidatorRegistration:
    fields = dict(exercise_id="E01", allowed_kinds=("boolean",), required_fields=(),
                  mechanisms=(Mechanism.LOCAL, Mechanism.API), adapter_id="test",
                  validator_id="test-only", contract_version="0.1.0", association_status="ratified")
    fields.update(overrides)
    return ValidatorRegistration(**fields)
