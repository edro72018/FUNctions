# Especificaciones de FUNctions

| ID | Funcionalidad | Estado | Implementación |
|---|---|---|---|
| 001 | [Núcleo común de validación](001-nucleo-validacion/spec.md) | Spec, plan y tareas aprobados | T001–T044 implementadas; 114 pruebas TS y 114 Python pasan. [Cierre para revisión](001-nucleo-validacion/quickstart.md) |

El futuro primer recorrido E01/E08 tiene reservado el identificador `002`; todavía no existe una spec en esa ruta. Sus reglas generales de experiencia ya están aprobadas en el [GDD v0.1](../../docs/workspace/GDD_FUNctions_v0.1.md).

## Aprobaciones

Registro de las decisiones de aprobación de etapas SDD. Cada fila remite al bloque `## Aprobaciones` del artefacto correspondiente.

| ID | Etapa | Veredicto | Fecha | Autoridad | Evidencia | Versión o revisión | Comentarios o condiciones |
|---|---|---|---|---|---|---|---|
| 001 | Especificación | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `spec.md`, versión de trabajo 0.3.0 | El Contrato de API debe actualizarse para alinearse con la Spec; la aprobación documental no acredita implementación ni pruebas |
| 001 | Plan | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita del Aprobador principal en la sesión de trabajo del 2026-11-16 | `plan.md`, versión 0.1.0 | Autoriza la etapa de descomposición de tareas; no autoriza la implementación. Actualizar el Contrato de API antes de implementar el adaptador HTTP; mantener bloqueadas la gramática de `expression` y las asociaciones E02–E15 |
| 001 | Tareas | `aprobado` | 2026-11-16 | Edwin Ernesto Rodríguez Pérez, Aprobador principal | Aprobación explícita registrada por Edwin en [tasks.md](001-nucleo-validacion/tasks.md#aprobaciones) y orden de implementación en la sesión de trabajo | `tasks.md`, versión 0.1.0 | Autoriza la etapa de implementación. |

Una especificación en borrador no autoriza instalar dependencias ni programar. Los requisitos y criterios identificados se usarán para trazar las pruebas cuando comience la implementación. El estado «aprobada» requiere registrar una confirmación real del usuario/equipo.
