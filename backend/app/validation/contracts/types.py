"""Contratos comunes; nombres JSON conservados para paridad (REQ-03–REQ-06)."""
from dataclasses import dataclass
from enum import StrEnum
from typing import Literal, NotRequired, TypedDict

from .answers import Answer, AnswerKind


class Mechanism(StrEnum):
    LOCAL = "local"
    API = "api"


ResultStatus = Literal["correct", "incorrect", "indeterminate"]
ErrorCategory = Literal["format", "incomplete", "unsupported", "configuration", "transport", "service"]


class ValidationRequest(TypedDict):
    requestId: str
    exerciseId: str
    answer: Answer
    mechanism: NotRequired[Literal["local", "api"]]


class ValidationResult(TypedDict):
    status: ResultStatus
    feedbackCode: str
    origin: NotRequired[Literal["local", "api"]]


class ValidationError(TypedDict):
    category: ErrorCategory
    code: str
    message: str


@dataclass(frozen=True)
class ValidatorRegistration:
    exercise_id: str
    allowed_kinds: tuple[AnswerKind, ...]
    required_fields: tuple[str, ...]
    mechanisms: tuple[Mechanism, ...]
    adapter_id: str
    validator_id: str
    contract_version: str
    association_status: Literal["ratified", "proposed", "pending"]


EXERCISE_PATTERN = r"^E(0[1-9]|1[0-5])$"
CODE_PATTERN = r"^[A-Z][A-Z0-9_]*$"
UUID_PATTERN = r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
