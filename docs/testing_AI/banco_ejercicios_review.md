# Banco de Ejercicios de *FUNctions*: Análisis Didáctico, Fundamentación y Fichas de Diseño


## 1. Banco canónico y decisiones de consolidación

**Actualización:** 15/11/2026. **Revisión documental:** `0.1-draft` (no es una versión publicada del juego).

Este archivo conserva una copia de revisión del contenido pedagógico de los 15 ejercicios, tres por zona. La [guía técnica canónica](../exercises.md) contiene la versión derivada vigente. Los HTML de `../reporte/` son reportes históricos, no contratos de comportamiento ni fuentes para implementar.

### Decisiones confirmadas por el usuario

- **E01:** reconocer si la relación dada es una función; no construir los cables.
- **E05/E06:** inclusión definitiva de radicales y racionales, conservando los ejercicios existentes $\sqrt{x-2}$ y $5/(x-3)$.
- **E08:** construir la parábola desde el vértice $(3,2)$, con $a=1$; no evaluar completación de cuadrados.
- **E15:** rama $x+2$ para $x<0$ y rama $(x-3)^2+2$ para $x\geq0$; por tanto $f(0)=11$.
- Preparar la especificación para revisión antes de implementar. No instalar herramientas ni dependencias en este turno.

### Criterios unificados propuestos para revisión

Estas elecciones resuelven discrepancias editoriales entre los bancos, pero no se presentan como nuevos acuerdos del usuario:

| ID de decisión | Criterio de trabajo propuesto | Motivo |
|---|---|---|
| C01 | E04 conserva $2x-1$ | Es la variante del banco ampliado; ambas variantes anteriores ejercitaban el mismo concepto |
| C02 | E02/E03 evalúan la reparación; la explicación conceptual se muestra como retroalimentación | Mantener una respuesta verificable y no exigir campos ausentes en la interacción |
| C03 | E07 exige $m=-2,b=4$ exactos; no aprobar automáticamente por tolerancia | Distinguir posición visual de corrección matemática |
| C04 | E08 responde $h,k$ mediante controles y muestra la ecuación construida | Evidenciar construcción desde el vértice sin añadir un parser algebraico al primer incremento |
| C05 | E11 exige dos puntos reflejados, dominio, rango y asíntota | Hacer coincidir enunciado, interacción y respuesta completa |
| C06 | E12 parte de $3^x=81$ y exige conversión y solución | Evitar proporcionar el exponente antes de resolver y aceptar respuestas incompletas |
| C07 | E13 exige dominio y asíntota; E15 no exige rango | Conservar las tareas del banco ampliado y alinear sus objetivos |

La corrección matemática documental no sustituye la revisión cruzada de Danny/María. Los casos de prueba de estas fichas son **resultados esperados**, no pruebas ejecutadas. El GDD v0.1 aprueba ayudas H1–H3 voluntarias y secuenciales, reintentos ilimitados y progreso por niveles y sistemas reparados; la implementación permanece pendiente.

---

## 2. Análisis Didáctico y Documental de las Fuentes del Cuaderno

**Trazabilidad pendiente:** las referencias de documentos, páginas y minutos de esta sección y de las fichas proceden del banco recibido. No se han contrastado en esta consolidación. Deben verificarse antes de presentarlas como citas comprobadas; especialmente falta sustento específico para los ejercicios radical y racional recuperados.

| Documento / Fuente | Formato / Referencia | Temas Clave | Notación y Estilo Didáctico | Nivel y Prerrequisitos |
| :--- | :--- | :--- | :--- | :--- |
| **15. Tutoría Semanal 11 - Definición de función** | PDF (Bran Hernández, UES) | Par ordenado, producto cartesiano $A \times B$, relación como subconjunto de $A \times B$, regla $f: A \to B$, diagramas sagitales, **condición de existencia** y **condición de unicidad**, prueba de la recta vertical. | Notación formal de conjuntos $A, B$, pares $(x, y)$, flechas en diagramas sagitales. Énfasis en "único elemento de $B$". | Bachillerato / Inicio universitario. Prerrequisitos: Teoría básica de conjuntos y plano cartesiano. |
| **Qué es función \| Concepto de función** | Video (Profe Alex) | Relación de correspondencia entre dos conjuntos, metáfora de la "máquina procesadora", variable independiente ($x$) y dependiente ($y$), regla de unicidad. | Lenguaje cotidiano a formal. Uso del modelo de caja/máquina $x \to \text{Función} \to f(x)$. | Introductorio. Prerrequisitos: Aritmética elemental y evaluación de expresiones simples. |
| **Dominio y rango de una función** | Video (Profe Alex) | Dominio como entradas válidas (eje $X$), Rango/Ámbito como imágenes efectivas (eje $Y$), lectura gráfica de intervalos. | Notación de intervalos cerrados $[a, b]$ y abiertos $(a, b)$, proyección en ejes coordenados. | Bachillerato. Prerrequisitos: Lectura de puntos e intervalos en el plano cartesiano. |
| **Dominio y rango \| Función Lineal** | Video (Profe Alex) | Ecuación $y = mx + b$, función constante $f(x)=c$ vs. oblicua $m \neq 0$. Dominio $\mathbb{R}$, Rango $\{c\}$ (constante) o $\mathbb{R}$ (oblicua). | Identificación de exponente máximo 1 en $x$. Rectas horizontales vs. inclinadas. | Bachillerato. Prerrequisitos: Despeje lineal y plano cartesiano. |
| **Función Exponencial** | Video (Jaque Mate a Mate) | $f(x) = a^x$ con $a>0, a \neq 1$. Crecimiento ($a>1$), decrecimiento ($0<a<1$), Dominio $\mathbb{R}$, Rango $(0, +\infty)$, asíntota horizontal $y=0$. | Tabla de valores con exponentes enteros negativos, ceros y positivos; curvas continuas asintóticas. | Bachillerato. Prerrequisitos: Leyes de exponentes e inversión de fracciones. |
| **Función logarítmica** | Video (Jaque Mate a Mate) | $g(x) = \log_a(x)$ como inversa de $a^x$. Argumento positivo $x>0$, Dominio $(0, +\infty)$, Rango $\mathbb{R}$, asíntota vertical $x=0$, simetría $y=x$. | Notación $\log_a(x)$, equivalencia $a^y = x \iff y = \log_a(x)$, cambio de base y reflexión analítica. | Bachillerato intermedio. Prerrequisitos: Función exponencial y concepto de función inversa. |
| **Función a trozos. Gráfica, dominio y rango** | Video (Jaque Mate a Mate) | Graficación por intervalos, fronteras abiertas/cerradas, completación de cuadrados para vértice de parábola, dominio total como unión. | $f(x) = \begin{cases} \text{rama}_1 \\ \text{rama}_2 \end{cases}$, evaluación condicional de $x$ según el tramo. | Bachillerato avanzado. Prerrequisitos: Dominio de funciones lineales y cuadráticas. |
| **16. Tutoría Semanal 12 - Operaciones entre funciones** | PDF (Bran Hernández, UES) | Suma $(f+g)(x)$, resta $(f-g)(x)$, multiplicación, división ($g(x)\neq 0$), composición $(f \circ g)(x) = f(g(x))$, evaluación en puntos. | Notación algebraica operacional formal y diagramas de composición en cascada. | Bachillerato / Computación I. Prerrequisitos: Evaluación algebraica y simplificación. |
| **Steward-Precalculo-cap-2.pdf & Material unidad 4** | PDF | Dominio máximo real, forma canónica cuadrática $a(x-h)^2+k$, simetrías (par/impar), preimágenes exactas. | Notación matemática rigurosa de conjuntos, intervalos $\mathbb{R}$, corchetes/paréntesis. | Bachillerato / Universitario. Prerrequisitos: Álgebra superior y factorización. |

---

## 3. Matriz de Cobertura del Banco de Ejercicios

| Zona | ID | Nombre Narrativo | Contenido Didáctico | Fuente Principal de Sustento | Componente Stack UI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **E01** | *El Conector de Energía* | Definición de Función: Existencia y Unicidad | *15. Tutoría Semanal 11*, págs. 4-6 | PixiJS 2D (Nodos/Cables) |
| **1** | **E02** | *El Cortocircuito de Unicidad* | Corrección de Unicidad ($\text{grado\_salida} = 1$) | *15. Tutoría Semanal 11*, pág. 6 | PixiJS 2D (Remoción de cable) |
| **1** | **E03** | *Restauración de Existencia* | Corrección de Existencia (Todo $x \in A$ con imagen) | *15. Tutoría Semanal 11*, pág. 6 | PixiJS 2D (Trazado de cable) |
| **2** | **E04** | *Escáner de Señal Lineal* | Dom y Ran de Función Lineal Oblicua | *Dominio y rango \| Función Lineal* | Mafs (Ejes / Sliders) |
| **2** | **E05** | *Umbral del Sensor* | Dominio y rango de $\sqrt{x-2}$, raíz principal | Fuente específica pendiente de verificar | Mafs (Proyecciones X/Y) |
| **2** | **E06** | *Frecuencia Prohibida* | Dominio de $5/(x-3)$ y exclusión de un punto | Fuente específica pendiente de verificar | Mafs (Unión de intervalos) |
| **3** | **E07** | *Sintonizador de Pendiente* | Parámetros $m$ y $b$ en $f(x)=mx+b$ | *15. Tutoría Semanal 11*, pág. 7 | Mafs (Diales analógicos) |
| **3** | **E08** | *Foco del Vértice* | Construcción de $(x-h)^2+k$ desde $V(h,k)$ | Referencias del banco recibido pendientes de contraste con el nuevo objetivo | Mafs (Control de Vértice) |
| **3** | **E09** | *Eco de Preimágenes* | Conjunto Completo de Preimágenes $f(x)=k$ | *Material de la unidad 4*, pág. 120 | Mafs + Selector de Conjunto |
| **4** | **E10** | *Frecuencia Exponencial* | $f(x)=a^x$, Dom $\mathbb{R}$, Ran $(0, +\infty)$, Asíntota $y=0$ | *Función Exponencial* | Mafs (Curva asintótica) |
| **4** | **E11** | *El Reflejo de la Inversa* | Inversa $g(x)=\log_a(x)$, Reflexión sobre $y=x$ | *Función logarítmica* | Mafs (Línea de simetría $y=x$) |
| **4** | **E12** | *Conversión de Poder* | Equivalencia $a^y=x \iff y=\log_a(x)$ y Preimagen | *Función logarítmica*, min 2:10 | Mafs + Input Algebraico |
| **5** | **E13** | *Filtro del Satélite* | Dominio Compuesto $f(x)=\log_5(x-4)$ | *Función logarítmica* | Mafs (Sombreado de Intervalo) |
| **5** | **E14** | *Verificador de Imposibles* | Preimágenes Vacías ($S=\emptyset$) vs. Válidas | *Función Exponencial* | Mafs + Teclado de Conjuntos |
| **5** | **E15** | *Núcleo Integrado a Trozos* | Función a Trozos Lineal-Cuadrática | *Función a trozos*, min 0:45 | Mafs (Evaluación Multitramo) |

---

## 4. Fichas Técnicas y Pedagógicas de los 15 Ejercicios

---

### ZONA 1: LA MÁQUINA DE ENLACES (PixiJS 2D)

#### Ficha E01: El Conector de Energía
1. **ID y Nombre:** `E01 - El Conector de Energía` (Zona 1: La Máquina de Enlaces).
2. **Objetivo observable:** Identificar si una relación discreta entre los conjuntos $A=\{1, 2, 3\}$ y $B=\{4, 5\}$ cumple las condiciones formales de existencia y unicidad para ser clasificada como función.
   * *Prerrequisitos:* Concepto de par ordenado y producto cartesiano $A \times B$.
   * *Dificultad:* Baja (Conceptual inicial).
3. **Fuente sustento:** *15. Tutoría Semanal 11 - Definición de función.pdf*, págs. 4-6.
4. **Enunciado para el estudiante:** "El panel primario de energía muestra el conjunto de entrada $A=\{1, 2, 3\}$ y el conjunto de salida $B=\{4, 5\}$. La relación actual de transmisión es $R = \{(1,4), (2,4), (3,5)\}$. Evalúa las conexiones y determina si la corriente fluirá de forma válida (¿Es una función formal?)."
5. **Interacción:** 
   * *Observa:* Nodos discretos en dos columnas (diagrama sagital).
   * *Manipula:* Pulsa botones de diagnóstico `[Es Función]` / `[No es Función]`.
   * *Responde:* Selección booleana de validez funcional.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** **Es una función**.
   * **Solución formal:**
     1. *Condición de Existencia:* Todo elemento de $A$ ($1, 2, 3$) posee una imagen asignada en $B$.
     2. *Condición de Unicidad:* Cada elemento de $A$ se relaciona con un único elemento de $B$ (el 1 va solo al 4; el 2 va solo al 4; el 3 va solo al 5).
     3. *Aclaración:* El hecho de que $1$ y $2$ compartan la imagen $4$ no viola la unicidad del dominio.
7. **Alternativas válidas:** Afirmativo, `True`, `Es Función`.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Marcar "No es función" porque dos entradas van al mismo número (4).
   * *Retroalimentación:* "¡Cuidado! Varios cables pueden llegar al mismo nodo de salida. Lo prohibido es que de una sola entrada salgan dos cables."
9. **Ayudas ZDP:**
   * *Pista 1 (Visual):* Ilumina en verde los nodos del conjunto de entrada $A$ uno por uno.
   * *Pista 2 (Estrategia):* "Revisa dos reglas: 1) ¿Algún nodo de entrada se quedó sin cable? 2) ¿Algún nodo de entrada sacó más de un cable?"
   * *Explicación 3:* Muestra la definición formal: $f: A \to B$ exige $\forall x \in A, \exists ! y \in B$ tal que $y=f(x)$.
10. **Casos de prueba:**
    * *Correcto:* Selección `Es Función` $\to$ `is_correct: true`, pasa a E02.
    * *Incorrecto:* Selección `No es función` $\to$ `is_correct: false`, activa Pista 1.
    * *Frontera:* Clic reiterado sin seleccionar $\to$ Alerta de selección requerida.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación PixiJS: Edwin | Pruebas UI: María.

---

#### Ficha E02: El Cortocircuito de Unicidad
1. **ID y Nombre:** `E02 - El Cortocircuito de Unicidad` (Zona 1: La Máquina de Enlaces).
2. **Objetivo observable:** Corregir una relación que viola la condición de unicidad eliminando los enlaces redundantes de un elemento del conjunto de partida.
   * *Prerrequisitos:* Identificación de salidas múltiples por elemento en diagramas sagitales.
   * *Dificultad:* Baja-Intermedia.
3. **Fuente sustento:** *15. Tutoría Semanal 11*, pág. 6; *Qué es función \| Concepto de función*.
4. **Enunciado para el estudiante:** "¡Alerta de sobrecarga! El nodo $1 \in A$ está enviando señal a dos puertos distintos en $B$: $R = \{(1,4), (1,5), (2,4), (3,5)\}$. Desconecta el cable excedente para restablecer la unicidad y convertir la relación en una función."
5. **Interacción:**
   * *Observa:* Parpadeo rojo en las líneas que salen del nodo $1$.
   * *Manipula:* Hace clic sobre uno de los cables redundantes (el cable $(1,5)$ o $(1,4)$) para cortarlo.
   * *Responde:* Grafo modificado con un solo cable por nodo de entrada.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** Desconectar el par $(1,5)$ dejando $R_1 = \{(1,4), (2,4), (3,5)\}$, O desconectar el par $(1,4)$ dejando $R_2 = \{(1,5), (2,4), (3,5)\}$.
   * **Solución formal:** Para que $R \subseteq A \times B$ sea función, se exige que si $(x, y_1) \in R$ y $(x, y_2) \in R$, entonces $y_1 = y_2$. Como $(1,4)$ y $(1,5)$ compartían $x=1$ con $4 \neq 5$, se debía eliminar uno de los dos pares.
7. **Alternativas válidas:** Cualesquiera de los dos conjuntos de pares resultantes $R_1$ o $R_2$.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Eliminar los cables del nodo 2 o 3 en lugar del nodo 1.
   * *Retroalimentación:* "El cortocircuito ocurre en el nodo 1 porque tiene dos salidas. Los nodos 2 y 3 están correctamente conectados."
9. **Ayudas ZDP:**
   * *Pista 1:* Enfoca la cámara del visor sobre el nodo $1 \in A$.
    * *Pista 2:* "Unicidad significa como máximo una imagen por entrada. Existencia exige al menos una. Juntas requieren exactamente una."
   * *Explicación 3:* Muestra la regla: Una entrada no puede tener dos imágenes distintas en una función.
10. **Casos de prueba:**
    * *Correcto:* Cortar $(1,5)$ manteniendo $(1,4)$ $\to$ Éxito (`ERR_UNICIDAD` resuelto).
    * *Incorrecto:* Cortar el cable del nodo 2 $\to$ Error (Existencia violada en nodo 2).
    * *Frontera:* Cortar ambos cables del nodo 1 $\to$ Error (Existencia violada en nodo 1).
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación PixiJS: Edwin | Pruebas UI: María.

---

#### Ficha E03: Restauración de Existencia
1. **ID y Nombre:** `E03 - Restauración de Existencia` (Zona 1: La Máquina de Enlaces).
2. **Objetivo observable:** Garantizar la condición de existencia conectando un elemento no asignado del conjunto de partida $A$ hacia el conjunto de llegada $B$.
   * *Prerrequisitos:* Comprensión del dominio como conjunto de partida completo.
   * *Dificultad:* Baja.
3. **Fuente sustento:** *15. Tutoría Semanal 11*, pág. 6.
4. **Enunciado para el estudiante:** "El circuito está incompleto: $R = \{(1,4), (3,5)\}$ sobre $A=\{1, 2, 3\}$ y $B=\{4, 5\}$. El nodo $2 \in A$ no tiene señal. Arrastra un cable desde el nodo $2$ a cualquier puerto de $B$ para completar la condición de existencia."
5. **Interacción:**
   * *Observa:* El nodo $2 \in A$ parpadea sin conexión.
   * *Manipula:* Arrastra un nuevo cable desde el nodo $2$ hasta el nodo $4$ o el nodo $5$ de $B$.
   * *Responde:* Grafo conectado totalmente.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** Conectar $(2,4)$ obteniendo $R_1 = \{(1,4), (2,4), (3,5)\}$, O conectar $(2,5)$ obteniendo $R_2 = \{(1,4), (2,5), (3,5)\}$.
   * **Solución formal:** La condición de existencia requiere que $\forall x \in A, \exists y \in B$ tal que $(x,y) \in R$. Al asignar una imagen al elemento $2$, el dominio de la relación coincide con el conjunto de partida $A$.
7. **Alternativas válidas:** Enlace a $4$ o enlace a $5$.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Conectar el nodo 2 a dos nodos simultáneamente en $B$.
   * *Retroalimentación:* "¡Excelente por dar existencia al nodo 2! Pero recuerda conectar solo UN cable para no violar la unicidad."
9. **Ayudas ZDP:**
   * *Pista 1:* El nodo $2 \in A$ emite un resplandor amarillo indicando que necesita salir a $B$.
   * *Pista 2:* "Elige cualquier puerto de $B$ ($4$ o $5$) y lleva la línea de energía desde el $2$."
   * *Explicación 3:* Muestra el principio: Todos los elementos del conjunto de partida deben tener imagen asignada.
10. **Casos de prueba:**
    * *Correcto:* Conectar $2 \to 4$ $\to$ Nivel 1 completado al 100%.
    * *Incorrecto:* Dejar el nodo 2 sin conectar y presionar verificar $\to$ Error `ERR_EXISTENCIA`.
    * *Frontera:* Conectar $2 \to 4$ y $2 \to 5$ $\to$ Error `ERR_UNICIDAD`.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación PixiJS: Edwin | Pruebas UI: María.

---

### ZONA 2: EL ESCÁNER DE PROYECCIÓN (Mafs - SVG)

#### Ficha E04: Escáner de Señal Lineal
1. **ID y Nombre:** `E04 - Escáner de Señal Lineal` (Zona 2: Escáner de Proyección).
2. **Objetivo observable:** Determinar gráfica y analíticamente el dominio y el rango de una función lineal oblicua no constante en los números reales.
   * *Prerrequisitos:* Reconocimiento de funciones lineales $y = mx + b$ y notación de intervalos.
   * *Dificultad:* Baja.
3. **Fuente sustento:** *Dominio y rango \| Función Lineal*, min 4:10; *15. Tutoría Semanal 11*, pág. 7.
4. **Enunciado para el estudiante:** "El escáner analiza $f(x) = 2x - 1$, con codominio real y dominio real máximo. Determina su dominio y rango mediante las proyecciones sobre los ejes X e Y."
5. **Interacción:**
   * *Observa:* Una recta oblicua inclinada que atraviesa el plano cartesiano.
   * *Manipula:* Ajusta los extremos de los intervalos en los selectores de pantalla.
   * *Responde:* `Dominio = (-inf, +inf)`, `Rango = (-inf, +inf)`.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\text{Dom}\,f = (-\infty, +\infty) = \mathbb{R}$; $\text{Ran}\,f = (-\infty, +\infty) = \mathbb{R}$.
   * **Solución formal:** 
      1. La función es polinómica y está definida para todo real: $\text{Dom}\,f=\mathbb{R}$.
      2. Para cualquier $y\in\mathbb{R}$, $x=(y+1)/2$ es real y satisface $2x-1=y$. Por tanto su rango es $\mathbb{R}$; no se limita a la ventana visible del gráfico.
7. **Alternativas válidas:** `R`, `(-infinito, +infinito)`, `(-∞, +∞)`.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Decir que el rango empieza en $-1$ por ser el corte en $Y$.
   * *Retroalimentación:* "El $-1$ es la intersección con el eje $Y$, pero la recta continúa bajando hacia $-\infty$ para valores negativos de $x$."
9. **Ayudas ZDP:**
   * *Pista 1:* Activa la sombra proyectada continua a lo largo de ambos ejes coordenados.
   * *Pista 2:* "Las rectas oblicuas no se detienen en ningún punto; abarcan toda la recta real."
   * *Explicación 3:* Muestra la regla de las fuentes: Para toda función lineal $y=mx+b$ con $m \neq 0$, $\text{Dom}=\mathbb{R}$ y $\text{Ran}=\mathbb{R}$.
10. **Casos de prueba:**
    * *Correcto:* `Dom: (-inf, +inf)`, `Ran: (-inf, +inf)` $\to$ Validador SymPy aprueba.
    * *Incorrecto:* `Ran: [-1, +inf)` $\to$ Notifica error de rango incompleto.
    * *Frontera:* Ingresar `[-inf, inf]` con corchetes cerrados $\to$ Advertencia: El infinito siempre usa paréntesis abierto.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E05: Umbral del Sensor
1. **ID y Nombre:** `E05 - Umbral del Sensor` (Zona 2: Escáner de Proyección).
2. **Objetivo observable:** Determinar dominio real máximo y rango de la raíz principal $f(x)=\sqrt{x-2}$.
   * *Prerrequisitos:* Desigualdades lineales, raíz cuadrada e intervalos.
   * *Dificultad:* Intermedia.
3. **Fuente sustento:** Ejercicio recuperado de la matriz del equipo; referencia didáctica específica pendiente de verificar.
4. **Enunciado para el estudiante:** "El sensor sigue $f(x)=\sqrt{x-2}$, tomando la raíz principal y codominio real. Determina el dominio real máximo y el rango. Indica si sus extremos están incluidos."
5. **Interacción:** Observar la curva y seleccionar dos intervalos estructurados, uno de dominio y otro de rango, con extremos abiertos/cerrados.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\text{Dom}\,f=[2,+\infty)$; $\text{Ran}\,f=[0,+\infty)$.
   * **Solución formal:** $x-2\geq0$ exige $x\geq2$. La raíz principal es no negativa. Para cualquier $y\geq0$, $x=y^2+2$ pertenece al dominio y produce $f(x)=y$. Se alcanza $(2,0)$; ambos extremos finitos están incluidos.
7. **Alternativas válidas:** Intervalos equivalentes o desigualdades $x\geq2$ para el dominio y $y\geq0$ para el rango; ambos campos son obligatorios.
8. **Errores frecuentes y Retroalimentación:** Rechazar dominio $(2,+\infty)$, rango real o rango con valores negativos. "La raíz principal puede valer cero, pero no un número negativo."
9. **Ayudas ZDP:**
   * *Pista 1:* Diferenciar la proyección de entradas sobre X de la proyección de salidas sobre Y.
   * *Pista 2:* "El radicando debe ser mayor o igual a cero. ¿Qué valores de x lo permiten?"
   * *Explicación 3:* Resolver $x-2\geq0$, evaluar $f(2)=0$ y explicar ambos intervalos.
10. **Casos de prueba:**
    * *Correcto:* Dominio $[2,+\infty)$ y rango $[0,+\infty)$.
    * *Incorrecto:* Solo dominio correcto, rango omitido o rango $\mathbb{R}$.
    * *Frontera:* Excluir 2 o 0 es incorrecto; cerrar un extremo infinito es formato inválido.
11. **Asignación propuesta:** Revisión didáctica/matemática: Danny | Implementación Mafs: Edwin | Pruebas UI: María; revisión cruzada de ambos testers.

---

#### Ficha E06: Frecuencia Prohibida
1. **ID y Nombre:** `E06 - Frecuencia Prohibida` (Zona 2: Escáner de Proyección).
2. **Objetivo observable:** Hallar el dominio real máximo de $f(x)=5/(x-3)$ y representar la exclusión de un punto mediante una unión de intervalos.
   * *Prerrequisitos:* División por cero, ecuación lineal y unión de conjuntos.
   * *Dificultad:* Intermedia.
3. **Fuente sustento:** Ejercicio recuperado de la matriz del equipo; referencia didáctica específica pendiente de verificar.
4. **Enunciado para el estudiante:** "La señal sigue $f(x)=5/(x-3)$, con codominio real. Determina su dominio real máximo e identifica el valor de x excluido."
5. **Interacción:** Seleccionar las dos partes del dominio sobre X y responder el valor excluido. No se solicita rango ni ecuación de asíntota.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\text{Dom}\,f=\mathbb{R}\setminus\{3\}=(-\infty,3)\cup(3,+\infty)$; valor excluido: $3$.
   * **Solución formal:** El denominador exige $x-3\neq0$, luego $x\neq3$. Para cualquier otro real la división está definida, tanto a la izquierda como a la derecha de 3.
7. **Alternativas válidas:** Unión de intervalos en cualquier orden, $\mathbb{R}\setminus\{3\}$ o $x\neq3$; exigir también el valor excluido en su campo.
8. **Errores frecuentes y Retroalimentación:** Rechazar incluir 3 o responder solamente $(3,+\infty)$. "Excluir un punto no elimina todos los números menores que él."
9. **Ayudas ZDP:**
   * *Pista 1:* Resaltar el denominador de la expresión.
   * *Pista 2:* "¿Para qué x el denominador vale cero? ¿Qué ocurre a cada lado?"
   * *Explicación 3:* Resolver $x-3=0$ y construir los dos intervalos abiertos en 3.
10. **Casos de prueba:**
    * *Correcto:* Ambos intervalos abiertos en 3 y valor excluido 3; aceptar el orden inverso.
    * *Incorrecto:* Un solo intervalo, dominio real completo o valor excluido diferente.
    * *Frontera:* Incluir 3 en cualquiera de los intervalos es incorrecto; infinito nunca es extremo incluido.
11. **Asignación propuesta:** Revisión didáctica/matemática: Danny | Implementación Mafs: Edwin | Pruebas UI: María; revisión cruzada de ambos testers.

---

### ZONA 3: SINTONIZADOR DE TRAYECTORIAS (Mafs - SVG)

#### Ficha E07: Sintonizador de Pendiente
1. **ID y Nombre:** `E07 - Sintonizador de Pendiente` (Zona 3: Sintonizador de Trayectorias).
2. **Objetivo observable:** Ajustar los parámetros de pendiente $m$ e intersección $b$ en la función lineal $f(x) = mx + b$ para hacerla pasar por los puntos coordenados $(0, 4)$ y $(2, 0)$.
   * *Prerrequisitos:* Cálculo de pendiente $m = \frac{y_2 - y_1}{x_2 - x_1}$ y punto de corte.
   * *Dificultad:* Baja-Intermedia.
3. **Fuente sustento:** *15. Tutoría Semanal 11*, pág. 7; *Dominio y rango \| Función Lineal*.
4. **Enunciado para el estudiante:** "Sintoniza la antena alineando la trayectoria rectilínea $f(x) = mx + b$. Ajusta m y b para conectar los puntos de control $(0,4)$ y $(2,0)$. Responde ambos valores y observa la ecuación resultante."
5. **Interacción:**
   * *Observa:* Dos puntos destacados en el plano cartesiano y una recta desalineada.
   * *Manipula:* Gira el dial numérico de $b$ hasta $4$ y el dial de $m$ hasta $-2$.
   * *Responde:* $m = -2$, $b = 4$ (Ecuación: $f(x) = -2x + 4$).
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $m = -2$, $b = 4$.
   * **Solución formal:**
     1. Como pasa por $(0,4)$, la intersección con el eje $Y$ es directa: $b = 4$.
     2. Usamos la fórmula de pendiente con $(0,4)$ y $(2,0)$:
        $$m = \frac{0 - 4}{2 - 0} = \frac{-4}{2} = -2$$
     3. La ecuación sintonizada es $f(x) = -2x + 4$.
7. **Alternativas válidas:** Valores numéricos exactos equivalentes a $m=-2,b=4$ en ambos campos. La ecuación generada puede mostrarse como $y=-2x+4$ o $f(x)=4-2x$; no se solicita una expresión libre adicional (propuesta C03).
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Poner pendiente positiva $m = 2$.
   * *Retroalimentación:* "La recta desciende de izquierda a derecha, por lo que la pendiente debe ser negativa."
9. **Ayudas ZDP:**
   * *Pista 1:* Muestra el triángulo de elevación/avance ($\Delta y / \Delta x$) al mover el dial.
   * *Pista 2:* "El dial $b$ fija el corte en el eje $Y$ (punto $(0,4)$). Luego ajusta $m$ para cruzar el eje $X$ en $2$."
   * *Explicación 3:* Muestra la sustitución del sistema de ecuaciones $4 = m(0)+b$ y $0 = m(2)+b$.
10. **Casos de prueba:**
    * *Correcto:* $m=-2, b=4$ $\to$ Trazo de recta perfecto, avanza a E08.
    * *Incorrecto:* $m=2, b=4$ $\to$ Recta desalineada en $(2,0)$.
    * *Frontera:* $m=-1.99,b=4$ no cumple exactamente el punto $(2,0)$ y no permite avanzar. Una tolerancia de posicionamiento visual, si se adopta, no sustituye los parámetros exactos (propuesta C03).
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E08: Foco del Vértice
1. **ID y Nombre:** `E08 - Foco del Vértice` (Zona 3: Sintonizador de Trayectorias).
2. **Objetivo observable:** Construir una parábola de la forma $f(x)=(x-h)^2+k$ ajustando $h,k$ a un vértice dado, con $a=1$ fijo.
   * *Prerrequisitos:* Coordenadas, cuadrados y lectura de la forma canónica.
   * *Dificultad:* Intermedia.
3. **Fuente sustento:** *Función a trozos. Gráfica, dominio y rango*, min 3:15; *Material de la unidad 4.pdf*, pág. 120.
4. **Enunciado para el estudiante:** "Construye la trayectoria $f(x)=(x-h)^2+k$, con dominio real, para que su vértice sea $(3,2)$. Ajusta h y k; el coeficiente a permanece fijo en 1. Observa la ecuación de la parábola que construiste."
5. **Interacción:**
   * *Observa:* Parábola descolocada en el plano.
   * *Manipula:* Ajusta controles de h y k con entrada numérica accesible; a está fijado en 1.
   * *Responde:* $h=3,k=2$. La interfaz muestra la ecuación construida; el eje de simetría es explicación complementaria, no un tercer campo obligatorio (propuesta C04).
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $h = 3$, $k = 2 \implies f(x) = (x-3)^2 + 2$; Vértice $(3,2)$.
   * **Solución formal:**
      1. En $f(x)=(x-h)^2+k$, el vértice es $(h,k)$, porque el cuadrado alcanza su mínimo cero en $x=h$.
      2. El vértice solicitado obliga a $h=3,k=2$.
      3. Sustituyendo, $f(x)=(x-3)^2+2$, con dominio real. La forma expandida equivalente es $x^2-6x+11$; se ofrece como explicación, no como una tarea de completación de cuadrados.
7. **Alternativas válidas:** Valores numéricos exactos equivalentes a $h=3,k=2$, en ambos campos. Las formas canónica y expandida describen la misma función; el primer recorrido no solicita texto algebraico libre.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Identificar $h = -3$ por no tomar en cuenta el signo negativo de la fórmula $(x-h)$.
   * *Retroalimentación:* "Atención con el signo: en la fórmula es $(x-h)$, por lo que $(x-3)$ significa $h=+3$."
9. **Ayudas ZDP:**
   * *Pista 1:* Distingue el vértice de la parábola actual del punto objetivo.
   * *Pista 2:* "h mueve el vértice horizontalmente y k verticalmente. Relaciona cada control con una coordenada."
   * *Explicación 3:* Sustituye el vértice $(3,2)$ en $(h,k)$ y muestra $f(x)=(x-3)^2+2$.
10. **Casos de prueba:**
    * *Correcto:* `h=3, k=2` $\to$ Ejercicio resuelto; comprobar ambos parámetros, no solo la apariencia de la curva.
    * *Incorrecto:* `h=-3, k=2` $\to$ Parábola desplazada a la izquierda en $(-3,2)$.
    * *Frontera:* `h=2.99,k=2` no es el vértice solicitado; una coincidencia visual aproximada no demuestra igualdad. Una entrada vacía no representa cero ni se considera respuesta completa.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E09: Eco de Preimágenes
1. **ID y Nombre:** `E09 - Eco de Preimágenes` (Zona 3: Sintonizador de Trayectorias).
2. **Objetivo observable:** Calcular el conjunto solución completo de preimágenes $f^{-1}(y) = \{x \in \text{Dom}\,f \mid f(x) = y\}$ para un valor de salida dado en una función cuadrática.
   * *Prerrequisitos:* Ecuaciones cuadráticas puras $x^2 = c$ y propiedad de valor absoluto.
   * *Dificultad:* Intermedia.
3. **Fuente sustento:** *Material de la unidad 4.pdf*, pág. 120 (Ejemplo 16.2); *15. Tutoría Semanal 11*, pág. 5.
4. **Enunciado para el estudiante:** "El escáner refleja una intensidad de salida $y = 8$ sobre la función cuadrática $f(x) = x^2 - 1$. Encuentra TODAS las preimágenes $x$ que producen esa señal."
5. **Interacción:**
   * *Observa:* Una línea de corte horizontal fija en $y=8$ cruzando la parábola en dos puntos.
   * *Manipula:* Escribe el conjunto de valores de entrada en el teclado matemático.
   * *Responde:* $S = \{-3, 3\}$ (Valores $x_1 = -3$, $x_2 = 3$).
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $x = 3$ y $x = -3$ (Conjunto $S = \{-3, 3\}$).
   * **Solución formal:**
     1. Igualamos el criterio de la función al valor de salida solicitado:
        $$f(x) = 8 \implies x^2 - 1 = 8$$
     2. Despejamos la variable independiente:
        $$x^2 = 9 \implies x = \pm \sqrt{9} = \pm 3$$
     3. Por lo tanto, existen dos preimágenes reales: $x_1 = 3$ y $x_2 = -3$.
7. **Alternativas válidas:** `{-3, 3}`, `x = 3, x = -3`, `3 y -3`.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Responder únicamente la raíz principal positiva $x = 3$ e ignorar la simétrica negativa.
   * *Retroalimentación:* "¡Incompleto! Elevar $(-3)^2$ también da $9$. Recuerda que las funciones cuadráticas pueden tener dos preimágenes para una misma salida."
9. **Ayudas ZDP:**
   * *Pista 1:* Resalta la recta $y=8$ y pide contar sus intersecciones con la parábola, sin rotular las preimágenes.
   * *Pista 2:* "Al resolver $x^2 = 9$, la solución algebraica incluye la raíz positiva y negativa $\pm \sqrt{9}$."
   * *Explicación 3:* Muestra que $f(3) = 3^2 - 1 = 8$ y $f(-3) = (-3)^2 - 1 = 8$, probando ambas preimágenes.
10. **Casos de prueba:**
    * *Correcto:* `{-3, 3}` $\to$ SymPy valida el conjunto completo `FiniteSet(-3, 3)`.
    * *Incorrecto:* `{3}` $\to$ Rechazado por conjunto incompleto.
    * *Frontera:* `x = sqrt(9)` representa solo 3: respuesta incompleta por ausencia de -3, no un mero problema de simplificación. Si la gramática admite raíces, aceptar el conjunto completo equivalente; nunca exigir enteros como condición matemática adicional.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

### ZONA 4: ESPEJO DE LAS INVERSAS (Mafs - SVG)

#### Ficha E10: Frecuencia Exponencial
1. **ID y Nombre:** `E10 - Frecuencia Exponencial` (Zona 4: Espejo de las Inversas).
2. **Objetivo observable:** Identificar las propiedades fundamentales de la función exponencial $f(x) = 2^x$ (Dominio $\mathbb{R}$, Rango $(0, +\infty)$ y asíntota horizontal en $y=0$).
   * *Prerrequisitos:* Exponentes reales y comportamiento asintótico.
   * *Dificultad:* Baja-Intermedia.
3. **Fuente sustento:** *Función Exponencial*, min 1:15 a 4:30.
4. **Enunciado para el estudiante:** "Analiza el generador espacial $f(x)=2^x$. Determina su dominio real máximo, su rango y la ecuación de su asíntota horizontal."
5. **Interacción:**
   * *Observa:* Curva exponencial creciente que pasa por $(0,1)$ y se aplana hacia la izquierda.
   * *Manipula:* Selecciona dominio y rango con controles de intervalos y ajusta una recta horizontal para responder la asíntota.
   * *Responde:* `Asíntota: y = 0`, `Rango = (0, +inf)`, `Dominio = (-inf, +inf)`.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** Asíntota horizontal en $y = 0$; $\text{Ran}\,f = (0, +\infty)$; $\text{Dom}\,f = \mathbb{R}$.
   * **Solución formal:**
     1. Para cualquier $x \in \mathbb{R}$, la potencia de base positiva $2^x > 0$ siempre.
     2. Cuando $x \to -\infty$, $2^x \to 0$ por la derecha (ejemplo $2^{-3} = \frac{1}{8} = 0.125$), estabilizándose sobre la recta $y = 0$ sin llegar a tocarla.
      3. Para cualquier $y>0$, $x=\log_2(y)$ satisface $2^x=y$. El rango es $(0,+\infty)$, estrictamente positivo y no acotado superiormente.
7. **Alternativas válidas:** Dominio $\mathbb{R}$ o $(-\infty,+\infty)$, rango $(0,+\infty)$ y asíntota $y=0$; se requieren los tres campos.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Incluir el cero con corchete `[0, +inf)` o poner asíntota vertical.
   * *Retroalimentación:* "Una potencia $2^x$ nunca se hace cero. La curva se acerca infinitamente a $y=0$ pero no la toca; usa paréntesis `(`."
9. **Ayudas ZDP:**
   * *Pista 1:* Resalta la línea punteada horizontal justo sobre el eje $X$ ($y=0$).
   * *Pista 2:* "Prueba valores negativos pequeños: $2^{-1} = 0.5$, $2^{-5} = 0.03125$... ¡Siempre es positivo!"
   * *Explicación 3:* Muestra la regla general: Para $f(x)=a^x$ con $a>1$, la asíntota es $y=0$ y el rango es $(0, +\infty)$.
10. **Casos de prueba:**
    * *Correcto:* `Dom: R`, `Ran: (0, +inf)` y `y=0` $\to$ Validación aprobada. Omitir dominio no cumple el ejercicio.
    * *Incorrecto:* `Ran: [0, +inf)` $\to$ Notifica error en limite de frontera.
    * *Frontera:* `y=0.001` no es la asíntota exacta; no corregir ni aprobar silenciosamente la respuesta.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E11: El Reflejo de la Inversa
1. **ID y Nombre:** `E11 - El Reflejo de la Inversa` (Zona 4: Espejo de las Inversas).
2. **Objetivo observable:** Construir la función logarítmica $g(x) = \log_2(x)$ mediante la reflexión de la función exponencial $f(x) = 2^x$ a lo largo de la recta de simetría $y = x$, demostrando el intercambio entre dominio y rango.
   * *Prerrequisitos:* Concepto de función inversa y simetría cartesiana.
   * *Dificultad:* Intermedia-Avanzada.
3. **Fuente sustento:** *Función logarítmica*, min 0:45 a 3:20; *Material de la unidad 4.pdf*, pág. 119.
4. **Enunciado para el estudiante:** "Refleja los puntos (0,1) y (1,2) de $f(x)=2^x$ sobre la recta $y=x$ para construir su inversa $g(x)=\log_2(x)$. Indica los dos puntos reflejados, el dominio, el rango y la asíntota vertical de g."
5. **Interacción:**
   * *Observa:* La curva exponencial $2^x$ y la recta de simetría $y=x$ trazada en el plano.
   * *Manipula:* Arrastra los puntos del reflejo $(0,1) \to (1,0)$ y $(1,2) \to (2,1)$.
   * *Responde:* Puntos $(1,0)$ y $(2,1)$, dominio $(0,+\infty)$, rango $\mathbb{R}$ y asíntota $x=0$; todos son obligatorios (propuesta C05).
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\text{Dom}\,g = (0, +\infty)$; $\text{Ran}\,g = (-\infty, +\infty) = \mathbb{R}$; Asíntota vertical en $x = 0$.
   * **Solución formal:**
      1. Una función inyectiva posee inversa sobre su imagen. Aquí se considera $f:\mathbb{R}\to(0,+\infty)$, que es biyectiva; se intercambian las coordenadas $(x,y)\mapsto(y,x)$.
     2. Por la propiedad de las inversas:
        $$\text{Dom}(f^{-1}) = \text{Ran}(f) = (0, +\infty)$$
        $$\text{Ran}(f^{-1}) = \text{Dom}(f) = \mathbb{R}$$
     3. La asíntota horizontal $y=0$ de la exponencial se convierte en la asíntota vertical $x=0$ del logaritmo.
7. **Alternativas válidas:** Representaciones equivalentes de los intervalos; los puntos deben corresponder a sus puntos originales. No basta responder únicamente dominio o asíntota.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Pensar que el dominio del logaritmo son todos los reales $\mathbb{R}$.
   * *Retroalimentación:* "¡Recuerda el intercambio de conjuntos! El dominio del logaritmo es el RANGO de la exponencial, es decir, solo reales positivos $(0, +\infty)$."
9. **Ayudas ZDP:**
   * *Pista 1:* Muestra la proyección de las líneas de reflejo perpendiculares a $y=x$.
   * *Pista 2:* "Si el punto $(0,1)$ está en la exponencial, inviértelo a $(1,0)$ para la logarítmica."
   * *Explicación 3:* Muestra el teorema formal: $(f \circ f^{-1})(x) = x$, donde $\text{Dom}(f^{-1}) = \text{Ran}(f)$.
10. **Casos de prueba:**
    * *Correcto:* Reflejar a $(1,0)$ y $(2,1)$ con `Dom: (0, +inf)`, `Ran: R`, `Asintota: x=0` $\to$ Respuesta completa. Omitir cualquiera de los campos no permite avanzar.
    * *Incorrecto:* Graficar logaritmo cruzando al cuadrante $x<0$ $\to$ Error de dominio violado.
    * *Frontera:* `Dom: [0, +inf)` $\to$ Error: El logaritmo no acepta cero.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E12: Conversión de Poder
1. **ID y Nombre:** `E12 - Conversión de Poder` (Zona 4: Espejo de las Inversas).
2. **Objetivo observable:** Convertir expresiones entre las formas equivalentes $a^y = x \iff y = \log_a(x)$ y evaluar preimágenes en funciones exponenciales.
   * *Prerrequisitos:* Propiedad fundamental de la definición de logaritmos.
   * *Dificultad:* Intermedia.
3. **Fuente sustento:** *Función logarítmica*, min 2:10.
4. **Enunciado para el estudiante:** "El núcleo emite un impulso de salida $y = 81$ bajo la regla $f(x) = 3^x$. Transforma la ecuación a su forma logarítmica equivalente para hallar el valor exacto del exponente $x$."
5. **Interacción:**
   * *Observa:* Plantilla de conversión $a^y = x \iff \log_a(x) = y$.
   * *Manipula:* Rellena las casillas de Base, Argumento y Resultado.
   * *Responde:* Formato logarítmico: $\log_3(81) = x$; Solución: $x = 4$.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\log_3(81) = 4 \implies x = 4$.
   * **Solución formal:**
     1. Planteamos la búsqueda de preimagen: $f(x) = 81 \implies 3^x = 81$.
     2. Aplicamos la definición de logaritmo: $3^x = 81 \iff x = \log_3(81)$.
     3. Como $3^4 = 81$, concluimos que $\log_3(81) = 4$, por lo que la preimagen es $x = 4$.
7. **Alternativas válidas:** Conversión $x=\log_3(81)$ o $\log_3(81)=x$, junto a la solución $x=4$ o conjunto $\{4\}$. Ambas partes son obligatorias; $\log_3(81)=4$ puede representar ambas si la interacción permite esa igualdad completa.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Confundir la base con el argumento y escribir $\log_{81}(3)$.
   * *Retroalimentación:* "La base del exponente ($3$) sigue siendo la base del logaritmo: $\log_3(81)$ responde '¿a qué potencia elevo el 3 para obtener 81?'."
9. **Ayudas ZDP:**
   * *Pista 1:* Colorea con etiquetas la Base (3 en azul), Exponente ($x$ en verde) y Resultado (81 en naranja).
   * *Pista 2:* "Descompón $81$ en factores de $3$: $81 = 3 \times 3 \times 3 \times 3 = 3^4$."
   * *Explicación 3:* Muestra la regla fundamental $y = \log_a(x) \iff a^y = x$.
10. **Casos de prueba:**
    * *Correcto:* Base 3, argumento 81 y resultado/preimagen 4 $\to$ Conversión y solución correctas; responder solo 4 no verifica la conversión.
    * *Incorrecto:* `x = 27` $\to$ Error: Dividió $81/3$ en lugar de hallar el exponente.
    * *Frontera:* `x = log3(81)` es una conversión correcta, pero falta el valor evaluado solicitado. No confundir una parte correcta con el ejercicio completo.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

### ZONA 5: SALA DE INTEGRACIÓN (Mafs - SVG)

#### Ficha E13: Filtro del Satélite
1. **ID y Nombre:** `E13 - Filtro del Satélite` (Zona 5: Sala de Integración).
2. **Objetivo observable:** Determinar el dominio máximo real de una función logarítmica compuesta $f(x) = \log_5(x - 4)$ resolviendo la restricción del argumento e identificando la asíntota vertical.
   * *Prerrequisitos:* Resolución de inecuaciones lineales y restricciones del logaritmo.
   * *Dificultad:* Intermedia-Avanzada.
3. **Fuente sustento:** *Función logarítmica*; *Material de la unidad 4.pdf*, pág. 105.
4. **Enunciado para el estudiante:** "El filtro de datos principal opera con la función $f(x) = \log_5(x - 4)$. Resuelve la restricción analítica del argumento para fijar los límites del escáner y la asíntota de falla."
5. **Interacción:**
   * *Observa:* Plano cartesiano con sombra móvil a lo largo del eje $X$.
   * *Manipula:* Escribe el intervalo del dominio y la ecuación de la asíntota vertical.
   * *Responde:* `Dominio = (4, +inf)`, `Asíntota Vertical: x = 4`.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $\text{Dom}\,f = (4, +\infty)$; Asíntota vertical en $x = 4$.
   * **Solución formal:**
     1. Para existir en $\mathbb{R}$, el argumento del logaritmo debe cumplir:
        $$x - 4 > 0 \implies x > 4$$
     2. En notación de intervalos, el dominio es el conjunto abierto $(4, +\infty)$.
     3. El valor frontera $x = 4$ anula el argumento, constituyendo la asíntota vertical $x = 4$.
7. **Alternativas válidas:** Dominio `(4, +infinito)` o `x > 4`, junto a la asíntota `x = 4`; ambos campos obligatorios (propuesta C07).
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Poner corchete cerrado `[4, +inf)`.
   * *Retroalimentación:* "Si $x=4$, el argumento vale $4-4=0$, y $\log_5(0)$ no está definido en los números reales. Debe ser un intervalo abierto con paréntesis `(`."
9. **Ayudas ZDP:**
   * *Pista 1:* Sombra roja en la zona prohibida $x \le 4$.
   * *Pista 2:* "Plantea la desigualdad: Argumento $> 0 \implies x - 4 > 0$."
   * *Explicación 3:* Muestra el procedimiento completo de resolución de restricciones del dominio.
10. **Casos de prueba:**
    * *Correcto:* `Dom: (4, +inf)` y `x=4` $\to$ Validación en FastAPI exitosa.
    * *Incorrecto:* `Dom: [4, +inf)` $\to$ Error de restricción no estricta.
    * *Frontera:* `Dom: (0, +inf)` $\to$ Error: Olvidó el desplazamiento de $-4$.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E14: Verificador de Imposibles
1. **ID y Nombre:** `E14 - Verificador de Imposibles` (Zona 5: Sala de Integración).
2. **Objetivo observable:** Evaluar la existencia de preimágenes en funciones exponenciales y lineales, reconociendo adecuadamente cuándo el conjunto solución es el conjunto vacío ($\emptyset$) o un conjunto unitario.
   * *Prerrequisitos:* Análisis de rangos de funciones trascendentes y lineales.
   * *Dificultad:* Avanzada.
3. **Fuente sustento:** *Función Exponencial*, min 3:40; *Material de la unidad 4.pdf*, pág. 120.
4. **Enunciado para el estudiante:** "El sistema de diagnóstico analiza la llegada de una señal de nivel $y = -2$ en dos módulos distintos:
   1) Módulo Exponencial: $f(x)=2^x$; resolver $f(x)=-2$ en los reales.
   2) Módulo Lineal: $g(x)=3x+1$; resolver $g(x)=-2$ en los reales.
   Determina el conjunto de preimágenes $S_1$ y $S_2$ para cada módulo."
5. **Interacción:**
   * *Observa:* Pantalla dividida con la gráfica de $2^x$ y de $3x+1$ cruzadas por la recta horizontal $y=-2$.
   * *Manipula:* Selecciona explícitamente el conjunto vacío `∅` o introduce un conjunto de valores. Un campo sin contestar no equivale al conjunto vacío.
   * *Responde:* Módulo 1: $S_1 = \emptyset$ (Conjunto vacío); Módulo 2: $S_2 = \{-1\}$.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $S_1 = \emptyset$ (o `{}`); $S_2 = \{-1\}$.
   * **Solución formal:**
     1. *Módulo 1:* La función $f(x) = 2^x$ tiene rango $(0, +\infty)$. Ninguna potencia de base positiva puede dar como resultado un número negativo ($-2$). La ecuación $2^x = -2$ no tiene solución en $\mathbb{R} \implies S_1 = \emptyset$.
     2. *Módulo 2:* Para $g(x) = 3x + 1 = -2 \implies 3x = -3 \implies x = -1$. Como la lineal tiene rango $\mathbb{R}$, existe una única preimagen $x = -1 \implies S_2 = \{-1\}$.
7. **Alternativas válidas:** `S1 = ∅`, `S1 = {}`; `S2 = {-1}`. Si se admiten alias de entrada como `Ø` o `vacío`, normalizarlos y mostrar siempre `∅`.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Decir que $2^x = -2$ tiene solución $x = -1$.
   * *Retroalimentación:* "¡Ojo! $2^{-1} = \frac{1}{2} = +0.5$, no $-2$. Una base positiva elevada a un exponente real siempre da un valor positivo."
9. **Ayudas ZDP:**
   * *Pista 1:* Muestra que la curva $2^x$ vuela por encima del eje $X$ y jamás toca la recta $y=-2$.
   * *Pista 2:* "El rango de $2^x$ es $(0, +\infty)$. Como $-2$ no está en el rango, no existe ninguna preimagen."
   * *Explicación 3:* Muestra la diferencia analítica entre ecuaciones exponenciales sin solución en $\mathbb{R}$ y ecuaciones lineales.
10. **Casos de prueba:**
    * *Correcto:* `S1 = ∅` y `S2 = {-1}` $\to$ Confirmar ambos conjuntos reales, vacío y unitario.
    * *Incorrecto:* `S1 = {-1}` $\to$ Notifica error de evaluación exponencial.
    * *Frontera:* `S1 = no existe` $\to$ Convierte a notación de conjunto vacío $\emptyset$.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

#### Ficha E15: Núcleo Integrado a Trozos
1. **ID y Nombre:** `E15 - Núcleo Integrado a Trozos` (Zona 5: Sala de Integración).
2. **Objetivo observable:** Seleccionar la rama de una función a trozos lineal/cuadrática, evaluar puntos y determinar su dominio total. El rango no es parte de la respuesta solicitada (propuesta C07).
   * *Prerrequisitos:* Dominio de funciones lineales, cuadráticas y evaluación condicional.
   * *Dificultad:* Avanzada (Reto Final).
3. **Fuente sustento:** *Función a trozos. Gráfica, dominio y rango*, min 0:45 a 9:20.
4. **Enunciado para el estudiante:** "El núcleo principal del satélite funciona con el sistema por tramos:
   $$f(x) = \begin{cases} x + 2 & \text{si } x < 0 \\ (x - 3)^2 + 2 & \text{si } x \ge 0 \end{cases}$$
   Evalúa la respuesta del sistema para $f(-2)$ y $f(0)$, y determina el Dominio total de la función."
5. **Interacción:**
   * *Observa:* Gráfica compuesta por una semirrecta a la izquierda de $x=0$ y una parábola a la derecha.
   * *Manipula:* Rellena los campos de evaluación y ajusta el intervalo de dominio total.
   * *Responde:* $f(-2) = 0$; $f(0) = 11$; `Dominio Total = (-inf, +inf)`.
6. **Respuesta correcta y Solución formal:**
   * **Respuesta:** $f(-2) = 0$; $f(0) = 11$; $\text{Dom}\,f = (-\infty, +\infty) = \mathbb{R}$.
   * **Solución formal:**
     1. *Para $f(-2)$:* Como $x = -2 < 0$, aplicamos la primera rama: $f(-2) = -2 + 2 = 0$.
     2. *Para $f(0)$:* Como $x = 0 \ge 0$, aplicamos la segunda rama: $f(0) = (0 - 3)^2 + 2 = (-3)^2 + 2 = 9 + 2 = 11$.
     3. *Dominio Total:* La rama 1 está definida en $(-\infty, 0)$ y la rama 2 en $[0, +\infty)$. La unión de dominios es $(-\infty, 0) \cup [0, +\infty) = (-\infty, +\infty) = \mathbb{R}$.
7. **Alternativas válidas:** `f(-2)=0`, `f(0)=11` y dominio real completo, expresado como `R`, `(-inf,+inf)` o unión equivalente. Se requieren los tres resultados. La discontinuidad en 0 no elimina 0 del dominio.
8. **Errores frecuentes y Retroalimentación:**
   * *Error:* Evaluar $f(0)$ en la primera rama obteniendo $0+2=2$.
   * *Retroalimentación:* "Revisa los intervalos de definición: para $x=0$, la condición es $x \ge 0$, por lo que corresponde usar la rama cuadrática."
9. **Ayudas ZDP:**
   * *Pista 1:* Resalta la frontera vertical en $x=0$ dividiendo los dos comportamientos.
   * *Pista 2:* "Si $x < 0$ usa $x+2$. Si $x \ge 0$ usa $(x-3)^2+2$."
   * *Explicación 3:* Muestra el cálculo condicional separado para cada tramo y la unión de intervalos.
10. **Casos de prueba:**
    * *Correcto:* `f(-2)=0`, `f(0)=11`, `Dom: (-inf, +inf)` $\to$ ¡Juego completado al 100%!
    * *Incorrecto:* `f(0)=2` $\to$ Error de selección de rama condicional.
    * *Frontera:* `Dom: (-inf, 0) U [0, +inf)` $\to$ SymPy simplifica a $\mathbb{R}$ y lo aprueba como correcto.
11. **Asignación propuesta:** Revisión Didáctica: Danny | Implementación Mafs: Edwin | Pruebas UI: María.

---

## 5. Tabla Resumen de Soluciones Formales

| ID | Nombre del Ejercicio | Dominio Total / Solución Principal | Rango / Resultado Evaluado | Puntos / Asíntotas Críticas |
| :--- | :--- | :--- | :--- | :--- |
| **E01** | El Conector de Energía | Es Función ($\forall x \in A, \exists ! y \in B$) | Imágenes efectivas $\{4, 5\}$ | No viola unicidad ni existencia |
| **E02** | El Cortocircuito de Unicidad | $R_1=\{(1,4),(2,4),(3,5)\}$ o $R_2=\{(1,5),(2,4),(3,5)\}$ | Rango $\{4, 5\}$ | Se elimina $(1,5)$ o $(1,4)$ |
| **E03** | Restauración de Existencia | $R_1=\{(1,4),(2,4),(3,5)\}$ o $R_2=\{(1,4),(2,5),(3,5)\}$ | Rango $\{4, 5\}$ | Se asigna imagen al nodo $2 \in A$ |
| **E04** | Escáner de Señal Lineal | $\text{Dom}\,f = (-\infty, +\infty) = \mathbb{R}$ | $\text{Ran}\,f = (-\infty, +\infty) = \mathbb{R}$ | Recta oblicua inclinada ($m=2$) |
| **E05** | Umbral del Sensor | $\text{Dom}\,f = [2,+\infty)$ | $\text{Ran}\,f = [0,+\infty)$ | $f(x)=\sqrt{x-2}$, punto $(2,0)$ incluido |
| **E06** | Frecuencia Prohibida | $\text{Dom}\,f = (-\infty,3)\cup(3,+\infty)$ | Valor excluido: 3; rango no solicitado | $f(x)=5/(x-3)$ |
| **E07** | Sintonizador de Pendiente | $f(x) = -2x + 4$ | $m = -2$, $b = 4$ | Puntos ordenados $(0,4)$ y $(2,0)$ |
| **E08** | Foco del Vértice | Construcción: $h=3,k=2$, con $a=1$ | $f(x)=(x-3)^2+2$ | Eje $x=3$ como explicación complementaria |
| **E09** | Eco de Preimágenes | Preimágenes de $y=8$: $x_1=3, x_2=-3$ | Conjunto $S = \{-3, 3\}$ | $x^2 = 9 \implies x = \pm 3$ |
| **E10** | Frecuencia Exponencial | $\text{Dom}\,f = (-\infty, +\infty) = \mathbb{R}$ | $\text{Ran}\,f = (0, +\infty)$ | Asíntota horizontal en $y = 0$ |
| **E11** | El Reflejo de la Inversa | $\text{Dom}\,g = (0, +\infty)$ | $\text{Ran}\,g = (-\infty, +\infty) = \mathbb{R}$ | Asíntota vertical en $x = 0$; Reflejo $y=x$ |
| **E12** | Conversión de Poder | Formato: $\log_3(81) = x$ | Preimagen $x = 4$ | $3^4 = 81 \iff \log_3(81) = 4$ |
| **E13** | Filtro del Satélite | $\text{Dom}\,f = (4, +\infty)$ | Restricción: $x - 4 > 0$ | Asíntota vertical en $x = 4$ |
| **E14** | Verificador de Imposibles | Módulo 1: $S_1 = \emptyset$; Módulo 2: $S_2 = \{-1\}$ | Preimágenes para $y = -2$ | $2^x \neq -2$ en $\mathbb{R}$ |
| **E15** | Núcleo Integrado a Trozos | $\text{Dom}\,f = (-\infty, +\infty) = \mathbb{R}$ | $f(-2) = 0$, $f(0) = 11$ | Frontera condicional en $x = 0$ |

---

## 6. Lista de Pendientes y Matriz de Revisión por Integrante

### Matriz de Distribución de Trabajo del Equipo

Distribución propuesta para todas las zonas: Danny revisa didáctica/matemática, María revisa interfaz/ayudas y ambos realizan revisión cruzada. No es evidencia de tareas realizadas ni una asignación aprobada automáticamente.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                     ASIGNACIÓN DE ROLES Y RESPONSABILIDADES               │
├───────────────────────┬───────────────────────────────────────────────────┤
│ Integrante            │ Responsabilidades y Tareas Clave                  │
├───────────────────────┼───────────────────────────────────────────────────┤
│ Edwin Ernesto         │ • Coordinación general y compilación del .md      │
│ Rodríguez Pérez       │ • Implementación del Frontend (Vite/TS/PixiJS/Mafs)│
│ (Coordinador)         │ • Desarrollo de la API REST (FastAPI + SymPy)     │
├───────────────────────┼───────────────────────────────────────────────────┤
│ Danny Mauricio        │ • Subcoordinación de tiempos de entrega           │
│ Trujillo              │ • Revisión didáctica y matemática de ejercicios    │
│ (Subcoordinador)      │ • Pruebas de integración API-Cliente y fallbacks  │
├───────────────────────┼───────────────────────────────────────────────────┤
│ María Erika           │ • Testing de usabilidad en dispositivos móviles   │
│ González Ortez        │ • Verificación de casos de prueba frontera        │
│ (Tester)              │ • Auditoría de ayudas ZDP y legibilidad de UI     │
└───────────────────────┴───────────────────────────────────────────────────┘
```

### Checklist de Acciones Inmediatas (Antes del 17/11/2026)

- [x] **Decisiones de contenido recibidas:** E01 reconocimiento; E05 radical; E06 racional; E08 construcción desde vértice; E15 con rama $(x-3)^2+2$.
- [ ] **Revisión del banco:** Aprobar criterios C01–C07 y contrastar las fuentes didácticas.
- [ ] **Revisión SDD:** Revisar `../specs/001-primer-recorrido/spec.md` antes del plan, tareas e implementación.
- [ ] **Configuración del producto:** El repositorio local existe en `development/`; frontend/backend y herramientas siguen pendientes. No hay remoto ni publicación verificados.
- [ ] **Implementación de JSON de Ejercicios:** Exportar la matriz de los 15 ejercicios a un archivo estático `exercises.json` para soporte local (`LocalStorage`).
- [ ] **Pruebas de la API SymPy:** Verificar en backend los scripts de resolución de conjuntos equivalentes (`sympy.FiniteSet`) y evaluación de dominios.
- [ ] **Compilación del Entregable Markdown (.md):** Integrar portada, sinopsis de máximo 100 palabras pendiente de aprobación, objetivo, reglas, fichas E01–E15, enlace abierto y evidencias reales de autoría.
