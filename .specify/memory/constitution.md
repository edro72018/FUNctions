<!--
Sync Impact Report
==================
Version change: none (plantilla sin completar) → 0.1.0
Rationale: primera redacción de la constitución a partir del borrador aportado por el equipo. Se usa 0.1.0
  porque el documento sigue en estado de borrador y la ratificación está pendiente; al ratificarse se
  promoverá a 1.0.0 sin cambios de contenido.

Modified principles: N/A (constitución inicial; no existía una versión anterior con principios propios).

Added principles:
  - I. Alcance Educativo y Evidencia Verificable
  - II. Stack Confirmado y Fronteras de Validación
  - III. Rigor Matemático y Fuente de Verdad
  - IV. Estructura, Estilo y Trazabilidad
  - V. Estados Explícitos y Fallos Visibles
  - VI. Spec-Driven Development y Asistencia por IA con Autorización

Added sections:
  - Core Principles
  - Restricciones Adicionales
  - Flujo de Trabajo y Puertas de Calidad
  - Governance

Removed sections: none.

Templates requiring updates:
  - .specify/templates/plan-template.md: sin cambios; lee la constitución en tiempo de ejecución.
  - .specify/templates/spec-template.md: sin cambios; lee la constitución en tiempo de ejecución.
  - .specify/templates/tasks-template.md: sin cambios; lee la constitución en tiempo de ejecución.

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): el equipo debe registrar la fecha de ratificación.
  - Aprobar la especificación 001 (interacciones E01/E08) antes de tratarla como requisito.
  - Definir versiones exactas del stack y resolver los tipos booleano y de vértice de /api/v1.
  - Decidir progresión definitiva, puntos/insignias y método de medición del objetivo del 80%.
-->

# Constitución de FUNtions

**Estado:** borrador para revisión y aprobación del equipo. No debe interpretarse como aprobación
automática de las propuestas de interacción de la especificación 001.
**Ámbito:** principios de producto, implementación y trabajo asistido por IA. Este borrador se mantiene
en `docs/` para revisión; tras su aprobación, la ubicación canónica es `development/docs/politicas/`.
La documentación técnica vigente vive en `development/docs/`; las especificaciones de cambio viven en
`development/specs/`.

Cuando este documento menciona `development/`, se refiere al directorio raíz del repositorio del producto.
Los enlaces relativos se resuelven desde `.specify/memory/`.

## Core Principles

### I. Alcance Educativo y Evidencia Verificable

FUNtions es un juego web educativo original para estudiantes de bachillerato. Su propósito es apoyar el
aprendizaje de funciones mediante problemas interactivos, representaciones gráficas, retroalimentación y
ayudas progresivas.

- El producto objetivo comprende **cinco Zonas y quince Ejercicios, tres por Zona**. El primer recorrido
  E01/E08 es solo un corte vertical propuesto; no sustituye el alcance final.
- La Zona 1 aborda relaciones, existencia y unicidad. Las Zonas 2–5 emplean actividades de dominio/rango,
  trayectorias, funciones exponenciales/logarítmicas e integración de conceptos, conforme al
  [Banco de ejercicios](../../docs/banco_ejercicios.md).
- El nombre **FUNtions**, la licencia **MIT**, el público de bachillerato, el total de ejercicios y el stack
  confirmado son decisiones cerradas. La consigna exige un juego funcional, acceso abierto y un documento
  Markdown con soluciones y evidencia de autoría.
- El Product Goal es ofrecer un juego accesible mediante enlace abierto para practicar funciones en cinco
  Zonas y quince Ejercicios, con retroalimentación progresiva, soluciones documentadas y evidencias del
  trabajo del equipo.
- La fecha académica de entrega es el 17 de noviembre de 2026; la consigna no determina hora ni canal.

El producto está en preparación documental. **NO SE DEBE** afirmar que hay código funcional, validadores,
pruebas, despliegue o resultados educativos hasta que exista evidencia. La meta propuesta del 80% de
participantes no es un resultado ni un criterio verificable hasta que se definan muestra, métrica y método.

### II. Stack Confirmado y Fronteras de Validación

El stack de [Restricciones Adicionales](#restricciones-adicionales) es normativo. Las siguientes reglas
son obligatorias:

1. React conserva el estado de aplicación. PixiJS y Mafs representan la interacción de sus Zonas y **no son
   la autoridad de validación matemática**.
2. El cliente valida formato y restricciones de interacción. Las comprobaciones simbólicas se delegan a
   FastAPI/SymPy en Modo conectado. El Modo estático solo debe cubrir el Banco de ejercicios con validadores
   finitos y verificados; **no debe** simular un motor simbólico general mediante muestreo gráfico.
3. La aplicación **no debe** aceptar ni ejecutar código Python o expresiones arbitrarias del usuario. La API
   valida identificadores y tipos de respuesta permitidos por Ejercicio.
4. **No se fija** como decisión Vite, una versión mayor concreta de PixiJS, `@pixi/react`, una base de datos
   ni un proveedor de hosting alternativo mientras no se aprueben en una especificación/plan.
5. El prefijo `/api/v1` pertenece al contrato inicial propuesto. Los tipos booleano y de vértice que requiere
   E01/E08 aún deben incorporarse y revisarse antes de implementar ese recorrido.
6. La licencia MIT debe incluirse en el repositorio del producto. No implica que dependencias de terceros
   compartan esa licencia.

Las versiones exactas y la compatibilidad entre dependencias son decisiones pendientes. **No se deben
instalar paquetes ni inicializar herramientas** sin autorización explícita; la instrucción vigente para el
siguiente incremento es preparar revisión **sin instalaciones**.

**Razón:** separar presentación de validación evita duplicar reglas matemáticas y permite que el cliente
funcione como respaldo sin convertirse en una calculadora simbólica no auditada.

### III. Rigor Matemático y Fuente de Verdad

El [Banco de ejercicios](../../docs/banco_ejercicios.md) es la fuente de verdad del contenido, soluciones
y casos de referencia. Los reportes históricos no reemplazan decisiones posteriores.

- Una relación representa una función de un conjunto declarado de entradas si **cada elemento del dominio
  tiene exactamente una imagen**. Distintas entradas pueden compartir imagen; eso no invalida que sea
  función.
- El dominio declarado por un ejercicio no debe confundirse con el dominio natural máximo de una expresión.
  El codominio declarado tampoco debe confundirse con el rango. Cada respuesta debe validar lo que solicita
  el enunciado y respetar sus restricciones.
- Conjuntos se comparan como conjuntos, no por orden ni por coincidencia parcial. Intervalos deben preservar
  extremos abiertos/cerrados, uniones e infinitos. **No se deben** usar aproximaciones visuales o una
  cantidad finita de puntos como demostración de equivalencia simbólica.
- Valores exactos equivalentes pueden aceptarse solo si la gramática y normalización están especificadas y
  compartidas por los validadores de API y de Modo estático. **No hay una tolerancia numérica global
  aprobada.**

Las respuestas de referencia confirmadas (E01, E05, E06, E08 y E15) se conservan en
[Restricciones Adicionales](#restricciones-adicionales). Las interacciones detalladas de E01/E08 —selector,
ayudas, reintentos, intentos, representación de respuestas y reglas de progreso— están propuestas en la
[especificación 001](../../specs/001-primer-recorrido/spec.md) y requieren aprobación antes de ser
requisitos de implementación. La progresión definitiva, puntos/insignias y medición del objetivo del 80%
permanecen por decidir.

### IV. Estructura, Estilo y Trazabilidad

Todo el código, las especificaciones y la documentación técnica del producto se organiza bajo
`development/`. La estructura canónica se define en [Estructura definitiva](../../docs/politicas/estructura-proyecto.md);
el estilo detallado en [Convenciones de código](../../docs/politicas/convenciones-codigo.md).

- `development/specs/NNN-nombre/` contiene los artefactos SDD de cada cambio: `spec.md`, `plan.md` y
  `tasks.md`, más contratos específicos cuando corresponda.
- `development/frontend/` contiene la aplicación React/TypeScript; `src/zones/zone-1/` integra PixiJS y
  `src/zones/zone-2/` a `zone-5/` integran Mafs. Las funciones transversales viven en `src/features/` o
  `src/shared/` según su responsabilidad.
- `development/backend/app/` contiene rutas FastAPI versionadas, esquemas, dominio, servicios y validadores
  SymPy. Las rutas coordinan; no implementan toda la lógica matemática.
- `development/tests/` contiene pruebas de integración y fixtures revisados. Las pruebas deben enlazarse a
  requisitos y criterios de aceptación.
- TypeScript usa modo estricto, tipos explícitos y evita `any`; componentes y tipos usan `PascalCase`,
  variables y funciones `camelCase`, carpetas `kebab-case`. Python sigue PEP 8, anotaciones de tipos y
  `snake_case` para módulos y funciones.
- Separar presentación, dominio, transporte y persistencia. Los componentes PixiJS/Mafs **no deben** contener
  reglas de validación ni acceder directamente a LocalStorage o HTTP.
- Mantener IDs estables `E01`–`E15`; usar el vocabulario canónico del [Glosario](../../docs/politicas/glosario.md).
- **No introducir** secretos, credenciales ni datos personales en código, ejemplos, registros o LocalStorage.

### V. Estados Explícitos y Fallos Visibles

1. Distinguir siempre entre respuesta `correct`, `incorrect`, `indeterminate`, entrada incompleta/no válida y
   error técnico. Un resultado indeterminado o una falla de API **no** es una respuesta incorrecta.
2. El Backend valida el esquema de entrada, limita la operación al Banco de ejercicios y devuelve resultados
   conforme al [Contrato de API](../../docs/politicas/contrato-api.md). Los errores HTTP no se deben convertir
   en respuestas exitosas ni ocultarse con valores por defecto.
3. En Modo estático, indicar que la evaluación fue local. **No afirmar** que se ejecutó FastAPI/SymPy si no
   fue así. La selección o activación del fallback debe ser explícita; no cambiar de modo silenciosamente.
4. SymPy solo opera sobre formatos y familias admitidos. Si no puede decidir, informar estado indeterminado;
   si el servicio falla, devolver el error de servicio correspondiente. No confiar en `asyncio.wait_for`
   como garantía de interrumpir cómputo síncrono.
5. **No registrar** trazas internas, secretos, credenciales ni datos personales en respuestas públicas. Los
   errores internos deben registrarse con contexto técnico suficiente y sin información sensible.
6. El cliente debe comunicar con claridad fallos de red y almacenamiento. **No afirmar** que el progreso quedó
   guardado si LocalStorage no está disponible. **No sobrescribir** ni descartar silenciosamente datos
   corruptos o de esquema desconocido; cualquier recuperación debe estar documentada y probada.
7. Las pruebas matemáticas deben cubrir respuestas correctas, incorrectas, límites, conjuntos completos,
   formatos inválidos y resultados indeterminados. Cada criterio de aceptación de la especificación debe
   tener una verificación o una excepción justificada.

El [Contrato de API](../../docs/politicas/contrato-api.md) continúa siendo inicial y no define todavía la
forma de respuesta específica de E01/E08. **No iniciar su implementación** hasta resolver esta brecha en el
contrato y en la especificación.

### VI. Spec-Driven Development y Asistencia por IA con Autorización

El agente debe seguir Spec-Driven Development y tratar la especificación aprobada como fuente de verdad del
comportamiento. Antes de trabajar, debe leer esta Constitución, el contexto relevante en `docs/`, los
estándares de `development/docs/politicas/` y la especificación afectada.

1. **Jerarquía de contexto:** seguir las instrucciones explícitas más recientes del equipo, los requisitos
   académicos, las decisiones confirmadas y las políticas vigentes. Los borradores, notas históricas y
   propuestas no aprobadas no pueden prevalecer sobre ellos.
2. **Etiquetado de certeza:** distinguir en toda propuesta entre confirmado, propuesto, pendiente y
   realizado/verificado. **No declarar** implementado, probado, desplegado o aprobado algo que solo está
   documentado.
3. **Especificar antes de construir:** para funcionalidad nueva, crear o actualizar `spec.md` con problema,
   alcance, requisitos observables, escenarios, criterios de aceptación, supuestos, exclusiones y decisiones
   pendientes.
4. **Puertas SDD:** obtener revisión/aprobación de la especificación; después elaborar `plan.md`; luego
   descomponer `tasks.md` con trazabilidad a requisitos (`REQ`) y criterios (`AC`); solo entonces implementar
   y verificar. **No saltar** una etapa ni marcar artefactos aprobados en nombre del equipo.
5. **No inventar requisitos:** cuando haya ambigüedad que afecte comportamiento, arquitectura, persistencia,
   compatibilidad o alcance, preguntar al equipo o registrar una opción explícitamente como propuesta. **No
   seleccionar** silenciosamente una opción.
6. **Cambios controlados:** realizar cambios precisos, actualizar documentación y contrato relacionados,
   preservar comportamiento no afectado y probar exactamente los criterios aceptados. **No ampliar** alcance
   ni modificar estándares por conveniencia.
7. **Autorización de herramientas:** **no instalar** dependencias, inicializar Spec Kit, crear infraestructura,
   publicar, ni ejecutar cambios operativos sin autorización expresa. En el estado actual se autorizó revisión
   documental, no instalaciones ni implementación.
8. **Salida legible por IA y equipo:** usar IDs estables, lenguaje directo, enlaces a fuentes y ejemplos
   verificables; mantener consistentes la Constitución, el Glosario, la Estructura, las Convenciones, el
   Contrato de API, las especificaciones y Scrum.

**Razón:** las puertas SDD y el etiquetado de certeza impiden que propuestas de diseño se conviertan en
compromisos de producto sin revisión del equipo.

## Restricciones Adicionales

### Stack tecnológico y responsabilidades

| Tecnología | Responsabilidad normativa | Estado |
|---|---|---|
| React + TypeScript | Interfaz, navegación y estado de aplicación | Confirmados; versiones y herramientas de compilación pendientes |
| PixiJS | Interacción y representación de la Zona 1 | Confirmado |
| Mafs | Gráficas y controles de las Zonas 2–5 | Confirmado |
| FastAPI | API HTTP del backend | Confirmado |
| SymPy | Validación simbólica acotada para respuestas que lo requieran | Confirmado; no se presume que resuelva cualquier entrada |
| LocalStorage | Progreso local en el navegador y el mismo origen | Confirmado; no sincroniza dispositivos ni se almacena en el backend |
| Modo estático | Respaldo del cliente con validadores o respuestas precalculadas revisados para los quince Ejercicios | Aprobado como contingencia; implementación pendiente |

### Decisiones matemáticas confirmadas

| Ejercicio | Regla y respuesta de referencia |
|---|---|
| E01 | Reconocer la relación `R={(1,4),(2,4),(3,5)}` con dominio `{1,2,3}` como función; se permite compartir imagen |
| E05 | Función radical `√(x−2)`; dominio `[2,+∞)` y rango `[0,+∞)` |
| E06 | Función racional `5/(x−3)`; dominio `ℝ \ {3}` |
| E08 | Construir desde el vértice `(3,2)` con `a=1`; objetivo `(x−3)²+2` |
| E15 | `x+2` para `x<0` y `(x−3)²+2` para `x≥0`; por tanto `f(0)=11` y `f(−2)=0` |

### Estado y autorización vigente

- El producto está en preparación documental; no hay código funcional, pruebas ni despliegue verificados.
- La instrucción vigente autoriza revisión documental; **no** instalaciones, inicialización de herramientas
  ni implementación.
- Las versiones exactas del stack, la herramienta de compilación y la compatibilidad entre dependencias
  siguen pendientes de aprobación.
- El Contrato de API es inicial y no cubre todavía la forma de respuesta de E01/E08.

## Flujo de Trabajo y Puertas de Calidad

1. **Especificación:** describir problema, alcance, requisitos observables, escenarios, criterios de
   aceptación, supuestos, exclusiones y decisiones pendientes en `spec.md`.
2. **Revisión y aprobación:** el equipo revisa la especificación. Ningún agente ni colaborador puede declarar
   aprobado un artefacto en nombre del equipo.
3. **Plan:** tras la aprobación, elaborar `plan.md` con decisiones técnicas, dependencias y riesgos.
4. **Tareas:** descomponer `tasks.md` con trazabilidad explícita a requisitos (`REQ`) y criterios (`AC`).
5. **Implementación y verificación:** implementar solo lo aceptado, ejecutar las verificaciones y registrar
   evidencia. Cada criterio de aceptación debe tener verificación o una excepción justificada.

**Cobertura mínima de pruebas:** respuestas correctas, incorrectas, límites, conjuntos completos, formatos
inválidos y resultados indeterminados. Los fixtures deben ser revisados y enlazarse a los requisitos que
cubren.

**Revisión de cumplimiento:** cada especificación, plan, tarea y cambio debe verificar esta Constitución y
las políticas vigentes. Las desviaciones requieren justificación registrada y aprobación del equipo; no se
admiten desviaciones silenciosas. Los cambios de contrato, estructura, convenciones o glosario deben
actualizarse junto con el código afectado.

**Criterio de aprobación:** el equipo debe revisar y ratificar este borrador. Hasta entonces, sus reglas
sirven para orientar la revisión y no convierten en acuerdos las propuestas que se identifican como
pendientes.

## Governance

Esta Constitución prevalece sobre prácticas, borradores y notas históricas. La jerarquía de contexto es:
instrucciones explícitas más recientes del equipo, requisitos académicos, decisiones confirmadas y políticas
vigentes.

**Procedimiento de enmienda:**

1. Registrar la propuesta con motivación, alcance del cambio e impacto en especificaciones, contrato,
   estructura, convenciones y glosario.
2. Obtener revisión y aprobación del equipo antes de aplicar el cambio.
3. Actualizar esta Constitución, incrementar la versión según la política siguiente y registrar la fecha de
   la última enmienda.
4. Actualizar los documentos dependientes y dejar constancia de las migraciones o excepciones necesarias.

**Política de versiones (SemVer):**

- **MAJOR:** eliminación o redefinición incompatible de principios, reglas de gobierno o restricciones.
- **MINOR:** nuevo principio o sección, o ampliación material de la guía existente.
- **PATCH:** aclaraciones, correcciones de redacción o refinamientos no semánticos.

Mientras la Constitución no esté ratificada, se usa `0.MINOR.PATCH`; la ratificación la promueve a `1.0.0`.

**Cumplimiento:** toda revisión debe comprobar la conformidad con esta Constitución. Las excepciones deben
documentarse y aprobarse; la complejidad o el atajo no justifican por sí solos una desviación. Las ambigüedades
que afecten comportamiento, arquitectura, persistencia, compatibilidad o alcance deben registrarse como
propuestas o consultarse con el equipo.

**Ratificación:** este documento es un borrador. El equipo debe revisarlo y ratificarlo; la fecha de
ratificación queda pendiente en `TODO(RATIFICATION_DATE)`.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-11-15
