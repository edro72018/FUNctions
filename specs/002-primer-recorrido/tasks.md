# Tasks: Primer recorrido — índice y recorrido E01/E08

**Input**: Documentos de diseño de `specs/002-primer-recorrido/`

**Prerequisites**: `plan.md` (aprobado), `spec.md` (aprobada), `research.md`, `data-model.md`,
`contracts/`, `quickstart.md`

**Tests**: incluidas. El plan y `quickstart.md` exigen pruebas automáticas de lógica pura con Vitest y
validación de contratos con Ajv. No se añade entorno DOM simulado ni runner de navegador; la interfaz
se verifica manualmente con `quickstart.md`.

**Estado**: Aprobado, Procede a Implementar

**Organization**: las tareas se agrupan por historia de usuario para que cada una pueda implementarse
y probarse de forma independiente. El orden de fases sigue la prioridad de `spec.md`: P1 (US1, US2,
US6), P2 (US3, US4, US7, US8) y P3 (US5).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de usuario a la que pertenece la tarea (`US1`…`US8`)
- Cada tarea incluye la ruta exacta del archivo que modifica o crea

## Path Conventions

- Aplicación web: `frontend/src/`, `frontend/tests/`
- No se crea backend ni se modifica `backend/`
- Los contratos de `specs/002-primer-recorrido/contracts/` se consumen; no se reescriben

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar la aplicación React/Vite y las dependencias aprobadas en el plan.

- [X] T001 Migrar la configuración a Node.js 24.22.1 e instalar en `frontend/package.json` las versiones exactas aprobadas por [DV-001](../decisiones/DV-001.md): `react@18.3.1`, `react-dom@18.3.1`, `pixi.js@8.23.0`, `mafs@0.21.0`; y en `devDependencies` `vite@7.3.8`, `@vitejs/plugin-react@5.1.0`, `@types/react@18.3.31`, `@types/react-dom@18.3.7`, `vitest@4.1.12`, `ajv@8.20.0`. Conservar `typescript@5.6.3` y fijar override `katex@0.19.1`. La autorización se limita a configuración/dependencias, no funcionalidades. No añadir `@pixi/react`, router, gestor de estado, `jsdom`, Testing Library, FastAPI ni SymPy.
- [X] T002 [P] Crear `frontend/index.html` con `lang="es"`, título «FUNctions» y el contenedor `#root`; sin scripts de terceros ni analítica externa.
- [X] T003 [P] Crear `frontend/vite.config.ts` con `@vitejs/plugin-react`, sin proxy ni configuración de backend.
- [X] T004 [P] Actualizar `frontend/tsconfig.json` con `"jsx": "react-jsx"`, inclusión de `src/**/*.tsx` y `tests/**/*.spec.ts`, manteniendo `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `lib` con `DOM` y `noEmit`.
- [X] T005 [P] Añadir a `frontend/package.json` los scripts `dev`, `build` y `preview` de Vite; mantener `typecheck`, `test` y `test:watch`.
- [X] T006 [P] Ajustar `frontend/vitest.config.ts` para incluir `tests/**/*.spec.ts` en entorno `node`, sin `jsdom` ni `happy-dom`.
- [X] T007 Crear `frontend/src/main.tsx` que monte `App` en `#root`, `frontend/src/App.tsx` como cascarón sin contenido visible ni navegación, y `frontend/src/app/global.css` con estilos base, foco visible y objetivos táctiles de al menos 44×44 unidades de referencia. La pantalla de índice, `AppShell` y la navegación pertenecen a T028. Aceptación: sin textos ni pantallas inventadas y `build` verde al cerrar la Fase 1.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: configuración, navegación, contenido, persistencia, puerta de validación y marco común
de ejercicio. Ninguna historia puede empezar sin esta fase.

**⚠️ CRITICAL**: no iniciar las historias de usuario hasta completar T008–T024.

- [X] T008 Crear `frontend/src/app/config.ts` con `AppConfig.validationMechanism: "local" | "api"` y URL de API opcional; si el valor falta o es inválido, o si el mecanismo es `api` sin URL, producir un error de configuración visible sin elegir un mecanismo por inferencia.
- [X] T009 Crear `frontend/tests/app/config.spec.ts` con los casos de configuración: `local` válido, `api` con URL válida, `api` sin URL como error de configuración y valor inválido como error; comprobar que no se selecciona `local` como respaldo.
- [X] T010 Crear `frontend/src/app/navigation.ts` con `AppScreen` (`index`, `intro`, `flow`, `instructions`, `how-to-play`, `about`, `exercise:E01`, `exercise:E08`, `progress-recovery`) y las guardas: `exercise:E01` solo desde `flow` tras `intro`; `exercise:E08` solo con E01 resuelto; `progress-recovery` sin Continuar y sin sobrescritura automática.
- [X] T011 Crear `frontend/tests/app/navigation.spec.ts` que verifique que E01 no es alcanzable desde el índice, que E08 no se alcanza sin E01 resuelto y que las pantallas informativas siempre pueden volver al índice.
- [X] T012 Crear `frontend/src/app/content/index.ts` con el tipo `ContentEntry` (`id: "intro" | "about"`, `approvalStatus: "approved" | "pending"`, `fields`) y el registro tipado de introducción y Acerca de; con `pending` no se inventan nombres, equipo, autoría ni licencia, y no se incluyen NASA, ANE ni logotipos oficiales.
- [X] T013 [P] Crear `frontend/src/shared/ui/` con `Button.tsx`, `Dialog.tsx`, `StatusRegion.tsx` y `focus.ts`: botones y campos nativos, `aria-live="polite"`, nombres accesibles, foco visible, cierre por `Escape` y retorno de foco; sin depender solo del color.
- [X] T014 [P] Crear `frontend/src/shared/storage/progress.ts` con los tipos `ProgressV1`, `Mission`, `FlowStep`, `ExerciseDraft`, `Attempt` y `PersistenceStatus`, respetando: `schemaVersion: 1` exacto; `flow.step` en `intro | E01 | E08 | complete`; `completedExerciseIds` sin duplicados, en orden `E01`, `E08`, máximo dos; `activeExerciseId` `null` en `intro` y `complete`; `attempts` solo con resultado `correct` o `incorrect` y `feedbackCode` con patrón `^[A-Z][A-Z0-9_]*$`; `preferences: {}` en v1; `maxHint` entero `0..3` monótono; `h`/`k` como `exactNumber | null`, nunca números JSON de punto flotante.
- [X] T015 Crear `frontend/src/shared/storage/schema.ts` que valide `ProgressV1` con Ajv 2020-12 contra `specs/002-primer-recorrido/contracts/progress.schema.json` en modo estricto y distinga JSON inválido, esquema inválido y `schemaVersion` desconocida.
- [X] T016 Crear `frontend/src/shared/storage/store.ts` y `frontend/src/app/useProgress.ts` para la clave `functions.progress.v1`: cargar, guardar y eliminar; reportar `available`, `saved`, `unavailable`, `corrupt` o `unknown-version`; si `setItem` falla, informar que no se guardó y no afirmar que el progreso se conservó; no persistir el origen de validación.
- [X] T017 Crear `frontend/src/shared/storage/recovery.ts` que, ante progreso corrupto o de versión desconocida, no sobrescriba ni descarte en silencio; «Iniciar misión nueva» exige confirmación y copia el contenido anterior a `functions.progress.v1.backup.<timestamp>` antes de escribir.
- [X] T018 [P] Crear `frontend/tests/progress/store.spec.ts` con A-01 (progreso nuevo), A-02 (E01 resuelto), A-03 (recorrido completo), A-04 (JSON inválido, esquema inválido y versión 2), A-05 (respaldo de recuperación) y A-06 (`setItem` que lanza).
- [X] T019 [P] Crear `frontend/tests/contracts/progress.spec.ts` que valide con Ajv `progress.fresh.valid.json`, `progress.e01-complete.valid.json` y `progress.complete.valid.json` contra `progress.schema.json`; rechace `progress.unknown-version.invalid.json` y `progress.origin.invalid.json`; compruebe que `origin` no puede persistirse y que `complete` exige `["E01","E08"]` con `activeExerciseId: null`.
- [X] T020 [P] Crear `frontend/src/shared/validation-gateway/types.ts` con `ValidationGateway`, `ValidationOutcome` (`status` en `correct | incorrect | indeterminate`, `origin` en `local | api`), `TechnicalError` (`format | incomplete | unsupported | configuration | transport | service`) y la regla de que `incomplete` es estado del cliente, no resultado matemático.
- [X] T021 Crear `frontend/src/shared/validation-gateway/local.ts`: adaptador local que usa el despachador de `frontend/src/shared/validation/`, recibe los validadores registrados por los ejercicios, conserva `requestId`, `exerciseId` y origen `local`, y verifica que un resultado local no declare `origin: "api"`.
- [X] T022 Crear `frontend/src/shared/validation-gateway/api.ts`: `POST` del `ValidationRequest` de 001 a la URL configurada, `AbortController` de 10 segundos configurables, solo `2xx` con resultado o error válido, sin reintentos automáticos y sin fallback local; un fallo se presenta como error técnico.
- [X] T023 Crear `frontend/tests/validation-gateway/gateway.spec.ts` con A-14 (`indeterminate` no es incorrecto ni crea intento), A-15 (error técnico con borrador intacto), A-16 (respuesta obsoleta descartada), A-17 (origen real por gateway) y A-18 (`api` sin URL o transporte fallido no ejecuta el validador local); usar un transporte falso, sin red real.
- [X] T024 Crear `frontend/src/features/exercises/ExerciseScreen.tsx`, `FeedbackPanel.tsx` y `HelpPanel.tsx`: marco común con Probar, Deshacer (revierte el último cambio confirmado y se deshabilita si no hay cambios), Reiniciar (restaura la configuración inicial y pide confirmación si hay cambios), Ayudas H1–H3, región de estado accesible, etiqueta de origen del resultado vigente, Continuar solo tras `correct` y Reintentar tras `incorrect`, `indeterminate` o error técnico; H1 disponible desde el inicio, H2 tras H1, H3 tras H2, y H3 no rellena ni envía la respuesta.

**Checkpoint**: configuración, navegación, persistencia, puerta de validación y marco de ejercicio listos.

---

## Phase 3: User Story 1 — Inicio (Priority: P1) 🎯 MVP de entrada

**Goal**: el índice muestra FUNctions, una descripción breve y las cuatro acciones base, sin
progreso inventado.

**Independent Test**: abrir la ruta inicial con LocalStorage limpio y comprobar nombre, descripción,
cuatro botones con etiqueta visible, Continuar ausente y ausencia de temporizador, vidas, puntos e
insignias.

- [X] T025 [P] [US1] Crear `frontend/src/features/index/indexActions.ts` con el selector de acciones del índice: cuatro acciones base siempre visibles y Continuar solo con progreso legible; sin temporizador, vidas, puntos ni insignias.
- [X] T026 [US1] Crear `frontend/tests/index/indexActions.spec.ts` que cubra AC-01 y AC-12: sin progreso no aparece Continuar; con progreso legible sí aparece; ninguna acción afirma progreso inexistente.
- [X] T027 [US1] Crear `frontend/src/features/index/IndexScreen.tsx` con nombre canónico **FUNctions**, descripción breve, cuatro acciones base con etiqueta visible y operación por teclado con foco visible.
- [X] T028 [US1] Crear `frontend/src/app/AppShell.tsx` y `frontend/src/App.tsx` para montar el índice como pantalla inicial, con navegación en memoria y sin router ni URLs profundas.

**Checkpoint**: US1 verificable de forma independiente. MVP de entrada demostrable.

---

## Phase 4: User Story 2 — Comenzar y Continuar (Priority: P1)

**Goal**: Comenzar crea una misión nueva y pasa por la introducción breve al recorrido con E01;
Continuar retoma el último punto guardado; Comenzar con progreso existente exige confirmación.

**Independent Test**: desde el índice, Comenzar sin progreso muestra la introducción y luego el
recorrido con E01; con progreso guardado aparece Continuar y restaura el punto de avance; Comenzar
pide confirmación y Cancelar conserva el progreso.

- [X] T029 [P] [US2] Crear `frontend/src/features/flow/flow.ts` con la secuencia `intro → E01 → E08 → complete`, E01 disponible al entrar, E08 bloqueado hasta que E01 esté resuelto y `complete` como recorrido terminado, nunca como 15/15 ni Zona 3 completa.
- [X] T030 [US2] Crear `frontend/tests/flow/flow.spec.ts` con A-02 y A-07: E01 resuelto produce paso `E08`, `completedExerciseIds: ["E01"]` y `activeExerciseId: "E08"`; E08 no se abre antes de resolver E01 y sí después, rotulado como avance parcial.
- [X] T031 [US2] Crear `frontend/src/features/intro/IntroScreen.tsx` como pantalla real y mínima: muestra el texto con `approvalStatus: approved` o un aviso explícito de contenido pendiente; su única acción de avance lleva al recorrido con E01 y no se puede saltar desde el índice.
- [X] T032 [US2] Crear `frontend/src/features/index/NewMissionDialog.tsx` con `<dialog>` nativo o equivalente: dos acciones explícitas «Iniciar misión nueva» y «Cancelar»; Cancelar conserva el progreso y devuelve el foco a Comenzar.
- [X] T033 [US2] Crear `frontend/src/features/flow/FlowScreen.tsx` que muestre el avance real de E01 y E08, permita abrir el ejercicio disponible, muestre E08 bloqueado con «Se desbloquea al resolver E01» y no incluya mapa de zonas.
- [X] T034 [US2] Conectar Continuar y Comenzar en `frontend/src/App.tsx` usando `store.ts` y `flow.ts`: Continuar restaura el último punto guardado sin borrar ni reiniciar; Comenzar con progreso legible abre el diálogo de confirmación; si un destino no está disponible, la acción se muestra deshabilitada con mensaje explícito y sin tono de error técnico.

**Checkpoint**: US1 y US2 funcionan juntas; el recorrido llega hasta E01 sin implementar su matemática.

---

## Phase 5: User Story 6 — E01 El Conector de Energía (Priority: P1)

**Goal**: E01 presenta el diagrama sagital fijo y clasifica la relación como función o no función,
con diagnóstico, ayudas H1–H3, reintentos y progreso.

**Independent Test**: presentar E01 sin selección y probar (incompleto); elegir «Es función» y probar
(correcto con avance); elegir «No es función» y probar (incorrecto con diagnóstico y reintento).

- [X] T035 [P] [US6] Crear `frontend/src/features/exercises/e01/definition.ts` con `exerciseId: "E01"`, zona 1, título «El Conector de Energía», `answerKind: "boolean"`, `requiredFields: ["selection"]`, opciones `true` = «Es función» y `false` = «No es función», `expected: true`, códigos `E01_FUNCTION_CONFIRMED` y `E01_SHARED_IMAGE_VALID`, y el diagrama fijo `A = {1,2,3}`, `B = {4,5}`, `R = {(1,4), (2,4), (3,5)}`.
- [X] T036 [P] [US6] Crear `frontend/src/features/exercises/e01/validateE01.ts` como función pura: `selection === null` produce `incomplete` sin envío; `value: true` produce `correct` con `E01_FUNCTION_CONFIRMED`; `value: false` produce `incorrect` con `E01_SHARED_IMAGE_VALID`; compartir la salida 4 no viola la unicidad.
- [X] T037 [US6] Crear `frontend/tests/exercises/e01.spec.ts` con A-08, A-09 y A-13: correcto, incorrecto por salida compartida y campo vacío que no crea intento.
- [X] T038 [US6] Crear `frontend/src/zones/zone-1/SagittalDiagram.tsx` con PixiJS: montar `Application` en `useEffect`, dibujar nodos y cables fijos, destruirla al desmontar, sin `@pixi/react` y sin escribir estado de dominio; incluir descripción textual equivalente y controles alternativos fuera del canvas.
- [X] T039 [US6] Crear `frontend/src/features/exercises/e01/hints.ts` con H1 (entradas una por una), H2 (existencia y unicidad) y H3 (definición formal); H1 disponible desde el inicio, H2 tras H1, H3 tras H2, y H3 no rellena ni envía la respuesta.
- [X] T040 [US6] Crear `frontend/src/features/exercises/e01/E01Screen.tsx` con las opciones mutuamente excluyentes, Probar, Deshacer, Reiniciar, Ayudas, región de estado, diagnóstico, origen y Continuar tras `correct`; registrar el validador en el gateway local, marcar E01 resuelto al recibir `correct` y conectar la apertura desde `FlowScreen` en `frontend/src/App.tsx`.

- [ ] T041 [US6] Crear `frontend/src/features/exercises/e01/interactionAdapter.ts` que consuma la API pública de `frontend/src/shared/interaction/` de 003 para los controles, `pending`, deshacer, reinicio, captura de puntero y anuncios. **Bloqueada hasta que exista ese módulo**; no duplicar la máquina de estados ni sustituirla por estado local ad hoc.
- [X] T042 [US6] Integrar E01 con `useProgress`/`store.ts` en `frontend/src/features/exercises/e01/E01Screen.tsx`: guardar borrador tras edición confirmada, actualizar `maxHint`, añadir `Attempt` solo con `correct` o `incorrect`, conservar el borrador ante error técnico y pasar el paso del recorrido a `E08` al resolver.

**Checkpoint**: E01 funciona con validación `boolean`, ayudas, diagnóstico y desbloqueo de E08, salvo
la integración de interacción 003 si el módulo aún no existe.

---

## Phase 6: User Story 3 — Instrucciones (Priority: P2)

**Goal**: Instrucciones muestra objetivo, reglas, progresión, victoria 15/15, reintentos y ayudas.

**Independent Test**: abrir Instrucciones desde el índice y comprobar los seis bloques, sin
temporizador, vidas, puntos ni insignias.

- [X] T043 [P] [US3] Crear `frontend/src/features/info/instructions.ts` con los seis bloques: objetivo educativo, reglas generales, progresión por zonas y niveles, condición de victoria 15/15, reintentos ilimitados y ayudas H1–H3; sin temporizador, vidas, puntos ni insignias.
- [X] T044 [US3] Crear `frontend/src/features/info/InstructionsScreen.tsx` que renderice el contenido, ofrezca volver al índice en una sola acción y conecte la acción Instrucciones del índice en `frontend/src/App.tsx`.

**Checkpoint**: US3 verificable de forma independiente.

---

## Phase 7: User Story 4 — Cómo se Juega (Priority: P2)

**Goal**: Cómo se Juega explica Probar, Deshacer, Reiniciar, Ayudas, la retroalimentación y el uso
con teclado, mouse o pantalla táctil.

**Independent Test**: abrir Cómo se Juega y comprobar las cuatro acciones, el significado de cada
tipo de retroalimentación y las instrucciones de teclado y touch.

- [X] T045 [P] [US4] Crear `frontend/src/features/info/howToPlay.ts` con las acciones Probar, Deshacer, Reiniciar y Ayudas H1–H3, el significado de `incomplete`, `correct`, `incorrect`, `indeterminate` y error técnico, y el uso de teclado, mouse y pantalla táctil.
- [X] T046 [US4] Crear `frontend/src/features/info/HowToPlayScreen.tsx` que renderice el contenido, ofrezca volver al índice en una sola acción y conecte la acción Cómo se Juega del índice en `frontend/src/App.tsx`.

**Checkpoint**: US4 verificable de forma independiente.

---

## Phase 8: User Story 7 — E08 Foco del Vértice (Priority: P2)

**Goal**: E08 ajusta `h` y `k` con `a = 1` fijo para que el vértice sea `(3, 2)`, con comparación
exacta, diagnóstico, ayudas, reintento y progreso.

**Independent Test**: presentar E08, fijar `h = 3` y `k = 2` (correcto y avance); repetir con
`h = −3` y con `h = 2.99` (incorrecto); probar con un campo vacío (incompleto).

- [X] T047 [P] [US7] Crear `frontend/src/features/exercises/e08/definition.ts` con `exerciseId: "E08"`, zona 3, título «Foco del Vértice», `answerKind: "vertex"`, `requiredFields: ["h","k"]`, `a = 1` fijo y no serializado, `expected: h = 3, k = 2`, códigos `E08_VERTEX_CONFIRMED`, `E08_VERTEX_SIGN` y `E08_VERTEX_MISMATCH`, y las ayudas H1–H3 definidas en la spec.
- [X] T048 [P] [US7] Crear `frontend/src/features/exercises/e08/numberInput.ts`: aceptar coma o punto decimal, normalizar a la gramática `exactNumber` de 001 (punto decimal, sin exponente, sin `+` inicial, sin separador de miles, sin redondeo); un campo vacío o no parseable produce `incomplete` con `h`/`k` en `null` y no se envía.
- [X] T049 [US7] Crear `frontend/tests/exercises/e08.spec.ts` con A-10, A-11, A-12, A-13 y A-20: `h=3,k=2` correcto; `h=-3,k=2` incorrecto con código de signo; `h=2.99,k=2` incorrecto sin redondeo; campo vacío incompleto; formatos `3`, `3,0`, `3.0`, `2,99`, `2.99` normalizados y `+3`, `3e0` rechazados.
- [X] T050 [US7] Crear `frontend/src/features/exercises/e08/validateE08.ts` como función pura: solo `h = 3` y `k = 2` son `correct`; `h = -3` produce `incorrect` con `E08_VERTEX_SIGN`; `h = 2.99`, otro `h` o `k ≠ 2` producen `incorrect` con `E08_VERTEX_MISMATCH`; `h` o `k` nulos producen `incomplete`; sin tolerancia.
- [X] T051 [US7] Crear `frontend/src/zones/zone-3/VertexGraph.tsx` con Mafs: representar `f(x) = (x − h)² + k` con `a = 1` y el punto objetivo `(3, 2)`, recibir `h` y `k` como propiedades y no validar, no persistir ni escribir estado de dominio; incluir descripción del punto objetivo y campos numéricos accesibles fuera de la gráfica.
- [X] T052 [US7] Crear `frontend/src/features/exercises/e08/E08Screen.tsx` con campos `h` y `k` etiquetados e `inputMode` decimal, Probar, Deshacer, Reiniciar, Ayudas, región de estado, diagnóstico, origen y Continuar tras `correct`; registrar el validador en el gateway local, marcar E08 resuelto al recibir `correct` y conectar la apertura desde `FlowScreen` en `frontend/src/App.tsx`.
- [ ] T053 [US7] Crear `frontend/src/features/exercises/e08/interactionAdapter.ts` que consuma la API pública de `frontend/src/shared/interaction/` de 003 para los controles exactos y el ciclo de interacción. **Bloqueada hasta que exista ese módulo**; no duplicar la máquina de estados.
- [X] T054 [US7] Integrar E08 con `store.ts`: guardar borrador tras edición confirmada, actualizar `maxHint`, añadir `Attempt` solo con `correct` o `incorrect`, conservar el borrador ante error técnico y pasar el paso del recorrido a `complete` al resolver.

**Checkpoint**: E01 y E08 funcionan por separado; el origen local/API se muestra en cada resultado.

---

## Phase 9: User Story 8 — Recorrido completo del corte (Priority: P2)

**Goal**: completar E01 y E08, guardar y restaurar el progreso, volver al índice y ver el origen de
cada validación sin fallback silencioso.

**Independent Test**: completar E01, continuar con E08, completar E08, recargar y comprobar que el
progreso y las respuestas evaluadas se conservan, que el recorrido refleja el avance y que cada
resultado muestra su origen local o API; con la API caída, comprobar error técnico y reintento sin
fallback.

- [X] T055 [US8] Crear `frontend/src/app/bootstrap.ts` que al arrancar cargue `functions.progress.v1`, restaure paso, resueltos y borradores, no restaure el origen, y derive a `progress-recovery` ante contenido corrupto o de versión desconocida.
- [X] T056 [US8] Completar en `frontend/src/app/useProgress.ts` las reglas del recorrido completo: guardar después de una edición confirmada, una consulta de ayuda y cada resultado evaluado; mantener `maxHint` monótono; no crear `Attempt` con `incomplete`, `indeterminate` o error técnico; nunca persistir `origin`.
- [X] T057 [US8] Crear `frontend/src/features/recovery/ProgressRecoveryScreen.tsx`: explica que el progreso no se pudo leer y no se sobrescribió, no ofrece Continuar, permite volver al índice y exige confirmación antes de iniciar una misión nueva con respaldo.
- [X] T058 [US8] Crear `frontend/src/features/recovery/PersistenceNotice.tsx` para informar que no se pudo guardar cuando LocalStorage no está disponible, sin afirmar que el progreso se conservó.
- [X] T059 [US8] Integrar en `frontend/src/app/AppShell.tsx` el recorrido E01 → E08 → índice: reanudar desde el último punto guardado, reflejar el avance real, rotular E08 como avance parcial y no mostrar mapa de zonas ni victoria 15/15.
- [X] T060 [US8] Crear `frontend/tests/flow/journey.spec.ts` que recorra la secuencia completa con gateways falsos: E01 correcto → paso E08; E08 correcto → `complete`; recarga restaura estado sin origen; resultado local se etiqueta `local`; resultado API se etiqueta `api`; fallo de API no activa el validador local.

**Checkpoint**: el corte vertical completo es verificable de forma independiente.

---

## Phase 10: User Story 5 — Acerca de (Priority: P3)

**Goal**: Acerca de muestra solo contenido aprobado o un aviso de contenido pendiente, sin
atribuciones institucionales reales.

**Independent Test**: abrir Acerca de con `approvalStatus: pending` y comprobar el aviso sin datos
inventados; cambiar a `approved` y comprobar nombre, propósito, equipo, autoría y licencia MIT; buscar
NASA, ANE y logotipos oficiales.

- [X] T061 [P] [US5] Crear `frontend/src/features/info/about.ts` con el contenido de Acerca de y `approvalStatus`; con `pending` no se muestran nombres, equipo, autoría ni licencia inventados; no se incluyen NASA, ANE ni logotipos oficiales.
- [X] T062 [US5] Crear `frontend/src/features/info/AboutScreen.tsx` que renderice contenido aprobado o el aviso explícito de contenido pendiente, ofrezca volver al índice en una sola acción y conecte la acción Acerca de del índice en `frontend/src/App.tsx`.

**Checkpoint**: las ocho historias son funcionales e independientemente verificables.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: verificación final, accesibilidad, evidencia y limpieza del corte.

- [X] T063 [P] Auditar que no existan temporizador, vidas, puntos, insignias, NASA, ANE, logotipos oficiales, router, `@pixi/react`, `jsdom`, Testing Library ni backend nuevo en `frontend/src/`, `frontend/index.html` y `frontend/package.json`; corregir cualquier aparición.
- [X] T064 Revisar accesibilidad en `frontend/src/features/` y `frontend/src/shared/ui/`: foco visible, orden de lectura, activación con `Enter`/`Space`, objetivos ≥ 44×44, etiquetas asociadas, `aria-live`, alternativa textual al canvas de E01 y descripción de la gráfica de E08.
- [X] T065 Ejecutar `npm run typecheck`, `npm test` y `npm run build` en `frontend/` y corregir los fallos; no añadir dependencias ni cambiar el stack para hacerlos pasar.
- [X] T066 Ejecutar los escenarios automáticos A-01…A-20 de `specs/002-primer-recorrido/quickstart.md` y registrar fecha, entorno, procedimiento, resultado y cobertura en la sección 6 de ese archivo; un escenario no ejecutado no cuenta como aprobado.
- [ ] T067 Ejecutar los escenarios manuales M-01…M-10 de `specs/002-primer-recorrido/quickstart.md` en `npm run dev`, con teclado, mouse y touch cuando sea posible, y registrar la evidencia en la sección 6 del mismo archivo.
- [X] T068 Revisar el cierre: confirmar que no se modificó `backend/`, que no se instalaron dependencias fuera de las aprobadas, que `specs/README.md` no se tocó sin autorización y que la implementación se detiene para aprobación de tareas y cierre.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sin dependencias; empieza de inmediato.
- **Foundational (Fase 2)**: depende de Setup; bloquea todas las historias.
- **Historias (Fases 3–10)**: dependen de Foundational.
  - US1 → US2 → US6 forman el corte mínimo jugable.
  - US3 y US4 dependen de US1 para la navegación desde el índice.
  - US7 depende de US6 (E01 resuelto desbloquea E08) y de `frontend/src/shared/interaction/` de 003 para la integración de interacción.
  - US8 depende de US6 y US7.
  - US5 depende de US1 para la navegación desde el índice.
- **Polish (Fase 11)**: depende de las historias que se decidan entregar.

### User Story Dependencies

- **US1 (P1)**: sin dependencias de otras historias; requiere Foundational.
- **US2 (P1)**: depende de US1 para entrar desde el índice.
- **US6 (P1)**: depende de US2 para el recorrido y de Foundational; la integración 003 queda bloqueada si el módulo no existe.
- **US3 (P2)**: depende de US1; no depende de US6.
- **US4 (P2)**: depende de US1; no depende de US6.
- **US7 (P2)**: depende de US6 y de 003; no puede abrirse antes de E01 resuelto.
- **US8 (P2)**: depende de US6 y US7.
- **US5 (P3)**: depende de US1; es independiente del recorrido.

### Within Each User Story

- Contenido y modelos antes de las pantallas.
- Validadores puros y sus pruebas antes de integrarlos en la pantalla.
- La pantalla antes de la persistencia y de la integración con 003.
- La integración de 003 no se sustituye por una máquina local.

### Parallel Opportunities

- Setup: T002–T006 pueden ejecutarse en paralelo después de T001; T007 depende de T002–T006.
- Foundational: T013, T014 y T020 tocan archivos distintos y pueden avanzar en paralelo; T015–T017 dependen de T014; T021–T022 dependen de T020; T018–T019 y T023 son pruebas que se ejecutan después de sus artefactos.
- US1: T025 antes de T026; T027 después; T028 al final.
- US2: T029 antes de T030; T031–T034 en secuencia.
- US6: T035 y T036 en paralelo; T037 después de T036; T038, T039 y T040 en secuencia; T041 bloqueada por 003; T042 después de T040.
- US3 y US4 pueden ejecutarse en paralelo entre sí tras US1.
- US7: T047 y T048 en paralelo; T049 se escribe después de T048 y antes de T050 (prueba primero); T050–T052 en secuencia; T053 bloqueada por 003; T054 después.
- US8: T055–T059 en secuencia; T060 después de T059.
- US5 es paralela a US3 y US4 tras US1.

---

## Parallel Example: User Story 6

```bash
# Contenido y validador de E01 pueden prepararse juntos:
Task: "Crear definition.ts de E01"
Task: "Crear validateE01.ts"

# Después, en secuencia:
Task: "Crear tests/exercises/e01.spec.ts"
Task: "Crear SagittalDiagram.tsx con PixiJS"
Task: "Crear hints.ts de E01"
Task: "Crear E01Screen.tsx"
```

## Parallel Example: User Story 7

```bash
# Contenido y normalización de E08:
Task: "Crear definition.ts de E08"
Task: "Crear numberInput.ts"

# Después, en secuencia:
Task: "Crear tests/exercises/e08.spec.ts"
Task: "Crear validateE08.ts"
Task: "Crear VertexGraph.tsx con Mafs"
Task: "Crear E08Screen.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US6)

1. Completar Fase 1 (Setup).
2. Completar Fase 2 (Foundational).
3. Completar US1 (índice), US2 (Comenzar/Continuar) y US6 (E01).
4. **STOP and VALIDATE**: verificar M-01, M-02, M-03 y M-04 de `quickstart.md`; E01 debe validar
   `boolean`, mostrar origen y desbloquear E08.
5. Presentar el MVP para revisión antes de continuar con US7 y US8.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 + US2 → entrada y recorrido hasta E01 (MVP de entrada).
3. US6 → primer ejercicio con validación real (MVP del corte).
4. US3 + US4 + US5 → pantallas informativas completas.
5. US7 + US8 → segundo ejercicio, persistencia, origen y recorrido completo.
6. Polish → accesibilidad, evidencia y cierre.

### Parallel Team Strategy

1. El equipo completa Setup + Foundational.
2. Después:
   - Persona A: US1 + US2.
   - Persona B: US6 (E01) cuando US2 esté disponible.
   - Persona C: US3 + US4 + US5 (pantallas informativas) en paralelo.
3. Al terminar US6: persona B continúa US7; persona A continúa US8.
4. La integración de 003 se asigna cuando `frontend/src/shared/interaction/` exista.

---

## Notes

- [P] indica archivos distintos y ausencia de dependencias pendientes.
- [US#] traza cada tarea a la historia de `spec.md`.
- Las pruebas automáticas cubren lógica pura; la UI, el foco, el tamaño táctil y el lector de pantalla
  se verifican manualmente.
- Las tareas T041 y T053 están bloqueadas hasta que exista `frontend/src/shared/interaction/` de 003.
- T013 y T024 se marcan tras la revisión estructural de T064; la verificación manual de foco, teclado,
  touch y lector de pantalla sigue en T067 y no se declara ejecutada.
- T067 queda pendiente: no se ejecutaron M-01…M-10 en navegador real. La evidencia automática de
  A-01…A-20 está registrada en `quickstart.md` §6.
- Verificación automatizada del 2026-11-17: `npm run typecheck` sin errores, `npm test` con 232
  pruebas aprobadas en 24 archivos y `npm run build` correcto con Vite 7.3.8.
- La condición original de T001 pendiente de aprobación de implementación es histórica: DV-001 autoriza ahora su alcance de configuración/dependencias. T001 se marca completada con la evidencia real de [DV-001](../decisiones/DV-001.md). Las demás tareas de funcionalidades conservan su compuerta de aprobación.
- T007 quedó completada con `App.tsx` como cascarón vacío, conforme a la aprobación de alcance limitado registrada. T028 conserva la pantalla de índice, `AppShell` y la navegación; no se creó contenido visible.
- No se implementa backend, router, `@pixi/react`, `jsdom` ni Testing Library.
- Detenerse al finalizar la implementación autorizada y presentar la evidencia; no se declara el
  incremento terminado sin las aprobaciones registradas.

---

## Aprobaciones de alcance limitado — T007

El 2026-11-17, Edwin Ernesto Rodríguez Pérez autorizó: «Autorizo la modificación de T007 en los términos propuestos y el registro de la aprobación de alcance limitado.»

Se registra **aprobado** el alcance limitado de T007: crear `main.tsx` y un `App.tsx` sin contenido visible ni navegación; T028 conserva la pantalla de índice, `AppShell` y la navegación. Motivo: el texto anterior exigía montar `App`, creada en T028, lo que producía una dependencia circular con la fase foundational. Aceptación: sin contenido inventado y build verde al cerrar la Fase 1.

Este registro reabre únicamente la descripción de T007 y su relación con T028; no autoriza funcionalidades adicionales ni modifica requisitos, contratos o el resto de tareas.

## Aprobaciones de alcance limitado — DV-001

El 2026-11-16, Edwin Ernesto Rodríguez Pérez confirmó en conversación: «Ratifico la enmienda 1.1.0 de la Constitución y apruebo DV-001 con las versiones indicadas.» Se registra **aprobado** el alcance de [DV-001](../decisiones/DV-001.md): configuración y dependencias de T001 con las versiones actualizadas, no implementación de funcionalidades ni aprobación global de estas tareas. Requisitos matemáticos, API y especificaciones funcionales sin cambio; configuración y planes afectados. La instalación, la auditoría y las pruebas ejecutadas constan en [DV-001](../decisiones/DV-001.md); por esa evidencia se marca completada T001. Este alcance limitado no acredita funcionalidades ni aprueba las demás tareas.

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Aprobación de la descomposición de tareas del primer recorrido |
| Veredicto | `Aprobado` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | lista de tareas aprobada por aprobador principal |
| Versión o revisión | `tasks.md`, versión 0.1.0 |
| Comentarios o condiciones | La implementación requiere veredicto `Aprobado` y confirmación de las dependencias propuestas; esa confirmación quedó satisfecha por [DV-001](../decisiones/DV-001.md) el 2026-11-16. Las tareas T041 y T053 siguen bloqueadas hasta que exista `frontend/src/shared/interaction/` de 003. |

La generación de esta lista no acredita implementación, pruebas ejecutadas ni integración con 001 o
003. La aprobación del plan no se extiende automáticamente a las tareas.
