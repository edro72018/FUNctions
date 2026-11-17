"""US2 / REQ-05–08 / AC-04–06: paridad y selección explícita."""
import json
from unittest.mock import Mock
import pytest

from app.validation.dispatch.adapters import create_api_adapter, create_local_adapter
from app.validation.dispatch.dispatcher import dispatch
from app.validation.dispatch.registry import ValidatorRegistry
from app.validation.contracts.types import Mechanism
from .helpers import fixture, registration

DATA = fixture("contracts")


@pytest.mark.parametrize("case", fixture("parity")["cases"])
def test_parity(case: dict) -> None:
    registry = ValidatorRegistry()
    registry.register(registration(allowed_kinds=(case["answer"]["kind"],)))
    seen = []

    def validator(request: dict) -> dict:
        seen.append(request)
        return case["result"]

    adapters = {"test": {"local": create_local_adapter({"test-only": validator}),
                         "api": create_api_adapter(lambda request: validator(json.loads(json.dumps(request))))}}
    for mechanism in ("local", "api"):
        output = dispatch({**DATA["request"], "answer": case["answer"], "mechanism": mechanism}, registry, adapters)
        assert output == {**case["result"], "origin": mechanism}
        assert seen[-1]["answer"] == case["normalized"]
        assert seen[-1]["requestId"] == DATA["request"]["requestId"]


def test_explicit_selection() -> None:
    registry = ValidatorRegistry()
    registry.register(registration())
    local, api = Mock(return_value=DATA["results"][0]), Mock(return_value=DATA["results"][1])
    request = {k: v for k, v in DATA["request"].items() if k != "mechanism"}
    adapters = {"test": {"local": local, "api": api}}
    assert dispatch(request, registry, adapters, Mechanism.API)["origin"] == "api"
    assert dispatch(DATA["request"], registry, adapters, Mechanism.API)["origin"] == "local"
    assert local.call_count == api.call_count == 1
    assert dispatch(request, registry, adapters)["code"] == "MECHANISM_NOT_CONFIGURED"


def test_no_fallback() -> None:
    registry = ValidatorRegistry()
    registry.register(registration())
    local = Mock(return_value=DATA["results"][0])
    api = create_api_adapter(Mock(side_effect=OSError("red privada")))
    adapters = {"test": {"local": local, "api": api}}
    result = dispatch({**DATA["request"], "mechanism": "api"}, registry, adapters)
    assert result["code"] == "TRANSPORT_ERROR"
    assert result["category"] == "transport"
    local.assert_not_called()
    assert dispatch(DATA["request"], registry, adapters)["origin"] == "local"
