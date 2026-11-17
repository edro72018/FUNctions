# FUNctions — Guía técnica de los 15 ejercicios

**Estado:** guía derivada del [banco canónico](./banco_ejercicios.md), revisión `0.1-draft` del 15/11/2026. Contenido consolidado; revisión cruzada y criterios adicionales C01–C07 pendientes. No implementado.  
**Distribución acordada:** 15 ejercicios, tres por cada una de cinco zonas.  
**Público:** bachillerato. **Enfoque:** Zona de Desarrollo Próximo (ZDP), sin temporizador ni pérdida de vidas.

## 1. Procedencia y uso

Las fichas sintetizan el banco canónico y las decisiones explícitas del usuario: E01 reconocimiento, E05/E06 radical y racional, E08 construcción desde el vértice y E15 con rama $(x-3)^2+2$. Para cambiar contenido, modificar primero el banco y sincronizar esta guía por ID. Los criterios C01–C07 y detalles de interacción son propuestas de consolidación, no decisiones confirmadas por inferencia.

Las referencias didácticas del banco recibido siguen pendientes de contraste. No se considera verificada una página o minuto por estar citado en una ficha.

La consigna requiere entre 10 y 20 ejercicios empleados con soluciones en el documento. El equipo eligió 15. La consolidación inicia la revisión de A05; su cierre requiere revisión cruzada. Definir una ficha no implementa A07.

**Alcance confirmado:** E05 usa $\sqrt{x-2}$ y E06 usa $5/(x-3)$. La inclusión de radicales y racionales sustituye la exclusión anterior; no añade IDs ni modifica el total de ejercicios. Los HTML trasladados a `../../docs/reporte/` son reportes y no condicionan la interacción del juego.

## 2. Recomendación de diseño

Diseñar cada ejercicio desde el aprendizaje que debe evidenciar, no desde el efecto visual. La ficha debe especificar: objetivo observable, prerrequisito, enunciado, respuesta esperada, procedimiento, alternativas válidas, errores frecuentes, interacción y ayudas que respondan al error.

- Una interacción correcta debe demostrar la habilidad pedida: E01 reconoce una relación fija; E02/E03 reparan relaciones respetando las operaciones permitidas.
- Indicar dominio de trabajo, codominio cuando corresponda y qué campos debe responder el jugador.
- Aceptar respuestas matemáticamente equivalentes y todas las alternativas correctas; distinguir conjuntos de listas ordenadas.
- No usar una muestra numérica como prueba de equivalencia algebraica.
- Proponer ayudas progresivas: **H1** orientación visual; **H2** herramienta o estrategia; **H3** explicación guiada. Registrar el apoyo utilizado sin confundir finalización asistida con desempeño independiente.
- El avance requiere completar todas las partes obligatorias. La tolerancia de un control gráfico debe definirse aparte de la respuesta exacta; no se aplica a extremos abiertos/cerrados ni a pertenencia a conjuntos.
- La solución formal se incluye en el documento .md aunque el juego también ofrezca retroalimentación.

## 3. Asignación por zona y revisión

La asignación a zona sigue la matriz recibida. **La distribución de revisión entre personas es propuesta**, basada en los roles existentes: Edwin implementa, Danny y María prueban. No constituye evidencia de trabajo ya realizado.

| ID | Matriz | Nombre propuesto | Zona | Dificultad propuesta | Responsable propuesto de revisión matemática |
|---|---|---|---|---|---|
| E01 | 1.1 | El Conector de Energía | 1 — Máquina de Enlaces | Inicial | Danny |
| E02 | 1.2 | El Cortocircuito de Unicidad | 1 — Máquina de Enlaces | Inicial | Danny |
| E03 | 1.3 | Restauración de Existencia | 1 — Máquina de Enlaces | Inicial | Danny |
| E04 | 2.1 | Escáner de Señal Lineal | 2 — Escáner de Proyección | Inicial | Danny |
| E05 | 2.2 | Umbral del Sensor | 2 — Escáner de Proyección | Intermedia | Danny |
| E06 | 2.3 | Frecuencia Prohibida | 2 — Escáner de Proyección | Intermedia | Danny |
| E07 | 3.1 | Sintonizador de Pendiente | 3 — Sintonizador de Trayectorias | Intermedia | Danny |
| E08 | 3.2 | Foco del Vértice | 3 — Sintonizador de Trayectorias | Intermedia | Danny |
| E09 | 3.3 | Eco de Preimágenes | 3 — Sintonizador de Trayectorias | Intermedia | Danny |
| E10 | 4.1 | Frecuencia Exponencial | 4 — Espejo de las Inversas | Intermedia | Danny |
| E11 | 4.2 | El Reflejo de la Inversa | 4 — Espejo de las Inversas | Intermedia | Danny |
| E12 | 4.3 | Conversión de Poder | 4 — Espejo de las Inversas | Intermedia | Danny |
| E13 | 5.1 | Filtro del Satélite | 5 — Sala de Integración | Consolidación | Danny |
| E14 | 5.2 | Verificador de Imposibles | 5 — Sala de Integración | Consolidación | Danny |
| E15 | 5.3 | Núcleo Integrado a Trozos | 5 — Sala de Integración | Consolidación | Danny |

**Para todos (propuesta):** Edwin implementa y corrige; Danny revisa matemática/didáctica; María revisa interfaz/ayudas; ambos cruzan soluciones y validadores. La distribución debe acordarse y no prueba trabajo realizado. React/PixiJS representa zona 1; React/Mafs representa zonas 2–5; FastAPI/SymPy valida cuando corresponda; LocalStorage conserva progreso.

## 4. Fichas de ejercicios con respuestas

### E01 — El Conector de Energía

- **Asignación:** zona 1, ejercicio 1.1; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** reconocer existencia y unicidad; conocer conjuntos y pares ordenados.
- **Enunciado:** sean A={1,2,3}, B={4,5} y la relación ya representada R={(1,4),(2,4),(3,5)}. ¿Define una función A→B?
- **Interacción:** observar el diagrama fijo y elegir «Es función» o «No es función»; no construir ni modificar cables.
- **Respuesta y procedimiento:** sí. 1 tiene imagen 4, 2 tiene imagen 4 y 3 tiene imagen 5; cada elemento de A posee exactamente una imagen en B. Compartir imagen no incumple la definición. R no es inyectiva.
- **Aceptación / error a detectar:** aceptar «Es función» y rechazar «No es función»; una selección ausente es respuesta incompleta. La explicación de existencia/unicidad se muestra como retroalimentación, no como campo obligatorio adicional.
- **Ayudas:** H1 resalta entradas conectadas; H2 contrasta «una salida por entrada» con «una entrada por salida»; H3 recorre los tres pares y explica la imagen compartida.

### E02 — El Cortocircuito de Unicidad

- **Asignación:** zona 1, ejercicio 1.2; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** corregir una violación de unicidad; reconocer pares de una relación.
- **Enunciado:** A={1,2,3}, B={4,5}, R={(1,4),(1,5),(2,4),(3,5)}. Elimina un solo cable para obtener una función A→B, conservando los demás.
- **Interacción:** retirar cables, sin agregar pares nuevos. La condición que fallaba se explica en la retroalimentación (propuesta C02).
- **Respuesta y procedimiento:** retirar un cable: (1,4) **o** (1,5). Las soluciones son {(1,5),(2,4),(3,5)} y {(1,4),(2,4),(3,5)}. El nodo 1 tenía dos imágenes, violando unicidad; tras retirar uno, todos tienen exactamente una.
- **Aceptación / error a detectar:** aceptar ambas soluciones. Rechazar retirar ambos cables de 1 o dejar sin imagen a 2 o 3. No comprobar únicamente el grado del nodo 1.
- **Ayudas:** H1 resalta nodo 1; H2 pide contar salidas; H3 muestra las dos reparaciones posibles y solicita elegir una.

### E03 — Restauración de Existencia

- **Asignación:** zona 1, ejercicio 1.3; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** identificar y reparar falta de existencia; conocer la condición de función.
- **Enunciado:** A={1,2,3}, B={4,5}, R={(1,4),(3,5)}. Añade un solo cable, conservando los existentes, para obtener una función A→B.
- **Interacción:** añadir la imagen del nodo libre; explicar existencia en la retroalimentación, no exigir una respuesta conceptual separada (propuesta C02).
- **Respuesta y procedimiento:** falta existencia para 2. Añadir (2,4) o (2,5); ambas completan una función porque cada entrada queda con una imagen.
- **Aceptación / error a detectar:** comprobar que no se borraron los pares iniciales y se añadió exactamente una de las dos opciones. Añadir dos salidas para 2 no resuelve correctamente el problema.
- **Ayudas:** H1 ilumina nodo 2; H2 recuerda que todas las entradas necesitan imagen; H3 explica por qué cualquiera de los dos destinos sirve.

### E04 — Escáner de Señal Lineal

- **Asignación:** zona 2, ejercicio 2.1; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** hallar dominio máximo y rango de una función afín no constante; manejar intervalos y despejes.
- **Enunciado:** para f(x)=2x−1, con codominio ℝ y dominio real máximo, determina dominio y rango. Exprésalos como conjuntos o intervalos (variante propuesta C01).
- **Interacción:** seleccionar extensión de ambas proyecciones, incluyendo infinito.
- **Respuesta y procedimiento:** D=ℝ y rango=ℝ. La función polinómica está definida para todo real. Para cualquier y∈ℝ, x=(y+1)/2 es real y cumple f(x)=y; por tanto se alcanza cualquier salida real.
- **Aceptación / error a detectar:** aceptar ℝ o (−∞,+∞) en ambos campos. No confundir la ventana visible del gráfico con el dominio o rango, ni cerrar extremos infinitos.
- **Ayudas:** H1 muestra prolongación de la recta; H2 propone despejar x a partir de y=2x−1; H3 desarrolla x=(y+1)/2.

### E05 — Umbral del Sensor

- **Asignación:** zona 2, ejercicio 2.2; revisión propuesta: Danny; implementación: Edwin. **Inclusión radical confirmada.**
- **Objetivo / prerrequisito:** reconocer restricción de raíz par y distinguir dominio/rango; resolver una desigualdad lineal.
- **Enunciado:** determina el dominio real máximo y el rango de f(x)=√(x−2), tomando la raíz principal y codominio ℝ.
- **Interacción:** posicionar límites del escáner y elegir extremos abiertos/cerrados.
- **Respuesta y procedimiento:** x−2≥0 implica x≥2; D=[2,∞). La raíz principal es no negativa; para cualquier y≥0, x=y²+2 produce f(x)=y. Rango=[0,∞). El punto (2,0) pertenece a la gráfica.
- **Aceptación / error a detectar:** validar ambos intervalos, incluir 2 y 0 y excluir infinito como extremo incluido. Rechazar (2,∞), rango ℝ o solo una respuesta de dominio.
- **Ayudas:** H1 distingue proyecciones sobre X e Y; H2 recuerda que el radicando debe ser no negativo; H3 resuelve x−2≥0, evalúa f(2)=0 y explica los dos intervalos.

### E06 — Frecuencia Prohibida

- **Asignación:** zona 2, ejercicio 2.3; revisión propuesta: Danny; implementación: Edwin. **Inclusión racional confirmada.**
- **Objetivo / prerrequisito:** excluir un punto del dominio; reconocer división por cero y unión de intervalos.
- **Enunciado:** determina el dominio real máximo de f(x)=5/(x−3), con codominio ℝ, e identifica el valor excluido.
- **Interacción:** dividir la proyección horizontal y marcar apertura en la discontinuidad.
- **Respuesta y procedimiento:** x−3≠0, luego x≠3. D=ℝ\{3}=(−∞,3)∪(3,∞). Todos los demás reales producen una división definida.
- **Aceptación / error a detectar:** exigir dominio completo y valor excluido 3. Aceptar notaciones equivalentes y cualquier orden de los intervalos. Rechazar incluir 3, omitir un intervalo o confundir el valor excluido. No se pide rango ni asíntota.
- **Ayudas:** H1 resalta el denominador; H2 pregunta cuándo vale cero; H3 resuelve x−3=0 y construye las dos partes del dominio abiertas en 3.

### E07 — Sintonizador de Pendiente

- **Asignación:** zona 3, ejercicio 3.1; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** obtener pendiente e intercepto a partir de dos puntos; diferencias y división de reales.
- **Enunciado:** ajusta m y b para que f(x)=mx+b pase por (0,4) y (2,0). Responde ambos valores; la interfaz muestra la ecuación resultante.
- **Interacción:** diales y entrada numérica para fijar valores exactos.
- **Respuesta y procedimiento:** f(0)=b=4; m=(0−4)/(2−0)=−2. Ecuación f(x)=−2x+4. Comprobación: f(0)=4 y f(2)=0.
- **Aceptación / error a detectar:** exigir m=−2 y b=4 exactos (propuesta C03); no aceptar +2, intercambio de parámetros ni m=−1.99. Una tolerancia visual no sustituye la respuesta matemática. No se solicita una expresión libre adicional.
- **Ayudas:** H1 resalta (0,4); H2 dibuja el triángulo de pendiente; H3 sustituye las coordenadas en la fórmula.

### E08 — Foco del Vértice

- **Asignación:** zona 3, ejercicio 3.2; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** construir desde el vértice usando la forma canónica; coordenadas y cuadrados.
- **Enunciado:** ajusta f(x)=(x−h)²+k para tener vértice (3,2), con a=1 fijo y dominio ℝ. Observa la ecuación de la parábola construida.
- **Interacción:** controles de h y k con entrada numérica accesible; ecuación generada a partir de esos valores, sin texto algebraico libre (propuesta C04).
- **Respuesta y procedimiento:** h=3, k=2; f(x)=(x−3)²+2. Al expandir: x²−6x+9+2=x²−6x+11. El eje de simetría es x=3 y abre hacia arriba porque a>0.
- **Aceptación / error a detectar:** exigir ambos parámetros h=3,k=2; aceptar valores numéricos exactos equivalentes. Rechazar h=−3, h=2.99 o campos incompletos. Las formas canónica y expandida son explicaciones equivalentes; no se exige completación de cuadrados ni un campo de eje de simetría.
- **Ayudas:** H1 marca el vértice objetivo; H2 relaciona h,k con la plantilla; H3 expande y comprueba el signo de x−3.

### E09 — Eco de Preimágenes

- **Asignación:** zona 3, ejercicio 3.3; revisión propuesta: Danny; implementación: Edwin.
- **Objetivo / prerrequisito:** hallar todas las preimágenes reales; resolver cuadrados y representar conjuntos.
- **Enunciado:** dada f(x)=x²−1 sobre ℝ, encuentra todas las preimágenes de y=8.
- **Interacción:** introducir un conjunto y visualizar intersecciones con y=8.
- **Respuesta y procedimiento:** x²−1=8 ⇒ x²=9 ⇒ x=±√9=±3. Conjunto S={−3,3}. Ambas entradas producen 9−1=8.
- **Aceptación / error a detectar:** comparar conjuntos, sin importar orden. Rechazar {3}, {−3}, valores extra o el intervalo [−3,3]. Una duplicación del mismo elemento no agrega una solución distinta.
- **Ayudas:** H1 muestra dos intersecciones; H2 señala simetría; H3 deriva y verifica las dos raíces.

### E10 — Frecuencia Exponencial

- **Asignación:** zona 4, ejercicio 4.1; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** relacionar dominio, rango y asíntota de una exponencial; interpretar exponentes negativos y límites gráficos.
- **Enunciado:** determina dominio real máximo, rango y asíntota horizontal de f(x)=2ˣ, con codominio ℝ.
- **Interacción:** seleccionar intervalos y marcar una recta horizontal.
- **Respuesta y procedimiento:** D=ℝ. Para todo real x, 2ˣ>0; cualquier y>0 se obtiene con x=log₂(y), por lo que el rango es (0,∞). Cuando x decrece sin límite, 2ˣ se acerca a 0 sin alcanzarlo: asíntota y=0.
- **Aceptación / error a detectar:** exigir los tres resultados. Rechazar rango [0,∞), dominio solo positivo o asíntota x=0.
- **Ayudas:** H1 prolonga la curva hacia x negativos; H2 compara 1/2,1/4,1/8; H3 conecta positividad y aproximación con el intervalo abierto.

### E11 — El Reflejo de la Inversa

- **Asignación:** zona 4, ejercicio 4.2; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** construir la inversa por reflexión y relacionar dominio/rango; coordenadas e inversas.
- **Enunciado:** refleja (0,1) y (1,2) de f(x)=2ˣ sobre y=x para construir g(x)=log₂(x). Indica ambos puntos reflejados, dominio, rango y asíntota vertical (propuesta C05).
- **Interacción:** reflejar los dos puntos y completar dominio, rango y asíntota.
- **Respuesta y procedimiento:** intercambiar coordenadas produce (1,0) y (2,1). La exponencial ℝ→(0,∞) es biyectiva; su inversa tiene Dg=(0,∞), rango ℝ y asíntota x=0.
- **Aceptación / error a detectar:** verificar correspondencia de ambos puntos, dominio abierto, rango real y asíntota vertical. No aprobar por acertar únicamente un subconjunto de campos.
- **Ayudas:** H1 dibuja y=x; H2 explica el intercambio de coordenadas; H3 refleja los puntos y compara dominio/rango de ambas funciones.

### E12 — Conversión de Poder

- **Asignación:** zona 4, ejercicio 4.3; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** convertir entre forma exponencial/logarítmica y hallar una preimagen; potencias enteras.
- **Enunciado:** para f(x)=3ˣ sobre ℝ, convierte 3ˣ=81 a forma logarítmica y encuentra la preimagen de 81 (propuesta C06).
- **Interacción:** completar base, argumento, resultado y conjunto de preimágenes.
- **Respuesta y procedimiento:** aʸ=x equivale a logₐ(x)=y, con a>0, a≠1, x>0. Así, log₃(81)=4. Como 3ˣ es estrictamente creciente, 3ˣ=81 tiene única solución x=4; S={4}.
- **Aceptación / error a detectar:** comprobar la conversión y la preimagen del estudiante. Rechazar intercambio de base y exponente o {81}; calcular log₃(81) internamente no comprueba por sí solo la respuesta ingresada.
- **Ayudas:** H1 colorea base/exponente/resultado; H2 pregunta qué potencia de 3 produce 81; H3 sustituye en la equivalencia general.

### E13 — Filtro del Satélite

- **Asignación:** zona 5, ejercicio 5.1; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** trasladar la restricción de un logaritmo; resolver desigualdades estrictas.
- **Enunciado:** determina el dominio real máximo de f(x)=log₅(x−4), con codominio ℝ, y su asíntota vertical (propuesta C07).
- **Interacción:** elegir el extremo de dominio y su apertura, y responder la asíntota.
- **Respuesta y procedimiento:** la base 5 es positiva y distinta de 1. El argumento exige x−4>0 ⇒ x>4. D=(4,∞); x=4 queda excluido porque log₅(0) no está definido en los reales. Asíntota vertical x=4.
- **Aceptación / error a detectar:** exigir dominio (4,∞), o x>4, y asíntota x=4. Rechazar [4,∞), x≠4, x>0 o un campo obligatorio omitido.
- **Ayudas:** H1 muestra la frontera x=4; H2 plantea argumento>0; H3 resuelve la desigualdad y explica el paréntesis.

### E14 — Verificador de Imposibles

- **Asignación:** zona 5, ejercicio 5.2; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** distinguir ausencia y existencia de preimágenes; rango exponencial y ecuaciones lineales.
- **Enunciado:** determina los conjuntos de preimágenes de y=−2 para f(x)=2ˣ y g(x)=3x+1, ambas con dominio ℝ.
- **Interacción:** dos campos de conjuntos independientes y gráficas comparables.
- **Respuesta y procedimiento:** 2ˣ>0 para todo real, por lo que f no alcanza −2: Sf=∅. Para g, 3x+1=−2 ⇒ 3x=−3 ⇒ x=−1; Sg={−1}. Comprobación: g(−1)=−2.
- **Aceptación / error a detectar:** exigir ambas respuestas; aceptar ∅ o {} para f, pero no un campo vacío sin contestar. Rechazar {0} para f o {−2} para g. Resolver explícitamente sobre ℝ, no sobre complejos.
- **Ayudas:** H1 dibuja y=−2; H2 contrasta rango positivo de f con rango real de g; H3 explica el vacío y despeja la ecuación lineal.

### E15 — Núcleo Integrado a Trozos

- **Asignación:** zona 5, ejercicio 5.3; revisión matemática propuesta: Danny; UI/ayudas: María; implementación: Edwin.
- **Objetivo / prerrequisito:** seleccionar la rama por su condición y unir dominios; comparación de reales, funciones lineales/cuadráticas e intervalos.
- **Enunciado:** sea f(x)=x+2 si x<0 y f(x)=(x−3)²+2 si x≥0. Evalúa f(−2), f(0) y determina el dominio total real.
- **Interacción:** elegir rama para cada entrada y responder valores y dominio.
- **Respuesta y procedimiento:** −2<0, luego f(−2)=−2+2=0. Como 0≥0, corresponde la segunda rama y f(0)=(0−3)²+2=11. Las condiciones cubren (−∞,0)∪[0,∞)=ℝ; cada fórmula está definida en su tramo, así que D=ℝ.
- **Aceptación / error a detectar:** verificar ambos valores y dominio. Rechazar f(0)=2, la respuesta histórica f(0)=0 o dominio ℝ\{0}. La selección de rama se explica en el procedimiento; no se exige un campo extra ni rango (propuesta C07). No usar dominio de continuidad como dominio de definición.
- **Ayudas:** H1 señala la frontera en 0; H2 compara cada entrada con las condiciones; H3 evalúa la rama correspondiente y une los intervalos.

## 5. Criterios de revisión y sincronización

El resultado deberá mantener exactamente 15 IDs y tres ejercicios por zona, desarrollar soluciones formales y asociar cada concepto a las fuentes realmente disponibles. Debe indicar discrepancias, referencias no encontradas y cambios propuestos, sin inventar citas ni convertir propuestas en decisiones aprobadas.

E05/E06 están incluidos definitivamente. Revisar los criterios C01–C07 del banco y la especificación del primer recorrido antes de implementar. Un cambio de contenido debe actualizar el banco, esta guía y los futuros casos de referencia con el mismo ID.

Antes de aceptar cada ficha, revisar:

- [ ] Enunciado claro, datos suficientes, dominio explícito y objetivo observable.
- [ ] Fuente trazable y adecuación al nivel del material proporcionado.
- [ ] Respuesta y razonamiento correctos, con alternativas válidas identificadas.
- [ ] Interacción que evidencia aprendizaje y puede implementarse con el stack acordado.
- [ ] Ayudas relacionadas con errores concretos, sin resolver automáticamente desde la primera pista.
- [ ] Casos correctos, incorrectos y de frontera definidos para el validador.
- [ ] Todos los campos evaluados aparecen en el enunciado y viceversa.
- [ ] Distinción entre solución exacta y tolerancia gráfica cuando aplique.

**Estado de cierre:** contenido consolidado con decisiones explícitas; criterios adicionales, contraste con fuentes externas, revisión cruzada e implementación pendientes. A05 está en curso por esta consolidación, no completada.
