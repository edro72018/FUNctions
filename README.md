# FUNtions

Juego educativo de funciones para bachillerato: cinco zonas y quince ejercicios.

## Estado actual

Preparación documental para revisión, 15/11/2026. El repositorio contiene el banco consolidado, las políticas y una especificación inicial. **Todavía no hay implementación ejecutable, dependencias instaladas ni pruebas del juego ejecutadas.**

El usuario confirmó E01 de reconocimiento, radicales/racionales en E05/E06, E08 de construcción desde el vértice y E15 con rama `(x−3)²+2`. Seleccionó **«Preparar para revisión»** y **«Sin instalaciones»** para el siguiente incremento.

## Leer en este orden

1. [Banco canónico y decisiones confirmadas/propuestas](docs/banco_ejercicios.md).
2. [Especificación 001: primer recorrido E01/E08](specs/001-primer-recorrido/spec.md).
3. [Guía técnica derivada por ejercicio](docs/exercises.md).
4. [Estructura SDD](docs/politicas/estructura-proyecto.md), [convenciones](docs/politicas/convenciones-codigo.md), [contrato API](docs/politicas/contrato-api.md), [versiones](docs/politicas/politica-versiones.md) y [glosario](docs/politicas/glosario.md).

Las políticas se trasladaron aquí sin cambiar su contenido. Las rutas anteriores en `../docs/` conservan enlaces. Los reportes HTML y registros académicos permanecen fuera del producto; pueden describir estados históricos.

## Próximo paso

Revisar las decisiones pendientes de la especificación y los criterios C01–C07 del banco. Tras la aprobación, redactar `plan.md` y `tasks.md`, concretar versiones y contratos, y solicitar autorización para las instalaciones necesarias antes de implementar.

Stack acordado: React/TypeScript; PixiJS en zona 1; Mafs en zonas 2–5; FastAPI/SymPy; LocalStorage. La herramienta de compilación y las versiones exactas siguen por definir. Licencia MIT acordada; su incorporación al código será una tarea de arranque.

## Spec Kit

La revisión anterior encontró archivos de Specify CLI en el entorno. Este repositorio **no se ha inicializado con Spec Kit** y no se ha habilitado `/speckit.constitution`. La preparación actual usa documentos SDD; no equivale a ejecutar ese comando ni a aprobar una constitución. No se instaló ni inicializó ninguna herramienta durante esta consolidación.
