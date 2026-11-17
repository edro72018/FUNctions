# FUNctions

Juego educativo de funciones para bachillerato: cinco zonas y quince ejercicios.

## Estado actual

Núcleo de validación implementado, 16/11/2026: contratos tipados, normalización exacta, registro y despacho local/API inyectable en TypeScript y Python. **114 pruebas por lenguaje pasan**, además del chequeo estricto de TypeScript. El cierre está para revisión humana. La guía de ejecución y trazabilidad está en [quickstart.md](specs/001-nucleo-validacion/quickstart.md).

El usuario confirmó E01 de reconocimiento, radicales/racionales en E05/E06, E08 de construcción desde el vértice y E15 con rama `(x−3)²+2`. La autorización posterior de las tareas 001 permitió instalar las herramientas de desarrollo y ejecutar la implementación del núcleo. La matemática de los Ejercicios y la UI pertenecen a incrementos consumidores.

## Leer en este orden

1. [Banco canónico y decisiones confirmadas/propuestas](docs/banco_ejercicios.md).
2. [GDD v0.1 con reglas aprobadas](docs/workspace/GDD_FUNctions_v0.1.md).
3. [Especificación 001: núcleo de validación](specs/001-nucleo-validacion/spec.md).
4. [Guía técnica derivada por ejercicio](docs/exercises.md).
5. [Estructura SDD](docs/politicas/estructura-proyecto.md), [convenciones](docs/politicas/convenciones-codigo.md), [contrato API](docs/politicas/contrato-api.md), [versiones](docs/politicas/politica-versiones.md) y [glosario](docs/politicas/glosario.md).

Las políticas se trasladaron aquí sin cambiar su contenido. Las rutas anteriores en `docs/` conservan enlaces. Los reportes HTML y registros académicos permanecen fuera del producto; pueden describir estados históricos.

## Próximo paso

Revisar el cierre de las tareas 001 y su evidencia. Después, definir las specs consumidoras y sus asociaciones pendientes. Las reglas de experiencia del GDD no están pendientes de aprobación.

Stack acordado: React/TypeScript; PixiJS en zona 1; Mafs en zonas 2–5; FastAPI/SymPy; LocalStorage. Versiones vigentes aprobadas en [DV-001](specs/decisiones/DV-001.md): Node.js 24.22.1, React y React DOM 18.3.1, PixiJS 8.23.0, Mafs 0.21.0, Vite 7.3.8, `@vitejs/plugin-react` 5.1.0, Vitest 4.1.12, Ajv 8.20.0, `@types/react` 18.3.31, `@types/react-dom` 18.3.7, TypeScript 5.6.3 y override `katex` 0.19.1. Python conserva pytest 8.3.3 y jsonschema 4.26.0. Licencia MIT acordada; su incorporación al código será una tarea de arranque.

### Aprobación de alcance limitado — DV-001 (2026-11-16)

Edwin confirmó en conversación: «Ratifico la enmienda 1.1.0 de la Constitución y apruebo DV-001 con las versiones indicadas.» Autoriza la migración de configuración y dependencias indicada en DV-001, no la implementación de funcionalidades de 002/003. Los requisitos matemáticos, API y especificaciones funcionales no cambian; se afectan configuración y planes técnicos. La evidencia de 001 corresponde al entorno histórico (Node.js 20, Vitest 2.1.1 y Ajv 8.17.1), no acredita resultados con las versiones nuevas. Esta actualización documental no acredita instalación, pruebas nuevas ni auditoría limpia.

## Spec Kit

El repositorio contiene configuración y scripts de Spec Kit en `.specify/`, la Constitución ratificada y los artefactos de la spec 001. Las aprobaciones de especificación, plan y tareas están registradas en [specs/README.md](specs/README.md). Las listas de revisión de requisitos y las tareas de implementación tienen propósitos distintos.
