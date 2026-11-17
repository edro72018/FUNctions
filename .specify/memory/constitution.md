# Constitución de FUNctions

**Estado:** Constitución ratificada, versión 1.0.0, desde 2026-11-16. El Principio VII entra en
vigor desde esta ratificación; no se afirma que rigiera retroactivamente. Las decisiones de esta
redacción se apoyan en el
[cuestionario de Constitución]](../../docs/cuestionario_constitucion.md) y en las instrucciones
del Aprobador; la ratificación consta en el
[Registro de ratificación](#registro-de-ratificación).

**Ámbito:** producto, implementación y trabajo asistido por IA. La única fuente de verdad de la
Constitución es `development/.specify/memory/constitution.md`, el archivo que consume Spec Kit.
El [borrador de trabajo]](../../docs/constitution_draft.md), ubicado en `docs/constitution_draft.md`
fuera del repositorio del producto, se conserva para preparar enmiendas y no es normativo.
No DEBE sustituir, contradecir ni presentarse como copia vigente de esta Constitución.

En este documento, `development/` designa la raíz del repositorio del producto. Las rutas
`specs/` y `docs/politicas/` sin ese prefijo son relativas a dicha raíz. Los enlaces Markdown
se resuelven desde `.specify/memory/`; las rutas de artefactos futuros se presentan como texto.

**Convención normativa:** **DEBE** expresa una obligación; **DEBERÍA**, una recomendación que
requiere justificación si no se sigue; **PUEDE**, una opción permitida. «No DEBE» expresa una
prohibición. La vigencia de las reglas depende de la ratificación indicada en
[Governance](#governance); esta Constitución no acredita por sí misma aprobación de specs ni
trabajo realizado.

## Core Principles

### I. Alcance Educativo y Evidencia Verificable

FUNctions es un juego web educativo original para estudiantes de bachillerato. Su propósito es
apoyar el aprendizaje de funciones mediante problemas interactivos, representaciones gráficas,
retroalimentación y ayudas progresivas.

- El producto DEBE comprender cinco Zonas y quince Ejercicios, tres por Zona. Un recorrido
  parcial E01/E08 no sustituye el alcance final.
- La Zona 1 aborda relaciones, existencia y unicidad. Las Zonas 2–5 emplean dominio/rango,
  trayectorias, funciones exponenciales/logarítmicas e integración de conceptos.
- La distribución estable DEBE ser: Zona 1, E01–E03; Zona 2, E04–E06; Zona 3, E07–E09;
  Zona 4, E10–E12; Zona 5, E13–E15. Cambiarla requiere enmienda constitucional.
- Se conservan el nombre FUNctions, la licencia MIT, el público de bachillerato y el
  [stack confirmado](#stack-tecnológico-y-responsabilidades).
- El Product Goal es ofrecer un juego mediante enlace abierto para practicar funciones en las
  cinco Zonas, con retroalimentación progresiva, soluciones documentadas y evidencia de autoría.
- El producto DEBE satisfacer la consigna de juego funcional, acceso abierto y documento
  Markdown con soluciones y evidencia del trabajo. La fecha académica es 2026-11-17;
  la consigna no determina hora ni canal.
- La licencia MIT DEBE incluirse en el repositorio del producto. Esto no atribuye esa licencia
  a las dependencias de terceros.

No se DEBE afirmar que existe código funcional, una prueba ejecutada, un despliegue o un resultado
educativo sin evidencia. Los criterios medibles y su verificación se rigen por
[Pruebas, métricas y definición de terminado](#pruebas-métricas-y-definición-de-terminado).
El diseño DEBERÍA aplicar el enfoque de aprender haciendo mediante actividades gamificadas que
promuevan comprensión y práctica significativa, sin sacrificar corrección matemática.

### II. Stack Confirmado y Fronteras de Validación

La capa administrada por React DEBE conservar el estado de dominio, navegación y progreso de la
aplicación. PixiJS y Mafs PUEDEN conservar coordenadas transitorias, animaciones u otro estado de
renderizado por fotograma, pero no DEBEN convertirse en fuente de verdad del dominio, progreso o
validación matemática ni forzar actualizaciones de React en cada fotograma sin necesidad.

El cliente DEBE validar formato y restricciones de interacción. El Backend DEBE validar también
el esquema de entrada, los identificadores y los tipos permitidos por Ejercicio; no DEBE confiar
en la comprobación previa del cliente. En Modo conectado, las comprobaciones simbólicas DEBEN
delegarse a FastAPI/SymPy dentro del alcance admitido.

El Modo estático DEBE limitarse al Banco de ejercicios, mediante validadores finitos o respuestas
precalculadas revisados para los quince Ejercicios. No DEBE simular un motor simbólico general
mediante muestreo gráfico. La aplicación no DEBE aceptar ni ejecutar código Python ni expresiones
arbitrarias del usuario como instrucciones ejecutables.

El stack de producto está resuelto: React.js, PixiJS, Mafs/SVG y Python con librerías
especializadas (FastAPI/SymPy y las que apruebe el plan). No se adopta un motor de juego dedicado.
La independencia de motor que describe el GDD es una decisión de diseño, no una autorización para
sustituir estas tecnologías. «Mafs/SVG» se refiere al renderizado dentro de la capa React/Mafs.
Las versiones y herramientas de build se concretan en el plan, sin reabrir la elección de
tecnologías. Una biblioteca o servicio adicional DEBE aprobarse en el plan correspondiente.

Vite, una versión mayor concreta de PixiJS, `@pixi/react`, una base de datos y un proveedor de
hosting alternativo no son decisiones aprobadas por esta Constitución. Su adopción DEBE
expresarse y aprobarse en la spec o el plan correspondiente. El prefijo `/api/v1` es parte del
contrato inicial propuesto, no un contrato ratificado por esta mención.

**Razón:** separar presentación, formato y validación matemática evita que una visualización
o una comprobación parcial se convierta en autoridad sobre la respuesta del estudiante.

### III. Rigor Matemático y Fuente de Verdad

El [Banco de ejercicios](../../docs/banco_ejercicios.md) reúne contenido, soluciones y casos de
referencia. Las specs DEBEN conservar las decisiones matemáticas confirmadas reproducidas en
[Decisiones matemáticas confirmadas](#decisiones-matemáticas-confirmadas). Las propuestas del banco y
los reportes históricos no DEBEN convertirse en obligaciones por mera referencia.

- Una relación es función de un conjunto declarado de entradas si cada elemento del dominio
  tiene exactamente una imagen. Distintas entradas PUEDEN compartir imagen.
- Los validadores DEBEN distinguir dominio declarado de dominio natural máximo y codominio de
  rango; DEBEN evaluar lo solicitado por el enunciado con sus restricciones.
- Los conjuntos DEBEN compararse completos y sin dependencia del orden. Los intervalos DEBEN
  preservar extremos abiertos/cerrados, uniones e infinitos.
- No se DEBE usar una aproximación visual o una cantidad finita de puntos como demostración
  de equivalencia simbólica. No existe una tolerancia numérica global aprobada.
- Los valores exactos equivalentes solo PUEDEN aceptarse con gramática y normalización aprobadas.

La gramática base compartida para respuestas exactas DEBE definirse en `contracts/` de la
[spec del núcleo de validación](../../specs/001-nucleo-validacion/spec.md). Las restricciones
particulares DEBEN definirse en la spec consumidora. Frontend, Backend y Modo estático DEBEN
aplicar coherentemente el contrato aprobado.

Las serializaciones y tipos de respuesta que requiera cada contrato DEBEN concretarse en
`contracts/` antes de implementar. El núcleo DEBE cubrir como mínimo `number`, `expression`,
`finiteSet`, `intervalUnion`, `mapping`, `boolean`, `vertex`, `point`, `asymptote` y `composite`;
la lista PUEDE ampliarse solo mediante decisión registrada. `boolean` y `vertex` siguen siendo
obligatorios para E01/E08.

La spec del núcleo DEBE definir qué comportamiento corresponde cuando no exista una gramática
aprobada antes de autorizar su implementación. Hasta entonces, el caso permanece bloqueado y el
agente no DEBE elegir por inferencia `incorrect`, `indeterminate` ni un error de configuración.

### IV. Estructura, Estilo y Trazabilidad

El código, las specs y la documentación técnica del producto DEBEN organizarse bajo
`development/`, con las siguientes responsabilidades:

- `specs/NNN-nombre/`: unidad de cambio con `spec.md` y los artefactos del
  [flujo de Specify](#etapas-y-artefactos-de-specify).
- `frontend/`: aplicación React/TypeScript; `src/zones/zone-1/` integra PixiJS y
  `src/zones/zone-2/` a `zone-5/` integran Mafs. `src/features/` y `src/shared/` contienen
  funciones transversales según su responsabilidad.
- `backend/app/`: rutas FastAPI versionadas, esquemas, dominio, servicios y validadores SymPy.
  Las rutas DEBEN coordinar; no DEBEN concentrar toda la lógica matemática.
- `tests/`: pruebas de integración y fixtures revisados cuando se incluyan. Las verificaciones
  DEBEN vincularse a los requisitos y criterios de aceptación que cubren.

La implementación DEBE separar presentación, dominio, transporte y persistencia. Los componentes
PixiJS/Mafs no DEBEN contener reglas de validación ni acceder directamente a LocalStorage o HTTP.
TypeScript DEBE usar modo estricto y tipos explícitos; se DEBERÍA evitar `any`, justificando su
uso si fuera necesario. Componentes y tipos DEBEN usar `PascalCase`; variables y funciones,
`camelCase`; carpetas, `kebab-case`. Python DEBE seguir PEP 8, usar anotaciones de tipos y
`snake_case` para módulos y funciones.

Los IDs `E01`–`E15` DEBEN mantenerse estables. Los términos Zona, Ejercicio, Modo estático y Backend
DEBEN usarse consistentemente. El [Glosario](../../docs/politicas/glosario.md), la
[Estructura](../../docs/politicas/estructura-proyecto.md) y las
[Convenciones](../../docs/politicas/convenciones-codigo.md) son referencias informativas con la
autoridad limitada descrita en [Autoridad normativa](#autoridad-normativa).

Los requisitos internos DEBEN identificarse como `REQ-01`, `REQ-02`, etc.; cumplen la función de
los requisitos funcionales `FR` de la plantilla. Los criterios o escenarios de aceptación DEBEN
usar `AC-01`, `AC-02`, etc. Los resultados medibles de éxito PUEDEN conservar identificadores `SC`
cuando sean conceptualmente distintos; no se DEBE equiparar automáticamente `AC` con `SC`.
Las tareas DEBEN vincularse a los `REQ`, `AC` y, cuando corresponda, historias de usuario de su spec.

Cada spec DEBE tener una rama `NNN-nombre-de-la-spec`. Se reservan `001` para núcleo de validación
y `002` para primer recorrido E01/E08; esa reserva no crea ni aprueba una spec.
No existe una política constitucional de commits. El equipo PUEDE aprobar una posteriormente;
las sugerencias de las plantillas no constituyen por sí mismas esa política.

### V. Estados Explícitos y Fallos Visibles

La aplicación DEBE distinguir el resultado matemático (`correct`, `incorrect`, `indeterminate`)
de una entrada incompleta/no válida y de un error técnico. Un resultado indeterminado o una falla
de API no DEBE convertirse en respuesta incorrecta.

`correct`, `incorrect` e `indeterminate` son resultados matemáticos. `incomplete` es un estado de
entrada del cliente y no un resultado matemático; una entrada incompleta o inválida DEBE tratarse
como error estructural, no como `incorrect`. Un error técnico es una categoría distinta. La API
DEBE devolver solo los tres resultados matemáticos y no DEBE devolver `incomplete` como resultado.

El Backend DEBE limitar las operaciones al Banco de ejercicios y devolver resultados conforme al
contrato expresado en la spec aprobada. El [Contrato de API](../../docs/politicas/contrato-api.md)
es una referencia técnica para prepararlo. Los errores HTTP no DEBEN ocultarse con valores por
defecto ni presentarse como respuestas exitosas.

En Modo estático, la aplicación DEBE indicar que la evaluación fue local. No DEBE afirmar que se
ejecutó FastAPI/SymPy si no ocurrió. La selección o activación del fallback DEBE ser explícita;
no DEBE cambiarse de modo silenciosamente. La spec consumidora DEBE definir la acción o
configuración que autoriza el cambio, el tratamiento de una respuesta API pendiente y la forma de
volver al Modo conectado. Sin esas reglas aprobadas, el cambio de modo permanece bloqueado.

SymPy DEBE operar solo sobre formatos y familias admitidos. Cuando no pueda decidir dentro de un
contrato admitido, DEBE informar `indeterminate`; cuando falle el servicio, DEBE devolver el error
técnico correspondiente. No se DEBE confiar en `asyncio.wait_for` como garantía de interrumpir
cómputo síncrono. La ausencia de una gramática aprobada permanece bloqueada conforme al
Principio III y no equivale a un resultado matemático indeterminado.

Las respuestas públicas no DEBEN incluir trazas internas. Los errores internos DEBEN registrarse
con contexto técnico suficiente y respetando [Privacidad](#idioma-privacidad-y-accesibilidad).
El cliente DEBE comunicar fallos de red y almacenamiento; no DEBE afirmar que guardó el progreso
si LocalStorage no está disponible. No DEBE sobrescribir ni descartar silenciosamente datos
corruptos o de esquema desconocido. La recuperación DEBE documentarse y verificarse con la
evidencia exigida por la spec, sin imponer por esta regla una técnica de prueba automatizada.
La spec de progreso DEBE conservar las decisiones aprobadas en el GDD v0.1: versión del progreso,
niveles resueltos, borrador del nivel activo, intentos evaluados, mayor pista consultada y
preferencias. También DEBE definir el momento de guardado, el reinicio y el comportamiento ante
versión incompatible o almacenamiento no disponible.

### VI. Spec-Driven Development y Asistencia por IA con Autorización

Antes de trabajar, el agente DEBE leer esta Constitución, la spec afectada y el contexto relevante.
DEBE aplicar la [jerarquía normativa](#autoridad-normativa), el
[flujo de trabajo](#flujo-de-trabajo-y-puertas-de-calidad) y las puertas del Principio VII.

El agente DEBE distinguir confirmado, propuesto, pendiente y realizado/verificado. No DEBE
declarar implementado, aprobado, probado o desplegado lo que solo está documentado. Ante ambigüedad
que afecte comportamiento, arquitectura, persistencia, compatibilidad o alcance, DEBE preguntar
al Aprobador o registrar una propuesta explícita; no DEBE elegir silenciosamente.

Los cambios funcionales DEBEN comenzar creando o actualizando `spec.md` con problema, alcance,
requisitos observables, escenarios, aceptación, supuestos, exclusiones y decisiones pendientes.
Si afectan reglas constitucionales, DEBEN seguir también el procedimiento de enmienda. Los cambios
DEBEN limitarse al alcance autorizado, conservar comportamiento no afectado y mantener trazables
los contratos y documentos relacionados; una necesidad de actualización no autoriza editar fuera
del alcance concedido.

La IA PUEDE asistir en análisis, redacción, código y revisión, pero el equipo humano DEBE revisar
y asumir cada resultado antes de presentarlo como propio. El agente no DEBE fabricar evidencias,
aportes, pruebas, decisiones ni autoría. Los créditos y anexos DEBEN describir trabajo realmente
realizado por cada integrante; una sugerencia generada por IA no demuestra participación humana.

La instalación actual de Spec Kit está autorizada. No se DEBE reinstalar, actualizar ni alterar
su configuración sin aprobación expresa. La aprobación de implementación solo permite instalar
las dependencias enumeradas y aprobadas en el plan; cualquier dependencia adicional DEBE recibir
autorización específica. Crear infraestructura, publicar o ejecutar cambios operativos DEBE
contar con autorización expresa para esas operaciones.

**Razón:** SDD y el etiquetado de certeza mantienen separadas las decisiones humanas, las propuestas
del agente y la evidencia real de ejecución.

### VII. Control Humano y Aprobación Explícita de Etapas (Human-in-the-Loop)

**Estado:** en vigor desde la ratificación de 2026-11-16. No se afirma que rigiera
retroactivamente durante la versión 0.2.0.

Ningún agente DEBE avanzar automáticamente entre especificación, planificación, descomposición de
tareas e implementación sin revisión y autorización explícita del
[Aprobador](#aprobador-y-suplencia). Cada etapa DEBE tratarse como independiente: aprobar una etapa
no autoriza automáticamente las posteriores.

Al finalizar cada etapa, el agente DEBE detenerse, presentar el resultado y solicitar autorización.
El silencio, la ausencia de respuesta o la falta de objeción no constituyen aprobación. No DEBE
realizarse implementación ni modificación fuera del alcance autorizado; las instalaciones se rigen
por el Principio VI. Las correcciones solicitadas autorizan su atención dentro de la etapa revisada,
pero no equivalen a aprobarla.

Una aprobación cubre el **contenido revisado**: requisitos, criterios de aceptación, supuestos,
exclusiones, decisiones de diseño, definiciones de tareas y dependencias. Modificar ese contenido
DEBE reabrir su etapa para revisión y nueva aprobación; no se DEBE reutilizar la aprobación de una
versión anterior como autorización de la modificada.

Los **metadatos operativos** PUEDEN añadirse sin reabrir por sí mismos el contenido aprobado:
registros de aprobación, enlaces de evidencia, resultados de verificación y estado de ejecución de
tareas dentro de una implementación autorizada. Marcar una tarea como iniciada o completada no
autoriza cambiar su descripción, alcance o dependencias. El registro inicial de una aprobación en
el propio artefacto tampoco invalida la decisión que documenta.

Cuando se reabra el contenido de una spec, plan o lista de tareas, el avance dependiente DEBE
suspenderse hasta registrar una evaluación de impacto. La evaluación DEBE identificar los
artefactos afectados y no afectados. Los afectados DEBEN actualizarse y revalidarse; los no
afectados solo PUEDEN retomar su aprobación previa cuando el Aprobador registre expresamente la
ausencia de impacto. No se DEBE asumir que una autorización anterior cubre requisitos modificados.
Cada decisión DEBE registrarse conforme al [registro de aprobaciones](#registro-de-aprobaciones).

**Razón:** las pausas y la evidencia de autorización impiden que una propuesta avance por inercia
y permiten identificar quién autorizó cada etapa y qué versión revisó.

## Restricciones Adicionales

### Stack tecnológico y responsabilidades

El stack de producto está resuelto: React.js, PixiJS, Mafs/SVG y Python con librerías
especializadas (FastAPI/SymPy y las que apruebe el plan). No se adopta un motor de juego dedicado.
La independencia de motor que describe el GDD es una decisión de diseño, no una autorización para
sustituir estas tecnologías. «Mafs/SVG» se refiere al renderizado dentro de la capa React/Mafs.
Una biblioteca o servicio adicional DEBE aprobarse en el plan correspondiente.

| Tecnología | Responsabilidad | Estado |
|---|---|---|
| React + TypeScript | Interfaz, navegación y estado de aplicación | Confirmados; versiones y compilación pendientes |
| PixiJS | Interacción y representación de la Zona 1 | Confirmado |
| Mafs | Gráficas y controles de las Zonas 2–5 | Confirmado |
| FastAPI | API HTTP del Backend | Confirmado |
| SymPy | Validación simbólica acotada | Confirmado; no se presume que resuelva cualquier entrada |
| LocalStorage | Progreso local en el navegador y mismo origen | Confirmado; sin sincronización ni almacenamiento del progreso en Backend |
| Modo estático | Respaldo con validadores o respuestas precalculadas revisados para quince Ejercicios | Contingencia aprobada; no acredita implementación |

Las versiones exactas, las herramientas de build y la compatibilidad de dependencias DEBEN
concretarse en el plan aprobado, sin reabrir la elección de tecnologías.

### Decisiones matemáticas confirmadas

| Ejercicio | Regla y respuesta de referencia |
|---|---|
| E01 | `R={(1,4),(2,4),(3,5)}` con dominio `{1,2,3}` es función; se permite compartir imagen |
| E05 | `√(x−2)`; dominio `[2,+∞)` y rango `[0,+∞)` |
| E06 | `5/(x−3)`; dominio `ℝ \ {3}` |
| E08 | Construcción desde el vértice `(3,2)` con `a=1`; objetivo `(x−3)²+2` |
| E15 | `x+2` para `x<0` y `(x−3)²+2` para `x≥0`; `f(0)=11` y `f(−2)=0` |

Las reglas generales de experiencia quedaron aprobadas en el GDD v0.1: progresión secuencial,
reintentos ilimitados, ausencia de temporizador, vidas, puntos e insignias, ayudas voluntarias
H1–H3, repetición de niveles resueltos, guardado local y victoria al completar 15/15. Las specs
DEBEN traducir estas decisiones a requisitos verificables antes de implementarlas, sin reabrirlas
por inferencia técnica. Los formatos concretos de respuesta y validación siguen sujetos a sus
contratos y specs correspondientes.

### Contrato mínimo de experiencia jugable

Antes de aprobar una spec que introduzca o modifique experiencia jugable, esta DEBE definir de
forma observable:

1. acciones disponibles para el jugador y respuestas del sistema;
2. estados y transiciones de Ejercicio, Zona y, cuando corresponda, juego;
3. condiciones de inicio, completación y finalización;
4. reintentos y tratamiento de respuestas incorrectas, incompletas o fallos técnicos;
5. ayudas, su orden o activación y sus efectos sobre intentos, progreso o recompensas;
6. desbloqueos, progresión y datos de progreso afectados;
7. elementos expresamente no aplicables, en lugar de dejarlos implícitos.

Cada Ejercicio E01–E15 DEBE documentar como mínimo: ID, Zona, objetivo educativo, enunciado,
interacción, tipo de respuesta, restricciones, solución, ayudas y condición de finalización. El
formato editorial es flexible; una tabla, ficha, estructura de datos o secciones equivalentes son
válidas si conservan esos campos y su trazabilidad. El esquema técnico y su validación pertenecen
al plan, `data-model.md` o `contracts/`, según corresponda.

La spec DEBE describir qué observa y puede hacer el jugador. El plan DEBE explicar cómo se
implementa con el stack aprobado. Los modelos y contratos DEBEN definir estados, datos, formatos e
interfaces sin trasladar decisiones técnicas innecesarias a la spec.

### Obligaciones académicas y entregable final

La [consigna académica]](../../docs/consigna.md) tiene prioridad conforme a Governance. FUNctions
DEBE entregarse como juego educativo digital, gamificado, original y funcional. La creatividad
DEBE mantenerse dentro de un alcance realista y el contenido matemático DEBE ser correcto y
adecuado al nivel del curso.

El documento final del equipo DEBE prepararse en Markdown por decisión del proyecto e incluir:

1. portada con los nombres completos de los integrantes confirmados;
2. nombre del juego y sinopsis de máximo 100 palabras;
3. objetivo de aprendizaje;
4. reglas y mecánica del juego;
5. los quince Ejercicios empleados, dentro del límite académico de 10–20, con sus soluciones;
6. créditos y aportes efectivamente realizados por cada integrante;
7. enlace al juego, cuyo acceso abierto DEBE verificarse antes de la entrega;
8. anexos con evidencia real de participación, originalidad y autoría.

Video, bitácora y capturas son ejemplos permitidos de evidencia; la consigna no exige presentar
los tres. La documentación y la interfaz dirigida al estudiante DEBERÍAN usar frases claras,
vocabulario accesible y lenguaje matemático adaptado al público de bachillerato.

Las decisiones y verificaciones del producto DEBEN considerar la rúbrica académica completa:

| Criterio | Ponderación |
|---|---:|
| Integración correcta del contenido matemático | 25 % |
| Diseño y mecánica clara, coherente y original | 20 % |
| Enfoque educativo y propósito formativo | 20 % |
| Documento con toda la estructura solicitada | 15 % |
| Trabajo colaborativo y organización | 20 % |

La fecha de entrega es 2026-11-17. No se DEBE inventar una hora ni un canal a partir de la
consigna; cualquier confirmación posterior DEBE registrarse con su evidencia. La Constitución
no acredita que el juego, enlace, documento o anexos estén terminados.

### Idioma, privacidad y accesibilidad

La interfaz y la documentación DEBEN estar en español; los identificadores técnicos y encabezados
requeridos por las plantillas conservan su función de interoperabilidad.
El producto no DEBE recopilar datos personales ni utilizar analítica externa. Código, ejemplos,
registros operativos y LocalStorage no DEBEN contener secretos, credenciales ni datos personales.
Los nombres y roles del registro de gobernanza identifican a los autores de decisiones; no
constituyen datos de estudiantes recopilados por la aplicación.

Toda interfaz jugable DEBE ser operable por teclado en sus acciones esenciales, mostrar foco
visible, asociar etiquetas a los controles y comunicar estado o retroalimentación sin depender
exclusivamente del color. Cada spec con UI DEBE concretar cómo cumple este mínimo y cualquier
necesidad adicional aplicable.

Durante la especificación se DEBEN identificar riesgos materiales de rendimiento, compatibilidad
o accesibilidad. Cuando exista un riesgo material, la spec DEBE establecer una condición observable
y verificable antes de aprobar el plan. Si no existe, no se exige inventar un umbral ni una sección
artificial.

FUNctions es una aplicación web que se ejecuta en navegador; no se adopta una aplicación nativa ni
un motor de juego dedicado. El objetivo de diseño aprobado en el GDD v0.1 es computadora y tableta,
con mouse y pantalla táctil. Los navegadores, versiones y el eventual soporte de teléfonos móviles
DEBEN decidirse en la spec de UI correspondiente; esta Constitución no los presume.

## Flujo de Trabajo y Puertas de Calidad

### Etapas y artefactos de Specify

1. **Especificación:** `/speckit.specify` DEBE producir `spec.md` conforme a la plantilla activa,
   conservando los identificadores y la trazabilidad del Principio IV.
2. **Revisión y aprobación de la especificación:** `/speckit.checklist` DEBE revisar la calidad
   de requisitos antes del veredicto. Toda ambigüedad que afecte el incremento DEBE devolverse a
   la etapa de spec y resolverse antes de autorizar la planificación de ese requisito y sus
   dependencias. El veredicto DEBE registrarse después de esas correcciones.
3. **Planificación:** `/speckit.plan` DEBE elaborar `plan.md`, `research.md`, `data-model.md`,
   `quickstart.md` y `contracts/` dentro de la carpeta de la spec. El Constitution Check DEBE
   realizarse antes de Phase 0 (investigación) y nuevamente después de Phase 1 (diseño).
4. **Revisión y aprobación del plan:** DEBE revisarse el conjunto de artefactos de planificación
   y registrarse el veredicto antes de autorizar la descomposición de tareas.
5. **Descomposición de tareas:** `/speckit.tasks` DEBE generar `tasks.md` después del plan,
   con dependencias y vínculos a requisitos, aceptación e historias cuando corresponda.
6. **Revisión y aprobación de las tareas:** DEBE registrarse el veredicto y la autorización de
   implementación antes de ejecutar las tareas.
7. **Implementación y verificación:** `/speckit.implement` DEBE ejecutar solo el alcance autorizado,
   reunir la evidencia exigida y presentar el cierre para revisión según el Principio VII.

Las puertas humanas se rigen por el Principio VII, aunque una plantilla o workflow no las incluya.
Las fases internas de planificación no sustituyen las etapas y aprobaciones anteriores.

### Comandos de calidad y bloqueos

- Una ambigüedad DEBE bloquear el requisito afectado y los artefactos o tareas que dependan de él,
  no trabajo independiente del proyecto. `/speckit.clarify` DEBE ejecutarse para las ambigüedades
  expresables como requisitos. Si una ambigüedad técnica aparece durante la planificación, el flujo
  DEBE volver a la etapa de spec y registrar allí la necesidad o restricción observable; la solución
  técnica concreta DEBE permanecer en el plan después de reaprobar la spec. No se DEBEN introducir
  detalles de implementación en la spec ni resolver ambigüedades inventando decisiones.
- `/speckit.checklist` DEBE utilizarse antes de aprobar la spec. Los elementos marcados acreditan
  revisión de requisitos, no aprobación, implementación ni pruebas del producto.
- `/speckit.analyze` no es obligatorio. Antes de autorizar implementación, el Aprobador DEBE
  revisar manualmente la consistencia y trazabilidad entre spec, plan y tareas, y registrar el
  resultado. Un bloqueo detectado en esa revisión DEBE corregirse o contar con una excepción
  constitucional aprobada y registrada conforme a [Excepciones](#excepciones).
- `/speckit.converge` es opcional; su ejecución no sustituye las puertas humanas.

El workflow instalado no incorpora una puerta de revisión de tareas ni todos estos pasos de
calidad. Mientras se resuelve esa desalineación, el agente DEBE aplicar las pausas y revisiones
explícitas; no DEBE interpretar la continuidad del workflow como permiso de implementación.

### Pruebas, métricas y definición de terminado

Las pruebas manuales documentadas son obligatorias para componentes y flujos de UI. La evidencia
DEBE identificar el componente o flujo, el criterio revisado, el procedimiento y el resultado.
No existe una obligación constitucional de crear pruebas automatizadas, incluso para validadores
matemáticos, contratos de API, paridad entre modos o persistencia. Las verificaciones manuales
reproducibles son válidas si satisfacen el método y la evidencia aprobados. Las specs PUEDEN imponer
pruebas automatizadas adicionales; cuando una spec las exige, DEBEN ejecutarse y documentarse.
Esta regla no prohíbe automatizar pruebas.

Cada `AC` DEBE expresar como mínimo una precondición, una acción o entrada y un resultado observable.
Los efectos sobre estado o guardado DEBEN indicarse cuando apliquen. La estrategia de verificación
de la spec DEBE indicar método y evidencia para sus AC, sin exigir que esos campos se repitan dentro
de cada redacción. Las specs PUEDEN usar latencia de validación, precisión de validadores,
accesibilidad o tasa de errores de formato como criterios medibles cuando exista riesgo material.
Cada métrica adoptada DEBE definir método, evidencia y condición de aceptación; no se DEBEN inventar
umbrales ni presentar estimaciones como mediciones.

Para declarar terminado un incremento, DEBEN estar resueltos sus criterios de aceptación y
verificaciones exigidas, incluida la evidencia manual de UI cuando corresponda, y las revisiones
y aprobaciones aplicables DEBEN estar registradas. Una excepción se rige exclusivamente por
[Excepciones](#excepciones). No se DEBE declarar una funcionalidad verificada sin la evidencia
exigida por su spec. Completar una checklist o generar archivos no acredita este cierre.

## Governance

### Autoridad normativa

La jerarquía DEBE aplicarse en este orden:

1. Requisitos académicos aplicables.
2. Constitución ratificada.
3. Specs aprobadas.
4. Instrucciones operativas del Aprobador dentro del marco anterior.
5. Documentos técnicos de referencia.

Los documentos de `development/docs/politicas/` son referencias técnicas no oficiales y no crean
obligaciones por sí mismos. El Glosario, la Estructura, las Convenciones y el Contrato de API
PUEDEN orientar una spec; una obligación DEBE estar expresada en la Constitución o en una spec
aprobada. Una instrucción operativa no DEBE alterar una regla constitucional sin enmienda.
Ante un conflicto no resuelto, el agente DEBE solicitar aclaración al Aprobador y registrar el
bloqueo, sin elevar un borrador o referencia a norma.

### Aprobador y suplencia

- **Aprobador principal:** Edwin Ernesto Rodríguez Pérez, coordinador del proyecto.
- **Aprobador suplente:** Danny Mauricio Trujillo; PUEDE aprobar cuando el principal no esté
  disponible.

Edwin, Danny y María integran el equipo del proyecto. La aprobación de Edwin representa al equipo
para efectos de SDD. Cuando un documento registre «aprobación del equipo», DEBE identificar al
Aprobador que emitió la decisión; el equipo no es una autoridad SDD separada. La participación en
redacción, pruebas o revisión no convierte a una persona ni al agente en Aprobador. La autorización
y sus límites se rigen por el Principio VII.

### Registro de aprobaciones

Cada decisión de aprobación de una etapa SDD DEBE registrarse tanto en
[specs/README.md](../../specs/README.md) como en un bloque `## Aprobaciones` del artefacto
correspondiente. Ambos registros DEBEN referir la misma decisión y contener:

| Campo obligatorio | Contenido |
|---|---|
| Etapa | Etapa sometida a revisión |
| Veredicto | `aprobado`, `rechazado` o `en revisión` |
| Fecha | Fecha real en formato `YYYY-MM-DD` |
| Autoridad | Nombre y rol de quien autorizó |
| Evidencia | Enlace a commit, mensaje o acta que acredita la decisión |
| Versión o revisión | Versión declarada; si no existe, commit o identificador de revisión del contenido |
| Comentarios o condiciones | Condiciones de la decisión o indicación explícita de que no hay condiciones |

El agente DEBE transcribir decisiones acreditadas, no atribuir aprobaciones por inferencia.
Las autorizaciones de avance DEBEN identificar la siguiente etapa permitida. Este cambio está
limitado al archivo constitucional; actualizar los registros externos queda como acción posterior.

La ratificación de la Constitución no se registra en `specs/README.md`: DEBE constar en la sección
[Registro de ratificación](#registro-de-ratificación) y en el pie de este documento. Añadir registros
de aprobación, evidencia o ejecución conforme al Principio VII es metadato operativo y no reabre
por sí mismo el contenido que identifica.

### Excepciones

Solo el Aprobador o su suplente PUEDE autorizar una excepción a la Constitución. La excepción
DEBE usar el registro de aprobación e indicar regla afectada, motivo, alcance, fecha, responsable
y etapa para la que se concede. DEBE caducar al cerrar esa etapa. No modifica permanentemente
la Constitución ni PUEDE aprobarse por silencio. Una excepción permanente DEBE tramitarse como
enmienda constitucional.

Al cerrar la etapa, la excepción DEBE incluir un balance que identifique: obligaciones satisfechas,
obligaciones dispensadas temporalmente y obligaciones pendientes. Una dispensa no DEBE describirse
como verificación exitosa ni trasladarse automáticamente a otra etapa. Si una obligación pendiente
es necesaria para la etapa siguiente, el avance DEBE permanecer bloqueado hasta cumplirla o aprobar
una nueva excepción limitada a esa etapa.

### Enmiendas, revisión y ratificación

La Constitución DEBE revisarse formalmente cuando se proponga una enmienda; no se establece una
revisión periódica. El procedimiento DEBE ser:

1. Registrar motivación, alcance, reglas afectadas e impacto documental de la propuesta.
2. Preparar la redacción identificándola como propuesta, con versión y fecha de modificación.
3. Obtener y registrar aprobación explícita de la enmienda y su ratificación por el Aprobador
   o suplente; redactar el archivo no equivale a ratificarlo.
4. Registrar la fecha real de ratificación y coordinar las actualizaciones externas autorizadas.
   Los enlaces relativos DEBEN verificarse; las rutas futuras no DEBEN presentarse como enlaces
   a archivos existentes. Las acciones fuera del alcance DEBEN quedar registradas para después.

La política de versiones distingue MAJOR para eliminaciones o redefiniciones incompatibles de
gobernanza, MINOR para nuevos principios o ampliación material y PATCH para aclaraciones sin
cambio semántico. Durante la etapa previa a la primera ratificación se usa `0.MINOR.PATCH`;
la revisión material de alcance, tipos de respuesta y stack se preparó como **0.5.0** y, al ser
la primera versión ratificada, se promueve a **1.0.0**. No se presume ratificación automática de
versiones posteriores.

La Constitución quedó ratificada el 2026-11-16 y el Principio VII entra en vigor desde esa fecha.
El pie identifica la versión ratificada. El informe temporal de impacto fue retirado.

### Registro de ratificación

La propuesta 0.5.0 fue ratificada como versión 1.0.0. La ratificación se completó con la
finalización administrativa, sin reabrir el contenido normativo: retiro del Sync Impact Report
temporal, cambio de estado a ratificada, promoción de la primera versión ratificada a `1.0.0` y
registro de fecha, autoridad y evidencia.

| Campo | Estado actual |
|---|---|
| Versión | 1.0.0 |
| Veredicto | aprobado |
| Fecha | 2026-11-16 |
| Autoridad | Edwin Ernesto Rodríguez Pérez, Aprobador principal |
| Evidencia | aprobación explícita del Aprobador en la sesión de trabajo del 2026-11-16, tras revisión de C-01…C-05 |
| Condiciones | ninguna |

Los metadatos de ratificación no alteran el contenido normativo aprobado. Cualquier cambio
normativo posterior DEBE prepararse como una nueva revisión conforme a esta sección.

**Version**: 1.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-16
