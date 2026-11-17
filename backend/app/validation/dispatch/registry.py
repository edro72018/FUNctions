"""Registro explícito, vacío y sin asociaciones por defecto."""
from dataclasses import replace

from ..contracts.answers import ANSWER_KINDS
from ..contracts.types import EXERCISE_PATTERN, ValidatorRegistration
from ..contracts.validate import matches


class ValidatorRegistry:
    def __init__(self) -> None:
        self._entries: dict[str, ValidatorRegistration] = {}

    def register(self, entry: ValidatorRegistration) -> None:
        if (not matches(EXERCISE_PATTERN, entry.exercise_id)
                or entry.exercise_id in self._entries or not entry.allowed_kinds
                or any(kind not in ANSWER_KINDS for kind in entry.allowed_kinds)
                or any(mode not in ("local", "api") for mode in entry.mechanisms)
                or not entry.adapter_id or not entry.validator_id or not entry.contract_version
                or entry.association_status not in ("ratified", "proposed", "pending")
                or any(not field for field in entry.required_fields)
                or len(set(entry.required_fields)) != len(entry.required_fields)):
            raise ValueError("Registro de validador inválido o duplicado.")
        self._entries[entry.exercise_id] = replace(entry, allowed_kinds=tuple(entry.allowed_kinds),
                                                  required_fields=tuple(entry.required_fields),
                                                  mechanisms=tuple(entry.mechanisms))

    def get(self, exercise_id: str) -> ValidatorRegistration | None:
        return self._entries.get(exercise_id)
