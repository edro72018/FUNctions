"""Núcleo común de validación de FUNctions."""
from .contracts.answers import Answer, AnswerKind, Bound, ExactNumber, Interval
from .contracts.types import (ErrorCategory, Mechanism, ResultStatus, ValidationError,
                              ValidationRequest, ValidationResult, ValidatorRegistration)
from .contracts.validate import validate_answer, validate_error, validate_request, validate_result
from .dispatch.adapters import create_api_adapter, create_local_adapter
from .dispatch.dispatcher import dispatch
from .dispatch.interfaces import Adapter, Adapters, Registry, Validator
from .dispatch.registry import ValidatorRegistry
from .errors.errors import CoreError, make_error
from .normalization.normalize import normalize
from .normalization.rational import canonical_number, compare_numbers, parse_rational, serialize_rational
from .result.result import make_result

__all__ = [
    "Answer", "AnswerKind", "Bound", "ExactNumber", "Interval", "ErrorCategory", "Mechanism",
    "ResultStatus", "ValidationError", "ValidationRequest", "ValidationResult", "ValidatorRegistration",
    "validate_answer", "validate_error", "validate_request", "validate_result",
    "create_api_adapter", "create_local_adapter", "dispatch", "Adapter", "Adapters", "Registry",
    "Validator", "ValidatorRegistry", "CoreError", "make_error", "normalize", "canonical_number",
    "compare_numbers", "parse_rational", "serialize_rational", "make_result",
]
