# Validation Consumer Contract: E01 y E08

**Feature**: `002-primer-recorrido` | **Fecha**: 2026-11-16 | **Estado**: contrato para revisión

Este contrato define cómo el primer recorrido consume el núcleo de
[`001-nucleo-validacion`](../../001-nucleo-validacion/spec.md), cómo selecciona el mecanismo local o API,
cómo etiqueta el origen y cómo trata los fallos. No redefine los esquemas de 001 y no implementa un
backend nuevo.

## 1. Frontera

```text
React (002)
  └─ ValidationGateway
       ├─ LocalValidationGateway ──► frontend/src/shared/validation/ (001)
       │                              └─ validadores E01/E08 de 002
       └─ ApiValidationGateway ─────► POST a un endpoint ya configurado
                                       └─ ValidationRequest/Result/Error de 001
```

La UI no importa HTTP, el despachador de 001 ni los validadores. Solo conoce
`ValidationGateway`, el resultado, el origen y el error técnico.

## 2. Selección explícita del mecanismo

`AppConfig.validationMechanism` es `"local"` o `"api"`. Se fija al arrancar la aplicación y no cambia
durante una solicitud.

| Configuración | Comportamiento |
|---|---|
| `local` | Usa `LocalValidationGateway`; el origen es `local` |
| `api` | Usa `ApiValidationGateway`; el origen es `api` |
| `api` sin URL configurada | Error técnico de configuración; no se usa el validador local |
| Valor ausente o inválido | Error de configuración visible; no se elige un mecanismo por inferencia |

No hay fallback automático. Cambiar de mecanismo requiere una acción explícita y no forma parte de la
UI de este corte.

## 3. Solicitud

Se usa el esquema canónico
[`request.schema.json`](../../001-nucleo-validacion/contracts/request.schema.json). El `requestId` es un
UUID de correlación; no es credencial ni idempotencia.

### 3.1 E01

```json
{
  "requestId": "2f8c6d1a-4b3e-4f5a-9c7d-1e2f3a4b5c6d",
  "exerciseId": "E01",
  "answer": {
    "kind": "boolean",
    "value": true
  },
  "mechanism": "local"
}
```

`value: true` significa «Es función». `value: false` significa «No es función».

### 3.2 E08

```json
{
  "requestId": "7a1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5d",
  "exerciseId": "E08",
  "answer": {
    "kind": "vertex",
    "h": "3",
    "k": "2"
  },
  "mechanism": "api"
}
```

`a = 1` es fijo y no forma parte del esquema `vertex`; el ejercicio lo declara como restricción. Los
valores `h` y `k` usan la gramática `exactNumber`; no se envían números JSON de punto flotante.

## 4. Resultado

Se usa el esquema canónico
[`result.schema.json`](../../001-nucleo-validacion/contracts/result.schema.json):

```json
{
  "status": "correct",
  "feedbackCode": "E08_VERTEX_CONFIRMED",
  "origin": "api"
}
```

| Campo | Valores | Uso en 002 |
|---|---|---|
| `status` | `correct`, `incorrect`, `indeterminate` | Estado matemático; nunca `incomplete` |
| `feedbackCode` | Código estable | Selecciona el diagnóstico localizado |
| `origin` | `local`, `api` | Etiqueta visible del resultado; no se persiste |

`origin` se verifica contra el gateway que produjo el resultado. Si un gateway local devuelve
`origin: "api"`, se trata como error de contrato y se muestra error técnico; no se corrige en
silencio. Lo mismo aplica al caso inverso.

## 5. Errores

Se usa el esquema canónico
[`error.schema.json`](../../001-nucleo-validacion/contracts/error.schema.json). Un error no es un
resultado matemático.

| Categoría | Ejemplo | Presentación |
|---|---|---|
| `format` | `INVALID_ANSWER` | Error técnico de formato; no `incorrect` |
| `incomplete` | `MISSING_COMPOSITE_FIELD` | `incomplete` del cliente si falta un campo obligatorio |
| `unsupported` | `EXERCISE_NOT_REGISTERED` | Error técnico de configuración |
| `configuration` | `MECHANISM_NOT_CONFIGURED` | Error técnico de configuración |
| `transport` | `TRANSPORT_ERROR` | Error técnico de red; borrador intacto |
| `service` | `SERVICE_UNAVAILABLE` | Error técnico del servicio; borrador intacto |

Un `4xx`, `5xx`, cuerpo inválido o fallo de red se presenta como error técnico. No se convierte en
`incorrect`, no se reintenta automáticamente y no se activa el validador local.

## 6. Códigos de retroalimentación del consumidor

001 permite códigos aditivos con el patrón `^[A-Z][A-Z0-9_]*$`. 002 usa:

| Código | Ejercicio | Estado | Diagnóstico |
|---|---|---|---|
| `E01_FUNCTION_CONFIRMED` | E01 | `correct` | Cada entrada tiene una única imagen; compartir la salida 4 es válido |
| `E01_SHARED_IMAGE_VALID` | E01 | `incorrect` | Varios cables pueden llegar al mismo nodo; lo prohibido es que una entrada tenga dos imágenes |
| `E08_VERTEX_CONFIRMED` | E08 | `correct` | El vértice es `(3, 2)` con `a = 1` |
| `E08_VERTEX_SIGN` | E08 | `incorrect` | En `(x − h)`, `(x − 3)` significa `h = +3` |
| `E08_VERTEX_MISMATCH` | E08 | `incorrect` | El vértice o los parámetros no coinciden con `(3, 2)` |

Un código desconocido no autoriza a inventar un diagnóstico. Se muestra un mensaje genérico y se
conserva el estado matemático.

## 7. Reglas de E01 y E08

### 7.1 E01

- `selection === null` → `incomplete`; no se envía.
- `value: true` → `correct`.
- `value: false` → `incorrect` con `E01_SHARED_IMAGE_VALID`.
- El par compartido en la salida 4 no viola la unicidad.
- No se evalúa la operación de conectar ni desconectar.

### 7.2 E08

- `h` o `k` vacío/no parseable → `incomplete`; no se envía.
- `h = 3` y `k = 2` → `correct` con `E08_VERTEX_CONFIRMED`.
- `h = -3` → `incorrect` con `E08_VERTEX_SIGN`.
- `h = 2.99`, `h ≠ 3` o `k ≠ 2` → `incorrect` con `E08_VERTEX_MISMATCH`.
- No hay tolerancia; el redondeo es solo visual.
- `a = 1` es fijo; no se acepta otra `a`.

## 8. Correlación y respuestas tardías

- Cada Probar con respuesta completa crea un `requestId`.
- Durante `pending` solo existe una solicitud vigente por ejercicio.
- Una respuesta solo se aplica si su `requestId` coincide con la solicitud vigente y la generación
  del ejercicio no cambió.
- Una respuesta anterior se descarta sin cambiar el estado, el progreso ni el origen.
- Cambiar de ejercicio abandona la solicitud e incrementa la generación.
- El origen no se guarda; tras recargar no se muestra un resultado anterior como validación nueva.

## 9. Adaptador API

- Método: `POST`.
- Cuerpo: `ValidationRequest` de 001.
- Respuesta `2xx`: `ValidationResult` o `ValidationError` válido.
- Respuesta no `2xx`: error técnico; no se interpreta como resultado.
- URL: configurada explícitamente; no se inventa un host ni un despliegue.
- Tiempo límite: `AbortController` con 10 segundos configurables. Es una condición de fallo, no una
  métrica de rendimiento.
- Sin reintentos automáticos. «Reintentar» es una acción de la persona.
- Sin fallback local.

El endpoint pertenece a un servicio ya existente o a un incremento posterior. 002 no crea rutas,
modelos ni dependencias de backend.

## 10. Adaptador local

- Usa el despachador de `frontend/src/shared/validation/`.
- Registra E01 con `boolean` y E08 con `vertex`.
- Los validadores de E01/E08 viven en `frontend/src/features/exercises/` y son funciones puras.
- El adaptador conserva `requestId`, `exerciseId` y el origen `local`.
- Un error del validador se propaga como `ValidationError`; no se convierte en `incorrect`.

## 11. Trazabilidad

| Regla | Requisitos | Criterios |
|---|---|---|
| Mecanismo explícito y origen | REQ-17 | AC-17 |
| Sin fallback silencioso | REQ-17 | AC-17, AC-15 |
| E01 `boolean` | REQ-13 | AC-13 |
| E08 `vertex` exacto | REQ-13, REQ-14 | AC-14 |
| `incomplete` del cliente | REQ-14 | AC-13, AC-14 |
| Error técnico separado | REQ-14 | AC-15 |
| Respuesta tardía descartada | REQ-17 | AC-15, AC-17 |
