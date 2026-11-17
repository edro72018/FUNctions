# Research: Núcleo común de contratos y orquestación de validaciones

**Feature**: `001-nucleo-validacion` | **Fecha**: 2026-11-16 | **Estado**: propuesta para revisión

Este documento resuelve las decisiones técnicas necesarias para Phase 0. No implementa el núcleo,
no ejecuta validadores matemáticos y no convierte en ratificadas las decisiones que la spec dejó
pendientes. Las decisiones de consumidor (gramática de `expression`, asociaciones E02–E15, métricas,
logging, HTTP y mensajes) se mantienen como bloqueos explícitos.

## D-01. Fuente canónica del contrato compartido

**Decisión**: usar JSON Schema 2020-12 y YAML versionados en
`specs/001-nucleo-validacion/contracts/` como única fuente canónica. Los tipos TypeScript y Python se
escriben manualmente como espejos y se validan contra los esquemas y contra vectores compartidos. No
se genera código en v1.

**Rationale**: JSON Schema expresa la unión discriminada, los campos obligatorios, los patrones
numéricos y las restricciones de intervalo sin introducir un runtime compartido. YAML es adecuado
para reglas de normalización y catálogos que no se expresan bien como esquema. Los tipos manuales
evitan añadir generadores y pasos de build; las pruebas de contrato detectan la deriva entre lenguas.

**Alternativas consideradas**:

- **Generar tipos con `json-schema-to-typescript` y `datamodel-code-generator`**: reduce trabajo
  manual, pero añade dependencias y un paso de generación que debe aprobarse y mantenerse. Se puede
  reconsiderar si la deriva se vuelve frecuente.
- **Un paquete compartido de ejecución**: imposible sin un runtime común TypeScript/Python; forzaría
  un servicio adicional o duplicación de todos modos.
- **Solo documentos Markdown**: no permite validar ejemplos de forma automática y deja la gramática
  numérica ambigua.

## D-02. Representación exacta de números

**Decisión**: el contrato serializa los números como cadenas exactas. Acepta tres formas:

- entero: `^-?(0|[1-9][0-9]*)$`;
- decimal finito: `^-?(0|[1-9][0-9]*)\.[0-9]+$`;
- racional: `^-?(0|[1-9][0-9]*)/[1-9][0-9]*$`.

La normalización parsea a un racional exacto (`bigint` en TypeScript, `fractions.Fraction` en
Python), reduce la fracción, mueve el signo al numerador y normaliza el cero negativo. La forma
canónica interna es racional; la forma canónica serializada es entero si el denominador es 1 y, en
otro caso, `numerador/denominador`. No se usa punto flotante para comparar.

**Rationale**: los números JSON nativos no representan de forma exacta todos los decimales finitos y
mucho menos racionales como `1/3`. Las cadenas permiten una gramática explícita y una comparación
exacta. Aceptar tanto `"0.5"` como `"1/2"` cumple la decisión de la spec de admitir decimal finito
exacto y racional exacto.

**Alternativas consideradas**:

- **Números JSON (`0.5`)**: riesgo de redondeo binario y de perder la intención exacta; rechazado.
- **Solo cadenas racionales (`"1/2"`)**: excluye decimales finitos que la spec permite; rechazado.
- **Solo cadenas decimales**: no representa `1/3` ni otros racionales exactos; rechazado.
- **Notación científica, `+1`, `.5`, `1.`, coma decimal o signo Unicode**: no están aprobados por la
  gramática; se rechazan con error de formato hasta una decisión explícita.

## D-03. Modelo de `expression`

**Decisión**: `expression` se serializa como `{kind:"expression", tokens:[...]}`. Los tokens
permitidos son números sin ceros iniciales, `x`, `+`, `-`, `(`, `)`. No hay texto libre, `eval` ni
AST ejecutable. La gramática sintáctica de secuencias permanece bloqueada en v1; el despachador
devuelve `configuration`/`GRAMMAR_NOT_APPROVED` antes de invocar un validador, salvo que una spec
consumidora registre una gramática aprobada.

**Rationale**: la spec confirma el teclado virtual de tokens fijos y deja pendiente la gramática
sintáctica. Un arreglo de tokens conserva la estructura y evita interpretar una cadena libre. El
bloqueo con error de configuración cumple REQ-02/AC-12 y evita elegir `incorrect` o `indeterminate`
por defecto.

**Alternativas consideradas**:

- **Cadena de texto (`value: "2*x+1"`)**: prohibida por REQ-13 y por el teclado virtual; rechazada.
- **AST completo desde ahora**: la gramática no está aprobada; construir un AST sería una decisión
  semántica prematura.
- **Aceptar tokens y validar con una gramática genérica**: inventaría reglas no ratificadas.
- **Rechazar `expression` como tipo desconocido**: contradice la unión de diez tipos; se prefiere
  bloquear con error de configuración, que es el comportamiento exigido cuando falta gramática.

## D-04. Formas serializadas de los diez tipos

**Decisión**:

| Tipo | Forma canónica |
|---|---|
| `number` | `{kind:"number", value:"<cadena exacta>"}` |
| `expression` | `{kind:"expression", tokens:["<token>", ...]}` |
| `finiteSet` | `{kind:"finiteSet", values:["<exacto>", ...]}`; `values:[]` es el vacío explícito |
| `intervalUnion` | `{kind:"intervalUnion", intervals:[{lower:{value,inclusive}, upper:{value,inclusive}}, ...]}` |
| `mapping` | `{kind:"mapping", pairs:[["<entrada>","<salida>"], ...]}` |
| `boolean` | `{kind:"boolean", value:true|false}` |
| `vertex` | `{kind:"vertex", h:"<exacto>", k:"<exacto>"}` |
| `point` | `{kind:"point", x:"<exacto>", y:"<exacto>"}` |
| `asymptote` | `{kind:"asymptote", orientation:"horizontal"|"vertical", value:"<exacto>"}` |
| `composite` | `{kind:"composite", fields:{nombre:<respuesta tipada>, ...}}` |

Los campos `h`, `k`, `x`, `y`, `value`, los elementos de `values` y los pares de `mapping` usan la
cadena exacta de D-02, no un objeto `{kind:"number"}` anidado. `number` es el discriminante de una
respuesta numérica de nivel superior; sus campos internos son escalares exactos.

**Rationale**: la spec fija las formas `{h,k}`, `{x,y}`, `{orientation,value}` y pares
`[entrada,salida]`. Usar cadenas exactas en los campos evita anidar un discriminante donde la spec
solo pide un número y mantiene el contrato legible. La forma de intervalo con extremos anidados hace
explícitos valor y pertenencia, como exige REQ-07/AC-07.

**Alternativas consideradas**:

- **Anidar `{kind:"number", value:...}` en cada campo**: válido pero redundante y difícil de leer;
  la spec no lo exige.
- **Intervalos planos (`lower`, `upper`, `lowerInclusive`, `upperInclusive`)**: el Contrato de API
  inicial los usa, pero mezcla valor y pertenencia en el mismo nivel y dificulta la validación de
  infinitos; se prefiere la forma anidada.
- **Objetos `{input,output}` para `mapping`**: la spec confirma explícitamente pares
  `[entrada,salida]`; se actualiza el Contrato de API.
- **`values` como objeto o mapa**: no representa un conjunto sin orden ni duplicados de forma
  natural.

## D-05. Normalización de conjuntos, intervalos y pares

**Decisión**:

- `finiteSet`: comparar como conjunto completo; el orden es irrelevante y los duplicados se
  colapsan. `values:[]` es el vacío explícito. No se aceptan cadenas como `"∅"`, `"{}"` o `"empty"`
  dentro del contrato JSON; la UI puede mostrarlas, pero serializa `values:[]`.
- `intervalUnion`: validar cada intervalo; el infinito es siempre abierto; ordenar por extremo
  inferior y fusionar intervalos que se solapan o se tocan con al menos un extremo cerrado. `[]` es
  la unión vacía explícita. `ℝ\{3}` se normaliza a dos intervalos abiertos en 3.
- `mapping`: comparar como conjunto de pares; el orden y los duplicados idénticos no cambian la
  identidad. Si el mismo valor de entrada aparece con salidas distintas, se conservan ambos pares
  porque el tipo representa una relación, no una función.
- `composite`: cada campo se normaliza según su propio tipo; los campos obligatorios los declara el
  registro del Ejercicio. Un campo faltante es `incomplete`; un campo extra es `format`.

**Rationale**: la spec exige comparación completa, sin orden, con extremos explícitos y sin
inferencias. La regla de fusión con al menos un extremo cerrado evita unir `[1,2)` con `(2,3]` como
si 2 perteneciera al conjunto.

**Alternativas consideradas**:

- **Ordenar y comparar arreglos**: falla con conjuntos equivalentes en distinto orden.
- **Fusionar todo intervalo que se toque**: incorrecto si ambos extremos son abiertos.
- **Deduplicar pares por entrada**: perdería relaciones con múltiples salidas.
- **Aceptar alias textuales**: no hay lista ratificada de alias y la spec prohíbe inferir
  equivalencias; se limitan al JSON estructurado.

## D-06. Registro y despacho

**Decisión**: el núcleo expone un registro explícito `exerciseId -> {allowedKinds, requiredFields,
mechanisms, adapterId, validatorId, contractVersion}`. El despachador:

1. valida la solicitud y el `requestId`;
2. normaliza la respuesta;
3. comprueba que el Ejercicio esté registrado y que el tipo esté permitido;
4. resuelve el mecanismo solicitado o configurado (`local`/`api`);
5. invoca solo el adaptador registrado;
6. normaliza el resultado y conserva `origin` cuando corresponda;
7. devuelve un error si el mecanismo, el validador o la normalización fallan.

No hay valores por defecto, búsqueda por semejanza, primer validador disponible ni fallback
automático. El registro de producto comienza vacío en este núcleo; los consumidores registran sus
validadores. Las asociaciones E01→`boolean` y E08→`vertex` están ratificadas, pero sus validadores
matemáticos no se implementan aquí.

**Rationale**: REQ-05/AC-05 exigen selección explícita y error ante Ejercicio sin registro o tipo no
permitido. Un registro vacío impide que el núcleo invente asociaciones pendientes.

**Alternativas consideradas**:

- **Mapa hardcodeado E01–E15**: asignaría tipos no ratificados y duplicaría decisiones de las specs
  de Zona.
- **Selección por forma de la respuesta**: infiere la asociación por semejanza; prohibido.
- **Fallback automático local si la API falla**: prohibido por REQ-05/REQ-08.
- **Registro con valores por defecto**: produciría resultados sin contrato aprobado.

## D-07. Resultado, error y límites de transporte

**Decisión**: el resultado del núcleo es exactamente
`{status:"correct"|"incorrect"|"indeterminate", feedbackCode:string, origin?:"local"|"api"}`. El error
es `{category:"format"|"incomplete"|"unsupported"|"configuration"|"transport"|"service",
code:string, message:string}`. `message` es un mensaje técnico mínimo, no la presentación localizada;
`apiVersion`, códigos HTTP, logging y reintentos pertenecen al adaptador o al consumidor.

**Rationale**: REQ-04 y REQ-08 separan el resultado matemático de los errores. Un error de
transporte o servicio no puede convertirse en `incorrect`; `incomplete` no es un resultado. El
`feedbackCode` permite que la UI localice el mensaje sin meter texto de presentación en el núcleo.

**Alternativas consideradas**:

- **Incluir `message` y `apiVersion` en el resultado**: la spec los excluye explícitamente.
- **Usar códigos HTTP como categoría canónica**: acopla el núcleo local al transporte y rompe la
  paridad local/API.
- **Convertir errores en `indeterminate`**: oculta fallos técnicos; prohibido.
- **Catálogo cerrado de códigos en el esquema**: impediría añadir códigos de forma aditiva; se usa
  un catálogo propuesto y un patrón de formato.

## D-08. Estrategia de pruebas y verificación

**Decisión**: pruebas de contrato automatizadas más verificación manual documentada:

- esquemas válidos y ejemplos válidos/invalidos por tipo;
- vectores compartidos de normalización (números, conjuntos, intervalos, pares, compuestos);
- pruebas de despacho con un adaptador de prueba y un registro de prueba;
- prueba de arquitectura que prohíbe importar React, PixiJS, Mafs, LocalStorage, FastAPI y SymPy en
  el paquete del núcleo;
- pruebas de contrato de resultado/error y de ausencia de fallback;
- pruebas manuales de UI en las specs consumidoras para REQ-13/AC-12.

**Rationale**: la Constitución no exige pruebas automatizadas, pero la spec incluye AC verificables
de contrato, normalización y arquitectura. Automatizarlas reduce la deriva TS/Python sin convertir
las pruebas en una autorización de implementación.

**Alternativas consideradas**:

- **Solo pruebas manuales**: válido constitucionalmente, pero débil para comparar dos lenguajes y
  para evitar regresiones de esquema.
- **Pruebas end-to-end de UI en este módulo**: la UI y los controles gráficos pertenecen a las specs
  consumidoras; se verifican allí.
- **Cobertura de todos los validadores E01–E15**: fuera del alcance del núcleo.

## D-09. Alineación con el Contrato de API vigente

**Decisión**: los contratos de esta spec son la fuente canónica. Antes de implementar el adaptador
HTTP se actualizará `docs/politicas/contrato-api.md` para:

- cambiar `expression.value` por `tokens`;
- conservar `finiteSet.values` como nombre, con valores exactos y `values: []` para el vacío;
- cambiar intervalos planos por extremos anidados con `inclusive`;
- cambiar `mapping` de `{input,output}` a pares `[entrada,salida]`;
- cambiar el sobre de respuesta para que el resultado del núcleo sea
  `{status, feedbackCode, origin?}` y el adaptador añada metadatos de transporte fuera del núcleo;
- documentar que `requestId` es correlación, no idempotencia.

**Rationale**: la spec aprobada condiciona la alineación del Contrato de API. Los contratos de la
spec ya reflejan las decisiones confirmadas; el documento de referencia no debe seguir presentando
formas rivales.

**Alternativas consideradas**:

- **Mantener el contrato de API como fuente**: contradice la spec y el Principio III.
- **Actualizar el documento antes de generar los contratos**: el documento depende de las formas
  aprobadas; los contratos se generan primero y luego se alinea la referencia.
- **Ignorar la divergencia**: incumple la condición de aprobación de la spec.

## D-10. Límites operativos y decisiones que no se resuelven aquí

No se fijan umbrales de latencia, volumen, tamaño máximo de tokens, reintentos, logging, códigos HTTP
ni política de mensajes. La spec los deja pendientes y la Constitución prohíbe inventar métricas. El
plan solo establece que:

- el adaptador debe aplicar límites de tamaño y frecuencia antes de exponer la API;
- el núcleo no persiste ni registra datos personales;
- `requestId` es un UUID de correlación, no una credencial;
- cualquier límite concreto se aprueba en la spec del adaptador o en una enmienda de esta spec.

Tampoco se resuelven aquí la ratificación C01–C07, la política de compatibilidad/versionado entre
Specs, el propietario de validadores ni la cobertura inicial. `contractVersion` identifica la versión
consumida, pero no establece por sí mismo una política de compatibilidad.

## Resumen de decisiones

| ID | Decisión | Estado |
|---|---|---|
| D-01 | JSON Schema/YAML canónicos; tipos manuales; pruebas de contrato | Propuesta para el plan |
| D-02 | Números exactos como cadenas; racional interno; sin flotantes | Propuesta para el plan |
| D-03 | `expression` como tokens; gramática bloqueada | Propuesta para el plan; pendiente de consumidor |
| D-04 | Formas de los diez tipos | Propuesta para el plan |
| D-05 | Normalización de conjuntos, intervalos y pares | Propuesta para el plan |
| D-06 | Registro explícito y despacho sin fallback | Propuesta para el plan |
| D-07 | Resultado y error separados; transporte fuera del núcleo | Propuesta para el plan |
| D-08 | Pruebas de contrato, normalización, despacho y arquitectura | Propuesta para el plan |
| D-09 | Alinear el Contrato de API antes del adaptador HTTP | Condición de la spec |
| D-10 | Sin umbrales ni logging/HTTP inventados | Pendiente de consumidor |
