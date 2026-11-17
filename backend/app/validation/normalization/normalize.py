"""Normalización determinista previa al validador; REQ-07, REQ-12."""
from functools import cmp_to_key
from ..contracts.answers import Answer, Interval
from ..contracts.validate import validate_answer
from ..errors.errors import CoreError
from .rational import canonical_number, compare_numbers, parse_rational


def compare_bounds(a: str, b: str) -> int:
    if a == b:
        return 0
    if a == "-inf" or b == "+inf":
        return -1
    if a == "+inf" or b == "-inf":
        return 1
    return compare_numbers(a, b)


def normalize_intervals(intervals: list[Interval]) -> list[Interval]:
    ordered: list[Interval] = []
    for interval in intervals:
        lower = {**interval["lower"], "value": "-inf" if interval["lower"]["value"] == "-inf" else canonical_number(interval["lower"]["value"])}
        upper = {**interval["upper"], "value": "+inf" if interval["upper"]["value"] == "+inf" else canonical_number(interval["upper"]["value"])}
        order = compare_bounds(lower["value"], upper["value"])
        if order > 0:
            raise CoreError("INTERVAL_INVALID")
        if order == 0 and not (lower["inclusive"] and upper["inclusive"]):
            continue
        ordered.append({"lower": lower, "upper": upper})

    def compare(a: Interval, b: Interval) -> int:
        return (compare_bounds(a["lower"]["value"], b["lower"]["value"])
                or int(b["lower"]["inclusive"]) - int(a["lower"]["inclusive"])
                or compare_bounds(a["upper"]["value"], b["upper"]["value"]))

    ordered.sort(key=cmp_to_key(compare))
    merged: list[Interval] = []
    for following in ordered:
        current = merged[-1] if merged else None
        contact = compare_bounds(following["lower"]["value"], current["upper"]["value"]) if current else 1
        if current is None or contact > 0 or (contact == 0 and not current["upper"]["inclusive"] and not following["lower"]["inclusive"]):
            merged.append(following)
            continue
        end = compare_bounds(following["upper"]["value"], current["upper"]["value"])
        if end > 0:
            current["upper"] = following["upper"]
        elif end == 0:
            current["upper"]["inclusive"] |= following["upper"]["inclusive"]
    return merged


def normalize_typed(answer: Answer) -> Answer:
    kind = answer["kind"]
    if kind == "number":
        return {"kind": kind, "value": canonical_number(answer["value"])}
    if kind == "boolean":
        return {"kind": kind, "value": answer["value"]}
    if kind == "expression":
        raise CoreError("GRAMMAR_NOT_APPROVED")
    if kind == "finiteSet":
        return {"kind": kind, "values": sorted({canonical_number(v) for v in answer["values"]}, key=parse_rational)}
    if kind == "intervalUnion":
        return {"kind": kind, "intervals": normalize_intervals(answer["intervals"])}
    if kind == "mapping":
        pairs = {(canonical_number(a), canonical_number(b)) for a, b in answer["pairs"]}
        ordered = sorted(pairs, key=lambda pair: (parse_rational(pair[0]), parse_rational(pair[1])))
        return {"kind": kind, "pairs": [list(pair) for pair in ordered]}
    if kind == "vertex":
        return {"kind": kind, "h": canonical_number(answer["h"]), "k": canonical_number(answer["k"])}
    if kind == "point":
        return {"kind": kind, "x": canonical_number(answer["x"]), "y": canonical_number(answer["y"])}
    if kind == "asymptote":
        return {"kind": kind, "orientation": answer["orientation"], "value": canonical_number(answer["value"])}
    return {"kind": "composite", "fields": {key: normalize_typed(answer["fields"][key]) for key in sorted(answer["fields"])}}


def normalize(value: object) -> Answer:
    return normalize_typed(validate_answer(value))
