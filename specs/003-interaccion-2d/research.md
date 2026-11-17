# Research: Contrato transversal de interacción 2D

**Feature**: `003-interaccion-2d` | **Fecha**: 2026-11-16 | **Estado**: propuesta para revisión

Este documento resuelve las decisiones técnicas de planificación (Fase 0) para el contrato
transversal de interacción 2D de FUNctions. No implementa el contrato, no escribe componentes y no
introduce bibliotecas ni dependencias de ejecución. Las decisiones que pertenecen a los
consumidores (geometría de arrastre, pasadas de teclado, presentación visual, animación,
persistencia entre sesiones) se mantienen como responsabilidades de los consumidores y no se
infieren.

## D-01. Arquitectura de la máquina de estados

**Decisión**: implementar la máquina de estados como un **reducer síncrono y puro en TypeScript** en
`frontend/src/shared/interaction/machine/machine.ts`. El reducer recibe el estado actual de la
sesión y un **intento normalizado** (`InteractionEvent`); valida las precondiciones contra la tabla de
transiciones y devuelve un nuevo estado de sesión junto con una lista de **efectos como datos**
(`InteractionEffect[]`). El reducer no realiza llamadas I/O, no modifica el DOM, no dispara
cronómetros y no importa React, PixiJS, Mafs ni ninguna dependencia externa.

**Rationale**: un reducer puro garantiza determinismo estricto, facilita el testing con Vitest sin
necesidad de un entorno DOM, desacopla completamente el contrato del renderizador (REQ-20/AC-15) y
permite que consumidores React, PixiJS o Mafs compartan la misma lógica sin duplicar reglas. Emitir
efectos como datos (en lugar de invocar callbacks directamente) permite auditar las decisiones de la
máquina en pruebas y evita sorpresas de reentrancia.

**Alternativas consideradas**:

- **Adoptar XState o similar**: añadiría una dependencia de runtime y una abstracción compleja no
  aprobada por la Constitución; rechazado.
- **Clases orientadas a objetos con mutación de estado**: dificulta el seguimiento de cambios y no se
  integra limpiamente con el flujo unidireccional de datos de React.
- **Gestión dispersa mediante banderas booleanas en componentes**: violaría la Constitución
  (Principio V) y la spec (REQ-01/REQ-03), que exigen estados explícitos y transiciones prohibidas por
  catálogo.

## D-02. Normalización de eventos de puntero y touch

**Decisión**: normalizar los eventos de mouse y touch a través del modelo **Pointer Events**
(`pointerdown`, `pointermove`, `pointerup`, `pointercancel`). Durante un arrastre (`dragging`), el
contrato registra el `activePointerId`. Todo evento posterior cuyo `pointerId` no coincida con el
activo se ignora por completo (AC-19, REQ-05). La pérdida de captura sin `pointerup` o un evento
`pointercancel` se reducen automáticamente a la acción semántica `Cancelar`, restaurando el valor
confirmado previo sin alterar el borrador enviado.

**Rationale**: Pointer Events unifica mouse, touch y lápiz en un solo contrato, evitando duplicar
manejadores para mouse y touch. El bloqueo de un segundo contacto previene fallos por multitáctil en
pantallas táctiles de tabletas/móviles. El tratamiento inmediato de `pointercancel` o pérdida de
captura como cancelación garantiza la regla de no alteración de respuestas por interrupción del
sistema (AC-06).

**Alternativas consideradas**:

- **Soportar Touch Events y Mouse Events por separado**: mayor complejidad, código duplicado y riesgo
  de inconsistencias entre dispositivos; rechazado.
- **Librerías de gestos de terceros (e.g. `@use-gesture`)**: viola la prohibición constitucional de
  dependencias adicionales sin aprobación expresa; rechazado.
- **Ignorar `pointercancel`**: provocaría que un arrastre interrumpido por una notificación del sistema
  o salida del viewport quede congelado en `dragging`; rechazado.

## D-03. Normalización de eventos de teclado y recorrido de foco

**Decisión**: normalizar la entrada por teclado a diez claves canónicas: `Tab`, `Shift+Tab`, `Enter`,
`Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Escape` y `Delete`/`Backspace` (solo en
`editing`). El teclado opera en dos modos:
1. **Navegación**: `Tab`/`Shift+Tab` recorren los controles en el orden de lectura expuesto por el
   consumidor.
2. **Manipulación**: dentro de un grupo manipulable, las flechas modifican el valor transitorio
   (`editing`) aplicando el paso indicado por el consumidor; `Enter`/`Space` confirman (`selected`);
   `Escape` cancela restaurando el último valor confirmado.

`Tab` pulsado a mitad de un arrastre cancela el arrastre antes de desplazar el foco (REQ-18, AC-21).

**Rationale**: abstrae las variaciones de teclado de distintos navegadores y sistemas operativos.
Garantiza la paridad completa de teclado (REQ-04, REQ-18, AC-01, AC-02, AC-03, AC-22) y satisface la
regla de cancelación limpia antes del cambio de foco.

**Alternativas consideradas**:

- **Usar `keyCode` o `which`**: APIs obsoletas en la web moderna; rechazado.
- **Dejar la navegación por flechas a la implementación libre de cada componente**: provocaría
  divergencia en el comportamiento del foco entre zonas; rechazado.

## D-04. Política de salida de edición por puntero

**Decisión**: cuando la persona interactúa mediante `pointerdown` con un control destino B teniendo
un campo A en `editing`:
1. El contrato solicita al consumidor verificar la **validez sintáctica** del borrador actual de A.
2. Si el valor es **válido**: se confirma A, se pasa A a `selected` (o el estado de control que
   corresponda) y se ejecuta inmediatamente la acción asociada a B.
3. Si el valor es **inválido**: el foco permanece en A, A continúa en `editing`, no se pierde el texto
   escrito, se emite el efecto de error de campo (`show-field-error`) y la acción del destino B NO se
   ejecuta (REQ-23, AC-20).

**Rationale**: responde directamente a la aclaración Q5 y a REQ-23/AC-20. Previene la pérdida de trabajo
por clics accidentales y asegura que las entradas incompletas o mal formadas se señalen sin borrar lo
que la persona escribió.

**Alternativas consideradas**:

- **Descartar silenciosamente el valor inválido y volver al valor anterior**: violaría la regla de no
  pérdida de texto escrito y confundiría al usuario.
- **Confirmar un valor inválido**: contaminaría la sesión con datos mal formados y violaría el rigor
  matemático.
- **Ignorar el clic en B y solo mantener foco sin señalar error**: dejaría al usuario sin saber por qué
  el control B no respondió.

## D-05. Política de anuncios accesibles

**Decisión**: el contrato expone un módulo de anuncios (`accessibility/announcements.ts`) que emite
anuncios accesibles **únicamente** al ingresar a uno de los 7 estados de validación anunciados:
`pending`, `correct`, `incorrect`, `indeterminate`, `incomplete`, `technical-error` y `success`. Los 5
estados de control (`idle`, `focus`, `selected`, `dragging`, `editing`) son **silenciosos** para
anuncios de transición (REQ-21, AC-12, SC-11). Cada anuncio emitido incluye un número de secuencia
monotónico (`sequence`) para que los consumidores lo envíen a una región `aria-live` sin duplicar.

**Rationale**: responde a la aclaración Q4 y a REQ-21. Evita saturar a quienes usan lectores de
pantalla durante arrastres o navegaciones con `Tab` (donde el navegador expone el foco visible y el
nombre accesible sin necesidad de anuncios de transición adicionales).

**Alternativas consideradas**:

- **Anunciar los 12 estados**: saturación inaceptable en lecturas de pantalla durante la manipulación
  continua; rechazado.
- **No emitir anuncios desde el contrato y dejarlo a criterio de cada zona**: riesgo de inconsistencia
  y pérdida de accesibilidad uniforme entre 002 y 004–008.

## D-06. Sesión de interacción, borrador e historia de deshacer

**Decisión**: la sesión de interacción mantiene:
- `draft`: mapa de valores vigentes por control en el ejercicio activo.
- `undoHistory`: pila de cambios confirmados exclusivamente del ejercicio activo.
- `confirmedValues`: snapshot del último estado confirmado.

Al salir o cambiar de ejercicio, `undoHistory` se reinicia a una lista vacía (Q2, REQ-07, AC-07). Al
volver al ejercicio, el borrador previamente guardado se restaura como punto de partida, pero la
historia de deshacer NO se recupera.

**Rationale**: responde a la aclaración Q2 y a REQ-07. Evita que la función de deshacer salte entre
ejercicios distintos o intente revertir envíos, resultados o reinicios.

**Alternativas consideradas**:

- **Persistir la historia de deshacer entre recargas o cambios de ejercicio**: innecesario, complejo y
  propenso a estados inconsistentes tras cambios de versión; rechazado.
- **Borrar el borrador al salir**: violaría las especificaciones de progreso y la experiencia del
  jugador.

## D-07. Correlación de solicitudes (`pending`), descarte de respuestas obsoletas y guarda de `success`

**Decisión**:
1. Durante `pending`, el contrato genera un `requestId` único y registra la `exerciseGeneration`. Todas
   las acciones que modifiquen el borrador (`dragging`, `editing`, `undo`, `reset`, `probar`) se
   rechazan (REQ-09, AC-09).
2. Si llega una respuesta de validación cuyo `requestId` o `exerciseGeneration` no coincida con el
   activo, se descarta silenciosamente sin alterar el estado (REQ-11, AC-11, SC-05).
3. El estado de validación `success` **solo** se alcanza cuando el estado actual es `correct` y la
   persona activa explícitamente la acción semántica `Continuar` (Q1, REQ-01, REQ-24, AC-18). Nunca es
   automático ni por tiempo.

**Rationale**: garantiza la regla de una sola solicitud vigente (REQ-10), inmuniza al cliente contra
respuestas desordenadas de la red o del backend y cumple la norma estricta de completación explícita.

**Alternativas consideradas**:

- **Permitir cancelar `pending` con Escape**: rechazado por regla de spec (caso de borde: `Escape` en
  `pending` no cancela la validación en curso).
- **Pasar a `success` automáticamente al recibir `correct`**: rechazado por aclaración Q1 y AC-18.

## D-08. Rendimiento, latencia y ausencia de temporizadores

**Decisión**: el módulo del contrato no utiliza `setTimeout`, `setInterval`, `requestAnimationFrame`
ni operaciones asíncronas de ningún tipo. Toda transición es un cálculo puramente síncrono en `O(1)` de
complejidad temporal respecto del número de estados.

**Rationale**: en ausencia de un riesgo material de rendimiento o latencia identificado en la spec, la
Constitución prohíbe inventar umbrales numéricos artificiales. El diseño síncrono en `O(1)` asegura
que la respuesta visual sea inmediata y ocurra en el mismo turno de ejecución del evento.

**Alternativas consideradas**:

- **Añadir un temporizador de debounce para `pointermove`**: innecesario y contraproducente a nivel de
  contrato; la vista previa se actualiza inmediatamente y el valor solo se confirma en `pointerup`.

## D-09. Estrategia de verificación en Node.js (Vitest)

**Decisión**: estructurar la suite de pruebas en `frontend/tests/interaction/` usando Vitest en
entorno `node` puro. No se instalan ni usan `jsdom`, `happy-dom` ni navegadores headless. Los eventos
y el DOM se simulan mediante objetos de evento TypeScript tipados (`fixtures.ts`). La validez de los
esquemas JSON de `contracts/` se prueba mediante `Ajv` (ya instalado en devDependencies).

**Rationale**: mantiene las pruebas ultrarrápidas (<100ms total), sin añadir dependencias ni
infraestructura pesada de testing, cumpliendo estrictamente con el Principio VI de la Constitución (no
añadir dependencias sin aprobación). La verificación de UI real y foco visible se realiza de forma
manual en las specs consumidoras.

**Alternativas consideradas**:

- **Instalar `jsdom` o `@testing-library/react`**: requiere aprobación constitucional de nueva
  dependencia; no es necesario para probar la lógica pura de la máquina de estados.

## D-10. Cero dependencias nuevas

**Decisión**: no instalar ningún paquete nuevo en `package.json`. Toda la funcionalidad se
construye con TypeScript nativo y se prueba con las herramientas dev existentes (`typescript`,
`vitest`, `ajv`).

**Rationale**: cumplimiento obligatorio del Principio II y VI de la Constitución FUNctions v1.0.0.

---

### Resumen de alineación técnica

| Aspecto | Elección técnica | Justificación |
|---|---|---|
| Lógica de estados | Reducer síncrono puro TS | Agnóstico al renderizador, determinista, 0 dependencias |
| Normalización puntero | Pointer Events + id activo | Unifica mouse/touch, bloquea multitouch (AC-19) |
| Normalización teclado | 10 claves canónicas + 2 modos | Paridad de teclado completa (REQ-18, AC-22) |
| Anuncios accesibles | Módulo con 7 estados y `sequence` | Satisface REQ-21, AC-12, SC-11 |
| Solicitud y descarte | `requestId` + `exerciseGeneration` | Inmunidad a respuestas obsoletas (AC-11) |
| Entorno de pruebas | Node.js + Vitest + Ajv | Ultrarrápido, 0 dependencias nuevas |
