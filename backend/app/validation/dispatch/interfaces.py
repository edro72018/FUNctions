"""Protocolos inyectables independientes de UI y transporte (REQ-09–REQ-10)."""
from typing import Mapping, Protocol

from ..contracts.types import Mechanism, ValidationRequest, ValidatorRegistration


class Validator(Protocol):
    def __call__(self, request: ValidationRequest) -> object: ...


class Adapter(Protocol):
    def __call__(self, request: ValidationRequest, registration: ValidatorRegistration) -> object: ...


class Registry(Protocol):
    def get(self, exercise_id: str) -> ValidatorRegistration | None: ...


Adapters = Mapping[str, Mapping[Mechanism, Adapter]]
