# Implementation Plan: Contrato transversal de interacción 2D

**Branch**: `003-interaccion-2d` — la rama Git activa al generar este plan es
`feature/002-primer-recorrido`; no existe todavía `feature/003-interaccion-2d` (ver
[Riesgos](#riesgos-y-mitigaciones)). | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Especificación del contrato transversal de interacción 2D
(`specs/003-interaccion-2d/spec.md`, versión de trabajo 0.1.1, veredicto `Aprobado`).

**Note**: Este plan describe cómo se implementará el contrato en una etapa posterior. No se escribió
código de producto, no se ejecutaron pruebas de la implementación y no se instalaron dependencias.
La aprobación de este plan solo habilitará la descomposición de tareas, no la implementación.

## Summary

El incremento entrega un módulo transversal, puro y agnóstico al renderizador que formaliza la
máquina de estados de interacción descrita en la spec: dos ámbitos independientes —control y
validación—, diez acciones semánticas, los eventos de puntero y teclado admitidos, las transiciones
permitidas y prohibidas, la captura de puntero, la cancelación, el deshacer por ejercicio, el bloqueo
durante `pending`, el descarte de respuestas obsoletas y el contrato de anuncios accesibles.

La solución técnica es un **reducer síncrono en TypeScript estricto** dentro de
`frontend/src/shared/interaction/`, sin dependencias de ejecución y sin importar React, PixiJS, Mafs,
DOM, LocalStorage ni el núcleo de validación. El adaptador de cada consumidor traduce eventos del
dispositivo a **intentos normalizados**; el reducer valida la transición y devuelve el siguiente
estado junto con **efectos como datos** (anunciar, enfocar, capturar o liberar puntero, solicitar
validación, confirmar valor, rechazar acción). Los valores matemáticos son opacos para el contrato:
el consumidor calcula la geometría y entrega el valor propuesto; el contrato solo decide cuándo se
confirma, se descarta o se conserva.

La fuente normativa de estados, acciones, transiciones y anuncios sigue siendo `spec.md`. Los
artefactos de Phase 1 traducen esa fuente a tipos, esquemas, invariantes y escenarios verificables,
sin añadir estados, acciones ni transiciones propias.

## Technical Context

**Language/Version**: TypeScript 5.6.3 con modo estricto (`strict`,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`) sobre
Node.js 20.20.2 para pruebas y navegadores modernos con `lib: ES2022 + DOM` para el adaptador del
consumidor. El módulo en sí no usa APIs del DOM.

**Primary Dependencies**: Ninguna dependencia de ejecución. Herramientas de desarrollo ya presentes
en `frontend/`: TypeScript 5.6.3, Vitest 2.1.1 y Ajv 8.17.1. React, PixiJS y Mafs pertenecen a los
consumidores y no se instalan ni se importan en este incremento. No se añaden paquetes.

**Storage**: N/A. El contrato mantiene el estado de la sesión de interacción en memoria. No escribe
en LocalStorage, no versiona progreso y no define qué se guarda entre recargas; el borrador que el
consumidor conserve al salir es responsabilidad de la spec de progreso.

**Testing**: Vitest 2.1.1 en `environment: 'node'`, con pruebas puras del reducer, la tabla de
transiciones, la captura de puntero, la historia de deshacer, los anuncios y la arquitectura de
importaciones. La validación de los esquemas JSON de `contracts/` se ejecuta con Ajv dentro de
Vitest. No se añaden `jsdom`, `happy-dom` ni un runner de navegador: la integración DOM real se
verifica manualmente en las specs consumidoras, conforme al mínimo constitucional de UI.

**Target Platform**: Navegadores modernos de computadora y tableta con mouse, touch y teclado. El
módulo se ejecuta igual en Node durante las pruebas porque no depende del DOM ni del renderizador.

**Project Type**: Módulo transversal de frontend (librería interna) consumido por 002 y por las
zonas 004–008; no es una aplicación, un servicio ni un paquete publicado.

**Performance Goals**: No se fijan umbrales numéricos de latencia, FPS ni volumen. La spec no declara
un riesgo material de rendimiento y la Constitución prohíbe inventar umbrales sin método. Se exige
que cada transición sea síncrona, sin temporizadores, sin `requestAnimationFrame` interno y con costo
constante respecto del número de estados; la verificación es estructural y por pruebas, no una
medición de latencia.

**Constraints**: Cero dependencias nuevas; cero imports de React/PixiJS/Mafs/DOM/LocalStorage/HTTP;
doce estados y diez acciones exactamente; toda transición no enumerada queda prohibida; una sola
solicitud vigente por ejercicio; `success` solo mediante «Continuar» desde `correct`; siete estados
anunciados y cinco no anunciados; objetivos táctiles mínimos de 44×44 unidades de referencia
expuestos como constante y verificados en los consumidores; color nunca como único portador.

**Scale/Scope**: 24 requisitos, 22 criterios de aceptación, 12 resultados medibles, 12 estados,
10 acciones semánticas, 17 transiciones de control, 12 transiciones de validación y 9 transiciones
prohibidas. Consumidores previstos: 002 (corte vertical E01/E08) y 004–008 (zonas restantes).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Compuerta | Fuente | Resultado | Evidencia o nota |
|---|---|---|---|
| La spec está aprobada antes de planificar | Constitución, Principio VII y flujo de trabajo, paso 2 | **PASS** | `spec.md` registra `Status: Aprobado` y veredicto `Aprobado` (2026-11-16, versión 0.1.1, evidencia «spec para plan»). |
| La checklist de calidad se revisó antes del veredicto | Constitución, flujo de trabajo, paso 2 | **PASS con observación** | `checklists/requirements.md` está en 16/16. Su nota final conserva una frase obsoleta sobre «cuatro decisiones»; la sección de decisiones pendientes ya no existe. No se editó porque la etapa solo permite alternar casillas; se registra para corrección editorial. |
| Las ambigüedades que afectan el incremento están resueltas | Constitución, flujo de trabajo, paso 2 | **PASS** | Las cinco decisiones de `Clarifications` están integradas. No quedan marcadores de aclaración pendientes. La ausencia de objetivo de latencia se resuelve como «sin umbral inventado» y transiciones síncronas. |
| El alcance se limita al contrato y no invade matemática, persistencia ni renderizador | Constitución, Principios II y III; spec «Fuera de alcance» | **PASS** | El árbol de código excluye validadores, LocalStorage, HTTP, PixiJS y Mafs. Los valores son opacos; los resultados `correct`/`incorrect`/`indeterminate` se consumen de 001, no se redefinen. |
| No se reabre el stack ni se añaden dependencias | Constitución, Principio II y VI | **PASS** | Solo se usan TypeScript y Vitest ya instalados. Los esquemas se validan con Ajv ya instalado. No se instala React, PixiJS, Mafs ni ninguna otra biblioteca. |
| Estructura, estilo y trazabilidad | Constitución, Principio IV | **PASS con condición administrativa** | El módulo va en `frontend/src/shared/interaction/` y las pruebas en `frontend/tests/interaction/`. Se conservan `REQ`, `AC` y `SC`. La rama Git activa es `feature/002-primer-recorrido` y no existe `feature/003-interaccion-2d`; la rama correcta debe existir antes de `/speckit.tasks` o de implementar. No se cambia de rama sin autorización. |
| Estados explícitos y fallos visibles | Constitución, Principio V; REQ-01, REQ-12 | **PASS** | Los doce estados, el error técnico, `incomplete` como estado de entrada y el descarte de respuestas obsoletas están cubiertos por el diseño y por pruebas previstas. |
| Accesibilidad mínima de UI | Constitución, «Idioma, privacidad y accesibilidad»; REQ-14…REQ-17, REQ-21 | **PASS** | El contrato expone foco visible, paridad de teclado, 44×44 como constante, pista no cromática por estado y siete anuncios accesibles; la verificación visual final es manual en cada consumidor. |
| La aprobación humana de la etapa está registrada | Constitución, Principio VII | **PASS con condición de etapa** | La spec está aprobada. Este plan se presenta con veredicto `en revisión`; no se autoriza `/speckit.tasks` ni implementación hasta registrar la aprobación. |
| No se fabrican evidencias | Constitución, Principio VI | **PASS** | El plan no afirma código escrito, pruebas ejecutadas ni integración lograda. Los artefactos son diseño verificable y se identifican como tales. |

**Resultado de la compuerta: PASS para ejecutar Phase 0 y Phase 1**, con dos condiciones
administrativas: crear/usar la rama `feature/003-interaccion-2d` antes de la etapa de tareas y
registrar la aprobación de este plan antes de continuar. Ninguna condición autoriza implementación.

## Project Structure

### Documentation (this feature)

```text
specs/003-interaccion-2d/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── interaction-contract.md
│   ├── interaction-event.schema.json
│   ├── interaction-effect.schema.json
│   └── examples/
│       ├── event.pointer.valid.json
│       ├── event.pointer.editing.valid.json
│       ├── event.keyboard.valid.json
│       ├── event.invalid.json
│       ├── effect.announce.valid.json
│       └── effect.focus.valid.json
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   └── shared/
│       └── interaction/
│           ├── contracts/
│           │   ├── types.ts          # Estados, acciones, eventos, efectos y valores opacos
│           │   └── validate.ts       # Guardas de pertenencia y forma de los datos del contrato
│           ├── machine/
│           │   ├── machine.ts        # Reducer puro y estado inicial de la sesión
│           │   ├── transitions.ts    # Catálogo C-01…C-17, V-01…V-12, X-01…X-09
│           │   └── guards.ts         # Pending, solicitud vigente, éxito solo por Continuar
│           ├── session/
│           │   ├── capture.ts        # Puntero activo, valor transitorio y segundo contacto
│           │   ├── history.ts        # Historia de deshacer por ejercicio
│           │   └── requests.ts       # Correlación y descarte de respuestas obsoletas
│           ├── accessibility/
│           │   ├── announcements.ts  # Siete estados anunciados y cinco silenciosos
│           │   └── presentation.ts   # Pista no cromática, etiqueta y mínimo 44×44
│           ├── index.ts              # API pública del contrato
│           └── README.md             # Guía breve de consumo para 002 y 004–008
└── tests/
    └── interaction/
        ├── transitions.spec.ts       # AC-02, AC-03, AC-16, AC-17, AC-22
        ├── pointer.spec.ts           # AC-04, AC-05, AC-06, AC-19, AC-21
        ├── editing.spec.ts           # AC-20 y confirmación de edición
        ├── session.spec.ts           # AC-07, AC-08, AC-09, AC-10, AC-11, AC-13
        ├── announcements.spec.ts     # AC-12, AC-18 y SC-11
        ├── presentation.spec.ts      # AC-12, AC-14, AC-15
        ├── contracts.spec.ts         # Esquemas Ajv y ejemplos de contracts/
        ├── architecture.spec.ts      # REQ-20, REQ-22: sin DOM, renderizador ni persistencia
        └── fixtures.ts               # Estados, eventos y resultados compartidos
```

**Structure Decision**: Se usa la estructura de aplicación web de la Constitución sin crear un
paquete nuevo. El contrato es una función transversal de `frontend/src/shared/`, no una zona ni una
feature. `src/shared/interaction/` contiene únicamente lógica pura; los adaptadores de React, PixiJS
y Mafs viven en los consumidores. `tests/interaction/` replica la separación de
`tests/validation/` de 001 y no importa componentes.

## Phase 0: Research

Las decisiones técnicas, alternativas y fundamentos están en [research.md](./research.md). No quedan
incógnitas técnicas abiertas en el Contexto Técnico. Los puntos que la spec deja al consumidor se tratan
como parámetros explícitos y no como decisiones inferidas:

- La validez sintáctica del borrador la aporta el consumidor; el contrato no interpreta matemática.
- El paso de las flechas, la geometría del arrastre y el conjunto de cada grupo los declara el
  consumidor.
- La presentación visual concreta y la duración de animaciones pertenecen al consumidor; el contrato
  solo exige pista no cromática, foco y anuncio.
- La persistencia del borrador entre recargas pertenece a la spec de progreso; aquí solo se define la
  sesión en memoria y el reinicio de la historia al salir del ejercicio.

## Phase 1: Design & Contracts

Artefactos generados:

- [data-model.md](./data-model.md): entidades, campos, invariantes, ciclos de vida de la solicitud,
  la captura, el borrador y la historia de deshacer, y reglas de validación derivadas de la spec.
- [contracts/interaction-contract.md](./contracts/interaction-contract.md): API pública prevista,
  eventos de dispositivo, intentos normalizados, efectos, acciones semánticas, anuncios,
  obligaciones del consumidor, versionado y matriz de conformidad `REQ`/`AC`.
- [contracts/interaction-event.schema.json](./contracts/interaction-event.schema.json): sobre JSON
  del intento normalizado, con `sourceEvent`, `controlId`, `pointerId`, `key`, modificadores y valor
  opaco.
- [contracts/interaction-effect.schema.json](./contracts/interaction-effect.schema.json): efectos
  como datos (`announce`, `focus`, `capture-pointer`, `release-pointer`, `request-validation`,
  `abandon-request`, `commit-value`, `show-field-error`, `reject-action`, `reset-session`).
- [contracts/examples/](./contracts/examples/): ejemplos válidos e inválidos para validar los
  esquemas con Ajv y para fijar la forma esperada por los consumidores.
- [quickstart.md](./quickstart.md): comandos de verificación y escenarios manuales con resultado
  esperado, sin duplicar el modelo ni el contrato.

**Verificación de artefactos de Phase 1**: se validó la sintaxis JSON de ambos esquemas con Ajv
2020-12 en modo estricto, y se comprobó que los cinco ejemplos válidos compilan y que
`event.invalid.json` se rechaza. También se revisó la cobertura documental de los doce estados, las
diez acciones, los siete anuncios y los conteos 17/12/9 de transiciones. Esta verificación es
documental y de contrato; no acredita implementación, pruebas de la máquina ni integración con
consumidores.

### Re-evaluación posterior a Phase 1

| Compuerta | Resultado | Evidencia |
|---|---|---|
| Los contratos cubren estados, acciones, eventos, efectos y anuncios | **PASS** | `interaction-contract.md` enumera 12 estados, 10 acciones, 7 anuncios, 5 estados silenciosos y los conteos de transiciones; los esquemas fijan la forma de eventos y efectos. |
| Ninguna transición nueva ni estado paralelo | **PASS** | `data-model.md` deriva las tablas de `spec.md` y asigna IDs C/V/X por orden, sin añadir filas. Los consumidores solo declaran pasos y presentación. |
| La separación entre interacción y matemática se mantiene | **PASS** | Los valores son opacos; el contrato no normaliza, compara ni valida respuestas. La validez sintáctica y los campos obligatorios los aporta el consumidor. |
| El bloqueo de `pending`, el descarte de respuestas y el éxito explícito están diseñados | **PASS** | `data-model.md` define `pending` bloqueante, correlación por `requestId`/generación y guarda de `success` solo desde `correct` con «Continuar». |
| Accesibilidad y tamaño táctil tienen contrato | **PASS** | `presentation.ts` exige etiqueta y pista no cromática; `MIN_TARGET_SIZE = 44`; `announcements.ts` limita los anuncios a siete estados. |
| No se introducen dependencias ni acoplamiento al renderizador | **PASS** | El árbol no importa DOM, React, PixiJS, Mafs, LocalStorage ni HTTP; la prueba de arquitectura lo verifica. |
| La aprobación del plan está registrada | **PASS con condición** | El bloque `## Aprobaciones` de este plan queda en `en revisión`; la etapa de tareas no está autorizada hasta el veredicto. |

No aparecieron violaciones nuevas durante el diseño. Se mantiene la condición administrativa de la
rama y la condición de aprobación de etapa.

## Implementation Sequence (for a later authorized stage)

1. Definir los tipos y guardas del contrato, y validar los esquemas y ejemplos con Ajv.
2. Implementar el reducer puro y el catálogo de transiciones con sus guardas, sin efectos externos.
3. Implementar la captura de puntero, la sesión de edición, la historia de deshacer y la correlación
   de solicitudes.
4. Implementar anuncios, presentación no cromática y la constante de 44×44.
5. Añadir las pruebas de transiciones, puntero, edición, sesión, anuncios, presentación, contratos y
   arquitectura.
6. Publicar la API del módulo y documentar el adaptador para 002 y 004–008; la integración real en
   cada consumidor se planifica y aprueba en su propia spec.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| Rama incorrecta (`feature/002-primer-recorrido`) para la spec 003. | Crear o cambiar a `feature/003-interaccion-2d` antes de `/speckit.tasks` o de implementar; no se cambia de rama sin autorización del Aprobador. |
| Deriva entre la spec y el catálogo de transiciones. | El catálogo se deriva por orden de las tablas de `spec.md`; una prueba comprueba los conteos 17/12/9 y que no existan entradas adicionales. |
| Ambigüedad entre «valor inválido» y «campo obligatorio vacío». | El contrato separa **forma sintáctica** (decide si se puede salir de `editing`) de **completitud requerida** (decide `incomplete` al probar). Así `incomplete` no se convierte en resultado matemático y se respetan AC-20 y la fila de borde correspondiente. |
| Acoplamiento accidental al renderizador o a la persistencia. | Prueba de arquitectura que prohíbe imports de DOM, React, PixiJS, Mafs, LocalStorage y HTTP; revisión de la API pública. |
| Doble anuncio por re-render del consumidor. | El reducer emite el anuncio solo al entrar en uno de los siete estados, con un `sequence` monotónico; el consumidor lo publica una vez. |
| Segundo contacto táctil que sustituya la captura. | Se conserva `activePointerId`; todo evento de otro `pointerId` durante `dragging` se ignora y no produce efectos. |
| Respuesta antigua aplicada al ejercicio nuevo. | Correlación por `requestId` y generación de ejercicio; al cambiar de ejercicio se abandona la solicitud y se incrementa la generación. |
| `success` automático o repetido. | Guarda explícita: solo `correct` + acción «Continuar»; `success` no se repite sin una nueva validación. |
| Dependencias de prueba no aprobadas. | No se instala `jsdom`, `happy-dom` ni runners de navegador; la UI se verifica manualmente en los consumidores. |
| Objetivos táctiles y foco no verificables en Node. | El contrato expone la constante y los descriptores; la evidencia de 44×44 y foco visible se recoge manualmente en cada consumidor. |
| Nota obsoleta en la checklist de requisitos. | Se registra para corrección editorial en una etapa que permita editar el archivo; no afecta el veredicto 16/16. |

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Aprobación del plan técnico del contrato de interacción 2D |
| Veredicto | `en revisión` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | plan para revisión |
| Versión o revisión | `plan.md`, versión 0.1.0 |
| Comentarios o condiciones | Autoriza únicamente la revisión de este plan. No autoriza `/speckit.tasks` ni la implementación. Antes de continuar debe existir la rama `feature/003-interaccion-2d` y registrarse el veredicto del Aprobador. |

Este plan no acredita implementación, pruebas ejecutadas ni integración con 002 o 004–008. La
aprobación de la spec no se extiende automáticamente a esta etapa ni a las posteriores.
