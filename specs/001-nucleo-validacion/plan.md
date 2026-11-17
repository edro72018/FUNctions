# Implementation Plan: Núcleo común de contratos y orquestación de validaciones

**Branch**: `001-nucleo-validacion` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-nucleo-validacion/spec.md`

**Note**: Plan técnico aprobado por el Aprobador principal el 2026-11-16. No se implementó código de
producto ni se ejecutaron validadores matemáticos. La aprobación autoriza la etapa de descomposición
de tareas y no autoriza la implementación.

## Summary

El núcleo define los contratos compartidos, la normalización determinista, el despacho explícito y
la separación entre resultados matemáticos y errores para las respuestas de E01–E15. Cubre los diez
discriminantes aprobados (`number`, `expression`, `finiteSet`, `intervalUnion`, `mapping`, `boolean`,
`vertex`, `point`, `asymptote` y `composite`), sin implementar la matemática de ningún Ejercicio.

La solución técnica es un núcleo declarativo y sin dependencias de UI, implementado en dos lenguajes
contra una única fuente canónica de contratos en `specs/001-nucleo-validacion/contracts/`:

- TypeScript para el adaptador local del navegador, dentro de `frontend/src/shared/validation/`.
- Python para el adaptador de API, dentro de `backend/app/validation/`.

La fuente canónica son JSON Schema 2020-12 y YAML versionados. Los tipos TypeScript y Python se
escriben de forma manual y se mantienen alineados mediante pruebas de contrato; no se genera código
en v1. La normalización convierte números exactos a racionales internos, ordena y fusiona intervalos,
colapsa duplicados de conjuntos y pares, y bloquea con error de configuración cualquier tipo cuya
gramática o normalización no esté aprobada. No existe fallback automático entre local y API.

## Technical Context

**Language/Version**: TypeScript 5.6.3 sobre Node.js 20.20.2 para el núcleo local; Python 3.11.9+
(verificado con 3.15.2) para el núcleo de API. El núcleo no ejecuta React, PixiJS, Mafs, FastAPI ni
SymPy en su interior.

**Primary Dependencies**: Núcleo TypeScript sin dependencias de ejecución; usa `bigint` nativo para
los racionales. Núcleo Python con biblioteca estándar (`fractions`, `dataclasses`, `typing`). Los
adaptadores consumidores usarán FastAPI 0.115.0, Pydantic 2.9.2 y SymPy 1.13.3, fuera del paquete del
núcleo. Herramientas de verificación propuestas para aprobación: Vitest 2.1.1, Ajv 8.17.1,
pytest 8.3.3 y `check-jsonschema` 0.39.0 (o `jsonschema` 4.26.0). Estas herramientas son de
desarrollo; no añaden dependencias de producto al núcleo.

**Storage**: N/A. El núcleo no persiste respuestas, progreso, `requestId` ni datos del estudiante.
LocalStorage y la persistencia pertenecen a la spec de progreso.

**Testing**: Pruebas de contrato automatizadas con Vitest/Ajv y pytest/`check-jsonschema`, más
vectores compartidos de normalización y una prueba de arquitectura de importaciones. Las pruebas
manuales de UI y de los controles gráficos de intervalo corresponden a las specs consumidoras. No se
fijan umbrales de latencia ni de volumen.

**Target Platform**: Aplicación web en navegador para computadora y tableta; el núcleo TypeScript se
ejecuta en el navegador y en Node durante las pruebas. El núcleo Python se ejecuta en el servidor.
No se adopta aplicación nativa ni motor de juego dedicado.

**Project Type**: Módulo transversal de contratos/orquestación, consumido por Frontend, Backend y
Modo estático; no es una aplicación independiente ni un servicio público de cálculo simbólico.

**Performance Goals**: No aprobados. El diseño evita trabajo por fotograma y mantiene la
normalización lineal en el tamaño de la entrada; no se declaran latencias ni volúmenes sin método y
evidencia.

**Constraints**: Exactitud sin `eval` ni ejecución de texto; comparación exacta sin tolerancia;
normalización determinista; paridad semántica local/API; selección explícita de mecanismo; ausencia
de fallback automático; independencia de UI, persistencia y autenticación; contratos canónicos antes
de implementar.

**Scale/Scope**: Diez discriminantes de respuesta, quince Ejercicios y cinco Zonas. El núcleo solo
cubre contratos, normalización, despacho, resultados y errores; los validadores matemáticos de
E01–E15 y la captura gráfica de intervalos/expresiones pertenecen a los consumidores.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Compuerta | Fuente | Resultado | Evidencia o nota |
|---|---|---|---|
| La spec está aprobada antes de planificar | Constitución, Principio VII y flujo de trabajo, paso 2 | **PASS** | `spec.md` registra `Status: Aprobado` y veredicto `Aprobado` (2026-11-16, versión 0.3.0), con la condición de alinear el Contrato de API. |
| La checklist de calidad se revisó antes del veredicto | Constitución, flujo de trabajo, paso 2 | **PASS** | `checklists/requirements.md` está en 16/16. |
| Las ambigüedades que afectan el incremento están resueltas o bloqueadas explícitamente | Constitución, flujo de trabajo, paso 2 | **PASS con restricciones** | La gramática de `expression` y las asociaciones E02–E15 siguen pendientes por decisión de la spec. El plan no las infiere: `expression` se bloquea con `configuration`/`GRAMMAR_NOT_APPROVED` y el registro de Ejercicios no contiene valores por defecto. |
| Se cubren los diez tipos mínimos y la taxonomía de resultados | Constitución, Principios III y V | **PASS** | REQ-01 enumera los diez tipos; REQ-04 fija `correct`, `incorrect` e `indeterminate`, y trata `incomplete` como error de entrada. |
| No se reabre el stack ni se añaden dependencias no aprobadas | Constitución, Principio II | **PASS con propuesta** | El núcleo no añade dependencias de ejecución ni de UI. Las herramientas de desarrollo y los adaptadores consumidores se enumeran para aprobación en este plan. |
| Los contratos se concretan antes de implementar | Constitución, Principio III | **PASS** | Phase 1 genera `contracts/` con esquemas, normalización, catálogos y ejemplos; la implementación queda para una etapa posterior. |
| La aprobación humana de la etapa está registrada | Constitución, Principio VII | **PASS** | La spec está aprobada (2026-11-16) y este plan quedó aprobado el 2026-11-16 por el Aprobador principal, con veredicto `aprobado` registrado en su bloque `## Aprobaciones`. |
| Registro de aprobaciones en `specs/README.md` | Constitución, Gobernanza | **PASS** | La decisión de aprobación de este plan se registró el 2026-11-16 en el bloque `## Aprobaciones` de `specs/README.md`, junto con la aprobación previa de la spec. |

**Resultado de la compuerta: PASS para ejecutar Phase 0 y Phase 1**, con las condiciones
administrativas y de consumidor indicadas. La aprobación de este plan autoriza la etapa de
descomposición de tareas; no autoriza la implementación.

## Project Structure

### Documentation (this feature)

```text
specs/001-nucleo-validacion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── answer.schema.json
│   ├── request.schema.json
│   ├── result.schema.json
│   ├── error.schema.json
│   ├── normalization.yaml
│   ├── feedback-codes.yaml
│   ├── error-codes.yaml
│   └── examples/
│       ├── request.valid.json
│       ├── answer.types.valid.json
│       ├── answer.composite.valid.json
│       ├── answer.interval.valid.json
│       ├── answer.invalid.json
│       ├── answer.number.invalid.json
│       ├── result.valid.json
│       └── error.valid.json
└── tasks.md              # No generado; requiere aprobación del plan
```

### Source Code (repository root)

```text
frontend/
├── src/
│   └── shared/
│       └── validation/
│           ├── contracts/       # Tipos TS espejo del contrato canónico
│           ├── normalization/   # Racionales, conjuntos, intervalos y pares
│           ├── dispatch/        # Registro explícito y selección local/API
│           ├── errors/          # Construcción y clasificación de errores
│           ├── result/          # Resultado común y origen
│           └── index.ts         # API pública del núcleo TS
└── tests/
    └── validation/
        ├── contracts.spec.ts
        ├── normalization.spec.ts
        ├── dispatch.spec.ts
        └── architecture.spec.ts

backend/
├── app/
│   ├── validation/
│   │   ├── contracts/           # Tipos Python espejo del contrato canónico
│   │   ├── normalization/
│   │   ├── dispatch/
│   │   ├── errors/
│   │   ├── result/
│   │   └── __init__.py
│   ├── api/
│   │   └── routes/
│   │       └── validation.py    # Adaptador HTTP consumidor, no núcleo
│   └── validators/              # Validadores E01–E15, fuera del núcleo
└── tests/
    └── validation/
        ├── test_contracts.py
        ├── test_normalization.py
        ├── test_dispatch.py
        └── test_architecture.py

tests/
└── contract/
    └── validation/
        └── fixtures/            # Vectores compartidos TS/Python

docs/politicas/contrato-api.md   # Actualizar antes de implementar el adaptador API
```

**Structure Decision**: Se usa la estructura de aplicación web de la Constitución, sin crear un
paquete compartido nuevo. El contrato canónico vive en la carpeta de la spec; TypeScript y Python
implementan espejos tipados en `frontend/src/shared/validation/` y `backend/app/validation/`. El
núcleo no importa React, PixiJS, Mafs, LocalStorage, FastAPI ni SymPy. El adaptador HTTP es un
consumidor del núcleo y no forma parte de su paquete.

## Complexity Tracking

No hay violaciones constitucionales que justificar. La duplicación de la lógica de normalización y
despacho en TypeScript y Python es consecuencia obligatoria del stack React/FastAPI; se mitiga con
una fuente canónica JSON Schema/YAML, vectores compartidos y pruebas de contrato. Se rechaza crear un
paquete compartido de ejecución porque TypeScript y Python no comparten runtime, y se rechaza generar
código en v1 porque añadiría herramientas y pasos de build no aprobados.

## Phase 0: Research

Las decisiones técnicas y sus alternativas están en [research.md](./research.md). No quedan
`NEEDS CLARIFICATION` para el núcleo. Las decisiones pendientes de la spec se tratan como límites de
consumidor, no como incógnitas que el plan pueda resolver por inferencia:

- La gramática de `expression` no está aprobada. El contrato acepta únicamente tokens permitidos y
  el despachador devuelve un error de configuración hasta que una spec consumidora registre una
  gramática aprobada.
- Las asociaciones E02–E15 no están ratificadas. El registro del núcleo comienza vacío; cada
  consumidor debe declarar su asociación y sus campos obligatorios. Solo E01→`boolean` y
  E08→`vertex` tienen asociación ratificada, pero sus validadores no forman parte de este núcleo.
- El Contrato de API vigente diverge en formas y en el sobre de resultado. Los contratos de esta
  spec son la fuente canónica; `docs/politicas/contrato-api.md` debe actualizarse antes de
  implementar el adaptador HTTP.
- La ratificación C01–C07, la política de versionado/compatibilidad entre Specs, el propietario de
  validadores y la fase inicial de cobertura siguen pendientes. El plan no las usa como decisiones
  ratificadas; `contractVersion` solo identifica la versión consumida.

## Phase 1: Design & Contracts

Artefactos generados:

- [data-model.md](./data-model.md): entidades, campos, estados, invariantes y reglas de normalización.
- [contracts/answer.schema.json](./contracts/answer.schema.json): unión discriminada de los diez
  tipos, con números exactos como cadenas y tokens de expresión sin texto libre.
- [contracts/request.schema.json](./contracts/request.schema.json): `requestId` UUID, `exerciseId`,
  respuesta tipada y mecanismo opcional explícito.
- [contracts/result.schema.json](./contracts/result.schema.json): `{status, feedbackCode, origin?}`;
  no admite `message`, `apiVersion` ni `incomplete`.
- [contracts/error.schema.json](./contracts/error.schema.json): `{category, code, message}` separado
  del resultado matemático.
- [contracts/normalization.yaml](./contracts/normalization.yaml): gramática numérica, reglas de
  conjuntos/intervalos/pares, bloqueo de `expression` y límites de tolerancia.
- [contracts/feedback-codes.yaml](./contracts/feedback-codes.yaml): catálogo inicial propuesto de
  códigos de retroalimentación.
- [contracts/error-codes.yaml](./contracts/error-codes.yaml): catálogo inicial propuesto de códigos
  de error por categoría.
- [quickstart.md](./quickstart.md): validación ejecutable de esquemas y escenarios de contrato.

**Verificación de artefactos de Phase 1**: se comprobó la sintaxis de los cuatro esquemas y los tres
YAML, el metasquema 2020-12, un ejemplo válido por cada tipo, los ejemplos válidos y los rechazos
esperados con `check-jsonschema`/`jsonschema`. Esta verificación es documental y de contrato; no
acredita implementación, validadores matemáticos ni pruebas de UI.

### Re-evaluación posterior a Phase 1

| Compuerta | Resultado | Evidencia |
|---|---|---|
| Los contratos cubren los diez tipos y la taxonomía | **PASS** | `answer.schema.json` valida un ejemplo por cada tipo; `result.schema.json` y `error.schema.json` separan las categorías. |
| La normalización no infiere ni usa tolerancia | **PASS** | `normalization.yaml` fija racionales exactos, conjuntos, intervalos y pares; E07/E08/E11 quedan sin tolerancia. |
| La gramática y las asociaciones pendientes siguen bloqueadas | **PASS con restricciones** | `expression` tiene `grammar_status: blocked`; el registro no contiene asociaciones E02–E15. |
| No se introducen dependencias de UI o servicio en el núcleo | **PASS** | El árbol de código y la prueba de arquitectura prevista excluyen React, PixiJS, Mafs, LocalStorage, FastAPI y SymPy. |
| El Contrato de API se alineará antes del adaptador | **PASS con condición** | `research.md` D-09 y la secuencia de implementación enumeran los cambios; el documento aún no se modificó. |
| La aprobación del plan está registrada | **PASS** | El bloque `## Aprobaciones` de este plan registra el veredicto `aprobado` del Aprobador principal (2026-11-16, `plan.md` 0.1.0). |

No aparecieron violaciones nuevas durante el diseño. La etapa de descomposición de tareas queda
autorizada; la implementación continúa sin autorizar.

## Implementation Sequence (for a later authorized stage)

1. Fijar los contratos canónicos y validar sus ejemplos; actualizar el Contrato de API de referencia.
2. Implementar los tipos espejo y la normalización exacta en TypeScript y Python.
3. Implementar el registro explícito y el despachador, con adaptadores inyectados y sin fallback.
4. Añadir las pruebas de contrato, normalización, despacho y arquitectura, y los fixtures compartidos.
5. Conectar los adaptadores local y API solo en las specs consumidoras; no implementar E01–E15 aquí.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| Deriva entre tipos TypeScript, Python y los esquemas canónicos. | Esquemas como fuente única; pruebas de contrato y fixtures compartidos; revisión de cambios incompatibles como nueva decisión. |
| Interpretaciones distintas de números decimales/racionales. | Parseo exacto a racional, gramática limitada, canonicalización y vectores de equivalencia; sin punto flotante. |
| `expression` sin gramática aprobada. | Bloqueo con `configuration`/`GRAMMAR_NOT_APPROVED`; no se invoca validador ni se elige resultado. |
| Asociaciones E02–E15 incompletas. | Registro vacío por defecto y declaración explícita por consumidor; ninguna inferencia por semejanza. |
| Divergencia con el Contrato de API vigente. | Los contratos de la spec son canónicos; actualizar `docs/politicas/contrato-api.md` antes de implementar el adaptador HTTP. |
| Captura de texto libre en la UI. | El contrato de `expression` solo acepta tokens y el de intervalos exige extremos y pertenencia; la UI consumidora debe usar controles gráficos/teclado virtual (REQ-13/AC-12). |
| Herramientas de desarrollo no aprobadas. | Se enumeran versiones y propósito; la aprobación del plan debe autorizarlas antes de instalar o ejecutar. |
| Falta de umbrales de rendimiento aprobados. | No se declaran métricas; se evita trabajo por fotograma y se mantiene el algoritmo lineal en el tamaño de la entrada. |

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Aprobación del plan técnico |
| Veredicto | `aprobado` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 |
| Versión o revisión | `plan.md`, versión 0.1.0 |
| Comentarios o condiciones | Autoriza la etapa de descomposición de tareas; no autoriza la implementación. Actualizar el Contrato de API antes de implementar el adaptador HTTP. Mantener bloqueadas la gramática de `expression` y las asociaciones E02–E15 hasta que sus consumidores las ratifiquen. |

Este plan aprobado habilita la descomposición de tareas. La aprobación de la spec no se extiende
automáticamente a otras etapas y esta decisión no autoriza la implementación.
