"""Construcción de resultados matemáticos, separada de los errores."""
from ..contracts.types import Mechanism, ResultStatus, ValidationResult
from ..contracts.validate import validate_result


def make_result(status: ResultStatus, feedback_code: str, origin: Mechanism | None = None) -> ValidationResult:
    result = {"status": status, "feedbackCode": feedback_code}
    if origin is not None:
        result["origin"] = origin.value
    return validate_result(result)
