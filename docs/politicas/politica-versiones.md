# Política de versiones

**Estado:** estándar inicial propuesto para FUNctions.  
**Alcance:** aplicación web, cliente estático y API de cálculo.

## 1. Esquema de versiones

La versión del producto sigue **SemVer**: `MAJOR.MINOR.PATCH` (`X.Y.Z`).

- **MAJOR:** cambio incompatible en una interfaz pública, en el formato de Progreso local que impida su lectura o migración, o en el comportamiento anunciado del producto.
- **MINOR:** funcionalidad compatible nueva, como una zona, ejercicio o capacidad de API adicional.
- **PATCH:** corrección compatible que no altera el contrato ni el significado de ejercicios existentes.

Mientras el producto no haya declarado una versión estable, usar `0.MINOR.PATCH`: cambios incompatibles pueden incrementar `MINOR`. La publicación de `1.0.0` indica que el equipo acepta mantener compatibilidad conforme a esta política.

La versión del producto y la versión de la API son independientes. Las rutas públicas de API llevan versión (`/api/v1`); un cambio incompatible de contrato incrementa la versión mayor de API (`/api/v2`) y no se considera resuelto simplemente incrementando la versión de la aplicación.

## 2. Qué constituye un cambio incompatible

Un cambio es incompatible si un cliente conforme al contrato anterior deja de poder operar o interpreta resultados de manera distinta. Incluye, entre otros:

- eliminar o renombrar rutas, campos, códigos de error o valores de enumeración documentados;
- convertir un campo opcional en obligatorio, cambiar su tipo o cambiar unidades/semántica;
- retirar una forma de respuesta aceptada o alterar silenciosamente la interpretación de un ejercicio;
- cambiar el formato de Progreso local sin migración compatible;
- cambiar el resultado esperado de un ejercicio ya publicado sin anunciar corrección editorial y actualizar sus pruebas.

Agregar un campo opcional, un endpoint independiente o un nuevo identificador de Ejercicio es compatible si los clientes existentes pueden ignorarlo y el significado previo no cambia.

Los cambios solo de contenido que corrigen una errata matemática deben registrarse en el historial de cambios, identificar los ejercicios afectados y actualizar las pruebas de referencia. Si invalidan progreso guardado o integraciones existentes, se tratan como incompatibles.

## 3. Versionado de API y relación con su contrato

El contrato normativo está en el [Contrato de API](./contrato-api.md). Todo cambio de API debe clasificarse y revisarse contra ese documento:

| Tipo de cambio | Ejemplo | Versión requerida |
|---|---|---|
| Compatible | Campo opcional nuevo o nuevo Ejercicio sin modificar los anteriores | MINOR de API/documentación; misma ruta mayor |
| Corrección compatible | Corregir una respuesta HTTP que contradice el contrato | PATCH del servicio; misma ruta mayor |
| Incompatible | Eliminar un campo o cambiar su tipo o semántica | Nueva ruta mayor, migración y periodo de convivencia |

No añadir cambios incompatibles a `/api/v1`. Para retirar una versión, anunciar fecha y alcance, marcarla como obsoleta en documentación y respuestas, publicar la versión sustituta y mantener ambas durante el periodo de migración acordado.

**Suposición inicial:** como no hay clientes externos ni plazo de soporte acordado, una versión mayor obsoleta se mantiene activa al menos durante una publicación estable completa o 90 días desde el anuncio, lo que sea mayor. El responsable del producto debe confirmar o reemplazar este plazo antes de publicar `1.0.0`.

## 4. Ramas y flujo de publicación

**Modelo asumido:** flujo ligero de ramas basado en `main`.

- `main` contiene cambios integrados y potencialmente publicables.
- El trabajo se desarrolla en ramas cortas `feature/<tema>`, `fix/<tema>` o `docs/<tema>`.
- Integrar mediante solicitud de cambio revisada; no desarrollar directamente sobre `main`.
- Crear etiquetas `vX.Y.Z` para publicaciones del producto. Si la API se publica por separado, etiquetar también su versión de servicio y mantener la ruta mayor indicada en el contrato.
- Las ramas de mantenimiento `release/X.Y` solo se crean si el equipo debe sostener versiones paralelas; no se mantienen por defecto.
- Las correcciones urgentes se aplican primero a la rama soportada y se integran de vuelta a `main`.

Las etiquetas no sustituyen las pruebas. No publicar una versión con fallos conocidos que afecten el propósito educativo, la corrección de respuestas o el acceso al juego.

## 5. Publicación y notas de versión

Cada publicación debe:

1. pasar las comprobaciones automáticas y revisión requeridas por la [Guía de convenciones de código](./convenciones-codigo.md);
2. identificar la versión del producto y, si aplica, la versión de API;
3. incluir notas con cambios, correcciones, ejercicios afectados, cambios incompatibles, migraciones y problemas conocidos;
4. declarar claramente si el cliente publicado funciona en modo conectado con FastAPI o en Modo estático con respuestas precalculadas;
5. verificar el acceso público y el recorrido relevante después del despliegue.

No presentar el Modo estático como si hubiera ejecutado validaciones de FastAPI/SymPy. Documentar qué validadores locales se incluyeron y cualquier diferencia conocida.

## 6. Deprecaciones y soporte

- Una función o ruta solo puede declararse obsoleta mediante aviso en el contrato, notas de versión y documentación para desarrolladores.
- El aviso debe indicar reemplazo, fecha objetivo de retiro y consecuencias para el cliente.
- Durante la convivencia, la función obsoleta debe seguir comportándose según su contrato, salvo que represente un riesgo operativo o de seguridad que exija retiro urgente; la excepción debe documentarse.
- **Suposición inicial de soporte:** la última versión estable es la única con soporte ordinario. La versión anterior puede recibir correcciones críticas durante el periodo de convivencia de API indicado arriba. Los lanzamientos `0.x` se mantienen con best effort, sin garantía de soporte.
- No se promete SLA, disponibilidad ni soporte prolongado mientras el equipo y el despliegue no hayan definido responsables y capacidad operativa.

## 7. Progreso local

Los datos de LocalStorage se tratan como un formato persistente del cliente. El objeto de progreso debe llevar una versión de esquema. Un cambio compatible conserva la lectura; un cambio incompatible debe incluir una migración determinista o descartar solo los datos que ya no se puedan interpretar, con aviso claro al usuario. No borrar progreso silenciosamente por un cambio de versión.
