# Data Model: Contrato transversal de interacción 2D

**Feature**: `003-interaccion-2d` | **Fecha**: 2026-11-16 | **Estado**: diseño para revisión

Este documento define las entidades, tipos, campos, ciclos de vida e invariantes del contrato
transversal de interacción 2D de FUNctions. Modela el estado de interacción en memoria dentro del
navegador; no define esquemas de base de datos ni modelos de persistencia a largo plazo (que
pertenecen a la spec de progreso). Los valores matemáticos se tratan como **valores opacos**
(`unknown`), ya que el cálculo de geometría corresponde a los consumidores y la validación
matemática pertenece a `001-nucleo-validacion`.

## Convenciones generales

- Todos los identificadores usan `camelCase`; tipos y enums usan `PascalCase`.
- El contrato opera mediante un reducer puro: `(state: InteractionSession, event: InteractionEvent) => InteractionResult`.
- `InteractionResult` se compone de `{ nextState: InteractionSession, effects: InteractionEffect[] }`.
- Se preserva la separación estricta entre **ámbito de control** (por control o grupo) y **ámbito de
  validación** (por ejercicio).
- Toda transición no enumerada explícitamente se rechaza; no altera el estado de la sesión ni genera
  efectos secundarios.

---

## Entidades principales

### 1. `InteractionSession`

Representa el estado activo de la sesión de interacción en el ejercicio visible.

| Campo | Tipo | Obligatorio | Regla / Descripción |
|---|---|---|---|
| `exerciseId` | string | Sí | Identificador estable `^E(0[1-9]\|1[0-5])$`. |
| `exerciseGeneration` | number | Sí | Entero monotónico; se incrementa al cambiar de ejercicio para invalidar cualquier respuesta tardía anterior. |
| `controlStates` | `Record<string, ControlScopeState>` | Sí | Mapa `controlId -> estado` de control. |
| `activeControlId` | string \| null | Sí | Control que posee el foco lógico o la interacción activa. |
| `validationState` | `ValidationScopeState` | Sí | Estado del ámbito de validación del ejercicio. |
| `activePointerSession` | `PointerSession \| null` | Sí | Captura y seguimiento de puntero activo (`null` si no hay arrastre). |
| `draftValues` | `Record<string, unknown>` | Sí | Valores actuales en edición o manipulación (confirmados o transitorios). |
| `confirmedValues` | `Record<string, unknown>` | Sí | Último snapshot confirmado por control. Base de restauración en cancelaciones. |
| `undoHistory` | `UndoEntry[]` | Sí | Pila de cambios confirmados del ejercicio activo. Se vacía al salir del ejercicio o reiniciar. |
| `activeValidationRequest` | `ActiveValidationRequest \| null` | Sí | Metadatos de la validación en curso durante `pending` (`null` en otro caso). |
| `announcementSequence` | number | Sí | Contador monotónico para emisión ordenada de anuncios a lectores de pantalla. |

---

### 2. Estados de los dos ámbitos

#### 2.1 `ControlScopeState` (Ámbito de control — REQ-01)

| Valor | Significado observable | Anuncio de transición |
|---|---|---|
| `idle` | Sin interacción activa; muestra su configuración base. | Silencioso |
| `focus` | Posee el foco; el foco es visible en pantalla y expone el nombre accesible. | Silencioso |
| `selected` | Opción u objeto elegido y confirmado; sin arrastre ni edición activa. | Silencioso |
| `dragging` | Manipulación activa con puntero; valor transitorio visible pero no confirmado. | Silencioso |
| `editing` | Campo u objeto en edición con teclado o foco activo de manipulación. | Silencioso |

#### 2.2 `ValidationScopeState` (Ámbito de validación — REQ-01, REQ-21)

| Valor | Significado observable | Anuncio de transición |
|---|---|---|
| `clean` | Sin validación en curso ni resultado que mostrar (estado inicial o limpiado). | Silencioso |
| `pending` | Validación en curso; acciones de cambio bloqueadas; borrador intacto. | **Anunciado** |
| `correct` | Muestra resultado matemático correcto y origen (`local`/`API`). Nivel no completado. | **Anunciado** |
| `incorrect` | Muestra resultado matemático incorrecto y código de diagnóstico. | **Anunciado** |
| `indeterminate` | Informa que el verificador no pudo decidir; no se marca como incorrecto. | **Anunciado** |
| `incomplete` | Falta un campo obligatorio o el valor no es válido para el envío; foco al campo señalado. | **Anunciado** |
| `technical-error` | Fallo de red, servicio o timeout; borrador intacto, reintento disponible. | **Anunciado** |
| `success` | Confirmación explícita de completación. Solo tras `correct` y activar «Continuar». | **Anunciado** |

---

### 3. `PointerSession`

Estructura de la captura de puntero durante la acción semántica `Manipular` por mouse/touch (REQ-05,
AC-04, AC-19).

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `pointerId` | number | Sí | Identificador del contacto que inició el arrastre (`pointerdown`). |
| `pointerType` | `'mouse' \| 'touch' \| 'pen'` | Sí | Tipo de dispositivo de entrada. |
| `controlId` | string | Sí | Control sobre el que se capturó el puntero. |
| `initialValue` | unknown | Sí | Valor confirmado antes de iniciar el arrastre (punto de restauración). |
| `transientValue` | unknown | Sí | Último valor provisional calculado por el consumidor en `pointermove`. |

**Invariante de segundo contacto (AC-19)**: si llega un evento de puntero con un `pointerId` distinto
del registrado en `PointerSession`, el evento se descarta sin modificar `transientValue`, sin
desplazar la captura y sin emitir efectos.

---

### 4. `UndoEntry`

Registro unitario en la pila de historia de deshacer (REQ-07, AC-07).

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `controlId` | string | Sí | Control cuyo valor se modificó. |
| `previousValue` | unknown | Sí | Valor que tenía el control antes del cambio confirmado. |
| `newValue` | unknown | Sí | Valor confirmado por la acción. |

**Invariante de ciclo de vida**:
- `undoHistory` solo acumula cambios confirmados mediante acciones de usuario (`pointerup` válido,
  `Enter` de confirmación).
- La activación de `Deshacer` extrae el último elemento (`pop`), restaura `previousValue` en
  `draftValues` y `confirmedValues`, y no crea un nuevo `UndoEntry`.
- Al cambiar de ejercicio (`Cambiar de ejercicio`) o al reiniciar (`Reiniciar`), `undoHistory` se
  vacía (`[]`).

---

### 5. `ActiveValidationRequest`

Rastreador de la solicitud de validación vigente para correlación y bloqueo (REQ-09, REQ-10, REQ-11,
AC-09, AC-11).

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `requestId` | string UUID | Sí | Identificador único de correlación con la solicitud enviada. |
| `exerciseId` | string | Sí | Ejercicio para el cual se despachó la validación. |
| `exerciseGeneration` | number | Sí | Generación en el momento del envío. |

**Invariante de respuesta tardía (AC-11, SC-05)**: cuando el consumidor recibe una respuesta de
validación con un `requestId`, el reducer solo procesa la transición si
`activeValidationRequest !== null`, `activeValidationRequest.requestId === response.requestId` y
`activeValidationRequest.exerciseGeneration === session.exerciseGeneration`. De lo contrario, la
respuesta se ignora por completo.

---

### 6. `SemanticAction` (Acciones semánticas — REQ-24)

Las diez acciones canónicas sin renombrar ni alterar:

| Acción | Puntero / Touch | Teclado | Efecto esperado |
|---|---|---|---|
| `seleccionar` | `pointerdown` + `pointerup` | `Enter` / `Space` | Control → `selected` |
| `manipular` | `pointerdown` → `pointermove` | Flechas en grupo | Control → `dragging` (puntero) o `editing` (teclado) |
| `confirmar` | `pointerup` en área válida | `Enter`, `Tab`, `Space` | Control → `selected`, valor guardado |
| `cancelar` | `pointercancel` / gesto SO | `Escape` | Control → `selected`/`focus`, restaura valor |
| `deshacer` | Clic en Deshacer | `Enter` / `Space` en Deshacer | Revierte último cambio confirmado |
| `reiniciar` | Clic en Reiniciar | `Enter` / `Space` en Reiniciar | Restablece config inicial; limpia validación |
| `probar` | Clic en Probar | `Enter` / `Space` en Probar | Validación → `pending` o `incomplete` |
| `reintentar` | Clic en Reintentar | `Enter` / `Space` en Reintentar | Validación limpia; control → `editing` |
| `continuar` | Clic en Continuar | `Enter` / `Space` en Continuar | Validación → `success`; control → `idle` |
| `cambiar-ejercicio` | Clic en navegación | `Enter` / `Space` en nav | Validación limpia; solicitud abandonada |

---

### 7. `InteractionEffect` (Efectos como datos)

Unión discriminada de efectos que el reducer ordena ejecutar al consumidor:

| Discriminante `type` | Parámetros | Propósito |
|---|---|---|
| `announce` | `state: 'pending' \| 'correct' \| 'incorrect' \| 'indeterminate' \| 'incomplete' \| 'technical-error' \| 'success'`, `messageKey: string`, `message: string`, `sequence: number` | Publicar anuncio en región accesible `aria-live` (REQ-21, SC-11). |
| `focus` | `controlId: string` | Mover el foco visible al control especificado (REQ-14, AC-01). |
| `capture-pointer` | `controlId: string`, `pointerId: number` | Invocar `setPointerCapture` en el elemento DOM/canvas (REQ-05). |
| `release-pointer` | `controlId: string`, `pointerId: number` | Invocar `releasePointerCapture` (REQ-05). |
| `request-validation` | `exerciseId: string`, `requestId: string`, `payload: unknown` | Despachar la validación a 001 (local o API) (REQ-10). |
| `abandon-request` | `requestId: string` | Cancelar u olvidar una solicitud previa (REQ-13, AC-11). |
| `commit-value` | `controlId: string`, `value: unknown` | Notificar al consumidor que un valor ha sido confirmado. |
| `show-field-error` | `controlId: string`, `messageKey: string`, `message: string` | Señalar error sintáctico o campo faltante (REQ-23, AC-20). |
| `reject-action` | `action: string`, `reason: string` | Acción rechazada (e.g. modificación durante `pending`). |
| `reset-session` | `exerciseId: string` | Restablecer el ejercicio a su configuración inicial. |

---

## Catálogo de Transiciones e Identificadores

### Ámbito de Control (C-01…C-17)

| ID | Precondición | Evento / Acción | Resultado observable | Destino | Efectos |
|---|---|---|---|---|---|
| **C-01** | `idle` | `Tab` / `Shift+Tab` | Foco visible en orden | `focus` | `focus(id)` |
| **C-02** | `focus` | `Enter` / `Space` en opción | Opción elegida y confirmada | `selected` | `commit-value` |
| **C-03** | `focus` | `Enter` / `Space` en acción | Acción semántica ejecutada | `focus` | según acción |
| **C-04** | `focus` \| `selected` | Flecha en grupo navegable | Foco se desplaza en paso declarado | `focus` | `focus(id)` |
| **C-05** | `focus` \| `selected` | Flecha en grupo manipulable | Valor transitorio se modifica | `editing` | — |
| **C-06** | `idle` \| `focus` \| `selected` | `pointerdown` en arrastrable | Inicia captura, retiene valor original | `dragging` | `capture-pointer` |
| **C-07** | `dragging` | `pointermove` (mismo `pointerId`) | Mueve vista previa; valor transitorio | `dragging` | — |
| **C-08** | `dragging` | `pointerup` en área válida | Confirma valor final, libera captura | `selected` | `release-pointer`, `commit-value` |
| **C-09** | `dragging` | `pointerup` fuera de área válida | Restaura valor original, libera captura | `selected` | `release-pointer` |
| **C-10** | `dragging` | `pointercancel`, pérdida de captura o `Escape` | Restaura valor original; foco al control | `selected` | `release-pointer`, `focus(id)` |
| **C-11** | `dragging` | `Tab` | Cancela arrastre antes de mover foco | `focus` | `release-pointer`, `focus(nextId)` |
| **C-12** | `focus` \| `selected` | `Enter` en campo editable | Campo entra en edición | `editing` | `focus(id)` |
| **C-13** | `editing` | `Enter` / `Tab` con valor válido | Confirma valor y sale del campo | `selected` | `commit-value`, `focus(nextId)` |
| **C-14** | `editing` | `Escape` | Recupera último valor confirmado | `selected` | `focus(id)` |
| **C-15** | `editing` | Flecha en grupo manipulable | Valor transitorio se modifica | `editing` | — |
| **C-16** | `editing` | `pointerdown` en control B (valor válido en A) | Confirma A y ejecuta acción de B | según B | `commit-value(A)`, acción B |
| **C-17** | `editing` | `pointerdown` en control B (valor inválido en A) | Foco permanece en A, señala error, B no se activa | `editing` | `show-field-error(A)`, `focus(A)` |

---

### Ámbito de Validación (V-01…V-12)

| ID | Precondición | Evento / Acción | Resultado observable | Destino | Efecto en Control / Efectos |
|---|---|---|---|---|---|
| **V-01** | `clean` | Probar (campos completos) | Bloquea cambios, crea solicitud | `pending` | Foco en Probar; `request-validation`, `announce(pending)` |
| **V-02** | `clean` \| `incomplete` | Probar (campo obligatorio vacío o no válido para el envío) | Señala el campo y no envía | `incomplete` | Foco en campo señalado; `show-field-error`, `announce(incomplete)` |
| **V-03** | `incomplete` | Completar campo faltante | Vuelve a edición con nuevo valor | `clean` | Control pasa a `editing` |
| **V-04** | `pending` | Respuesta `correct` válida | Muestra resultado y origen; no completa | `correct` | Foco a Continuar; `announce(correct)` |
| **V-05** | `pending` | Respuesta `incorrect` válida | Muestra diagnóstico y reintento | `incorrect` | Foco a Reintentar; `announce(incorrect)` |
| **V-06** | `pending` | Respuesta `indeterminate` válida | Informa indecisión; no es error | `indeterminate` | Foco a Reintentar; `announce(indeterminate)` |
| **V-07** | `pending` | Fallo técnico (red/timeout/500) | Muestra error técnico; borrador intacto | `technical-error` | Foco en ejercicio; `announce(technical-error)` |
| **V-08** | `correct` | Activar «Continuar» | Confirma completación del nivel | `success` | Control a `idle`; `announce(success)` |
| **V-09** | `success` | Continuar o regresar de pantalla | Abandona confirmación; conserva avance | `clean` | Control a `idle` |
| **V-10** | `incorrect` \| `indeterminate` \| `technical-error` | Reintentar | Vuelve a edición; validación limpia | `clean` | Control a `editing` |
| **V-11** | `incorrect` \| `indeterminate` \| `technical-error` \| `incomplete` | Reiniciar (con confirmación si hay cambios) | Restablece config inicial; vacía historia | `clean` | Control a `idle`; `reset-session` |
| **V-12** | Cualquier estado | Cambiar de ejercicio | Limpia validación; abandona solicitud | `clean` | Control a `idle`; `abandon-request` |

---

### Transiciones Prohibidas (X-01…X-09 — REQ-03, AC-16)

Toda aparición de estas combinaciones DEBE ser interceptada por las guardas del reducer, emitiendo
el efecto `reject-action` y dejando el estado inalterado:

| ID | Transición prohibida | Razón de rechazo |
|---|---|---|
| **X-01** | Control `dragging` → `probar` (`pending`) | No se puede probar mientras se arrastra; primero confirmar o cancelar. |
| **X-02** | Durante `pending`, transiciones a `dragging`, `editing` o `selected` que alteren valor | Cambios bloqueados durante validación en curso (REQ-09). |
| **X-03** | Validación `incomplete` → `pending` | Respuestas incompletas o no válidas para el envío nunca se envían al despachador. |
| **X-04** | Validación `correct`, `incorrect`, `indeterminate` → `pending` sin pasar por `editing` | Impide reenviar el mismo resultado como si fuera un intento nuevo. |
| **X-05** | Validación `technical-error` → `success`, `correct` o `incorrect` | Un fallo técnico jamás se transmuta en resultado matemático ni éxito. |
| **X-06** | Validación `clean` → `correct`, `incorrect` o `indeterminate` sin validación | Resultados matemáticos solo nacen de una respuesta a solicitud previa. |
| **X-07** | Respuesta de solicitud no vigente → cualquier cambio de estado | Solo la solicitud activa puede actualizar la pantalla (REQ-11, AC-11). |
| **X-08** | Validación `success` → `success` | La completación no se duplica sin una nueva validación previa. |
| **X-09** | Validación `correct` → `success` sin activar «Continuar» | `success` exige acción explícita humana; prohibido por tiempo o animación. |

El segundo contacto táctil durante un arrastre no aparece en esta tabla porque no es una transición:
se rechaza antes de evaluar cualquier transición mediante la guarda `G-POINTER` y la invariante de
`PointerSession` (AC-19).
