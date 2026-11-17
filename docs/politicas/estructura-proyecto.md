# Estructura definitiva del proyecto

**Estado:** estructura canónica para FUNctions. Todo el código, las especificaciones y la documentación técnica del producto se organizan dentro de `development/`.  
**Stack:** React/TypeScript; PixiJS en Zona 1; Mafs en Zonas 2–5; FastAPI/SymPy; LocalStorage.
**Metodología:** Spec-Driven Development (SDD).

## 1. Criterios de organización

1. El código vive en la capa que posee la responsabilidad, no donde resulte más cómodo importarlo.
2. Las cinco Zonas son módulos de producto; las capas transversales (API, progreso local, navegación y tipos compartidos) no se duplican dentro de cada Zona.
3. Los componentes de dibujo emiten acciones y muestran estado. Las reglas de Ejercicio viven en el dominio o en validadores, no en primitivas PixiJS/Mafs.
4. El frontend no importa código Python y el backend no depende de componentes visuales.
5. Los datos del banco de ejercicios tienen identificadores estables y un formato compartido/documentado para el cliente conectado y el Modo estático.
6. Cada cambio funcional comienza con una especificación revisada, antes de diseñar tareas o escribir código.
7. El código y las pruebas deben poder rastrearse hasta los requisitos y criterios de aceptación de la especificación que implementan.

La nomenclatura y estilo de los archivos siguen la [Guía de convenciones de código](./convenciones-codigo.md). Los términos de dominio se definen en el [Glosario único](./glosario.md).

## 2. Árbol canónico del área `development/`

```text
development/
├── specs/
│   ├── README.md
│   ├── templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   └── tasks-template.md
│   └── 001-descriptive-feature-name/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── contracts/
├── docs/
│   ├── politicas/
│   ├── architecture/
│   └── banco_ejercicios.md
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── exercises.json
│   └── src/
│       ├── app/
│       │   ├── App.tsx
│       │   ├── routes/
│       │   └── providers/
│       ├── zones/
│       │   ├── zone-1/
│       │   │   ├── components/
│       │   │   ├── pixi/
│       │   │   ├── state/
│       │   │   └── index.ts
│       │   ├── zone-2/
│       │   ├── zone-3/
│       │   ├── zone-4/
│       │   └── zone-5/
│       ├── features/
│       │   ├── exercises/
│       │   ├── feedback/
│       │   └── progress/
│       ├── shared/
│       │   ├── components/
│       │   ├── domain/
│       │   ├── api/
│       │   ├── storage/
│       │   └── utils/
│       └── main.tsx
├── backend/
│   └── app/
│       ├── main.py
│       ├── api/
│       │   └── v1/
│       │       ├── routes/
│       │       └── schemas/
│       ├── domain/
│       ├── services/
│       └── validators/
├── tests/
│   ├── integration/
│   └── fixtures/
├── scripts/
└── README.md
```

`development/` es la raíz del producto: todos los archivos de especificación, documentación técnica, código, pruebas y scripts del proyecto viven dentro de ella. Los documentos académicos o administrativos que no forman parte del producto quedan fuera de este árbol. Los archivos de configuración de cada ecosistema se ubican en la raíz de su aplicación (`frontend/` o `backend/`) y no se duplican en cada módulo.

Cada carpeta `specs/NNN-descriptive-feature-name/` representa una unidad de cambio. `spec.md`, `plan.md` y `tasks.md` son los artefactos de SDD de esa unidad; `contracts/` contiene ejemplos o esquemas específicos del cambio cuando corresponda. Las plantillas son guías, no especificaciones activas.

## 3. Flujo Spec-Driven Development

El equipo usa la especificación como fuente de verdad del comportamiento solicitado. El flujo obligatorio para una funcionalidad nueva o un cambio funcional es:

1. **Especificar (`spec.md`):** describir problema, usuarios/actores, alcance, requisitos observables, escenarios, criterios de aceptación, restricciones y exclusiones. Identificar decisiones pendientes y supuestos; no esconder ambigüedades en la implementación.
2. **Revisar y acordar:** confirmar que los requisitos y criterios son comprensibles, comprobables y consistentes con el glosario, la política de versiones y el contrato de API. No iniciar implementación mientras haya decisiones bloqueantes sin resolver.
3. **Diseñar (`plan.md`):** proponer arquitectura y módulos afectados, flujo de datos, contratos, persistencia, riesgos y estrategia de prueba. Registrar decisiones técnicas necesarias sin duplicar la especificación funcional.
4. **Descomponer (`tasks.md`):** ordenar tareas ejecutables con dependencias y vincular cada tarea a requisitos o criterios de aceptación identificables (por ejemplo, `REQ-01` y `AC-01`).
5. **Implementar y verificar:** completar las tareas en orden, crear pruebas vinculadas a los criterios y mantener código, documentación y pruebas consistentes con la especificación aprobada.
6. **Cerrar el cambio:** marcar tareas terminadas solo con evidencia de verificación; actualizar la especificación si el comportamiento acordado cambió y obtener revisión de ese cambio antes de integrarlo.

Los cambios correctivos pequeños también requieren una especificación proporcional: registrar el comportamiento defectuoso, el comportamiento esperado, el alcance y una prueba de regresión. Una modificación exclusivamente editorial/documental puede actualizarse directamente, salvo que cambie una regla normativa o un comportamiento del producto.

Las herramientas de IA pueden ayudar a producir o revisar artefactos, pero no deciden requisitos implícitos. Si falta información, deben señalar el supuesto en `spec.md` o pedir una decisión; nunca convertir una inferencia en requisito confirmado.

## 4. Responsabilidad de cada área

### 4.1 Frontend

- `frontend/src/app/`: composición de la aplicación, rutas, configuración global e inicialización.
- `frontend/src/zones/zone-N/`: interacción y composición específica de una Zona. Zona 1 contiene el canvas PixiJS y sus adaptadores; Zonas 2–5 contienen las vistas y controles Mafs.
- `frontend/src/features/exercises/`: carga de banco, estado del Ejercicio y flujo de respuesta.
- `frontend/src/features/feedback/`: retroalimentación, ayudas y estado de resultado, sin decidir equivalencia simbólica.
- `frontend/src/features/progress/`: modelo de progreso y operaciones de guardado/recuperación.
- `frontend/src/shared/domain/`: tipos y reglas de dominio compartidas que no pertenecen a una Zona.
- `frontend/src/shared/api/`: cliente HTTP, tipos de transporte y conversión entre DTO y modelo de dominio.
- `frontend/src/shared/storage/`: adaptador LocalStorage, versionado y migraciones de esquema.
- `frontend/src/shared/components/`: componentes reutilizables de interfaz sin conocimiento de un Ejercicio concreto.
- `frontend/public/data/exercises.json`: datos estáticos del banco destinados al Modo estático. No guardar en este archivo secretos ni lógica ejecutable. Cada cambio de contenido debe trazarse a una especificación revisada y a sus casos de referencia.

React conserva el estado de aplicación. PixiJS o Mafs dibujan exclusivamente la Zona correspondiente; no se deben montar dos motores para representar la misma escena. La Zona notifica las interacciones a React por una interfaz tipada.

### 4.2 Backend

- `backend/app/api/v1/routes/`: operaciones HTTP versionadas, validación de esquemas y traducción de errores al [Contrato de API](./contrato-api.md).
- `backend/app/api/v1/schemas/`: modelos Pydantic de entrada y salida; estos modelos son el límite público y no exponen objetos internos de SymPy.
- `backend/app/domain/`: conceptos matemáticos y tipos internos independientes de FastAPI.
- `backend/app/services/`: coordinación de validadores, banco y respuestas.
- `backend/app/validators/`: comprobaciones acotadas por tipo de Ejercicio; SymPy se usa cuando la operación simbólica está dentro del alcance definido.
- `backend/app/main.py`: creación de la aplicación, inclusión de routers y configuración del proceso.

La API no almacena progreso personal: LocalStorage es el almacenamiento de progreso acordado. El backend recibe solo los datos necesarios para verificar una respuesta y devuelve un resultado según contrato.

### 4.3 Pruebas y documentación

- Las pruebas unitarias se mantienen junto al módulo propietario (por ejemplo, `*.test.ts(x)` y `test_*.py`) o en directorios `tests/` del paquete si esa es la convención elegida al configurar los runners.
- `development/tests/integration/` contiene pruebas que cruzan el cliente y la API; `development/tests/fixtures/` contiene casos de referencia revisados, no datos de usuarios.
- `development/specs/` contiene especificaciones y planes aprobados; `development/docs/politicas/` contiene estándares vigentes. El banco de ejercicios conserva el contenido pedagógico y las soluciones revisadas; no se debe copiar su fuente de verdad a documentos distintos sin un proceso de sincronización.
- Las pruebas deben indicar el ID del requisito o criterio de aceptación que cubren, directamente o mediante su ubicación/nombre. Un criterio de aceptación no está completo hasta que exista una forma de verificarlo.

## 5. Regla para ubicar elementos nuevos

Antes de añadir un archivo, responder:

1. ¿Define o cambia comportamiento? Crear/actualizar primero una unidad en `development/specs/`; ubicarla en `spec.md`, no solo en un comentario o ticket.
2. ¿Es una decisión de diseño para cumplir esa especificación? Registrar su plan y módulos afectados en el `plan.md` de la misma unidad.
3. ¿Es una regla matemática común? Ubicarla en dominio/validador backend o en el dominio compartido si es una regla determinista no simbólica.
4. ¿Es una interacción o representación exclusiva de una Zona? Ubicarla en `frontend/src/zones/zone-N/`.
5. ¿Es una funcionalidad que atraviesa varias Zonas (por ejemplo, progreso o retroalimentación)? Ubicarla en `frontend/src/features/`.
6. ¿Es transporte HTTP? Ubicarlo en `frontend/src/shared/api/` o `backend/app/api/v1/`, según el lado.
7. ¿Es persistencia en navegador? Ubicarla en `frontend/src/shared/storage/`; no acceder directamente a LocalStorage desde un componente de Zona.
8. ¿Es contenido de un Ejercicio? Actualizar la fuente de datos canónica y los casos de prueba asociados; no incrustarlo en la capa de dibujo.

Si una función depende de dos capas, ubicarla en la capa de orquestación y hacer que dependa de interfaces explícitas. No resolver dependencias circulares moviendo código arbitrariamente a `utils/`.

## 6. Modos conectado y estático

El Modo conectado envía verificaciones simbólicas compatibles a FastAPI/SymPy. El Modo estático usa el banco cerrado y validadores o respuestas precalculados revisados. Ambos comparten identificadores y tipos de respuesta; no se requiere que el modo estático reproduzca un motor simbólico general.

El frontend debe poder distinguir el modo operativo y presentar errores de red como tales. Si el equipo publica un respaldo sin API, la documentación y las notas de versión deben decirlo expresamente, conforme a la [Política de versiones](./politica-versiones.md).

## 7. Decisiones de estructura por confirmar

Esta estructura es el destino canónico; no se afirma que las carpetas o la implementación ya existan. Se asume que frontend, backend, especificaciones y documentación técnica se mantendrán dentro de `development/` en un mismo repositorio y que el proyecto será pequeño. Si el equipo separa repositorios, debe conservar la relación trazable entre especificaciones, implementación, pruebas y contrato compartido. El gestor de paquetes, los runners de prueba y la estrategia de generación de tipos no constan como decisiones confirmadas.
