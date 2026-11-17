---

description: "Tareas para implementar el núcleo común de contratos y orquestación de validaciones"
---

# Tasks: Núcleo común de contratos y orquestación de validaciones

**Input**: Documentos de diseño en `/specs/001-nucleo-validacion/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: La spec y el plan requieren pruebas automatizadas de contrato, normalización, despacho, paridad y arquitectura. En cada historia, las pruebas se escriben y se comprueba que fallen antes de implementar el comportamiento correspondiente.

**Organization**: Las tareas están agrupadas por historia de usuario para que cada incremento pueda implementarse y verificarse de forma independiente. La ejecución de estas tareas requiere una aprobación humana posterior de esta lista.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo porque afecta archivos distintos y no depende de una tarea incompleta.
- **[Story]**: Historia cubierta (`US1`, `US2` o `US3`).
- Cada tarea indica rutas exactas y trazabilidad a requisitos/criterios.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear la estructura y configurar únicamente las herramientas aprobadas por el plan.

- [X] T001 Crear la estructura del núcleo TypeScript y sus pruebas en `frontend/src/shared/validation/` y `frontend/tests/validation/` conforme al árbol de `plan.md`
- [X] T002 [P] Configurar Node.js 20, TypeScript 5.6.3, Vitest 2.1.1 y Ajv 8.17.1 como dependencias de desarrollo, sin dependencias de ejecución del núcleo, en `frontend/package.json`
- [X] T003 [P] Habilitar TypeScript estricto, tipos explícitos y compilación del núcleo y sus pruebas en `frontend/tsconfig.json` y `frontend/vitest.config.ts`
- [X] T004 [P] Crear la estructura del núcleo Python y configurar Python 3.11+, pytest 8.3.3 y jsonschema 4.26.0 como herramientas de desarrollo en `backend/app/validation/__init__.py`, `backend/tests/validation/__init__.py` y `backend/pyproject.toml`
- [X] T005 Alinear las formas de `expression`, `intervalUnion`, `mapping`, el resultado `{status, feedbackCode, origin?}` y el uso correlativo de `requestId` con los contratos canónicos, sin inventar códigos HTTP ni límites operativos, en `docs/politicas/contrato-api.md` (D-09, condición de aprobación)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir los espejos tipados, interfaces y vectores compartidos que bloquean todas las historias.

**⚠️ CRITICAL**: Ninguna historia puede comenzar hasta completar esta fase.

- [X] T006 Crear vectores compartidos de solicitudes, los diez discriminantes, resultados y errores a partir de `contracts/examples/`, incluyendo casos equivalentes y rechazados, en `tests/contract/validation/fixtures/contracts.json` y `tests/contract/validation/fixtures/normalization.json` (REQ-01–REQ-04, AC-01–AC-04, AC-07)
- [X] T007 [P] Definir `ValidationRequest`, `Answer`, `ValidatorRegistration`, `ValidationResult` y `ValidationError` como tipos TypeScript explícitos en `frontend/src/shared/validation/contracts/types.ts`; conservar literalmente `exerciseId: ^E(0[1-9]|1[0-5])$`, `status: "correct" | "incorrect" | "indeterminate"`, categorías `format|incomplete|unsupported|configuration|transport|service`, `code: ^[A-Z][A-Z0-9_]*$` y `mechanism/origin: "local" | "api"` (REQ-01–REQ-06)
- [X] T008 [P] Definir los mismos contratos mediante dataclasses, enums y uniones tipadas de Python en `backend/app/validation/contracts/types.py`; conservar literalmente `exerciseId: ^E(0[1-9]|1[0-5])$`, `status: "correct" | "incorrect" | "indeterminate"`, categorías `format|incomplete|unsupported|configuration|transport|service`, `code: ^[A-Z][A-Z0-9_]*$` y `mechanism/origin: "local" | "api"` (REQ-01–REQ-06)
- [X] T009 [P] Modelar en TypeScript los diez `Answer` con `kind` obligatorio y números como cadenas exactas en `frontend/src/shared/validation/contracts/answers.ts`; aplicar literalmente los patrones entero `^-?(0|[1-9][0-9]*)$`, decimal `^-?(0|[1-9][0-9]*)\.[0-9]+$` y racional `^-?(0|[1-9][0-9]*)/[1-9][0-9]*$`, `orientation: "horizontal"|"vertical"` y `fields` no vacío (REQ-01, REQ-02, REQ-12, AC-01, AC-11)
- [X] T010 [P] Modelar en Python los diez `Answer` con discriminante obligatorio y números como cadenas exactas en `backend/app/validation/contracts/answers.py`; aplicar literalmente los patrones entero `^-?(0|[1-9][0-9]*)$`, decimal `^-?(0|[1-9][0-9]*)\.[0-9]+$` y racional `^-?(0|[1-9][0-9]*)/[1-9][0-9]*$`, `orientation: "horizontal"|"vertical"` y `fields` no vacío (REQ-01, REQ-02, REQ-12, AC-01, AC-11)
- [X] T011 [P] Definir las interfaces TypeScript inyectables de registro, validador y adaptador, sin React, PixiJS, Mafs, LocalStorage, FastAPI ni SymPy, en `frontend/src/shared/validation/dispatch/interfaces.ts` (REQ-05, REQ-09, REQ-10, AC-05, AC-08)
- [X] T012 [P] Definir los protocolos Python inyectables de registro, validador y adaptador, sin FastAPI, SymPy, UI, persistencia ni autenticación, en `backend/app/validation/dispatch/interfaces.py` (REQ-05, REQ-09, REQ-10, AC-05, AC-08)

**Checkpoint**: Los contratos e interfaces están listos; las historias pueden desarrollarse en orden de prioridad o en paralelo.

---

## Phase 3: User Story 1 - Recibir un resultado uniforme (Priority: P1) 🎯 MVP

**Goal**: Validar y normalizar una solicitud tipada, despacharla únicamente a un validador de prueba registrado y devolver exactamente `correct`, `incorrect` o `indeterminate`.

**Independent Test**: Registrar un validador local de prueba, enviar respuestas conformes y no conformes y comprobar que las conformes producen uno de los tres estados matemáticos, mientras las inválidas se rechazan antes de invocar el validador; no se usa ningún validador E01–E15.

### Tests for User Story 1

- [X] T013 [P] [US1] Escribir y ejecutar primero pruebas de los cuatro JSON Schema, los diez discriminantes, UUID obligatorio, estados permitidos y campos prohibidos usando Ajv y los fixtures compartidos en `frontend/tests/validation/contracts.spec.ts`; comprobar el fallo previo a la implementación (REQ-01–REQ-04, AC-01–AC-04)
- [X] T014 [P] [US1] Escribir y ejecutar primero las pruebas equivalentes con jsonschema y los fixtures compartidos en `backend/tests/validation/test_contracts.py`; comprobar el fallo previo a la implementación (REQ-01–REQ-04, AC-01–AC-04)
- [X] T015 [P] [US1] Escribir y ejecutar primero pruebas TypeScript de racionales, conjuntos, intervalos, pares, vértices, puntos, asíntotas y compuestos en `frontend/tests/validation/normalization.spec.ts`; cubrir cero canónico, reducción exacta, duplicados, orden, infinito siempre abierto, fusión solo con solapamiento o contacto donde al menos un extremo sea cerrado y ausencia de tolerancia (REQ-07, AC-07)
- [X] T016 [P] [US1] Escribir y ejecutar primero las pruebas Python equivalentes en `backend/tests/validation/test_normalization.py`; cubrir cero canónico, reducción exacta, duplicados, orden, infinito siempre abierto, fusión solo con solapamiento o contacto donde al menos un extremo sea cerrado y ausencia de tolerancia (REQ-07, AC-07)
- [X] T017 [P] [US1] Escribir y ejecutar primero pruebas de registro y despacho local TypeScript con resultados `correct`, `incorrect` e `indeterminate`, rechazo previo de estructura/tipo inválido y conservación de `requestId` en `frontend/tests/validation/dispatch.spec.ts`; comprobar el fallo previo a la implementación (REQ-02–REQ-05, AC-02–AC-05)
- [X] T018 [P] [US1] Escribir y ejecutar primero las pruebas Python equivalentes de registro y despacho local en `backend/tests/validation/test_dispatch.py`; comprobar el fallo previo a la implementación (REQ-02–REQ-05, AC-02–AC-05)

### Implementation for User Story 1

- [X] T019 [P] [US1] Implementar racionales exactos TypeScript con `bigint`, reducción, signo en numerador, cero canónico y serialización entera o `numerador/denominador`, rechazando exponentes, `+` inicial, ceros iniciales, punto final, denominador cero, coma decimal, signo Unicode y espacios, en `frontend/src/shared/validation/normalization/rational.ts` (REQ-07, AC-07)
- [X] T020 [P] [US1] Implementar racionales exactos Python con `fractions.Fraction` y las mismas reglas y rechazos en `backend/app/validation/normalization/rational.py` (REQ-07, AC-07)
- [X] T021 [P] [US1] Implementar normalización TypeScript determinista de `number`, `finiteSet`, `intervalUnion`, `mapping`, `boolean`, `vertex`, `point`, `asymptote` y campos `composite` en `frontend/src/shared/validation/normalization/normalize.ts`; `[]` representa vacío explícito, los pares preservan entradas iguales con salidas distintas y no se usa punto flotante (REQ-07, REQ-12, AC-07, AC-11)
- [X] T022 [P] [US1] Implementar la normalización Python equivalente en `backend/app/validation/normalization/normalize.py`; `[]` representa vacío explícito, los pares preservan entradas iguales con salidas distintas y no se usa punto flotante (REQ-07, REQ-12, AC-07, AC-11)
- [X] T023 [P] [US1] Implementar validación estructural TypeScript contra los contratos canónicos antes del despacho y constructores separados de resultado/error en `frontend/src/shared/validation/contracts/validate.ts` y `frontend/src/shared/validation/result/result.ts` (REQ-02–REQ-04, REQ-08, AC-01–AC-04)
- [X] T024 [P] [US1] Implementar validación estructural Python contra los contratos canónicos antes del despacho y constructores separados de resultado/error en `backend/app/validation/contracts/validate.py` y `backend/app/validation/result/result.py` (REQ-02–REQ-04, REQ-08, AC-01–AC-04)
- [X] T025 [P] [US1] Implementar un registro TypeScript inicialmente vacío, sin asociaciones por defecto ni búsqueda por semejanza, en `frontend/src/shared/validation/dispatch/registry.ts`; permitir registros explícitos `E01`–`E15` sin implementar sus validadores (REQ-05, REQ-09, REQ-11, AC-05, AC-09, AC-10)
- [X] T026 [P] [US1] Implementar el registro Python equivalente inicialmente vacío en `backend/app/validation/dispatch/registry.py`; permitir registros explícitos `E01`–`E15` sin implementar sus validadores (REQ-05, REQ-09, REQ-11, AC-05, AC-09, AC-10)
- [X] T027 [P] [US1] Implementar el flujo local TypeScript validar→normalizar→resolver registro→invocar adaptador→validar resultado en `frontend/src/shared/validation/dispatch/dispatcher.ts`, sin contener decisiones matemáticas de E01–E15 (REQ-02, REQ-04, REQ-05, REQ-09, AC-02–AC-05)
- [X] T028 [P] [US1] Implementar el flujo local Python equivalente en `backend/app/validation/dispatch/dispatcher.py`, sin contener decisiones matemáticas de E01–E15 (REQ-02, REQ-04, REQ-05, REQ-09, AC-02–AC-05)

**Checkpoint**: US1 devuelve resultados uniformes y rechaza entradas no conformes antes del validador; constituye el MVP.

---

## Phase 4: User Story 2 - Validar con el mismo contrato en modo local o API (Priority: P2)

**Goal**: Seleccionar explícitamente un adaptador local o API de prueba, conservar su origen y obtener semántica común sin fallback automático.

**Independent Test**: Ejecutar el mismo caso de conformidad con adaptadores de prueba local y API; ambos aceptan la misma solicitud y devuelven el mismo estado/código, con `origin` correcto, y un fallo API no inicia el adaptador local.

### Tests for User Story 2

- [X] T029 [P] [US2] Crear casos canónicos de paridad local/API con resultados y orígenes esperados en `tests/contract/validation/fixtures/parity.json` (REQ-06, AC-06)
- [X] T030 [P] [US2] Escribir y ejecutar primero pruebas TypeScript de selección por solicitud o configuración, paridad de serialización/resultado, `origin` y prohibición de fallback en `frontend/tests/validation/parity.spec.ts`; comprobar el fallo previo a la implementación (REQ-05, REQ-06, REQ-08, AC-04–AC-06)
- [X] T031 [P] [US2] Escribir y ejecutar primero las pruebas Python equivalentes en `backend/tests/validation/test_parity.py`; comprobar el fallo previo a la implementación (REQ-05, REQ-06, REQ-08, AC-04–AC-06)

### Implementation for User Story 2

- [X] T032 [P] [US2] Implementar adaptadores inyectables TypeScript `local` y `api` y la selección explícita por solicitud o configuración, sin HTTP real ni fallback, en `frontend/src/shared/validation/dispatch/adapters.ts` y `frontend/src/shared/validation/dispatch/dispatcher.ts` (REQ-05, REQ-06, AC-05, AC-06)
- [X] T033 [P] [US2] Implementar adaptadores inyectables Python `local` y `api` y la selección explícita equivalente, sin FastAPI real ni fallback, en `backend/app/validation/dispatch/adapters.py` y `backend/app/validation/dispatch/dispatcher.py` (REQ-05, REQ-06, AC-05, AC-06)
- [X] T034 [US2] Exportar las APIs públicas equivalentes de contratos, normalización, registro, adaptadores, despacho, resultados y errores en `frontend/src/shared/validation/index.ts` y `backend/app/validation/__init__.py` (REQ-06, REQ-09, AC-06)

**Checkpoint**: US1 y US2 funcionan de manera independiente con adaptadores de prueba y contratos equivalentes.

---

## Phase 5: User Story 3 - Distinguir errores técnicos y bloqueos de configuración (Priority: P3)

**Goal**: Separar errores `format`, `incomplete`, `unsupported`, `configuration`, `transport` y `service` de todo resultado matemático.

**Independent Test**: Provocar una entrada inválida, un compuesto incompleto/extra, una expresión sin gramática, un ejercicio/tipo/mecanismo no configurado y fallos de transporte/servicio; cada caso devuelve categoría/código estable, no invoca adaptadores cuando corresponde y nunca produce un resultado matemático.

### Tests for User Story 3

- [X] T035 [P] [US3] Escribir y ejecutar primero pruebas TypeScript para `INVALID_REQUEST`, `INVALID_ANSWER`, `NUMBER_GRAMMAR_INVALID`, `EXPRESSION_TOKEN_INVALID`, `INTERVAL_INVALID`, `MISSING_COMPOSITE_FIELD`, `EXTRA_COMPOSITE_FIELD`, `EXERCISE_NOT_REGISTERED`, `TYPE_NOT_ALLOWED`, `MECHANISM_NOT_CONFIGURED`, `GRAMMAR_NOT_APPROVED`, `TRANSPORT_ERROR`, `SERVICE_UNAVAILABLE` y `VALIDATOR_ERROR` en `frontend/tests/validation/errors.spec.ts`; comprobar categoría, ausencia de invocación y fallo previo (REQ-02, REQ-08, REQ-12, AC-04, AC-05, AC-11, AC-12)
- [X] T036 [P] [US3] Escribir y ejecutar primero las pruebas Python equivalentes en `backend/tests/validation/test_errors.py`; comprobar categoría, ausencia de invocación y fallo previo (REQ-02, REQ-08, REQ-12, AC-04, AC-05, AC-11, AC-12)

### Implementation for User Story 3

- [X] T037 [P] [US3] Implementar constructores y clasificación TypeScript de errores desde `error-codes.yaml`, manteniendo `{category, code, message}` separado del resultado y mensajes solo técnicos, en `frontend/src/shared/validation/errors/errors.ts` (REQ-04, REQ-08, AC-03–AC-05)
- [X] T038 [P] [US3] Implementar constructores y clasificación Python equivalentes en `backend/app/validation/errors/errors.py` (REQ-04, REQ-08, AC-03–AC-05)
- [X] T039 [P] [US3] Integrar en el despacho TypeScript los bloqueos de expresión `configuration/GRAMMAR_NOT_APPROVED`, compuesto faltante `incomplete/MISSING_COMPOSITE_FIELD`, campo extra `format/EXTRA_COMPOSITE_FIELD`, ejercicio/tipo/mecanismo no configurado y traducción de fallos a `transport`/`service`, sin convertirlos en `incorrect` o `indeterminate`, en `frontend/src/shared/validation/dispatch/dispatcher.ts` (REQ-02, REQ-05, REQ-08, REQ-12, AC-04, AC-05, AC-11, AC-12)
- [X] T040 [P] [US3] Integrar los mismos bloqueos y traducciones en el despacho Python en `backend/app/validation/dispatch/dispatcher.py` (REQ-02, REQ-05, REQ-08, REQ-12, AC-04, AC-05, AC-11, AC-12)

**Checkpoint**: Las tres historias son funcionales y cada error permanece fuera de los resultados matemáticos.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificar fronteras arquitectónicas, paridad total y documentación ejecutable.

- [X] T041 [P] Crear una prueba de arquitectura TypeScript que falle ante importaciones de React, PixiJS, Mafs, LocalStorage, FastAPI o SymPy desde el núcleo en `frontend/tests/validation/architecture.spec.ts` (REQ-09, REQ-10, AC-08)
- [X] T042 [P] Crear la prueba de arquitectura Python equivalente para FastAPI, SymPy, UI, persistencia y autenticación en `backend/tests/validation/test_architecture.py` (REQ-09, REQ-10, AC-08)
- [X] T043 Ejecutar ambas baterías sobre `tests/contract/validation/fixtures/`, corregir cualquier deriva TypeScript/Python y documentar el comando reproducible y el resultado real sin afirmar cobertura de E01–E15 ni UI en `specs/001-nucleo-validacion/quickstart.md` (REQ-06, REQ-07, AC-06, AC-07)
- [X] T044 Verificar y documentar la trazabilidad final de REQ-01–REQ-12 y AC-01–AC-11 con archivos de prueba concretos, dejando REQ-13/AC-12 de UI para las specs consumidoras salvo el bloqueo estructural de `expression`, en `specs/001-nucleo-validacion/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; T002–T004 pueden avanzar en paralelo después de acordar el árbol de T001. T005 debe terminar antes de cualquier adaptador HTTP futuro, que está fuera de esta feature.
- **Foundational (Phase 2)**: Depende de Setup y bloquea todas las historias.
- **US1 (Phase 3)**: Depende de Foundational. Las pruebas T013–T018 deben existir y fallar antes de T019–T028.
- **US2 (Phase 4)**: Depende de las interfaces y del despachador base de US1. T030–T031 deben fallar antes de T032–T034.
- **US3 (Phase 5)**: Depende de las interfaces y del despachador base de US1; puede desarrollarse en paralelo con US2. T035–T036 deben fallar antes de T037–T040.
- **Polish (Phase 6)**: Depende de todas las historias elegidas para el incremento.

### User Story Dependency Graph

```text
Setup → Foundational → US1 (P1 / MVP) ─┬→ US2 (P2) ─┐
                                      └→ US3 (P3) ─┴→ Polish
```

- **US1**: Primer incremento entregable; no depende de otra historia.
- **US2**: Reutiliza el despacho de US1, pero se prueba con sus propios adaptadores y fixtures.
- **US3**: Reutiliza el despacho de US1 y puede implementarse en paralelo con US2.

### Within Each User Story

1. Crear fixtures exclusivos de la historia, si corresponden.
2. Escribir las pruebas y comprobar que fallen por ausencia del comportamiento.
3. Implementar primitivas/modelos antes de normalización y servicios.
4. Implementar registro/adaptadores antes de completar el despacho.
5. Ejecutar la prueba independiente y detenerse en el checkpoint.

### Parallel Opportunities

- Las configuraciones Frontend y Backend T002–T004 son paralelas.
- Los espejos TypeScript T007/T009/T011 y Python T008/T010/T012 son paralelos por lenguaje.
- Las pruebas TypeScript y Python de cada historia son paralelas.
- En US1, racionales T019/T020, normalizadores T021/T022, validación T023/T024 y registros T025/T026 pueden dividirse por lenguaje; los despachadores esperan sus piezas del mismo lenguaje.
- Después de US1, US2 y US3 pueden avanzar en paralelo.
- Las pruebas de arquitectura T041 y T042 son paralelas.

---

## Parallel Example: User Story 1

```text
Task T013: contratos TypeScript en frontend/tests/validation/contracts.spec.ts
Task T014: contratos Python en backend/tests/validation/test_contracts.py
Task T015: normalización TypeScript en frontend/tests/validation/normalization.spec.ts
Task T016: normalización Python en backend/tests/validation/test_normalization.py
```

## Parallel Example: User Story 2

```text
Task T030: paridad TypeScript en frontend/tests/validation/parity.spec.ts
Task T031: paridad Python en backend/tests/validation/test_parity.py
```

## Parallel Example: User Story 3

```text
Task T035: errores TypeScript en frontend/tests/validation/errors.spec.ts
Task T036: errores Python en backend/tests/validation/test_errors.py
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup.
2. Completar Foundational.
3. Escribir las pruebas de US1 y comprobar su fallo inicial.
4. Implementar US1.
5. Ejecutar su prueba independiente y detenerse para revisión.
6. No comenzar implementación hasta que esta lista de tareas tenga aprobación humana registrada.

### Incremental Delivery

1. Setup + Foundational → contratos e interfaces listos.
2. US1 → resultado uniforme local con validador de prueba (MVP).
3. US2 → paridad local/API y origen explícito, sin fallback.
4. US3 → taxonomía completa de errores y bloqueos.
5. Polish → fronteras, paridad integral y evidencia reproducible.

### Parallel Team Strategy

1. El equipo completa Setup y Foundational.
2. Un responsable trabaja el espejo TypeScript y otro el espejo Python, sincronizados por fixtures canónicos.
3. Tras US1, US2 y US3 se desarrollan en paralelo sin modificar los mismos archivos dentro de cada lenguaje al mismo tiempo.
4. La revisión final compara ambos runtimes contra los mismos contratos y vectores.

---

## Notes

- `[P]` significa archivos distintos y ausencia de dependencia con tareas incompletas.
- Los esquemas/YAML de `specs/001-nucleo-validacion/contracts/` son la fuente canónica; no se genera código en v1.
- El registro de producto comienza vacío; E01→`boolean` y E08→`vertex` están ratificados, pero sus validadores no se implementan aquí.
- La gramática de `expression` permanece bloqueada y las asociaciones E02–E15 no se infieren.
- No se implementan FastAPI, SymPy, validadores E01–E15, UI, persistencia, autenticación, logging, límites operativos ni códigos HTTP.
- `tasks.md` Aprobado para implementar, aprobado por Edwin.
