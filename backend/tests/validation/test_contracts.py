"""REQ-01–04 / AC-01–04: los espejos cumplen los cuatro esquemas."""
import json
import pytest

from app.validation.contracts.validate import validate_answer, validate_request, validate_result, validate_error
from .helpers import CONTRACTS, fixture, schema

DATA = fixture("contracts")


def test_ten_canonical_examples() -> None:
    assert DATA["validAnswers"] == json.loads((CONTRACTS / "examples/answer.types.valid.json").read_text())
    assert len({a["kind"] for a in DATA["validAnswers"]}) == 10


@pytest.mark.parametrize("answer", DATA["validAnswers"])
def test_valid_answer(answer: dict) -> None:
    schema("answer").validate(answer)
    assert validate_answer(answer) == answer


@pytest.mark.parametrize("answer", DATA["invalidAnswers"])
def test_invalid_answer(answer: dict) -> None:
    assert not schema("answer").is_valid(answer)
    with pytest.raises(ValueError):
        validate_answer(answer)


def test_request_correlation_and_structure() -> None:
    request = DATA["request"]
    schema("request").validate(request)
    assert validate_request(request) == request
    for patch in ({"requestId": "no-uuid"}, {"exerciseId": "E16"}, {"mechanism": "auto"}, {"extra": True}):
        invalid = {**request, **patch}
        assert not schema("request").is_valid(invalid)
        with pytest.raises(ValueError):
            validate_request(invalid)
    with pytest.raises(ValueError):
        validate_request({"exerciseId": "E01", "answer": request["answer"]})


@pytest.mark.parametrize("result", DATA["results"])
def test_results(result: dict) -> None:
    schema("result").validate(result)
    assert validate_result(result) == result


@pytest.mark.parametrize("result", DATA["invalidResults"])
def test_invalid_results(result: dict) -> None:
    assert not schema("result").is_valid(result)
    with pytest.raises(ValueError):
        validate_result(result)


def test_error_contract() -> None:
    schema("error").validate(DATA["error"])
    assert validate_error(DATA["error"]) == DATA["error"]
    for patch in ({"category": "incorrect"}, {"status": "incorrect"}, {"message": ""}):
        error = {**DATA["error"], **patch}
        assert not schema("error").is_valid(error)
        with pytest.raises(ValueError):
            validate_error(error)
