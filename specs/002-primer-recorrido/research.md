# Research: Primer recorrido — índice y recorrido E01/E08

**Feature**: `002-primer-recorrido` | **Fecha**: 2026-11-16 | **Estado**: propuesta para revisión

Este documento resuelve las decisiones técnicas de planificación (Fase 0) del corte vertical que une
el índice, la introducción, el recorrido de prueba E01/E08, la validación, la persistencia y la
accesibilidad mínima. No implementa código, no instala dependencias y no modifica el backend.

Las decisiones de producto —qué observa la persona, qué acciones existen, qué resultados son
válidos— siguen en [`spec.md`](./spec.md). El contrato transversal de interacción 2D pertenece a
[`003-interaccion-2d`](../003-interaccion-2d/spec.md) y no se reabre aquí.

## D-01. Navegación y composición de la aplicación

**Decisión**: la aplicación se compone con React y una máquina explícita de pantallas en memoria.
La ruta inicial monta el índice. Las acciones cambian el discriminante `AppScreen`; no se introduce
un router externo, ni rutas profundas a ejercicios, ni estado de navegación en PixiJS/Mafs.

Pantallas del corte:

```text
index
intro
flow
instructions
how-to-play
about
exercise:E01
exercise:E08
progress-recovery
```

`exercise:*` solo se alcanza desde `flow` y con el avance que corresponde. Un enlace directo o una
recarga de una ruta de ejercicio vuelve al índice o a `flow`, según el progreso legible; nunca salta
la introducción ni desbloquea E08.

**Rationale**: el corte no necesita URLs públicas por pantalla y la spec prohíbe que E01 sea destino
directo del índice. Una máquina en memoria evita añadir un router no aprobado y hace imposible
representar combinaciones de pantalla y avance que la spec no permite. React conserva el estado de
dominio, navegación y progreso, conforme al Principio II.

**Alternativas consideradas**:

- **React Router**: añade una dependencia de ejecución no aprobada y no aporta valor a un recorrido
  lineal de nueve pantallas; rechazado.
- **Hash routing artesanal**: permitiría enlaces profundos, pero abriría la puerta a saltar la
  introducción o a montar E08 sin E01 resuelto; rechazado para este corte.
- **Estado de navegación dentro de PixiJS/Mafs**: viola la separación entre presentación y dominio;
  rechazado.

## D-02. Modelo del recorrido y desbloqueo provisional

**Decisión**: el recorrido se modela como una secuencia explícita:

```text
intro -> E01 -> E08 -> complete
```

`FlowStep` solo admite esos cuatro valores. E01 está disponible al entrar al recorrido de prueba;
E08 queda disponible únicamente cuando E01 figura resuelto. El paso `complete` significa «recorrido
de prueba completado», no victoria 15/15 ni Zona 3 completa. No existe mapa de zonas.

**Rationale**: la spec y la clarificación de 2026-11-16 sustituyen el mapa por el recorrido de prueba
y declaran que resolver E01 desbloquea E08 como avance parcial. Un enumerado impide estados
intermedios inventados, como «E08 en progreso sin E01 resuelto» o «zona completada».

**Alternativas consideradas**:

- **Mapa de zonas con estados bloqueado/disponible/restaurado**: el corte no lo incluye y solo dos
  ejercicios serían jugables; rechazado.
- **Desbloqueo genérico por índices de zona**: introduciría reglas del GDD que este corte no puede
  cumplir; rechazado.
- **Permitir E08 desde el índice**: contradice REQ-03, REQ-16 y REQ-19; rechazado.

## D-03. Persistencia del progreso en LocalStorage

**Decisión**: se usa `LocalStorage` con una única clave versionada,
`functions.progress.v1`, y el esquema [`contracts/progress.schema.json`](./contracts/progress.schema.json).
El objeto guarda `schemaVersion: 1`, misión, paso del recorrido, niveles resueltos, borradores por
ejercicio, intentos evaluados, mayor ayuda consultada y un objeto de preferencias reservado.

Reglas de lectura y escritura:

1. Sin clave: no hay progreso; el índice solo ofrece Comenzar.
2. Clave legible y válida: se restaura el último estado y Continuar aparece.
3. JSON inválido, esquema inválido o `schemaVersion` desconocida: se muestra
   `progress-recovery`; no se sobrescribe ni se borra la clave.
4. «Iniciar misión nueva» desde recuperación exige confirmación y mueve el contenido anterior a
   `functions.progress.v1.backup.<timestamp>` antes de escribir un progreso nuevo.
5. `setItem` falla o el almacenamiento no está disponible: se informa que no se pudo guardar; la
   sesión continúa en memoria, pero no se afirma que el progreso se conservó.
6. Se guarda después de una edición confirmada, de una consulta de ayuda y de cada resultado
   evaluado. No se guarda un estado `pendiente` ni el origen de una validación.

**Rationale**: LocalStorage es el almacenamiento confirmado por la Constitución para el progreso
local y no requiere backend. El versionado explícito y la recuperación sin sobrescritura cumplen
REQ-16 y la regla constitucional sobre datos corruptos o de versión desconocida. La clave separada
permite distinguir «sin progreso» de «progreso ilegible».

**Alternativas consideradas**:

- **IndexedDB**: ofrece más capacidad y asincronía, pero añade complejidad no justificada para un
  objeto pequeño y una sola misión; rechazado.
- **`sessionStorage`**: se pierde al cerrar la pestaña y no cumple la restauración tras recarga o
  reapertura; rechazado.
- **Persistir en el backend**: la spec excluye backend nuevo y la Constitución prohíbe almacenar el
  progreso en el servidor; rechazado.
- **Sobrescribir datos corruptos con un progreso nuevo**: viola REQ-16 y el Principio V; rechazado.

## D-04. Puerta única de validación y selección explícita del mecanismo

**Decisión**: React llama a una interfaz `ValidationGateway` con dos implementaciones:

- `LocalValidationGateway`: usa el despachador de `frontend/src/shared/validation/` y registra los
  validadores de E01 y E08 definidos en este incremento.
- `ApiValidationGateway`: envía el `ValidationRequest` de 001 a una URL configurada explícitamente
  y traduce la respuesta al mismo `ValidationOutcome`.

`AppConfig.validationMechanism` es `local` o `api`; se fija al arrancar y no cambia durante una
validación. No existe fallback. Si el mecanismo es `api` y no hay URL configurada, la validación
termina en error técnico explícito; no se ejecuta el validador local. La etiqueta de origen se toma
del gateway que produjo el resultado, no de una suposición de la UI.

**Rationale**: el corte debe mostrar `local` o `API` y no puede presentar una validación local como
remota. Una sola puerta evita que los componentes conozcan HTTP o el despachador, mantiene React
como dueño del estado y hace verificable la ausencia de fallback.

**Alternativas consideradas**:

- **Fallback automático local cuando la API falla**: prohibido por la Constitución y por REQ-17;
  rechazado.
- **Implementar un backend nuevo en 002**: la spec lo excluye expresamente; rechazado.
- **Elegir el mecanismo por ejercicio dentro del componente**: dispersa la configuración y facilita
  inconsistencias; rechazado.
- **Solo validación local**: no permitiría verificar el origen API ni el caso de fallo de API;
  rechazado.

## D-05. Validadores locales de E01 y E08

**Decisión**: los validadores son funciones puras que consumen la respuesta ya normalizada por 001 y
devuelven `ValidationResult` o `ValidationError`:

- **E01**: acepta `{kind: "boolean", value: true}` como `correct`; `false` como `incorrect` con el
  código `E01_SHARED_IMAGE_VALID`. El par compartido en la salida 4 no es una violación.
- **E08**: acepta exactamente `h = 3` y `k = 2` como `correct`; cualquier otro valor exacto es
  `incorrect`. `a = 1` es una restricción fija del ejercicio y no se serializa en la respuesta
  `vertex`. El diagnóstico de signo se usa cuando `h = -3`; otros valores usan un diagnóstico de
  vértice. No hay tolerancia ni redondeo matemático.

Se conservan los códigos aditivos de 001 y se añaden códigos propios del consumidor solo para el
diagnóstico localizado:

| Ejercicio | Resultado | Código | Uso |
|---|---|---|---|
| E01 | `correct` | `E01_FUNCTION_CONFIRMED` | Explicar que cada entrada tiene una única imagen |
| E01 | `incorrect` | `E01_SHARED_IMAGE_VALID` | Explicar que compartir la salida 4 es válido |
| E08 | `correct` | `E08_VERTEX_CONFIRMED` | Confirmar `(3, 2)` y `a = 1` |
| E08 | `incorrect` | `E08_VERTEX_SIGN` | Corregir el signo cuando `h = -3` |
| E08 | `incorrect` | `E08_VERTEX_MISMATCH` | Comparar los parámetros con el vértice objetivo |

**Rationale**: la matemática de E01/E08 pertenece al consumidor según 001. La comparación exacta
evita que una curva visualmente parecida se acepte y cumple AC-13/AC-14. Los códigos permiten que la
UI muestre el diagnóstico exigido sin convertir la capa de presentación en autoridad matemática.

**Alternativas consideradas**:

- **Comparar por muestreo de la parábola**: prohibido por el Principio III; rechazado.
- **Aceptar `2.99` por tolerancia**: no existe tolerancia aprobada y la spec exige exactitud;
  rechazado.
- **Usar SymPy en el cliente**: no está disponible en el navegador y no es necesario para dos casos
  finitos; rechazado.

## D-06. Renderizado de E01 y E08

**Decisión**:

- **E01** se dibuja con PixiJS en `frontend/src/zones/zone-1/`. Un componente React monta una
  `Application` de PixiJS en un `useEffect`, dibuja nodos y cables fijos y la destruye al desmontar.
  No se usa `@pixi/react`.
- **E08** se dibuja con Mafs en `frontend/src/zones/zone-3/`. React mantiene `h` y `k`; Mafs recibe
  los valores como propiedades y solo representa la parábola y el punto objetivo.
- React conserva los valores de dominio. PixiJS y Mafs no escriben en LocalStorage, no validan y no
  deciden el resultado.
- E01 expone una descripción textual del diagrama y una alternativa operable fuera del canvas; E08
  expone los campos numéricos y etiquetas asociadas.

**Rationale**: cumple la asignación constitucional de PixiJS a la Zona 1 y Mafs a las Zonas 2–5, y
mantiene el renderizador como presentación. Evitar `@pixi/react` reduce dependencias no aprobadas y
deja el ciclo de vida del canvas bajo control del componente.

**Alternativas consideradas**:

- **SVG para E01**: más simple, pero contradice la asignación confirmada de PixiJS para la Zona 1;
  rechazado.
- **`@pixi/react`**: no está aprobado por la Constitución y no es necesario para un canvas estático;
  rechazado.
- **Dibujar E08 con Canvas propio**: duplicaría Mafs y perdería los controles accesibles;
  rechazado.
- **Guardar el estado en PixiJS/Mafs**: viola el Principio II; rechazado.

## D-07. Consumo del contrato de interacción 003

**Decisión**: 002 consume la API pública de `frontend/src/shared/interaction/` para los controles,
la validación en curso, el deshacer, el reinicio, la captura de puntero y los anuncios. Los
adaptadores de E01/E08 traducen eventos de React, PixiJS y Mafs a los intentos normalizados de 003.
002 no implementa una segunda máquina de estados ni redefine sus doce estados.

Si el módulo de 003 no existe todavía al iniciar la implementación, las tareas de integración de
interacción quedan bloqueadas; las pantallas estáticas, el progreso y los validadores pueden
avanzar por separado. No se sustituye 003 por estado local ad hoc.

**Rationale**: la spec 002 declara la dependencia de 003 y la Constitución exige una sola fuente de
verdad para la interacción. Duplicar la máquina produciría divergencias en `pending`, foco,
cancelación y respuestas tardías.

**Alternativas consideradas**:

- **Implementar una máquina local mínima en 002**: duplicaría 003 y rompería la trazabilidad;
  rechazado.
- **Esperar a que todo 003 esté implementado antes de escribir cualquier pantalla**: retrasa trabajo
  independiente; se prefiere bloquear solo la integración.
- **Acoplar los componentes directamente a eventos DOM**: impide la paridad mouse/touch/teclado;
  rechazado.

## D-08. Accesibilidad mínima verificable

**Decisión**: se usan elementos HTML nativos (`button`, `input`, `fieldset`, `legend`, `dialog`) y
se añaden:

- orden de lectura y foco visible en todas las acciones esenciales;
- activación por `Enter` y `Space` en botones, y edición por teclado en E08;
- objetivos táctiles de al menos 44×44 unidades de referencia;
- etiquetas asociadas, `aria-describedby` para ayudas y diagnóstico;
- una región `aria-live="polite"` para estados de validación;
- texto o icono además del color en resultados, ayudas y errores;
- foco devuelto al control de origen al cerrar ayudas o diálogos;
- alternativa textual al diagrama de E01 y descripción del punto objetivo de E08.

La verificación de foco visible, tamaño táctil y lectores de pantalla es manual y se registra en
[`quickstart.md`](./quickstart.md).

**Rationale**: cumple REQ-10, REQ-18, AC-08 y AC-09 sin añadir una biblioteca de componentes. Los
elementos nativos reducen el riesgo de trampas de foco y hacen la interfaz comprensible para
tecnología de asistencia.

**Alternativas consideradas**:

- **Biblioteca de componentes accesibles**: añade dependencia no aprobada y no es necesaria para
  nueve pantallas; rechazada.
- **Modal personalizado con trampa de foco manual**: más propenso a errores que `<dialog>`;
  rechazado.
- **Canvas sin alternativa textual**: incumple la accesibilidad mínima; rechazado.

## D-09. Contenido aprobado y compuerta de Acerca de

**Decisión**: el contenido institucional y la introducción viven en un registro tipado con un campo
`approvalStatus`. Acerca de muestra nombre, propósito, equipo, autoría y licencia MIT solo cuando el
registro está aprobado. Si no lo está, muestra un aviso explícito de contenido pendiente y no
inventa atribuciones. La introducción usa el texto aprobado del registro; si no hay texto aprobado,
la pantalla muestra un aviso de contenido pendiente y no se presenta como narrativa definitiva.

No se incluyen NASA, ANE, logotipos oficiales ni atribuciones a instituciones reales. ESAI se trata
como institución ficticia del juego.

**Rationale**: la spec exige una compuerta de contenido y prohíbe atribuciones inventadas. Un registro
con estado permite cambiar el contenido sin tocar la lógica de pantalla y deja evidencia de qué se
mostró.

**Alternativas consideradas**:

- **Texto provisional hardcodeado**: riesgo de presentarlo como aprobado; rechazado.
- **Ocultar Acerca de hasta la aprobación**: incumple REQ-06, que exige el aviso de contenido
  pendiente; rechazado.

## D-10. Formato numérico y gramática exacta

**Decisión**: los campos de E08 aceptan coma o punto como separador decimal. Al confirmar, el valor se
normaliza a la gramática `exactNumber` de 001, con punto decimal y sin exponente, signo `+` inicial,
separador de miles ni redondeo. La presentación usa coma decimal y no introduce ambigüedad.

Un campo vacío o no parseable produce `incomplete` en el cliente y no se envía al validador. Un valor
válido pero distinto de `3` o `2` produce `incorrect`, nunca un error de formato.

**Rationale**: la spec exige entrada numérica exacta y formato español. Normalizar antes de validar
evita que la UI se convierta en una segunda gramática y conserva la paridad con la API y el núcleo.

**Alternativas consideradas**:

- **`parseFloat` o `Number`**: pierde exactitud y acepta exponentes; rechazado.
- **Solo punto decimal**: contradice el formato español esperado; rechazado.
- **Tolerancia visual**: prohibida por la spec y por el Principio III; rechazada.

## D-11. Dependencias y versiones aprobadas por DV-001

**Decisión vigente (2026-11-16)**: [DV-001](../decisiones/DV-001.md) aprueba las versiones siguientes y su migración de configuración, sin autorizar funcionalidades. La condición anterior de instalación pendiente de aprobación es histórica; esta actualización no acredita instalación.

| Paquete | Versión aprobada | Uso | Estado |
|---|---|---|---|
| `react` | 18.3.1 | Composición, estado y navegación | Aprobado DV-001 |
| `react-dom` | 18.3.1 | Montaje en el navegador | Aprobado DV-001 |
| `pixi.js` | 8.23.0 | Diagrama sagital de E01 | Aprobado DV-001 |
| `mafs` | 0.21.0 | Parábola y controles de E08 | Aprobado DV-001 |
| `vite` | 7.3.8 | Servidor de desarrollo y build | Aprobado DV-001 |
| `@vitejs/plugin-react` | 5.1.0 | JSX y recarga en desarrollo | Aprobado DV-001 |
| `@types/react` | 18.3.31 | Tipos de React | Aprobado DV-001 |
| `@types/react-dom` | 18.3.7 | Tipos de React DOM | Aprobado DV-001 |
| `katex` (override) | 0.19.1 | Dependencia transitiva | Aprobado DV-001 |

Se conserva TypeScript 5.6.3 y se aprueba migrar a Node.js 24.22.1, Vitest 4.1.12 y Ajv 8.20.0. La cadena de pruebas sí queda afectada por DV-001; requiere verificación posterior, sin reutilizar la evidencia histórica como prueba del entorno nuevo.

No se añaden `@pixi/react`, router, gestor de estado, `jsdom`, `happy-dom`, Testing Library,
FastAPI ni SymPy. El backend no se modifica.

**Rationale**: el stack confirmado exige React, PixiJS y Mafs; Vite es la herramienta de build mínima
para servirlos en el navegador. Las versiones vigentes son las aprobadas expresamente en DV-001; la selección anterior de Vite/Vitest queda como antecedente sustituido, no como restricción vigente.

**Alternativas consideradas**:

- **Servir módulos sin bundler**: React, PixiJS y Mafs requieren resolución de paquetes y JSX;
  rechazado.
- **Antecedente histórico: actualizar TypeScript y Vitest junto con Vite** se rechazó en el plan original. DV-001 sustituye esa decisión para Vite/Vitest y conserva TypeScript 5.6.3; la evidencia histórica de 001 no verifica la migración.
- **`@pixi/react`**: no aprobado; rechazado.

## D-12. Estrategia de verificación

**Decisión**: la lógica pura se prueba con Vitest en entorno `node`:

- esquema y almacén de progreso, incluida recuperación de datos corruptos;
- máquina de flujo y desbloqueo E01 → E08;
- validadores E01/E08 y normalización numérica;
- puerta de validación con transporte local falso y transporte API falso;
- correlación de respuestas tardías y ausencia de fallback;
- ejemplos JSON de `contracts/` con Ajv.

La interfaz, el foco, el tamaño táctil, el canvas y el lector de pantalla se verifican manualmente con
los escenarios de `quickstart.md`. No se añaden pruebas de componentes con DOM simulado.

**Rationale**: la Constitución exige pruebas manuales para UI y no exige pruebas automatizadas de
componentes. Probar la lógica pura y los contratos da regresión útil sin añadir `jsdom` ni Testing
Library. La evidencia manual cubre lo que Node no puede demostrar.

**Alternativas consideradas**:

- **Añadir `jsdom` y Testing Library**: dependencias nuevas y una suite más lenta; no son necesarias
  para el mínimo constitucional; rechazado.
- **Solo pruebas manuales**: perdería regresión en progreso y validación; rechazado.
- **E2E con navegador headless**: infraestructura no aprobada; rechazado.

## D-13. Contrato del adaptador API y fallos

**Decisión**: el adaptador API usa `POST` contra una URL configurada, con el `ValidationRequest` de
001 y el sobre `ValidationResult`/`ValidationError`. Un `2xx` con resultado válido produce
`correct`/`incorrect`/`indeterminate`; un `4xx` o `5xx`, un cuerpo inválido o un fallo de red produce
error técnico, no `incorrect`. La solicitud usa `AbortController` con un límite configurable de 10
segundos; no se reintenta automáticamente. «Reintentar» es una acción de la persona.

La correlación usa el `requestId` de 001 y la generación del ejercicio de 003. Una respuesta de una
solicitud anterior se descarta y no modifica el estado ni el progreso.

**Rationale**: cumple AC-15 y AC-17, evita el fallback silencioso y separa un fallo técnico de un
resultado matemático. El límite de 10 segundos es una condición de fallo operativa, no una métrica de
rendimiento inventada.

**Alternativas consideradas**:

- **Esperar indefinidamente**: dejaría la interfaz en `pending` sin salida; rechazado.
- **Reintentar automáticamente**: podría duplicar intentos y ocultar el fallo; rechazado.
- **Convertir un `5xx` en `incorrect`**: viola el Principio V; rechazado.

---

## Resumen de alineación técnica

| Aspecto | Elección | Justificación |
|---|---|---|
| Navegación | Máquina de pantallas en React, sin router | Evita dependencia y saltos de la introducción |
| Recorrido | `intro → E01 → E08 → complete` | Desbloqueo provisional aprobado, sin mapa |
| Progreso | LocalStorage `functions.progress.v1`, esquema v1 | Persistencia local versionada y recuperable |
| Validación | Puerta única local/API, sin fallback | Origen explícito y fallo visible |
| E01/E08 | Validadores puros exactos | Rigor matemático sin tolerancia |
| Renderizado | PixiJS Zona 1; Mafs Zona 3 | Stack confirmado y separación de dominio |
| Interacción | Contrato 003 consumido | Una sola máquina de estados |
| Accesibilidad | HTML nativo, foco, 44×44, `aria-live` | Mínimo constitucional verificable |
| Pruebas | Vitest node + Ajv + evidencia manual | Sin dependencias de UI adicionales |
| Backend | Sin cambios | Fuera de alcance de 002 |
