# UI Contract: Primer recorrido — índice y recorrido E01/E08

**Feature**: `002-primer-recorrido` | **Fecha**: 2026-11-16 | **Estado**: contrato para revisión

Este contrato fija las pantallas, acciones, estados observables y obligaciones de accesibilidad del
corte vertical. La fuente normativa sigue siendo [`spec.md`](../spec.md); este documento traduce sus
requisitos a una interfaz verificable sin añadir funcionalidad.

La navegación es una máquina de pantallas en React. No hay URLs profundas de ejercicio ni router
externo. La ruta inicial monta el índice.

## 1. Inventario de pantallas

| Pantalla | Propósito | Acciones principales | Salida |
|---|---|---|---|
| `index` | Entrada al producto | Comenzar, Instrucciones, Acerca de, Cómo se Juega; Continuar si hay progreso legible | Intro, recorrido, pantallas informativas |
| `intro` | Introducción breve real | Continuar al recorrido | `flow` |
| `flow` | Recorrido de prueba E01 → E08 | Abrir ejercicio disponible, volver al índice | `exercise:E01`, `exercise:E08`, `index` |
| `exercise:E01` | Clasificar la relación como función | Probar, Deshacer, Reiniciar, Ayudas H1–H3, Continuar tras correcto | `flow` |
| `exercise:E08` | Ajustar `h` y `k` del vértice | Probar, Deshacer, Reiniciar, Ayudas H1–H3, Continuar tras correcto | `flow` |
| `instructions` | Reglas normativas | Volver al índice | `index` |
| `how-to-play` | Práctica de las acciones | Volver al índice | `index` |
| `about` | Créditos y licencia | Volver al índice | `index` |
| `progress-recovery` | Progreso ilegible o de versión desconocida | Iniciar misión nueva con confirmación, volver | `intro`, `index` |

## 2. Índice

### 2.1 Contenido

- Nombre canónico: **FUNctions**.
- Descripción breve del juego.
- Cuatro acciones base con etiqueta visible: **Comenzar**, **Instrucciones**, **Acerca de** y
  **Cómo se Juega**.
- **Continuar** se añade solo cuando existe progreso legible de una misión iniciada. Sin progreso no
  aparece ni se anuncia.
- No muestra temporizador, vidas, puntos, insignias ni progreso que no exista.

### 2.2 Reglas de acción

| Acción | Sin progreso | Con progreso legible | Con progreso ilegible |
|---|---|---|---|
| Comenzar | Abre `intro` y crea misión | Pide confirmación; si se confirma, crea misión nueva y abre `intro` | Abre `progress-recovery`; no sobrescribe |
| Continuar | No existe | Retoma el último punto guardado | No existe |
| Instrucciones | Abre `instructions` | Abre `instructions` | Abre `instructions` |
| Acerca de | Abre `about` | Abre `about` | Abre `about` |
| Cómo se Juega | Abre `how-to-play` | Abre `how-to-play` | Abre `how-to-play` |

La confirmación de Comenzar con progreso existente es un diálogo modal con dos acciones explícitas:
«Iniciar misión nueva» y «Cancelar». Cancelar conserva el progreso y devuelve el foco a Comenzar.

### 2.3 Estados de destino

Si un destino del corte no está disponible en la instalación, la acción se muestra deshabilitada con
un mensaje explícito, sin tono de error técnico y sin afirmar que el juego está completo.

## 3. Introducción breve

- Es una pantalla real y mínima, no un placeholder silencioso.
- Muestra el texto de introducción con `approvalStatus: approved`.
- Si el contenido no está aprobado, muestra un aviso explícito de contenido pendiente y no inventa
  narrativa.
- Su única acción de avance lleva al recorrido de prueba con E01 disponible.
- No se puede saltar mediante una acción del índice ni por una ruta profunda.

## 4. Recorrido de prueba

### 4.1 Contenido

- Muestra el avance real de los dos ejercicios incluidos.
- E01 aparece disponible al entrar.
- E08 aparece bloqueado hasta que E01 está resuelto.
- Al resolver E01, E08 se muestra como **avance parcial del recorrido de prueba**, no como Zona 3
  completa.
- Al resolver E08, el recorrido se muestra completo y permite volver al índice.
- No hay mapa de zonas, navegación por zonas ni victoria 15/15.

### 4.2 Estados de cada ejercicio

| Estado | Texto o icono | Acción |
|---|---|---|
| Disponible | «Disponible» | Abrir |
| En progreso | «En progreso» + borrador | Abrir |
| Resuelto | «Resuelto» + marca no cromática | Abrir para repasar |
| Bloqueado | «Se desbloquea al resolver E01» | Deshabilitado |

El estado nunca se comunica solo por color.

## 5. Marco común de ejercicio

Cada ejercicio presenta:

- título, zona y objetivo educativo;
- enunciado;
- representación interactiva o gráfica;
- controles de respuesta;
- acciones **Probar**, **Deshacer**, **Reiniciar** y **Ayudas**;
- región de estado y diagnóstico;
- etiqueta de origen del resultado vigente;
- acción **Continuar** cuando el resultado es `correct`;
- acción **Reintentar** cuando el resultado es `incorrect`, `indeterminate` o hay error técnico.

### 5.1 Acciones

| Acción | Comportamiento | Accesibilidad |
|---|---|---|
| Probar | Valida si la respuesta está completa; si no, muestra `incomplete` | Botón nativo, `Enter`/`Space` |
| Deshacer | Revierte el último cambio confirmado del ejercicio | Botón nativo; deshabilitado si no hay cambios |
| Reiniciar | Restaura la configuración inicial; pide confirmación si hay cambios | Botón nativo; diálogo con foco gestionado |
| Ayudas | Abre H1; H2 requiere H1; H3 requiere H2 | Botón nativo; panel con etiquetas y foco devuelto |
| Continuar | Solo tras `correct`; avanza al recorrido | Botón nativo, enfocado tras el resultado |
| Reintentar | Limpia la validación y conserva el borrador | Botón nativo |

### 5.2 Estados de validación

| Estado | Qué ve la persona | Qué puede hacer |
|---|---|---|
| Sin responder | Controles iniciales | Editar, ayudas, reiniciar |
| `incomplete` | Campo señalado y mensaje; no se envía | Corregir y probar |
| `pending` | Indicador de validación; controles de cambio bloqueados | Esperar el resultado vigente |
| `correct` | Diagnóstico positivo, origen y Continuar | Continuar o repasar |
| `incorrect` | Diagnóstico, origen y Reintentar | Editar, ayudas, reintentar |
| `indeterminate` | Aviso de que el verificador no decidió, origen y Reintentar | Editar, ayudas, reintentar |
| Error técnico | Fallo explícito, respuesta conservada y Reintentar | Reintentar; no hay fallback |

`pending` no se abandona por temporizador ni por una respuesta anterior. Una respuesta obsoleta se
descarta.

### 5.3 Origen de validación

- Cada resultado vigente muestra «local» o «API».
- La etiqueta se toma del gateway que produjo el resultado.
- Permanece visible al volver al ejercicio desde el recorrido dentro de la misma sesión.
- No se guarda en el progreso. Tras recargar no se muestra un resultado anterior como validación
  nueva ni se le atribuye un origen.
- Una validación local nunca se presenta como API.

### 5.4 Ayudas

- H1 está disponible desde el inicio.
- H2 se habilita tras consultar H1.
- H3 se habilita tras consultar H2.
- No se exigen errores ni esperas.
- H3 no rellena ni envía la respuesta.
- La mayor ayuda consultada se conserva en el progreso.
- Consultar ayudas no reduce el progreso ni añade insignias.

## 6. E01 — El Conector de Energía

- Diagrama sagital fijo de `A = {1,2,3}`, `B = {4,5}` y
  `R = {(1,4), (2,4), (3,5)}`.
- Opciones mutuamente excluyentes: **Es función** y **No es función**.
- No se construyen ni desconectan cables.
- Una descripción textual equivalente acompaña al canvas para tecnología de asistencia.
- Resultado correcto: explicación de que cada entrada tiene una única imagen; compartir la salida 4
  es válido.
- Resultado incorrecto: diagnóstico de que varios cables pueden llegar al mismo nodo de salida y que
  lo prohibido es que una entrada tenga dos imágenes.
- El resultado `correct` marca E01 resuelto y habilita E08; Continuar avanza al recorrido.

## 7. E08 — Foco del Vértice

- Gráfica de `f(x) = (x − h)² + k` con `a = 1` fijo y punto objetivo `(3, 2)`.
- Campos numéricos exactos para `h` y `k`, con etiquetas y `inputMode` decimal.
- Se acepta coma o punto decimal en la entrada; se normaliza a la gramática de 001.
- El redondeo es solo visual; la comparación es exacta.
- El eje de simetría puede mostrarse como explicación complementaria, no como campo obligatorio.
- Resultado correcto: `h = 3`, `k = 2`; el nivel queda resuelto y Continuar avanza.
- Resultado incorrecto con `h = -3`: diagnóstico de signo.
- Resultado incorrecto con `h = 2.99` u otro valor: diagnóstico de vértice/parámetros.
- Campo vacío: `incomplete`, no `0` ni `incorrect`.

## 8. Pantallas informativas

### 8.1 Instrucciones

Muestra:

- objetivo educativo;
- reglas generales;
- progresión por zonas y niveles;
- condición de victoria 15/15;
- reintentos ilimitados;
- ayudas H1–H3.

No muestra temporizador, vidas, puntos ni insignias.

### 8.2 Cómo se Juega

Muestra:

- acciones Probar, Deshacer, Reiniciar y Ayudas H1–H3;
- significado de la validación y de la retroalimentación;
- uso de teclado, mouse y pantalla táctil;
- qué hacer ante `incomplete`, `correct`, `incorrect`, `indeterminate` y error técnico.

### 8.3 Acerca de

- Si el contenido está aprobado: nombre FUNctions, propósito, equipo, autoría y licencia MIT.
- Si no está aprobado: aviso explícito de contenido pendiente, sin datos inventados.
- No incluye NASA, ANE ni logotipos oficiales.
- Ofrece volver al índice en una acción.

## 9. Recuperación de progreso

`progress-recovery` se muestra cuando el contenido de `functions.progress.v1` no es JSON válido, no
cumple el esquema o declara una versión distinta de `1`.

| Elemento | Comportamiento |
|---|---|
| Mensaje | Explica que el progreso no se pudo leer y que no se sobrescribió |
| Iniciar misión nueva | Pide confirmación; conserva el contenido anterior en una clave de respaldo antes de escribir |
| Volver | Regresa al índice sin Continuar |
| Continuar | No se ofrece |

Si LocalStorage no está disponible, la interfaz informa que no se pudo guardar y no afirma que el
progreso se conservó.

## 10. Accesibilidad

| Requisito | Implementación observable |
|---|---|
| Teclado | Todas las acciones esenciales son botones o campos nativos; `Tab` recorre en orden de lectura; `Enter`/`Space` activan |
| Foco visible | Cada control muestra un indicador de foco no dependiente del color |
| Objetivos táctiles | Cada acción mide al menos 44×44 unidades de referencia |
| Etiquetas | Todo campo y botón tiene nombre accesible; las ayudas se asocian con `aria-describedby` |
| Estado | Resultados, errores y origen usan texto o icono además del color |
| Anuncios | Los cambios de validación se publican en una región `aria-live="polite"` |
| Diálogos | Usan `<dialog>` nativo o equivalente con foco inicial, cierre por `Escape` y retorno de foco |
| Canvas | El diagrama de E01 tiene descripción textual y controles alternativos fuera del canvas |
| Gráfica | La parábola de E08 tiene descripción del punto objetivo y campos numéricos operables |

La verificación de foco visible, tamaño táctil y lector de pantalla es manual; se registra en
[`quickstart.md`](../quickstart.md).

## 11. Contenido y lenguaje

- Toda la interfaz está en español.
- Los textos no presuponen conocimiento previo del proyecto.
- Los números se muestran con formato español y sin ambigüedad decimal.
- No hay autenticación, datos personales, analítica externa ni logotipos oficiales.
- El contenido de `about` y `intro` respeta `approvalStatus`.

## 12. Trazabilidad

| Pantalla o regla | Requisitos | Criterios |
|---|---|---|
| Índice y acciones | REQ-01, REQ-02, REQ-10, REQ-11, REQ-12 | AC-01, AC-02, AC-08, AC-11, AC-12 |
| Comenzar y Continuar | REQ-02, REQ-03, REQ-16 | AC-02, AC-16 |
| Instrucciones | REQ-04, REQ-09 | AC-03 |
| Cómo se Juega | REQ-05, REQ-09 | AC-04 |
| Acerca de | REQ-06, REQ-07 | AC-05, AC-06 |
| E01 | REQ-13, REQ-14, REQ-15 | AC-13, AC-15 |
| E08 | REQ-13, REQ-14, REQ-15 | AC-14, AC-15 |
| Origen local/API | REQ-17 | AC-17 |
| Progreso y recuperación | REQ-16 | AC-16 |
| Accesibilidad | REQ-10, REQ-18 | AC-08, AC-09, AC-16 |
| Recorrido sin mapa | REQ-19 | AC-02, AC-12, AC-16 |
