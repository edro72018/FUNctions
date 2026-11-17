# Feature Specification: Primer recorrido — índice y recorrido E01/E08

**Feature Branch**: `002-primer-recorrido`

**Created**: 2026-11-16

**Status**: Aprobado

**Input**: User description: "Especifica el primer corte vertical de FUNctions: el índice de inicio y el recorrido E01/E08, de punta a punta, sobre los contratos del núcleo 001. No es una zona completa; es el corte mínimo que demuestra que la entrada, la interacción y la validación funcionan juntas. El índice es la primera historia de este corte; no crees una spec separada para él."

## Contexto y alcance

### Propósito

Este incremento demuestra, de punta a punta y con el menor alcance posible, que la persona
jugadora puede entrar al juego, iniciar o continuar una misión, resolver dos ejercicios
canónicos —E01 y E08— con retroalimentación y ayudas, y ver restaurado su progreso. El índice de
inicio forma parte de este corte como primera historia; no existe ni se creará una spec separada
para él.

El corte no completa una zona ni el juego. Verifica que la entrada, la interacción y la
validación del núcleo funcionan juntas; el resto de ejercicios y zonas se especifica en
incrementos posteriores.

### Alcance de este incremento

- El índice de inicio con sus cuatro acciones base, Continuar condicional y las tres pantallas
  informativas.
- El flujo Comenzar/Continuar hasta la introducción breve y el recorrido de prueba, con E01 como
  primer ejercicio y E08 como continuación tras resolver E01.
- El ejercicio E01 con clasificación booleana y el ejercicio E08 con vértice `(h, k)` y `a = 1`.
- Diagnóstico, ayudas H1–H3 secuenciales, reintentos, guardado y restauración del progreso.
- Etiquetado explícito del origen de la validación (local o API) y ausencia de fallback
  silencioso.
- Accesibilidad mínima de las pantallas y controles que introduce el corte.

### Fuera de alcance

- Ejercicios E02–E07 y E09–E15; zonas completas y cierre de misión 15/15 jugable.
- Mapa de zonas, navegación por zonas y desbloqueo por zona: fuera de este corte; el avance se
  demuestra con el recorrido de prueba E01 → E08.
- Backend nuevo, servicio de validación desplegado y Modo estático como funcionalidad de producto.
- Assets definitivos, audio, analítica, cuentas de usuario y narrativa completa.
- Despliegue, dominio público y logotipos oficiales de cualquier institución real.
- Matriz de navegadores y dispositivos: se define en la spec de UI/accesibilidad; esta spec no la
  presume ni la inventa.
- Decisiones matemáticas de E02–E15 y perfiles de accesibilidad avanzados.

### Contexto normativo consumido

| Fuente | Uso en esta spec |
|---|---|
| [Constitución](../../.specify/memory/constitution.md) | Principios I–VII, contrato mínimo de experiencia jugable, estados explícitos, accesibilidad, idioma y registro de aprobaciones |
| [Spec 001 — núcleo de validación](../001-nucleo-validacion/spec.md) | Taxonomía `correct`/`incorrect`/`indeterminate`, `incomplete` como estado del cliente, error técnico separado, origen local/API y ausencia de fallback automático |
| Contratos de 001 (`contracts/`) | Formas `boolean` para E01 y `vertex` para E08, campos obligatorios y normalización exacta |
| [GDD v0.1](../../docs/workspace/GDD_FUNctions_v0.1.md), secciones 1.2, 1.4, 1.6, 2.4, 2.5, 3.1, 3.3, 4.2 y 5.1 | Concepto, flujo, alcance de cinco zonas, ciclo de juego, andamiaje ZDP, progresión, reglas de validación, pantallas y componentes visuales |
| [Banco canónico](../../docs/banco_ejercicios.md) | Fichas E01 y E08: enunciado, interacción, solución, errores frecuentes, ayudas y casos de prueba |
| [Auditoría SDD](../../docs/workspace/Auditoria_SDD_FUNctions.md) | Bloqueos B1–B3 y decisiones D-01…D-08 |

### Dependencias bloqueantes

1. **Spec 001 aprobada y sus contratos.** Este corte consume el contrato común; no lo redefine.
2. **Spec 003 de interacción 2D.** Debe existir antes de `/speckit.plan`, porque B3 exige máquina
   de estados, contrato de eventos, captura de puntero, cancelación, foco y alternativa de teclado.
   Esta spec describe qué observa y puede hacer la persona jugadora; la mecánica de entrada y sus
   estados pertenecen a 003.
3. **Contenido de Acerca de aprobado.** Mientras no exista aprobación, la pantalla muestra un
   aviso explícito de contenido pendiente y no inventa datos.

### Etiquetas de estado

`Confirmado` = decisión explícita del Aprobador. `Propuesto` = redacción de esta spec pendiente de
aprobación. `Pendiente` = decisión que debe cerrarse en `/speckit.clarify` o antes del plan.
Todas las afirmaciones de esta spec están en estado **propuesto** hasta que se registre la
aprobación en [Aprobaciones](#aprobaciones).

## Clarifications

### Session 2026-11-16

- Q: ¿La introducción breve y el mapa de zonas se implementan como pantallas reales en este corte, o se admiten como vistas placeholder aprobadas? → A: La introducción breve se implementa como pantalla real y mínima; el mapa de zonas se descarta en este corte y se sustituye por el recorrido de prueba (decisión posterior).
- Q: ¿Bajo qué regla se desbloquea E08 en este corte, sabiendo que E02–E07 no existen? → A: E01 desbloquea E08, que se ofrece como continuación del recorrido de prueba, sin afirmar que la Zona 3 está completa.
- Q: Cuando existe progreso guardado, ¿cómo deben convivir Comenzar y Continuar en el índice, que declara «exactamente cuatro acciones»? → A: Cuatro acciones base más Continuar condicional; Continuar aparece solo con progreso legible y Comenzar exige confirmación explícita antes de iniciar una misión nueva.
- Q: ¿Hasta cuándo permanece visible la etiqueta de origen «local» o «API» de un resultado evaluado? → A: Solo mientras ese resultado está en pantalla, incluido el regreso al ejercicio desde el recorrido en la misma sesión; no se persiste en el progreso ni en el historial.
- Q: ¿Qué debe mostrar el mapa de zonas en este corte, donde solo E01 y E08 son jugables? → A: No hay mapa de zonas en este corte; al completar E01 el recorrido de prueba continúa con E08 y muestra el avance real de los dos ejercicios.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inicio (Priority: P1)

La persona jugadora abre FUNctions y ve el nombre del juego, una descripción breve y cuatro
acciones: Comenzar, Instrucciones, Acerca de y Cómo se Juega.

**Why this priority**: sin una entrada comprensible no existe producto demostrable. Es la primera
historia del corte y la única que puede verificarse sin implementar ningún ejercicio.

**Independent Test**: abrir la ruta inicial y comprobar que aparecen el nombre, la descripción, los
cuatro botones con etiqueta visible y ninguna afirmación de progreso inexistente.

**Acceptance Scenarios**:

1. **Given** una instalación sin progreso guardado, **When** la persona abre la ruta inicial,
   **Then** ve FUNctions, una descripción breve y los cuatro botones (AC-01, AC-12).
2. **Given** el índice visible, **When** la persona recorre la pantalla, **Then** no encuentra
   temporizador, vidas, puntos ni insignias (AC-11).
3. **Given** el índice visible, **When** la persona usa solo el teclado, **Then** recorre los
   cuatro botones con foco visible y los activa (AC-08).

### User Story 2 - Comenzar y Continuar (Priority: P1)

Comenzar inicia una misión nueva y lleva a la introducción breve y al recorrido de prueba, que
comienza con E01. Si existe progreso guardado, se ofrece Continuar y retoma el recorrido donde
quedó.

**Why this priority**: sin este flujo la persona no llega a ningún ejercicio; el corte no
demostraría la unión entre entrada, interacción y validación.

**Independent Test**: desde el índice, activar Comenzar y comprobar que se pasa por la
introducción breve y se llega a E01; repetir con progreso guardado y comprobar la oferta Continuar
y la restauración del punto de avance.

**Acceptance Scenarios**:

1. **Given** ausencia de progreso, **When** la persona activa Comenzar, **Then** ve la introducción
   breve y después el recorrido de prueba con E01, sin saltar la introducción (AC-02).
2. **Given** progreso guardado, **When** la persona vuelve al índice, **Then** se le ofrece
   Continuar y esa acción retoma el recorrido en el último punto guardado (AC-02).
3. **Given** progreso guardado, **When** la persona activa Comenzar, **Then** se le pide
   confirmación explícita antes de iniciar una misión nueva y el progreso anterior no se pierde sin
   esa confirmación (AC-02).
4. **Given** que la introducción o un ejercicio del recorrido no están disponibles en la
   instalación, **When** la persona consulta el índice, **Then** la acción afectada aparece
   deshabilitada con un mensaje explícito y no como error técnico (AC-02, REQ-11).

### User Story 3 - Instrucciones (Priority: P2)

La persona consulta el objetivo educativo, las reglas generales, la progresión, la condición de
victoria 15/15, los reintentos y las ayudas disponibles.

**Why this priority**: explica el contrato del juego antes de jugar y reduce el abandono en el
primer ejercicio. No bloquea el recorrido mínimo.

**Independent Test**: abrir Instrucciones desde el índice y comprobar que los seis bloques
requeridos están presentes, sin temporizador, vidas, puntos ni insignias.

**Acceptance Scenarios**:

1. **Given** el índice visible, **When** la persona activa Instrucciones, **Then** ve objetivo,
   reglas generales y progresión (AC-03).
2. **Given** Instrucciones abierta, **When** la persona la recorre, **Then** encuentra la
   condición de victoria 15/15, los reintentos ilimitados y la existencia de ayudas H1–H3
   (AC-03, AC-11).

### User Story 4 - Cómo se Juega (Priority: P2)

La persona aprende las acciones principales de un ejercicio: Probar, Deshacer, Reiniciar,
Ayudas H1–H3, la lectura de la retroalimentación y el uso con teclado, mouse o pantalla táctil.

**Why this priority**: traduce las reglas en práctica concreta y evita que el primer ejercicio se
convierta en una prueba de descubrimiento de la interfaz.

**Independent Test**: abrir Cómo se Juega y comprobar que se explican las cuatro acciones, la
retroalimentación y el uso de teclado y touch.

**Acceptance Scenarios**:

1. **Given** el índice visible, **When** la persona activa Cómo se Juega, **Then** ve las acciones
   Probar, Deshacer, Reiniciar y Ayudas (AC-04).
2. **Given** Cómo se Juega abierta, **When** la persona la recorre, **Then** entiende qué
   significa cada tipo de retroalimentación y que puede jugar con teclado o con touch (AC-04).

### User Story 5 - Acerca de (Priority: P3)

La persona podrá ver el nombre, el propósito, el equipo, la autoría y la licencia MIT del proyecto,
con contenido aprobado y sin logotipos oficiales ni atribuciones institucionales reales.

**Why this priority**: es información de crédito y contexto; no condiciona la jugabilidad del
corte.

**Independent Test**: abrir Acerca de y comprobar que solo muestra contenido aprobado —o el aviso
explícito de contenido pendiente— y que no aparece NASA, ANE ni logotipo oficial alguno.

**Acceptance Scenarios**:

1. **Given** contenido aprobado disponible, **When** la persona activa Acerca de, **Then** ve
   nombre, propósito, equipo, autoría y licencia MIT (AC-05).
2. **Given** contenido no aprobado, **When** la persona activa Acerca de, **Then** ve un aviso
   explícito de contenido pendiente y ninguna atribución inventada (AC-05).
3. **Given** Acerca de abierta, **When** la persona la revisa, **Then** no encuentra NASA, ANE ni
   logotipos oficiales (AC-05).

### User Story 6 - E01 El Conector de Energía (Priority: P1)

La persona observa el diagrama sagital de la relación `R = {(1,4), (2,4), (3,5)}` entre
`A = {1,2,3}` y `B = {4,5}` y clasifica si es función o no lo es; recibe diagnóstico, puede pedir
ayudas, reintentar y conservar su progreso.

**Why this priority**: E01 es el primer ejercicio de la Zona 1 y el caso mínimo que demuestra que
la interacción y la validación `boolean` del núcleo funcionan juntas.

**Independent Test**: presentar E01, elegir «Es función» y comprobar resultado correcto y avance;
repetir con «No es función» y comprobar resultado incorrecto, diagnóstico y reintento.

**Acceptance Scenarios**:

1. **Given** E01 presentado sin selección, **When** la persona pulsa Probar, **Then** el estado es
   «incompleto» y no un resultado matemático (AC-13).
2. **Given** E01 con «Es función» seleccionado, **When** la persona pulsa Probar, **Then** el
   resultado es correcto, aunque las entradas 1 y 2 compartan la salida 4 (AC-13).
3. **Given** E01 con «No es función» seleccionado, **When** la persona pulsa Probar, **Then** el
   resultado es incorrecto, se explica que compartir salida no viola la unicidad y se permite
   reintentar sin límite (AC-13, REQ-15).

### User Story 7 - E08 Foco del Vértice (Priority: P2)

La persona ajusta los parámetros `h` y `k` de `f(x) = (x − h)² + k` con `a = 1` fijo para que el
vértice sea `(3, 2)`; recibe diagnóstico, ayudas, reintento y progreso.

**Why this priority**: demuestra el segundo tipo de respuesta del núcleo (`vertex`) y la entrada
numérica exacta. Depende de la interacción definida en 003.

**Independent Test**: presentar E08, fijar `h = 3` y `k = 2` y comprobar resultado correcto y
avance; repetir con `h = −3` y con `h = 2.99` y comprobar resultado incorrecto.

**Acceptance Scenarios**:

1. **Given** E08 con `h = 3` y `k = 2`, **When** la persona pulsa Probar, **Then** el resultado es
   correcto (AC-14).
2. **Given** E08 con `h = −3` o `h = 2.99` y `k = 2`, **When** la persona pulsa Probar, **Then**
   el resultado es incorrecto aunque la curva parezca coincidir visualmente (AC-14).
3. **Given** E08 con un campo vacío, **When** la persona pulsa Probar, **Then** el estado es
   «incompleto» y no cero ni resultado incorrecto (AC-14).

### User Story 8 - Recorrido completo del corte (Priority: P2)

La persona completa E01 y E08 en el recorrido de prueba, el progreso se guarda y se restaura,
vuelve al índice y ve el origen de cada validación.

**Why this priority**: cierra el corte vertical y verifica persistencia, continuidad del recorrido
y etiquetado de origen, que son condiciones de aceptación del incremento.

**Independent Test**: completar E01, comprobar que el recorrido continúa con E08, completar E08,
recargar y comprobar que el progreso y las respuestas evaluadas se conservan, que el recorrido
refleja el avance y que cada resultado muestra su origen local o API.

**Acceptance Scenarios**:

1. **Given** E01 resuelto, **When** la persona recarga, **Then** el progreso se restaura sin
   repetir el ejercicio y E08 queda disponible como continuación del recorrido de prueba (AC-16,
   REQ-16).
2. **Given** una validación realizada por la API, **When** el resultado aparece, **Then** se indica
   el origen «API»; si la validación fue local, se indica «local» (AC-17).
3. **Given** que la API falla, **When** la persona reintenta, **Then** no se activa un fallback
   silencioso ni se presenta la validación local como si viniera de la API (AC-17, AC-07).

## Requirements

Todos los requisitos están **en revisión** hasta que se registre la aprobación correspondiente. La
columna de verificación remite a los criterios de aceptación que los comprueban.

### Índice y pantallas de entrada (REQ-01…REQ-12)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-01 | El índice es la pantalla inicial del producto y muestra el nombre FUNctions y una descripción breve del juego. | AC-01 |
| REQ-02 | El índice muestra cuatro acciones base con etiqueta visible: Comenzar, Instrucciones, Acerca de y Cómo se Juega. Cuando existe progreso legible se añade Continuar como quinta acción condicional; sin progreso, Continuar no aparece ni se anuncia. | AC-01, AC-02, AC-08 |
| REQ-03 | Comenzar sigue el flujo del GDD v0.1: misión nueva → introducción breve → recorrido de prueba con E01. Si hay progreso guardado, se ofrece Continuar, que retoma el recorrido en el último punto guardado. Ninguna acción salta la introducción y E01 no es destino directo del índice. | AC-02 |
| REQ-04 | Instrucciones muestra el objetivo educativo, las reglas generales, la progresión por zonas y niveles, la condición de victoria 15/15, los reintentos ilimitados y la existencia de ayudas H1–H3; no muestra temporizador, vidas, puntos ni insignias. | AC-03, AC-11 |
| REQ-05 | Cómo se Juega muestra las acciones Probar, Deshacer, Reiniciar y Ayudas H1–H3, el significado de la validación y la retroalimentación, y el uso de teclado y pantalla táctil. | AC-04 |
| REQ-06 | Acerca de muestra únicamente contenido aprobado: nombre, propósito, equipo, autoría y licencia MIT. Si no existe aprobación, muestra un aviso explícito de contenido pendiente y no inventa datos. | AC-05 |
| REQ-07 | Cada pantalla secundaria —Instrucciones, Cómo se Juega y Acerca de— ofrece una acción de regreso al índice. | AC-06 |
| REQ-08 | El índice y las pantallas secundarias funcionan sin autenticación, sin datos personales, sin API y sin validación matemática. | AC-07, AC-10 |
| REQ-09 | Todos los textos de interfaz están en español, son claros y no dependen de conocimiento previo del proyecto. | AC-03, AC-04, AC-05 |
| REQ-10 | Cada botón es operable por teclado, muestra foco visible, tiene nombre accesible y comunica su estado con texto o icono además del color. | AC-08, AC-09 |
| REQ-11 | Si un destino no está disponible en el incremento, la acción correspondiente aparece deshabilitada con un mensaje explícito; no se presenta como funcionalidad completa ni como error técnico. | AC-02, AC-12 |
| REQ-12 | El índice no muestra temporizador, vidas, puntos ni insignias, y no afirma progreso que no exista. | AC-11, AC-12 |

### Recorrido E01/E08 (REQ-13…REQ-19)

| ID | Requisito | Verificación |
|---|---|---|
| REQ-13 | E01 envía una respuesta `boolean` («Es función» / «No es función»); E08 envía una respuesta `vertex` con `h`, `k` y `a = 1` fijo. Ninguno usa texto libre para la respuesta matemática. | AC-13, AC-14 |
| REQ-14 | El resultado mostrado es `correct`, `incorrect` o `indeterminate`. `incomplete` es un estado del cliente por campo obligatorio vacío, y el error técnico es una categoría distinta que no se muestra como incorrecta. | AC-13, AC-14, AC-15 |
| REQ-15 | Las ayudas H1–H3 son secuenciales: H1 desde el inicio, H2 tras consultar H1 y H3 tras consultar H2, sin exigir errores ni esperas. Los reintentos son ilimitados; no existen temporizador, vidas, puntos ni insignias, y H3 no completa ni envía la respuesta. | AC-13, AC-14, AC-03 |
| REQ-16 | El progreso se guarda y se restaura: niveles resueltos, borrador del nivel activo, intentos evaluados, mayor pista consultada y preferencias, con versión de progreso. Completar un ejercicio lo marca como resuelto, lo conserva disponible y continúa el recorrido de prueba con el siguiente ejercicio incluido, conforme a la regla declarada en [Assumptions](#assumptions): resolver E01 desbloquea E08. | AC-16 |
| REQ-17 | Cada validación indica su origen, `local` o `API`, y no existe fallback silencioso: si la API falla se informa el fallo y se conserva la respuesta, sin atribuir el resultado a la API. | AC-17, AC-15 |
| REQ-18 | La interacción cumple el mínimo de accesibilidad: acciones esenciales por teclado, foco visible, objetivos táctiles de al menos 44×44 unidades de referencia, etiquetas asociadas y estado comunicado sin depender solo del color. | AC-08, AC-09, AC-16 |
| REQ-19 | La introducción breve es una pantalla real y mínima con su texto aprobado. El recorrido de prueba muestra el avance real de E01 y E08, permite abrir el ejercicio disponible y, al resolver E01, continúa con E08 rotulado como avance parcial. Este corte no incluye mapa de zonas ni navegación por zonas. | AC-02, AC-12, AC-16 |

### Reglas de experiencia jugable observable

**Estados del ejercicio.** `sin responder` → `incompleto` (campo obligatorio vacío) →
`validando` → `correct` \| `incorrect` \| `indeterminate` \| `error técnico`. Desde cualquier
estado distinto de `validando`, la persona puede editar, deshacer, reiniciar, consultar ayudas y
volver a probar. `validando` se abandona únicamente con el resultado de la solicitud vigente.

**Transiciones observables.**

| Situación | Respuesta del sistema |
|---|---|
| Probar con un campo obligatorio vacío | Estado `incompleto` con el campo señalado; no se envía al validador |
| Probar con respuesta completa | Se valida y se muestra el resultado con su origen |
| Resultado `correct` | Explicación breve de la condición cumplida; el nivel queda resuelto y se ofrece continuar |
| Resultado `incorrect` | Diagnóstico de la condición incumplida, sin penalización y con reintento disponible |
| Resultado `indeterminate` | Se informa que el verificador no pudo decidir; no se marca como incorrecto |
| Error técnico | Se informa el fallo, se conserva la respuesta y se permite reintentar |
| Consulta de ayuda | Se muestra la siguiente ayuda disponible y queda registrada la mayor ayuda consultada |
| Reiniciar reto | Se recupera la configuración inicial del ejercicio previa confirmación si hay cambios |
| Volver al índice | Se conserva el progreso confirmado y el borrador del nivel activo |

**Origen de la validación.** La etiqueta `local` o `API` acompaña al resultado vigente desde que se
recibe y permanece visible mientras ese resultado está en pantalla, incluso al volver al ejercicio
desde el recorrido dentro de la misma sesión. La etiqueta no se guarda en el progreso ni en el historial
de intentos: tras recargar, el ejercicio restaura el borrador y el estado de resuelto, y no muestra
un resultado anterior como si fuera una validación nueva ni le atribuye un origen. Ninguna
validación local se presenta como API.

**Reglas de progreso.**

- Se guarda después de una edición confirmada y después de cada resultado evaluado.
- Un estado `incompleto`, `indeterminate` o un error técnico no incrementa los intentos
  matemáticos.
- Al recargar, se restaura el último estado disponible y se informa si no fue posible guardar.
- Un progreso con versión desconocida o corrupto no se sobrescribe ni se descarta en silencio: se
  informa y se ofrece iniciar una misión nueva sin borrar el anterior.
- Comenzar con progreso existente y reiniciar la misión exigen confirmación explícita; Continuar
  no borra ni reinicia nada.
- La victoria 15/15 no se alcanza en este corte; el recorrido de prueba muestra solo el avance real
  de E01 y E08.

### Fichas de ejercicio incluidas

**E01 — El Conector de Energía**

| Campo | Contenido |
|---|---|
| Zona | 1. Máquina de Enlaces |
| Objetivo educativo | Reconocer existencia y unicidad en una relación discreta: cada entrada tiene exactamente una imagen |
| Enunciado | «A = {1,2,3}, B = {4,5} y R = {(1,4), (2,4), (3,5)}. ¿La corriente fluirá de forma válida? ¿Es una función formal?» |
| Interacción | Observar el diagrama sagital de nodos y cables fijos y elegir «Es función» o «No es función»; no se construyen cables |
| Tipo de respuesta | `boolean` |
| Restricciones | Selección obligatoria; el par compartido en la salida 4 es válido; no se evalúa la operación de conectar ni desconectar |
| Solución | Es función: las tres entradas tienen una única imagen y compartir la salida 4 no viola la unicidad |
| Diagnóstico esperado | «Varios cables pueden llegar al mismo nodo de salida; lo prohibido es que de una sola entrada salgan dos cables» |
| Ayudas | H1 señala las entradas una por una; H2 plantea las dos preguntas de existencia y unicidad; H3 muestra la definición formal |
| Finalización | Resultado `correct`; se registra el nivel resuelto y se desbloquea E08 cuando corresponda |

**E08 — Foco del Vértice**

| Campo | Contenido |
|---|---|
| Zona | 3. Sintonizador de Trayectorias |
| Objetivo educativo | Construir `f(x) = (x − h)² + k` desde su vértice, con `a = 1` fijo |
| Enunciado | «Construye la trayectoria f(x) = (x − h)² + k, con dominio real, para que su vértice sea (3,2). Ajusta h y k; a permanece fijo en 1» |
| Interacción | Observar la parábola y el punto objetivo; ajustar `h` y `k` con controles que admiten entrada numérica exacta |
| Tipo de respuesta | `vertex` con `h`, `k` y `a = 1` |
| Restricciones | Comparación exacta sin tolerancia; el redondeo es solo visual; el eje de simetría es explicación complementaria, no campo obligatorio |
| Solución | `h = 3`, `k = 2`, `f(x) = (x − 3)² + 2` |
| Diagnóstico esperado | «Atención con el signo: en la fórmula es (x − h), por lo que (x − 3) significa h = +3» |
| Ayudas | H1 contrasta el vértice actual con el objetivo; H2 relaciona cada control con una coordenada; H3 muestra la sustitución del vértice |
| Finalización | Resultado `correct` con ambos parámetros exactos; se registra el nivel resuelto |

### Accesibilidad y contenido

- Acciones esenciales operables por teclado, en orden de lectura coherente y con foco visible.
- Objetivos táctiles de al menos 44×44 unidades de referencia, sin exigir precisión de píxel.
- Estados, diagnóstico y origen de validación comunicados con texto o icono; el color nunca es el
  único portador de significado.
- Los valores numéricos se muestran con formato español y sin ambigüedad decimal.
- Sin autenticación, sin datos personales, sin analítica externa y sin logotipos oficiales.
- La introducción breve, el recorrido de prueba y las pantallas informativas tienen contenido textual aprobado;
  la narrativa completa queda fuera de alcance.

## Key Entities

| Entidad | Descripción | Datos observables |
|---|---|---|
| Misión | Partida del recorrido de prueba asociada a una persona y a un dispositivo | Estado nuevo o continuado; niveles resueltos; fecha de último guardado |
| Zona | Agrupación temática de niveles según el GDD v0.1; no navegable en este corte | Identificador, nombre, niveles, sistemas reparados |
| Nivel | Ejercicio canónico E01 o E08 dentro de su zona | Identificador, objetivo, enunciado, ayudas, campos obligatorios |
| Ejercicio | Contrato matemático y de interacción del nivel | Tipo de respuesta, restricciones, solución, diagnóstico |
| Intento | Envío evaluado de una respuesta completa | Resultado, código de retroalimentación, marca temporal |
| Borrador | Configuración en curso del nivel activo | Valores por campo, mayor ayuda consultada |
| Ayuda | Contenido H1, H2 o H3 de un ejercicio | Nivel de ayuda, texto, condición de habilitación |
| Progreso | Estado persistido del recorrido | Versión, niveles resueltos, borrador, intentos, mayor ayuda, preferencias |
| Origen de validación | Procedencia declarada de un resultado | `local` o `API`; se muestra con el resultado vigente y no se persiste |
| Contenido institucional | Información aprobada de Acerca de | Nombre, propósito, equipo, autoría, licencia MIT, estado de aprobación |

## Success Criteria

### Measurable Outcomes

| ID | Resultado medible |
|---|---|
| SC-01 | Desde la ruta inicial se llega al índice en un solo paso, y una revisión manual encuentra el nombre, la descripción y las cuatro acciones base sin progreso guardado: 4/4. |
| SC-02 | Una persona puede recorrer y activar las cuatro acciones base del índice —y Continuar cuando exista— usando solo el teclado, sin perder el foco visible en ningún paso: 4/4 acciones base. |
| SC-03 | Con la red desconectada y la API no disponible, el índice, Instrucciones, Cómo se Juega y Acerca de se abren sin error bloqueante: 4/4 pantallas. |
| SC-04 | El índice y las pantallas secundarias no solicitan credenciales ni datos personales: 0 campos de datos personales. |
| SC-05 | Los casos canónicos del GDD 3.3 para E01 y E08 producen el resultado esperado, incluidos el par compartido en la salida 4, `h = 3`, `h = −3`, `h = 2.99` y el campo vacío: 6/6 casos. |
| SC-06 | Tras completar E01 y recargar, el progreso se restaura en el primer intento y el nivel figura como resuelto: 1/1 restauración. |
| SC-07 | El 100% de los resultados evaluados y mostrados en la sesión vigente muestra su origen, local o API, y ningún resultado se atribuye a la API cuando la evaluación fue local. |
| SC-08 | Ningún estado del índice o de un ejercicio se comunica solo por color: 0 estados sin texto o icono asociado. |
| SC-09 | Cada pantalla secundaria permite volver al índice en una sola acción: 3/3 pantallas. |
| SC-10 | El recorrido E01 → E08 → índice puede completarse con mouse, con pantalla táctil y con teclado: 3/3 modos de entrada. |

## Acceptance Criteria

### Índice

- **AC-01** — La ruta inicial muestra el nombre FUNctions, una descripción breve y las cuatro
  acciones base con etiqueta visible; Continuar se añade solo cuando existe progreso legible.
- **AC-02** — Comenzar lleva a la introducción breve y al recorrido de prueba con E01; con progreso
  guardado, Continuar retoma el recorrido en el último punto guardado; si el destino no está
  disponible, la acción está deshabilitada con un mensaje explícito.
- **AC-03** — Instrucciones muestra el objetivo educativo, las reglas generales y la progresión,
  además de la condición 15/15, los reintentos y las ayudas.
- **AC-04** — Cómo se Juega muestra las acciones, el significado de la retroalimentación y las
  ayudas H1–H3.
- **AC-05** — Acerca de muestra solo información aprobada o un aviso explícito de contenido
  pendiente, y no incluye NASA, ANE ni logotipos oficiales.
- **AC-06** — Desde cada pantalla secundaria se vuelve al índice.
- **AC-07** — Un fallo o la ausencia de la API no impide el índice ni las pantallas estáticas.
- **AC-08** — Las cuatro acciones base —y Continuar cuando exista— tienen foco visible y operación
  por teclado.
- **AC-09** — Ningún estado se comunica solo por color.
- **AC-10** — No se solicita autenticación ni datos personales.
- **AC-11** — No se muestran temporizador, vidas, puntos ni insignias.
- **AC-12** — El índice se puede verificar sin implementar E01–E15; su destino es la introducción
  breve y el recorrido de prueba reales y mínimos, y los destinos fuera del incremento se marcan
  como no disponibles sin afirmar que el juego está completo.

### E01 y E08

- **AC-13** — E01 distingue correcto, incorrecto e incompleto; compartir la salida 4 sigue siendo
  función.
- **AC-14** — E08 con `h = 3`, `k = 2` es correcto; `h = −3` o `h = 2.99` es incorrecto; un campo
  vacío es incompleto.
- **AC-15** — Un error técnico no se presenta como incorrecto, y una respuesta tardía no pisa el
  estado vigente.
- **AC-16** — Recargar restaura el progreso; mouse, touch y teclado permiten completar el corte.
- **AC-17** — El origen local o API se muestra en cada validación y el fallback no es silencioso.

## Edge Cases

| Caso | Comportamiento esperado |
|---|---|
| La API falla en mitad de un intento | Se conserva la respuesta, se informa el error técnico y se permite reintentar; no hay fallback silencioso |
| Llega una respuesta de una solicitud anterior | Se descarta; solo la solicitud vigente puede cambiar el estado del ejercicio |
| La persona pulsa Probar varias veces seguidas | Se mantiene un único estado de validación y no se duplican intentos |
| El almacenamiento local no está disponible | Se informa que no se pudo guardar; no se afirma que el progreso se conservó |
| El progreso guardado es de una versión desconocida o está corrupto | Se informa y se ofrece iniciar una misión nueva sin sobrescribir silenciosamente |
| No existe progreso guardado | Solo se ofrece Comenzar; Continuar no aparece ni se anuncia |
| Progreso guardado con E01 resuelto | Se restaura el estado y E08 se ofrece como continuación del recorrido de prueba |
| La persona abandona un ejercicio a medias | El borrador se conserva y se restaura al volver |
| Se consulta H3 y se resuelve el ejercicio | Se registra que se resolvió con apoyo; no se reduce el progreso ni se añaden insignias |
| Un destino del índice no está implementado | La acción se muestra deshabilitada con mensaje explícito y sin tono de error técnico |
| E01 resuelto y E02–E07 aún no existen | Se aplica la regla del corte: el recorrido de prueba continúa con E08, rotulado como avance parcial, sin mapa de zonas y sin afirmar que la Zona 3 está completa |
| Acerca de no tiene contenido aprobado | Se muestra el aviso de contenido pendiente, sin atribuciones inventadas |
| La persona usa solo el teclado en E08 | Puede ajustar `h` y `k`, probar, deshacer y reiniciar sin mouse |

## Assumptions

- **Nombre canónico:** FUNctions, escrito con esa capitalización en toda la interfaz.
- **Narrativa:** ESAI es una institución ficticia del juego; no se atribuye a NASA, ANE ni a
  ninguna entidad real.
- **Orden de zonas y reglas de progreso:** las del GDD v0.1 (cinco zonas, tres niveles, avance
  habilitado en orden, resueltos disponibles, victoria 15/15). El corte no navega por zonas: aplica
  la regla de desbloqueo declarada más abajo.
- **Alcance del corte:** E01 y E08 únicamente; el recorrido de prueba muestra el avance real, no
  incluye mapa de zonas y no simula zonas completas.
- **Destinos del corte:** la introducción breve no es un placeholder; se implementa como pantalla
  real y mínima. El corte no incluye mapa de zonas: tras la introducción se entra al recorrido de
  prueba, y los destinos fuera del incremento se marcan como no disponibles.
- **Desbloqueo en el corte:** resolver E01 desbloquea E08, que continúa el recorrido de prueba
  rotulado como avance parcial. El rótulo indica que es el segundo ejercicio incluido y no afirma
  que la Zona 3 esté completa. El orden definitivo de desbloqueo del GDD v0.1 se restablece cuando
  las zonas intermedias y el mapa existan.
- **Persistencia:** el progreso se guarda en el almacenamiento local disponible en el dispositivo;
  la forma técnica del almacenamiento pertenece al plan.
- **Continuar:** aparece cuando existe progreso legible de una misión iniciada, con o sin niveles
  resueltos y también cuando el corte está completo; retoma el recorrido en el último punto
  guardado. Comenzar con progreso existente exige confirmación explícita.
- **Diferencia Instrucciones/Cómo se Juega:** Instrucciones es normativa (qué es el juego y cuándo
  se gana) y Cómo se Juega es práctica (qué se pulsa y qué se ve). La delimitación exacta de textos
  se confirma en `/speckit.clarify`.
- **Acerca de:** requiere aprobación de contenido; hasta entonces se admite un placeholder
  explícito y ningún dato inventado.
- **Matriz de navegadores y dispositivos:** se define en la spec de UI/accesibilidad; esta spec no
  la presume.
- **Decisiones del núcleo:** D-02 (respuesta compuesta), D-04 (gramática numérica exacta), D-05
  (normalización de conjuntos e intervalos) y D-06 (exactitud sin tolerancia) se resuelven en 001 y
  este corte las consume.
- **Modo estático:** no forma parte de este incremento; el origen local corresponde a la validación
  local explícita del núcleo.

## Decisiones para `/speckit.clarify`

1. **Frontera Instrucciones / Cómo se Juega.** Confirmar el reparto de contenido y qué textos
   exactos pertenecen a cada pantalla, para no duplicar información ni contradecirse.
2. **Contenido aprobado de Acerca de.** Confirmar el texto de propósito, la composición del equipo,
   la forma de autoría y el enunciado de licencia MIT; hasta entonces rige el placeholder.
3. **Presentación de `indeterminate`.** Confirmar el mensaje y si permite reintentar sin registrar
   intento matemático, coherente con 001.
4. **Respuesta tardía y solicitudes simultáneas.** Confirmar la regla de descarte de respuestas
   obsoletas y el límite de una validación vigente por ejercicio.
5. **Confirmación de reinicio.** Confirmar cuándo se exige confirmación explícita al reiniciar el
   reto o la misión.

## Trazabilidad

| Fuente | Requisitos afectados |
|---|---|
| GDD 1.2, 1.4, 1.6 | REQ-01, REQ-02, REQ-03, REQ-04, REQ-11, REQ-16 |
| GDD 2.4, 2.5 | REQ-14, REQ-15, REQ-16, AC-15 |
| GDD 3.1, 3.3 | REQ-13, REQ-16, AC-13, AC-14 |
| GDD 4.2 | REQ-03, REQ-07, REQ-10, AC-02, AC-06, AC-08 |
| GDD 5.1 | REQ-10, REQ-18, AC-08, AC-09 |
| Spec 001 REQ-04, REQ-05, REQ-06, REQ-08 | REQ-14, REQ-17, AC-15, AC-17 |
| Banco E01, E08 | REQ-13, REQ-15, AC-13, AC-14, fichas de ejercicio |
| Auditoría B1, B2 | REQ-13, REQ-14, AC-13, AC-14 |
| Auditoría B3 | REQ-18, dependencia con spec 003 |
| Auditoría D-02, D-04, D-05, D-06 | REQ-13, REQ-14, supuestos del núcleo |

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Especificación del primer recorrido |
| Veredicto | `en revisión` |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | spec para revisión |
| Versión o revisión | `spec.md`, versión de trabajo 0.1.0 |
| Comentarios o condiciones | Sin aprobación no se autoriza plan, tareas, contratos ni implementación; la spec 003 de interacción 2D debe existir antes del plan y las decisiones de clarify deben cerrarse |

Este registro no sustituye el registro de aprobaciones de [`specs/README.md`](../README.md) ni
acredita aprobación de contenido, implementación o pruebas.
