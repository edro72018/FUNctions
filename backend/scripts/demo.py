"""Demo funcional del núcleo de validación (Python).

Uso (desde la raíz del repo `development/`):
    backend/.venv/bin/python backend/scripts/demo.py

Muestra: normalización exacta, validación de contratos, despacho con registro
explícito, adaptadores local/api y catálogo de errores.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.validation import (  # noqa: E402
    Mechanism,
    ValidatorRegistration,
    ValidatorRegistry,
    create_api_adapter,
    create_local_adapter,
    dispatch,
    make_result,
    normalize,
    validate_answer,
)


def titulo(texto: str) -> None:
    print(f"\n=== {texto} ===")


def normalizacion() -> None:
    titulo("1. Normalización exacta (sin flotantes)")
    casos = [
        {"kind": "number", "value": "1.50"},
        {"kind": "number", "value": "3/2"},
        {"kind": "finiteSet", "values": ["3", "-3", "3"]},
        {"kind": "mapping", "pairs": [["1", "2"], ["1", "3"]]},
        {"kind": "vertex", "h": "3", "k": "2"},
        {"kind": "asymptote", "orientation": "vertical", "value": "3"},
        {"kind": "intervalUnion", "intervals": [
            {"lower": {"value": "-inf", "inclusive": False},
             "upper": {"value": "3", "inclusive": False}},
            {"lower": {"value": "3", "inclusive": False},
             "upper": {"value": "+inf", "inclusive": False}},
        ]},
    ]
    for caso in casos:
        print(f"  entrada  {json.dumps(caso, ensure_ascii=False)}")
        print(f"  salida   {json.dumps(normalize(caso), ensure_ascii=False)}")


def contratos() -> None:
    titulo("2. Rechazo de contratos inválidos")
    invalidos = [
        {"kind": "number", "value": "1/0"},
        {"kind": "number", "value": "1e3"},
        {"kind": "number", "value": ".5"},
        {"kind": "boolean", "value": "true"},
        {"kind": "expression", "tokens": [{"value": "x+2"}]},
        {"kind": "matriz", "values": []},
    ]
    for caso in invalidos:
        try:
            validate_answer(caso)
            print(f"  {json.dumps(caso, ensure_ascii=False)} -> ACEPTADO (inesperado)")
        except Exception as error:  # noqa: BLE001
            print(f"  {json.dumps(caso, ensure_ascii=False)} -> rechazado: {error}")


def construccion_registro() -> tuple[ValidatorRegistry, dict]:
    registro = ValidatorRegistry()
    registro.register(ValidatorRegistration(
        exercise_id="E01",
        allowed_kinds=("number",),
        required_fields=(),
        mechanisms=(Mechanism.LOCAL, Mechanism.API),
        adapter_id="principal",
        validator_id="v1",
        contract_version="1.0.0",
        association_status="pending",
    ))
    registro.register(ValidatorRegistration(
        exercise_id="E02",
        allowed_kinds=("composite",),
        required_fields=("altura", "base"),
        mechanisms=(Mechanism.LOCAL,),
        adapter_id="principal",
        validator_id="v2",
        contract_version="1.0.0",
        association_status="pending",
    ))
    adaptadores = {
        "principal": {
            "local": create_local_adapter({
                "v1": lambda request: make_result("correct", "EXACT_MATCH", Mechanism.LOCAL),
                "v2": lambda request: make_result("correct", "COMPOSITE_OK", Mechanism.LOCAL),
            }),
            "api": create_api_adapter(lambda request: make_result("correct", "REMOTE_OK", Mechanism.API)),
        },
    }
    return registro, adaptadores


def despacho(registro: ValidatorRegistry, adaptadores: dict) -> None:
    titulo("3. Despacho (registro explícito + adaptadores)")
    base = {"requestId": "3f2504e0-4f89-11d3-9a0c-0305e82c3301", "exerciseId": "E01"}

    print("  E01 vía API (mecanismo en la solicitud):")
    print(f"    {json.dumps(dispatch({**base, 'mechanism': 'api', 'answer': {'kind': 'number', 'value': '1/2'}}, registro, adaptadores))}")

    print("  E01 vía local (mecanismo explícito 'local'):")
    print(f"    {json.dumps(dispatch({**base, 'mechanism': 'local', 'answer': {'kind': 'number', 'value': '1/2'}}, registro, adaptadores))}")

    print("  E01 sin mechanism y sin configuración por defecto:")
    print(f"    {json.dumps(dispatch({**base, 'answer': {'kind': 'number', 'value': '1/2'}}, registro, adaptadores))}")

    print("  E02 compuesto completo:")
    print(f"    {json.dumps(dispatch({**base, 'exerciseId': 'E02', 'mechanism': 'local', 'answer': {'kind': 'composite', 'fields': {'altura': {'kind': 'number', 'value': '2'}, 'base': {'kind': 'number', 'value': '4'}}}}, registro, adaptadores))}")

    print("  E02 compuesto incompleto (falta 'base'):")
    print(f"    {json.dumps(dispatch({**base, 'exerciseId': 'E02', 'answer': {'kind': 'composite', 'fields': {'altura': {'kind': 'number', 'value': '2'}}}}, registro, adaptadores))}")

    print("  E02 compuesto con campo extra:")
    print(f"    {json.dumps(dispatch({**base, 'exerciseId': 'E02', 'answer': {'kind': 'composite', 'fields': {'altura': {'kind': 'number', 'value': '2'}, 'base': {'kind': 'number', 'value': '4'}, 'extra': {'kind': 'boolean', 'value': True}}}}, registro, adaptadores))}")

    print("  Ejercicio no registrado (E15, patrón válido pero sin entrada en el registro):")
    print(f"    {json.dumps(dispatch({**base, 'exerciseId': 'E15', 'answer': {'kind': 'number', 'value': '1'}}, registro, adaptadores))}")

    print("  Ejercicio con identificador fuera del patrón E01–E15 (E99):")
    print(f"    {json.dumps(dispatch({**base, 'exerciseId': 'E99', 'answer': {'kind': 'number', 'value': '1'}}, registro, adaptadores))}")

    print("  Tipo no permitido (E01 con kind=boolean):")
    print(f"    {json.dumps(dispatch({**base, 'answer': {'kind': 'boolean', 'value': True}}, registro, adaptadores))}")

    print("  Expresión bloqueada (gramática no aprobada):")
    print(f"    {json.dumps(dispatch({**base, 'answer': {'kind': 'expression', 'tokens': ['x', '+', '2']}}, registro, adaptadores))}")

    print("  Fallo de transporte (API sin adaptador):")
    sin_api = {"principal": {"local": adaptadores["principal"]["local"]}}
    print(f"    {json.dumps(dispatch({**base, 'mechanism': 'api', 'answer': {'kind': 'number', 'value': '1'}}, registro, sin_api))}")


def main() -> None:
    print("Núcleo de validación FUNctions — demostración funcional")
    normalizacion()
    contratos()
    registro, adaptadores = construccion_registro()
    despacho(registro, adaptadores)
    print("\nNota: los adaptadores de esta demo son dobles de prueba; no hay servidor HTTP real.")


if __name__ == "__main__":
    main()
