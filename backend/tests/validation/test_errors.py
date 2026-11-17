"""US3 / REQ-02,05,08,12 / AC-04,05,11,12: errores fuera del resultado."""
from unittest.mock import Mock
import pytest

from app.validation.contracts.answers import ANSWER_KINDS
from app.validation.dispatch.adapters import create_api_adapter, create_local_adapter
from app.validation.dispatch.dispatcher import dispatch
from app.validation.dispatch.registry import ValidatorRegistry
from app.validation.errors.errors import CATEGORIES, CoreError, make_error
from .helpers import fixture, registration, schema

DATA = fixture("contracts")


@pytest.mark.parametrize("case", fixture("errors")["cases"], ids=lambda case: case["code"])
def test_block_before_adapter(case: dict) -> None:
    registry = ValidatorRegistry()
    registry.register(registration(allowed_kinds=tuple(case.get("allowedKinds", ANSWER_KINDS)),
                                   required_fields=tuple(case.get("requiredFields", [])),
                                   mechanisms=tuple(case.get("mechanisms", ["local", "api"]))))
    local, api = Mock(return_value=DATA["results"][0]), Mock(return_value=DATA["results"][0])
    output = dispatch({**DATA["request"], **case["patch"]}, registry, {"test": {"local": local, "api": api}})
    assert output["category"] == case["category"]
    assert output["code"] == case["code"]
    schema("error").validate(output)
    assert "status" not in output
    local.assert_not_called()
    api.assert_not_called()


def test_complete_composite() -> None:
    registry = ValidatorRegistry()
    registry.register(registration(allowed_kinds=("composite",), required_fields=("a", "b")))
    local = Mock(return_value=DATA["results"][0])
    answer = {"kind": "composite", "fields": {"a": {"kind": "boolean", "value": True}, "b": {"kind": "vertex", "h": "3", "k": "2"}}}
    request = {**DATA["request"], "answer": answer}
    assert dispatch(request, registry, {"test": {"local": local}})["status"] == "correct"
    local.assert_called_once_with(request, registry.get("E01"))


def test_service_and_transport_errors() -> None:
    registry = ValidatorRegistry()
    registry.register(registration())
    cases = [
        (create_local_adapter({}), "SERVICE_UNAVAILABLE"),
        (create_local_adapter({"test-only": Mock(side_effect=ValueError("traza secreta"))}), "VALIDATOR_ERROR"),
        (create_api_adapter(Mock(side_effect=OSError("red secreta"))), "TRANSPORT_ERROR"),
        (create_api_adapter(Mock(side_effect=CoreError("SERVICE_UNAVAILABLE"))), "SERVICE_UNAVAILABLE"),
        (create_api_adapter(Mock(return_value=make_error("SERVICE_UNAVAILABLE"))), "SERVICE_UNAVAILABLE"),
        (create_local_adapter({"test-only": Mock(return_value={"status": "incomplete"})}), "VALIDATOR_ERROR"),
    ]
    for adapter, expected in cases:
        output = dispatch(DATA["request"], registry, {"test": {"local": adapter}})
        assert output["code"] == expected
        schema("error").validate(output)
        assert "secreta" not in str(output)
    assert dispatch(DATA["request"], registry, {})["code"] == "SERVICE_UNAVAILABLE"
    assert dispatch({**DATA["request"], "mechanism": "api"}, registry, {})["code"] == "TRANSPORT_ERROR"


def test_error_constructors() -> None:
    for code in CATEGORIES:
        schema("error").validate(make_error(code))
