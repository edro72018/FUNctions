# Quickstart: Contrato transversal de interacción 2D

**Feature**: `003-interaccion-2d` | **Fecha**: 2026-11-16 | **Estado**: guía de verificación para la etapa de implementación autorizada

Esta guía describe cómo comprobar el contrato una vez implementado. En la etapa actual solo existe el
diseño: **no hay código de producto ni pruebas ejecutadas**. Los comandos siguientes no deben
presentarse como evidencia hasta que la implementación esté autorizada y las pruebas existan.

## Requisitos previos

- Node.js `>=20.20.0 <21` (el repositorio declara `engines` y `.nvmrc`).
- Dependencias de desarrollo ya declaradas en `frontend/package.json`: TypeScript 5.6.3,
  Vitest 2.1.1 y Ajv 8.17.1.
- No se instalan paquetes nuevos. No se requiere navegador, `jsdom` ni `happy-dom` para la suite
  unitaria.

## Comandos base

```bash
cd frontend
npm ci
npm run typecheck
npm test
```

Filtro específico del contrato:

```bash
cd frontend
npm test -- interaction
```

**Resultado esperado**: `tsc --noEmit` sin errores y todas las pruebas de `tests/interaction/` en
verde, sin pruebas omitidas. Los esquemas de `contracts/` se validan dentro de
`tests/interaction/contracts.spec.ts` con Ajv; no se usa una CLI externa.

## Escenarios automáticos

| # | Escenario | Procedimiento | Resultado esperado | Cobertura |
|---|---|---|---|---|
| A-01 | Catálogo completo | Ejecutar `transitions.spec.ts` y contar las entradas exportadas. | 17 transiciones de control, 12 de validación y 9 prohibidas; 0 transiciones sin precondición, acción o resultado. | SC-01, AC-16 |
| A-02 | Paridad de entradas | Activar cada una de las 7 acciones esenciales con puntero, touch y teclado sobre los mismos controles de prueba. | 3/3 modos producen el mismo estado y efecto observable; ninguna acción existe en un solo modo. | SC-02, AC-02, AC-17 |
| A-03 | Arrastre y segundo contacto | Iniciar `dragging` con `pointerId=1`; enviar `pointermove` con `pointerId=2`; luego `pointerup` con `pointerId=2`. | El segundo contacto no mueve la vista previa, no sustituye la captura y no altera el valor confirmado. | AC-19, REQ-05 |
| A-04 | Confirmación y descarte | Soltar dentro del área válida y repetir fuera del área. | Dentro: confirma y libera captura. Fuera: restaura el último valor confirmado y no registra cambio. | AC-05, REQ-19 |
| A-05 | Cancelaciones | Cancelar un arrastre con `Escape`, `pointercancel`, `lostpointercapture` y `Tab`. | En los cuatro casos se restaura el valor confirmado; con `Tab`, el arrastre se cancela antes de mover el foco. | AC-06, AC-21, SC-03 |
| A-06 | Salida de edición | Con campo A en `editing`, despachar `pointerdown` en B con `editing.wellFormed=true`; repetir con `editing.wellFormed=false`. | Válido: confirma A y ejecuta B. Inválido: A conserva foco, muestra error, B no se activa y el texto no se pierde. | AC-20, SC-12 |
| A-07 | Bloqueo de `pending` | Iniciar Probar; durante `pending` intentar editar, arrastrar, deshacer, reiniciar y probar otra vez. | Todas las acciones de cambio se rechazan; el borrador no cambia; solo existe una solicitud vigente. | AC-09, REQ-09, REQ-10 |
| A-08 | Respuesta obsoleta | Enviar una solicitud, cambiarla por otra y entregar primero la respuesta anterior. | La respuesta anterior se descarta: 0 cambios de estado y 0 aplicación al ejercicio nuevo. | AC-11, SC-05 |
| A-09 | Error técnico | Entregar una `validation-response` con `kind="technical-error"` y un `errorCode`. | Se muestra error, el borrador y el foco se conservan, y no aparece `success`, `correct` ni `incorrect`. | AC-10, SC-04 |
| A-10 | Deshacer y reiniciar | Confirmar dos cambios, deshacer una vez; reiniciar con y sin cambios; reiniciar desde un resultado. | Deshacer revierte solo el último; reiniciar pide confirmación solo con cambios y limpia validación e historia. | AC-07, AC-08 |
| A-11 | Anuncios | Recorrer las entradas a los 12 estados y contar efectos `announce`. | 7/7 estados anunciados emiten un anuncio con nombre y efecto; los 5 estados de control no emiten; `sequence` es monotónico y no se repite en un re-render. | SC-11, AC-12, REQ-21 |
| A-12 | `success` explícito | Llegar a `correct` y dejar pasar el tiempo; después activar «Continuar». | Antes de «Continuar» no hay `success`; después se alcanza una sola vez; una repetición sin nueva validación se rechaza. | AC-18, SC-01 |
| A-13 | Independencia del renderizador | Ejecutar `architecture.spec.ts`. | 0 imports de React, PixiJS, Mafs, DOM, LocalStorage o HTTP en `src/shared/interaction/`. | REQ-20, REQ-22, AC-15 |
| A-14 | Esquemas y ejemplos | Ejecutar `contracts.spec.ts` con Ajv. | Los 5 ejemplos válidos compilan y validan; `event.invalid.json` es rechazado; los esquemas usan JSON Schema 2020-12. | SC-01, AC-16 |

## Verificación manual de accesibilidad

La suite de Node no puede demostrar foco visible, tamaño táctil ni ausencia de dependencia de color.
Cada consumidor debe aportar evidencia manual antes de declarar terminado su incremento:

| # | Revisión | Procedimiento | Evidencia esperada |
|---|---|---|---|
| M-01 | Foco visible y orden de lectura | Recorrer la pantalla solo con `Tab` y `Shift+Tab`, incluida una validación en curso. | Captura o video donde el foco se ve en cada control y no se pierde al entrar en `pending`. |
| M-02 | Objetivo táctil | Medir cada control operable en unidades de referencia del sistema de diseño. | Todos ≥ 44×44; ninguno activa a un vecino por error. |
| M-03 | Sin hover | Recorrer la interfaz con un dispositivo táctil o emulando ausencia de hover. | Toda acción esencial se descubre y ejecuta sin pasar el puntero. |
| M-04 | Sin color único | Inspeccionar cada estado visible. | Cada estado tiene texto, icono, forma o posición además del color. |
| M-05 | Anuncios en lector de pantalla | Activar los 7 estados anunciados y los 5 silenciosos con un lector real. | Los 7 se anuncian una vez; los 5 no generan anuncio de transición; el foco expone el nombre accesible. |

## Contrato de referencia

- Estados, acciones, eventos, efectos y obligaciones: [contracts/interaction-contract.md](./contracts/interaction-contract.md).
- Entidades, invariantes y catálogo C/V/X: [data-model.md](./data-model.md).
- Esquemas: [contracts/interaction-event.schema.json](./contracts/interaction-event.schema.json) y
  [contracts/interaction-effect.schema.json](./contracts/interaction-effect.schema.json).
- Requisitos y criterios normativos: [spec.md](./spec.md).

## Interpretación de resultados

- Un fallo de `typecheck` o de una prueba automática bloquea la verificación del escenario afectado;
  no se compensa con una revisión manual.
- Un fallo de M-01 a M-05 bloquea la accesibilidad mínima del consumidor, aunque la suite unitaria
  esté en verde.
- Un escenario no ejecutado no cuenta como aprobado. La evidencia debe indicar fecha, entorno,
  procedimiento y resultado.
- La aprobación del plan no autoriza ejecutar esta guía. La implementación y sus pruebas requieren la
  aprobación de tareas correspondiente.
