"""Espejos manuales de answer.schema.json; REQ-01 y REQ-12."""
from typing import Literal, TypedDict

ExactNumber = str
AnswerKind = Literal[
    "number", "expression", "finiteSet", "intervalUnion", "mapping",
    "boolean", "vertex", "point", "asymptote", "composite",
]
ANSWER_KINDS = (
    "number", "expression", "finiteSet", "intervalUnion", "mapping",
    "boolean", "vertex", "point", "asymptote", "composite",
)
NUMBER_PATTERNS = (
    r"^-?(0|[1-9][0-9]*)$",
    r"^-?(0|[1-9][0-9]*)\.[0-9]+$",
    r"^-?(0|[1-9][0-9]*)/[1-9][0-9]*$",
)


class Bound(TypedDict):
    value: ExactNumber
    inclusive: bool


class Interval(TypedDict):
    lower: Bound
    upper: Bound


class NumberAnswer(TypedDict):
    kind: Literal["number"]
    value: ExactNumber


class ExpressionAnswer(TypedDict):
    kind: Literal["expression"]
    tokens: list[str]


class FiniteSetAnswer(TypedDict):
    kind: Literal["finiteSet"]
    values: list[ExactNumber]


class IntervalUnionAnswer(TypedDict):
    kind: Literal["intervalUnion"]
    intervals: list[Interval]


class MappingAnswer(TypedDict):
    kind: Literal["mapping"]
    pairs: list[list[ExactNumber]]


class BooleanAnswer(TypedDict):
    kind: Literal["boolean"]
    value: bool


class VertexAnswer(TypedDict):
    kind: Literal["vertex"]
    h: ExactNumber
    k: ExactNumber


class PointAnswer(TypedDict):
    kind: Literal["point"]
    x: ExactNumber
    y: ExactNumber


class AsymptoteAnswer(TypedDict):
    kind: Literal["asymptote"]
    orientation: Literal["horizontal", "vertical"]
    value: ExactNumber


class CompositeAnswer(TypedDict):
    kind: Literal["composite"]
    fields: dict[str, "Answer"]


Answer = (NumberAnswer | ExpressionAnswer | FiniteSetAnswer | IntervalUnionAnswer
          | MappingAnswer | BooleanAnswer | VertexAnswer | PointAnswer
          | AsymptoteAnswer | CompositeAnswer)
