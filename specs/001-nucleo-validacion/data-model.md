# Data Model: Núcleo común de contratos y orquestación de validaciones

**Feature**: `001-nucleo-validacion` | **Fecha**: 2026-11-16 | **Estado**: diseño para revisión

Este modelo describe los datos del núcleo, no la implementación de los validadores ni la UI. Las
formas serializadas se formalizan en [`contracts/`](./contracts/); las reglas de normalización se
detallan en [`contracts/normalization.yaml`](./contracts/normalization.yaml).

## Convenciones generales

- Los datos viajan como JSON; los nombres de campos usan `camelCase`.
- Los números matemáticos se serializan como cadenas exactas (`exactNumber`), nunca como números
  JSON de punto flotante.
- Una respuesta siempre declara `kind`; el núcleo no infiere el tipo por el texto ni por la forma
  del valor.
- Una respuesta parcial es un error `incomplete`, no un resultado matemático.
- `requestId` es un UUID de correlación; no es credencial y no aporta idempotencia.
- El resultado matemático y el error son objetos distintos; no se mezclan campos.
- No se persisten datos del estudiante en el núcleo.

## Entidades

### 1. `ValidationRequest`

Solicitud común que recibe el despachador.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `requestId` | string UUID | Sí | Correlación; no se deduplica ni se garantiza idempotencia. |
| `exerciseId` | string | Sí | Patrón `^E(0[1-9]|1[0-5])$`. |
| `answer` | `Answer` | Sí | Unión discriminada de diez tipos. |
| `mechanism` | `"local" \| "api"` | No | Si falta, se usa el mecanismo configurado; si no hay configuración, error `configuration`. |

**Invariantes**:

- El `exerciseId` debe estar registrado y el `kind` debe estar permitido por ese registro.
- La selección de mecanismo es explícita; no hay fallback automático.
- El `requestId` se conserva para correlación, pero el núcleo no lo usa como clave de idempotencia.

### 2. `Answer`

Unión discriminada por `kind`. Las formas concretas son:

| `kind` | Campos | Regla de normalización |
|---|---|---|
| `number` | `value: exactNumber` | Parsear a racional exacto; reducir; cero canónico. |
| `expression` | `tokens: string[]` | Solo tokens permitidos; gramática bloqueada hasta aprobación. |
| `finiteSet` | `values: exactNumber[]` | Colapsar duplicados; orden irrelevante; `[]` es vacío explícito. |
| `intervalUnion` | `intervals: Interval[]` | Ordenar, fusionar y validar extremos; infinito abierto. |
| `mapping` | `pairs: [exactNumber, exactNumber][]` | Conjunto de pares; orden y duplicados irrelevantes. |
| `boolean` | `value: boolean` | Solo `true`/`false` JSON; no cadenas. |
| `vertex` | `h: exactNumber`, `k: exactNumber` | Coordenadas exactas; asociación E08 ratificada. |
| `point` | `x: exactNumber`, `y: exactNumber` | Par ordenado exacto. |
| `asymptote` | `orientation`, `value: exactNumber` | `horizontal`/`vertical`; `y=0` ≠ `x=0`. |
| `composite` | `fields: Record<string, Answer>` | Campos tipados; obligatoriedad por Ejercicio. |

#### `exactNumber`

Cadena que representa un entero, un decimal finito o un racional exacto:

- entero: `^-?(0|[1-9][0-9]*)$`
- decimal finito: `^-?(0|[1-9][0-9]*)\.[0-9]+$`
- racional: `^-?(0|[1-9][0-9]*)/[1-9][0-9]*$`

Se rechazan exponentes, `+` inicial, ceros iniciales, punto final, denominador cero, coma decimal y
signo Unicode mientras no exista una decisión que los apruebe. La representación interna es un
racional exacto; la comparación es exacta.

#### `Interval`

| Campo | Tipo | Regla |
|---|---|---|
| `lower` | `Bound` | Extremo inferior; valor `-inf` o exacto. |
| `upper` | `Bound` | Extremo superior; valor `+inf` o exacto. |

`Bound`:

| Campo | Tipo | Regla |
|---|---|---|
| `value` | `exactNumber \| "-inf" \| "+inf"` | `-inf` solo en `lower`; `+inf` solo en `upper`. |
| `inclusive` | boolean | Si el valor es infinito, debe ser `false`. |

**Invariantes**:

- `lower.value <= upper.value`; si son iguales, el intervalo solo contiene ese punto cuando ambos
  extremos son cerrados.
- La unión se ordena por extremo inferior y se fusiona cuando hay solapamiento o contacto con al
  menos un extremo cerrado.
- `[]` es la unión vacía explícita; no se confunde con un campo ausente.
- `ℝ\{3}` se normaliza a `(-inf,3) ∪ (3,+inf)`.

#### `Composite`

- `fields` es un objeto no vacío de `nombre -> Answer`.
- Los nombres de campo no se reinterpretan; los campos obligatorios los declara el registro del
  Ejercicio.
- Campo faltante: error `incomplete` (`MISSING_COMPOSITE_FIELD`).
- Campo extra: error `format` (`EXTRA_COMPOSITE_FIELD`).
- Un campo interno se normaliza según su propio `kind`.

### 3. `ValidatorRegistration`

Registro explícito que usa el despachador.

| Campo | Tipo | Regla |
|---|---|---|
| `exerciseId` | string | `E01`–`E15`; una entrada por Ejercicio. |
| `allowedKinds` | `AnswerKind[]` | Tipos permitidos; no se infieren. |
| `requiredFields` | `string[]` | Solo para `composite`; nombres obligatorios. |
| `mechanisms` | `("local" \| "api")[]` | Mecanismos disponibles. |
| `adapterId` | string | Referencia al adaptador; no contiene lógica matemática en el núcleo. |
| `validatorId` | string | Identificador del validador consumidor. |
| `contractVersion` | string | Versión del contrato consumido; la política de compatibilidad entre Specs sigue pendiente. |
| `associationStatus` | `"ratified" \| "proposed" \| "pending"` | Estado de la asociación Ejercicio→tipo. |

**Reglas**:

- El registro de producto comienza vacío en este núcleo. E01→`boolean` y E08→`vertex` están
  ratificados, pero sus validadores pertenecen a las specs consumidoras.
- Un Ejercicio sin registro produce `unsupported`/`EXERCISE_NOT_REGISTERED`.
- Un `kind` no permitido produce `unsupported`/`TYPE_NOT_ALLOWED`.
- Un mecanismo no configurado produce `configuration`/`MECHANISM_NOT_CONFIGURED`.
- No existe un registro por defecto ni búsqueda por semejanza.

### 4. `ValidationResult`

Resultado matemático del núcleo.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `status` | `"correct" \| "incorrect" \| "indeterminate"` | Sí | Exactamente uno. |
| `feedbackCode` | string | Sí | Código estable del catálogo; presentación fuera del núcleo. |
| `origin` | `"local" \| "api"` | No | Se conserva cuando el consumidor lo requiere. |

**Invariantes**:

- `incomplete` no es un `status`.
- `message` y `apiVersion` no forman parte de este objeto.
- Un fallo de transporte/servicio se representa como `ValidationError`, no como `incorrect`.
- Un validador que no puede decidir devuelve `indeterminate`, no `incorrect`.

### 5. `ValidationError`

Error estructural, de configuración o técnico.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `category` | `"format" \| "incomplete" \| "unsupported" \| "configuration" \| "transport" \| "service"` | Sí | Categoría explícita. |
| `code` | string | Sí | Código estable del catálogo; patrón `^[A-Z][A-Z0-9_]*$`. |
| `message` | string | Sí | Mensaje técnico mínimo; no es la presentación localizada. |

**Invariantes**:

- No se mezcla con `ValidationResult`.
- No se convierte en `incorrect` ni en `indeterminate`.
- El mapeo HTTP, logging y reintentos se resuelven en el adaptador/consumidor.

### 6. `FeedbackCode`

Entrada del catálogo de retroalimentación.

| Campo | Tipo | Regla |
|---|---|---|
| `code` | string | Patrón `^[A-Z][A-Z0-9_]*$`. |
| `status` | `correct \| incorrect \| indeterminate` | Estado compatible. |
| `description` | string | Propósito del código; no es el mensaje de UI. |

El catálogo inicial es aditivo y propuesto. Un código desconocido no autoriza a inferir el estado.

### 7. `ErrorCode`

Entrada del catálogo de errores.

| Campo | Tipo | Regla |
|---|---|---|
| `code` | string | Patrón `^[A-Z][A-Z0-9_]*$`. |
| `category` | categoría de error | Debe coincidir con la del error emitido. |
| `description` | string | Condición que lo produce. |
| `invokeValidator` | boolean | `false` para errores estructurales/configuración. |

## Estados y transiciones

```text
RECIBIDA
  ├─ estructura inválida ───────────────► ERROR format
  ├─ campo obligatorio ausente ─────────► ERROR incomplete
  └─ estructura válida
       └─ NORMALIZADA
            ├─ gramática/normalización no aprobada ─► ERROR configuration
            ├─ ejercicio no registrado ──────────────► ERROR unsupported
            ├─ tipo no permitido ────────────────────► ERROR unsupported
            ├─ mecanismo no configurado ─────────────► ERROR configuration
            └─ DESPACHADA
                 ├─ validador decide ────────────────► RESULTADO
                 │    ├─ correct
                 │    ├─ incorrect
                 │    └─ indeterminate
                 ├─ fallo de transporte ─────────────► ERROR transport
                 └─ fallo de servicio/validador ─────► ERROR service
```

No hay transición desde un error a un resultado ni desde un resultado a otro estado. No hay
transición automática de `api` a `local`.

## Reglas de normalización

| Tipo | Regla |
|---|---|
| `number` | Parsear exacto; reducir; signo en numerador; cero canónico; sin tolerancia. |
| `expression` | Validar tokens permitidos; si la gramática no está aprobada, `configuration`; no invocar validador. |
| `finiteSet` | Colapsar duplicados; ordenar para una forma determinista; `[]` explícito. |
| `intervalUnion` | Validar extremos; infinito abierto; ordenar; fusionar; `[]` explícito. |
| `mapping` | Conjunto de pares; ordenar; colapsar duplicados idénticos; conservar entradas con salidas distintas. |
| `boolean` | Solo booleano JSON. |
| `vertex` | `h`, `k` exactos; sin redondeo. |
| `point` | `x`, `y` exactos; sin redondeo. |
| `asymptote` | `orientation` y `value` exactos; sin equivalencia entre ejes. |
| `composite` | Normalizar cada campo; aplicar obligatoriedad del registro; faltante `incomplete`, extra `format`. |

## Invariantes del núcleo

1. Ninguna respuesta se clasifica por inferencia textual o por semejanza matemática.
2. Ningún error técnico se convierte en resultado matemático.
3. Ningún tipo con gramática/normalización no aprobada produce `correct`, `incorrect` o
   `indeterminate`.
4. Ningún Ejercicio sin registro usa un validador por defecto.
5. Ningún cambio de mecanismo ocurre sin solicitud/configuración explícita.
6. La comparación numérica es exacta; no se usa tolerancia global.
7. El núcleo no importa UI, persistencia, autenticación, FastAPI ni SymPy.

## Asociaciones Ejercicio→tipo

| Ejercicio | Tipo | Estado | Uso en este núcleo |
|---|---|---|---|
| E01 | `boolean` | Ratificado 2026-11-16 | Forma disponible; validador fuera del núcleo. |
| E08 | `vertex` | Ratificado 2026-11-16 | Forma `{h,k}` disponible; validador fuera del núcleo. |
| E02/E03 | `mapping` | Pendiente | No se registra por defecto. |
| E04–E07, E10–E11, E13 | `intervalUnion` / otras | Pendiente | No se registra por defecto. |
| E09, E12, E14, E15 | Pendiente | Pendiente | No se registra por defecto. |

La tabla no crea asociaciones nuevas. Cada spec consumidora debe declarar la asociación, el tipo y
los campos obligatorios antes de registrar un validador.

## Trazabilidad

| Entidad/regla | Requisitos |
|---|---|
| `ValidationRequest`, `requestId` | REQ-03, AC-02 |
| `Answer` de diez tipos | REQ-01, REQ-02, AC-01 |
| `number` exacto | REQ-07, AC-07 |
| `expression` bloqueada | REQ-02, REQ-13, AC-12 |
| `finiteSet`, `intervalUnion`, `mapping` | REQ-07, AC-07 |
| `composite` | REQ-12, AC-11 |
| `ValidationResult` | REQ-04, AC-03, AC-04 |
| `ValidationError` | REQ-08, AC-04, AC-05 |
| Registro y despacho | REQ-05, AC-05 |
| Origen local/API | REQ-06, AC-06 |
| Independencia de UI/stack | REQ-09, REQ-10, AC-08 |
| Asociaciones pendientes | REQ-11, AC-09, AC-10 |
