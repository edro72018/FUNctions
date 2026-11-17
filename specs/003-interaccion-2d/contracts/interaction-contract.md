# Contrato de interacción 2D

**Feature**: `003-interaccion-2d` | **Versión del contrato**: `1.0.0` | **Estado**: propuesta para revisión

Este documento es la traducción técnica de [`spec.md`](../spec.md). No añade estados, acciones ni
transiciones: los enumera y fija la forma en que los consumidores los usan. La fuente normativa sigue
siendo la spec; ante una discrepancia, prevalece `spec.md` y este contrato debe corregirse.

## 1. Alcance y no objetivos

El contrato define el comportamiento observable de un control interactivo 2D:

- los cinco estados de control y los siete estados de validación;
- las diez acciones semánticas y su activación por puntero, touch y teclado;
- los eventos de dispositivo admitidos y su normalización;
- las transiciones permitidas y las prohibidas;
- los efectos que el consumidor debe aplicar (foco, anuncio, captura, validación);
- las reglas de sesión: deshacer, reiniciar, cancelar, bloqueo durante `pending` y descarte de
  respuestas obsoletas;
- el contrato mínimo de accesibilidad: foco visible, 44×44, sin hover obligatorio y sin color como
  único portador.

No define matemáticas, geometría, estilos, animaciones, contenido de ejercicios, progreso,
persistencia, backend ni navegación entre zonas. Los valores son **opacos** para el contrato.

## 2. API pública prevista

El módulo exporta una fábrica de sesión y utilidades de introspección. La forma exacta de los tipos se
fija en `src/shared/interaction/contracts/types.ts` durante la implementación autorizada.

```ts
export declare const CONTRACT_VERSION: '1.0.0';

export type InteractionSession = { /* ver data-model.md §1 */ };

export declare function createSession(input: CreateSessionInput): InteractionSession;

export declare function dispatch(
  session: InteractionSession,
  input: InteractionInput,
): InteractionResult;

export type InteractionResult = {
  readonly nextState: InteractionSession;
  readonly effects: readonly InteractionEffect[];
};

export declare const CONTROL_STATES: readonly ControlState[];      // 5
export declare const VALIDATION_STATES: readonly ValidationState[]; // 7 + 'clean'
export declare const SEMANTIC_ACTIONS: readonly SemanticAction[];   // 10
export declare const TRANSITIONS: readonly TransitionDefinition[];  // 29 permitidas
export declare const FORBIDDEN_TRANSITIONS: readonly ForbiddenTransition[]; // 9
export declare const MIN_TARGET_SIZE: 44; // unidades de referencia, no píxeles físicos
```

`InteractionInput` es la unión de:

1. `InteractionEvent`: intención del usuario derivada de un evento de dispositivo admitido.
2. `ValidationResponse`: respuesta del mecanismo de validación (local o API).
3. `SessionCommand`: cambio de ejercicio, salida del ejercicio o restauración de borrador.

El reducer es puro: no muta `session`, no ejecuta efectos, no accede al reloj ni al DOM. El consumidor
aplica los efectos en el orden devuelto.

## 3. Estados

### 3.1 Ámbito de control (5 estados)

`idle` → `focus` → `selected` / `editing` → `dragging` → `selected`.

| Estado | Significado | Anuncio |
|---|---|---|
| `idle` | Sin interacción activa. | No |
| `focus` | Tiene el foco visible y el nombre accesible. | No |
| `selected` | Opción u objeto elegido y confirmado. | No |
| `dragging` | Arrastre con puntero y valor transitorio no confirmado. | No |
| `editing` | Edición o manipulación con valor no confirmado. | No |

### 3.2 Ámbito de validación (7 estados + limpio)

`clean` es la ausencia de validación, no un estado anunciado. Los siete estados restantes se anuncian
al entrar en ellos.

| Estado | Significado | Anuncio |
|---|---|---|
| `clean` | Sin validación en curso ni resultado visible. | No |
| `pending` | Validación en curso; cambios bloqueados. | Sí |
| `correct` | Resultado matemático correcto con origen; nivel no completado. | Sí |
| `incorrect` | Resultado matemático incorrecto con diagnóstico. | Sí |
| `indeterminate` | El verificador no pudo decidir; no es incorrecto. | Sí |
| `incomplete` | Falta un campo obligatorio o no es válido; no se envía. | Sí |
| `technical-error` | Fallo técnico; borrador conservado, reintento disponible. | Sí |
| `success` | Completación confirmada explícitamente con «Continuar». | Sí |

Los dos ámbitos son independientes. Una transición de validación solo cambia el control cuando la
tabla de la spec lo declara (por ejemplo, mover el foco a «Continuar»).

## 4. Acciones semánticas (10)

| Acción | Puntero / touch | Teclado | Resultado |
|---|---|---|---|
| `seleccionar` | `pointerdown` + `pointerup` | `Enter` / `Space` | `selected` |
| `manipular` | `pointerdown` → `pointermove` → `pointerup` | Flechas en grupo | `dragging` o `editing`; `selected` al confirmar |
| `confirmar` | `pointerup` en área válida; clic en confirmar | `Enter`, `Tab` o `Space` | `selected` |
| `cancelar` | `pointercancel` o gesto del sistema | `Escape` | `selected` o `focus`; restaura valor |
| `deshacer` | Clic en Deshacer | `Enter` / `Space` con foco | Revierte el último cambio confirmado |
| `reiniciar` | Clic en Reiniciar | `Enter` / `Space` con foco | Configuración inicial; validación limpia |
| `probar` | Clic en Probar | `Enter` / `Space` con foco | `pending` o `incomplete` |
| `reintentar` | Clic en Reintentar | `Enter` / `Space` con foco | `editing`; validación limpia |
| `continuar` | Clic en Continuar | `Enter` / `Space` con foco | `success`; control `idle` |
| `cambiar-ejercicio` | Clic en navegación | `Enter` / `Space` con foco | Validación limpia; solicitud abandonada |

Los consumidores no renombran estas acciones ni cambian su resultado observable (REQ-24, REQ-22).

## 5. Eventos admitidos y normalización

### 5.1 Eventos de dispositivo (REQ-06)

Solo estos eventos cambian el estado de interacción:

| Fuente | Eventos | Uso |
|---|---|---|
| Puntero | `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `lostpointercapture` | Seleccionar, arrastrar, confirmar y cancelar. |
| Teclado | `Tab`, `Shift+Tab`, `Enter`, `Space`, flechas, `Escape` | Navegar, activar, manipular y cancelar. |

Cualquier otro evento del dispositivo no cambia el estado. El texto escrito dentro de un campo no es
un evento del contrato: el consumidor conserva el texto y lo entrega como `value` al confirmar, al
salir de `editing` o al probar. Esto evita que cada pulsación de tecla se convierta en una transición.

### 5.2 Intento normalizado

El adaptador del consumidor traduce el evento del dispositivo a un `InteractionEvent`:

```ts
type InteractionEvent =
  | { source: 'pointer'; type: 'pointerdown'; controlId: string; pointerId: number;
      pointerType: 'mouse' | 'touch' | 'pen'; value?: unknown;
      editing?: { controlId: string; value?: unknown; wellFormed: boolean };
      action?: SemanticAction }
  | { source: 'pointer'; type: 'pointermove'; pointerId: number; value?: unknown }
  | { source: 'pointer'; type: 'pointerup'; pointerId: number;
      insideValidArea: boolean; value?: unknown }
  | { source: 'pointer'; type: 'pointercancel' | 'lostpointercapture'; pointerId: number }
  | { source: 'keyboard'; type: 'keydown'; key: KeyboardKey; shiftKey?: boolean;
      controlId: string; nextControlId?: string; value?: unknown;
      wellFormed?: boolean; missingFields?: readonly string[] }
  | { source: 'action'; action: SemanticAction; controlId: string;
      value?: unknown; wellFormed?: boolean; missingFields?: readonly string[] };
```

`KeyboardKey` es exactamente:
`'Tab' | 'Enter' | 'Space' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Escape'`.

Reglas del adaptador:

1. Un `pointerdown` sobre un control arrastrable se despacha con el `pointerId` y el valor confirmado
   actual; el contrato responde con `capture-pointer`.
2. `pointermove` solo se acepta si `pointerId` coincide con el activo; si no, se ignora.
3. `pointerup` incluye `insideValidArea`, calculado por el consumidor según su geometría. El contrato
   no conoce áreas ni coordenadas.
4. `lostpointercapture` y `pointercancel` se tratan como cancelación, nunca como confirmación.
5. Al pulsar `Tab` durante un arrastre, el adaptador despacha el evento y aplica el efecto `focus`
   devuelto; debe evitar el desplazamiento nativo duplicado cuando el contrato ya movió el foco.
6. Si hay un campo A en `editing`, el `pointerdown` sobre B incluye `editing` con el control A, su
   texto y `wellFormed`. El contrato confirma A y continúa con B, o rechaza el clic conservando A. Si
   B es una acción inmediata, el evento puede incluir `action` para ejecutarla tras confirmar A.
7. El adaptador no crea estados propios, no decide si un valor es matemáticamente correcto y no envía
   una validación por su cuenta.

### 5.3 Respuesta de validación

```ts
type ValidationResponse =
  | {
      source: 'validation-response';
      kind: 'result';
      requestId: string;
      exerciseId: string;
      exerciseGeneration: number;
      status: 'correct' | 'incorrect' | 'indeterminate';
      origin: 'local' | 'api';
      feedbackCode?: string;
    }
  | {
      source: 'validation-response';
      kind: 'technical-error';
      requestId: string;
      exerciseId: string;
      exerciseGeneration: number;
      errorCode: string;
    };
```

Solo se aplica si `requestId` y `exerciseGeneration` coinciden con la solicitud vigente. En caso
contrario se descarta sin efectos (REQ-11, AC-11). `kind: 'technical-error'` es la categoría de fallo
técnico, no un resultado matemático; nunca se presenta como `correct`, `incorrect` ni `success`.

### 5.4 Comandos de sesión

```ts
type SessionCommand =
  | { source: 'session'; type: 'change-exercise'; exerciseId: string }
  | { source: 'session'; type: 'leave-exercise' }
  | { source: 'session'; type: 'restore-draft'; exerciseId: string; draft: Record<string, unknown> };
```

## 6. Efectos como datos

El reducer devuelve una lista ordenada de efectos. El consumidor los aplica sin reinterpretarlos:

| `type` | Campos | Acción del consumidor |
|---|---|---|
| `announce` | `state`, `messageKey`, `message`, `sequence` | Publicar una vez en la región `aria-live` (REQ-21). |
| `focus` | `controlId` | Mover el foco visible al control. |
| `capture-pointer` | `controlId`, `pointerId` | Capturar el puntero. |
| `release-pointer` | `controlId`, `pointerId` | Liberar la captura. |
| `request-validation` | `exerciseId`, `requestId`, `payload` | Enviar a 001; no mutar el borrador. |
| `abandon-request` | `requestId` | Descartar la solicitud anterior. |
| `commit-value` | `controlId`, `value` | Actualizar la representación confirmada. |
| `show-field-error` | `controlId`, `messageKey`, `message` | Señalar el error sin perder el texto. |
| `reject-action` | `action`, `reason` | Indicar que la acción no está permitida. |
| `reset-session` | `exerciseId` | Restablecer la configuración inicial. |

Los efectos nunca incluyen trazas internas, datos personales ni valores de otros ejercicios.

## 7. Transiciones

El catálogo normativo completo, con precondición, acción, resultado y destino, está en:

- `spec.md` → «Transiciones permitidas — ámbito de control» (17 filas);
- `spec.md` → «Transiciones permitidas — ámbito de validación» (12 filas);
- `spec.md` → «Transiciones prohibidas» (9 filas).

`data-model.md` asigna IDs estables `C-01…C-17`, `V-01…V-12` y `X-01…X-09` en el mismo orden. La
implementación exporta `TRANSITIONS` y `FORBIDDEN_TRANSITIONS` con exactamente esas entradas.

Regla de cierre: **toda transición no enumerada está prohibida**. El reducer devuelve el estado sin
cambios y un efecto `reject-action`; no interpreta la situación como éxito, error matemático ni
resultado.

## 8. Guardas obligatorias

| Guarda | Regla | Requisitos |
|---|---|---|
| `G-POINTER` | Solo el `pointerId` activo puede mover o confirmar un arrastre. | REQ-05, AC-19 |
| `G-PENDING` | En `pending` se rechazan edición, arrastre, deshacer, reiniciar y un segundo envío. | REQ-09, REQ-10, AC-09 |
| `G-REQUEST` | Solo la respuesta con `requestId` y `exerciseGeneration` vigentes cambia el estado. | REQ-11, AC-11 |
| `G-SUCCESS` | `success` solo desde `correct` y solo con la acción `continuar`. | REQ-01, AC-18 |
| `G-TECH` | `technical-error` conserva el borrador y nunca se convierte en resultado. | REQ-12, AC-10 |
| `G-UNDO` | Deshacer solo revierte cambios confirmados del ejercicio activo. | REQ-07, AC-07 |
| `G-RESET` | Reiniciar exige confirmación si hay cambios y vacía la historia. | REQ-08, AC-08 |
| `G-LEAVE` | Cambiar de ejercicio cancela interacción, abandona solicitud y limpia validación. | REQ-13, AC-11 |
| `G-EDIT` | Salir de `editing` con `pointerdown` confirma si es válido; si no, conserva foco, texto y error. | REQ-23, AC-20 |
| `G-WELLFORMED` | La validez sintáctica del borrador la aporta el consumidor; el contrato no la calcula. | REQ-19, REQ-20 |

### 8.1 Separación entre forma y completitud

Para evitar que `incomplete` se convierta en un resultado matemático:

- **Forma sintáctica** (`wellFormed`): decide si se puede salir de `editing`. Un valor mal formado no
  se confirma y conserva el foco y el texto.
- **Completitud requerida** (`missingFields`): decide el paso a `incomplete` al activar `probar`. Un
  campo obligatorio vacío se señala y no se envía al validador.

Un campo vacío puede ser sintácticamente válido y estar incompleto; esa combinación produce
`incomplete` al probar, no un error de edición. Si al probar un valor no supera la comprobación de
envío, se incluye en `missingFields` y se trata como `incomplete`; no se crea una transición nueva ni
se envía al validador.

## 9. Anuncios accesibles

Solo se anuncia la entrada a estos siete estados, con nombre y efecto:

| Estado | `messageKey` | Mensaje por defecto (español) |
|---|---|---|
| `pending` | `interaction.pending` | «Validando la respuesta.» |
| `correct` | `interaction.correct` | «Respuesta correcta. Puedes continuar.» |
| `incorrect` | `interaction.incorrect` | «Respuesta incorrecta. Puedes reintentar.» |
| `indeterminate` | `interaction.indeterminate` | «El verificador no pudo decidir. Puedes reintentar.» |
| `incomplete` | `interaction.incomplete` | «Falta un campo obligatorio. Revisa el campo señalado.» |
| `technical-error` | `interaction.technical-error` | «No se pudo validar. Tu respuesta se conserva. Puedes reintentar.» |
| `success` | `interaction.success` | «Nivel completado.» |

`idle`, `focus`, `selected`, `dragging` y `editing` no generan anuncio de transición. El foco visible
y el nombre accesible del control cubren la navegación normal. Los anuncios no dependen de sonido ni
de color.

## 10. Presentación y accesibilidad

Cada estado expone un descriptor:

```ts
type StatePresentation = {
  state: ControlState | ValidationState;
  labelKey: string;                 // texto obligatorio
  nonColorCue: 'text' | 'icon' | 'shape' | 'position'; // pista adicional al color
  announcement: 'announced' | 'silent';
};
```

Requisitos para el consumidor:

1. Renderizar el foco de forma visible y en el orden de lectura.
2. Asociar etiqueta accesible a todo control.
3. Garantizar un objetivo táctil de al menos `MIN_TARGET_SIZE` (44 unidades de referencia) y separación
   suficiente entre controles vecinos.
4. No exigir hover para descubrir o ejecutar una acción esencial.
5. No comunicar ningún estado solo por color.
6. Publicar los anuncios en una región `aria-live` polite; no duplicar el mismo `sequence`.

## 11. Obligaciones del consumidor

1. Declarar sus controles y asociarlos a estados y acciones existentes; no crear estados paralelos.
2. Traducir los eventos de dispositivo a `InteractionEvent` y despachar una vez por evento.
3. Aplicar los efectos en orden: foco, captura, anuncio, validación, confirmación.
4. Aportar `wellFormed`, `missingFields`, `insideValidArea`, el snapshot `editing` y los valores
   opacos; el contrato no los calcula.
5. Conservar el texto escrito en caso de error y devolver el foco al campo señalado.
6. No pasar a `success` por tiempo, animación ni recepción de `correct`.
7. No persistir nada por su cuenta en este módulo; la persistencia pertenece a la spec de progreso.
8. Verificar manualmente foco, 44×44 y ausencia de dependencia de color en su propia UI.

## 12. Versión y compatibilidad

- Versión inicial: `1.0.0`.
- Añadir un estado, una acción o una transición requiere una nueva versión de la spec y de este
  contrato; no es un cambio compatible.
- Cambiar el significado de un estado o de un anuncio requiere reabrir la etapa de especificación.
- Cambiar nombres de campos internos de implementación no cambia el contrato observable, pero debe
  conservar los esquemas y la paridad de los consumidores.

## 13. Matriz de conformidad

| Requisito | Dónde se concreta | Verificación prevista |
|---|---|---|
| REQ-01, REQ-02, REQ-03 | §3, §7, `data-model.md` §2 y catálogo C/V/X | `transitions.spec.ts`, conteos 17/12/9 |
| REQ-04, REQ-18, REQ-24 | §4, §5 | `transitions.spec.ts`, paridad puntero/teclado |
| REQ-05, REQ-19, AC-19 | §5.2, §8, `PointerSession` | `pointer.spec.ts`, segundo contacto |
| REQ-06 | §5.1 | `contracts.spec.ts`, eventos no admitidos no transicionan |
| REQ-07, REQ-08 | §8, `UndoEntry` | `session.spec.ts` |
| REQ-09, REQ-10 | §8 `G-PENDING`, `ActiveValidationRequest` | `session.spec.ts` |
| REQ-11, REQ-13 | §5.3, §8 `G-REQUEST`, `G-LEAVE` | `session.spec.ts` |
| REQ-12 | §8 `G-TECH` | `session.spec.ts` |
| REQ-14, REQ-15, REQ-16, REQ-17 | §10 | `presentation.spec.ts` + verificación manual |
| REQ-20, REQ-22 | §2, §11 | `architecture.spec.ts` |
| REQ-21 | §9 | `announcements.spec.ts`, 7/5 |
| REQ-23 | §8 `G-EDIT` | `editing.spec.ts` |

La matriz usa los identificadores de la spec y no crea criterios nuevos.
