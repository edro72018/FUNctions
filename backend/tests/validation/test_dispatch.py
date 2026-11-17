"""US1 / REQ-02–05,09,11 / AC-02–05,09,10."""
from unittest.mock import Mock
import pytest

from app.validation.dispatch.registry import ValidatorRegistry
from app.validation.dispatch.dispatcher import dispatch
from .helpers import fixture, registration, schema

DATA = fixture("contracts")


@pytest.mark.parametrize("result", DATA["results"])
def test_local_result_and_correlation(result: dict) -> None:
    registry = ValidatorRegistry()
    entry = registration()
    registry.register(entry)
    local = Mock(return_value={"status": result["status"], "feedbackCode": result["feedbackCode"]})
    output = dispatch(DATA["request"], registry, {"test": {"local": local}})
    assert output == {"status": result["status"], "feedbackCode": result["feedbackCode"], "origin": "local"}
    schema("result").validate(output)
    local.assert_called_once_with(DATA["request"], entry)
    dispatch(DATA["request"], registry, {"test": {"local": local}})
    assert local.call_count == 2


def test_reject_before_adapter_and_empty_registry() -> None:
    registry = ValidatorRegistry()
    local = Mock()
    assert all(registry.get(f"E{i:02}") is None for i in range(1, 16))
    assert dispatch(DATA["request"], registry, {"test": {"local": local}})["code"] == "EXERCISE_NOT_REGISTERED"
    registry.register(registration())
    for answer in DATA["invalidAnswers"]:
        schema("error").validate(dispatch({**DATA["request"], "answer": answer}, registry, {"test": {"local": local}}))
    assert dispatch({**DATA["request"], "answer": {"kind": "number", "value": "1"}}, registry, {"test": {"local": local}})["code"] == "TYPE_NOT_ALLOWED"
    local.assert_not_called()


def test_normalized_adapter_input() -> None:
    registry = ValidatorRegistry()
    registry.register(registration(allowed_kinds=("number",)))
    local = Mock(return_value=DATA["results"][0])
    dispatch({**DATA["request"], "answer": {"kind": "number", "value": "6/4"}}, registry, {"test": {"local": local}})
    assert local.call_args.args[0]["answer"] == {"kind": "number", "value": "3/2"}
