"""Despacho explícito previo a cualquier decisión matemática."""
from ..contracts.types import Mechanism, ValidationError, ValidationRequest, ValidationResult
from ..contracts.validate import validate_error, validate_request, validate_result
from ..errors.errors import CoreError, make_error
from ..normalization.normalize import normalize
from .interfaces import Adapters, Registry


def dispatch(value: object, registry: Registry, adapters: Adapters,
             mechanism: Mechanism | None = None) -> ValidationResult | ValidationError:
    try:
        request = validate_request(value)
        normalized: ValidationRequest = {**request, "answer": normalize(request["answer"])}
        entry = registry.get(request["exerciseId"])
        if entry is None:
            raise CoreError("EXERCISE_NOT_REGISTERED")
        if normalized["answer"]["kind"] not in entry.allowed_kinds:
            raise CoreError("TYPE_NOT_ALLOWED")
        if normalized["answer"]["kind"] == "composite":
            fields = normalized["answer"]["fields"]
            if any(key not in fields for key in entry.required_fields):
                raise CoreError("MISSING_COMPOSITE_FIELD")
            if any(key not in entry.required_fields for key in fields):
                raise CoreError("EXTRA_COMPOSITE_FIELD")
        selected = request.get("mechanism", mechanism)
        if selected is None or selected not in entry.mechanisms:
            raise CoreError("MECHANISM_NOT_CONFIGURED")
        adapter = adapters.get(entry.adapter_id, {}).get(selected)
        if adapter is None:
            raise CoreError("TRANSPORT_ERROR" if selected == "api" else "SERVICE_UNAVAILABLE")
        response = adapter(normalized, entry)
        if isinstance(response, dict) and "category" in response:
            return {**validate_error(response)}
        result = validate_result(response)
        return {**result, "origin": selected}
    except CoreError as error:
        return error.detail
    except Exception:
        return make_error("VALIDATOR_ERROR")
