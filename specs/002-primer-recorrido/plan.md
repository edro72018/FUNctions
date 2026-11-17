# Implementation Plan: Primer recorrido — índice y recorrido E01/E08

**Branch**: `feature/002-primer-recorrido` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Especificación del primer corte vertical de FUNctions (`specs/002-primer-recorrido/spec.md`)

## Summary

Implementar el corte vertical mínimo de FUNctions que une el índice de inicio, las pantallas informativas, el recorrido de prueba E01/E08 (de punta a punta), las ayudas H1–H3, la retroalimentación, la persistencia local y el etiquetado explícito de origen de validación (`local` / `API`).

E01 utiliza clasificación `boolean` y E08 ajusta una parábola con entrada exacta de vértice `(h, k)` con `a = 1`. El corte consume los contratos compartidos de `001-nucleo-validacion` y el contrato de interacción 2D de `003-interaccion-2d`. La persistencia guarda la versión de progreso, los niveles resueltos, el borrador activo y los intentos evaluados en `LocalStorage` con comprobación de disponibilidad y manejo de datos corruptos.

## Technical Context

**Language/Version**: TypeScript 5.6.3 (Frontend React 18+), Python 3.12+ / FastAPI / SymPy (Backend)
**Primary Dependencies**: React.js, PixiJS, Mafs, `@functions/validation-core` (adaptador TypeScript local), FastAPI, SymPy, Vitest, pytest
**Storage**: `LocalStorage` del navegador (clave con versión, sin datos personales, sin sincronización remota)
**Testing**: Vitest para componentes React y contratos locales; pytest para endpoints de API Backend; pruebas de accesibilidad (teclado, foco visible, 44×44, sin color único)
**Target Platform**: Navegadores modernos (Desktop y Mobile/Touch), Node.js >=20 para herramentales
**Project Type**: Aplicación web (Frontend React/PixiJS/Mafs + Backend FastAPI opcional para validación remota)
**Performance Goals**: Carga inicial del índice < 2s; respuesta de interacción local < 16ms (60 fps); validación local < 50ms
**Constraints**: Cumplimiento estricto de la Constitución FUNctions v1.0.0; sin fallback silencioso de validación; 0 datos personales; accesibilidad táctil min 44×44 ref units
**Scale/Scope**: 1 índice, 3 pantallas informativas (Instrucciones, Cómo se Juega, Acerca de), 1 pantalla de introducción breve, 2 ejercicios canónicos (E01, E08)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principio I — Alcance y Evidencia:** Cumplido. El corte limita explícitamente su alcance a E01 y E08. No afirma que la Zona 1 o la Zona 3 estén completas.
- **Principio II — Stack Confirmado:** Cumplido. React administra el estado del dominio y de navegación. PixiJS renderiza E01 y Mafs renderiza E08. No hay motor de juego dedicado.
- **Principio III — Rigor Matemático:** Cumplido. Consume las gramáticas exactas `boolean` para E01 y `vertex` para E08 definidas en la spec 001. No usa tolerancias arbitrarias ni `eval`.
- **Principio IV — Estructura y Estilo:** Cumplido. Código ubicado en `frontend/` y `backend/`. Se conservan los IDs `E01` y `E08`, `REQ-01`...`REQ-19` y `AC-01`...`AC-17`.
- **Principio V — Estados Explícitos:** Cumplido. Distingue `correct`, `incorrect`, `indeterminate`, `incomplete` (cliente) y error técnico. Muestra el origen `local` o `API` explícitamente y sin fallback silencioso.
- **Principio VI — SDD y Autorización:** Cumplido. Basado en `specs/002-primer-recorrido/spec.md`.
- **Principio VII — Control Humano:** Cumplido. Plan presentado para revisión del Aprobador.

## Project Structure

### Documentation (this feature)

```text
specs/002-primer-recorrido/
├── spec.md              # Especificación funcional aprobada / en revisión
├── plan.md              # Este plan de implementación
├── research.md          # Investigación de patrones de integración y persistencia (Fase 0)
├── data-model.md        # Modelo de datos de progreso y estado de pantalla (Fase 1)
├── quickstart.md        # Guía de verificación runnable end-to-end (Fase 1)
├── contracts/           # Esquemas JSON / TS de la sesión del recorrido y persistencia (Fase 1)
└── checklists/
    └── requirements.md  # Lista de verificación de calidad de la spec
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── shared/
│   │   ├── validation/     # Adaptador TypeScript consumido de 001
│   │   ├── interaction/    # Máquina de estados de interacción 2D consumida de 003
│   │   └── storage/        # Servicio de persistencia LocalStorage con versionado
│   ├── features/
│   │   ├── index/          # Pantalla principal (Índice) y modal de confirmación
│   │   ├── info/           # Pantallas estáticas: Instrucciones, Cómo se Juega, Acerca de
│   │   ├── intro/          # Pantalla de Introducción breve
│   │   └── flow/           # Gestor del recorrido de prueba E01 -> E08
│   └── zones/
│       ├── zone-1/         # Componente PixiJS para E01 (Diagrama sagital)
│       └── zone-3/         # Componente Mafs para E08 (Parábola con vértice)
└── tests/
    ├── unit/               # Pruebas unitarias de almacenamiento y gestor de flujo
    └── integration/        # Pruebas de integración React / PixiJS / Mafs / Validación

backend/
└── app/
    └── validation/         # Servicio FastAPI SymPy consumido de 001 (Modo API)
```

**Structure Decision**: Aplicación web separada (`frontend/` + `backend/`). La lógica de presentación React y renderizado 2D reside en `frontend/src/`, consumiendo los módulos compartidos de validación y de interacción 2D.

## Complexity Tracking

*Sin violaciones constitucionales que justificar.*
