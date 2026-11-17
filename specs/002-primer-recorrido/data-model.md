# Data Model: Primer recorrido — índice y recorrido E01/E08

**Feature**: `002-primer-recorrido` | **Fecha**: 2026-11-16 | **Estado**: diseño para revisión

Este documento define las entidades, estados, invariantes y reglas de validación del corte vertical
que une el índice, la introducción, el recorrido de prueba E01/E08, la validación y el progreso
local. La forma persistida se formaliza en
[`contracts/progress.schema.json`](./contracts/progress.schema.json).

No se modela una base de datos remota, autenticación ni datos personales. El backend no forma parte
de este incremento: el origen `API` corresponde a un adaptador que consume un servicio ya
configurado, no a un backend nuevo de 002.

## Convenciones generales

- Los identificadores usan `camelCase`; los tipos y enumerados usan `PascalCase`.
- Los identificadores de ejercicio son estables: `E01` y `E08`.
- Los números matemáticos persistidos usan la gramática `exactNumber` de
  [`001-nucleo-validacion`](../001-nucleo-validacion/contracts/answer.schema.json); nunca se guardan
  como números JSON de punto flotante.
- El origen de una validación (`local` o `API`) es estado de sesión y **no** se persiste.
- `incomplete` es un estado de entrada del cliente, no un resultado matemático.
- Un error técnico es una categoría distinta de `incorrect` e `indeterminate`.

---

## 1. `AppScreen` y `NavigationState`

Pantalla activa del corte. La navegación se mantiene en React y no se deriva de una URL profunda.

| Valor | Propósito | Origen permitido |
|---|---|---|
| `index` | Índice inicial | Ruta inicial, acción «Volver al índice» |
| `intro` | Introducción breve | Comenzar, Continuar |
| `flow` | Recorrido de prueba E01/E08 | Comenzar, Continuar, resultado correcto |
| `instructions` | Instrucciones | Índice |
| `how-to-play` | Cómo se Juega | Índice |
| `about` | Acerca de | Índice |
| `exercise:E01` | Ejercicio E01 | Recorrido, Continuar |
| `exercise:E08` | Ejercicio E08 | Recorrido, Continuar |
| `progress-recovery` | Progreso ilegible o de versión desconocida | Arranque con progreso no legible |

**Invariantes**:

- `exercise:E01` no es alcanzable desde el índice sin pasar por `intro` y `flow`.
- `exercise:E08` no es alcanzable sin E01 resuelto.
- `progress-recovery` no ofrece Continuar ni sobrescribe el progreso automáticamente.
- Las pantallas informativas siempre ofrecen una acción de regreso al índice.

---

## 2. `Mission`

Partida local del recorrido de prueba. No se asocia a una cuenta ni a datos personales.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `missionId` | string UUID v4 | Sí | Identificador local de la misión; no es credencial |
| `startedAt` | string `date-time` | Sí | Momento de creación de la misión |
| `lastSavedAt` | string `date-time` | Sí | Última escritura confirmada en LocalStorage |

Una misión nueva solo se crea tras Comenzar sin progreso o tras la confirmación explícita de
reemplazo. Continuar no crea una misión.

---

## 3. `ProgressV1`

Estado persistido en `LocalStorage` bajo la clave `functions.progress.v1`.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `schemaVersion` | `1` | Sí | Versión exacta del esquema; una versión distinta se trata como desconocida |
| `mission` | `Mission` | Sí | Misión local activa |
| `flow.step` | `"intro" \| "E01" \| "E08" \| "complete"` | Sí | Paso actual del recorrido de prueba |
| `completedExerciseIds` | `("E01" \| "E08")[]` | Sí | Sin duplicados; orden serializado `E01`, `E08`; máximo dos |
| `activeExerciseId` | `"E01" \| "E08" \| null` | Sí | `null` en `intro` y `complete` |
| `drafts` | `object` | Sí | Borradores por ejercicio; puede ser `{}` al inicio |
| `attempts` | `Attempt[]` | Sí | Solo intentos con resultado `correct` o `incorrect` |
| `preferences` | `object` | Sí | Objeto reservado; en v1 se persiste `{}` |

### 3.1 `FlowStep`

| Valor | Significado | `activeExerciseId` |
|---|---|---|
| `intro` | Introducción pendiente | `null` |
| `E01` | E01 disponible o en curso | `E01` |
| `E08` | E01 resuelto; E08 disponible o en curso | `E08` |
| `complete` | Recorrido de prueba completo; no equivale a 15/15 | `null` |

### 3.2 `ExerciseDraft`

| Ejercicio | Campo | Tipo | Regla |
|---|---|---|---|
| E01 | `kind` | `"boolean"` | Discriminante fijo |
| E01 | `selection` | `boolean \| null` | `true` = «Es función»; `false` = «No es función»; `null` = sin selección |
| E01 | `maxHint` | entero `0..3` | Mayor ayuda consultada; monótono |
| E08 | `kind` | `"vertex"` | Discriminante fijo |
| E08 | `h` | `exactNumber \| null` | Valor exacto confirmado; `null` si está vacío |
| E08 | `k` | `exactNumber \| null` | Valor exacto confirmado; `null` si está vacío |
| E08 | `maxHint` | entero `0..3` | Mayor ayuda consultada; monótono |

El borrador guarda valores confirmados, no el texto transitorio del campo. Un texto inválido no se
persiste como valor matemático: permanece en el estado local del formulario hasta que se corrige o se
descarta.

### 3.3 `Attempt`

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `exerciseId` | `"E01" \| "E08"` | Sí | Ejercicio evaluado |
| `result` | `"correct" \| "incorrect"` | Sí | Solo resultados matemáticos que cuentan como intento |
| `feedbackCode` | string `^[A-Z][A-Z0-9_]*$` | Sí | Código estable de 001 o código aditivo del consumidor |
| `at` | string `date-time` | Sí | Momento del resultado |

No se guardan `origin`, `message`, la respuesta enviada ni datos personales. `indeterminate`,
`incomplete` y el error técnico no crean `Attempt`.

### 3.4 `preferences`

En esta versión se persiste `{}`. El campo existe porque REQ-16 lo exige en la forma del progreso,
pero 002 no define una pantalla de ajustes ni una preferencia configurable. Una ampliación futura
requiere una nueva versión del esquema.

---

## 4. `ExerciseDefinition`

Definición fija de los dos ejercicios del corte. No se infiere desde el texto de la interfaz.

### 4.1 E01 — El Conector de Energía

| Campo | Valor |
|---|---|
| `exerciseId` | `E01` |
| `zone` | `1` |
| `title` | El Conector de Energía |
| `answerKind` | `boolean` |
| `requiredFields` | `selection` |
| `options` | `true` = Es función; `false` = No es función |
| `expected` | `true` |
| `correctFeedback` | `E01_FUNCTION_CONFIRMED` |
| `incorrectFeedback` | `E01_SHARED_IMAGE_VALID` |
| `hints` | H1: entradas una por una; H2: existencia y unicidad; H3: definición formal |
| `completion` | Resultado `correct`; «Continuar» avanza al recorrido |

El diagrama es fijo: `A = {1,2,3}`, `B = {4,5}` y `R = {(1,4), (2,4), (3,5)}`. Compartir la salida
`4` no viola la unicidad.

### 4.2 E08 — Foco del Vértice

| Campo | Valor |
|---|---|
| `exerciseId` | `E08` |
| `zone` | `3` |
| `title` | Foco del Vértice |
| `answerKind` | `vertex` |
| `requiredFields` | `h`, `k` |
| `fixed` | `a = 1`; no se serializa en la respuesta `vertex` |
| `expected` | `h = 3`, `k = 2` |
| `correctFeedback` | `E08_VERTEX_CONFIRMED` |
| `incorrectFeedback` | `E08_VERTEX_SIGN` si `h = -3`; en otro caso `E08_VERTEX_MISMATCH` |
| `hints` | H1: vértice actual vs. objetivo; H2: cada control con una coordenada; H3: sustitución del vértice |
| `completion` | Resultado `correct` con ambos parámetros exactos; «Continuar» avanza al recorrido |

La comparación es exacta. `h = -3`, `h = 2.99` y `k ≠ 2` son `incorrect`; un campo vacío es
`incomplete`.

---

## 5. `ExerciseSession`

Estado en memoria de un ejercicio visible. Consume los estados de control y validación de
[`003-interaccion-2d`](../003-interaccion-2d/data-model.md); no los redefine.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `exerciseId` | `"E01" \| "E08"` | Sí | Ejercicio activo |
| `generation` | entero | Sí | Se incrementa al cambiar de ejercicio |
| `draft` | `ExerciseDraft` | Sí | Borrador restaurado o inicial |
| `interaction` | `InteractionSession` | Sí | Estado del contrato 003 |
| `help` | `HelpState` | Sí | Mayor ayuda y panel abierto |
| `activeRequestId` | string UUID \| null | Sí | Solicitud vigente; `null` fuera de `pending` |
| `lastOutcome` | `ValidationOutcome \| null` | Sí | Resultado vigente en la sesión; no se persiste |
| `technicalError` | `TechnicalError \| null` | Sí | Fallo visible; no es resultado matemático |

`lastOutcome` se conserva al volver al ejercicio desde el recorrido dentro de la misma sesión. Se
limpia al editar, reiniciar, reintentar o recargar. Tras recargar, solo se restauran el borrador y el
estado de resuelto; no se muestra un origen anterior.

### 5.1 `HelpState`

| Campo | Tipo | Regla |
|---|---|---|
| `maxHint` | entero `0..3` | Mayor ayuda consultada; nunca disminuye |
| `openHint` | entero `1..3 \| null` | Ayuda visible; `null` si el panel está cerrado |

H1 está disponible desde el inicio; H2 requiere H1; H3 requiere H2. H3 no rellena ni envía la
respuesta. Consultar una ayuda no penaliza ni reduce el progreso.

### 5.2 `ValidationOutcome`

| Campo | Tipo | Regla |
|---|---|---|
| `requestId` | string UUID | Correlación con la solicitud vigente |
| `exerciseId` | `"E01" \| "E08"` | Ejercicio evaluado |
| `status` | `"correct" \| "incorrect" \| "indeterminate"` | Resultado matemático |
| `feedbackCode` | string | Código del catálogo o aditivo del consumidor |
| `origin` | `"local" \| "api"` | Origen real del gateway |
| `receivedAt` | string `date-time` | Momento de recepción |

`ValidationOutcome` no se guarda en `ProgressV1`. La etiqueta «local» o «API» acompaña al resultado
mientras está en pantalla y desaparece al recargar.

### 5.3 `TechnicalError`

| Campo | Tipo | Regla |
|---|---|---|
| `category` | `format \| incomplete \| unsupported \| configuration \| transport \| service` | Categoría de 001 |
| `code` | string | Código estable de error |
| `message` | string | Mensaje técnico mínimo, no la presentación localizada |

El error técnico conserva el borrador, permite reintentar y nunca se presenta como `incorrect`.

---

## 6. `ContentEntry`

Contenido textual con compuerta de aprobación.

| Campo | Tipo | Regla |
|---|---|---|
| `id` | `"intro" \| "about"` | Pantalla que consume el contenido |
| `approvalStatus` | `"approved" \| "pending"` | Si es `pending`, se muestra el aviso explícito |
| `fields` | objeto | Nombre, propósito, equipo, autoría, licencia o texto de introducción |

**Invariantes**:

- `about` con estado `pending` no muestra nombres, equipo, autoría ni licencia inventados.
- No se incluyen NASA, ANE, logotipos oficiales ni atribuciones a instituciones reales.
- `intro` con estado `pending` muestra un aviso de contenido pendiente; no se presenta como
  narrativa aprobada.

---

## 7. `PersistenceStatus`

Estado observable del almacenamiento.

| Valor | Significado | Acción de la interfaz |
|---|---|---|
| `available` | LocalStorage disponible y sin errores | Guardar y mostrar última confirmación |
| `saved` | La última escritura terminó correctamente | Mostrar que el progreso se guardó |
| `unavailable` | LocalStorage ausente, bloqueado o con cuota agotada | Informar que no se pudo guardar; no afirmar que se conservó |
| `corrupt` | El contenido no es JSON válido o no cumple el esquema | Abrir `progress-recovery`; no sobrescribir |
| `unknown-version` | `schemaVersion` distinta de `1` | Abrir `progress-recovery`; ofrecer misión nueva con confirmación |

---

## 8. Transiciones del recorrido

```text
index
  ├─ Comenzar sin progreso ───────────────► intro ──► flow(E01)
  ├─ Comenzar con progreso ──► confirmar ─► intro (misión nueva)
  ├─ Continuar con progreso ──────────────► intro | flow | exercise:E01 | exercise:E08
  ├─ Instrucciones ───────────────────────► instructions ──► index
  ├─ Cómo se Juega ───────────────────────► how-to-play ──► index
  └─ Acerca de ───────────────────────────► about ──► index

flow(E01) ──► exercise:E01
E01 correct (marca resuelto; paso E08) + Continuar ──► flow(E08) [avance parcial]
flow(E08) ──► exercise:E08
E08 correct (marca resuelto; paso complete) + Continuar ──► flow(complete) ──► index

progreso ilegible ──► progress-recovery
  ├─ Iniciar misión nueva + confirmar ──► backup + intro
  └─ Volver ──► index sin Continuar
```

### 8.1 Transiciones de validación observables

| Situación | Estado de entrada | Resultado | Progreso |
|---|---|---|---|
| Probar con campo obligatorio vacío | `incomplete` | No se envía | Sin intento; borrador intacto |
| Probar con respuesta completa | `pending` | Se espera resultado | Sin intento todavía |
| Resultado `correct` | `correct` | Diagnóstico positivo y origen | Añade intento y marca resuelto; «Continuar» avanza |
| Resultado `incorrect` | `incorrect` | Diagnóstico y origen | Añade intento; reintento ilimitado |
| Resultado `indeterminate` | `indeterminate` | Aviso de indecisión y origen | No añade intento |
| Fallo de red/servicio | `technical-error` | Error visible y origen no aplicable | No añade intento; borrador intacto |
| Respuesta anterior | `pending` vigente | Se descarta | Sin cambios |
| Consulta de ayuda | Estado actual | Se abre H1, H2 o H3 | Actualiza `maxHint`; no añade intento |
| Reiniciar con cambios | Confirmación | Configuración inicial | Limpia validación e historia; conserva resuelto si ya lo estaba |

`success` de 003 se alcanza solo al activar «Continuar» desde `correct`; en 002 el resultado
`correct` ya marca el nivel como resuelto, y «Continuar» navega al recorrido. Para E01, el paso del
recorrido pasa a E08 en el momento del resultado correcto.

---

## 9. Reglas de validación derivadas de la spec

### 9.1 Completitud

- E01: `selection === null` → `incomplete`.
- E08: `h === null` o `k === null` → `incomplete`.
- Un texto no parseable según la gramática exacta → `incomplete` con error de campo; no se envía.
- Un campo vacío nunca se interpreta como `0`, `incorrect` ni `indeterminate`.

### 9.2 Exactitud

- `h = 3` y `k = 2` son los únicos valores correctos de E08.
- `h = -3` es incorrecto con diagnóstico de signo.
- `h = 2.99` es incorrecto; no se redondea a `3`.
- `a = 1` es fijo y no se envía; no se acepta otra `a`.
- E01 es correcto con `true`; `false` es incorrecto porque compartir la salida 4 no viola la
  unicidad.

### 9.3 Intentos y ayudas

- Solo `correct` e `incorrect` incrementan `attempts`.
- `indeterminate`, `incomplete` y el error técnico no incrementan intentos.
- Los reintentos son ilimitados.
- `maxHint` es monótono y se conserva al recargar.
- H3 no completa ni envía la respuesta.
- No hay temporizador, vidas, puntos ni insignias.

### 9.4 Persistencia y recuperación

- Se guarda después de una edición confirmada, una consulta de ayuda y un resultado evaluado.
- El origen no se guarda.
- Un progreso corrupto o de versión desconocida no se sobrescribe en silencio.
- Al iniciar una misión nueva desde recuperación, el contenido anterior se conserva en una clave de
  respaldo antes de escribir.
- Si el almacenamiento no está disponible, la interfaz lo informa y no afirma que guardó.

---

## 10. Correspondencia con el esquema persistido

| Entidad | Ruta en `progress.schema.json` |
|---|---|
| `Mission` | `mission` |
| `FlowStep` | `flow.step` |
| `completedExerciseIds` | `completedExerciseIds` |
| `activeExerciseId` | `activeExerciseId` |
| `ExerciseDraft` | `drafts.E01`, `drafts.E08` |
| `Attempt` | `attempts[]` |
| `preferences` | `preferences` |
| `schemaVersion` | `schemaVersion` |

`ExerciseSession`, `ValidationOutcome`, `TechnicalError`, `HelpState`, `ContentEntry` y
`PersistenceStatus` no se persisten completos; se reconstruyen desde el progreso y el estado de la
sesión.
