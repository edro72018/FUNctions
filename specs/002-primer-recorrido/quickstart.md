# Quickstart: Primer recorrido — índice y recorrido E01/E08

**Feature**: `002-primer-recorrido` | **Fecha**: 2026-11-16 | **Estado**: guía de verificación para la etapa de implementación autorizada

Esta guía describe cómo comprobar el corte una vez implementado. En la etapa actual solo existe el
diseño: **no hay código de producto, dependencias instaladas ni pruebas ejecutadas**. Los comandos y
resultados siguientes no deben presentarse como evidencia hasta que la implementación esté
autorizada.

## 1. Requisitos previos

- Node.js `24.22.1` y npm, objetivo aprobado por [DV-001](../decisiones/DV-001.md).
- Python 3 opcional, solo para comprobar la sintaxis JSON con `python3 -m json.tool`.
- Objetivo de desarrollo aprobado: TypeScript 5.6.3, Vitest 4.1.12 y Ajv 8.20.0.
- Dependencias aprobadas por DV-001: React 18.3.1, React DOM 18.3.1,
  PixiJS 8.23.0, Mafs 0.21.0, Vite 7.3.8 y `@vitejs/plugin-react` 5.1.0;
  `@types/react` 18.3.31, `@types/react-dom` 18.3.7 y override `katex` 0.19.1.
- La aprobación del 2026-11-16 autoriza la migración de configuración, no funcionalidades ni acredita instalación o pruebas. Las observaciones originales de ausencia de dependencias son históricas. Los requisitos matemáticos, API y especificaciones funcionales no cambian.
- No se requiere backend para este corte. El camino API se verifica con un transporte falso o con un
  endpoint ya configurado; 002 no crea un backend.

## 2. Comandos base

Después de la implementación autorizada:

```bash
cd frontend
npm ci
npm run typecheck
npm test
```

El servidor de desarrollo se añadirá con la implementación:

```bash
cd frontend
npm run dev
```

**Resultado esperado**: `tsc --noEmit` sin errores y todas las pruebas de lógica pura en verde. Las
pruebas de interfaz no se ejecutan en Node; se verifican manualmente.

## 3. Validación estructural de contratos

La sintaxis JSON se comprueba con:

```bash
python3 -m json.tool specs/002-primer-recorrido/contracts/progress.schema.json >/dev/null
for file in specs/002-primer-recorrido/contracts/examples/*.json; do
  python3 -m json.tool "$file" >/dev/null
done
echo "sintaxis JSON correcta"
```

La validación semántica con Ajv se implementará en
`frontend/tests/contracts/progress.spec.ts` (nombre previsto). Debe comprobar:

- `progress.fresh.valid.json`, `progress.e01-complete.valid.json` y
  `progress.complete.valid.json` contra `progress.schema.json`;
- rechazo de `progress.unknown-version.invalid.json` y `progress.origin.invalid.json`;
- que `origin` no puede persistirse;
- que el paso `complete` exige `["E01", "E08"]` y `activeExerciseId: null`.

## 4. Escenarios automáticos de lógica pura

| # | Escenario | Procedimiento | Resultado esperado | Cobertura |
|---|---|---|---|---|
| A-01 | Progreso nuevo | Crear misión y serializar. | `schemaVersion: 1`, paso `intro`, sin resueltos, sin intentos, `preferences: {}`. | REQ-16 |
| A-02 | E01 resuelto | Marcar E01 y serializar. | Paso `E08`, `completedExerciseIds: ["E01"]`, `activeExerciseId: "E08"`. | REQ-16, AC-16 |
| A-03 | Recorrido completo | Marcar E01 y E08. | Paso `complete`, ambos resueltos, `activeExerciseId: null`; no se afirma 15/15. | REQ-16, REQ-19 |
| A-04 | Progreso corrupto | Cargar JSON inválido, esquema inválido y versión `2`. | Estado de recuperación; no se sobrescribe; no se ofrece Continuar. | REQ-16 |
| A-05 | Respaldo de recuperación | Iniciar misión nueva desde recuperación. | El contenido anterior queda en una clave de respaldo antes de escribir. | REQ-16 |
| A-06 | Almacenamiento no disponible | Simular `setItem` que lanza. | Se informa que no se guardó; no se afirma conservación. | REQ-16 |
| A-07 | Desbloqueo E01 → E08 | Intentar abrir E08 antes y después de resolver E01. | Antes: bloqueado. Después: disponible como avance parcial. | REQ-16, REQ-19 |
| A-08 | E01 correcto | Validar `boolean: true`. | `correct`, origen `local`, intento añadido y E01 resuelto; Continuar avanza. | AC-13 |
| A-09 | E01 incorrecto | Validar `boolean: false`. | `incorrect`, `E01_SHARED_IMAGE_VALID`, reintento disponible. | AC-13 |
| A-10 | E08 correcto | Validar `vertex h=3, k=2`. | `correct`, `E08_VERTEX_CONFIRMED`. | AC-14 |
| A-11 | E08 incorrecto por signo | Validar `vertex h=-3, k=2`. | `incorrect`, `E08_VERTEX_SIGN`; no se redondea. | AC-14 |
| A-12 | E08 incorrecto por decimal | Validar `vertex h=2.99, k=2`. | `incorrect`, `E08_VERTEX_MISMATCH`; no se acepta por parecido visual. | AC-14 |
| A-13 | Campo vacío | Validar E01 sin selección y E08 con `h` o `k` vacío. | `incomplete`; no se envía; no crea intento. | AC-13, AC-14 |
| A-14 | `indeterminate` | Entregar un resultado `indeterminate`. | Se informa; no se marca incorrecto; no crea intento. | AC-15 |
| A-15 | Error técnico | Entregar `ValidationError` de transporte/servicio. | Error visible; borrador intacto; no `incorrect`; no intento. | AC-15 |
| A-16 | Respuesta obsoleta | Enviar solicitud A, cambiar a B y entregar A después. | A se descarta; B conserva el estado; no cambia el origen. | AC-15, AC-17 |
| A-17 | Origen local/API | Validar por cada gateway. | La etiqueta coincide con el gateway; una validación local nunca se etiqueta API. | AC-17 |
| A-18 | Sin fallback | Configurar `api` sin URL o con transporte fallido. | Error técnico; no se ejecuta el validador local. | AC-17 |
| A-19 | Ayudas secuenciales | Consultar H2 antes de H1; consultar H1, H2 y H3. | H2/H3 bloqueadas fuera de orden; `maxHint` monótono; H3 no rellena ni envía. | REQ-15 |
| A-20 | Formatos numéricos | Introducir `3`, `3,0`, `3.0`, `2,99`, `2.99`, `+3`, `3e0`. | Los válidos se normalizan a `3`/`2.99`; `+3` y `3e0` son incompletos. | REQ-13, AC-14 |

## 5. Escenarios manuales de interfaz

Ejecutar con la aplicación en `npm run dev`, en computadora y, cuando sea posible, en tableta o
emulación táctil.

### M-01 — Índice sin progreso

1. Abrir la ruta inicial con LocalStorage limpio.
2. Comprobar el nombre FUNctions, la descripción y las cuatro acciones base.
3. Comprobar que no aparece Continuar, temporizador, vidas, puntos ni insignias.

**Esperado**: 4/4 acciones base; Continuar ausente; sin elementos prohibidos. Cubre AC-01, AC-11,
AC-12.

### M-02 — Índice con progreso y confirmación

1. Cargar `progress.e01-complete.valid.json` en `functions.progress.v1`.
2. Recargar y comprobar que aparece Continuar.
3. Activar Continuar y comprobar que retoma el recorrido en E08.
4. Volver al índice, activar Comenzar y comprobar el diálogo de confirmación.
5. Cancelar y comprobar que el progreso sigue disponible.

**Esperado**: Continuar restaura sin borrar; Comenzar no reemplaza sin confirmación. Cubre AC-02,
AC-16.

### M-03 — Introducción y recorrido

1. Con LocalStorage limpio, activar Comenzar.
2. Comprobar que se muestra la introducción real o el aviso de contenido pendiente.
3. Avanzar y comprobar que E01 está disponible y E08 bloqueado.
4. Resolver E01 y comprobar que E08 aparece como avance parcial.

**Esperado**: no se salta la introducción; E08 no se presenta como Zona 3 completa. Cubre AC-02,
AC-12, AC-16, REQ-19.

### M-04 — E01

1. Abrir E01 sin selección y pulsar Probar.
2. Elegir «Es función» y pulsar Probar.
3. Reintentar, elegir «No es función» y pulsar Probar.
4. Consultar H1, H2 y H3; comprobar que H3 no envía ni rellena.
5. Usar Deshacer y Reiniciar con y sin cambios.

**Esperado**: `incomplete`, `correct` y `incorrect` respectivamente; el resultado correcto marca E01
resuelto; diagnóstico de salida compartida; ayudas secuenciales; reinicio con confirmación solo si
hay cambios. Cubre AC-13, REQ-15.

### M-05 — E08

1. Abrir E08 con E01 resuelto.
2. Pulsar Probar con `h` o `k` vacío.
3. Introducir `h = 3`, `k = 2` y probar.
4. Reintentar con `h = -3`, `k = 2` y probar.
5. Reintentar con `h = 2.99`, `k = 2` y probar.
6. Repetir todo usando solo teclado.

**Esperado**: `incomplete`, `correct`, `incorrect` con signo e `incorrect` con vértice; la curva no
se acepta por parecido visual. Cubre AC-14, AC-16.

### M-06 — Persistencia y recarga

1. Resolver E01 y recargar.
2. Comprobar que E01 sigue resuelto y que E08 está disponible.
3. Escribir un borrador de E08, volver al recorrido y regresar.
4. Recargar y comprobar que el borrador se restaura.
5. Comprobar que el origen del resultado anterior no reaparece tras recargar.

**Esperado**: progreso y borrador restaurados; origen no persistido. Cubre AC-16, AC-17.

### M-07 — Origen local y API

1. Arrancar con `validationMechanism = local`; validar E01 y comprobar «local».
2. Arrancar con `validationMechanism = api` y un endpoint de prueba que devuelva el resultado de 001;
   comprobar «API».
3. Apagar el endpoint y validar; comprobar error técnico, respuesta conservada y reintento.
4. Comprobar que no se ejecuta el validador local en el paso 3.

**Esperado**: origen real, sin fallback silencioso. Cubre AC-17, AC-15.

### M-08 — Acerca de y contenido

1. Abrir Acerca de con `approvalStatus: pending`.
2. Comprobar el aviso de contenido pendiente y la ausencia de datos inventados.
3. Cambiar a `approved` y comprobar nombre, propósito, equipo, autoría y licencia MIT.
4. Buscar NASA, ANE y logotipos oficiales.

**Esperado**: solo contenido aprobado o aviso; 0 atribuciones reales. Cubre AC-05.

### M-09 — Accesibilidad

| Revisión | Procedimiento | Evidencia esperada |
|---|---|---|
| Foco y teclado | Recorrer índice, intro, recorrido y ambos ejercicios con `Tab`/`Shift+Tab`; activar con `Enter`/`Space` | Foco visible en cada control; orden coherente; ninguna acción inaccesible |
| Táctil | Probar en tableta o emulación; medir objetivos | Todos ≥ 44×44; sin activaciones vecinas |
| Sin color único | Inspeccionar resultados, ayudas, bloqueos y errores | Texto o icono además del color |
| Lector de pantalla | Activar los estados de validación y las ayudas | Estado y diagnóstico se anuncian; el canvas de E01 tiene descripción; los campos de E08 tienen etiqueta |
| Diálogos | Abrir y cerrar confirmaciones con teclado | Foco inicial, `Escape` y retorno de foco correctos |

Cubre AC-08, AC-09, AC-16.

### M-10 — Progreso ilegible

1. Escribir un JSON inválido en `functions.progress.v1`.
2. Recargar y comprobar `progress-recovery`.
3. Confirmar «Iniciar misión nueva» y comprobar la clave de respaldo.
4. Repetir con `schemaVersion: 2`.

**Esperado**: no se sobrescribe sin confirmación; se conserva el contenido anterior. Cubre REQ-16.

## 6. Evidencia de cierre

La implementación deberá registrar, para cada escenario ejecutado:

| Campo | Contenido |
|---|---|
| Escenario | ID de esta guía |
| Fecha y entorno | Fecha, navegador, sistema y dispositivo |
| Procedimiento | Pasos realmente ejecutados |
| Resultado | Observado, con captura o video cuando sea UI |
| Cobertura | REQ/AC |
| Incidencias | Fallos, bloqueos o desviaciones |

### Ejecución registrada — 2026-11-17

**Entorno**: Linux, Node.js 24.22.1, Vitest 4.1.12 en entorno `node`, sin navegador ni lector de
pantalla. **Comandos ejecutados** en `frontend/`: `npm run typecheck`, `npm test` y `npm run build`.

**Resultado**: `typecheck` sin errores; `232` pruebas aprobadas en `24` archivos; `build` correcto con
Vite 7.3.8. Persiste el aviso no bloqueante de chunk mayor a 500 kB por PixiJS y Mafs.

| Escenario | Resultado | Evidencia automatizada |
|---|---|---|
| A-01 | PASS | `tests/progress/store.spec.ts` — progreso nuevo |
| A-02 | PASS | `tests/progress/store.spec.ts`, `tests/flow/flow.spec.ts` — E01 resuelto |
| A-03 | PASS | `tests/progress/store.spec.ts` — recorrido completo |
| A-04 | PASS | `tests/progress/store.spec.ts` — JSON, esquema y versión 2 |
| A-05 | PASS | `tests/progress/store.spec.ts` — respaldo de recuperación |
| A-06 | PASS | `tests/progress/store.spec.ts` — `setItem` que lanza |
| A-07 | PASS | `tests/flow/flow.spec.ts` — desbloqueo E01 → E08 |
| A-08 | PASS | `tests/exercises/e01.spec.ts` — E01 correcto |
| A-09 | PASS | `tests/exercises/e01.spec.ts` — E01 incorrecto |
| A-10 | PASS | `tests/exercises/e08.spec.ts` — E08 correcto |
| A-11 | PASS | `tests/exercises/e08.spec.ts` — E08 signo |
| A-12 | PASS | `tests/exercises/e08.spec.ts` — E08 decimal |
| A-13 | PASS | `tests/exercises/e01.spec.ts`, `e08.spec.ts` — campo vacío |
| A-14 | PASS | `tests/validation-gateway/gateway.spec.ts` — `indeterminate` |
| A-15 | PASS | `tests/validation-gateway/gateway.spec.ts` — error técnico |
| A-16 | PASS | `tests/validation-gateway/gateway.spec.ts` — respuesta obsoleta |
| A-17 | PASS | `tests/validation-gateway/gateway.spec.ts`, `tests/flow/journey.spec.ts` — origen |
| A-18 | PASS | `tests/validation-gateway/gateway.spec.ts` — sin fallback |
| A-19 | PASS | `tests/exercises/e01.spec.ts`, `e08.spec.ts` — ayudas secuenciales |
| A-20 | PASS | `tests/exercises/e08.spec.ts` — formatos numéricos |

**Escenarios manuales M-01…M-10**: **NO EJECUTADOS** en esta sesión. Requieren navegador real y, para
M-09, lector de pantalla y comprobación táctil; no se presentan como aprobados. Quedan pendientes de
T067.

Un escenario no ejecutado no cuenta como aprobado. La aprobación del plan no autoriza ejecutar esta
guía; la implementación y sus pruebas requieren la aprobación de tareas.

## 7. Referencias

- Pantallas, acciones y accesibilidad: [contracts/ui-contract.md](./contracts/ui-contract.md).
- Consumo de validación y origen: [contracts/validation-consumer.md](./contracts/validation-consumer.md).
- Esquema de progreso: [contracts/progress.schema.json](./contracts/progress.schema.json).
- Entidades e invariantes: [data-model.md](./data-model.md).
- Requisitos y criterios: [spec.md](./spec.md).
