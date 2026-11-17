# Auditoría SDD y Gap Analysis — FUNctions

**Proyecto:** FUNctions — puzzle educativo 2D, React/TypeScript + PixiJS (Zona 1) + Mafs (Zonas 2–5) + FastAPI/SymPy + LocalStorage.  
**Alcance:** documentación vigente en `docs/` y `development/`; 5 Zonas, 15 Ejercicios, contratos de validación y experiencia.  
**Fecha:** 16/11/2026.  
**Naturaleza:** auditoría documental. No se ejecutó código ni pruebas; no existe implementación verificada en el workspace (`docs/scrum.md`, §1).  
**Fuentes principales:** `docs/workspace/GDD_FUNctions_v0.1.md`; `development/docs/banco_ejercicios.md`; `development/docs/exercises.md`; `development/specs/001-nucleo-validacion/spec.md`; `development/docs/politicas/contrato-api.md`; `development/.specify/memory/constitution.md` (propuesta 0.4.0); `docs/constitution_draft.md`; `development/docs/politicas/estructura-proyecto.md`; `docs/scrum.md`.  
**Convenciones:** `Confirmado` = decisión explícita; `Documentado` = existe pero no ratificado; `Propuesto` = opción de esta auditoría; `Pendiente` = falta decisión. Severidad: **B** bloqueante, **A** alta, **M** media.

---

## 1. Resumen ejecutivo del estado de las specs

### 1.1 Veredicto

FUNctions tiene una base pedagógica y narrativa superior a la media: promesa clara, 15 ejercicios con solución canónica, errores frecuentes, ayudas H1–H3, reglas de progreso no punitivas y un GDD que define mecánicas, HUD, assets y audio. El contenido **sabe qué enseñar**.

Lo que todavía no existe es la capa que convierte esa intención en comportamiento verificable: **un contrato por ejercicio, una máquina de estados de interacción, una operacionalización del flujo/ZDP y un modelo de respuesta compuesta**. La única spec existente (`001-nucleo-validacion`) es un buen esqueleto transversal, pero declara explícitamente que no implementa los 15 validadores y deja pendientes los tipos, la normalización, los errores y la composición. El contrato de API va por detrás del GDD: no tiene `boolean`, `vertex`, `point`, `asymptote` ni respuesta compuesta.

**Diagnóstico:** proyecto en **nivel 2 de 5**: diseño aprobado y documentado, especificación **no ejecutable**. No es un problema de contenido matemático; es un problema de **operacionalización SDD**.

### 1.2 Índice de Madurez SDD (IMSDD)

Escala: **0** inexistente; **1** intención narrativa; **2** borrador con huecos; **3** especificado y verificable; **4** ejecutable con contratos y pruebas trazadas; **5** verificado en implementación. El índice es el promedio simple de las dimensiones; es indicativo, no una certificación.

| Dimensión | Nivel | Evidencia | Brecha principal |
|---|---:|:---|:---|
| Visión y alcance | 4 | GDD v0.1 aprobado; 5 Zonas/15 Ejercicios; reglas no punitivas; no-goals narrativos | Algunas decisiones narrativas siguen abiertas en `docs/design_game.md` |
| Contenido matemático | 3 | Banco canónico con 15 fichas, soluciones, errores y pruebas de diseño | C01–C07 sin ratificar; fuentes didácticas sin contrastar; revisión cruzada pendiente |
| Contratos de respuesta | 2 | Spec 001 define 7 discriminantes; API define 5 formas | Sin respuesta compuesta; faltan `point`, `asymptote`; asociación Ejercicio→tipo pendiente |
| Validación backend/SymPy | 2 | Reglas en prosa y snippet de referencia; separación correcta de capas | Sin validador por ejercicio, gramática, límites, códigos ni prioridad de diagnóstico |
| Interacción 2D/UI | 2 | Tabla de entradas mouse/touch/teclado; lista de assets y estados visuales | Sin máquina de estados, eventos, captura de puntero, foco, tolerancias ni señalamientos |
| Progresión y flujo | 1 | 5 Zonas × 3 niveles; dificultad “creciente” declarada | Sin escala ordinal, curva calibrada, 4 momentos por nivel ni métricas de flujo |
| Andamiaje ZDP | 2 | H1–H3 voluntarias y secuenciales; textos por ejercicio | Sin disparador error→pista, sin desvanecimiento, H3 revela solución sin confirmación |
| Persistencia | 1 | Campos guardados declarados; LocalStorage decidido | Sin esquema, versionado, migraciones, corrupción, cuota ni multi-pestaña |
| Paridad estática | 1 | Modo estático aprobado como contingencia | Sin alcance, fixtures de paridad ni etiquetado de origen |
| Accesibilidad/localización | 2 | Principios: texto+icono, 44 px, teclado, movimiento reducido | Sin criterios de aceptación, ARIA, alternativa de canvas, formato numérico español |
| Pruebas y trazabilidad | 2 | Matriz de casos de diseño; DoD propuesta | Sin pruebas ejecutables ni trazabilidad REQ/AC→test |
| Gobernanza SDD | 2 | Constitución 0.4.0 propuesta; Spec Kit instalado; plantillas en `.specify/templates`; spec 001 | 001 sin migrar al formato; referencias obsoletas; ambigüedad de Product Owner |

**IMSDD indicativo: 2,0/5.** Lectura: “hay diseño y documentación, pero todavía no hay especificación ejecutable ni evidencia de verificación”.

### 1.3 Qué está listo para convertirse en spec ejecutable

| Estado | Elementos | Uso recomendado |
|:---|:---|:---|
| **Listo para congelar** | Alcance 5×3/15; nombres e IDs E01–E15; narrativa ESAI; reglas de progreso, reintentos y victoria 15/15; inventario de entradas; assets/audio; principios de accesibilidad; respuestas canónicas (salvo C01–C07) | Base de `spec.md` y de los contratos de contenido |
| **Listo con normalización** | Ayudas H1–H3 por ejercicio; errores frecuentes; matriz de casos del GDD; campos de progreso; tabla de errores HTTP | Convertir a `feedback-codes.yaml`, `hints-matrix.yaml`, `progress.schema.json` |
| **No listo** | Modelo compuesto; tipos `point`/`asymptote`; gramática numérica/simbólica; máquina de estados UI; disparadores de pistas; prioridad de feedback; persistencia; paridad estática; métricas de flujo; 4 momentos; Bartle; política de exactitud/tolerancia | No implementar sin decisión explícita |

### 1.4 Cinco bloqueos críticos

1. **B1 — Taxonomía de resultados y respuesta compuesta.** El GDD habla de `incompleto`; la spec 001 solo admite `correct`, `incorrect`, `indeterminate`; la API solo devuelve esos tres. Además, 12 de 15 ejercicios piden varios campos y no existe un tipo compuesto ratificado.
2. **B2 — Contratos por ejercicio.** No hay esquema, normalización, valores canónicos, diagnósticos ni casos de prueba ejecutables para E01–E15. Sin esto, el backend no puede implementarse sin inventar reglas.
3. **B3 — Interacción y estados visuales.** Hay tabla de controles, pero no máquina de estados ni contrato de eventos. PixiJS y Mafs no tienen definidos `idle → dragging → invalid → success → error`, captura de puntero, cancelación, foco ni alternativa de teclado.
4. **B4 — Flujo, ZDP y 4 momentos.** La dificultad es una afirmación, no una curva. Las pistas son secuenciales pero no adaptativas; H3 revela la solución. No existe plantilla de Introducción/Desarrollo/Subversión/Clímax ni mapa Bartle.
5. **B5 — Persistencia, paridad estática y gobernanza.** “Se guarda tras una edición confirmada” no define cuándo ni cómo; el modo estático no tiene contrato de paridad; la ruta `/docs/specs/` solicitada no coincide con la canónica `development/specs/`.

### 1.5 Restricción de calendario

La entrega académica es el **17/11/2026** y el workspace no contiene implementación verificada. Un plan de 15 ejercicios con contratos completos no cabe antes de esa fecha. Para la entrega inmediata, el alcance viable es: **decisiones B1–B3 + specs P0 + un recorrido vertical E01/E08** (si se autoriza implementar). El resto es producto posterior a la entrega; no debe presentarse como terminado.

---

## 2. Evaluación por ejes e inconsistencias

> “Estética” se usa en el sentido MDA: **experiencia emocional**, no dirección de arte.

### 2.1 Eje 1 — Alineación MDA y experiencia

| Capa MDA | Estado actual | Riesgo | Veredicto |
|:---|:---|:---|:---|
| **Mecánica** | 9 verbos definidos: clasificar, desconectar, conectar, sombrear, girar/ajustar, arrastrar puntos, posicionar recta, construir conjuntos, completar/evaluar | E01 es binario y sin agencia; E09/E12/E14/E15 son campos de texto; E10–E15 dependen de respuestas declarativas | Cobertura amplia, pero **desigual**: la manipulación se concentra en Z1–Z3 |
| **Dinámica** | Exploración por tanteo, detección de invariantes, cambio de representación, comparación de estrategias, revisión de supuestos | El sistema solo evalúa al pulsar **Probar**; no hay indicador local de congruencia; el tanteo es lento | Fuerte en E02/E03/E07/E08/E11; **débil en E09/E12/E14/E15** |
| **Estética** | Curiosidad, descubrimiento, seguridad, satisfacción, autonomía (GDD §1.5) | En Z4–Z5 la experiencia se desplaza de “enigma” a “examen de varios campos exactos”; H3 puede convertir el reto en copia | **Coherente en la intención; inconsistente en la segunda mitad** |

**Hallazgo concreto:** el GDD usa como ejemplo de curiosidad “¿Por qué esta entrada produce dos salidas?” (§1.5). Esa pregunta pertenece a **E02** (unicidad violada), no a **E01**, cuya relación `{(1,4),(2,4),(3,5)}` sí es función y comparte salida sin violar nada. Si el texto se usa en E01, enseña el concepto equivocado.

**Principios de nivel:** el GDD enseña controles en Z1, da recordatorios en Z2–Z3 y retira guía en Z4–Z5 (bueno); sin embargo, E10 introduce dominio, rango y asíntota a la vez, y E11 exige cinco campos. No hay regla de “un elemento nuevo por nivel”, ni señalización visual de qué mirar, ni un momento de subversión explícito. El único clímax integrador claro es **E15**; la única subversión conceptual fuerte es **E14** (conjunto vacío).

**Veredicto:** MDA está bien planteado en Z1–Z3; en Z4–Z5 la mecánica pierde la manipulación que sostenía la dinámica de descubrimiento. **Se requiere una decisión de diseño**, no solo una spec: conservar al menos una manipulación significativa por ejercicio y usar el campo numérico como alternativa, no como mecánica principal.

### 2.2 Eje 2 — Canal de flujo y curva de dificultad

| Condición de flujo | Estado | Brecha |
|:---|:---|:---|
| Metas claras | Alta | Panel de objetivo y campos solicitados; falta checklist de éxito por ejercicio |
| Retroalimentación inmediata | Media | Solo al pulsar **Probar**; no hay feedback de congruencia mientras se manipula |
| Reto–habilidad equilibrado | Baja evidencia | Etiquetas de dificultad inconsistentes; sin calibración ni tiempos/ensayos |
| Sensación de control | Alta | Deshacer, reiniciar, reintentos ilimitados, sin temporizador ni vidas |
| Concentración | Alta | Estética retrofuturista y audio discreto; falta presupuesto de rendimiento |

**Curva:** las etiquetas no son comparables. El banco usa `Baja / Baja-Intermedia / Intermedia / Intermedia-Avanzada / Avanzada`; `exercises.md` usa `Inicial / Intermedia / Consolidación`. E11 figura como “Intermedia” en la guía y “Intermedia-Avanzada” en el banco; E10 como “Intermedia” y “Baja-Intermedia”; E13–E15 como “Consolidación” frente a “Intermedia-Avanzada / Avanzada”. No hay escala ordinal ni definición de qué hace difícil un nivel.

**Pico y valle:** E11 exige 2 puntos reflejados + dominio + rango + asíntota (5 campos) y es probablemente el pico real, pero está en el segundo nivel de Z4, no en el clímax. E13 solo pide dominio + asíntota (2 campos) y aparece como “Consolidación” en Z5. La curva **no es monótona** con la etiqueta.

**4 momentos:** el GDD define 7 componentes de nivel (contexto, objetivo, datos, estado inicial, herramientas, evaluación, cierre), pero **no** Introducción/Desarrollo/Subversión/Clímax. Con 3 niveles por Zona, los 4 momentos no caben uno-a-uno: hay que decidir si se aplican a la Zona (con un momento compartido) o dentro de cada nivel (beat sheet). Hoy solo E14/E15 tienen subversión y clímax reconocibles.

**ZDP:** H1 está disponible desde el inicio, H2 tras H1 y H3 tras H2; tras un error se sugiere la siguiente ayuda. Esto evita frustración, pero **no es adaptativo**: no hay mapeo error→pista, no se desvanece la ayuda al repetir y H3 muestra la solución sin confirmación. El jugador puede recorrer H1→H2→H3 sin intentar. No se mide autonomía; solo se registra “mayor pista consultada”.

**Veredicto:** el flujo está protegido contra ansiedad (sin timer/vidas), pero **no está diseñado para el ciclo rápido de hipótesis** que exige el tanteo. La curva es una afirmación, no una especificación.

### 2.3 Eje 3 — Perfil de jugadores (Bartle)

> Bartle es una lente heurística, no una medición. El juego es single-player, sin chat ni competencia; Socializer/Killer deben declararse **non-goals** para evitar alcance accidental.

| Perfil | Valor que recibe hoy | Dónde | Brecha |
|:---|:---|:---|:---|
| **Triunfador (Achiever)** | Verificación exacta, 15/15, sistemas restaurados, repetición | Todo el juego; E01–E15 | Sin registro de maestría (resolver sin H3), sin checklist por campo, sin reto opcional; la ausencia de puntos/insignias es deliberada, pero deja poco “progreso de dominio” |
| **Explorador (Explorer)** | Dos reparaciones válidas, diales, vértice, reflexión | E02/E03, E07/E08, E11 | E09/E12/E14 son teclado/fields; no hay sandbox ni “¿qué pasa si…?”; E01 no permite explorar |
| **Socializador** | Nada | — | Non-goal explícito; no hay chat, comparación ni cooperación |
| **Killer** | Nada | — | Non-goal explícito; no hay timer, ranking ni competencia |

**Veredicto:** el diseño sirve razonablemente a **Achiever** y **Explorer en Z1–Z3**, pero la balanza se inclina a Achiever en Z4–Z5. Si Explorer es un perfil objetivo, hace falta al menos una sonda de exploración por Zona (sin cambiar la respuesta canónica) y reconocer las reparaciones alternativas donde existan.

### 2.4 Eje 4 — Especificación de interfaz y gráficos 2D

El GDD §4.1 define entradas mouse/touch/teclado, áreas táctiles de 44×44 px, cancelación al soltar fuera y una herramienta explícita de desplazamiento. La lista VIS-04 define estados “reposo, selección, foco, conexión válida y diagnóstico”. Es una base correcta, pero **no es un contrato de interacción**: falta la máquina de estados, el contrato de eventos y la relación React↔PixiJS/Mafs.

**Máquina de estados mínima propuesta** (no existe hoy):

| Estado | Entrada | Salida visual | Acciones permitidas |
|:---|:---|:---|:---|
| `idle` | Sin interacción | Estado base | hover/focus/seleccionar |
| `hover/focus` | Puntero o Tab | Anillo de foco, etiqueta | seleccionar/arrastrar |
| `selected` | Clic/toque/Enter | Anillo + etiqueta | arrastrar/retirar/cancelar |
| `dragging` | `pointerdown` + umbral | Cable fantasma o punto activo | soltar/cancelar |
| `valid-drop` | Puntero sobre destino válido | Resaltado de destino | soltar |
| `invalid-drop` | Destino inválido | Señal discreta, no color-only | soltar/cancelar |
| `pending` | **Probar** | Botón deshabilitado + estado | esperar/cancelar |
| `correct` | Resultado | Éxito + explicación | continuar/repetir |
| `incorrect` | Resultado | Error + campo señalado | editar/reintentar/pista |
| `incomplete` | Prevalidación local | Campos marcados | editar |
| `technical-error` | Fallo API/red | Error neutro + reintentar | reintentar/volver |
| `disabled/locked` | Progresión | Atenuado | ninguna |

**Brechas específicas:**

- **Eventos:** no se definen `pointerdown/move/up/cancel`, captura de puntero, umbral de arrastre vs clic, tolerancia de soltado, `touch-action`, multitáctil, `Escape`, `Tab`, flechas ni activación por teclado.
- **PixiJS:** no hay contrato de hit areas, z-order, ruteo de cables, cable fantasma, selección/borrado, ni sincronización de coordenadas mundo↔pantalla/DPR.
- **Mafs:** no hay contrato para extremos abiertos/cerrados, creación/eliminación de uniones, infinito, asíntota arrastrable, puntos con coordenadas, zoom/pan, colisión de etiquetas ni orden de capas.
- **Señalamientos:** no se especifica cuándo iluminar, pulsar, flechar o etiquetar; H1 y error usan el mismo canal visual sin diferenciación conductual.
- **Accesibilidad:** el canvas PixiJS no tiene modelo de foco por nodo, representación textual de aristas ni región viva para feedback; Mafs/SVG no tiene texto alternativo ni descripción de la gráfica.
- **Formato numérico:** interfaz en español, pero no se decide punto vs coma decimal, `−` Unicode, `∞`, `ℝ`, `∅` ni notación `]a,b[`.
- **Rendimiento/responsive:** sin breakpoints, tamaño de canvas, DPR, presupuesto de 60 fps, carga inicial ni fallback si WebGL/Mafs falla.

**Veredicto:** la intención de interacción está bien descrita en prosa; **falta el contrato ejecutable**. Sin él, PixiJS y Mafs se implementarán con estados incompatibles.

### 2.5 Eje 5 — Validación backend y casos frontera

La spec 001 acierta en la arquitectura: separa contratos, despacho y validadores; prohíbe ejecución arbitraria; distingue resultado matemático de error técnico; exige paridad local/API. Pero **no define un solo validador concreto**. El contrato de API tampoco alcanza al GDD: solo admite `number`, `expression`, `finiteSet`, `intervalUnion` y `mapping`; no tiene `boolean` (E01), `vertex` (E08), `point` (E11), `asymptote` (E10/E11/E13) ni respuesta compuesta (E04–E15).

**Contrato mínimo propuesto por ejercicio** (tipos y reglas son `Propuesto`, no ratificados):

| ID | Tipo(s) propuesto | Valor canónico | Normalización / comparación | Diagnóstico principal |
|:---|:---|:---|:---|:---|
| E01 | `boolean` | `true` | Exacto; sin selección = incompleto | `NO_ES_FUNCION` (confunde salida compartida con unicidad) |
| E02 | `mapping` + `edit` | `{(1,4),(2,4),(3,5)}` o `{(1,5),(2,4),(3,5)}`; se retira `(1,4)` o `(1,5)` | Igualdad de conjuntos + operación permitida + conservación del resto | `UNICIDAD_NO_REPARADA`, `EXISTENCIA_ROTA`, `OPERACION_NO_PERMITIDA` |
| E03 | `mapping` + `edit` | `{(1,4),(2,4),(3,5)}` o `{(1,4),(2,5),(3,5)}`; se añade `(2,4)` o `(2,5)` | Igualdad de conjuntos + una sola adición + conservación | `EXISTENCIA_NO_REPARADA`, `UNICIDAD_ROTA`, `OPERACION_NO_PERMITIDA` |
| E04 | `composite{domain, range}` | `ℝ`, `ℝ` | `intervalUnion`; alias `R`/`(-∞,+∞)`; infinito abierto | `RANGO_INCOMPLETO`, `INFINITO_CERRADO` |
| E05 | `composite{domain, range}` | `[2,+∞)`, `[0,+∞)` | Igualdad de intervalos; extremos incluidos | `EXTREMO_EXCLUIDO`, `RANGO_INCORRECTO` |
| E06 | `composite{domain, excluded}` | `(-∞,3)∪(3,+∞)`, `3` | Unión normalizada; orden indiferente; `ℝ\{3}` como alias | `PUNTO_INCLUIDO`, `UNION_INCOMPLETA`, `EXCLUIDO_INCORRECTO` |
| E07 | `composite{m,b}` | `-2`, `4` | `Rational` exacto; sin tolerancia | `PENDIENTE_SIGNO`, `B_INCORRECTO`, `PARAMETRO_INCORRECTO` |
| E08 | `composite{h,k}` o `vertex` | `3`, `2` | `Rational` exacto; `a=1` fijo | `SIGNO_H`, `VERTICE_INCORRECTO` |
| E09 | `finiteSet` | `{-3,3}` | Conjunto completo; orden/duplicados indiferentes; intervalo rechazado | `CONJUNTO_INCOMPLETO`, `ELEMENTO_EXTRA` |
| E10 | `composite{domain, range, asymptote}` | `ℝ`, `(0,+∞)`, `y=0` | Intervalos + `{orientación, valor}` | `RANGO_CERRADO`, `ASINTOTA_INCORRECTA` |
| E11 | `composite{points, domain, range, asymptote}` | `(0,1)→(1,0)`, `(1,2)→(2,1)`; `(0,+∞)`, `ℝ`, `x=0` | Pares con correspondencia; intervalos; asíntota | `PUNTO_NO_REFLEJADO`, `CAMPO_OMITIDO`, `ASINTOTA_INCORRECTA` |
| E12 | `composite{base, argument, result, solution}` | `3`, `81`, `4`, `4` | Números exactos; `log₃(81)=4` equivalente; `{4}` o `4` | `BASE_ARGUMENTO_INVERTIDOS`, `CONVERSION_INCOMPLETA` |
| E13 | `composite{domain, asymptote}` | `(4,+∞)`, `x=4` | Intervalo abierto + asíntota vertical | `DOMINIO_CERRADO`, `DESPLAZAMIENTO_OMITIDO` |
| E14 | `composite{S1, S2}` | `∅`, `{-1}` | Vacío explícito ≠ campo vacío; alias `{}`/`Ø`/`vacío` | `VACIO_NO_RECONOCIDO`, `S1_INCORRECTO`, `S2_INCORRECTO` |
| E15 | `composite{f(-2), f(0), domain}` | `0`, `11`, `ℝ` | Números exactos; unión que simplifica a `ℝ` | `RAMA_INCORRECTA`, `DOMINIO_INCORRECTO`, `RANGO_NO_SOLICITADO` |

**Reglas de normalización que faltan:**

- **Números:** exactos (`Rational`), no `Float`; aceptar fracción y decimal finito; rechazar `NaN`, `Infinity`, `1e309`, `-0` ambiguo; normalizar `−` Unicode; decidir coma decimal española.
- **Conjuntos:** orden y duplicados indiferentes; `∅` explícito distinto de campo vacío; alias `{}`, `Ø`, `vacío`, `no existe` (este último solo si se ratifica).
- **Intervalos:** canonizar extremos; infinito siempre abierto; fusionar solapados/contiguos; ordenar; `ℝ` ↔ `(-∞,+∞)`; `ℝ\{3}` → unión.
- **Asíntotas:** comparar orientación **y** valor; `y=0` ≠ `x=0`; `y=0.001` inválido.
- **Puntos:** conservar correspondencia origen→reflejo, no solo el conjunto de puntos.
- **Compuestos:** campos obligatorios, tipos y nombres estables; campo faltante = incompleto; campo extra = error estructural.
- **Expresiones:** gramática blanca, sin `eval`; si E12 se resuelve con campos estructurados, **no hace falta parser libre**.

**SymPy:** usar valores canónicos precalculados y comparar, no resolver ecuaciones arbitrarias del estudiante. `FiniteSet` con diferencia simétrica vacía; `Interval`/`Union` normalizados; `Rational` para parámetros; `simplify` solo para E12; `Piecewise.subs` para E15. Un timeout de CPU no se implementa con `asyncio.wait_for` (la Constitución ya lo advierte); usar proceso/worker con límite. `indeterminate` solo si el validador concluye que no puede decidir; un error de servicio no es `indeterminate` ni `incorrect`.

**Veredicto:** hay arquitectura, pero **no hay especificación analítica por ejercicio**. La matriz anterior es el mínimo que debe existir antes de programar validadores.

### 2.6 Tabla de inconsistencias y puntos de conflicto

| ID | Conflicto | Evidencia | Impacto | Decisión requerida | Sev. |
|:---|:---|:---|:---|:---|:---:|
| I-01 | `incompleto` no existe como resultado backend | GDD §3.3 lo usa; 001 §3.3/§6 dice que no es resultado matemático; API solo devuelve 3 estados | El cliente y el servidor no pueden coincidir en qué mostrar | `incomplete` como prevalidación local; API devuelve 422 estructural o 3 estados | **B** |
| I-02 | Respuesta compuesta sin contrato | 001 REQ-12 “forma pendiente”; API solo un `answer`; 12/15 ejercicios piden varios campos | Bloquea E04–E15 | `{kind:"composite", fields:{...}}` con componentes tipados | **B** |
| I-03 | Faltan tipos de respuesta | API: 5 formas; 001: 7; E01 `boolean`, E08 `vertex`, E11 `point`, E10/E11/E13 `asymptote` | No se pueden serializar respuestas reales | Añadir tipos y actualizar contrato antes de implementar | **B** |
| I-04 | `ℝ\{3}` no es una unión de intervalos | Banco E06 acepta `ℝ\{3}`; `intervalUnion` no modela diferencia de conjuntos | El validador rechazaría una respuesta declarada válida | Normalizar a `(-∞,3)∪(3,+∞)` o añadir `setDifference` | **A** |
| I-05 | Vacío vs campo vacío | GDD: campo vacío ≠ ∅; banco E14: `no existe` → ∅; exercises: aceptar ∅/{} pero no vacío; 001: alias sin unificar | Riesgo de aprobar un campo sin contestar o rechazar ∅ | Definir `finiteSet: []` explícito y alias permitidos | **B** |
| I-06 | E15: ¿la rama es campo obligatorio? | GDD §2.2 “valores de una rama”; exercises “elegir rama”; banco “rellena campos de evaluación” | Cambia la UI y el contrato | Rama obligatoria o explicativa; actualizar las tres fuentes | **A** |
| I-07 | E02/E03: estado final vs operación | Banco/GDD exigen “retirar únicamente” / “agregar únicamente”; validar solo el conjunto final permitiría borrar y reañadir | Un estudiante puede cumplir el estado sin realizar la operación pedida | Validar conjunto final **y** operación (par retirado/añadido) | **B** |
| I-08 | E12: parser algebraico vs campos | Matriz del banco: “Input Algebraico”; ficha E12: casillas Base/Argumento/Resultado; GDD §2.2: completar base/argumento/resultado | Si se exige expresión libre, crece el riesgo de parser y seguridad | Campos estructurados en v1; expresión solo como alternativa aprobada | **A** |
| I-09 | E11: conjunto de puntos vs correspondencia | Banco: “los puntos deben corresponder a sus puntos originales” | Intercambiar (1,0) y (2,1) podría pasar como conjunto | Modelar pares origen→reflejo, no solo `finiteSet` de puntos | **A** |
| I-10 | E07/E08: exactitud vs dial visual | C03 exige `m=-2,b=4` y `h=3,k=2` exactos; el trazo puede coincidir con `-1.99` / `2.99`; no hay política de redondeo | Frustración y falsos negativos si el control no permite el valor exacto | Entrada numérica autoritativa + snap exacto; redondeo solo de visualización | **A** |
| I-11 | Asíntota sobre el eje | E10 pide `y=0` (eje X); E11 pide `x=0` (eje Y); el GDD propone arrastrar una recta | El eje y la asíntota compiten por el mismo gesto | Control dedicado o clic-para-colocar; ejes no arrastrables | **A** |
| I-12 | “Evaluar todas” vs “primer error” | GDD §3.3 paso 3 “evaluar todas las condiciones”; §3.2 “diagnóstico del primer error relevante” | Mensajes contradictorios y prioridad no determinista | Orden de diagnóstico por ejercicio + checklist por campo | **A** |
| I-13 | Pistas no adaptativas; H3 revela | GDD §2.5: H1→H2→H3, H3 muestra solución; no hay mapeo error→pista ni desvanecimiento | El reto puede convertirse en copia; la ZDP no se verifica | Matriz error→pista, confirmación antes de H3, registro “sin ayuda” | **A** |
| I-14 | Etiquetas de dificultad y 4 momentos | Banco vs exercises usan escalas distintas; E11 pico en desarrollo; E13 valle en “Consolidación”; GDD no tiene 4 momentos | La curva no es verificable; el diseño de niveles no se puede auditar | Escala ordinal única + beat sheet por nivel + calibración | **A** |
| I-15 | Z4–Z5 pierden exploración | Mecánicas dominantes pasan a campos de texto (E09/E12/E14/E15); Bartle Explorer pierde valor | La estética “descubrimiento” se debilita al final | Conservar una manipulación significativa por ejercicio | **A** |
| I-16 | “Edición confirmada” no definida | GDD §2.4: guarda tras edición confirmada o resultado; también borrador del nivel activo | Autoguardado impredecible; pérdida de progreso | Puntos de guardado, debounce, esquema versionado | **M** |
| I-17 | Paridad estática sin contrato | 001 exige paridad local/API; API §8 menciona fallback; no hay alcance ni fixtures | El modo offline puede aprobar distinto que la API | Spec de paridad + fixtures compartidos + etiqueta de origen | **A** |
| I-18 | Gobernanza de rutas y roles | Usuario pide `/docs/specs/`; estructura canónica es `development/specs/`; plantillas existen en `.specify/templates` pero 001 no está migrada; banco cita `001-primer-recorrido`; Scrum da 3 Product Owners | Duplicación de fuente de verdad y decisiones sin responsable único | Ruta canónica + puntero + migrar 001 + PO único para ratificar | **A** |
| I-19 | Ejemplo de curiosidad mal ubicado | GDD §1.5 usa “dos salidas” para E01; E01 es función válida; el caso es E02 | Texto que enseña el concepto equivocado | Reescribir el ejemplo o moverlo a E02 | **M** |
| I-20 | C01–C07 no ratificados pero usados | GDD §3.3 los llama “base provisional”; exercises y banco los usan para aceptación | Las specs pueden congelar reglas no aprobadas | Ratificar C01–C07 antes de cerrar contratos | **A** |

---

## 3. Matriz de clarificaciones pendientes por Zona

### 3.1 Matriz Zona → decisiones bloqueantes

| Zona | Listo para spec | Ambigüedades | Decisiones bloqueantes | Spec destino |
|:---|:---|:---|:---|:---|
| **1. Máquina de Enlaces** | E01/E02/E03 canónicos; dos reparaciones válidas; grafo finito; PixiJS | Gesto de cable (clic vs seleccionar+retirar vs arrastrar); validar estado final u operación; E01 sin agencia; códigos `ERR_UNICIDAD`/`ERR_EXISTENCIA` no están en el contrato | I-01, I-03, I-07; contrato `boolean`/`mapping`; máquina de estados de cable | `004-zona-1-maquina-enlaces` |
| **2. Escáner de Proyección** | E04/E05/E06 canónicos; intervalos y proyecciones; Mafs | Control de infinito; alias `ℝ`/`(-∞,+∞)`; `ℝ\{3}`; aceptar `x≥2`/`x>4`; E04 casi trivial; campo “valor excluido”; UX de unión | I-04; gramática de intervalos; UI de extremos; prioridad de feedback | `005-zona-2-escaner-proyeccion` |
| **3. Sintonizador de Trayectorias** | E07/E08/E09 canónicos; diales, vértice y conjunto; Mafs | Exactitud vs snap; gramática numérica; gramática de conjuntos; E09 es teclado, no manipulación; orden de dificultad E08/E09 | I-10; normalización numérica; contrato `finiteSet`; calibración | `006-zona-3-sintonizador-trayectorias` |
| **4. Espejo de las Inversas** | E10/E11/E12 canónicos; reflexión; asíntotas; conversión | Tipo/control de asíntota; correspondencia de puntos; E12 parser vs campos; 5 campos de E11; asíntota sobre eje; pérdida de exploración | I-03, I-08, I-09, I-11, I-15; contrato `point`/`asymptote`/compuesto | `007-zona-4-espejo-inversas` |
| **5. Sala de Integración** | E13/E14/E15 canónicos; vacío; ramas; unión de dominios | Alias de ∅/“no existe”; rama obligatoria; simplificación de `(-∞,0)∪[0,+∞)`; rango no solicitado; pantalla dividida E14 | I-05, I-06; contrato compuesto; UI de conjuntos | `008-zona-5-sala-integracion` |

### 3.2 MDA por Zona

| Zona | Mecánica dominante | Dinámica esperada | Estética | Riesgo | Veredicto |
|:---|:---|:---|:---|:---|:---|
| **Z1** | Clasificar, cortar, conectar cables | Hipótesis sobre existencia/unicidad; dos reparaciones | Descubrimiento y seguridad | E01 binario; gesto de cable indefinido | **Parcial** |
| **Z2** | Sombrear intervalos y extremos | Proyectar, probar, ajustar | Descubrimiento y competencia | UI de intervalos puede volverse fiddly; E04 trivial | **Parcial** |
| **Z3** | Diales, vértice, conjunto | Exploración paramétrica | Satisfacción y competencia | E09 typed; exactitud sin snap | **Buena en E07/E08** |
| **Z4** | Reflejar, posicionar asíntota, completar campos | Descubrir relación exponencial/log | Enigma y satisfacción | Campos dominan; asíntota sobre eje; E11 pico | **En riesgo** |
| **Z5** | Dominio, conjuntos, ramas | Sintetizar restricciones | Enigma y cierre | E13 formulario; E14/E15 fuertes | **Mixta** |

### 3.3 Curva de dificultad y momentos de nivel

| ID | Etiqueta banco / guía | Carga observable | Giro (subversión) | Clímax / cierre | Riesgo |
|:---|:---|:---|:---|:---|:---|
| E01 | Baja / Inicial | 1 selección binaria | Salida compartida no viola unicidad | Clasificar correctamente | Sin agencia; ejemplo de curiosidad mal ubicado |
| E02 | Baja-Intermedia / Inicial | 1 cable + verificación | Dos reparaciones válidas | Restaurar unicidad conservando existencia | Estado final vs operación |
| E03 | Baja / Inicial | 1 cable | Cualquier destino de B sirve | Restaurar existencia | Puede ser más fácil que E02; sin clímax combinado |
| E04 | Baja / Inicial | 2 intervalos | Ventana visible ≠ dominio | `ℝ`/`ℝ` | Trivial; UI de infinito |
| E05 | Intermedia / Intermedia | 2 intervalos + extremos | Incluir 2 y 0 | Ambas proyecciones | Confusión de extremos |
| E06 | Intermedia / Intermedia | 2 intervalos + excluido | Excluir un punto parte el dominio | Unión + valor excluido | Responder solo `(3,+∞)` |
| E07 | Baja-Intermedia / Intermedia | 2 números | Signo negativo | `m=-2,b=4` exactos | Exactitud vs dial |
| E08 | Intermedia / Intermedia | 2 números | Signo de `h` | Vértice `(3,2)` | `2.99`; campo vacío |
| E09 | Intermedia / Intermedia | 1 conjunto de 2 | Dos raíces | Conjunto completo | Gramática de conjuntos |
| E10 | Baja-Intermedia / Intermedia | 3 campos | Rango abierto; asíntota no se toca | Tres propiedades | Etiqueta inconsistente; asíntota sobre eje |
| E11 | Intermedia-Avanzada / Intermedia | 5 campos | Intercambio dominio/rango | Reflexión + propiedades | **Pico real de carga**; correspondencia de puntos |
| E12 | Intermedia / Intermedia | 4 campos | Base vs argumento | Conversión + solución | Parser vs campos |
| E13 | Intermedia-Avanzada / Consolidación | 2 campos | `>` estricto, no `≥` | Dominio + asíntota | **Valle** frente a E11; etiqueta inconsistente |
| E14 | Avanzada / Consolidación | 2 conjuntos | El vacío es respuesta válida | Dos módulos | Vacío vs campo sin contestar |
| E15 | Avanzada / Consolidación | 3 campos | La frontera 0 pertenece a la rama 2 | Síntesis por tramos | Rama no definida como campo |

**Lectura de los 4 momentos:** no se cumplen a nivel de Zona. Z1–Z4 tienen introducción y desarrollo, y algunos un giro (E02, E05/E06, E09), pero **no un clímax que combine condiciones**. Z4 coloca su pico (E11) en el segundo nivel y cierra con E12, más ligero. Solo Z5 se aproxima: E13 introduce, E14 subvierte el supuesto “toda ecuación tiene solución”, E15 sintetiza. **Decisión:** adoptar un beat sheet por nivel (`setup → exploración → giro → síntesis`) o aceptar que el arco de 4 momentos es de Zona y añadir un cierre combinado; con 15 niveles fijos, la primera opción es más viable.

### 3.4 Bartle por Zona

| Zona | Valor para Triunfador | Valor para Explorador | Brecha |
|:---|:---|:---|:---|
| **Z1** | Clasificación exacta y reparación | Dos reparaciones; manipulación de cables | E01 es solo un botón; falta “probar hipótesis” |
| **Z2** | Intervalos correctos | Proyecciones y extremos | UI de intervalos; E04 trivial |
| **Z3** | Parámetros exactos | Diales y vértice | E09 typed; sin recompensa por explorar |
| **Z4** | Multi-campo exacto | Reflexión y asíntota | Los campos dominan; poca exploración |
| **Z5** | Síntesis y 15/15 | Vacío y ramas | E13 formulario; falta sonda “¿qué pasa si…?” |

**Recomendación:** si Explorer es objetivo, añadir una interacción de exploración por Zona (por ejemplo, “encuentra otra reparación”, “prueba un valor y predice”) y registrar maestría sin puntos. Si no, declarar que el perfil objetivo es Achiever y ajustar la estética de Z4–Z5.

---

## 4. Catálogo de casos frontera y errores no especificados

> La columna “Comportamiento esperado” es una **decisión propuesta** de esta auditoría, no una regla aprobada. `Estado`: `Definido`, `Parcial`, `No especificado`, `Contradictorio`.

### 4.1 Entrada y notación

| ID | Caso | Comportamiento esperado (propuesto) | Estado | Sev. |
|:---|:---|:---|:---|:---:|
| CF-01 | Campo obligatorio vacío | `incomplete` local; no enviar a API; no contar intento | Contradictorio (GDD vs 001) | **B** |
| CF-02 | `∅` vs `{}` vs vacío vs “no existe” | `∅`/`{}` explícitos válidos; campo vacío = incompleto; “no existe” solo si se ratifica | Parcial | **B** |
| CF-03 | `ℝ`, `R`, `(-∞,+∞)`, `(-inf,+inf)` | Normalizar a `ℝ`; aceptar equivalentes; `[-∞,∞]` inválido | Parcial | **A** |
| CF-04 | `∞`, `+∞`, `inf`, `+inf`, `oo` | Normalizar; infinito siempre abierto | Parcial | **A** |
| CF-05 | `−` Unicode, coma decimal, espacios | Normalizar `−`; decidir coma; recortar espacios | No especificado | **A** |
| CF-06 | `∪`, `U`, `or`; intervalos desordenados/solapados | Aceptar unión; fusionar; orden indiferente | Parcial | **A** |
| CF-07 | Elementos duplicados o desordenados en conjunto | Colapsar duplicados; comparar como conjunto | Parcial | **M** |
| CF-08 | `kind` desconocido, campo extra, JSON mal formado | Error estructural; nunca `incorrect` | Parcial (API) | **A** |
| CF-09 | `NaN`, `Infinity`, `1e309`, `+3`, `-0` | Rechazar o normalizar explícitamente; no crash | No especificado | **A** |
| CF-10 | `]a,b[` o `x≥2`/`x>4` | Decidir si se aceptan como alias de intervalo; si sí, normalizar | No especificado | **A** |

### 4.2 Matemáticos por ejercicio

| ID | Caso | Comportamiento esperado (propuesto) | Estado | Sev. |
|:---|:---|:---|:---|:---:|
| CF-11 | E01 sin selección | Incompleto; no `false` | Definido | M |
| CF-12 | E01 “No es función” porque 1 y 2 comparten 4 | Incorrecto + diagnóstico de salida compartida | Definido | M |
| CF-13 | E02 retira ambos cables de 1 | Incorrecto: existencia rota | Definido | M |
| CF-14 | E02 retira cable de 2 o 3 | Incorrecto: no repara unicidad | Definido | M |
| CF-15 | E02 estado final válido pero operación no permitida | Rechazar si se ratifica “retirar únicamente” | No especificado | **B** |
| CF-16 | E03 añade dos cables, no añade o borra existentes | Incorrecto por unicidad/existencia/operación | Parcial | **A** |
| CF-17 | E04 cierra infinito o responde rango `[-1,+∞)` | `INFINITO_CERRADO` / `RANGO_INCOMPLETO` | Definido | M |
| CF-18 | E05 excluye 2 o 0; rango `ℝ`; solo dominio | Incorrecto / incompleto | Definido | M |
| CF-19 | E06 incluye 3, un solo intervalo, orden inverso, `ℝ\{3}`, excluido distinto | Incorrecto salvo orden inverso/`ℝ\{3}` normalizado | Parcial | **A** |
| CF-20 | E07 `-1.99`, `-4/2`, `-2.0`, m/b intercambiados, vacío | `-1.99` incorrecto; `-4/2` válido; vacío incompleto | Parcial (C03) | **A** |
| CF-21 | E08 `h=-3`, `2.99`, `3.0`, vacío, `a≠1` | Incorrecto; `3.0` válido; `a` fijo | Parcial | **A** |
| CF-22 | E09 `{3}`, `{-3,3}`, duplicados, `[-3,3]`, `±3`, `sqrt(9)` | `{3}` incompleto; conjunto completo válido; intervalo inválido | Parcial | **A** |
| CF-23 | E10 rango `[0,+∞)`, asíntota `x=0` o `y=0.001`, dominio omitido | Incorrecto / incompleto | Definido | M |
| CF-24 | E11 `[0,+∞)`, punto omitido, puntos intercambiados, correspondencia errónea | Incorrecto / incompleto | Parcial | **A** |
| CF-25 | E12 base/argumento invertidos, `x=27`, solo conversión, `{4}`, `4.0` | Incorrecto / incompleto / válido según campo | Parcial | **A** |
| CF-26 | E13 `[4,+∞)`, `(0,+∞)`, `x≠4`, `x=4.0`, asíntota omitida | Incorrecto / válido / incompleto | Definido | M |
| CF-27 | E14 `S1={-1}`, `{0}`, campo vacío, `∅`, `{}`, “no existe” | `∅`/`{}` válidos; vacío incompleto; `{-1}` incorrecto | Parcial | **B** |
| CF-28 | E15 `f(0)=2`, `f(0)=0`, dominio `ℝ\{0}`, unión sin simplificar, rama no elegida, rango incluido | Incorrecto / válido; rama pendiente de decisión | Parcial | **A** |

### 4.3 Interacción y concurrencia

| ID | Caso | Comportamiento esperado (propuesto) | Estado | Sev. |
|:---|:---|:---|:---|:---:|
| CF-29 | Doble clic en **Probar** | Deshabilitar o idempotencia; un solo intento | No especificado | **A** |
| CF-30 | Editar mientras hay solicitud pendiente | Ignorar respuesta obsoleta; cancelar o correlacionar | Parcial (001) | **A** |
| CF-31 | Cambiar de nivel con solicitud pendiente | Cancelar/ignorar; no pintar resultado en otro nivel | No especificado | **A** |
| CF-32 | Deshacer/reiniciar durante `pending` o tras éxito | Definir semántica; no perder estado inconsistente | No especificado | **M** |
| CF-33 | Cancelar arrastre, `pointercancel`, multitáctil | Cancelar sin commit; no duplicar cable/punto | Parcial | **A** |
| CF-34 | Conexión o reflexión solo con teclado | Alternativa completa: seleccionar origen, destino, confirmar | Parcial | **A** |
| CF-35 | Recargar a mitad de arrastre / atrás-adelante | Restaurar borrador o reiniciar con aviso | No especificado | **M** |
| CF-36 | Zoom/pan compite con arrastre de punto o asíntota sobre eje | Modo explícito; ejes no arrastrables; hit-testing claro | No especificado | **A** |

### 4.4 Persistencia y fallos técnicos

| ID | Caso | Comportamiento esperado (propuesto) | Estado | Sev. |
|:---|:---|:---|:---|:---:|
| CF-37 | LocalStorage no disponible o cuota llena | Avisar; no afirmar que se guardó; permitir continuar | No especificado | **A** |
| CF-38 | Datos corruptos o esquema desconocido | Respaldar, migrar o reiniciar con aviso; no borrar en silencio | No especificado | **A** |
| CF-39 | Dos pestañas escriben progreso | Última escritura gana + aviso, o bloqueo | No especificado | **M** |
| CF-40 | API 500/503/timeout | Error técnico neutro; conservar respuesta; reintentar | Parcial (001/API) | **A** |
| CF-41 | `indeterminate` | No tratarlo como incorrecto; explicar y permitir reintento | Definido | **A** |
| CF-42 | SymPy tarda o entrada enorme | Límite de tamaño/tiempo; error o `indeterminate`; no bloquear | No especificado | **A** |
| CF-43 | Resultado local distinto del API | Fixtures de paridad; etiquetar origen; no fallback silencioso | No especificado | **B** |
| CF-44 | WebGL/PixiJS o Mafs no renderiza; movimiento reducido | Fallback textual/estático; equivalente visual y de audio | No especificado | **M** |

---

## 5. Plan de acción y mapa de archivos SDD

### 5.1 Decisiones bloqueantes

| ID | Decisión | Default propuesto | Responsable | Gate |
|:---|:---|:---|:---|:---|
| D-01 | Taxonomía de resultados | `incomplete` solo en cliente; API devuelve `correct/incorrect/indeterminate`; compuesto incompleto = 422 estructural | PO + arquitectura | Antes de 001 |
| D-02 | Respuesta compuesta | `{kind:"composite", fields:{nombre:{kind,...}}}`; campos obligatorios por ejercicio | Arquitectura | Antes de 001 |
| D-03 | Tipos faltantes | Añadir `point`, `asymptote`, `composite`; `mapping` para E02/E03; `boolean`/`vertex` | Arquitectura + Danny | Antes de API v1 |
| D-04 | Gramática numérica/simbólica | Racional exacto, decimal finito, sin `eval`; E12 estructurado en v1 | Danny + backend | Antes de validadores |
| D-05 | Normalización de conjuntos/intervalos | Vacío explícito, alias, infinito abierto, unión fusionada, `ℝ\{3}`→unión | Danny + backend | Antes de validadores |
| D-06 | Exactitud vs tolerancia | Sin tolerancia en E07/E08/E11; snap de controles; redondeo solo visual | Diseño + Danny | Antes de UI Z3/Z4 |
| D-07 | E02/E03: estado final vs operación | Validar ambos; rechazar estado final válido con operación no permitida | Diseño + Danny | Antes de Z1 |
| D-08 | E15: rama obligatoria | Recomendado: rama explicativa, no campo obligatorio; valores + dominio sí obligatorios | PO + Danny | Antes de Z5 |
| D-09 | Prioridad de feedback | Orden de comprobaciones por ejercicio + checklist por campo; primer error + campos restantes | Diseño + backend | Antes de 010 |
| D-10 | Pistas | Matriz error→pista; confirmación antes de H3; registrar “sin ayuda” | Diseño + María | Antes de 010 |
| D-11 | Persistencia | Esquema versionado; debounce + checkpoints; corrupción/multi-pestaña con aviso | Frontend | Antes de 011 |
| D-12 | Paridad estática | Mismos fixtures local/API; etiqueta de origen; fallback explícito | Backend + frontend | Antes de 013 |
| D-13 | 4 momentos/Bartle/flujo | Beat sheet por nivel + arco de Zona; Socializer/Killer non-goals; protocolo de playtest | Diseño | Antes de 009 |
| D-14 | Gobernanza | `development/specs/` canónico; `docs/specs/README.md` puntero; usar `.specify/templates`; migrar 001; PO único para ratificar | Equipo | Inmediato |

### 5.2 Fases y puertas

| Fase | Objetivo | Entregables | Gate | Duración indicativa |
|:---|:---|:---|:---|:---|
| **F0** | Resolver B1–B3 | D-01…D-08; `decision-log.md` | Aprobación del PO | 1 día |
| **F1** | Contratos P0 | 000, 001 actualizada, 003, 002 | Revisión cruzada Danny/María | 2–3 días |
| **F2** | Vertical slice E01/E08 | 002 + contratos + pruebas de contrato | Demo local/API; sin regresiones | 2–3 días |
| **F3** | Zonas y backend | 004–008, 012, YAML E01–E15 | Pruebas de contrato por ejercicio | Post-entrega |
| **F4** | Flujo, ZDP, persistencia, estático | 009–011, 013, 014 | Playtest + paridad | Post-entrega |
| **F5** | Cierre y trazabilidad | 016, matriz REQ/AC→test | DoD | Post-entrega |

**Calendario:** para el 17/11/2026 solo es realista **F0 + F1 + F2**. Presentar 15 niveles “especificados” sin contratos sería afirmar más de lo verificado.

### 5.3 Mapa de archivos SDD a redactar

> **Ruta canónica:** `development/specs/` (política vigente). La ruta `/docs/specs/` solicitada no existe; crear un árbol paralelo duplicaría la fuente de verdad. Si la rúbrica exige `/docs/specs/`, usar `docs/specs/README.md` como **puntero** y mantener los artefactos en `development/specs/`.

| Prioridad | Ruta | Tipo | Propósito | Depende de | Gate |
|:---:|:---|:---|:---|:---|:---|
| **P0** | `development/specs/000-marco-diseno-experiencia/spec.md` | Spec | MDA, Bartle, flujo, 4 momentos, non-goals, métricas de experiencia | D-13 | Decisiones aprobadas |
| **P0** | `development/specs/000-marco-diseno-experiencia/level-beats.md` | Anexo | Beat sheet E01–E15: setup, exploración, giro, síntesis | Spec 000 | 15 fichas revisadas |
| **P0** | `development/specs/001-nucleo-validacion/spec.md` | Spec (actualizar) | Resolver B1/B2: compuesta, tipos, `incomplete`, gramática, errores | D-01…D-05 | Sin bloqueos abiertos |
| **P0** | `development/specs/001-nucleo-validacion/contracts/answer.schema.json` | JSON Schema | Unión discriminada + compuesto + tipos nuevos | D-02/D-03 | Valida E01–E15 |
| **P0** | `development/specs/001-nucleo-validacion/contracts/result.schema.json` | JSON Schema | `correct/incorrect/indeterminate` + errores estructurales | D-01 | Pruebas de contrato |
| **P0** | `development/specs/001-nucleo-validacion/contracts/normalization.yaml` | Contrato | Números, conjuntos, intervalos, asíntotas, alias | D-04/D-05 | Casos CF-01…CF-10 |
| **P0** | `development/specs/001-nucleo-validacion/contracts/feedback-codes.yaml` | Catálogo | Código, campo, mensaje, pista asociada | D-09/D-10 | Cobertura por ejercicio |
| **P0** | `development/specs/002-primer-recorrido/spec.md` | Spec | Vertical slice E01/E08 | 001, 003 | Aprobada |
| **P0** | `development/specs/002-primer-recorrido/contracts/E01.yaml`, `E08.yaml` | Contrato | Esquema, valores, diagnósticos, fixtures | 001 | Pruebas verdes |
| **P0** | `development/specs/003-interaccion-2d/spec.md` | Spec | Máquina de estados, eventos, foco, PixiJS/Mafs | D-06 | Cobertura mouse/touch/teclado |
| **P0** | `development/specs/003-interaccion-2d/contracts/ui-events.yaml` | Contrato | `pointerdown/move/up/cancel`, teclado, gestos | Spec 003 | Pruebas de interacción |
| **P0** | `development/specs/003-interaccion-2d/contracts/visual-states.yaml` | Contrato | `idle/dragging/invalid/success/error/pending` | Spec 003 | Revisión María |
| **P1** | `development/specs/004-zona-1-maquina-enlaces/spec.md` + `contracts/E01-E03.yaml` | Spec + contratos | Zona 1 | 001, 003 | Contratos + UI |
| **P1** | `development/specs/005-zona-2-escaner-proyeccion/spec.md` + `contracts/E04-E06.yaml` | Spec + contratos | Zona 2 | 001, 003 | Contratos + UI |
| **P1** | `development/specs/006-zona-3-sintonizador-trayectorias/spec.md` + `contracts/E07-E09.yaml` | Spec + contratos | Zona 3 | 001, 003 | Contratos + UI |
| **P1** | `development/specs/007-zona-4-espejo-inversas/spec.md` + `contracts/E10-E12.yaml` | Spec + contratos | Zona 4 | 001, 003 | Contratos + UI |
| **P1** | `development/specs/008-zona-5-sala-integracion/spec.md` + `contracts/E13-E15.yaml` | Spec + contratos | Zona 5 | 001, 003 | Contratos + UI |
| **P1** | `development/specs/009-progresion-flujo-dificultad/spec.md` + `difficulty-rubric.md` + `playtest-plan.md` | Spec + anexos | Escala ordinal, curva, 4 momentos, métricas | D-13 | Playtest |
| **P1** | `development/specs/010-andamiaje-zdp-retroalimentacion/spec.md` + `hints-matrix.yaml` | Spec + contrato | Error→pista, H3, desvanecimiento, prioridad | D-09/D-10 | Cobertura E01–E15 |
| **P1** | `development/specs/011-persistencia-progreso/spec.md` + `contracts/progress.schema.json` | Spec + schema | Guardado, versión, migración, corrupción | D-11 | Pruebas de recarga |
| **P1** | `development/specs/012-validacion-backend-sympy/spec.md` + `contracts/validators.yaml` + `limits.yaml` | Spec + contratos | Validadores, normalización, límites, errores | 001 | Pruebas por ejercicio |
| **P2** | `development/specs/013-modo-estatico-paridad/spec.md` + `contracts/parity-fixtures.yaml` | Spec + fixtures | Paridad local/API, etiqueta de origen | D-12 | Mismos resultados |
| **P2** | `development/specs/014-accesibilidad-localizacion/spec.md` | Spec | Teclado, ARIA, canvas, formato español, movimiento reducido | 003 | Checklist |
| **P2** | `development/specs/015-presentacion-assets-audio/spec.md` | Spec | Assets, audio, licencias, fallback visual | GDD §5 | Inventario |
| **P2** | `development/specs/016-pruebas-aceptacion-trazabilidad/spec.md` + `traceability.csv` | Spec + matriz | REQ/AC→test, evidencia, DoD | Todas | Cierre |
| **P2** | `development/specs/README.md` | Registro | Actualizar estado, aprobaciones y migración de 001; las plantillas ya existen en `development/.specify/templates/` | D-14 | Revisión |
| **P2** | `docs/specs/README.md` | Puntero | Compatibilidad con la ruta solicitada; no duplicar contenido | D-14 | Enlace válido |

### 5.4 Orden de redacción y criterio de “listo”

1. **000 + D-01…D-06.** Sin marco de experiencia y contratos base, las specs de Zona repiten decisiones.
2. **001 actualizada.** Debe cerrar compuesta, tipos, `incomplete`, normalización, errores y prioridad.
3. **003.** La interacción es transversal; si se especifica después, cada Zona inventa su máquina de estados.
4. **012.** Validadores y límites antes de prometer resultados.
5. **002.** Vertical slice E01/E08; primer incremento demostrable.
6. **004–008.** Zonas, con contratos YAML por ejercicio.
7. **009/010.** Flujo, dificultad, ZDP y feedback.
8. **011/013/014/016.** Persistencia, estática, accesibilidad y trazabilidad.

**Una spec está “lista” cuando:** no tiene decisiones bloqueantes abiertas; cada `REQ` tiene `AC` verificable; cada `AC` tiene caso de prueba; cada ejercicio tiene esquema, normalización, diagnósticos, pistas y estados UI; cada interacción tiene mouse/touch/teclado; cada error tiene código, mensaje y recuperación.

### 5.5 Riesgos de no ejecutar el plan

- **Retrabajo de validadores:** 15 implementaciones ad hoc, con criterios distintos y falsos negativos.
- **UI inconsistente:** PixiJS y Mafs con estados y gestos diferentes; bugs táctiles y de foco.
- **Feedback engañoso:** `incomplete` tratado como `incorrect`, o error técnico como fallo matemático.
- **Modo estático roto:** el respaldo no coincide con la API y falla en la demo sin red.
- **Curva no validada:** dificultad y H3 sin evidencia; estudiantes copian la solución o se frustran.
- **Riesgo académico:** afirmar implementación/pruebas no verificadas; referencias obsoletas y fuentes sin contrastar.

---

## 6. Trazabilidad, límites y checklist de aprobación

### 6.1 Fuentes y estado

| Fuente | Uso en esta auditoría | Estado |
|:---|:---|:---|
| `docs/workspace/GDD_FUNctions_v0.1.md` | Diseño, mecánicas, HUD, assets, casos | Diseño aprobado; no implementación |
| `development/docs/banco_ejercicios.md` | Contenido, soluciones, errores, ayudas | `0.1-draft`; C01–C07 y fuentes pendientes |
| `development/docs/exercises.md` | Guía técnica derivada | Borrador; revisión cruzada pendiente |
| `development/specs/001-nucleo-validacion/spec.md` | Contratos transversales | Borrador; no aprobado |
| `development/docs/politicas/contrato-api.md` | Transporte y errores | Propuesto; sin tipos E01/E08 |
| `development/.specify/memory/constitution.md` | Reglas de dominio, SDD y puertas | Propuesta 0.4.0; pendiente de ratificación |
| `docs/constitution_draft.md` | Borrador de trabajo | No normativo |
| `development/docs/politicas/estructura-proyecto.md` | Rutas y capas | Canónico; plantillas ausentes |
| `docs/scrum.md` | Estado y planificación | Sin Sprint ni implementación |

### 6.2 Límites

Esta auditoría **no** afirma que las soluciones matemáticas estén verificadas, que exista código, que las pruebas se hayan ejecutado ni que el juego cumpla accesibilidad. No sustituye la revisión cruzada de Danny/María ni la ratificación de C01–C07. Los “defaults propuestos” son decisiones de ingeniería para desbloquear la discusión, no acuerdos.

### 6.3 Checklist de aprobación

- [ ] D-01…D-08 resueltas y registradas con responsable/fecha.
- [ ] 001 actualizada sin bloqueos; `answer.schema.json` valida E01–E15.
- [ ] 003 define estados, eventos y alternativa de teclado para cada interacción.
- [ ] 002 (E01/E08) aprobada con fixtures y pruebas de contrato.
- [ ] Cada Zona tiene contrato YAML por ejercicio y matriz error→pista.
- [ ] Persistencia y paridad estática tienen esquema y pruebas.
- [ ] 000/009 fijan 4 momentos, escala de dificultad y non-goals Bartle.
- [ ] `docs/specs/` es puntero, no un segundo árbol de verdad.

---

**Conclusión:** FUNctions no necesita más contenido para empezar; necesita **contratos**. La ruta crítica es: decisiones B1–B3 → 000/001/003 → vertical slice E01/E08 → Zonas y backend → flujo/persistencia/estática. Implementar los 15 ejercicios antes de cerrar esos contratos produciría una demo vistosa pero difícil de validar, corregir y defender académicamente.

