# Scrum — Estado y próximos pasos de FUNctions

**Fecha de corte:** 15 de noviembre de 2026; actualización de contenido y preparación SDD.  
**Fuentes:** `actividades.csv`, `conclusión_de_respuestas.md`, `consigna.md` y revisión de `../development/`.

## 1. ¿En qué punto estamos?

**Tenemos decisiones de producto y planificación inicial; el siguiente evento sería la primera Sprint Planning.** Antes o durante esa preparación debemos ordenar el Product Backlog, aclarar los elementos prioritarios y acordar las responsabilidades Scrum.

No hay evidencia registrada de un Sprint iniciado, un Sprint Goal acordado, una Definition of Done adoptada ni eventos Scrum realizados. `development/` contiene el repositorio local, documentación consolidada y la especificación 001 para revisión; **no existe implementación del juego verificada en este espacio de trabajo**. El usuario eligió preparar para revisión y sin instalaciones. El formulario HTML y los reportes son herramientas documentales, no un incremento jugable.

Scrum no organiza el trabajo en fases consecutivas de análisis, diseño, programación y pruebas. Dentro de cada Sprint se realiza el trabajo necesario para producir un incremento usable. El refinamiento es continuo; no hace falta especificar todo el proyecto antes de empezar a construir una parte clara y comprobable. (opinió de desarrollador: me parece bien)

Este archivo propone cómo aplicar Scrum desde el estado actual. No convierte las reuniones anteriores ni los documentos existentes en eventos o artefactos Scrum formalmente acordados.

## 2. Qué ya está hecho y qué falta

### Estado registrado en el cronograma

| Estado | Actividades | Evidencia o alcance |
|---|---|---|
| Completadas | **A01, A02, A04, A06** | Equipo, decisiones, sinopsis, objetivo y reglas del GDD confirmados |
| En curso | **A02b, A05, A10** | Especificación; revisión matemática; documento con procedimientos todavía pendientes |
| Pendientes | **A03, A07, A08, A09, A11, A12, A13, A14** | Evidencias, implementación, despliegue, pruebas y entrega |

Son **15 actividades: 4 completadas, 3 en curso y 8 pendientes**. Este conteo no es un porcentaje de avance del producto: las actividades tienen tamaños diferentes y no se ha medido velocidad del equipo.

### Decisiones y materiales disponibles

- [x] Nombre **FUNctions**, licencia **MIT** y público de bachillerato.
- [x] **15 ejercicios, tres por cada una de cinco zonas**.
- [x] Familias principales: lineales, cuadráticas, exponenciales y logarítmicas.
- [x] Stack confirmado: **React + TypeScript; PixiJS en zona 1; Mafs en zonas 2–5; FastAPI + SymPy; LocalStorage**.
- [x] Servidor propio como destino principal; respaldo estático con respuestas precalculadas aprobado.
- [x] Equipo y roles académicos identificados.
- [x] Cronograma, formulario y documento de decisiones disponibles.
- [x] Banco consolidado en `../development/docs/banco_ejercicios.md`; decisiones de contenido registradas. Criterios adicionales C01–C07, fuentes y revisión cruzada pendientes.
- [x] Revisión documental del servidor: viabilidad razonable, sin pruebas de carga del juego.
- [x] Radicales/racionales incluidas definitivamente: E05=√(x−2), E06=5/(x−3). Sustituye la exclusión anterior.
- [x] E01 de reconocimiento; E08 de construcción desde el vértice; E15 con rama (x−3)²+2 para x≥0.
- [x] Finalizar reglas, ayudas, objetivo y sinopsis conforme al GDD v0.1 aprobado.
- [ ] Construir, comprobar y publicar el juego.
- [ ] Completar documento académico y anexos de autoría.

## 3. Objetivo de producto y límites
### Product Goal propuesto — Aprobado  

> Ofrecer a estudiantes de bachillerato un juego web original y accesible mediante enlace abierto que les permita practicar funciones a través de cinco zonas, quince ejercicios y retroalimentación progresiva, acompañado de soluciones documentadas y evidencias del trabajo del equipo.

### Restricciones confirmadas

- Entrega académica: **17 de noviembre de 2026**, por Edwin como coordinador. Por Plataforma Moodle Universitaria.
- Documento final elegido: **Markdown (.md)**, usado para trabajar con IA, y el equipo se encargará de crear el resto de archivos restantes.
- Portada con nombres completos; nombre y sinopsis de máximo 100 palabras; objetivo; reglas; ejercicios y soluciones; créditos y roles; enlace abierto; anexos de autoría.
- La consigna admite **10–20 ejercicios**; el equipo acordó 15. Por ahora, no se piensa cambiar.
- Evaluación: contenido matemático 25%, diseño/mecánica 20%, enfoque educativo 20%, documento 15%, colaboración/organización 20%. El proyecto vale 15% de la asignatura.
- Video de 1–2 minutos y bitácora son ejemplos de evidencia, no entregables obligatorios adicionales.

La meta educativa del 80% de participantes necesita definición y medición. No es una condición ya demostrada ni equivale al 100% de precisión individual para avanzar. (Posiblemente reestructuración)

## 4. Responsabilidades Scrum

Los roles académicos actuales no asignan automáticamente las responsabilidades de Scrum.

| Persona | Rol confirmado en el proyecto | En Scrum |
|---|---|---|
| Edwin Ernesto Rodríguez Pérez | Coordinación | Product Owner, Scrum Master y Developer |
| Danny Mauricio Trujillo | Subcoordinación | Product Owner, Auditor de Documentación y Tester |
| María Erika González Ortez | Colaboradora | Product Owner, Auditor de Documentación y Tester |
| Martha Beatriz Bran | Tutora de Asignatura | Interesada |


En Scrum, **Developers incluye a quienes realizan pruebas, documentación y demás trabajo del incremento**, no solo a quienes programan. Product Owner y Scrum Master también pueden trabajar en el Sprint Backlog cuando participan como Developers; deben atender ambas responsabilidades.

- **Product Owner:** comunicar el objetivo del producto y ordenar el Product Backlog; una persona mantiene esta responsabilidad.
- **Scrum Master:** ayudar a comprender y aplicar Scrum, facilitar su efectividad y promover la resolución de impedimentos.
- **Developers:** seleccionar trabajo según su capacidad, crear y adaptar el plan del Sprint y cumplir la Definition of Done.
- **Interesados:** tutora y posibles estudiantes usuarios. Su participación en revisiones debe coordinarse; no consta que ya se haya realizado.

Después de revisión, la tabla es oficial para organización.

# Parte para editar con IA después de revisión desde puntos 5

## 5. Product Backlog inicial propuesto

La siguiente lista traduce el cronograma a resultados de producto. **Orden, tamaño y selección para el Sprint deben acordarse.** No hay estimaciones ni puntos de historia asignados.

| Orden / ID | Resultado esperado | Criterios de aceptación iniciales | Trazabilidad | Estado |
|---|---|---|---|---|
| 1 / PB01 | Comprender la misión y cómo jugar | Nombre FUNctions, ESAI, instrucciones legibles, objetivo y reglas coherentes con las ayudas y el avance | A04, A06 | Diseño aprobado; no implementado |
| 2 / PB02 | Reconocer y reparar funciones en la zona 1 | E01 reconoce una relación fija; E02/E03 reparan unicidad/existencia conservando las operaciones permitidas | A02b, A05–A07, A09 | E01 incluido en especificación 001 para revisión; no implementado |
| 3 / PB03 | Resolver dominio/rango en la zona 2 | Intervalos y extremos correctos; E05 radical con dominio/rango; E06 racional con dominio completo y valor excluido | A05–A07, A09 | Alcance confirmado; revisión cruzada y validadores pendientes |
| 4 / PB04 | Manipular lineales/cuadráticas en la zona 3 | Validar parámetros, ecuaciones equivalentes en su dominio y conjuntos completos de preimágenes; distinguir exactitud de tolerancia gráfica | A02b, A05–A07, A09 | Matriz disponible; no implementado |
| 5 / PB05 | Relacionar exponenciales/logarítmicas en la zona 4 | Validar dominios, rangos, asíntotas, reflexión solicitada y conversión exponencial/logarítmica según cada ejercicio | A05–A07, A09 | Matriz disponible; no implementado |
| 6 / PB06 | Resolver la integración de zona 5 | Comprobar restricciones logarítmicas, soluciones reales vacías/no vacías y selección correcta de rama en la función a trozos | A05–A07, A09 | Matriz disponible; no implementado |
| 7 / PB07 | Continuar el progreso en el mismo navegador | Recargar conserva avances y ayudas registradas; reinicio definido; manejar almacenamiento ausente o inválido | A02b, A07, A09 | LocalStorage decidido; modelo pendiente |
| 8 / PB08 | Acceder al juego publicado y disponer de respaldo | Enlace abierto funciona fuera del entorno de desarrollo; comprobar cliente/API y respaldo estático; identificar qué modo se entrega | A07–A09 | Destino principal y respaldo decididos; sin URL |
| 9 / PB09 | Consultar documento completo y autoría | .md contiene toda la estructura, 15 soluciones, enlace y evidencias de los tres integrantes; sinopsis ≤100 palabras | A03, A10–A14 | Pendiente |

Las ayudas ZDP y las pruebas se incorporan a cada elemento jugable; no se dejan como una fase final. PB02–PB06 son agrupaciones que pueden dividirse por ejercicio en elementos más pequeños. PB07, evidencias y documentación pueden avanzar junto con las primeras interacciones, aunque aparezcan más abajo en esta propuesta de orden.

## 6. Qué seguiría ahora: Sprint Planning

### Preparación inmediata

1. Revisar la Constitución del Proyecto, confirmar el Product Goal vigente y acordar responsable único de Product Owner, Scrum Master y Definition of Done.
2. Revisar y aprobar la especificación 001 y los criterios matemáticos de E01/E08; no tratar sus propuestas de ayudas, reintentos o progreso como acuerdos.
3. Solo después de aprobar la especificación, crear `plan.md` y `tasks.md`, incluyendo la ampliación del contrato API para booleano y vértice.
4. Obtener autorización para instalaciones y fijar versiones compatibles antes de implementar.
5. Declarar disponibilidad real de los tres integrantes y seleccionar un incremento alcanzable. No hay datos para prometer capacidad o velocidad.

### Preguntas para Sprint Planning

- **¿Por qué vale la pena este Sprint?** Acordar un Sprint Goal. 
- **¿Qué aprenderá el jugador?** Comprender y practicar funciones mediante relaciones, dominio/rango, trayectorias, exponenciales/logarítmicas y ejercicios de integración. El objetivo y su medición final siguen pendientes.
- **¿Cuáles serán las mecánicas?** Rompecabezas 2D con cinco Zonas; PixiJS en la Zona 1 y Mafs en las Zonas 2–5. El GDD v0.1 aprueba progreso secuencial, reintentos ilimitados, ayudas H1–H3, repetición, guardado local y finalización 15/15, sin temporizador, vidas, puntos ni insignias. Las specs deben concretar su implementación.
- **¿Están definidos los 15 ejercicios?** El total, los IDs y las decisiones clave de E01/E05/E06/E08/E15 están consolidados; falta revisión cruzada de soluciones y criterios C01–C07 del banco.
- **¿Qué ha hecho cada miembro?** Los roles registrados son Edwin (coordinación/desarrollo), Danny (subcoordinación/pruebas) y María (tester). Los aportes finales deben demostrarse con evidencia, no inferirse del rol.
- **¿Qué se puede completar?** Primero, el paquete SDD revisado E01/E08; después, el equipo selecciona un incremento funcional según capacidad y autorización.
- **¿Cómo se realizará?** Especificación aprobada → plan → tareas trazables → implementación autorizada → pruebas de criterios de aceptación; IA como apoyo, no como autoridad de decisiones.

### Propuesta de Sprint corto para este plazo

**Ventana:** no acordada. La propuesta anterior de iniciar el 14/11 ya quedó atrás; no hay Sprint iniciado registrado. Si el equipo decide hacer un Sprint antes de la entrega académica del 17/11/2026, debe acordar una nueva ventana realista y conservar margen para revisión y entrega. Scrum permite Sprints cortos de duración fija, de un mes o menos; no obliga a usar dos semanas.

**Sprint Goal candidato para el primer Sprint (no acordado):**

> Entregar un primer recorrido vertical de FUNctions con E01 (PixiJS) y E08 (Mafs), validación matemática confiable, retroalimentación clara y pruebas trazables a una especificación aprobada.

El objetivo académico sigue siendo completar las cinco zonas y quince ejercicios. La selección del Sprint es un **pronóstico**, no una promesa automática de que todo el cronograma cabe en esos días. Si la capacidad no alcanza, reordenar el trabajo y acordar ajustes preservando el objetivo y las restricciones académicas. El respaldo reduce riesgo de despliegue, no sustituye contenido ni pruebas.

### Primer entregable y primer incremento

**Primer entregable técnico propuesto: paquete SDD revisado para el recorrido E01/E08.** La especificación ya existe como borrador; para considerar completo este entregable hace falta:

1. revisar y aprobar los requisitos y criterios de aceptación de la [especificación del núcleo](../specs/001-nucleo-validacion/spec.md) y preparar posteriormente la spec `002` del recorrido E01/E08 conforme al GDD aprobado;
2. redactar `plan.md` con módulos afectados, estrategia de validación y pruebas, persistencia y modos conectado/estático;
3. redactar `tasks.md` con tareas ordenadas y trazabilidad a `REQ`/`AC`;
4. resolver en el [Contrato de API](./politicas/contrato-api.md) los tipos de respuesta booleano (E01) y vértice `h/k` (E08) antes de implementar.

La especificación no está aprobada, `plan.md` y `tasks.md` aún no existen, y el equipo no ha autorizado instalaciones. Por tanto, **el primer entregable inmediato es documental y no es un incremento jugable ni satisface la consigna del juego funcional**.

**Primer incremento funcional objetivo, posterior a la aprobación del paquete SDD:** un recorrido demostrable con E01 (PixiJS) y E08 (Mafs), React como coordinador, resultado matemático correcto/incorrecto/indeterminado, persistencia local según reglas aprobadas y comportamiento probado en modo conectado y estático. Su alcance, prioridad y capacidad deben acordarse en Sprint Planning; no se declara compromiso ni trabajo iniciado.

### Candidatos a tareas del Sprint Backlog

Hasta realizar Sprint Planning, esta lista es una propuesta, no un Sprint Backlog acordado:

- Revisar/ratificar la Constitución y la especificación 001; registrar las decisiones pendientes.
- Completar `plan.md` y `tasks.md` del recorrido; actualizar el contrato antes de diseñar validadores.
- Con autorización, preparar la estructura React/FastAPI en el repositorio local existente, fijar versiones compatibles e incorporar MIT y pasos de ejecución.
- Implementar E01/E08 según criterios aprobados y comprobaciones matemáticas revisadas.
- Extender a los ejercicios seleccionados, integrando ayudas y soluciones verificadas.
- Incorporar LocalStorage y probar recarga, reinicio y datos inválidos.
- Preparar despliegue y validar la alternativa estática con el mismo banco de ejercicios.
- Redactar soluciones y apartados del .md conforme se implementa; capturar evidencias reales.

## 7. Definition of Done propuesta

El equipo debe acordarla antes de usar la columna **Hecho** para incrementos del juego. Es distinta de los criterios de aceptación específicos de cada ejercicio.

Un elemento integrado se considera **Done** cuando:

- [ ] Cumple sus criterios de aceptación y tiene comportamiento observable en el juego.
- [ ] Su contenido y solución matemática fueron revisados; el validador comprueba toda la respuesta solicitada y sus alternativas válidas.
- [ ] La interfaz y ayudas son claras; se probó la interacción relevante con los dispositivos de destino disponibles.
- [ ] Funciona integrado con los componentes que necesita y no rompe el recorrido ya terminado.
- [ ] Las comprobaciones pertinentes pasan y no quedan defectos conocidos que impidan su uso previsto o califiquen erróneamente una respuesta correcta.
- [ ] Se actualizaron solución/documentación y evidencia del aporte; el cambio queda identificable en el repositorio.
- [ ] Está disponible en una versión ejecutable que el equipo puede demostrar.

Para PB08 se comprueba además el acceso público y el modo publicado. Para PB09 se verifica toda la estructura académica. Un elemento que no cumple Done vuelve al Product Backlog; no se presenta como incremento terminado en la Sprint Review.

**Estado actual:** no hay incremento del juego que se haya verificado contra esta definición. A01/A02 completadas son trabajo de preparación registrado, no quince ejercicios ni producto terminado.

## 8. Eventos y seguimiento propuestos

| Evento / práctica | Cuándo | Propósito | Estado actual |
|---|---|---|---|
| Sprint Planning | Al iniciar el Sprint | Acordar objetivo, selección y plan | No registrada |
| Daily Scrum | Cada día de trabajo del Sprint; 15 minutos | Inspeccionar avance hacia el Sprint Goal y adaptar el plan; participan Developers | No registrado |
| Refinamiento | Durante el trabajo, según necesidad | Aclarar/dividir/ordenar próximos elementos; no es un evento formal separado obligatorio | Hay aclaraciones y documentación previas; continuar |
| Sprint Review | Hacia el cierre del Sprint | Inspeccionar incremento usable con interesados y adaptar Product Backlog | No realizada |
| Sprint Retrospective | Después de Review y antes del siguiente Sprint | Identificar mejoras concretas del trabajo del equipo | No realizada |

El Daily no es un reporte de estado al coordinador. Review y Retrospective no son la misma reunión; la Review tampoco es una aprobación obligatoria para liberar software. Puede publicarse un incremento que cumpla Done antes de la Review. La entrega académica es un hito externo con fecha fija.

Tablero sencillo propuesto: **Por hacer → En curso → En verificación → Hecho**, con bloqueos visibles. Estas columnas son una herramienta del equipo, no una estructura impuesta por Scrum. Actualizar decisiones en `conclusión_de_respuestas.md` y avance en `actividades.csv`; la recomendación de la otra IA no cambia estados ni acuerdos automáticamente.

## 9. Registro de impedimentos y decisiones pendientes

| Pendiente | Impacto | Acción siguiente |
|---|---|---|
| Aprobación de Constitución y especificación 001 | Inicio de implementación | Revisar requisitos/criterios E01/E08, aprobar o corregir las propuestas, y luego producir `plan.md`/`tasks.md` |
| Contrato API para E01/E08 | Implementación y validación | Añadir/revisar respuesta booleana y tipo de vértice `h/k`; el contrato actual no los define |
| Revisión del banco | Corrección del contenido | Revisar C01–C07, fuentes y soluciones cruzadas; radicales/racionales ya están incluidas |
| Versiones e integración | Arranque técnico | Edwin propone combinación compatible y verifica un recorrido mínimo |
| Implementación de las reglas aprobadas del GDD | Criterios de aceptación y experiencia del jugador | Traducir a specs la progresión, ayudas H1–H3, guardado y transiciones aprobadas |
| Meta del 80% | Evaluación educativa | Definir desempeño, muestra y registro; no afirmar resultados no medidos |
| Remoto, URL y rutas del servidor | Autoría, integración y acceso abierto | Repositorio local presente; remoto y despliegue no verificados. El snapshot no demuestra publicación del juego |
| Capacidad, roles Scrum y horarios | Pronóstico del Sprint | Confirmar disponibilidad, responsabilidades y eventos con los tres integrantes |
| Hora y canal de entrega | Hito académico | Consultar indicación de la tutora; no asumir 23:59 |

## 10. Resumen para sincronizar con otra IA

FUNctions tiene nombre definitivo, ESAI con representación ficticia, GDD v0.1 con reglas aprobadas, banco consolidado y una especificación transversal en borrador, todavía sin implementación. Hay 4 actividades completadas, 3 en curso y 8 pendientes. El documento académico ya contiene sinopsis, objetivo, reglas y resumen de soluciones; faltan procedimientos completos, URL pública, repositorio y evidencias. El primer incremento funcional continúa sujeto a specs, planificación, autorización de implementación y capacidad. No hay Sprint iniciado ni pruebas ejecutadas. Radicales/racionales están incluidas; E15 usa (x−3)²+2 en la rama no negativa. Se mantienen entrega 17/11/2026, quince ejercicios y stack confirmado.
