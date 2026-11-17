# Conclusión de respuestas — FUNctions

Actualización: 15 de noviembre de 2026. Consolidación documental; implementación no iniciada.

## 1. Fuentes y estado de la información

- **Requisitos académicos:** `docs/consigna.md`, leído completo. Tiene prioridad para los entregables, límites y evaluación.
- **Respuestas iniciales:** `respuestas.csv`, generado el 14/11/2026 a las 18:43:06 UTC. Se conserva como registro original; sus datos anteriores no reemplazan las aclaraciones posteriores.
- **Propuesta posterior:** «FUNctions: El Código de las Curvas», arquitectura híbrida, rompecabezas y enfoque en la Zona de Desarrollo Próximo (ZDP).
- **Confirmaciones Q1–Q5:** FUNctions, MIT, mantener logarítmicas, arquitectura híbrida, María tester y documento `.md`.
- **Última actualización del stack:** confirmados React + TypeScript, PixiJS en zona 1, Mafs en zonas 2–5, FastAPI + SymPy y LocalStorage. Sustituye la preferencia anterior sin React y la recomendación de SVG nativo. Se mantienen 15 ejercicios (3 por zona) y el respaldo estático aprobado.
- **Decisiones actuales de contenido:** inclusión definitiva de radicales E05 y racionales E06; E01 reconoce la función; E08 construye desde el vértice; E15 usa `(x−3)²+2` en la rama no negativa. Sustituyen las variantes anteriores. Véase el [banco canónico](./banco_ejercicios.md).
- **Organización del producto:** repositorio local en `development/`; banco, guía técnica y políticas dentro de `development/docs/`. Las rutas anteriores de esos documentos conservan enlaces.
- **Siguiente incremento:** [especificación del núcleo de validación](../specs/001-nucleo-validacion/spec.md) preparada para revisión. El [GDD v0.1](./workspace/GDD_FUNctions_v0.1.md) ya aprueba ayudas, reintentos y progreso; los contratos y herramientas de implementación continúan sujetos al flujo SDD.
- **Contexto técnico:** `docs/server-stats.md` contiene snapshots del servidor, no mediciones actuales del juego.

Este documento consolida las decisiones actuales. **Resuelto significa decisión acordada, no funcionalidad implementada ni entregable terminado.** El proyecto continúa en planificación; no se ha verificado que el juego, despliegue o pruebas estén terminados.

## 2. Requisitos, entregables y evaluación de la consigna

- Materia: Matemática para Computación I, DMC1109, UES, ciclo II–2026.
- Actividad: Proyecto final — Gamifiquemos.
- Equipo: 2 o 3 estudiantes. Calificación grupal; valor del proyecto: **15% de la asignatura**.
- Entrega: **martes 17 de noviembre de 2026**, por el coordinador. No se indica hora ni canal; no se debe asumir 23:59.
- Juego educativo digital original, creado por los estudiantes y funcional. Se recomienda creatividad realista; se valora lenguaje claro y accesible.
- Puede elegirse un tema del curso. En el archivo figura Funciones como tema seleccionado. Las plataformas enumeradas son sugerencias, no obligatorias; se registra desarrollo propio en Python u otro lenguaje y publicación web con código abierto.

El documento debe contener:

1. Portada con nombres completos. (Actualmente hechas)
2. Nombre del juego y sinopsis de **máximo 100 palabras**. (Nombre "FUNctions")
3. Objetivo de aprendizaje.
4. Reglas y mecánica.
5. **Entre 10 y 20 ejercicios empleados con sus soluciones**. (Ya realizados)
6. Créditos y roles: qué realizó cada integrante.
7. Enlace al juego con acceso abierto verificado.
8. Anexos que demuestren participación y autoría. Se sugieren video de 1–2 minutos, bitácora o capturas; no se exige presentar los tres.

| Criterio | Peso | Qué debe evidenciarse |
|---|---:|---|
| Integración del contenido matemático | 25% | Conceptos correctos, bien aplicados y acordes al nivel del curso |
| Diseño y mecánica de juego | 20% | Reglas claras, coherencia y originalidad |
| Enfoque educativo | 20% | Propósito formativo claro y promoción del aprendizaje |
| Documento presentado | 15% | Toda la estructura solicitada |
| Trabajo colaborativo y organización | 20% | Participación equitativa, coordinación y buen uso del tiempo |

La consigna no establece stack, licencia específica, formato de archivo, cantidad de zonas ni métricas de rendimiento. El nombre de la tutora está vacío.

## 3. Decisiones resueltas

| Aspecto | Decisión vigente | Fuente / alcance |
|---|---|---|
| Nombre | **FUNctions** | Q1;«FUNctions es definitivo» |
| Licencia | **MIT** | Q1; reemplaza Apache 2.0 |
| Tema | Funciones | Respuestas originales y confirmaciones |
| Familias | Lineales, cuadráticas, exponenciales y **logarítmicas** | Q2 confirma mantener las logarítmicas |
| Familias secundarias | **Radicales y racionales incluidas definitivamente** | E05=√(x−2), E06=5/(x−3); decisión del usuario que sustituye la exclusión anterior |
| Ejercicios | **15: tres por cada una de cinco zonas** | Última confirmación; sustituye 10 y resuelve «al menos 5» |
| Respaldo | **Versión estática jugable con respuestas precalculadas** | Aprobado si falla la publicación de la API; documentar la arquitectura realmente entregada |
| Contenidos transversales | Dominio, rango y gráficas | Respuestas originales; propuesta añade existencia/unicidad, evaluación y preimágenes |
| Público | Estudiantes de bachillerato | Respuesta original vigente |
| Dificultad | Mixta con progresión | Respuesta original vigente; zonas aún por detallar |
| Arquitectura | **React + TypeScript; PixiJS zona 1; Mafs zonas 2–5; FastAPI + SymPy** | Stack híbrido confirmado en la última actualización |
| Persistencia | **LocalStorage** | Confirmada; progreso local en el navegador, sin base de datos de progreso en servidor |
| Despliegue | Servidor propio | Respuesta original vigente; URL del juego pendiente |
| Acceso | Compromiso de acceso abierto | Confirmado en el formulario; falta comprobarlo con el juego publicado |
| Documento | **Markdown (`.md`)** | Q5; sustituye «Otro» sin especificar |
| Elaboración documental | Apoyo de IA en archivos .md; el equipo elabora el documento final | Observaciones originales |
| Lenguaje | Frases cortas, palabras sencillas y lenguaje matemático adaptado | Respuesta original vigente |
| Evidencias seleccionadas | Capturas, historial de commits y otra evidencia por especificar | Respuesta original; video y bitácora no seleccionados |

### Equipo y roles

| Integrante | Rol confirmado |
|---|---|
| Edwin Ernesto Rodríguez Pérez | Coordinador, desarrollador y encargado de la entrega |
| Danny Mauricio Trujillo | Pruebas y subcoordinación |
| María Erika González Ortez | **Tester** (Q5) |

La distribución específica de casos de prueba entre Danny y María sigue por acordar; los créditos finales deberán reflejar trabajo efectivamente realizado.

## 4. Diseño de la propuesta vigente

### Tipo, narrativa y sinopsis

El diseño aprobado define un **rompecabezas 2D interactivo con narrativa**. Un satélite de exploración tiene un fallo y la persona jugadora integra el equipo técnico de ESAI (El Salvador Aerospace Institute), representado de forma ficticia dentro del juego, para reparar sus circuitos matemáticos.

Sinopsis aportada en la propuesta (menos de 100 palabras):

> En una línea temporal alternativa donde la carrera espacial nunca terminó y los viajes al espacio son cotidianos, el jugador forma parte del equipo de ingeniería de ESAI. Un satélite de exploración ha sufrido una falla y sus cinco sistemas deben repararse mediante quince retos sobre funciones. Al reconocer relaciones, analizar dominios y rangos, ajustar trayectorias y resolver modelos exponenciales, logarítmicos y por tramos, el jugador restaura el satélite mientras recibe retroalimentación y ayudas progresivas.

Esta sinopsis incluye las familias matemáticas principales y está aprobada para el documento final.

### Reglas y enfoque ZDP

- Estructura: **5 zonas consecutivas, 3 ejercicios por zona**. El banco canónico contiene las fichas consolidadas; las secciones 9–11 de este documento conservan antecedentes históricos. Los criterios adicionales C01–C07 del banco requieren revisión.
- El avance requiere completar todos los campos obligatorios de cada Ejercicio.
- Se permiten reintentos ilimitados, sin temporizador ni pérdida de vidas.
- H1 está disponible desde el inicio; H2 se habilita después de H1 y H3 después de H2.
- Ante el error se conserva el reto, se ofrece retroalimentación específica y se sugiere la siguiente ayuda disponible.
- No se utilizan puntos ni insignias; el progreso se expresa mediante niveles completados y sistemas reparados.
- Las Zonas se habilitan en orden, los niveles resueltos pueden repetirse y la victoria exige completar 15/15.
- LocalStorage conserva versión del progreso, niveles resueltos, borrador activo, intentos evaluados, mayor pista consultada y preferencias.

### Mecánicas descritas

| Mecánica | Aprendizaje | Interacción / validación propuesta | Pendiente |
|---|---|---|---|
| Máquina de Enlaces | Existencia y unicidad de una función A → B | Arrastrar cables; validar localmente exactamente una salida por elemento de A. Se permiten imágenes repetidas en B | Casos concretos y progresión de ayudas |
| Escáner de Proyección | Dominio, rango, extremos excluidos y asíntotas | Cortinas de luz y selección de intervalos; backend Python con SymPy para restricciones y equivalencia | Validación del rango además del dominio; uniones e infinitos; incluir restricciones logarítmicas |
| Sintonizador de Trayectorias | Evaluación, parámetros y todas las preimágenes | Diales y curvas en el navegador; resolver f(x)=y en backend y comparar conjuntos completos | Incluir logarítmicas, dominio de cada ejercicio y reglas de igualdad/tolerancia |

La inclusión de radicales y racionales está confirmada: se conservan los ejercicios E05/E06 de la matriz del equipo. E15 combina x+2 para x<0 con (x−3)²+2 para x≥0, de modo que f(−2)=0 y f(0)=11. E01 es de reconocimiento; E08 de construcción desde el vértice, no de completación de cuadrados.

### Objetivo educativo

El objetivo aprobado busca comprender funciones reales, interpretar sus expresiones y gráficas, evaluar funciones, hallar dominio/rango, relacionar representaciones y demostrar lo aprendido mediante desafíos interactivos. La antigua meta del 80% de participantes fue retirada porque no existía una medición definida.

Los objetivos específicos originales son comprender, interpretar, aplicar, relacionar y evaluar. La propuesta añade objetivos concretos por mecánica y enfoque ZDP.

El objetivo general final está incorporado en `docs/Doc_Final_Proyecto.md`. Completar un Ejercicio exige responder correctamente todos sus campos; consultar H3 se registra como finalización asistida, pero no reduce el progreso ni impide completar la misión.

## 5. Arquitectura y stack confirmados; detalles de implementación pendientes

Arquitectura híbrida significa separar cliente web y servidor Python. La última corrección confirma **React + TypeScript**, **PixiJS para zona 1**, **Mafs para zonas 2–5**, **FastAPI + SymPy** y **LocalStorage**. La alternativa sin React con SVG nativo deja de ser la dirección vigente. React administra interfaz y estado; PixiJS y Mafs se reparten zonas, no renderizan a la vez una misma escena.

| Capa | Dirección actual | Estado |
|---|---|---|
| Base del cliente | React 18 + TypeScript | Confirmado; fijar versiones exactas y herramienta de compilación |
| Zona 1 | React + PixiJS | Confirmado; elegir integración con adaptador compatible o canvas gestionado por React |
| Zonas 2–5 | React + Mafs | Confirmado para gráficas, controles matemáticos y visualización de ayudas |
| Estilos | Tailwind CSS compilado | Se conserva del stack propuesto; no necesita React ni un runtime de estilos en producción |
| API REST Python | FastAPI; ejecución con Uvicorn | FastAPI confirmado; versiones y configuración operativa pendientes |
| Matemática simbólica | SymPy | Confirmado; definir expresiones soportadas y comparación exacta |
| Persistencia | LocalStorage | Confirmado para progreso en el mismo navegador; no sincroniza entre dispositivos |
| Proxy y estáticos | Nginx | Integración por definir con los servicios existentes y Tailscale Funnel |
| Alojamiento | Servidor propio | Resuelto; configuración y URL pendientes |
| Licencia del proyecto | MIT | Resuelto |

Flujo acordado: React/TypeScript mantiene estado → PixiJS (zona 1) o Mafs (zonas 2–5) dibujan la interacción → comprobación local o solicitud a FastAPI → SymPy verifica la respuesta matemática → resultado y ayuda ZDP → React actualiza la interfaz y guarda progreso en LocalStorage. Existe un [contrato inicial propuesto](./politicas/contrato-api.md) con prefijo `/api/v1`; los tipos necesarios para E01/E08 deben revisarse antes de implementar. **LocalStorage está en el navegador, no detrás del backend.** Puede borrarse o estar indisponible; no se contempla sincronización entre dispositivos ni SQLite para esta entrega.

Elegir versiones compatibles de React, Mafs, PixiJS y, si se utiliza, `@pixi/react`; no asumir intercambiables PixiJS 7 y 8. Cargar PixiJS al entrar a zona 1 es una optimización propuesta, no implementada. Vite puede seguir siendo una herramienta de compilación, pero no reemplaza React ni se registra como decisión confirmada. No se afirma rendimiento medido.

Contexto disponible en `docs/server-stats.md`: servidor Debian, 2 vCPU AMD A6-9225, 7.2 GiB de RAM, servicios Frappe/Education en Docker y exposición mediante Tailscale Funnel. El snapshot del 04/11/2026 informa unos 4.3 GiB disponibles. Son antecedentes, no capacidad garantizada al desplegar FUNctions; la dirección del servicio existente no se registra como URL del juego.

Las afirmaciones de la propuesta sobre «menos de 100 MB», «milisegundos», «sin sobrecarga» y funcionamiento en cualquier navegador **no están verificadas**. SymPy tampoco garantiza resolver cualquier dominio, rango o ecuación. Se requieren alcance acotado, casos de referencia y mediciones. Esto no cambia la elección híbrida.

### Correcciones técnicas antes de implementar

- El JSON recibido tenía `"preimages":` sin valor. El contrato inicial ahora usa IDs E01–E15 y campos camelCase; un ejemplo de solicitud es `{"requestId":"c1e49b67-8be8-4caf-9ea1-a593d9cdbfc5","exerciseId":"E09","answer":{"kind":"finiteSet","values":["-3","3"]}}`. Los intervalos/conjuntos deben ser estructurados; los tipos de respuesta de E01/E08 siguen pendientes de revisión.
- `simplify(a-b)==0` no basta para equivalencia de funciones si sus dominios difieren. Comprobar dominio y conjuntos de soluciones; un resultado simbólico indeterminado no se califica como error del estudiante.
- Una malla finita de puntos no demuestra equivalencia. Para los 15 ejercicios, usar soluciones precalculadas verificadas, comparadores específicos y pruebas cruzadas cliente/API; si no se puede validar, devolver un estado indeterminado y permitir reintentar.
- `asyncio.wait_for` no interrumpe por sí solo SymPy síncrono que bloquee el bucle; cancelar una espera en un hilo tampoco detiene necesariamente el cálculo. Limitar problemas y, si se necesita timeout real, aislar cómputo en un proceso con terminación controlada. El valor 1.5 s propuesto queda por medir.
- La tolerancia ±0.05 es una sugerencia, no una decisión. Definir tolerancia por interacción y escala gráfica; los intervalos, inclusiones y soluciones exactas no admiten esa tolerancia genérica.
- Para `log_a(g(x))`, exigir `g(x)>0` y `a>0`, `a≠1`. Dominio `(0,∞)`, rango real y asíntota `x=0` corresponden al logaritmo básico en su dominio máximo, no a toda composición o restricción.
- No se fuerza la apertura de 80/443: revisar el proxy/Funnel existente antes de decidir rutas. El sistema operativo ya está documentado como Debian; disponibilidad y configuración actuales siguen por comprobar.

### Respaldo aprobado

Plan A: frontend y API Python funcionales en servidor propio. Plan B aprobado: publicar un cliente estático funcional con los mismos 15 ejercicios y validadores/respuestas precalculados verificados. Hosting alternativo concreto aún pendiente. Documentar si se entrega Plan B: la API puede estar documentada en el repositorio, pero no debe afirmarse que el juego publicado la ejecuta. Ambos modos requieren probar acceso abierto, ayudas y corrección de respuestas.

## 6. Cantidad de ejercicios: resuelta

**15 ejercicios: 3 por zona en 5 zonas**, aprobados en la última consulta. Cumple el intervalo académico de 10–20. Esta decisión sustituye los 10 iniciales y resuelve la ambigüedad de «al menos 5».

Las soluciones dentro del juego, elegidas originalmente, complementan pero no reemplazan las soluciones obligatorias del documento.

## 7. Pendientes y estado por bloques del formulario

| Bloque | Resuelto o disponible | Falta |
|---|---|---|
| Equipo y plazo (1–4) | Nombre, tres integrantes, coordinador y fecha | Hora y canal de entrega; subtítulo si se desea |
| Contenido (5–11) | 15 ejercicios consolidados; objetivo final; cuatro familias principales y radicales/racionales incluidas; decisiones E01/E08/E15 confirmadas | Revisar C01–C07, fuentes y soluciones de forma cruzada; completar procedimientos en el documento; validadores |
| Diseño (12–17) | Sinopsis aprobada; ESAI; puzle 2D; mapa de cinco zonas; ayudas H1–H3; reintentos ilimitados; sin puntos, insignias, temporizador ni vidas | Implementar y probar las reglas; evidencia de originalidad |
| Tecnología (18–24) | Stack confirmado; políticas y contrato inicial propuesto; repositorio local en development; especificación E01/E08 para revisión | Aprobar especificación; plan y tareas; versiones, contratos por ejercicio, integración, compilación, remoto y URL |
| Verificación (25–26) | Danny y María testers; respaldo estático aprobado | Plan detallado de pruebas; rendimiento; comparar validadores de Plan A y B; elegir hosting alternativo |
| Documento y autoría (27–35) | .md; tres roles; capturas y commits; elaboración final por el equipo | Documento y anexos terminados; otra evidencia; plan de rúbrica; video solo si se elige |

Las evidencias de autoría siguen siendo necesarias; una narrativa original o una arquitectura no demuestran por sí solas quién realizó el trabajo. No se exige añadir un video si las evidencias elegidas cumplen el requisito.

## 8. Cambios aplicados y supuestos de planificación

- `actividades.csv`: A05 en curso por la consolidación del banco, con revisión cruzada pendiente; A07 permanece pendiente. A02b conserva las decisiones técnicas pendientes.
- `formulario.html`: 15 ejercicios preseleccionados; stack confirmado; inclusión de radicales/racionales reflejada como decisión vigente.
- `respuestas.csv`: registro original conservado. Las aclaraciones posteriores están documentadas aquí; sus valores históricos de licencia Apache, diez ejercicios, temporizador, puntos e insignias ya no son decisiones vigentes.
- La única fecha fija es 17/11/2026. Las fechas internas 14–17/11 son una propuesta de planificación que debe ajustarse al avance real. Dependencias dentro de un mismo día se ejecutan en orden.
- Se corrigió la antigua suposición de entrega a las 23:59. Se retiró la tarea de agregar anexos después de entregar: la evidencia requerida debe formar parte del documento entregado.
- No se afirma que capturas, pruebas o despliegue hayan avanzado por el solo hecho de haber definido sus responsables.

## 9. Prompt anterior — registro histórico

Este fue el prompt de una consulta anterior. **No reutilizarlo como estado vigente:** ya se aprobaron 15 ejercicios, respaldo estático, stack y posteriormente la inclusión de radicales/racionales. La arquitectura actual está en la sección 5 y el contenido actual en el banco canónico y la sección 12.

```text
Actúa como especialista en didáctica de funciones para bachillerato y arquitectura de aplicaciones educativas web con backend Python. Ayúdame a cerrar el alcance y stack de FUNctions sin confundir propuestas con decisiones confirmadas.

CONTEXTO Y DECISIONES CONFIRMADAS
- Proyecto final Gamifiquemos, Matemática para Computación I (UES). Entrega: 17/11/2026; hora y canal no indicados. Estamos planificando desde el 14/11/2026.
- Nombre definitivo: FUNctions. Licencia MIT. Documento final Markdown (.md).
- Equipo: Edwin Ernesto Rodríguez Pérez, coordinador/desarrollador y encargado de entregar; Danny Mauricio Trujillo, pruebas/subcoordinación; María Erika González Ortez, tester.
- Público: bachillerato, dificultad mixta con progresión y lenguaje sencillo.
- Mantener funciones lineales, cuadráticas, exponenciales y LOGARÍTMICAS; dominio, rango y gráficas.
- Arquitectura híbrida confirmada: frontend web + backend Python, alojados en servidor propio. El stack específico NO está cerrado.
- Consigna: juego original y funcional; documento con portada, nombre, sinopsis de máximo 100 palabras, objetivo, reglas, 10–20 ejercicios empleados con soluciones, créditos/roles, enlace abierto y anexos de autoría. Video de 1–2 minutos, bitácora y capturas son ejemplos, no todos obligatorios.
- Rúbrica: matemática 25%, diseño/mecánica 20%, enfoque educativo 20%, documento 15%, colaboración/organización 20%.
- Elegimos capturas, historial de commits y otra evidencia aún por especificar. El repositorio y enlace del juego están pendientes.
- Servidor según snapshot del 04/11/2026: Debian, 2 vCPU AMD A6-9225, 7.2 GiB RAM, aproximadamente 4.3 GiB disponibles entonces, Frappe/Education ya en Docker, exposición por Tailscale Funnel. No asumir recursos actuales ni atribuirle al juego la URL del servicio existente.

PROPUESTA A DETALLAR
Rompecabezas 2D: un técnico repara un satélite mediante 5 zonas consecutivas. Avance con 100% de precisión lógica, sin temporizador ni pérdida de vidas. Enfoque ZDP con pistas visuales, simetría cuando sea pertinente y tablas ante errores sucesivos.
1. Máquina de Enlaces: cables entre A y B; cada elemento de A debe tener exactamente una salida. Se permiten imágenes repetidas en B. Validación local propuesta.
2. Escáner de Proyección: seleccionar dominio/rango con intervalos y extremos abiertos/cerrados, apoyándose en proyecciones; validación simbólica en Python propuesta.
3. Sintonizador de Trayectorias: manipular parámetros, evaluar funciones y hallar TODAS las preimágenes; backend verifica conjuntos de soluciones.
Candidatos: React + TypeScript con Mafs y/o Phaser 3; FastAPI; SymPy; SQLite. No dar por elegidos todos los candidatos.
El objetivo inicial propone que al menos el 80% de participantes alcance desempeño satisfactorio. No está definida la medición y no equivale al 100% de precisión para avanzar.
El CSV original proponía 10 ejercicios; la última respuesta dice «al menos 5 ejercicios». No sabemos si significa total o por zona. 5 totales no cumplen la consigna; 5 por cada una de 5 zonas dan 25 y exceden el máximo. por lo que se decidió 3 por cada zona.

PREGUNTAS QUE NECESITO RESOLVER
A. Alcance y pedagogía
1. Pregúntame primero qué significa «al menos 5» y qué total entre 10 y 20 aprobamos. Sugiere distribuciones viables por las cinco zonas, claramente identificadas como opciones.
2. ¿Cómo introducir logarítmicas explícitamente en las mecánicas, sin omitirlas ni añadir una zona innecesaria? Incluye base b>0, b≠1, argumento positivo, dominio/rango, asíntota y relación inversa con exponenciales.
3. ¿Cómo distinguir dominio declarado de un ejercicio, dominio real máximo, codominio y rango? ¿Qué cambia si el dominio está restringido?
4. ¿Cómo trabajar existencia/unicidad sin exigir inyectividad? ¿Cómo validar conjuntos completos de preimágenes, solución vacía, extremos abiertos/cerrados, uniones e infinitos?
5. ¿Las racionales y radicales de los ejemplos son necesarias o solo ilustraciones? Pregunta antes de ampliar las cuatro familias acordadas.
6. ¿Qué ayuda ZDP corresponde a cada familia y error? No uses simetría como ayuda universal. Aclara reintentos, progresión y retirada gradual de apoyos; pregunta si seguimos usando puntos o insignias.
7. ¿Cómo redactar objetivo general y criterios observables, diferenciando el 80% de participantes del 100% de precisión? ¿Qué medición realista propones sin inventar resultados?

B. Arquitectura híbrida y stack
8. Explica por qué cliente web + servidor Python ya constituye arquitectura híbrida, sin que eso obligue a combinar Mafs y Phaser.
9. Compara React+Mafs, Phaser 3 y una combinación con responsabilidades precisas. ¿Quién dibuja gráficas, maneja arrastre/touch y controla las zonas? Si combinas, explica cómo sincronizas estado y evitas duplicar renderizado. Recomienda la opción más pequeña que cubra las mecánicas y pregunta antes de darla por aprobada.
10. ¿Qué corresponde validar localmente y qué mediante FastAPI/SymPy? ¿Qué respuestas necesita el cliente para mostrar errores matemáticos y pistas? Propón contratos JSON por mecánica, representando conjuntos e intervalos explícitamente.
11. ¿Qué familias/expresiones acepta el motor? ¿Cuándo se usan respuestas exactas y cuándo tolerancias para diales/gráficas? ¿Cómo se manejan resultados no resueltos por SymPy y tiempos de cómputo excesivos sin marcar respuestas correctas como incorrectas?
12. ¿Necesitamos SQLite? ¿Qué progreso se guarda, cuándo, con qué identificación de sesión y cómo se recupera? Compara persistencia en servidor con almacenamiento local manteniendo la arquitectura híbrida. Pregunta si se requiere continuidad entre dispositivos antes de decidir.
13. ¿Cómo publicar estáticos y API en el servidor propio: rutas, mismo origen o CORS, procesos y persistencia? ¿Qué falta conocer del despliegue actual para concretarlo?
14. No prometas menos de 100 MB ni latencias en milisegundos sin mediciones. Propón una comprobación de RAM/CPU, latencia y compatibilidad con navegadores y dispositivos disponibles, con la concurrencia esperada aún por preguntar.
15. Resume el stack recomendado completo por capa, responsabilidades y dependencias; justifica cada elección en máximo 20 palabras y distingue recomendación de decisión aprobada.

C. Entrega y verificación
16. Propón un plan de pruebas matemáticas, funcionales, de ayudas y acceso abierto para Danny y María, y correcciones a cargo de Edwin. La asignación específica es una propuesta que debemos aprobar.
17. Señala riesgos concretos del alcance y una contingencia que conserve juego web funcional, contenido obligatorio y documento .md completo.
18. Propón una matriz zona → ejercicio → concepto → interacción → solución → validación → ayuda ZDP, dentro del total aprobado; cada ejercicio utilizado debe tener solución documentada.

FORMA DE RESPONDER
- Primero: preguntas de aclaración imprescindibles, incluyendo el significado de «al menos 5», selección frontend, persistencia y alcance matemático.
- Después: opciones y recomendaciones condicionadas, sin convertir supuestos en acuerdos.
- Incluye tabla Decisión / Estado (confirmada, propuesta o pendiente) / Motivo / Dato faltante.
- Incluye diagrama textual cliente → API → motor matemático → persistencia, con responsabilidades, y matriz de contenido para las cinco zonas una vez aclarada la cantidad.
- Cierra con próximos pasos hasta el 17/11 y pendientes. No escribas todavía toda la aplicación ni inventes URL, repositorio, pruebas realizadas o resultados educativos.
```

## 10. Matriz pedagógica anterior — referencia histórica

Esta es la matriz propuesta anteriormente por el asistente; **no es el banco vigente**. Se conserva como referencia, sin mezclar sus IDs con E01–E15. La sección 11 también es histórica; el banco canónico contiene la consolidación actual. La cantidad de 15 ejercicios y su distribución siguen aprobadas; no hay pruebas del juego ejecutadas.

| ID / zona | Ejercicio y contenido | Interacción | Referencia de solución / validación | Ayuda ZDP propuesta |
|---|---|---|---|---|
| Z1-E1 — Enlaces | Conectar f(x)=2x+1, A={0,1,2}, B={1,3,5} | Arrastrar cables | {(0,1),(1,3),(2,5)}; exactamente una salida por x y destino correcto | Resaltar entrada libre → sustituir un valor → tabla completa |
| Z1-E2 — Enlaces | Conectar f(x)=x², A={−1,0,1}, B={0,1} | Arrastrar cables | {(−1,1),(0,0),(1,1)}; dos entradas pueden compartir imagen | Resaltar imagen compartida → comparar cuadrados → tabla |
| Z1-E3 — Enlaces | Reparar A={0,1,2,4} para f(x)=log₂(x), B={0,1,2}, y conectar | Desactivar entrada inválida y enlazar | A válido={1,2,4}; {(1,0),(2,1),(4,2)}. No es función real sobre A original | Marcar x=0 → condición x>0 → equivalencias con potencias |
| Z2-E1 — Dominio/rango | f(x)=2x+1, dominio declarado [−1,2] | Seleccionar intervalos sobre ejes | Dominio declarado [−1,2], máximo real ℝ, rango [−1,5]; codominio declarado ℝ | Proyección → evaluar extremos → tabla |
| Z2-E2 — Dominio/rango | f(x)=x², dominio declarado [−2,1] | Proyección y extremos | Dominio [−2,1], rango [0,4]; incluir mínimo interior x=0 | Marcar vértice → comparar extremos y vértice → tabla |
| Z2-E3 — Dominio/rango | f(x)=log₂(x−1), dominio real máximo | Seleccionar intervalos y asíntota | Dominio (1,∞), rango ℝ, asíntota x=1; comparar extremos abiertos e infinitos | Resaltar x−1 → resolver x−1>0 → proyección |
| Z3-E1 — Lineales/cuadráticas | Hallar recta por (0,1) y (2,5) | Controles de pendiente/intercepto | m=2, b=1; probar igualdad de parámetros exactos, no solo proximidad visual | Corte vertical → triángulo de pendiente → cálculo (5−1)/(2−0) |
| Z3-E2 — Lineales/cuadráticas | Resolver x²=4 sobre ℝ | Ingresar conjunto de preimágenes | {−2,2}; rechazar conjunto incompleto, ignorar orden | Intersecciones con y=4 → simetría → resolver ambas raíces |
| Z3-E3 — Lineales/cuadráticas | Identificar vértice y rango de f(x)=(x−1)²−2, dominio ℝ | Marcar vértice y seleccionar rango | Vértice (1,−2), rango [−2,∞); mínimo incluido | Forma (x−h)²+k → eje x=1 → tabla alrededor del vértice |
| Z4-E1 — Exponenciales/logarítmicas | Evaluar f(x)=2ˣ en x=−1,0,2 | Completar tabla | 1/2, 1, 4; aceptar fracciones equivalentes; curva siempre positiva | Mostrar (0,1) → multiplicación/división por 2 → tabla guiada |
| Z4-E2 — Exponenciales/logarítmicas | Evaluar log₂(x) en x=1/2,1,8 | Completar tabla | −1,0,3; validar cada celda exacta | Buscar potencia de 2 → x=2ʸ → correspondencias |
| Z4-E3 — Exponenciales/logarítmicas | Asociar f(x)=2ˣ con inversa y reflejar (3,8) | Reflejar punto y elegir curva | Inversa log₂(x); punto (8,3); dominios ℝ y (0,∞), respectivamente | Recta y=x → intercambiar coordenadas → tabla inversa |
| Z5-E1 — Integración | Resolver x²=4 con dominio declarado [0,3] | Seleccionar preimágenes válidas | {2}; intersectar {−2,2} con [0,3]; distinguir del ejercicio Z3-E2 | Marcar dominio → ocultar rama negativa → intersección de conjuntos |
| Z5-E2 — Integración | Resolver 2ˣ=−3 sobre ℝ | Ingresar conjunto o vacío | ∅; rango (0,∞), sin intersección con y=−3 | Asíntota y=0 → positividad → contraste con altura solicitada |
| Z5-E3 — Integración | Resolver log₂(x−1)=2 | Ingresar preimagen y comprobar dominio | x−1=4 ⇒ x=5; {5}, con 5>1 | Argumento positivo → convertir a potencia → verificar sustitución |

Validación recomendada: conjuntos finitos sin depender del orden, intervalos estructurados con extremos abiertos/cerrados e infinitos, racionales exactos y respuestas por ID. El modo estático debe tener comparadores equivalentes para este banco cerrado, no intentar sustituir SymPy mediante una malla numérica. La matriz no introduce familias racionales ni radicales: una respuesta fraccionaria o resolver una cuadrática no equivale a añadir esas familias.

Plan de comprobación propuesto: Danny revisa soluciones, dominio y preimágenes; María revisa interacción, ayudas, persistencia y acceso en ambos modos; ambos cruzan resultados y Edwin corrige. Esta división específica debe acordarse entre los testers. Probar especialmente imágenes repetidas, dominio logarítmico, mínimo interior, preimágenes incompletas, conjunto vacío, progreso local y ausencia de API en el respaldo. No hay resultados de estas pruebas todavía.

## 11. Matriz recibida antes de la consolidación — referencia histórica

**No usar para implementar.** Este registro permite reconstruir los cambios de E01, E04, E08, E12 y E15 y la antigua discusión de alcance. Las decisiones vigentes y propuestas están en el banco canónico; los pendientes que siguen se refieren al momento de recepción de esta matriz.

La estructura sigue siendo de cinco zonas con tres ejercicios cada una. React coordina toda la interfaz; PixiJS representa cables y nodos de la primera zona; Mafs representa las gráficas y controles de las otras cuatro. Las reglas combinatorias sencillas se verifican localmente y las respuestas algebraicas se envían a FastAPI/SymPy. LocalStorage conserva el progreso individual en el navegador.

| Zona | Ejercicios de la nueva matriz | Referencias matemáticas |
|---|---|---|
| 1. Máquina de Enlaces | 1.1 representar R={(1,4),(2,4),(3,5)}; 1.2 corregir doble imagen de 1; 1.3 añadir imagen de 2 | 1.1 sí es función; 1.2 retirar (1,4) o (1,5); 1.3 añadir (2,4) o (2,5) |
| 2. Escáner de Proyección | 2.1 dominio/rango de 3x−1; 2.2 raíz de x−2; 2.3 dominio de 5/(x−3) | 2.1 ℝ/ℝ; 2.2 [2,∞)/[0,∞); 2.3 ℝ menos {3}. **2.2 y 2.3 reabren el alcance previamente excluido** |
| 3. Sintonizador | 3.1 recta por (0,4),(2,0); 3.2 vértice (3,2), a=1; 3.3 preimágenes de 8 en x²−1 | 3.1 m=−2,b=4; 3.2 (x−3)²+2=x²−6x+11; 3.3 {−3,3} |
| 4. Espejo de las Inversas | 4.1 dominio/rango/asíntota de 2ˣ; 4.2 inversa log₂(x); 4.3 convertir 3⁴=81 y hallar preimagen | 4.1 ℝ/(0,∞), y=0; 4.2 dominio (0,∞), rango ℝ, asíntota x=0; 4.3 log₃(81)=4, preimagen {4} |
| 5. Integración | 5.1 dominio de log₅(x−4); 5.2 preimágenes de −2 en 2ˣ y 3x+1; 5.3 función x+2 si x<0, x² si x≥0 | 5.1 (4,∞), asíntota x=4; 5.2 ∅ y {−1}; 5.3 f(−2)=0, f(0)=0, dominio ℝ |

### Ajustes para que la validación responda al enunciado

- 1.1 debe comprobar los pares de la relación solicitada además del grado de salida; cualquier otra función no satisface esa consigna. En 1.2 y 1.3 aceptar las alternativas correctas y verificar existencia/unicidad en **todos** los nodos, junto con las operaciones permitidas.
- En 2.2, validar rango además del dominio. Importar `continuous_domain` desde `sympy.calculus.util`; no confundir dominio de continuidad con dominio de definición en problemas generales, especialmente funciones a trozos discontinuas.
- En 3.1, distinguir comparación exacta de parámetros y aceptación aproximada por tolerancia. ±0.01 es el valor de la nueva propuesta, por validar para el control gráfico; no es igualdad exacta.
- En 3.3, escribir x=±√9=±3; `solve` devuelve normalmente una lista, no un conjunto. Comparar las respuestas como conjuntos completos en el dominio real.
- En 4.2, comprobar también la construcción/reflexión solicitada y no solo dominio y asíntota. En 4.3, evaluar la respuesta enviada por el estudiante: calcular una constante verdadera como `log(81,3)==4` no valida por sí solo su entrada.
- En 5.2, validar **ambas** funciones. Usar `solveset(2**x+2, x, domain=S.Reals)` para obtener explícitamente el conjunto vacío real; no atribuir ese tipo de retorno ni restricción real implícita a `solve`.
- En 5.3, el dominio es ℝ aunque haya discontinuidad en 0; no deducir el dominio del conjunto de continuidad. Este ejercicio añade análisis por tramos a la matriz anterior.

Estos son ajustes de especificación; no se han implementado ni probado todavía.

## 12. Consolidación y preparación SDD del 15/11/2026

### Confirmado por el usuario

- E01: reconocer la función representada, sin construcción de cables.
- E05/E06: radical y racional incluidas definitivamente, sin aumentar el total de 15.
- E08: construir desde el vértice (3,2), con a=1.
- E15: rama no negativa (x−3)²+2; f(0)=11.
- El HTML es un reporte y fue trasladado por el usuario a `docs/reporte/`.
- Preparar para revisión y no instalar herramientas/dependencias; la implementación no comienza en esta actualización.

### Material para revisar

- [Banco canónico](./banco_ejercicios.md): fichas, soluciones, casos esperados y criterios C01–C07 pendientes de aprobación.
- [Guía técnica sincronizada](./exercises.md): correspondencia por ID y reglas de validación propuestas.
- [Especificación 001](../specs/001-nucleo-validacion/spec.md): contratos comunes y orquestación de validaciones, todavía en borrador. El futuro primer recorrido E01/E08 queda reservado como `002`; sus reglas generales se toman del GDD aprobado.

Los siguientes pasos son revisar la especificación, acordar los criterios necesarios, redactar plan/tareas y autorizar las instalaciones necesarias antes de implementar. El repositorio local existe; no se ha habilitado Spec Kit en él ni se han ejecutado pruebas del juego.
