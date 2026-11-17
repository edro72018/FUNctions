# Contrato de API

**Estado:** contrato inicial propuesto; las rutas y formas de datos deben implementarse y probarse antes de anunciar una API desplegada.  
**Versión de API:** `/api/v1`.  
**Consumidor:** aplicación React/TypeScript; no se requieren cuentas de usuario en el alcance actual.

## 1. Principios

- La API valida respuestas del banco cerrado de FUNctions; no es una calculadora simbólica pública.
- El cliente envía `exerciseId`, `answer` y `requestId`; no envía código Python ni expresiones SymPy para ejecución arbitraria.
- FastAPI valida el formato; el servicio matemático verifica el contenido compatible con SymPy y responde un estado explícito.
- PixiJS representa la Zona 1 y Mafs las Zonas 2–5; ambos motores son de presentación/interacción, no autoridad de validación.
- La API no guarda Progreso local. LocalStorage es propiedad del navegador.
- En Modo estático, el cliente puede usar validadores del banco precalculados. Debe informar si la solicitud falló y si el resultado proviene del backend o del fallback local.

Las definiciones de **Ejercicio**, **Validador**, **Estado indeterminado**, **Modo conectado** y **Modo estático** se encuentran en el [Glosario único](./glosario.md).

## 2. Transporte y formato

- Transporte: HTTPS en producción; JSON UTF-8.
- Prefijo: `/api/v1`.
- Los clientes deben enviar `Content-Type: application/json` en solicitudes con cuerpo.
- Los identificadores y campos del contrato usan `camelCase`.
- La API no debe incluir trazas, detalles internos de SymPy ni secretos en respuestas públicas.
- Todos los tiempos son fechas RFC 3339 en UTC si se incorporan a una futura respuesta.

## 3. Endpoints

### 3.1 Comprobación de disponibilidad

`GET /api/v1/health`

Respuesta `200 OK`:

```json
{
  "status": "ok",
  "apiVersion": "v1"
}
```

Se limita a informar que el proceso responde. No garantiza por sí sola disponibilidad del servicio matemático ni del sitio estático.

### 3.2 Validación de respuesta

`POST /api/v1/answers/validate`

Solicitud:

```json
{
  "requestId": "c1e49b67-8be8-4caf-9ea1-a593d9cdbfc5",
  "exerciseId": "E09",
  "answer": {
    "kind": "finiteSet",
    "values": ["-3", "3"]
  }
}
```

`requestId` es un UUID generado por el cliente para correlacionar una solicitud con su respuesta y registros técnicos; no es una credencial. `exerciseId` debe pertenecer al banco publicado (`E01`–`E15`). `answer` es una unión discriminada y limitada por el tipo de respuesta de ese Ejercicio. La API debe rechazar tipos no admitidos por el Ejercicio correspondiente.

Formas iniciales admitidas para `answer`:

```json
{ "kind": "number", "value": "3/2" }
{ "kind": "expression", "value": "2*x + 1" }
{ "kind": "finiteSet", "values": ["-3", "3"] }
{ "kind": "intervalUnion", "intervals": [
  { "lower": "-inf", "upper": "0", "lowerInclusive": false, "upperInclusive": false },
  { "lower": "0", "upper": "+inf", "lowerInclusive": true, "upperInclusive": false }
] }
{ "kind": "mapping", "pairs": [
  { "input": "1", "output": "2" }
] }
```

Las cadenas numéricas representan valores exactos y deben seguir una gramática limitada definida por el validador; no se interpretan como código. Las cadenas `-inf` y `+inf` solo se aceptan como límites de intervalo. Para un tipo nuevo, actualizar primero este contrato y las pruebas de compatibilidad.

Respuesta `200 OK`:

```json
{
  "requestId": "c1e49b67-8be8-4caf-9ea1-a593d9cdbfc5",
  "exerciseId": "E09",
  "result": "correct",
  "feedbackCode": "ANSWER_MATCHES",
  "message": "La respuesta es correcta.",
  "apiVersion": "v1"
}
```

Valores permitidos de `result`:

- `correct`: la respuesta cumple completamente el criterio del Ejercicio.
- `incorrect`: el validador pudo decidir y la respuesta no cumple el criterio.
- `indeterminate`: el validador no pudo decidir dentro de su alcance; no equivale a incorrecta.

`feedbackCode` es una clave estable para la interfaz. `message` es texto legible y no sustituye la clave estable. Los valores nuevos de `feedbackCode` son aditivos; los consumidores deben tolerar códigos desconocidos mostrando un mensaje genérico.

## 4. Errores HTTP

Para errores HTTP se usa esta forma:

```json
{
  "error": {
    "code": "INVALID_ANSWER",
    "message": "La respuesta no tiene el formato esperado.",
    "requestId": "c1e49b67-8be8-4caf-9ea1-a593d9cdbfc5",
    "details": []
  }
}
```

| HTTP | `error.code` | Uso |
|---|---|---|
| `400` | `INVALID_REQUEST` | JSON mal formado o combinación de campos inválida |
| `404` | `EXERCISE_NOT_FOUND` | Identificador de Ejercicio no publicado |
| `422` | `INVALID_ANSWER` | Forma válida como JSON, pero tipo o valor no admitido por el esquema del Ejercicio |
| `429` | `RATE_LIMITED` | Límite operativo de solicitudes superado |
| `500` | `INTERNAL_ERROR` | Error inesperado del servidor |
| `503` | `VALIDATOR_UNAVAILABLE` | Servicio de validación no disponible temporalmente |

`details` es una lista opcional de errores de campo; nunca debe contener trazas, código ejecutable ni datos internos del motor. El backend no debe devolver `200` con un objeto de error ni convertir una falla interna en `incorrect`.

## 5. Paginación

Los endpoints actuales son de estado y validación singular, por lo que no se paginan. Si se agrega un endpoint de listado de ejercicios, debe usar cursor opaco (`limit` con máximo documentado y `cursor` opcional), orden determinista por `exerciseId` y una forma de respuesta documentada con `items` y `nextCursor`. No agregar paginación a una ruta existente cambiando silenciosamente su forma.

## 6. Autenticación, privacidad y disponibilidad

**Suposición explícita:** el juego es público, anónimo y sin cuentas; los endpoints `health` y `answers/validate` no requieren autenticación. La ausencia de autenticación no implica que se permita ejecución ilimitada: el despliegue debe aplicar límites razonables de tamaño, frecuencia y complejidad de las entradas.

No enviar nombres, correos, credenciales ni progreso personal a la API. `requestId` sirve solo para correlación. Si se incorpora autenticación o almacenamiento de progreso en servidor, es un cambio de alcance que requiere revisión de privacidad y nueva versión del contrato cuando altere clientes.

## 7. Compatibilidad y evolución

- La ruta mayor `/api/v1` permanece compatible durante su soporte.
- Los clientes deben ignorar campos opcionales desconocidos y tolerar códigos de retroalimentación nuevos.
- No eliminar ni cambiar tipos/campos existentes en `v1`; retirar o alterar una interfaz requiere `/api/v2`.
- Para cambios compatibles, agregar primero documentación y pruebas, después implementar cliente y servidor.
- Para cambios incompatibles, publicar migración, periodo de convivencia y fecha de retiro según la [Política de versiones](./politica-versiones.md).

## 8. Tiempos de cálculo y modo estático

La validación debe limitar el tamaño y las familias de expresiones admitidas. Si un cálculo no termina o SymPy no puede decidir, responder `200` con `result: "indeterminate"` solo cuando el servidor haya concluido normalmente que no puede decidir. Si el servicio está indisponible o falla, usar `503` o `500` según corresponda.

En el Modo estático, una respuesta local exitosa se identifica en la interfaz como resultado local; no falsifica un `requestId` ni una respuesta de API. Los validadores estáticos se limitan a los Ejercicios publicados y deben tener casos de referencia equivalentes a los usados para el backend.

**Pendiente de implementación:** los esquemas definitivos por Ejercicio, el máximo de cuerpo, límites de complejidad, política de CORS y cuotas de frecuencia deben concretarse en configuración y pruebas antes del despliegue. Los valores operativos no se inventan en este contrato.
