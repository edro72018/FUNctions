# Quickstart: validación de contratos del núcleo

**Feature**: `001-nucleo-validacion` | **Fecha**: 2026-11-16 | **Estado**: guía de validación para revisión

Esta guía comprueba los contratos generados en Phase 1. **No implementa el núcleo, no ejecuta
validadores matemáticos y no acredita que la funcionalidad esté terminada.** La verificación de
despacho, normalización y paridad local/API se implementará y ejecutará en la etapa de tareas, una
vez aprobado este plan.

## Prerequisites

- Python 3.11 o superior (el entorno de verificación usa 3.15.2).
- `check-jsonschema` 0.39.0, `jsonschema` 4.26.0 y `PyYAML` para validar esquemas y YAML.
- Opcional: Node.js 20 para las pruebas TypeScript posteriores; no se necesita para esta guía.

Instalación de las herramientas de contrato (solo desarrollo):

```bash
python3 -m pip install --user check-jsonschema==0.39.0 jsonschema==4.26.0 PyYAML
```

## 1. Validar la sintaxis de los contratos

Desde la raíz del repositorio:

```bash
python3 -m json.tool specs/001-nucleo-validacion/contracts/answer.schema.json >/dev/null
python3 -m json.tool specs/001-nucleo-validacion/contracts/request.schema.json >/dev/null
python3 -m json.tool specs/001-nucleo-validacion/contracts/result.schema.json >/dev/null
python3 -m json.tool specs/001-nucleo-validacion/contracts/error.schema.json >/dev/null

python3 - <<'PY'
import yaml
from pathlib import Path

base = Path("specs/001-nucleo-validacion/contracts")
for name in ("normalization.yaml", "feedback-codes.yaml", "error-codes.yaml"):
    with (base / name).open(encoding="utf-8") as file:
        yaml.safe_load(file)
    print(f"ok {name}")
PY
```

**Resultado esperado**: todos los comandos terminan con código 0 y los tres YAML imprimen `ok`.

## 2. Validar los esquemas contra su metasquema

```bash
check-jsonschema --check-metaschema \
  specs/001-nucleo-validacion/contracts/answer.schema.json \
  specs/001-nucleo-validacion/contracts/request.schema.json \
  specs/001-nucleo-validacion/contracts/result.schema.json \
  specs/001-nucleo-validacion/contracts/error.schema.json
```

**Resultado esperado**: `ok -- validation done`.

## 3. Validar ejemplos válidos

```bash
check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/request.schema.json \
  specs/001-nucleo-validacion/contracts/examples/request.valid.json

check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/answer.schema.json \
  specs/001-nucleo-validacion/contracts/examples/answer.composite.valid.json

check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/answer.schema.json \
  specs/001-nucleo-validacion/contracts/examples/answer.interval.valid.json

check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/result.schema.json \
  specs/001-nucleo-validacion/contracts/examples/result.valid.json

check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/error.schema.json \
  specs/001-nucleo-validacion/contracts/examples/error.valid.json
```

**Resultado esperado**: cada comando imprime `ok -- validation done`.

### 3.1. Validar un ejemplo por cada tipo

El archivo `answer.types.valid.json` contiene un ejemplo de cada uno de los diez discriminantes.
`check-jsonschema` valida un único documento, así que se recorre el arreglo con la misma librería
`jsonschema` usada por la herramienta:

```bash
python3 - <<'PY'
import json
from pathlib import Path
from jsonschema import Draft202012Validator

base = Path("specs/001-nucleo-validacion/contracts")
schema = json.loads((base / "answer.schema.json").read_text(encoding="utf-8"))
answers = json.loads((base / "examples/answer.types.valid.json").read_text(encoding="utf-8"))
validator = Draft202012Validator(schema)

for index, answer in enumerate(answers):
    errors = sorted(validator.iter_errors(answer), key=lambda error: list(error.path))
    if errors:
        raise SystemExit(f"answer {index} ({answer.get('kind')}): {errors[0].message}")

print(f"ok {len(answers)} answers")
PY
```

**Resultado esperado**: `ok 10 answers`.

## 4. Validar rechazos esperados

Los siguientes comandos deben **fallar** con código distinto de 0. Un fallo aquí es el resultado
correcto: demuestra que el contrato rechaza un discriminante desconocido y un número con denominador
cero.

```bash
check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/answer.schema.json \
  specs/001-nucleo-validacion/contracts/examples/answer.invalid.json
# esperado: error; "matrix" no pertenece a los diez tipos

check-jsonschema \
  --schemafile specs/001-nucleo-validacion/contracts/answer.schema.json \
  specs/001-nucleo-validacion/contracts/examples/answer.number.invalid.json
# esperado: error; "1/0" no cumple la gramática de exactNumber
```

## 5. Escenarios de contrato

Estos escenarios describen el comportamiento que las pruebas de la etapa de tareas deben verificar.
No se presentan como ejecutados.

| Escenario | Entrada / condición | Resultado esperado | Cobertura |
|---|---|---|---|
| Número racional exacto | `"3/2"` | Válido; se normaliza a `3/2`. | AC-01, AC-07 |
| Decimal finito exacto | `"1.50"` | Válido; equivalente a `3/2`. | AC-07 |
| Número inválido | `"1/0"`, `"1e3"`, `"+1"`, `".5"` | Error `format`; no se invoca validador. | AC-07 |
| Conjunto vacío explícito | `{kind:"finiteSet", values:[]}` | Válido; es `∅`, no un campo ausente. | AC-07 |
| Conjunto desordenado con duplicados | `["3","-3","3"]` | Se compara como `{-3,3}`; duplicados colapsados. | AC-07 |
| Intervalo con infinito | `-inf`/`+inf` con `inclusive:true` | Error de formato; el infinito siempre es abierto. | AC-07 |
| Unión `ℝ\{3}` | Dos intervalos abiertos en 3 | Válido y normalizado a la unión equivalente. | AC-07 |
| `mapping` desordenado | `[["1","2"],["1","3"]]` | Relación conservada; orden irrelevante. | AC-07 |
| Booleano JSON | `true` | Válido. | AC-01 |
| Booleano como cadena | `"true"` | Error de formato. | AC-01 |
| Vértice exacto | `{h:"3", k:"2"}` | Válido; sin redondeo. | AC-01, AC-09 |
| Punto exacto | `{x:"1/2", y:"-2"}` | Válido. | AC-01 |
| Asíntota | `{orientation:"vertical", value:"3"}` | Válido; `x=3` no equivale a `y=3`. | AC-01 |
| Compuesto completo | `{kind:"composite", fields:{...}}` | Válido si el registro declara los campos. | AC-11 |
| Compuesto incompleto | Falta un campo obligatorio | Error `incomplete`/`MISSING_COMPOSITE_FIELD`. | AC-11 |
| Compuesto con campo extra | Campo no declarado | Error `format`/`EXTRA_COMPOSITE_FIELD`. | AC-11 |
| `expression` con tokens válidos | `["x","+","2"]` | Estructura válida, pero despacho bloqueado con `configuration`/`GRAMMAR_NOT_APPROVED` hasta aprobar la gramática. | AC-12 |
| `expression` con texto libre | `{value:"x+2"}` | Error de formato; el campo `value` no existe para este tipo. | AC-12 |
| Ejercicio sin registro | `exerciseId` no registrado | Error `unsupported`/`EXERCISE_NOT_REGISTERED`; no se usa un validador por defecto. | AC-05 |
| Tipo no permitido | `kind` fuera de `allowedKinds` | Error `unsupported`/`TYPE_NOT_ALLOWED`. | AC-05 |
| Mecanismo no configurado | Sin `mechanism` y sin configuración | Error `configuration`/`MECHANISM_NOT_CONFIGURED`. | AC-05 |
| Fallo de API | Adaptador API no disponible | Error `transport`/`TRANSPORT_ERROR`; nunca `incorrect`. | AC-04 |
| Fallo de validador | Excepción del adaptador | Error `service`/`VALIDATOR_ERROR`; nunca un resultado falso. | AC-04 |
| Resultado indeterminado | Validador no decide | `{status:"indeterminate", feedbackCode:"INDETERMINATE_DEFAULT"}`. | AC-03, AC-04 |
| Resultado con `incomplete` | Se intenta usar `status:"incomplete"` | Rechazado por `result.schema.json`; `incomplete` es categoría de error. | AC-03 |
| Fallback automático | API falla y el cliente intenta local sin solicitarlo | Prohibido; se devuelve el error del mecanismo. | AC-04, AC-05 |

## 6. Verificación de arquitectura

Cuando exista la implementación, la prueba de arquitectura debe comprobar que el paquete del núcleo
no importa React, PixiJS, Mafs, LocalStorage, FastAPI ni SymPy (AC-08). En esta etapa la verificación
es de diseño: el árbol de `plan.md` separa `frontend/src/shared/validation/` y
`backend/app/validation/` de los adaptadores y validadores.

## 7. UI y REQ-13/AC-12

Esta guía no prueba controles gráficos ni teclado virtual. Las specs consumidoras deben verificar,
con evidencia manual, que:

- los intervalos se construyen con controles separados para extremos y pertenencia;
- no hay cuadros de texto libre para respuestas matemáticas;
- las expresiones, si se requieren, se componen solo con los tokens aprobados;
- lo enviado al núcleo cumple `request.schema.json` y `answer.schema.json`.

## 8. Qué no demuestra esta guía

- No demuestra que el despachador, la normalización o los adaptadores estén implementados.
- No demuestra equivalencia matemática de E01–E15.
- No demuestra paridad local/API en ejecución.
- No demuestra que la UI cumpla REQ-13.
- No sustituye las pruebas de contrato, las pruebas manuales de UI ni la aprobación del plan.
