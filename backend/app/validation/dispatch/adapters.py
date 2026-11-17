"""Adaptadores inyectables; sin HTTP, reintentos ni validadores matemáticos."""
from typing import Mapping

from ..contracts.types import ValidationRequest, ValidatorRegistration
from ..errors.errors import CoreError
from .interfaces import Adapter, Validator


def create_local_adapter(validators: Mapping[str, Validator]) -> Adapter:
    def adapter(request: ValidationRequest, registration: ValidatorRegistration) -> object:
        validator = validators.get(registration.validator_id)
        if validator is None:
            raise CoreError("SERVICE_UNAVAILABLE")
        try:
            return validator(request)
        except CoreError:
            raise
        except Exception:
            raise CoreError("VALIDATOR_ERROR") from None
    return adapter


def create_api_adapter(send: Validator) -> Adapter:
    def adapter(request: ValidationRequest, registration: ValidatorRegistration) -> object:
        try:
            return send(request)
        except CoreError:
            raise
        except Exception:
            raise CoreError("TRANSPORT_ERROR") from None
    return adapter
