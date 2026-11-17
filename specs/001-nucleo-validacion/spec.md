# Feature Specification: Núcleo común de contratos y orquestación de validaciones

**Feature Branch**: `001-nucleo-validacion`

**Created**: 2026-11-16 (migración de formato; contenido heredado de la spec 001)

**Status**: Aprobado

"""contenido eliminado"""

## Contexto y alcance

**Módulo:** `001-nucleo-validacion`.

**Tipo:** módulo transversal consumido por las Specs de zonas y por el primer recorrido.

**Fuente de contenido:** [Banco canónico de ejercicios](../../docs/banco_ejercicios.md).

**Diseño relacionado:** [GDD v0.1 aprobado]](../../docs/workspace/GDD_FUNctions_v0.1.md).
El futuro primer recorrido E01/E08 tiene reservado el identificador `002` y todavía no existe como
spec.

### Propósito

Establecer la interfaz estable entre quienes solicitan una validación y los validadores que la
realizan, tanto en el cliente (Modo estático/local) como en el Backend (Modo conectado/API). Proveer
un despachador que seleccione un validador registrado según el Ejercicio y el mecanismo de ejecución.

### Alcance confirmado

- Definir contratos y tipos para las respuestas `number`, `expression`, `finiteSet`,
  `intervalUnion`, `mapping`, `boolean`, `vertex`, `point`, `asymptote` y `composite`.
- Definir contratos de solicitud y resultado de validación.
- Normalizar datos de manera coherente entre Frontend y Backend.
- Despachar una solicitud al validador configurado para el Ejercicio y al mecanismo local o API.
- Distinguir resultados matemáticos de errores de formato, configuración, transporte o servicio.
- Mantener separados: contratos comunes, orquestación/despacho y validadores matemáticos específicos.
- No depender de PixiJS, Mafs ni de detalles de presentación de las Zonas.

### Fuera de alcance confirmado

- Implementar los quince validadores matemáticos.
- Diseñar las pantallas y la implementación visual de las Zonas; los requisitos transversales de
  captura de respuestas se especifican aquí y su presentación concreta pertenece a las Specs
  consumidoras.
- Diseñar ayudas ZDP o contenido de retroalimentación pedagógica.
- Guardar progreso o administrar autenticación.
- Implementar el Backend FastAPI/SymPy o el Modo estático; estos consumidores deben respetar los
  contratos de esta Spec.

### Objetivo y valor educativo

El núcleo permite que los módulos de FUNctions comuniquen respuestas y resultados de manera
uniforme, evitando que cada Zona defina contratos incompatibles o confunda una falla técnica con un
error matemático del estudiante.

**Valor esperado:** las Zonas pueden usar validadores diferentes sin duplicar la semántica común de
solicitud, resultado y error. El mismo Ejercicio puede validarse localmente o mediante API con tipos
y estados compatibles.

**Límite de medición:** no se establecen umbrales de latencia ni métricas de desempeño no
aprobadas. Los resultados medibles de esta Spec se limitan a los definidos en
[Success Criteria](#success-criteria).

### Etiquetas de estado

- **Confirmado:** decisión explícita del Aprobador o incorporada por la Constitución vigente.
- **Documentado, pendiente de aprobación:** aparece en documentación del proyecto, pero su
  documento fuente aún es borrador o propuesta.
- **Propuesto:** opción sugerida para revisión; todavía no es requisito aprobado.
- **Pendiente:** falta una decisión o dato; no se debe completar por inferencia.
- **Verificado documentalmente:** comprobado mediante lectura del archivo citado; no significa que
  se haya implementado o probado.

## Clarifications

### Session 2026-11-16

- Q: ¿Qué forma exacta debe tener una respuesta compuesta cuando un Ejercicio pide varios campos, y cómo se declaran sus campos obligatorios? → A: `{kind:"composite", fields:{nombre:{kind,...}}}` con campos obligatorios declarados por Ejercicio; una respuesta parcial se rechaza como incompleta.
- Q: ¿Qué gramática debe aceptar el núcleo para `number` y `expression`, y cómo se responde E12 en la primera versión? → A: racional exacto y decimal finito exacto, sin `eval`; E12 se responde con campos estructurados en v1.
- Q: ¿Cómo deben representarse y normalizarse los conjuntos y las uniones de intervalos, incluidos el vacío, los alias de `ℝ`/`∅` y notaciones como `ℝ\{3}`? → A: vacío explícito distinto de campo vacío, alias de `ℝ`/`∅`, infinito siempre abierto, unión fusionada y ordenada, y `ℝ\{3}` convertido a unión de intervalos.
- Q: ¿Se admite alguna tolerancia numérica o de posicionamiento al validar E07, E08 y E11, o la comparación debe ser exacta? → A: sin tolerancia en E07/E08/E11; comparación exacta tras normalizar, snap exacto de controles y redondeo solo visual.
- Q: ¿Qué asociaciones Ejercicio→tipo deben quedar ratificadas en esta Spec y cuáles deben seguir pendientes? → A: ratificar solo `E01 → boolean` y `E08 → vertex`; el resto sigue pendiente y no se asigna por semejanza.

### Session 2026-11-16 (ronda 2)

- Q: ¿Qué formas serializadas deben adoptarse para `boolean`, `vertex`, `point`, `asymptote` y `mapping`? → A: `boolean` como booleano JSON; `vertex` como `{h,k}`; `point` como `{x,y}`; `asymptote` como `{orientation,value}`; `mapping` como arreglo de pares con semántica de conjunto; valores exactos.
- Q: ¿Debe `requestId` ser obligatorio en la solicitud v1 y qué garantía de idempotencia debe ofrecer el núcleo? → A: obligatorio, UUID, solo para correlación; el núcleo no garantiza idempotencia y esa responsabilidad queda en el consumidor o adaptador.
- Q: ¿Cómo debe elegir el despachador entre validación local y API, y cuándo se permite el fallback? → A: selección explícita por solicitud o configuración, sin fallback automático; un fallo de API es error técnico y el consumidor puede pedir validación local explícita etiquetando el origen.
- Q: ¿Qué modelo de error debe usar el contrato común para distinguir un formato inválido, una entrada incompleta y un fallo técnico? → A: error con categoría explícita (`format`, `incomplete`, `unsupported`, `configuration`, `transport`, `service`), código estable y mensaje; nunca se mezcla con el resultado matemático y el mapeo HTTP queda en el adaptador.
- Q: ¿Qué campos debe contener el resultado de validación en la v1? → A: `{status, feedbackCode, origin?}`; `message` y `apiVersion` quedan fuera del resultado del núcleo.

### Decisiones de aprobación

- La Spec queda aprobada por Edwin Ernesto Rodríguez Pérez, Aprobador principal. Las decisiones
  marcadas como confirmadas en este documento son normativas para sus consumidores; el Contrato de
  API vigente se actualizará para alinearse con ellas.
- No se capturarán respuestas matemáticas mediante cuadros de texto libre. Los intervalos se
  construirán con controles gráficos para sus extremos y su inclusión; las expresiones cortas, si
  un Ejercicio las requiere, se construirán con el teclado virtual de botones fijos descrito en las
  reglas de negocio y normalización. E12 no requiere expresión libre en v1.

## User Scenarios & Testing

### User Story 1 - Recibir un resultado uniforme (Priority: P1)

Una Zona, el primer recorrido o el Backend envía una respuesta tipada para un Ejercicio y recibe un
resultado con la misma semántica, sin que el consumidor tenga que interpretar formatos propios de
cada validador.

**Why this priority**: sin un resultado común, cada consumidor duplicaría reglas y podría presentar
una falla como error matemático del estudiante. Es la base de todo consumo del núcleo.

**Independent Test**: un validador de prueba registrado permite enviar respuestas conformes y no
conformes, y comprobar que el núcleo devuelve solo `correct`, `incorrect` o `indeterminate` sin
depender de ningún validador de E01–E15.

**Acceptance Scenarios**:

1. **Given** una respuesta con discriminante aprobado y permitido para el Ejercicio, **When** el
   núcleo la despacha a un validador registrado, **Then** devuelve exactamente uno de `correct`,
   `incorrect` o `indeterminate`.
2. **Given** una respuesta con estructura inválida, discriminante desconocido o tipo no permitido,
   **When** se solicita la validación, **Then** se devuelve error estructural antes de invocar al
   validador y nunca `incorrect`.
3. **Given** una respuesta evaluable que no cumple el criterio del Ejercicio, **When** el validador
   decide, **Then** el resultado es `incorrect`.

---

### User Story 2 - Validar con el mismo contrato en modo local o API (Priority: P2)

Un consumidor alterna entre validación local y API sin cambiar tipos, nombres de campos ni
semántica de resultado, y puede distinguir el origen cuando lo necesita.

**Why this priority**: la paridad entre modos evita que el respaldo local apruebe o rechace distinto
que el servicio conectado.

**Independent Test**: el mismo caso de conformidad se ejecuta con un adaptador local y uno de API
de prueba; ambos serializan los mismos tipos y producen la misma semántica de resultado.

**Acceptance Scenarios**:

1. **Given** un caso de conformidad con un validador de prueba, **When** se ejecuta por el adaptador
   local y por el adaptador API, **Then** ambos producen la misma semántica de resultado.
2. **Given** una solicitud despachada, **When** el consumidor necesita conocer el origen, **Then**
   el contrato permite distinguirlo sin fingir una respuesta de API.

---

### User Story 3 - Distinguir errores técnicos y bloqueos de configuración (Priority: P3)

Un consumidor recibe una categoría distinta cuando la entrada es incompleta o inválida, cuando falta
configuración aprobada y cuando falla el transporte o el servicio.

**Why this priority**: presentar un error de configuración o una falla de red como respuesta
matemática induce al estudiante a corregir algo que no está mal.

**Independent Test**: se provocan entradas inválidas, ausencia de gramática aprobada y fallo del
adaptador; cada caso devuelve su categoría y ninguno se convierte en resultado matemático.

**Acceptance Scenarios**:

1. **Given** una entrada incompleta o inválida, **When** se procesa en el núcleo, **Then** se
   informa como error estructural y no como `incorrect`.
2. **Given** un tipo o gramática sin aprobación, **When** se solicita la validación, **Then** la
   solicitud se bloquea con error de configuración y no se infiere `correct`, `incorrect` ni
   `indeterminate`.
3. **Given** un fallo de API, red o servicio local, **When** ocurre durante el despacho, **Then** se
   devuelve el error técnico correspondiente y se conserva fuera de los resultados matemáticos.

## Requirements

Los requisitos `REQ-01`…`REQ-12` conservan su identificador y su redacción heredada; `REQ-13`
registra la nueva restricción transversal de captura. Cuando una decisión confirmada amplía su
alcance, se conserva el ID y el cambio se registra en
[Cambios registrados](#cambios-registrados-respecto-de-la-versión-anterior).

### Functional Requirements

| ID | Requisito | Estado |
|---|---|---|
| REQ-01 | El núcleo definirá una unión discriminada con los tipos `number`, `expression`, `finiteSet`, `intervalUnion`, `mapping`, `boolean` y `vertex`; la decisión confirmada amplía la unión con `point`, `asymptote` y `composite`. | Confirmado |
| REQ-02 | Cada respuesta tendrá un tipo identificable y se validará estructuralmente antes de despachar. Las formas concretas no aprobadas permanecerán como decisiones pendientes, no se inferirán. Si falta una gramática o normalización aprobada, la solicitud se bloqueará y devolverá un error de configuración; no se elegirá `incorrect` ni `indeterminate` por inferencia. | Confirmado |
| REQ-03 | El contrato común identificará el Ejercicio, la respuesta y un `requestId` obligatorio (UUID) para correlación. La idempotencia no se garantiza en el núcleo; corresponde al consumidor o adaptador. | Confirmado |
| REQ-04 | El resultado matemático común será exactamente `correct`, `incorrect` o `indeterminate`, con `feedbackCode` y, opcionalmente, `origin` (`local`/`api`). No incluye `message` ni `apiVersion`. Errores de solicitud/transporte/servicio se representarán fuera de esos estados. `incomplete` es un estado de entrada del cliente y no un resultado matemático; una entrada incompleta o inválida es un error estructural, no `incorrect`. La API devolverá solo los tres resultados matemáticos y no devolverá `incomplete` como resultado. | Confirmado |
| REQ-05 | El despachador seleccionará exclusivamente un registro explícito de Ejercicio, tipo permitido y mecanismo configurado (local/API). La selección es explícita y no existe fallback automático entre mecanismos. | Confirmado |
| REQ-06 | Los adaptadores local y API producirán resultados conformes a la misma semántica común y permitirán distinguir el origen (`local`/`api`) cuando el consumidor lo requiera. | Confirmado |
| REQ-07 | La normalización compartida deberá ser determinista y aplicarse antes de invocar el validador, evitando dos interpretaciones entre Frontend y Backend. | Propósito y decisiones generales confirmados; la gramática sintáctica exacta de `expression` queda pendiente hasta que un Ejercicio requiera ese tipo |
| REQ-08 | Errores de entrada, de validador y de comunicación no se convertirán en `incorrect` ni se ocultarán con respuestas predeterminadas. | Confirmado |
| REQ-09 | El núcleo expondrá interfaces para validadores específicos sin contener la implementación matemática de E01–E15. | Confirmado |
| REQ-10 | El núcleo no dependerá de bibliotecas de renderizado, componentes de Zona, persistencia ni autenticación. Es transversal a una aplicación web construida con React.js, PixiJS, Mafs/SVG y Python con librerías especializadas, sin motor de juego dedicado, y no depende de la UI. | Confirmado |
| REQ-11 | El mapa de consumidores y la trazabilidad con las Specs se mantendrán explícitos; una asociación Ejercicio/tipo no documentada se marcará pendiente. | Confirmado |
| REQ-12 | Las respuestas con múltiples campos podrán representarse sin perder nombres ni tipos de sus componentes. La forma aprobada es `{kind:"composite", fields:{nombre:{kind,...}}}` con campos obligatorios declarados por Ejercicio; una respuesta parcial se rechaza como incompleta. | Confirmado |
| REQ-13 | Los consumidores no ofrecerán cuadros de texto libre para respuestas matemáticas: los intervalos se construirán con controles gráficos para sus extremos y pertenencia; las expresiones cortas, cuando un Ejercicio las requiera, se construirán con un teclado virtual de tokens fijos. El núcleo recibirá la respuesta estructurada conforme al contrato. | Confirmado |

### Reglas de negocio y normalización

**Confirmadas para este módulo**

- No aceptar código ejecutable ni expresiones arbitrarias como si fueran datos matemáticos.
- No convertir un error de transporte o un resultado indeterminado en respuesta incorrecta.
- No aprobar una respuesta parcial cuando el Ejercicio exige varios componentes; la definición de
  dichos componentes debe estar en el contrato del Ejercicio.
- Mantener separada la validación sintáctica/estructural de la decisión matemática.
- Los validadores matemáticos son específicos por Ejercicio y pueden residir en módulos diferentes;
  el núcleo solo define sus interfaces compartidas.
- Los números se aceptan como racional exacto o decimal finito exacto; no se usa `eval` ni se ejecuta
  texto del estudiante.
- `expression` no acepta texto libre ni código ejecutable. Si un Ejercicio requiere una expresión
  corta, el consumidor la construye con un teclado virtual que ofrece únicamente botones para
  números, `x`, `+`, `-`, `(` y `)`. La gramática sintáctica exacta para interpretar secuencias de
  esos tokens queda pendiente hasta que un Ejercicio requiera `expression`; E12 usa campos
  estructurados en v1 y no requiere expresión libre.
- Los conjuntos se comparan completos y sin depender del orden; `∅` explícito es distinto de un
  campo vacío y se aceptan sus alias aprobados.
- Los intervalos conservan extremos abiertos/cerrados; el infinito siempre es abierto y las uniones
  se fusionan y ordenan. `ℝ\{3}` se normaliza a la unión de intervalos equivalente.
- E07/E08/E11 no admiten tolerancia numérica ni de posicionamiento: la comparación es exacta tras
  normalizar, los controles hacen snap exacto y el redondeo es solo visual.
- No se ofrecen cuadros de texto libre para respuestas matemáticas. Para representar un intervalo,
  el consumidor presenta controles gráficos separados para los extremos numéricos y controles
  explícitos de inclusión; por ejemplo, `[` `[ -2 ]` `,` `[ 5 ]` `]`. Para expresiones cortas,
  cuando sean necesarias, presenta el teclado virtual de tokens indicado arriba.

Estas reglas son normativas para las implementaciones derivadas de esta Spec. La forma serializada
final y su normalización se consolidarán en los contratos compartidos; el Contrato de API vigente
debe actualizarse antes de considerarse alineado con esta Spec.

### Tipos de respuesta frente a estados

`correct`, `incorrect` e `indeterminate` son resultados matemáticos del proceso de validación, no
tipos de respuesta. `incomplete` es un estado de entrada del cliente y no un resultado matemático.
Una entrada incompleta o inválida es un error estructural, no `incorrect`. El error técnico es una
categoría distinta. **Confirmado (2026-11-16):** el error usa una categoría explícita, un código
estable y un mensaje, separado de los resultados; el mapeo HTTP corresponde al adaptador.

### Solicitud, resultado y despacho

**Solicitud común.** La solicitud debe identificar el Ejercicio y contener una respuesta cuyo
discriminante y estructura coincidan con el contrato registrado para ese Ejercicio.

**Confirmado (2026-11-16):** la solicitud incluye `requestId` obligatorio (UUID), `exerciseId` y
`answer`. `requestId` sirve solo para correlación; el núcleo no garantiza idempotencia ni
deduplicación, y esa responsabilidad se declara del consumidor o adaptador. El tamaño y el esquema
final de los campos se concretan en `contracts/`.

**Resultado común.** Un resultado evaluado debe expresar exactamente uno de estos estados:

- `correct`: el validador pudo evaluar la respuesta y cumple el criterio completo del Ejercicio.
- `incorrect`: el validador pudo evaluar la respuesta y determinó que no cumple el criterio.
- `indeterminate`: el validador no pudo decidir dentro de su alcance; no equivale a incorrecta.

**Confirmado:** una falla de comunicación no puede convertirse en `incorrect`.

**Confirmado (2026-11-16):** el resultado del núcleo contiene `status` (`correct`, `incorrect` o
`indeterminate`), `feedbackCode` y, opcionalmente, `origin` (`local` o `api`). `message` es
presentación localizada y `apiVersion` es metadato de transporte; ambos quedan fuera del resultado
del núcleo.

**Despachador.** El despachador debe:

1. recibir la solicitud común;
2. comprobar que `exerciseId` está registrado y que el tipo de respuesta está permitido para ese
   contrato;
3. seleccionar el validador asociado al Ejercicio y el mecanismo solicitado/configurado: local o API;
4. entregar una solicitud normalizada al adaptador correspondiente;
5. normalizar el resultado al contrato común y conservar el origen/mecanismo de validación cuando el
   consumidor lo necesite;
6. comunicar errores del mecanismo como errores, sin convertirlos en una respuesta matemática.

El núcleo no implementa ni decide la respuesta matemática de un Ejercicio. La selección de validador
se basa en registros explícitos, no en heurísticas, importación de bibliotecas visuales ni análisis
del texto de respuesta.

**Confirmado (2026-11-16):** el mecanismo se selecciona explícitamente por solicitud o
configuración; no existe fallback automático. Si el mecanismo falla, se devuelve error técnico y el
consumidor puede solicitar la validación local de forma explícita, etiquetando el origen.

**Pendiente:** definición de API disponible, reintentos técnicos de solicitudes, cancelación,
concurrencia y la regla de interfaz para autorizar el cambio a Modo estático. El
[GDD aprobado]](../../docs/workspace/GDD_FUNctions_v0.1.md) define los reintentos del jugador; la
futura spec del recorrido deberá concretar el fallback sin duplicar reglas de interfaz.

### Manejo de errores

| Escenario | Comportamiento requerido | Estado |
|---|---|---|
| JSON o estructura de respuesta inválidos | Devolver un error de entrada identificado; no invocar el validador | Confirmado; categoría `format` con código estable |
| Respuesta incompleta (campo obligatorio ausente) | Devolver error estructural con categoría `incomplete`; no invocar el validador ni devolver `incorrect` | Confirmado |
| Tipo no permitido para el Ejercicio | Rechazar la solicitud como incompatibilidad de contrato; no devolver `incorrect` | Confirmado; categoría `unsupported` |
| `exerciseId` desconocido o sin registro | Informar que no hay validador registrado; no usar un validador por defecto | Confirmado; categoría `unsupported` |
| Respuesta matemáticamente incorrecta y evaluable | Devolver `incorrect` | Confirmado |
| Validador no puede decidir | Devolver `indeterminate`, no `incorrect` | Confirmado |
| API, red o servicio local no disponible | Devolver error de mecanismo/servicio y conservarlo distinto de un resultado matemático | Confirmado; categoría `transport` o `service` |
| SymPy u otro validador produce un error inesperado | No ocultarlo ni producir una respuesta exitosa falsa; traducirlo al error técnico definido por el adaptador | Confirmado; categoría `service`; HTTP en el adaptador |
| Fallback local | No activarlo silenciosamente ni presentar el resultado como si viniera de la API | Confirmado: sin fallback automático; el consumidor puede pedir local explícito y etiquetar el origen |
| Gramática o normalización sin aprobación | Bloquear la solicitud y devolver error de configuración; no elegir un resultado matemático por inferencia | Confirmado; categoría `configuration` |

**Pendiente:** catálogo concreto de códigos por categoría, mensajes localizables, política de logging
y campos sensibles permitidos. El mapeo HTTP se define en el adaptador; el Contrato de API actual es
inicial, no un esquema implementado.

## Key Entities

### Tipos de respuesta

La unión común de respuestas contempla diez discriminantes. Los siete tipos originales conservan su
descripción; `point`, `asymptote` y `composite` se añadieron por decisión confirmada y sus formas se
detallan en la tabla siguiente.

| Tipo | Significado requerido | Forma serializada / normalización |
|---|---|---|
| `number` | Un valor numérico admitido por el validador | **Confirmado:** racional exacto o decimal finito exacto, sin `eval`; la representación canónica se detalla en `normalization.yaml`. |
| `expression` | Una expresión matemática corta dentro de un lenguaje permitido | **Confirmado:** no se captura como texto libre ni se evalúa código. Si un Ejercicio la requiere, se construye con teclado virtual de botones para números, `x`, `+`, `-`, `(` y `)`. La gramática sintáctica de secuencias queda pendiente hasta que un Ejercicio use este tipo; E12 usa campos estructurados en v1. |
| `finiteSet` | Conjunto finito de valores matemáticos, que puede ser vacío | **Confirmado:** se compara completo y sin orden; `∅` explícito es distinto de un campo vacío; se aceptan los alias aprobados y los duplicados se colapsan. |
| `intervalUnion` | Unión de intervalos reales, con extremos y pertenencia explícitos | **Confirmado:** extremos abiertos/cerrados explícitos, infinito siempre abierto, unión fusionada y ordenada; `ℝ\{3}` se normaliza a unión de intervalos. |
| `mapping` | Relación finita de pares entrada/salida | **Confirmado (2026-11-16):** arreglo de pares `[entrada,salida]` con semántica de conjunto; el orden y los duplicados no cambian la identidad; los valores son exactos. Una relación inválida en edición es estado del cliente y no una respuesta válida. |
| `boolean` | Respuesta de dos valores, verdadera/falsa | **Confirmado (2026-11-16):** booleano JSON (`true`/`false`), asociado a E01; no se aceptan cadenas `"true"`/`"false"`. |
| `vertex` | Respuesta que contiene las coordenadas del vértice, semánticamente `h` y `k` | **Confirmado (2026-11-16):** `{h:number, k:number}` con números exactos; asociado a E08 con `a=1` fijo. |
| `point` | Coordenada o par ordenado que puede representar un punto o una correspondencia origen→imagen | **Confirmado (2026-11-16):** `{x:number, y:number}` con números exactos. Si el Ejercicio exige origen→imagen, se usan dos campos `point` dentro de una respuesta `composite`. |
| `asymptote` | Recta asintótica definida por orientación (horizontal/vertical) y valor | **Confirmado (2026-11-16):** `{orientation:"horizontal"\|"vertical", value:number}` con valor exacto; `y=0` no equivale a `x=0` y no se admite aproximación. |
| `composite` | Respuesta de varios campos nombrados y tipados, con obligatoriedad por Ejercicio | **Confirmado:** `{kind:"composite", fields:{nombre:{kind,...}}}`; los campos obligatorios se declaran por Ejercicio, el campo faltante es incompleto y el campo extra es error estructural. |

El núcleo debe poder identificar el tipo de una respuesta sin inferirlo por el texto ni reinterpretar
un formato desconocido. Una respuesta de tipo no admitido para un Ejercicio es un error de validación
de entrada, no un resultado matemático `incorrect`.

### Asociaciones con ejercicios

**Regla:** solo se declaran como ratificadas las asociaciones respaldadas explícitamente por
decisiones del Aprobador. Un ejemplo de serialización o una similitud matemática no basta para
asignar un tipo a un Ejercicio. El 2026-11-16 se ratificaron únicamente `E01 → boolean` y
`E08 → vertex`; el resto sigue pendiente.

| Ejercicio / tipo | Estado de la asociación | Evidencia y límite |
|---|---|---|
| E01 → `boolean` | **Ratificado (2026-11-16)** | La asociación se conserva como contrato común requerido; los detalles de interfaz no se transfieren a este módulo. |
| E08 → `vertex` | **Ratificado (2026-11-16)** | La asociación y la forma `{h:number, k:number}` están confirmadas; la aceptación numérica es exacta (D-06 resuelta). La publicación del esquema compartido sigue pendiente. |
| E09 → `finiteSet` | **Propuesto en el Contrato de API; no ratificado (2026-11-16)** | El ejemplo de solicitud de la API usa `exerciseId: "E09"` y `kind: "finiteSet"` con `{-3,3}`. Conservar como asociación propuesta hasta aprobar el contrato; no se ratificó en esta clarificación. |
| E02/E03 → `mapping` | **Pendiente** | Los ejercicios reparan relaciones representadas por pares, pero los documentos no asignan explícitamente el discriminante `mapping` a sus respuestas. No asumir que ese será su contrato de entrada. |
| E04–E06, E10–E11, E13 → `intervalUnion` | **Pendiente** | Sus respuestas incluyen dominios, rangos o intervalos, pero no existe una tabla normativa Ejercicio→tipo. Confirmar si se usará `intervalUnion` directamente o como parte de una respuesta compuesta. |
| E07 → `number` | **Pendiente** | El estudiante responde `m` y `b`, pero no se ha acordado si el contrato usa dos valores `number`, una respuesta compuesta u otra forma. |
| E12 → `number` / `expression` | **Pendiente** | El enunciado pide conversión logarítmica y solución numérica; los documentos no asignan tipos del contrato a esos campos. La forma se resuelve con campos estructurados en v1 (D-04 resuelta); la asociación Ejercicio→tipo sigue pendiente. |
| E14 → `finiteSet` | **Pendiente** | El enunciado solicita un conjunto vacío y uno unitario, pero no asigna formalmente el discriminante. La notación de vacío ya está normalizada (D-05 resuelta); la asociación Ejercicio→tipo sigue pendiente. |
| E15 → tipos de componente | **Pendiente** | Solicita dos evaluaciones y un dominio. No hay un esquema tipado compuesto acordado. |
| `expression`, `number`, `intervalUnion`, `mapping` en general | **Sin asociación confirmada adicional** | Aparecen en el contrato inicial o en respuestas de ejercicios, pero no hay una matriz aprobada que relacione cada tipo con todos sus Ejercicios. |

**Decisión transversal (2026-11-16):** varios ejercicios solicitan más de un campo (por ejemplo,
dominio y rango, o valores y dominio). La forma compuesta aprobada es
`{kind:"composite", fields:{nombre:{kind,...}}}` con campos obligatorios por Ejercicio y rechazo de
respuestas parciales (D-02 resuelta). Las asociaciones no ratificadas siguen siendo pendientes y no
son requisitos.

No se asigna un tipo a un Ejercicio por semejanza. La ampliación a diez discriminantes no aprueba
las asociaciones pendientes; esas decisiones se documentan en
[Decisiones pendientes](#decisiones-pendientes).

### Entidades del contrato

- **Solicitud de validación:** identifica el Ejercicio, la respuesta tipada, el `requestId` de
  correlación y el mecanismo seleccionado explícitamente.
- **Respuesta tipada:** unión discriminada de los diez tipos aprobados; su estructura debe coincidir
  con la registrada para el Ejercicio.
- **Resultado de validación:** exactamente uno de los tres resultados matemáticos en `status`, con
  `feedbackCode` y `origin` opcional (`local`/`api`); `message` y `apiVersion` no forman parte del
  resultado del núcleo.
- **Error estructural:** entrada incompleta, inválida o de tipo no permitido; se reporta fuera de los
  resultados matemáticos con categoría, código estable y mensaje.
- **Error técnico:** fallo de configuración, transporte, servicio o validador; no se presenta como
  resultado matemático y usa la misma estructura de error.
- **Registro de validador:** asociación explícita entre Ejercicio, tipos permitidos, mecanismo y
  adaptador.
- **Contrato compartido:** fuente canónica de tipos, normalización y códigos; consumida por Frontend,
  Backend y Modo estático.

## Success Criteria

### Measurable Outcomes

- **SC-01**: el 100 % de las respuestas aceptadas por el núcleo declara uno de los diez
  discriminantes aprobados y un tipo permitido para el Ejercicio; ninguna se clasifica por inferencia
  textual.
- **SC-02**: el 100 % de los resultados matemáticos entregados a consumidores usa exactamente uno de
  `correct`, `incorrect` o `indeterminate`; `incomplete` y los errores técnicos se reportan en
  categorías separadas, con cero apariciones de `incomplete` como resultado.
- **SC-03**: el 100 % de los casos sin gramática o normalización aprobada se bloquea con error de
  configuración y produce cero resultados matemáticos inferidos.
- **SC-04**: añadir un Ejercicio que use un tipo ya aprobado requiere cero cambios incompatibles en
  los contratos comunes; cualquier necesidad de cambio incompatible se registra como nueva decisión.

No se fijan umbrales de latencia ni de volumen: la Constitución prohíbe inventar métricas sin método
y evidencia aprobados.

## Acceptance Criteria

Los siguientes criterios describen cómo verificar la futura implementación. No son pruebas
ejecutadas. Conservan su identificador y su redacción heredada; los cambios de alcance aprobados se
registran en [Cambios registrados](#cambios-registrados-respecto-de-la-versión-anterior).

| ID | Criterio verificable | Requisitos |
|---|---|---|
| AC-01 | El contrato publicado enumera los diez discriminantes requeridos y una prueba de esquema acepta un ejemplo válido por cada tipo y rechaza un discriminante desconocido. | REQ-01, REQ-02 |
| AC-02 | Las solicitudes válidas conservan el identificador del Ejercicio y el `requestId` UUID de extremo a extremo; una solicitud estructuralmente inválida se rechaza antes del despacho. | REQ-02, REQ-03 |
| AC-03 | La batería de contrato representa los tres resultados permitidos y comprueba que un resultado desconocido no se interprete como `incorrect`. | REQ-04 |
| AC-04 | Una prueba con respuesta incorrecta evaluable produce `incorrect`; una prueba indeterminada produce `indeterminate`; ninguna falla de red/API se informa como resultado matemático. | REQ-04, REQ-08 |
| AC-05 | Para un Ejercicio sin registro, tipo no permitido o mecanismo no configurado, el despachador retorna el error definido y no llama un validador distinto ni uno por defecto. | REQ-02, REQ-05 |
| AC-06 | Un caso de conformidad ejecutado por adaptador local y adaptador API serializa los mismos tipos y aplica la misma semántica de resultado para el validador de prueba usado. | REQ-06, REQ-07 |
| AC-07 | Los formatos aceptados se normalizan de forma determinista según reglas aprobadas por tipo; casos equivalentes producen una entrada normalizada común y casos fuera de gramática se rechazan con error explícito. | REQ-07, REQ-08 |
| AC-08 | Las pruebas de arquitectura confirman que el paquete de contratos/despacho no importa PixiJS, Mafs, componentes de Zona, LocalStorage, FastAPI ni SymPy. | REQ-09, REQ-10 |
| AC-09 | Para E01/E08, la tabla registra `boolean` y `vertex` como asociaciones ratificadas el 2026-11-16, y las Specs consumidoras referencian estos contratos sin declarar formatos rivales. | REQ-01, REQ-11 |
| AC-10 | El mapa de ejercicios no asigna automáticamente `number`, `expression`, `intervalUnion` o `mapping` por semejanza; las asociaciones no ratificadas aparecen como pendientes. | REQ-11 |
| AC-11 | Un ejemplo de respuesta compuesta conserva cada campo obligatorio y su discriminante conforme a `{kind:"composite", fields:{...}}`; los campos faltantes se rechazan como incompletos y los campos extra como error estructural. | REQ-12 |
| AC-12 | Los flujos consumidores no permiten texto libre para respuestas matemáticas: los intervalos se forman con controles gráficos separados para extremos y pertenencia; las expresiones, si se requieren, se componen únicamente con el teclado virtual aprobado. La carga enviada al núcleo cumple el esquema tipado y las secuencias que no cumplan la gramática aprobada se rechazan con error de formato. | REQ-02, REQ-13 |

## Assumptions

- FUNctions es una aplicación web que se ejecuta en navegador; el núcleo es transversal y no depende
  de la UI.
- El stack de producto está resuelto: React.js, PixiJS, Mafs/SVG y Python con librerías
  especializadas (FastAPI/SymPy y las que apruebe el plan). No se adopta un motor de juego dedicado.
- Los consumidores trabajan sobre el banco cerrado E01–E15; el núcleo no es una calculadora simbólica
  pública.
- El juego es público y anónimo: no hay cuentas, no se envía progreso personal y el núcleo no
  persiste datos del estudiante.
- El contrato común será la única fuente de tipos y normalización para Frontend, Backend y Modo
  estático; los detalles se concretan en `contracts/` durante la planificación.
- `requestId` es un UUID obligatorio de correlación, no una credencial ni un dato personal; el núcleo
  no garantiza idempotencia.
- No existe fallback automático entre validación local y API; la selección es explícita y el origen
  se conserva cuando el consumidor lo requiere.
- La autoridad de aprobación es Edwin Ernesto Rodríguez Pérez, en representación del equipo.
- Esta Spec no implementa validadores de E01–E15, UI, persistencia ni Backend.

### Dependencias y composición modular

**Dependencias consumidoras confirmadas.** Las siguientes Specs deben depender de esta definición
cuando implementen validación:

- Zona 1 (`E01–E03`).
- Zona 2 (`E04–E06`).
- Zona 3 (`E07–E09`).
- Zona 4 (`E10–E12`).
- Zona 5 (`E13–E15`).
- Primer recorrido: debe consumir los contratos del núcleo en lugar de definir tipos alternativos.
- Backend FastAPI/SymPy: debe implementar un adaptador conforme a estos contratos; los detalles
  técnicos y validadores del servidor pertenecen a la Spec de Backend correspondiente.

Si una funcionalidad no solicita ni evalúa respuestas, no debe depender del núcleo innecesariamente.

**Dirección de dependencias:**
`Specs de zona / primer recorrido / Backend → contratos y resultado del núcleo → interfaz común del
validador`.

El núcleo no depende de Zonas, React, PixiJS, Mafs, FastAPI, SymPy ni de persistencia. Los validadores
concretos dependen del contrato; la regla de dominio específica no se traslada al núcleo.

### Trazabilidad de requisitos transversales del primer recorrido

La especificación del primer recorrido está en borrador. Esta tabla separa lo compartido, lo que
permanece en el consumidor y lo que se excluye:

| Origen en primer recorrido | Acción en esta Spec | Motivo / límite |
|---|---|---|
| REQ-04: distinguir correcto, incorrecto, incompleto, indeterminado y error de servicio | **Trasladar** semántica común de `correct`/`incorrect`/`indeterminate` y errores técnicos. **Referenciar** desde la Spec del recorrido. | La presentación y el tratamiento de la respuesta incompleta siguen en el consumidor; `incomplete` no es un resultado matemático. |
| REQ-05: intentos, doble envío y solicitudes pendientes | **Referenciar parcialmente.** El sobre usa `requestId` obligatorio; la política de intentos, bloqueo de botón e idempotencia queda en el consumidor. | Contabilidad del juego no es responsabilidad matemática del núcleo. |
| REQ-09: respuestas tardías al cambiar de Ejercicio | **Referenciar**, no trasladar como comportamiento UI. | El consumidor controla ciclo de vida y actualización de pantallas; la relación de solicitud/respuesta puede usar ID de correlación. |
| REQ-10: mostrar si se valida por API o localmente; fallback explícito | **Trasladar** la distinción de mecanismo/origen al contrato de despacho, ya confirmada. **Referenciar** reglas de interfaz. | No duplicar mensajes ni flujo de recuperación del modo en cada validador. |
| REQ-11: criterios equivalentes en API y Modo estático | **Trasladar** el requisito de conformidad de tipos/resultados. **Referenciar** cada regla matemática desde su validador específico. | El núcleo no implementa E01/E08 ni garantiza equivalencia matemática por sí solo. |
| REQ-02 y REQ-03; AC-02–AC-05 | **Referenciar**, no trasladar su matemática. | La clasificación de E01 y la validación de h/k en E08 corresponden a sus validadores; el núcleo aporta `boolean` y `vertex`. |
| REQ-06; REQ-07–REQ-08; AC-06–AC-09; REQ-12 | **Excluir** del núcleo. | Ayudas, persistencia, reinicio y accesibilidad pertenecen a sus módulos consumidores. |

## Edge Cases

1. **Respuesta JSON mal formada:** el adaptador rechaza la entrada antes de invocar un validador y
   devuelve error estructural.
2. **Discriminante desconocido o tipo no admitido por el Ejercicio:** devolver incompatibilidad de
   contrato, no `incorrect`.
3. **Ejercicio sin validador registrado:** devolver error explícito de no configurado/no disponible;
   no usar el primer validador disponible.
4. **Representación no normalizable:** rechazar como error de entrada con campo/código identificable;
   no cambiar silenciosamente su significado.
5. **Validador decide que la respuesta no cumple:** `incorrect`.
6. **Validador no puede decidir dentro de su alcance:** `indeterminate`.
7. **API o mecanismo local falla:** representar error de comunicación/servicio aparte del resultado.
   No hay fallback automático; el consumidor puede solicitar validación local explícitamente y
   etiquetar el origen.
8. **Respuesta de API tardía o duplicada:** se relaciona con la solicitud original mediante el
   `requestId` obligatorio; el núcleo no deduplica ni garantiza idempotencia; el consumidor o
   adaptador gestiona la respuesta obsoleta.
9. **Campo obligatorio vacío frente a conjunto vacío:** un campo vacío es incompleto y no equivale a
   `∅`; `∅` explícito y sus alias aprobados son válidos.
10. **Conjunto con elementos duplicados o desordenados:** se compara como conjunto; el orden y los
    duplicados son indiferentes.
11. **Intervalos desordenados, solapados o con extremos infinitos:** el infinito siempre es abierto y
    la unión se fusiona y ordena; `ℝ\{3}` se normaliza a la unión equivalente.
12. **Notación equivalente (`ℝ`, `R`, `(-∞,+∞)`, `−` Unicode, coma decimal):** la gramática numérica
    y simbólica se rige por D-04 resuelta; los alias de conjuntos e intervalos se normalizan según
    D-05 resuelta y ninguna equivalencia se aprueba por inferencia.
13. **Gramática o normalización sin aprobación:** la solicitud se bloquea con error de configuración;
    no se elige `correct`, `incorrect` ni `indeterminate` por defecto.
14. **Respuesta compuesta con campo faltante o extra:** el campo faltante es incompleto; el campo
    extra es error estructural; la estructura es `{kind:"composite", fields:{...}}` con campos
    obligatorios por Ejercicio.
15. **Aproximación numérica en E07/E08/E11:** no se admite tolerancia; un valor aproximado no
    sustituye al exacto y el redondeo es solo visual.
16. **`mapping` con pares desordenados o repetidos:** se compara como conjunto de pares; el orden y
    los duplicados son irrelevantes; una relación incompleta en edición es estado del cliente, no
    una respuesta válida.
17. **`point` o `asymptote` con forma ambigua:** `point` siempre usa `{x,y}`; la correspondencia
    origen→imagen se expresa con dos campos `point` en una respuesta `composite`; `asymptote` exige
    `orientation` y `value` exactos, y `y=0` no equivale a `x=0`.

No forman parte de esta Spec los mensajes concretos al estudiante, conteo de intentos, ayudas a
mostrar, reintentos, estado de LocalStorage ni recuperación de progreso.

## Decisiones pendientes

Las decisiones y asociaciones que siguen abiertas no se resuelven por inferencia. Las que bloqueen el
plan deben cerrarse en `/speckit.clarify` o en la Spec correspondiente; una propuesta no es una
decisión ratificada.

### Asociaciones Ejercicio→tipo no ratificadas

**Pregunta:** ¿qué tipos y campos corresponden a las asociaciones aún no ratificadas?

**Excepciones ratificadas (2026-11-16):** `E01 → boolean` y `E08 → vertex`. La asociación queda
ratificada; el formato JSON de `boolean` y la serialización de las coordenadas de `vertex` siguen
sujetos al contrato compartido.

**Pendientes:** todas las demás asociaciones, incluidas E02/E03, E04–E07, E09–E15 y el uso de
`composite` fuera de la forma general ya aprobada. No se asignan por semejanza; cada una debe
declararse en el Ejercicio o en su Spec.

### Otras decisiones heredadas

- Métricas cuantitativas de valor del módulo: **Pendiente**; no se inventan umbrales.
- Cuándo y con qué acción se inicia una validación; manejo de solicitudes simultáneas y reintentos:
  **Pendiente**.
- Regla de interfaz para autorizar el cambio a Modo estático y su aviso al jugador: **Pendiente** y
  corresponde al consumidor.
- Registro/propietario de validadores y versionado de esquema: **Pendiente**.
- Idempotencia y deduplicación en adaptadores o consumidores: **Pendiente** y fuera del núcleo.
- Fuente canónica del contrato compartido entre TypeScript y Python (manual, esquema compartido o
  generación): **Pendiente**.
- Mensajes visibles y localización: **Pendiente** y corresponden a los módulos UI. El `feedbackCode`
  y el origen (`local`/`api`) ya forman parte del resultado del núcleo.
- Política de códigos HTTP, logging, privacidad de `requestId` y traducción de errores API:
  **Pendiente**.
- Fase inicial de cobertura de validadores y prioridad de los diez tipos: **Pendiente**. La inclusión
  de un tipo en el núcleo no significa que su validador matemático exista.
- Condiciones para que un consumidor dependa del núcleo y versión compatible entre Specs:
  **Pendiente**.
- Reconciliación de la numeración histórica: `001` corresponde al núcleo y `002` queda reservado para
  el primer recorrido. La antigua carpeta `001-primer-recorrido` fue eliminada y no debe enlazarse
  como artefacto vigente.
- Ratificación de los criterios C01–C07: **Pendiente**. Las formas y semánticas declaradas como
  confirmadas en esta Spec se mantienen; la correspondencia final con el Contrato de API y su
  serialización se concretarán al actualizar ese documento.
- Gramática sintáctica exacta de expresiones construidas con el teclado virtual: **Pendiente** hasta
  que un Ejercicio requiera el tipo `expression`.

## Contratos requeridos

Estos contratos se crearán en `contracts/` durante `/speckit.plan`; no se escriben en esta Spec.

| Contrato | Propósito | Estado |
|---|---|---|
| `answer.schema.json` | Unión discriminada de los diez tipos de respuesta y su estructura serializada. | Pendiente de creación; tipos y decisiones de forma confirmados aquí. La gramática sintáctica de `expression` y las asociaciones pendientes por Ejercicio aún deben concretarse cuando se requieran. |
| `result.schema.json` | Resultado matemático con `status` (`correct`, `incorrect` o `indeterminate`), `feedbackCode` y `origin` opcional; separado de los errores. | Pendiente de creación; semántica y campos confirmados aquí. |
| `error.schema.json` | Error con categoría, código estable y mensaje, separado del resultado matemático. | Pendiente de creación; modelo confirmado aquí. |
| `normalization.yaml` | Reglas deterministas de normalización por tipo, antes de invocar al validador. | Pendiente de creación; decisiones generales de normalización documentadas aquí, con serializaciones finales por concretar. |
| `feedback-codes.yaml` | Catálogo estable de códigos de retroalimentación y su relación con los diagnósticos. | Pendiente de ratificación; `feedbackCode` forma parte del resultado |

## Trazabilidad

### Fuentes del proyecto

| Fuente | Información usada | Estado |
|---|---|---|
| [GDD v0.1]](../../docs/workspace/GDD_FUNctions_v0.1.md) | Reglas generales de progreso, ayudas y experiencia; interacción de E01/E08; plataforma web | Diseño aprobado; no equivale a spec ni implementación |
| [Contrato de API](../../docs/politicas/contrato-api.md) | Sobre `requestId`/`exerciseId`/`answer`; resultados `correct`/`incorrect`/`indeterminate`; cinco tipos iniciales; error API | Contrato inicial propuesto y aún no alineado; se actualizará para reflejar las decisiones aprobadas de esta Spec |
| [Banco canónico](../../docs/banco_ejercicios.md) | Respuestas matemáticas y campos solicitados para E01–E15 | Contenido leído; revisión cruzada y criterios C01–C07 pendientes |
| [Guía técnica de ejercicios](../../docs/exercises.md) | Detalle técnico derivado por ejercicio | Guía leída; derivada y pendiente de revisión cruzada |
| [Constitución vigente](../../.specify/memory/constitution.md) | Tipos mínimos, taxonomía de resultados, stack, autoridad y bloqueo por gramática no aprobada | Ratificada 1.0.0 |
| Instrucción del Aprobador | Alcance del núcleo, migración de formato, decisiones confirmadas y límites de cambio | Confirmado para esta revisión |

### Correspondencia con la spec anterior

| Sección anterior | Ubicación en esta Spec |
|---|---|
| 1. Identificación del módulo | Contexto y alcance |
| 2. Objetivo y valor educativo | Contexto y alcance; Success Criteria |
| 3. Tipos y relación con los Ejercicios | Requirements; Key Entities |
| 4. Sistemas, contratos y despacho | Requirements |
| 5. Reglas de negocio y normalización | Requirements |
| 6. Manejo de errores | Requirements; Edge Cases |
| 7. Dependencias y composición modular | Assumptions |
| 8. Requisitos funcionales | Functional Requirements (`REQ-01`…`REQ-13`) |
| 9. Criterios de aceptación | Acceptance Criteria (`AC-01`…`AC-12`) |
| 10. Escenarios de error y límites | Edge Cases |
| 11. Preguntas abiertas y decisiones pendientes | Decisiones pendientes |
| 12. Trazabilidad con las fuentes del proyecto | Trazabilidad |

### Cambios registrados respecto de la versión anterior

| ID | Cambio de alcance | Origen | Justificación |
|---|---|---|---|
| REQ-01 | La unión pasa de siete a diez discriminantes: se añaden `point`, `asymptote` y `composite`. | Constitución 1.0.0, Principio III (C-02) | El núcleo debe cubrir como mínimo esos diez tipos antes de implementar. |
| REQ-02 | Se añade el bloqueo con error de configuración cuando falta gramática o normalización aprobada; no se infiere un resultado. | Constitución 1.0.0, Principio III | Evita elegir `incorrect` o `indeterminate` por defecto. |
| REQ-04 | Se precisa la taxonomía: `incomplete` es estado del cliente y error estructural; la API devuelve solo tres resultados. | Constitución 1.0.0, Principio V (C-03) | Separa resultado matemático, entrada incompleta y error técnico. |
| REQ-10 | Se declara el núcleo transversal a una aplicación web con el stack resuelto y sin motor de juego dedicado. | Constitución 1.0.0, Principios I y II (C-01, C-04) | Aclara la plataforma y la independencia de la UI sin ampliar el alcance funcional. |
| AC-01 | La verificación pasa de siete a diez discriminantes. | Consecuencia de REQ-01 | Mantiene la coherencia entre requisito y criterio. |
| REQ-13 / AC-12 | Se prohíbe la captura de respuestas matemáticas con cuadros de texto libre; se establecen controles gráficos para intervalos y un teclado virtual acotado para expresiones cortas. | Decisión explícita del Aprobador, 2026-11-16 | Reduce entradas ambiguas y conserva la validación del núcleo sobre datos estructurados. |

**Numeración vigente:** `001` corresponde al núcleo de validación y `002` queda reservado para el
futuro primer recorrido E01/E08. La antigua carpeta `001-primer-recorrido` fue eliminada y no debe
enlazarse como artefacto vigente.

## Aprobaciones

| Campo | Contenido |
|---|---|
| Etapa | Aprobación de contenido y alcance |
| Veredicto | Aprobado |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | Aprobación explícita de Edwin Ernesto Rodríguez Pérez, Aprobador principal (2026-11-16) |
| Versión o revisión | `spec.md`, versión de trabajo 0.3.0 |
| Condiciones | El Contrato de API debe actualizarse para alinearse con esta Spec; la aprobación documental no acredita implementación ni pruebas |

**Revisión de clarificación:** 2026-11-16, versión de trabajo 0.3.0. El contenido de esta Spec queda
aprobado por la autoridad indicada; la implementación y las pruebas siguen pendientes.

Este registro no sustituye el registro de aprobaciones de `specs/README.md` ni acredita aprobación de
contenido, implementación o pruebas.
