"""Catálogo manual de error-codes.yaml y normalization.yaml."""
from ..contracts.types import ErrorCategory, ValidationError

CATEGORIES: dict[str, ErrorCategory] = {
    "INVALID_REQUEST": "format", "INVALID_ANSWER": "format",
    "NUMBER_GRAMMAR_INVALID": "format", "EXPRESSION_TOKEN_INVALID": "format",
    "INTERVAL_INVALID": "format", "MISSING_ANSWER_FIELD": "incomplete",
    "MISSING_COMPOSITE_FIELD": "incomplete", "EXTRA_COMPOSITE_FIELD": "format",
    "EXERCISE_NOT_REGISTERED": "unsupported", "TYPE_NOT_ALLOWED": "unsupported",
    "MECHANISM_NOT_CONFIGURED": "configuration", "GRAMMAR_NOT_APPROVED": "configuration",
    "NORMALIZATION_NOT_APPROVED": "configuration", "TRANSPORT_ERROR": "transport",
    "SERVICE_UNAVAILABLE": "service", "VALIDATOR_ERROR": "service",
}


def make_error(code: str) -> ValidationError:
    return {"category": CATEGORIES[code], "code": code, "message": f"Validación detenida: {code}."}


class CoreError(ValueError):
    def __init__(self, code: str) -> None:
        self.detail = make_error(code)
        super().__init__(self.detail["message"])
