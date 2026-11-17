# Implementation Plan: Primer recorrido — índice y recorrido E01/E08

**Branch**: `feature/002-primer-recorrido` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Especificación del primer corte vertical de FUNctions
(`specs/002-primer-recorrido/spec.md`, versión de trabajo 0.1.0, veredicto `Aprobado`).

**Status**: `aprobado`

**Note**: Este plan describe cómo se implementará el corte en una etapa posterior. No se escribió
código de producto, no se instalaron dependencias, no se ejecutaron pruebas de la implementación y no
se modificó el backend. La aprobación de este plan solo habilitará la descomposición de tareas, no la
implementación.

## Summary

El incremento entrega el corte vertical mínimo de FUNctions: el índice de inicio, las pantallas
informativas, la introducción breve, el recorrido de prueba E01 → E08, las ayudas H1–H3, el
diagnóstico, la persistencia local y el etiquetado explícito del origen de validación (`local` /
`API`).

E01 clasifica una relación discreta con respuesta `boolean`; E08 construye un vértice `(h, k)` con
`a = 1` y respuesta `vertex`. El corte consume los contratos de
[`001-nucleo-validacion`](../001-nucleo-validacion/spec.md) y el contrato de interacción de
[`003-interaccion-2d`](../003-interaccion-2d/spec.md). No crea un mapa de zonas, no completa una zona y
no implementa un backend nuevo.

La solución técnica es una aplicación React/TypeScript con navegación en memoria, estado de dominio
en React, PixiJS para E01, Mafs para E08, una puerta única de validación local/API sin fallback y un
progreso versionado en `LocalStorage`. Los detalles de investigación están en
[`research.md`](./research.md); las entidades y reglas, en [`data-model.md`](./data-model.md).

## Technical Context

**Language/Version**: TypeScript 5.6.3 en modo estricto (`strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`). React 18.3.1 y React DOM 18.3.1 sobre
Node.js 24.22.1 para herramientas y navegadores modernos. Python no es un runtime de producto en
este incremento; solo puede usarse como utilidad documental para comprobar sintaxis JSON.

**Primary Dependencies**: versiones aprobadas por [DV-001](../decisiones/DV-001.md): React 18.3.1, React DOM 18.3.1, PixiJS 8.23.0 y Mafs 0.21.0.
Herramientas: Vite 7.3.8, `@vitejs/plugin-react` 5.1.0, `@types/react` 18.3.31,
`@types/react-dom` 18.3.7, TypeScript 5.6.3, Vitest 4.1.12 y Ajv 8.20.0; override `katex` 0.19.1.
No se añaden `@pixi/react`, router, gestor de estado, `jsdom`, Testing Library, FastAPI ni SymPy.
Esta declaración fija el objetivo aprobado, no acredita instalación.

**Storage**: `LocalStorage` del navegador, clave `functions.progress.v1`, esquema
[`contracts/progress.schema.json`](./contracts/progress.schema.json). Guarda versión, misión, paso del
recorrido, resueltos, borradores, intentos, mayor ayuda y un objeto de preferencias reservado. Sin
datos personales, sin sincronización remota y sin persistir el origen de validación.

**Testing**: Vitest 4.1.12 en entorno `node` para progreso, flujo, validadores, puerta de validación y
contratos JSON con Ajv. La interfaz, el foco, el tamaño táctil y el lector de pantalla se verifican
manualmente con [`quickstart.md`](./quickstart.md), conforme al mínimo constitucional de UI. No se
añade un entorno DOM simulado ni un runner de navegador. No se ejecutan pruebas de backend porque no
hay backend nuevo.

**Target Platform**: navegadores modernos en computadora y tableta, con mouse, pantalla táctil y
teclado. La matriz de navegadores y dispositivos no se presume en este corte; se difiere a la spec de
UI/accesibilidad.

**Project Type**: aplicación web de frontend. El adaptador API es un consumidor opcional de un
endpoint ya configurado; no es un servicio ni un backend nuevo.

**Performance Goals**: no se fijan umbrales numéricos. La spec no declara un riesgo material de
rendimiento y la Constitución prohíbe inventar métricas sin método. Se exige que la selección y la
edición sean síncronas, que la validación no bloquee la interfaz y que la evidencia sea funcional, no
una medición de latencia.

**Constraints**: exactitud sin tolerancia; `a = 1` fijo en E08; `incomplete` como estado del cliente;
error técnico separado de `incorrect`; origen `local`/`API` sin fallback; progreso local versionado y
recuperable; 44×44 unidades de referencia; foco visible; color no único; sin temporizador, vidas,
puntos ni insignias; sin autenticación ni datos personales; sin backend nuevo; contenido de Acerca de
e introducción sujeto a aprobación.

**Scale/Scope**: 1 índice, 3 pantallas informativas, 1 introducción, 1 recorrido de prueba, 2
ejercicios (E01/E08), 2 validadores locales, 1 esquema de progreso, 1 puerta de validación con dos
adaptadores y 1 pantalla de recuperación de progreso.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Compuerta | Fuente | Resultado | Evidencia o nota |
|---|---|---|---|
| La spec está aprobada antes de planificar | Constitución, Principio VII y flujo, paso 2 | **PASS** | `spec.md` registra `Status: Aprobado` y veredicto `Aprobado` (2026-11-16, versión 0.1.0, aprobación explícita del Aprobador principal). |
| La checklist de calidad se revisó antes del veredicto | Constitución, flujo, paso 2 | **PASS con observación** | `checklists/requirements.md` está en 16/16. Su nota final conserva una frase obsoleta sobre la ausencia de 003; 003 ya existe. No se editó porque la etapa solo permite alternar casillas; se registra para corrección editorial. |
| Las ambigüedades que afectan el incremento están resueltas | Constitución, flujo, paso 2 | **PASS** | Las cinco respuestas de `Clarifications` (2026-11-16) están integradas: introducción real, E01 desbloquea E08, Continuar condicional, origen solo en pantalla y ausencia de mapa de zonas. |
| El alcance se limita al corte y no invade zonas, backend ni matemática de otros ejercicios | Constitución, Principios I–III; spec «Fuera de alcance» | **PASS** | Solo E01/E08; no hay mapa de zonas, E02–E07/E09–E15, backend nuevo, despliegue ni Modo estático de producto. |
| No se reabre el stack ni se añaden dependencias no aprobadas | Constitución, Principio II y VI | **PASS con condición** | React, PixiJS y Mafs son stack confirmado. Se proponen versiones concretas y Vite como herramienta de build; la instalación requiere la aprobación de este plan y de la implementación. No se añaden router, `@pixi/react`, `jsdom` ni Testing Library. |
| Los contratos se concretan antes de implementar | Constitución, Principio III | **PASS** | Phase 1 genera el esquema de progreso, el contrato de UI y el contrato de consumo de validación, además de ejemplos verificables. |
| La separación presentación/dominio/transporte/persistencia se conserva | Constitución, Principio IV | **PASS** | React conserva navegación y progreso; PixiJS/Mafs solo representan; LocalStorage se aísla en `shared/storage`; la validación se aísla en una puerta. |
| Estados explícitos y fallos visibles | Constitución, Principio V; REQ-14, REQ-17 | **PASS** | `incomplete`, `pending`, `correct`, `incorrect`, `indeterminate` y error técnico están separados; no hay fallback silencioso; una respuesta obsoleta se descarta. |
| Accesibilidad mínima de UI | Constitución, «Idioma, privacidad y accesibilidad»; REQ-10, REQ-18 | **PASS** | Contrato de UI con teclado, foco visible, 44×44, etiquetas, `aria-live`, alternativa textual al canvas y diálogos nativos; evidencia manual en quickstart. |
| La aprobación humana de la etapa está registrada | Constitución, Principio VII | **PASS con condición de etapa** | La spec está aprobada. Este plan se presenta con veredicto `en revisión`; no autoriza `/speckit.tasks` ni implementación hasta registrar la aprobación. |
| El registro externo de aprobaciones coincide | Constitución, Gobernanza | **PASS con observación** | `specs/README.md` contiene filas de 002 que no cubren esta revisión nueva del plan y conservan evidencia anterior. No se editó por instrucción de alcance; debe actualizarse al registrar el veredicto de este plan. |
| No se fabrican evidencias | Constitución, Principio VI | **PASS** | El plan no afirma código, pruebas, dependencias instaladas ni integración lograda. Los artefactos son diseño verificable. |

**Resultado de la compuerta: PASS para ejecutar Phase 0 y Phase 1**, con cuatro condiciones:
aprobar las dependencias propuestas, disponer del módulo de interacción de 003 antes de integrar,
registrar la aprobación de este plan antes de tareas y mantener la compuerta de contenido de Acerca
de/introducción. Ninguna condición autoriza implementación.

## Project Structure

### Documentation (this feature)

```text
specs/002-primer-recorrido/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-contract.md
│   ├── validation-consumer.md
│   ├── progress.schema.json
│   └── examples/
│       ├── progress.fresh.valid.json
│       ├── progress.e01-complete.valid.json
│       ├── progress.complete.valid.json
│       ├── progress.unknown-version.invalid.json
│       ├── progress.origin.invalid.json
│       ├── validation.e01.request.valid.json
│       ├── validation.e08.request.valid.json
│       ├── validation.result.valid.json
│       └── validation.error.valid.json
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── app/
│   │   ├── AppShell.tsx
│   │   ├── navigation.ts          # Máquina de pantallas
│   │   ├── config.ts              # Mecanismo local/API y URLs
│   │   └── content/               # Intro y Acerca de con approvalStatus
│   ├── features/
│   │   ├── index/                 # Índice y diálogo de nueva misión
│   │   ├── intro/                 # Introducción breve
│   │   ├── info/                  # Instrucciones, Cómo se Juega, Acerca de
│   │   ├── flow/                  # Recorrido de prueba y desbloqueo E01/E08
│   │   ├── exercises/
│   │   │   ├── ExerciseScreen.tsx # Marco común
│   │   │   ├── FeedbackPanel.tsx  # Resultado, diagnóstico y origen
│   │   │   ├── HelpPanel.tsx      # H1–H3
│   │   │   ├── e01/               # Validación y adaptador de E01
│   │   │   └── e08/               # Validación y adaptador de E08
│   │   └── recovery/              # Progreso ilegible o versión desconocida
│   ├── shared/
│   │   ├── storage/               # LocalStorage, esquema y respaldo
│   │   ├── validation/            # Núcleo 001 existente
│   │   ├── interaction/           # Contrato 003 consumido
│   │   ├── validation-gateway/    # Puerta local/API sin fallback
│   │   └── ui/                    # Botón, diálogo, estado y foco
│   └── zones/
│       ├── zone-1/                # PixiJS para E01
│       └── zone-3/                # Mafs para E08
└── tests/
    ├── progress/                  # Esquema, almacén y recuperación
    ├── flow/                      # Navegación y desbloqueo E01/E08
    ├── exercises/                 # Validadores y formatos exactos
    ├── validation-gateway/        # Local, API, fallos, respuestas tardías
    └── contracts/                 # Ejemplos JSON con Ajv
```

**Structure Decision**: se usa la estructura de aplicación web de la Constitución sin crear un
paquete nuevo. React y las pantallas viven en `src/features/`; la persistencia y la puerta de
validación, en `src/shared/`; PixiJS y Mafs, en `src/zones/`. El backend no se modifica. Las pruebas
de lógica pura replican la separación de `tests/validation/` de 001.

## Phase 0: Research

Las decisiones técnicas, alternativas y fundamentos están en [`research.md`](./research.md). No
quedan `NEEDS CLARIFICATION` en el Contexto Técnico.

Puntos que la spec deja como límites y que el plan no infiere:

- **Backend**: 002 no crea rutas, modelos ni dependencias de backend. El origen `API` solo existe si
  se configura un endpoint que cumpla 001; sin endpoint se muestra error técnico.
- **003**: la integración de interacción consume `frontend/src/shared/interaction/`. Si el módulo no
  existe al implementar, esa integración queda bloqueada; no se duplica la máquina.
- **Contenido**: Acerca de e introducción conservan `approvalStatus`; un contenido pendiente muestra
  aviso y no se inventa.
- **Dependencias**: React, PixiJS, Mafs y Vite se proponen con versiones concretas, pero no se
  instalan hasta la aprobación del plan y de la implementación.
- **Rendimiento**: no se fijan latencias, FPS ni volúmenes; la verificación es funcional y
  estructural.
- **Preferencias**: el progreso reserva `preferences: {}`; 002 no añade una pantalla de ajustes.

## Phase 1: Design & Contracts

Artefactos generados:

- [data-model.md](./data-model.md): pantallas, misión, progreso v1, borradores, intentos, sesión de
  ejercicio, ayudas, contenido y estados de persistencia, con invariantes y transiciones.
- [contracts/ui-contract.md](./contracts/ui-contract.md): inventario de pantallas, acciones, estados,
  flujo, compuerta de contenido y obligaciones de accesibilidad.
- [contracts/validation-consumer.md](./contracts/validation-consumer.md): puerta local/API, mapeo a
  los contratos de 001, códigos de diagnóstico, origen, correlación, fallos y ausencia de fallback.
- [contracts/progress.schema.json](./contracts/progress.schema.json): esquema JSON 2020-12 del
  progreso v1, con `additionalProperties: false`, pasos coherentes y origen excluido.
- [contracts/examples/](./contracts/examples/): progreso nuevo, E01 resuelto, recorrido completo,
  versión desconocida, origen persistido inválido, solicitudes E01/E08, resultado y error.
- [quickstart.md](./quickstart.md): comandos, escenarios automáticos de lógica pura, escenarios
  manuales de UI y accesibilidad, y plantilla de evidencia.

**Verificación de artefactos de Phase 1**: se comprobó la sintaxis JSON de los nueve ejemplos y del
esquema, se validó el esquema con Ajv 2020-12 en modo estricto y se verificó que los ejemplos válidos
se aceptan y los inválidos se rechazan. Las solicitudes, el resultado y el error de 002 se validaron
contra los esquemas canónicos de 001. Esta verificación es documental y de contrato; no acredita
implementación, pruebas de UI ni integración.

### Re-evaluación posterior a Phase 1

| Compuerta | Resultado | Evidencia |
|---|---|---|
| El contrato de UI cubre las nueve pantallas y las acciones del corte | **PASS** | `ui-contract.md` enumera índice, intro, recorrido, dos ejercicios, tres pantallas informativas, recuperación y confirmaciones. |
| El progreso cubre los campos de REQ-16 y no persiste el origen | **PASS** | `progress.schema.json` exige versión, misión, paso, resueltos, borradores, intentos, `maxHint` y preferencias; `origin` está prohibido por `additionalProperties: false`. |
| Los pasos del recorrido son coherentes | **PASS** | Las condicionales del esquema exigen `intro: []`, `E01: []`, `E08: ["E01"]` y `complete: ["E01","E08"]`, con el `activeExerciseId` correspondiente. |
| La validación E01/E08 y el origen están contratados | **PASS** | `validation-consumer.md` mapea `boolean` y `vertex`, códigos de diagnóstico, origen real y ausencia de fallback. |
| La dependencia 003 no se duplica | **PASS con condición** | El árbol consume `src/shared/interaction/`; la integración queda bloqueada hasta que ese módulo exista. |
| No se introduce backend ni dependencia no aprobada | **PASS con condición** | El backend no aparece en el árbol; las dependencias nuevas se enumeran para aprobación y no se instalan. |
| Accesibilidad y contenido tienen contrato | **PASS** | `ui-contract.md` fija teclado, foco, 44×44, `aria-live`, alternativa al canvas y compuerta de contenido. |
| La aprobación del plan está registrada | **PASS** | El bloque `## Aprobaciones` registra el veredicto `Aprobado` del Aprobador principal; autoriza la descomposición de tareas, no la implementación. |

No aparecieron violaciones nuevas durante el diseño. Se mantienen las condiciones de dependencias,
003, contenido y aprobación de etapa.

## Implementation Sequence (for a later authorized stage)

1. Aprobar e instalar las dependencias propuestas; añadir Vite, el punto de entrada y el árbol de
   pantallas.
2. Implementar el esquema de progreso, el almacén de LocalStorage, el respaldo y la recuperación.
3. Implementar la navegación, el índice, la introducción, las pantallas informativas y el diálogo de
   nueva misión.
4. Implementar el recorrido de prueba y el desbloqueo E01 → E08.
5. Implementar el marco de ejercicio, E01 con PixiJS y E08 con Mafs, sin validar en los renderizadores.
6. Implementar los validadores E01/E08 y la puerta local/API con correlación y fallos visibles.
7. Integrar el contrato de interacción 003, las ayudas, el foco, los anuncios y la accesibilidad.
8. Ejecutar las pruebas de lógica pura y los escenarios manuales de `quickstart.md`; registrar
   evidencia real y presentar el cierre.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| El módulo de 003 aún no existe al iniciar la integración. | Bloquear solo las tareas de interacción; avanzar en pantallas estáticas, progreso y validadores; no duplicar la máquina. |
| Compatibilidad de las versiones aprobadas por DV-001 aún sin verificar en este registro. | React/DOM 18.3.1 es el objetivo vigente; verificar montaje de PixiJS/Mafs antes de integrar y registrar evidencia. La aprobación de configuración no prueba compatibilidad ni autoriza funcionalidades. |
| No hay endpoint API en el incremento. | El camino local es el predeterminado; la API solo se usa si está configurada; el fallo se muestra como error técnico; el adaptador API se prueba con transporte falso. |
| Contenido de Acerca de o introducción sin aprobar. | `approvalStatus` controla el aviso; no se inventan datos ni narrativa; la compuerta se registra en la evidencia. |
| Progreso corrupto o de versión desconocida. | No se sobrescribe; `progress-recovery` ofrece misión nueva con confirmación y respaldo; prueba de JSON inválido y versión 2. |
| Respuesta de validación antigua aplicada al ejercicio nuevo. | Correlación por `requestId` y generación de 003; prueba de respuesta obsoleta; no se aplica si no coincide. |
| Fallback silencioso a local. | La puerta no tiene rama de fallback; prueba de API fallida que no invoca el validador local. |
| El canvas de E01 o la gráfica de E08 no son accesibles. | Descripción textual, controles fuera del canvas, etiquetas y evidencia manual de lector de pantalla. |
| La suite de Node no cubre la interfaz. | Pruebas de lógica pura y contratos; evidencia manual obligatoria; no se declara UI verificada sin ella. |
| Ruta profunda que salta la introducción o E08. | Navegación en memoria; `exercise:*` solo desde `flow`; prueba de arranque en índice y de bloqueo de E08. |
| Deriva entre el esquema de progreso y el modelo. | Esquema como fuente de la forma persistida; ejemplos válidos/inválidos con Ajv; invariantes en `data-model.md`. |
| Crecimiento del alcance hacia backend, zonas o victoria 15/15. | El plan y el contrato de UI excluyen backend, mapa y 15/15; cualquier ampliación requiere nueva spec y aprobación. |
| Registro de aprobaciones desalineado en `specs/README.md`. | No se usa como evidencia de esta revisión; se actualiza al registrar el veredicto del plan. |

## Aprobaciones de alcance limitado — DV-001

- **Fecha:** 2026-11-16, comprobada con `date -I`.
- **Aprobador:** Edwin Ernesto Rodríguez Pérez.
- **Evidencia en conversación:** «Ratifico la enmienda 1.1.0 de la Constitución y apruebo DV-001 con las versiones indicadas.»
- **Veredicto:** aprobado, limitado a [DV-001](../decisiones/DV-001.md) y las versiones del contexto técnico actualizado.
- **Alcance:** migración de configuración/dependencias, no implementación de funcionalidades. Requisitos matemáticos, API y especificaciones funcionales sin cambio; configuración y planes afectados.
- **Historia:** los comentarios originales sobre dependencias propuestas, instalación pendiente y React 19 son antecedentes sustituidos por esta autorización, no bloqueos vigentes de DV-001. Las aprobaciones de etapas y contenido conservan su alcance propio.
- **Evidencia pendiente:** este cambio documental no acredita instalación, pruebas ni auditoría limpia.

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Aprobación del plan técnico del primer recorrido |
| Veredicto | `Aprobado` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16, al autorizar la descomposición de tareas |
| Versión o revisión | `plan.md`, versión 0.1.0 |
| Comentarios o condiciones | Autoriza únicamente la descomposición de tareas (`tasks.md`). Esta requiere aprobación propia de las tareas. Las dependencias propuestas siguen sin aprobación de instalación; el módulo de interacción 003 debe existir antes de integrar la interacción; se mantiene la compuerta de contenido de Acerca de/introducción. |

Este plan no acredita implementación, pruebas ejecutadas ni integración con 001 o 003. La aprobación
de la spec no se extiende automáticamente a esta etapa ni a las posteriores. La aprobación de este
plan no autoriza instalar dependencias ni modificar el código de producto.
