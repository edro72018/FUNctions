# 001 — Primer recorrido: reconocer una función y construir una parábola

**Fecha:** 15/11/2026.  
**Estado:** borrador para revisión; no aprobado para implementación.  
**Origen:** consolidación de decisiones del usuario sobre E01/E05/E06/E08/E15. Ante la propuesta de implementar el primer recorrido, el usuario seleccionó «Preparar para revisión» y «Sin instalaciones».

## 1. Problema y propósito

FUNtions dispone de un banco documental de quince ejercicios, pero todavía no de un recorrido jugable. Se propone comprobar la integración del producto con dos actividades cuyo objetivo ya fue confirmado: reconocer una función (E01) y construir una parábola desde el vértice (E08).

Este incremento permitiría verificar interacción, retroalimentación, persistencia y modos de validación antes de ampliar al resto del banco. Los dos ejercicios no sustituyen la entrega académica de cinco zonas y quince ejercicios.

## 2. Fuentes y autoridad

- [Banco canónico](../../docs/banco_ejercicios.md): enunciados, soluciones, ayudas, decisiones confirmadas y criterios C01–C07 propuestos.
- [Guía técnica derivada](../../docs/exercises.md): criterios por ejercicio.
- [Estructura SDD](../../docs/politicas/estructura-proyecto.md), [glosario](../../docs/politicas/glosario.md), [convenciones](../../docs/politicas/convenciones-codigo.md), [contrato API](../../docs/politicas/contrato-api.md) y [versionado](../../docs/politicas/politica-versiones.md).

Los reportes HTML no son una fuente de requisitos de interacción. Las páginas/minutos de fuentes didácticas del banco continúan pendientes de contraste.

## 3. Decisiones confirmadas y propuestas

### Confirmadas

| Decisión | Alcance |
|---|---|
| E01: reconocimiento | Observar R={(1,4),(2,4),(3,5)} sobre A={1,2,3}, B={4,5}; determinar si es función |
| E08: construcción desde el vértice | Vértice (3,2), a=1; función objetivo (x−3)²+2 |
| Inclusión de radicales/racionales | E05=√(x−2), E06=5/(x−3), conservando los 15 IDs |
| E15 | x+2 para x<0; (x−3)²+2 para x≥0; f(0)=11 |
| Stack | React/TypeScript, PixiJS para zona 1, Mafs para zonas 2–5, FastAPI/SymPy y LocalStorage |
| Acción autorizada ahora | Consolidar documentación y preparar esta especificación para revisión; sin instalaciones |

### Propuestas sujetas a aprobación

Todos los requisitos y criterios de aceptación siguientes describen **comportamiento futuro propuesto**. La confirmación del contenido matemático no equivale a aprobar estos detalles operativos.

- Seleccionar E01 y E08 como primer recorrido y permitir abrir cualquiera de los dos desde un selector de demostración; las cinco zonas progresivas se completarán en incrementos posteriores.
- E01 usa elección binaria; E08 usa h/k y muestra automáticamente la ecuación construida (C04), sin pedir texto algebraico libre.
- Usar validación exacta, tres ayudas solicitadas manualmente, reintentos ilimitados y sin temporizador ni vidas.
- Guardar progreso en el navegador y distinguir resultado de API, resultado local y fallo de red.
- Ante fallo de API, ofrecer reintentar o activar explícitamente modo estático; no cambiar de modo silenciosamente.

## 4. Usuarios y alcance

**Usuario principal:** estudiante de bachillerato, sin cuenta. **Revisores:** equipo del proyecto; responsables concretos de revisión cruzada pendientes de acuerdo.

### Incluido en la propuesta del primer incremento

- E01/E08 jugables y enunciados legibles, con controles operables por teclado y puntero.
- Presentación de E01 mediante PixiJS y de E08 mediante Mafs, con estado en React.
- Retroalimentación, ayudas, persistencia local y validadores acotados para esos dos ejercicios.
- Endpoint de salud y validación según `/api/v1`, una vez revisada la ampliación de tipos de respuesta.
- Modo estático explícito con los mismos criterios matemáticos y casos de referencia.

### Fuera de este incremento

- Implementar los trece ejercicios restantes, desbloqueo definitivo de las cinco zonas o proclamar completo el juego.
- Cuentas, sincronización entre dispositivos, clasificación, puntos o insignias.
- Parser simbólico general, respuestas algebraicas libres en E08, despliegue público y documento académico final.
- Afirmar resultados de la meta educativa del 80%, rendimiento medido o fuentes didácticas verificadas.

## 5. Requisitos propuestos

| ID | Requisito observable |
|---|---|
| REQ-01 | Mostrar nombre, ID, enunciado y controles de E01/E08; identificar el recorrido como demostración parcial |
| REQ-02 | E01 presenta la relación fija sin edición de cables. «Es función» es correcto, «No es función» incorrecto y ausencia de selección es respuesta incompleta |
| REQ-03 | E08 permite cambiar h/k con a=1 fijo, representa la parábola y muestra su ecuación. Solo h=3,k=2 resuelve el ejercicio; la proximidad visual no basta |
| REQ-04 | Distinguir respuesta correcta, incorrecta, incompleta/formato inválido, resultado indeterminado y error de servicio; solo «correcta» marca el ejercicio como completado |
| REQ-05 | Cada pulsación de «Verificar» con respuesta válida produce como máximo un intento evaluado. Evitar envíos duplicados mientras haya una solicitud pendiente; errores de formato/red o indeterminados no cuentan como intentos incorrectos |
| REQ-06 | Ofrecer tres ayudas por ejercicio, en orden y a petición del estudiante. Registrar el nivel máximo mostrado; no confundir finalización asistida con desempeño independiente |
| REQ-07 | Guardar por ID los ejercicios completados, intentos evaluados y máximo nivel de ayuda, junto con versión de esquema y revisión de contenido. No guardar nombres ni credenciales |
| REQ-08 | Recuperar progreso válido tras recarga. Ante almacenamiento inaccesible, JSON inválido o versión desconocida, informar y permitir continuar en memoria sin borrar silenciosamente los datos anteriores |
| REQ-09 | Ofrecer reinicio explícito con confirmación; al cambiar de ejercicio, no reutilizar selecciones ni mensajes del anterior. Una respuesta tardía de API no puede modificar otro ejercicio |
| REQ-10 | Mostrar si se valida con API o localmente. Una falla de red no es una respuesta matemática incorrecta ni activa un fallback oculto |
| REQ-11 | API y modo estático usan los mismos criterios para E01/E08. En E08 se comprueban parámetros exactos; SymPy puede operar sobre los números acotados admitidos, sin recibir código ejecutable |
| REQ-12 | Controles con etiquetas, foco visible, información equivalente al canvas/gráfica y retroalimentación que no dependa solo del color |

### Respuestas e interacción

**E01:** respuesta booleana. La selección inicial permanece vacía; elegir una opción no revela el resultado hasta verificar. La retroalimentación explica que cada entrada tiene exactamente una imagen y que compartir imagen es válido.

**E08:** respuesta de dos parámetros, h/k, y a=1 fijo. La vista puede mostrar una parábola inicial, por ejemplo h=0,k=0, sin marcarla correcta. Se propone aceptar enteros, decimales finitos y fracciones numéricas exactas equivalentes (por ejemplo 3, 3.0 y 6/2); su gramática, límites y normalización compartida se fijarán en el plan/contrato antes de implementar. Denominador cero, texto arbitrario y campos vacíos son errores de entrada. No hay tolerancia matemática implícita.

La ecuación visible se obtiene de h/k; no constituye una tercera respuesta independiente. Esta propuesta C04 requiere aprobación explícita.

### Ayudas propuestas

| Nivel | E01 | E08 |
|---|---|---|
| H1 | Resaltar sucesivamente las entradas sin indicar la clasificación | Distinguir el vértice actual y el punto objetivo |
| H2 | Preguntar si alguna entrada carece de imagen o tiene más de una | Relacionar h con coordenada horizontal y k con vertical |
| H3 | Recorrer los tres pares y explicar existencia/unicidad | Sustituir (3,2) en (h,k) y mostrar (x−3)²+2 |

## 6. Criterios de aceptación y verificación propuesta

Los siguientes son casos futuros, **no resultados de pruebas ejecutadas**.

| ID | Escenario y resultado esperado | Requisitos |
|---|---|---|
| AC-01 | E01 muestra exactamente A, B y R acordados; los cables son informativos y se puede responder por teclado | REQ-01, REQ-02, REQ-12 |
| AC-02 | «Es función» completa E01; «No es función» da retroalimentación y permite reintentar; verificar sin selección no completa ni incrementa intentos | REQ-02, REQ-04, REQ-05 |
| AC-03 | E08 con h=3,k=2 muestra (x−3)²+2 y resulta correcto en ambos modos | REQ-03, REQ-11 |
| AC-04 | E08 con h=−3,k=2, h=3,k=−2 o h=2.99,k=2 resulta incorrecto; falta de un parámetro o división por cero es formato inválido | REQ-03, REQ-04 |
| AC-05 | Si se aprueba la gramática propuesta, h=6/2,k=4/2 equivale a h=3,k=2 tanto localmente como en API | REQ-03, REQ-11 |
| AC-06 | Las ayudas no aparecen automáticamente al cargar. Solicitar H1/H2/H3 actualiza el máximo nivel utilizado sin completar el ejercicio | REQ-06 |
| AC-07 | Recargar conserva finalización, intentos evaluados y ayuda máxima con un esquema compatible | REQ-07 |
| AC-08 | Datos corruptos, versión desconocida o LocalStorage bloqueado muestran aviso y permiten continuar en memoria; los datos previos no se sobrescriben automáticamente | REQ-08 |
| AC-09 | Cancelar reinicio conserva progreso; confirmarlo reinicia datos y ayudas. Cambiar de ejercicio limpia formulario/resultado, pero conserva su progreso persistido | REQ-07, REQ-09 |
| AC-10 | API caída informa error y ofrece reintento o modo estático explícito; ningún intento incorrecto se registra por el fallo | REQ-04, REQ-05, REQ-10 |
| AC-11 | Un resultado indeterminado no marca incorrecto ni completo. Una respuesta tardía de E01 no actualiza E08; doble clic durante una solicitud no duplica el intento | REQ-04, REQ-05, REQ-09 |
| AC-12 | Comprobar los mismos casos correctos/incorrectos y equivalencias en API y modo estático produce resultados coherentes, con origen visible | REQ-10, REQ-11 |
| AC-13 | El recorrido es operable por teclado y ofrece datos textuales equivalentes a las visualizaciones; la revisión manual del equipo registra el resultado | REQ-12 |

## 7. Contrato e integración pendientes de diseño

El contrato inicial contiene `number`, `expression`, `finiteSet`, `intervalUnion` y `mapping`, pero no define una clasificación booleana ni una respuesta compuesta h/k. **No se debe implementar una forma diferente sin revisar primero el contrato.**

Se propone, para revisar en el plan, añadir tipos discriminados `boolean` y `vertex` (h/k numéricos exactos). La API conservaría `exerciseId`, `requestId`, resultados y formato de errores. El alcance inicial de validadores debe anunciarse explícitamente: disponer de quince fichas no significa tener quince validadores implementados.

También quedan por concretar gramática numérica y límites, revisiones del banco, esquema de progreso, versiones compatibles, compilación, origen/rutas de desarrollo y estrategia de pruebas. No se han elegido ni instalado herramientas por esta especificación.

## 8. Lista de revisión antes de planificar

- [ ] Aprobar E01/E08 como primer recorrido y el selector parcial, sin alterar el compromiso final de 15 ejercicios.
- [ ] Aprobar C04: h/k como respuestas de E08, ecuación generada y ausencia de texto algebraico libre.
- [ ] Aprobar validación exacta, representación de valores equivalentes y tratamiento de respuestas incompletas.
- [ ] Aprobar ayudas manuales H1–H3, reintentos y cómputo de intentos.
- [ ] Aprobar persistencia, avisos, reinicio y transición explícita al modo estático.
- [ ] Revisar con otra persona los criterios matemáticos y la trazabilidad de fuentes del banco.
- [ ] Registrar responsable y fecha reales de aprobación; actualmente pendientes.

Los criterios C01–C03 y C05–C07 afectan a ejercicios fuera de este primer recorrido. Permanecen pendientes antes de especificar/implementar esos ejercicios; no bloquean por sí solos revisar E01/E08.

**Después de aprobar:** redactar `plan.md`, actualizar/revisar el contrato necesario y descomponer `tasks.md` con trazabilidad a REQ/AC. Las instalaciones y la implementación siguen pendientes de autorización. No hay una Sprint Planning registrada ni una aprobación global de los quince validadores.
