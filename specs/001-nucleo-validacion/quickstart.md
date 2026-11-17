# Quickstart: validación de contratos del núcleo

**Feature**: `001-nucleo-validacion` | **Fecha**: 2026-11-16 | **Estado**: núcleo implementado y verificado; cierre para revisión humana

Esta guía verifica los contratos, la normalización exacta y la orquestación del núcleo en TypeScript
y Python. Los adaptadores y validadores usados son dobles de prueba; los resultados no acreditan la
matemática de E01–E15, una API HTTP desplegada ni una interfaz jugable.

## Prerequisites

- Python 3.11 o superior (el entorno de verificación usa 3.15.2).
- Entorno histórico de la evidencia de 001: Node.js 20 (verificado con 20.20.2), npm y las versiones entonces fijadas en `frontend/package-lock.json`.
- Migración aprobada el 2026-11-16: [DV-001](../decisiones/DV-001.md) fija Node.js 24.22.1, Vitest 4.1.12 y Ajv 8.20.0; conserva TypeScript 5.6.3. La evidencia anterior no acredita resultados bajo este nuevo entorno; su verificación queda por registrar. No cambian requisitos matemáticos, API ni especificación funcional.
- pytest 8.3.3 y jsonschema 4.26.0 para las pruebas Python.
- Opcionales para los comandos documentales de las secciones 1–4: `check-jsonschema` 0.39.0 y `PyYAML`.

Instalación de las herramientas de contrato (solo desarrollo):

```bash
python3 -m pip install --user check-jsonschema==0.39.0 jsonschema==4.26.0 PyYAML
```

## Ejecutar las baterías del núcleo

Desde la raíz del repositorio:

```bash
npm ci --prefix frontend
npm --prefix frontend run typecheck
npm --prefix frontend test
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install pytest==8.3.3 jsonschema==4.26.0
backend/.venv/bin/python -m pytest -c backend/pyproject.toml backend/tests
```

Ajv/jsonschema son oráculos de desarrollo. La validación de ejecución es manual y se contrasta con
los cuatro esquemas canónicos; el núcleo TypeScript no importa paquetes externos y Python usa la
biblioteca estándar. No se genera código. El catálogo manual incorpora `EXTRA_COMPOSITE_FIELD` desde
`normalization.yaml`; `MISSING_ANSWER_FIELD` identifica campos obligatorios ausentes de una respuesta
con categoría `incomplete`, conforme a REQ-02/REQ-08. Los códigos siguen el esquema aditivo aprobado.

### API pública

- TypeScript: `frontend/src/shared/validation/index.ts`; `dispatch` devuelve una promesa de
  `ValidationResult | ValidationError`.
- Python: `app.validation` con `backend/` en la ruta de importación; `dispatch` devuelve
  `ValidationResult | ValidationError` de forma síncrona.
- `validateAnswer`/`validate_answer` comprueban la estructura, incluidos los tokens de `expression`.
  `normalize` bloquea siempre `expression` con `GRAMMAR_NOT_APPROVED`, también si está anidada.
- `normalize` devuelve una copia canónica serializable. Los racionales internos usan `bigint` o
  `Fraction`; se serializan como enteros o fracciones reducidas. Los intervalos de extremos iguales
  contienen un punto solo si ambos extremos son cerrados; en otro caso no aportan puntos a la unión.
- El registro comienza vacío. `requiredFields`/`required_fields` declara los nombres del compuesto
  de nivel superior; todos son obligatorios y los nombres extra se rechazan. Los componentes anidados
  conservan su estructura tipada sin inferir requisitos específicos de un Ejercicio.
- `createLocalAdapter`/`create_local_adapter` recibe un mapa de `validatorId` a funciones consumidoras.
  `createApiAdapter`/`create_api_adapter` recibe una función de transporte inyectada. Una excepción
  genérica local produce `VALIDATOR_ERROR`; una excepción de transporte produce `TRANSPORT_ERROR`.
  Se pueden devolver errores tipados o lanzar `CoreError` para conservar la categoría conocida.
- `requestId` y `exerciseId` llegan intactos al adaptador. El consumidor correlaciona el retorno con
  esa invocación; no se añaden campos al resultado ni se deduplican solicitudes.
- El mecanismo indicado en la solicitud prevalece sobre la configuración explícita. El despachador
  etiqueta el origen real y nunca invoca automáticamente otro mecanismo.

### Evidencia de ejecución (2026-11-16)

| Etapa | Evidencia observada |
|---|---|
| T013–T018, fase roja | Tres suites por lenguaje fallaron al cargar validación, normalización y registro todavía inexistentes. |
| US1, fase verde | 84 pruebas TypeScript y 84 Python pasaron; `tsc --noEmit` terminó con código 0. |
| T030–T031, fase roja | Las suites de paridad fallaron por ausencia del módulo de adaptadores. |
| US2, fase verde | Cinco pruebas de paridad por lenguaje pasaron. |
| T035–T036, fase roja | Tres fallos por lenguaje: compuesto faltante, campo extra y error de servicio devuelto por el adaptador. |
| Verificación final | 114 pruebas TypeScript y 114 Python pasaron; seis archivos de pruebas por lenguaje. TypeScript estricto: código 0. |

Los dos lenguajes consumen los mismos fixtures `contracts.json`, `normalization.json`, `parity.json`
y `errors.json` en `tests/contract/validation/fixtures/`. Comparan sus salidas con los mismos valores
esperados; los oráculos de esquema comprueban aceptación/rechazo. No se declara cobertura porcentual:
la spec no fija un umbral ni se instaló un medidor adicional.

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

Estos escenarios se cubren con las baterías del núcleo indicadas en la trazabilidad final. Los
controles visuales y validadores matemáticos específicos requieren verificación en sus consumidores.

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

`architecture.spec.ts` analiza el AST TypeScript, las importaciones/exportaciones y los accesos a
servicios globales. `test_architecture.py` analiza el AST Python y los límites de importación. Ambas
baterías incluyen controles negativos que detectan dependencias prohibidas; los módulos del núcleo
pasan la comprobación de independencia (AC-08).

## 7. UI y REQ-13/AC-12

Esta guía no prueba controles gráficos ni teclado virtual. Las specs consumidoras deben verificar,
con evidencia manual, que:

- los intervalos se construyen con controles separados para extremos y pertenencia;
- no hay cuadros de texto libre para respuestas matemáticas;
- las expresiones, si se requieren, se componen solo con los tokens aprobados;
- lo enviado al núcleo cumple `request.schema.json` y `answer.schema.json`.

## 8. Qué no demuestra esta guía

- No demuestra equivalencia matemática de E01–E15.
- La paridad comprobada usa adaptadores de prueba; no acredita un servidor HTTP real.
- No demuestra que la UI cumpla REQ-13.
- No sustituye las pruebas de contrato, las pruebas manuales de UI ni la aprobación del plan.

## 9. Trazabilidad final

Las rutas TS de la tabla son relativas a `frontend/tests/validation/`; las rutas Python, a
`backend/tests/validation/`.

| Requisitos | Criterios | Evidencia concreta | Resultado / límite |
|---|---|---|---|
| REQ-01, REQ-02 | AC-01 | `contracts.spec.ts`, `test_contracts.py` | Diez tipos, discriminante desconocido y formas inválidas verificados contra esquema. |
| REQ-02, REQ-03 | AC-02 | `contracts.spec.ts`, `dispatch.spec.ts`, `test_contracts.py`, `test_dispatch.py` | UUID obligatorio, identificador y correlación preservados; sin deduplicación. |
| REQ-04 | AC-03 | `contracts.spec.ts`, `test_contracts.py` | Tres estados, códigos y campos prohibidos comprobados. |
| REQ-04, REQ-08 | AC-04 | `dispatch.spec.ts`, `errors.spec.ts`, `test_dispatch.py`, `test_errors.py` | Incorrecto/indeterminado separados de errores de transporte y servicio. |
| REQ-02, REQ-05 | AC-05 | `dispatch.spec.ts`, `parity.spec.ts`, `errors.spec.ts` y sus equivalentes `test_dispatch.py`, `test_parity.py`, `test_errors.py` | Registro vacío, tipo incompatible y mecanismo ausente comprobados. |
| REQ-06, REQ-07 | AC-06 | `parity.spec.ts`, `test_parity.py` | Tres casos compartidos, mismos tipos/resultados y origen correcto en ambos mecanismos de prueba. |
| REQ-07, REQ-08 | AC-07 | `normalization.spec.ts`, `test_normalization.py` | Exactitud, canonicalización, determinismo, duplicados, orden, unión de intervalos e inmutabilidad. |
| REQ-09, REQ-10 | AC-08 | `architecture.spec.ts`, `test_architecture.py` | Análisis estático y controles negativos; interfaces públicas inyectables. |
| REQ-01, REQ-11 | AC-09 | `contracts.spec.ts`, `test_contracts.py`; tabla de asociaciones de `spec.md` y `data-model.md` | Formas `boolean`/`vertex` verificadas; asociaciones E01/E08 ratificadas documentalmente. Referencias desde futuras specs consumidoras pendientes. |
| REQ-11 | AC-10 | `dispatch.spec.ts`, `test_dispatch.py`; tabla de asociaciones de `spec.md` | E01–E15 sin registros automáticos; asociaciones restantes pendientes. |
| REQ-12 | AC-11 | `errors.spec.ts`, `test_errors.py`, pruebas de normalización | Campos y discriminantes preservados; faltante `incomplete`, extra `format`. |
| REQ-02, REQ-13 | AC-12 | `contracts.spec.ts`, `errors.spec.ts`, `test_contracts.py`, `test_errors.py` | Tokens inválidos y bloqueo de gramática verificados. Captura gráfica/teclado y pruebas manuales de UI pendientes en las specs consumidoras. |

Las tareas T001–T044 están implementadas y verificadas dentro del alcance del núcleo. El cierre
humano de la etapa permanece para revisión del Aprobador; estas comprobaciones no registran su
aceptación final.
