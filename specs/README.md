# Especificaciones de FUNctions

| ID | Funcionalidad | Estado | Implementación |
|---|---|---|---|
| 001 | [Núcleo común de validación](001-nucleo-validacion/spec.md) | Spec, plan y tareas aprobados | T001–T044 implementadas; 114 pruebas TS y 114 Python pasan. [Cierre para revisión](001-nucleo-validacion/quickstart.md) |
| 002 | [Primer recorrido: índice y E01/E08](002-primer-recorrido/spec.md) | Especificación Aprobada | No iniciada; requiere aprobación de la spec y la existencia de `003-interaccion-2d` antes del plan |
| 003 | [Contrato transversal de interacción 2D](003-interaccion-2d/spec.md) | Especificación aprobada | Sin implementación acreditada; contrato consumido por 002 y 004–008 Las especificaciones 002 y 003 están aprobadas. El primer recorrido consume el núcleo 001 y el contrato transversal de interacción 003. La aprobación documental no acredita implementación ni pruebas.|


El primer recorrido E01/E08 está especificado en `002-primer-recorrido` y espera revisión. Sus reglas generales de experiencia ya están aprobadas en el [GDD v0.1](../../docs/workspace/GDD_FUNctions_v0.1.md). La spec de interacción 2D (`003-interaccion-2d`) todavía no existe y es requisito previo del plan, conforme al bloqueo B3 de la auditoría.

## Registro de decisiones de versión

| Decisión | Autoridad | Fecha | Veredicto | Alcance y evidencia |
|---|---|---|---|---|
| [DV-001](decisiones/DV-001.md) | Edwin Ernesto Rodríguez Pérez, Aprobador principal | 2026-11-16 | aprobado; instalación y verificaciones básicas completadas (ver DV-001) | Opción B; «Ratifico la enmienda 1.1.0 de la Constitución y apruebo DV-001 con las versiones indicadas.» Autoriza migración técnica y adecuación documental limitada, no implementación de funcionalidades |

## Aprobaciones

Registro de las decisiones de aprobación de etapas SDD. Cada fila remite al bloque `## Aprobaciones` del artefacto correspondiente.

| ID | Etapa | Veredicto | Fecha | Autoridad | Evidencia | Versión o revisión | Comentarios o condiciones |
|---|---|---|---|---|---|---|---|
| 001 | Especificación | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `spec.md`, versión de trabajo 0.3.0 | El Contrato de API debe actualizarse para alinearse con la Spec; la aprobación documental no acredita implementación ni pruebas |
| 001 | Plan | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `plan.md`, versión 0.1.0 | Autoriza la etapa de descomposición de tareas; no autoriza la implementación. Actualizar el Contrato de API antes de implementar el adaptador HTTP; mantener bloqueadas la gramática de `expression` y las asociaciones E02–E15 |
| 001 | Tareas | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita registrada por Edwin en [tasks.md](001-nucleo-validacion/tasks.md#aprobaciones) y orden de implementación en la sesión de trabajo | `tasks.md`, versión 0.1.0 | Autoriza la etapa de implementación. |
| 002 | Especificación | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | spec para revisión | `spec.md`, versión de trabajo 0.1.0 | Sin aprobación no se autoriza plan, tareas, contratos ni implementación; requiere `003-interaccion-2d` antes del plan |
| 002 | Plan | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `plan.md`, versión 0.1.0 | Autoriza la etapa de descomposición de tareas; no autoriza la implementación. |
| 003 | Especificación | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | [Registro de aprobación](003-interaccion-2d/spec.md#aprobaciones) | `spec.md`, versión de trabajo 0.1.1 | Aprueba el contrato para consumo por 002 y 004–008; no acredita implementación ni pruebas |
| 003 | Plan | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `plan.md`, versión 0.1.0 | Autoriza la etapa de descomposición de tareas. |

Una especificación en borrador no autoriza instalar dependencias ni programar. Los requisitos y criterios identificados se usarán para trazar las pruebas cuando comience la implementación. El estado «aprobada» requiere registrar una confirmación real del usuario/equipo.
