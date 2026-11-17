# Feature Specification: Contrato transversal de interacción 2D

**Feature Branch**: `003-interaccion-2d`

**Created**: 2026-11-16

**Status**: Aprobado

**Input**: User description: "Especifica el contrato transversal de interacción 2D de FUNctions, consumible por el corte vertical 002 y por las zonas 004–008. No especifiques ejercicios concretos ni reglas matemáticas."

## Contexto y alcance

### Propósito

Este incremento define el contrato común de interacción que usan todas las pantallas jugables:
qué estados puede tener un control, qué eventos se aceptan, qué acciones semánticas existen, qué
transiciones están permitidas y cuáles no, y qué se conserva ante cancelaciones, errores técnicos o
respuestas tardías.

El contrato describe lo que la persona jugadora observa y puede hacer. No implementa PixiJS ni
Mafs, no contiene ejercicios, no valida matemáticamente y no define progreso ni persistencia. Los
consumidores —el corte 002 y las zonas 004–008— traducen sus controles a este contrato sin
redefinirlo.

### Alcance de este incremento

- La máquina de estados en dos ámbitos independientes: estados de control y estados de validación.
- Las acciones semánticas del contrato y su activación por puntero y por teclado.
- Los eventos de mouse, touch y teclado admitidos, con su acción y su resultado esperado.
- Las reglas de foco visible, captura de puntero, cancelación de arrastre, deshacer y reiniciar.
- El bloqueo de acciones de cambio durante `pending` y la regla de una sola solicitud vigente.
- La conservación de estado ante error técnico, respuesta tardía y cambio de ejercicio.
- Las transiciones permitidas y las prohibidas, cada una con precondición, acción y resultado.
- El contrato de estados visuales y de accesibilidad mínima: 44×44, sin dependencia de hover y sin
  color como único portador de significado.

### Fuera de alcance

- Contenido, enunciados, soluciones y reglas matemáticas de cualquier ejercicio.
- Validación matemática, normalización de respuestas y contratos de tipo de respuesta, que
  pertenecen a 001.
- Progreso, persistencia, guardado, versionado de datos y sincronización.
- Backend, API, Modo estático y servicio de validación.
- Assets, audio, animaciones concretas, estilos visuales definitivos y narrativa.
- Navegación entre zonas, mapa de zonas, desbloqueos y reglas de misión.
- Implementación concreta con PixiJS, Mafs, SVG o cualquier biblioteca de renderizado.

### Contexto normativo consumido

| Fuente | Uso en esta spec |
|---|---|
| [Constitución](../../.specify/memory/constitution.md) | Principios II, III, V y VII; estados explícitos, accesibilidad, separación entre interacción y validación, y aprobación por etapas |
| [Spec 001 — núcleo de validación](../001-nucleo-validacion/spec.md) | Resultados `correct`/`incorrect`/`indeterminate`, `incomplete` como estado del cliente, error técnico separado y origen local/API |
| [Spec 002 — primer recorrido](../002-primer-recorrido/spec.md) | Primer consumidor del contrato; aporta requisitos de foco, bloqueo durante `pending` y accesibilidad que este contrato generaliza |
| [GDD v0.1](../../docs/workspace/GDD_FUNctions_v0.1.md), secciones 2.4, 2.5 y 5.1 | Ciclo de juego, andamiaje, pantallas y componentes visuales |
| [Auditoría SDD](../../docs/workspace/Auditoria_SDD_FUNctions.md) | Bloqueo B3: máquina de estados, contrato de eventos, captura de puntero, cancelación, foco y alternativa de teclado |

### Consumidores y dependencias

1. **Consume 001.** Los estados de resultado no se redefinen aquí: el contrato solo describe cómo se
   muestran y qué se conserva mientras se muestran.
2. **Es consumido por 002 y por 004–008.** Cada consumidor declara qué controles ofrece y qué pasos
   de teclado usa, pero no introduce estados, acciones ni transiciones propias.
3. **No depende de la persistencia.** Deshacer, reiniciar y cancelar operan sobre la sesión de
   interacción; qué se guarda después corresponde a la spec de progreso.
4. **No depende del renderizador.** El mismo contrato se aplica a una escena 2D, a una gráfica o a
   un control HTML equivalente.

### Etiquetas de estado

`Confirmado` = decisión explícita del Aprobador. `Propuesto` = redacción de esta spec pendiente de
aprobación. `Pendiente` = decisión que debe cerrarse en `/speckit.clarify` o antes del plan.
Todas las afirmaciones de esta spec están en estado **propuesto** hasta que se registre la
aprobación en [Aprobaciones](#aprobaciones).

## Clarifications

### Session 2026-11-16

- Q: ¿El estado `success` se alcanza automáticamente al mostrar un resultado `correct`, o exige una acción explícita de la persona para confirmarlo? → A: Exige la acción explícita «Continuar»; nunca es automático ni depende del tiempo de una animación.
- Q: Cuando la persona sale de un ejercicio y vuelve más tarde en la misma sesión, ¿puede deshacer los cambios que había confirmado antes de salir? → A: No; el borrador persiste y se restaura como punto de partida, pero la historia de deshacer se reinicia al salir del ejercicio.
- Q: Mientras hay un arrastre activo con un dedo, ¿qué debe ocurrir si un segundo dedo toca la pantalla? → A: El segundo contacto se ignora por completo; el arrastre vigente continúa y no se crea ni sustituye ningún valor.
- Q: ¿Qué transiciones deben anunciarse a quien usa lector de pantalla: todas, o solo las que cambian el resultado o el bloqueo? → A: Solo las que cambian el resultado o el bloqueo: `pending`, `correct`, `incorrect`, `indeterminate`, `incomplete`, `technical-error` y `success`; `idle`, `focus`, `selected`, `dragging` y `editing` no se anuncian.
- Q: Si alguien escribe en un campo y hace clic en otro control sin pulsar Enter ni Tab, ¿qué ocurre con ese valor aún no confirmado? → A: El clic confirma el valor si es válido y ejecuta el control destino; si no es válido, el campo conserva el foco y se señala el error.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recorrer, activar y manipular con teclado (Priority: P1)

La persona jugadora se mueve con Tab por los controles operables, ve siempre dónde está el foco,
activa el control elegido con Enter o Espacio, y manipula valores con las flechas confirmando con
Enter o Espacio.

**Why this priority**: sin una alternativa de teclado completa el contrato no puede ser consumido
por ninguna zona y la accesibilidad mínima quedaría incumplida.

**Independent Test**: recorrer una pantalla de prueba con Tab y Shift+Tab, comprobar foco visible en
cada elemento, activar cada control con Enter y con Espacio, y manipular un valor con flechas
confirmando con Enter y cancelando con Escape.

**Acceptance Scenarios**:

1. **Given** una pantalla con controles operables, **When** la persona pulsa Tab repetidamente,
   **Then** el foco avanza en el orden de lectura y siempre es visible (AC-01).
2. **Given** un control con foco, **When** la persona pulsa Enter o Espacio, **Then** el control se
   activa con el mismo efecto que un clic (AC-02).
3. **Given** un grupo de controles relacionados, **When** la persona usa las flechas, **Then** el
   foco o el valor transitorio se mueve dentro del grupo sin salir de él (AC-03).
4. **Given** un objeto o valor manipulable con teclado, **When** la persona usa las flechas,
   **Then** el valor transitorio se mueve; con Enter o Espacio se confirma y con Escape se cancela
   sin alterar el valor confirmado (AC-22).

### User Story 2 - Manipular con puntero y touch (Priority: P1)

La persona arrastra un objeto con mouse o con el dedo, ve una vista previa mientras arrastra y el
valor solo cambia cuando suelta.

**Why this priority**: la manipulación directa es la interacción principal de las zonas 2D; sin
captura de puntero y confirmación al soltar no hay contrato utilizable.

**Independent Test**: arrastrar un objeto de prueba con mouse y con touch, comprobar seguimiento
durante el arrastre y valor confirmado al soltar; repetir soltando fuera del área válida.

**Acceptance Scenarios**:

1. **Given** un objeto arrastrable, **When** la persona inicia el arrastre y mueve el puntero,
   **Then** el objeto sigue al puntero sin confirmar ningún valor (AC-04).
2. **Given** un arrastre en curso, **When** la persona suelta dentro del área válida, **Then** el
   valor final queda confirmado y se libera la captura (AC-05).
3. **Given** un arrastre en curso, **When** la persona suelta fuera del área válida, **Then** el
   objeto vuelve al último valor confirmado y no se registra cambio (AC-05).

### User Story 3 - Cancelar sin alterar valores (Priority: P1)

La persona cancela un arrastre o una edición con Escape, con el gesto de cancelación del sistema o
con Tab, y los valores matemáticos quedan como estaban.

**Why this priority**: la cancelación es la garantía de que la interfaz no altera la respuesta por
accidente, y es criterio de aceptación explícito del incremento.

**Independent Test**: iniciar un arrastre, cancelar con Escape, con `pointercancel` y con Tab, y
comparar los valores antes y después; repetir con una edición de campo.

**Acceptance Scenarios**:

1. **Given** un arrastre en curso, **When** la persona pulsa Escape, **Then** el objeto vuelve al
   valor confirmado y el foco regresa al control (AC-06).
2. **Given** una edición con cambios sin confirmar, **When** la persona pulsa Escape, **Then** el
   campo recupera el último valor confirmado (AC-06).
3. **Given** un arrastre interrumpido por el sistema, **When** llega `pointercancel`, **Then** el
   estado se trata como cancelación y no como confirmación (AC-06).
4. **Given** un arrastre en curso, **When** la persona pulsa Tab, **Then** el arrastre se cancela
   antes de mover el foco al siguiente control y no se confirma ningún valor (AC-21).

### User Story 4 - Deshacer y reiniciar (Priority: P2)

La persona deshace el último cambio confirmado o reinicia el reto, con confirmación explícita
cuando hay cambios.

**Why this priority**: evita que un error de manipulación obligue a abandonar el ejercicio y hace
predecible el efecto de cada acción.

**Independent Test**: confirmar dos cambios, deshacer una vez y comprobar que solo se revierte el
último; reiniciar con cambios y comprobar que se pide confirmación; reiniciar desde un resultado
incorrecto y comprobar que vuelve al estado inicial.

**Acceptance Scenarios**:

1. **Given** dos cambios confirmados, **When** la persona pulsa Deshacer, **Then** se revierte solo
   el último y el anterior permanece (AC-07).
2. **Given** un ejercicio con cambios, **When** la persona pulsa Reiniciar, **Then** se pide
   confirmación explícita antes de volver a la configuración inicial (AC-08).
3. **Given** un ejercicio sin cambios, **When** la persona pulsa Reiniciar, **Then** no se pide
   confirmación y el estado inicial se restablece (AC-08).
4. **Given** un resultado `incorrect`, `indeterminate`, `incomplete` o `technical-error`,
   **When** la persona pulsa Reiniciar, **Then** se restablece la configuración inicial y se
   limpia el estado de validación (AC-08).

### User Story 5 - Bloqueo durante la validación (Priority: P1)

Mientras una validación está en curso, la persona no puede cambiar el valor evaluado, y una
activación repetida no genera solicitudes duplicadas.

**Why this priority**: sin este bloqueo se puede modificar la respuesta mientras se evalúa y el
resultado deja de corresponder a lo enviado.

**Independent Test**: enviar una respuesta, intentar arrastrar, editar, deshacer y reiniciar
durante `pending`, y comprobar que ninguna acción cambia el valor ni duplica la solicitud.

**Acceptance Scenarios**:

1. **Given** una validación en curso, **When** la persona intenta editar, arrastrar, deshacer o
   reiniciar, **Then** la acción se rechaza y el borrador permanece intacto (AC-09).
2. **Given** una validación en curso, **When** la persona activa Probar otra vez, **Then** no se
   crea una segunda solicitud vigente (AC-09).
3. **Given** una validación en curso, **When** la persona recorre la pantalla con Tab, **Then** el
   foco sigue siendo visible y no se pierde (AC-01, AC-09).

### User Story 6 - Conservar el estado ante fallos y respuestas tardías (Priority: P1)

Si la validación falla técnicamente, la respuesta se conserva y se informa el fallo; si llega una
respuesta antigua, se descarta y no altera el ejercicio vigente.

**Why this priority**: es la condición que evita que un fallo de red borre trabajo o que un
resultado viejo se muestre como actual.

**Independent Test**: simular un fallo técnico tras enviar y comprobar que el borrador sigue
intacto y que el estado no es éxito; simular dos solicitudes y comprobar que solo la vigente
actualiza la pantalla.

**Acceptance Scenarios**:

1. **Given** una respuesta enviada, **When** la validación falla técnicamente, **Then** se muestra
   un error explícito, el borrador se conserva y no se muestra éxito ni resultado incorrecto
   (AC-10).
2. **Given** una solicitud anterior y una vigente, **When** llega la respuesta anterior, **Then** se
   descarta y no cambia ningún estado (AC-11).
3. **Given** una validación en curso, **When** la persona cambia de ejercicio, **Then** la solicitud
   anterior se abandona y su respuesta no se aplica al ejercicio nuevo (AC-11).

### User Story 7 - Estados comprensibles sin color ni hover (Priority: P2)

La persona distingue estados y acciones con texto, icono o forma, puede usar la pantalla táctil sin
hover y acierta los controles con el dedo.

**Why this priority**: el contrato debe servir a mouse, touch y teclado por igual, y el color por sí
solo no comunica estado.

**Independent Test**: revisar cada estado en pantalla comprobando texto o icono asociado, recorrer
la interfaz sin hover y medir los objetivos táctiles.

**Acceptance Scenarios**:

1. **Given** cualquier estado de interacción visible, **When** la persona lo inspecciona,
   **Then** encuentra texto o icono que lo identifica además del color (AC-12).
2. **Given** un dispositivo sin hover, **When** la persona usa la pantalla, **Then** ninguna acción
   esencial requiere pasar el puntero por encima (AC-13).
3. **Given** un control operable, **When** se mide su objetivo táctil, **Then** alcanza al menos
   44×44 unidades de referencia (AC-14).

### User Story 8 - Consumir el contrato sin redefinirlo (Priority: P3)

Quien especifica una zona encuentra en este documento los estados, eventos, acciones y transiciones
que necesita, y puede declarar sus controles sin inventar estados paralelos.

**Why this priority**: la razón de ser del contrato es que 002 y 004–008 no diverjan; su valor se
comprueba en la consistencia entre consumidores.

**Independent Test**: tomar los controles declarados por dos consumidores distintos y comprobar que
ambos usan los mismos estados, eventos, acciones y transiciones para las mismas acciones.

**Acceptance Scenarios**:

1. **Given** el contrato publicado, **When** un consumidor declara un control, **Then** lo asocia a
   un estado y a una acción de este contrato sin crear estados nuevos (AC-15).
2. **Given** dos consumidores con la misma acción esencial, **When** se comparan sus transiciones,
   **Then** usan la misma transición y el mismo resultado observable (AC-15).

## Requirements

Todos los requisitos están **en revisión** hasta que se registre la aprobación correspondiente. La
columna de verificación remite a los criterios de aceptación que los comprueban.

### Máquina de estados (REQ-01…REQ-03)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-01 | El contrato define doce estados en dos ámbitos independientes. **Ámbito de control** (por control o grupo): `idle`, `focus`, `selected`, `dragging`, `editing`. **Ámbito de validación** (por ejercicio): `pending`, `correct`, `incorrect`, `indeterminate`, `incomplete`, `technical-error`, `success`. Cada estado tiene un significado observable. Los siete estados de validación se anuncian según REQ-21; los cinco de control no. | AC-12, AC-18 |
| REQ-02 | Cada transición del contrato declara precondición, acción que la provoca y resultado observable. No existe transición sin los tres elementos. | AC-16 |
| REQ-03 | Toda transición no enumerada está prohibida: no cambia valores, no crea estados y no se interpreta como éxito ni como resultado matemático. | AC-16 |

**Significado observable de los estados de control**

| Estado | Significado observable |
|---|---|
| `idle` | El control no tiene interacción activa; muestra su configuración actual |
| `focus` | El control tiene el foco; el foco es visible y expone el nombre accesible. No emite anuncio de transición |
| `selected` | Una opción u objeto está elegido y confirmado, sin arrastre ni edición en curso |
| `dragging` | Hay manipulación activa con puntero y valor transitorio; el valor no está confirmado |
| `editing` | Un control está en edición o manipulación con un valor aún no confirmado (campo u objeto) |

**Significado observable de los estados de validación**

| Estado | Significado observable |
|---|---|
| `pending` | Hay una validación en curso; el borrador está bloqueado |
| `correct` | Se muestra el resultado matemático correcto con su origen. El nivel aún no está completado |
| `incorrect` | Se muestra el resultado matemático incorrecto con su diagnóstico |
| `indeterminate` | Se informa que el verificador no pudo decidir; no se presenta como incorrecto |
| `incomplete` | Falta un campo obligatorio o su valor no es válido; no se envía al validador. El foco se mueve al campo faltante |
| `technical-error` | Se informa un fallo técnico; el borrador se conserva y se permite reintentar |
| `success` | Confirmación explícita de completación tras un resultado `correct`; el consumidor registra el avance y el desbloqueo. Solo se alcanza al activar «Continuar» |

**Relación entre ámbitos**

Los dos ámbitos son independientes: un cambio de estado de validación no altera el estado de
control salvo que la transición lo indique explícitamente (por ejemplo, mover el foco al control
relevante). Cuando no hay validación en curso ni resultado pendiente, el ámbito de validación está
limpio; no se le asigna un estado `idle` propio.

### Acciones semánticas (REQ-24)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-24 | El contrato define diez acciones semánticas —seleccionar, manipular, confirmar, cancelar, deshacer, reiniciar, probar, reintentar, continuar y cambiar de ejercicio— con su activación por puntero y por teclado. Los consumidores las implementan sin renombrarlas ni cambiar su resultado observable. | AC-02, AC-17, AC-22 |

| Acción semántica | Descripción | Activación por puntero/touch | Activación por teclado | Efecto |
|---|---|---|---|---|
| Seleccionar | Elegir una opción u objeto | `pointerdown` + `pointerup` sobre el elemento | `Enter` o `Espacio` | Control → `selected` |
| Manipular | Mover un objeto o valor | Arrastre: `pointerdown` → `pointermove` → `pointerup` | Flechas dentro de un grupo manipulable | Control → `dragging` (puntero) o `editing` (teclado) mientras se mueve; `selected` al confirmar |
| Confirmar | Comprometer un valor | `pointerup` dentro del área válida; clic en confirmar | `Enter`, `Tab` o `Espacio` | Control → `selected` |
| Cancelar | Descartar cambios sin confirmar | `pointercancel` o gesto de cancelación del sistema | `Escape` | Control → `selected` si había valor confirmado; `focus` en caso contrario |
| Deshacer | Revertir el último cambio confirmado | Clic en Deshacer | `Enter` o `Espacio` con foco en Deshacer | Control se conserva; se revierte el último cambio |
| Reiniciar | Volver a la configuración inicial | Clic en Reiniciar | `Enter` o `Espacio` con foco en Reiniciar | Control → `idle`; validación limpia |
| Probar | Enviar la respuesta a validación | Clic en Probar | `Enter` o `Espacio` con foco en Probar | Validación → `pending` o `incomplete` |
| Reintentar | Volver a edición sin reenvío automático | Clic en Reintentar | `Enter` o `Espacio` con foco en Reintentar | Control → `editing`; validación limpia |
| Continuar | Confirmar la completación tras `correct` | Clic en Continuar | `Enter` o `Espacio` con foco en Continuar | Validación → `success`; control → `idle` |
| Cambiar de ejercicio | Abandonar el ejercicio actual | Clic en navegación | `Enter` o `Espacio` con foco en navegación | Control → `idle`; validación limpia; solicitud abandonada si la había |

### Eventos y entradas (REQ-04…REQ-06, REQ-18, REQ-23)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-04 | Mouse, touch y teclado permiten las mismas acciones esenciales: seleccionar, manipular, confirmar, cancelar, deshacer, reiniciar y probar. Ninguna acción esencial existe en un solo modo de entrada. | AC-02, AC-17, AC-22 |
| REQ-05 | En una interacción con puntero, el control captura el puntero al recibir `pointerdown`, lo conserva durante `pointermove` y lo libera al recibir `pointerup` o `pointercancel`. La pérdida de captura sin `pointerup` se trata como cancelación. Un segundo contacto durante un arrastre se ignora por completo: no desplaza la captura, no altera el valor transitorio ni el confirmado. | AC-04, AC-06, AC-19 |
| REQ-06 | Los eventos del contrato son `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `Tab`, `Enter`/`Espacio`, flechas y `Escape`. Las acciones semánticas de REQ-24 se activan mediante estos eventos sobre los controles correspondientes. Cualquier otro evento del dispositivo no cambia el estado de interacción. | AC-02, AC-03 |
| REQ-18 | El teclado cumple: `Tab` y `Shift+Tab` desplazan el foco; `Enter` y `Espacio` activan; las flechas mueven el foco dentro de un grupo navegable o el valor transitorio dentro de un grupo manipulable; `Escape` cancela arrastre o edición; `Tab` durante un arrastre cancela el arrastre antes de mover el foco. | AC-01, AC-02, AC-03, AC-06, AC-21, AC-22 |
| REQ-23 | Salir de `editing` con `pointerdown` sobre otro control confirma el valor si es válido y ejecuta la acción del control destino. Si el valor no es válido, el foco permanece en el campo, se señala el error y el control destino no se activa. El texto escrito nunca se pierde. | AC-20 |

**Transiciones permitidas — ámbito de control**

| Precondición (control) | Acción | Resultado observable | Destino (control) |
|---|---|---|---|
| `idle` | `Tab` o `Shift+Tab` sobre un elemento operable | El foco se mueve en orden de lectura y es visible | `focus` |
| `focus` | `Enter` o `Espacio` sobre una opción u objeto | Se elige y confirma | `selected` |
| `focus` | `Enter` o `Espacio` sobre un control de acción | Se ejecuta la acción semántica; el foco permanece en el control | `focus` |
| `focus` o `selected` | Flecha dentro de un grupo navegable | El foco se mueve en el paso declarado por el consumidor | `focus` |
| `focus` o `selected` | Flecha sobre un objeto o valor manipulable | El valor transitorio se mueve en el paso declarado por el consumidor | `editing` |
| `idle`, `focus` o `selected` | `pointerdown` sobre un objeto arrastrable | Se captura el puntero y se retiene el valor original | `dragging` |
| `dragging` | `pointermove` | El objeto sigue al puntero; no se confirma ningún valor | `dragging` |
| `dragging` | `pointerup` dentro del área válida | Se confirma el valor final y se libera la captura | `selected` |
| `dragging` | `pointerup` fuera del área válida | Se restaura el valor original y se libera la captura | `selected` |
| `dragging` | `pointercancel`, pérdida de captura o `Escape` | Se restaura el valor original y no hay cambio confirmado | `selected` |
| `dragging` | `Tab` | Se cancela el arrastre antes de mover el foco al siguiente control; no se confirma ningún valor | `focus` |
| `focus` o `selected` | `Enter` sobre un campo editable | El campo entra en edición con su valor actual | `editing` |
| `editing` | `Enter` o `Tab` con valor válido | Se confirma el valor y se sale del campo | `selected` |
| `editing` | `Escape` | Se recupera el último valor confirmado | `selected` |
| `editing` | Flecha dentro de un grupo manipulable | El valor transitorio se mueve en el paso declarado por el consumidor | `editing` |
| `editing` | `pointerdown` sobre otro control con valor válido | Se confirma el valor y se ejecuta la acción del control destino | Según la acción del destino (ver tabla de acciones semánticas) |
| `editing` | `pointerdown` sobre otro control con valor inválido | El foco permanece en el campo, se señala el error y no se activa el destino | `editing` |

**Transiciones permitidas — ámbito de validación**

| Precondición (validación) | Acción | Resultado observable | Destino (validación) | Efecto en el control |
|---|---|---|---|---|
| Sin validación | Probar con todos los campos obligatorios completos | Se bloquean las acciones de cambio y se registra la solicitud vigente | `pending` | Foco permanece en Probar |
| Sin validación o `incomplete` | Probar con un campo obligatorio vacío | El campo se señala y no se envía al validador | `incomplete` | Foco se mueve al campo faltante |
| `incomplete` | Completar el campo obligatorio faltante | El campo vuelve a edición con el nuevo valor sin confirmar | Limpio | Control pasa a `editing` |
| `pending` | Respuesta `correct` | Se muestra el resultado con su origen; el nivel aún no está completado | `correct` | Foco se mueve a «Continuar» |
| `pending` | Respuesta `incorrect` | Se muestra el diagnóstico y se ofrece reintento | `incorrect` | Foco se mueve a «Reintentar» |
| `pending` | Respuesta `indeterminate` | Se informa que no se pudo decidir; no se marca como incorrecto | `indeterminate` | Foco se mueve a «Reintentar» |
| `pending` | Fallo técnico | Se informa el error; el borrador se conserva | `technical-error` | Foco permanece en el ejercicio |
| `correct` | Activar la acción «Continuar» | Se confirma la completación; el consumidor registra el avance y el desbloqueo | `success` | Control pasa a `idle` |
| `success` | Continuar o regresar | Se abandona la confirmación conservando lo confirmado | Limpio | Control pasa a `idle` |
| `incorrect`, `indeterminate` o `technical-error` | Reintentar | Se vuelve a edición sin reenvío automático; la siguiente activación de Probar crea una nueva solicitud | Limpio | Control pasa a `editing` |
| `incorrect`, `indeterminate`, `technical-error` o `incomplete` | Reiniciar (con confirmación si hay cambios) | Se restablece la configuración inicial y se descarta la historia de deshacer | Limpio | Control pasa a `idle` |
| Cualquier estado de validación | Cambio de ejercicio | Se limpia la validación; el borrador no se transfiere y la solicitud pendiente, si la había, se abandona | Limpio | Control pasa a `idle` |

**Transiciones prohibidas**

| Transición | Motivo |
|---|---|
| Control `dragging` → Probar (`pending`) | Probar no está disponible mientras se arrastra; primero se confirma o se cancela |
| Durante `pending`, transiciones de control a `dragging`, `editing` o `selected` que alteren valores | Durante `pending` las acciones de cambio están bloqueadas; solo se permite foco y lectura |
| Validación `incomplete` → `pending` | Una respuesta incompleta no se envía |
| Validación `correct`, `incorrect` o `indeterminate` → `pending` sin pasar por `editing` | Evita reenviar el mismo resultado como si fuera un intento nuevo |
| Validación `technical-error` → `success`, `correct` o `incorrect` | Un fallo técnico no se convierte en resultado ni en éxito |
| Validación sin estado → `correct`, `incorrect` o `indeterminate` sin validación previa | Ningún resultado matemático aparece sin validación previa |
| Respuesta de una solicitud no vigente → cualquier estado | Solo la solicitud vigente puede cambiar el estado |
| Validación `success` → `success` | La confirmación no se repite sin una nueva validación |
| Validación `correct` → `success` sin activar «Continuar» | La completación nunca es automática ni depende del tiempo de una animación |

### Reglas de sesión de interacción (REQ-07…REQ-13)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-07 | Deshacer revierte únicamente el último cambio confirmado del ejercicio activo. No deshace envíos, resultados ni reinicios, y no actúa durante `pending`. La historia de deshacer se reinicia al salir del ejercicio: al volver, el borrador restaurado es el punto de partida. | AC-07, AC-09 |
| REQ-08 | Reiniciar restablece la configuración inicial del ejercicio, limpia el estado de validación y descarta la historia de deshacer. Está disponible desde cualquier estado de validación con resultado (`incorrect`, `indeterminate`, `incomplete`, `technical-error`). Con cambios confirmados exige confirmación explícita; sin cambios no la exige. | AC-08 |
| REQ-09 | Durante `pending` se bloquean edición, arrastre, deshacer, reiniciar y un segundo envío. Se mantienen permitidos el foco, la lectura de estado y la navegación que no altere valores. | AC-09 |
| REQ-10 | Existe como máximo una solicitud vigente por ejercicio. Una activación repetida de Probar durante `pending` no crea una solicitud nueva ni incrementa contadores. | AC-09 |
| REQ-11 | Una respuesta cuya solicitud ya no es la vigente se descarta por completo: no cambia el estado, no se muestra y no se aplica a otro ejercicio. | AC-11 |
| REQ-12 | Ante un error técnico se conservan los valores del borrador y el foco; se muestra un mensaje de error explícito y se habilita reintentar. Nunca se muestra `success`, `correct` ni `incorrect`. | AC-10 |
| REQ-13 | Al cambiar de ejercicio se cancela cualquier arrastre o edición en curso, se abandona la solicitud pendiente, se limpia el estado de validación y no se transfieren valores al ejercicio nuevo. | AC-11 |

### Accesibilidad y contrato de estados visuales (REQ-14…REQ-17, REQ-19…REQ-22)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-14 | Todo elemento operable muestra foco visible; el orden de foco coincide con el orden de lectura; el foco no se oculta ni se pierde al entrar en `pending`. | AC-01, AC-09 |
| REQ-15 | Todo objetivo táctil mide al menos 44×44 unidades de referencia y mantiene separación suficiente para no activar un control vecino por error. | AC-14 |
| REQ-16 | Ninguna información o acción esencial depende de hover. El hover es solo una mejora y nunca el único medio para descubrir una acción o un estado. | AC-13 |
| REQ-17 | El color nunca es el único portador de significado: cada estado se comunica además con texto, icono, forma o posición. | AC-12 |
| REQ-19 | El valor matemático solo se confirma en `pointerup`, en la confirmación de edición o en la activación por teclado equivalente (`Enter` o `Espacio`). `pointermove` y la vista previa nunca alteran el valor enviado. | AC-04, AC-05, AC-06, AC-22 |
| REQ-20 | El contrato es independiente del renderizador: describe estados, eventos, acciones y resultados observables sin exigir PixiJS, Mafs, SVG ni una estructura de componentes concreta. | AC-15 |
| REQ-21 | Se anuncia de forma accesible el cambio a `pending`, `correct`, `incorrect`, `indeterminate`, `incomplete`, `technical-error` y `success`, con el nombre del estado y su efecto. `idle`, `focus`, `selected`, `dragging` y `editing` no emiten anuncio de transición; `focus` solo expone el nombre accesible. Los anuncios no dependen de efectos de sonido de la aplicación ni de color. | AC-12, AC-18 |
| REQ-22 | Los consumidores no definen estados, acciones ni transiciones propios: asocian sus controles a los de este contrato y pueden declarar pasos de teclado y presentación visual dentro de lo permitido. | AC-15 |

## Key Entities

| Entidad | Descripción | Datos observables |
|---|---|---|
| Estado de control | Situación de interacción de un control o grupo | Nombre del estado, valor mostrado, foco visible |
| Estado de validación | Situación de validación o resultado del ejercicio | Nombre del estado, anuncio accesible, origen del resultado |
| Evento de entrada | Acción del dispositivo que puede provocar una transición | Tipo de evento, elemento destino, modificadores |
| Acción semántica | Intención de la persona sobre un control | Nombre de la acción, activación por puntero y por teclado, resultado observable |
| Transición | Paso permitido entre estados | Precondición, acción, resultado observable, destino |
| Control operable | Elemento con el que se interactúa | Nombre accesible, estado, objetivo táctil, paso de teclado |
| Grupo de controles | Conjunto relacionado que comparte recorrido de flechas | Orden interno, elemento con foco |
| Captura de puntero | Retención del puntero durante un arrastre | Control que captura, momento de liberación; un segundo contacto no la desplaza |
| Valor confirmado | Valor vigente que el ejercicio considera actual | Valor por campo, momento de confirmación |
| Valor transitorio | Vista previa de un arrastre o edición no confirmada | Valor provisional, origen |
| Solicitud vigente | Envío de validación actualmente en curso | Identificador de correlación, ejercicio, estado `pending` |
| Respuesta obsoleta | Respuesta de una solicitud que ya no es la vigente | Identificador de correlación anterior |
| Historia de deshacer | Cambios confirmados revertibles del ejercicio activo | Último cambio, orden; la descartan el reinicio y la salida del ejercicio |
| Confirmación de reinicio | Aviso previo al reinicio cuando hay cambios | Estado con cambios, decisión de la persona |

## Success Criteria

### Measurable Outcomes

| ID | Resultado medible |
|---|---|
| SC-01 | El 100% de las transiciones del contrato declara precondición, acción y resultado observable: 0 transiciones incompletas. |
| SC-02 | Las siete acciones esenciales —seleccionar, manipular, confirmar, cancelar, deshacer, reiniciar y probar— se completan con mouse, con touch y con teclado: 3/3 modos por acción. |
| SC-03 | El 100% de las cancelaciones de arrastre y edición conserva los valores matemáticos previos: 0 cambios tras cancelar. |
| SC-04 | El 100% de los errores técnicos conserva el borrador y muestra error explícito sin éxito ni resultado matemático: 0 éxitos atribuidos a un fallo. |
| SC-05 | Ninguna respuesta de una solicitud no vigente actualiza un estado ni un ejercicio: 0 actualizaciones por respuestas obsoletas. |
| SC-06 | Ninguna acción o estado esencial depende de hover: 0 acciones esenciales solo por hover. |
| SC-07 | El 100% de los objetivos táctiles alcanza 44×44 unidades de referencia: 0 controles por debajo del mínimo. |
| SC-08 | Ningún estado se comunica solo por color: 0 estados sin texto, icono, forma o posición asociada. |
| SC-09 | Dos consumidores distintos usan el mismo estado y la misma transición para la misma acción esencial: 0 estados paralelos declarados. |
| SC-10 | Una persona puede completar el recorrido de interacción de prueba con cada modo de entrada sin perder el foco visible: 3/3 modos. |
| SC-11 | El 100% de las transiciones anunciadas —7 de 12 estados— emite un anuncio accesible con nombre y efecto, y los otros cinco estados no generan anuncios de transición: 7/7 anunciadas, 0/5 no anunciadas. |
| SC-12 | El 100% de las salidas de edición por clic confirma un valor válido y ejecuta el control destino, o señala el error conservando el texto: 0 pérdidas de texto escrito. |

## Acceptance Criteria

- **AC-01** — `Tab` y `Shift+Tab` recorren los controles en orden de lectura, con foco visible en
  todos y sin perderlo al entrar en `pending`.
- **AC-02** — `Enter` y `Espacio` activan el control con foco con el mismo efecto que el clic, y
  ambos modos producen el mismo resultado observable.
- **AC-03** — Las flechas mueven el foco dentro de un grupo navegable o el valor transitorio dentro
  de un grupo manipulable, y no abandonan el grupo.
- **AC-04** — `pointerdown` captura el puntero y `pointermove` mueve la vista previa sin confirmar
  ningún valor.
- **AC-05** — `pointerup` dentro del área válida confirma el valor y libera la captura; fuera del
  área válida restaura el último valor confirmado.
- **AC-06** — `Escape`, `pointercancel` y la pérdida de captura cancelan arrastre o edición y
  restauran los valores confirmados sin alterarlos.
- **AC-07** — Deshacer revierte solo el último cambio confirmado del ejercicio activo, no actúa
  sobre envíos, resultados ni reinicios, y la historia se reinicia al salir del ejercicio.
- **AC-08** — Reiniciar pide confirmación explícita cuando hay cambios y no la pide cuando no los
  hay; en ambos casos restablece la configuración inicial y limpia el estado de validación.
- **AC-09** — Durante `pending` las acciones de cambio se rechazan, el borrador queda intacto, el
  foco sigue visible y un segundo Probar no crea otra solicitud.
- **AC-10** — Un error técnico muestra un mensaje de error, conserva el borrador y nunca se presenta
  como `success`, `correct` ni `incorrect`.
- **AC-11** — Una respuesta de una solicitud no vigente se descarta y no actualiza ningún estado ni
  otro ejercicio; al cambiar de ejercicio la solicitud pendiente se abandona y la validación se
  limpia.
- **AC-12** — Cada estado muestra texto, icono, forma o posición que lo identifica además del color;
  las transiciones anunciadas en REQ-21 emiten un anuncio accesible con nombre y efecto, y las demás
  no generan anuncios de transición.
- **AC-13** — Ninguna acción o información esencial depende de hover; en un dispositivo sin hover se
  descubre y ejecuta todo lo necesario.
- **AC-14** — Todo control operable alcanza al menos 44×44 unidades de referencia y no activa por
  error a un control vecino.
- **AC-15** — El contrato no exige un renderizador concreto y dos consumidores distintos usan los
  mismos estados, acciones, eventos y transiciones para la misma acción esencial.
- **AC-16** — Toda transición listada tiene precondición, acción y resultado; toda transición no
  listada queda prohibida y no altera valores.
- **AC-17** — Las siete acciones esenciales están disponibles en mouse, touch y teclado con el mismo
  resultado observable.
- **AC-18** — El contrato enumera los doce estados en los dos ámbitos con significado observable y
  las transiciones anunciadas emiten anuncio accesible; `success` solo aparece después de un
  resultado `correct` y solo al activar «Continuar», nunca por tiempo ni tras un error técnico.
- **AC-19** — Un segundo contacto durante un arrastre se ignora: no desplaza la captura, no sustituye
  el arrastre y no altera el valor transitorio ni el confirmado.
- **AC-20** — Salir de `editing` con un clic confirma el valor válido y ejecuta el control destino;
  con valor inválido, el foco permanece, se señala el error y no se pierde el texto escrito.
- **AC-21** — `Tab` durante un arrastre cancela el arrastre antes de mover el foco al siguiente
  control y no confirma ningún valor.
- **AC-22** — Con teclado, las flechas mueven el valor transitorio de un objeto o valor manipulable
  dentro del grupo, `Enter` o `Espacio` confirma el valor y `Escape` lo cancela sin alterar el valor
  confirmado.

## Edge Cases

| Caso | Comportamiento esperado |
|---|---|
| El puntero sale de la ventana durante un arrastre | Se conserva la captura; si no hay `pointerup`, la pérdida de captura se trata como cancelación |
| El sistema emite `pointercancel` a mitad de arrastre | Se restaura el valor confirmado y no se registra cambio |
| Un segundo dedo toca la pantalla durante un arrastre | El segundo contacto se ignora por completo: no altera el arrastre vigente, no lo sustituye y no crea un segundo valor transitorio |
| La persona pulsa `Tab` durante un arrastre | El arrastre se cancela antes de mover el foco; no se confirma ningún valor |
| La persona pulsa `Escape` durante `pending` | La solicitud continúa; `Escape` no cancela una validación en curso ni borra el borrador |
| Llega una respuesta mientras la persona cambia de ejercicio | La respuesta se descarta; no se aplica al ejercicio nuevo |
| Llega una respuesta antigua después de una nueva | Solo la solicitud vigente actualiza el estado |
| El campo obligatorio queda vacío al confirmar la edición | El estado es `incomplete` y el foco se mueve al campo faltante; no se envía al validador |
| Se pulsa Deshacer sin cambios confirmados | La acción no tiene efecto y no genera error técnico |
| La persona vuelve a un ejercicio con borrador | Se restaura el borrador como punto de partida y deshacer no revierte cambios anteriores a la salida |
| Se pulsa Reiniciar sin cambios | Se restablece el estado inicial sin confirmación |
| Se hace clic en otro control con un campo en edición | Se confirma el valor válido; con valor inválido, el foco permanece en el campo, se señala el error y el texto no se pierde |
| El foco está en un control que pasa a `pending` | El foco permanece visible; las acciones de cambio se rechazan |
| La persona navega solo con teclado | Puede seleccionar, manipular con flechas, confirmar, cancelar, deshacer, reiniciar y probar |
| El dispositivo no tiene hover | Todas las acciones y estados siguen siendo descubribles y operables |
| El control tiene menos de 44×44 por diseño visual | El área operable se amplía sin cambiar la apariencia solicitada |
| Un consumidor propone un estado no listado | Se rechaza; debe expresarse con un estado existente y una transición del contrato |

## Assumptions

- **Dos ámbitos independientes:** los estados de control y los de validación conviven sin
  interferirse; un cambio de validación solo altera el control cuando la transición lo declara
  (por ejemplo, mover el foco al control relevante).
- **`indeterminate` forma parte del contrato:** aunque no aparecía en la enumeración inicial, 001 lo
  define como resultado matemático y este contrato no puede omitirlo sin contradecir el núcleo.
- **`success` es distinto de `correct`:** `correct` muestra el resultado matemático sin completar el
  nivel; `success` es la confirmación explícita de completación, solo mediante la acción «Continuar».
  El consumidor registra el avance y el desbloqueo; este contrato no persiste nada. Una vez por cada
  resultado correcto confirmado; repetir un nivel resuelto puede producir una nueva confirmación
  tras una nueva validación correcta. La presentación visual y su duración las declara el
  consumidor.
- **Pasos de teclado:** el tamaño del paso de las flechas y el conjunto exacto de controles de cada
  grupo los declara el consumidor; este contrato solo exige que el movimiento sea posible y
  anunciado.
- **Unidades de referencia:** 44×44 se mide en unidades de referencia del sistema de diseño, no en
  píxeles físicos del dispositivo.
- **Sesión de interacción:** deshacer, reiniciar y cancelar operan sobre la sesión activa del
  ejercicio. El borrador persiste al salir y se restaura como punto de partida, pero la historia de
  deshacer se descarta al salir; qué se guarda entre recargas pertenece a la spec de progreso.
- **Sin cronómetros:** una pérdida de captura, un `Escape` o un `pointercancel` se procesan de
  inmediato; no se define un tiempo de espera para interpretarlos.
- **Un ejercicio a la vez:** el contrato asume un ejercicio activo por pantalla y no regula
  concurrencia entre ejercicios distintos.
- **Renderizador agnóstico:** los consumidores pueden usar escenas 2D, gráficas o controles HTML
  equivalentes; el contrato solo fija comportamiento observable.
- **Autoridad de aprobación:** Edwin Ernesto Rodríguez Pérez, en representación del equipo.

## Trazabilidad

| Fuente | Requisitos afectados |
|---|---|
| Constitución II (fronteras de validación) | REQ-19, REQ-20, REQ-22 |
| Constitución III (rigor matemático) | REQ-19, REQ-06 |
| Constitución V (estados explícitos) | REQ-01, REQ-03, REQ-12 |
| Constitución VII (aprobación por etapas) | Aprobaciones |
| Spec 001 REQ-04, REQ-08, REQ-13 | REQ-01, REQ-03, REQ-12 |
| Spec 002 REQ-10, REQ-18 | REQ-14, REQ-15, REQ-16, REQ-17 |
| GDD 2.4, 2.5, 5.1 | REQ-02, REQ-18, REQ-21, REQ-24 |
| Auditoría B3 | REQ-05, REQ-06, REQ-14, REQ-18, REQ-20 |

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Especificación del contrato de interacción 2D |
| Veredicto | `Aprobado` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | spec para plan |
| Versión o revisión | `spec.md`, versión de trabajo 0.1.1 |
| Comentarios o condiciones | Aprueba únicamente la especificación del contrato transversal de interacción 2D para su consumo por 002 y 004–008. No acredita implementación ni pruebas y no autoriza implementar sin aprobar las etapas posteriores. |

Este registro no sustituye el registro de aprobaciones de [`specs/README.md`](../README.md) ni
acredita aprobación de contenido, implementación o pruebas.
