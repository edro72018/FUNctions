# Portada
### **UNIVERSIDAD DE EL SALVADOR**
### **MODALIDAD EN LÍNEA**
### **FACULTAD DE CIENCIAS NATURALES Y MATEMÁTICA**
### **ESCUELA DE MATEMÁTICA**
### **LICENCIATURA EN INFORMÁTICA EDUCATIVA**

## Asignatura
### **Matemática para Computación I (DMC1109)**

## Proyecto
### **Proyecto final: Gamifiquemos**

## Nombre del juego
**Juego educativo “FUNctions”**

## Estudiantes

| Nombre | Carnet |
| :--- | :--- |
| **María Erika González Ortez** | **GO19022** |
| **Danny Mauricio Trujillo Alvarado** | **TA24007** |
| **Edwin Ernesto Rodríguez Pérez** | **RP16053** |

## Tutora y coordinadora de la asignatura

**Lcda. Martha Beatriz Bran Hernández**

### Grupo teórico

**GT-01**

Ciclo II - 2026

Ciudad Universitaria, martes 17 de noviembre de 2026

# Nombre del juego y sinopsis

## FUNctions

En una línea temporal alternativa donde la carrera espacial nunca terminó y los viajes al espacio son cotidianos, el jugador forma parte del equipo de ingeniería de ESAI (El Salvador Aerospace Institute), representado de forma ficticia dentro del juego. Un satélite de exploración ha sufrido una falla y sus cinco sistemas deben repararse mediante quince retos sobre funciones. Al reconocer relaciones, analizar dominios y rangos, ajustar trayectorias y resolver modelos exponenciales, logarítmicos y por tramos, el jugador restaura el satélite mientras recibe retroalimentación y ayudas progresivas.

La ambientación toma como referencia general las historias alternativas donde la carrera espacial continúa, como *For All Mankind*, pero FUNctions posee una misión, sistemas y retos propios. La representación de ESAI, sus instalaciones, personal y operaciones es ficticia y no implica respaldo o participación oficial. El proyecto tampoco pertenece al universo de la serie ni está afiliado, patrocinado o respaldado por Apple o Apple TV.

El diseño detallado se encuentra en el [Documento de Diseño de Juego de FUNctions, versión 0.1](./workspace/GDD_FUNctions_v0.1.md).

# Descripción general y público meta

FUNctions es un rompecabezas educativo 2D para un jugador, presentado mediante paneles interactivos de un centro de control espacial. Cada reto contextualiza un problema matemático como una reparación: conectar una entrada, delimitar valores permitidos, ajustar una trayectoria o recuperar una señal. Los objetos manipulables, la notación algebraica y las gráficas se muestran de forma relacionada para que cada acción permita observar una propiedad de la función estudiada.

El diseño utiliza aprendizaje basado en problemas: diagnosticar una falla, formular una hipótesis, experimentar con los controles y justificar la solución a partir de la retroalimentación. La gamificación se apoya en objetivos de misión, progreso visible y recuperación de los sistemas del satélite, sin convertir la velocidad ni el castigo en el centro de la experiencia.

- **Público principal:** estudiantes de bachillerato, aproximadamente de 15 a 18 años.
- **Público secundario:** estudiantes de ingreso universitario que necesiten reforzar el tema de funciones.
- **Prerrequisitos:** operaciones aritméticas, despeje básico, pares ordenados, conjuntos y lectura inicial del plano cartesiano.
- **Uso previsto:** práctica individual en clase o trabajo autónomo.
- **Duración estimada de diseño:** entre 45 y 75 minutos para el recorrido completo; deberá ajustarse después de realizar pruebas con estudiantes.

# Objetivos de aprendizaje

## Objetivo general

Al finalizar FUNctions, el jugador será capaz de reconocer relaciones que cumplen la definición de función, determinar dominio y rango, interpretar representaciones algebraicas y gráficas, construir funciones lineales y cuadráticas, calcular preimágenes, relacionar funciones exponenciales y logarítmicas, y evaluar funciones definidas por tramos mediante quince desafíos progresivos con retroalimentación educativa.

## Objetivos específicos

- Reconocer las condiciones de existencia y unicidad de una función.
- Determinar el dominio y el rango de diferentes familias de funciones.
- Interpretar gráficas, intervalos, puntos críticos y asíntotas.
- Construir funciones lineales y cuadráticas a partir de datos y puntos de referencia.
- Calcular conjuntos completos de preimágenes.
- Relacionar funciones exponenciales con sus inversas logarítmicas.
- Evaluar correctamente funciones definidas por tramos.
- Utilizar la retroalimentación y las ayudas progresivas para corregir errores.

# Reglas y mecánica del juego

FUNctions se organiza como un rompecabezas educativo de cinco Zonas consecutivas. Cada Zona contiene tres Ejercicios o niveles, para un total de quince. La persona jugadora debe reparar los sistemas de un satélite resolviendo actividades sobre funciones.

## Flujo de juego

1. Iniciar una misión nueva o continuar el progreso guardado.
2. Consultar el mapa del satélite y entrar en la Zona disponible.
3. Leer el diagnóstico, los datos y los resultados solicitados por el Ejercicio.
4. Observar la representación y manipular conexiones, intervalos, parámetros, puntos o conjuntos.
5. Pulsar **Probar** para evaluar la respuesta completa.
6. Interpretar la retroalimentación, consultar una pista si se necesita y corregir la propuesta.
7. Resolver los tres Ejercicios de la Zona para reparar el sistema y habilitar la siguiente.
8. Completar E15 y los quince Ejercicios para restablecer el satélite y finalizar la misión.

El ciclo principal es: **Observar → Manipular → Probar una hipótesis → Recibir retroalimentación → Resolver**.

## Reglas de progreso y evaluación

- Las Zonas y sus Ejercicios se habilitan en orden; los Ejercicios resueltos pueden repetirse.
- Un Ejercicio se completa únicamente cuando todos sus campos obligatorios son correctos.
- Una respuesta incompleta o con formato inválido se señala antes de evaluar su contenido matemático.
- Una respuesta incorrecta conserva el Ejercicio activo y proporciona un diagnóstico específico; no elimina el progreso.
- Los reintentos son ilimitados y el juego no utiliza temporizador, vidas, puntos ni insignias; el progreso se representa mediante niveles completados y sistemas reparados.
- Un fallo técnico del verificador no se considera error matemático: la respuesta se conserva y puede enviarse nuevamente.
- **Deshacer** revierte la última edición y **Reiniciar reto** recupera la configuración inicial.
- El progreso se guarda localmente para permitir continuar la misión desde el mismo navegador.
- La victoria requiere completar los quince Ejercicios y restaurar los cinco sistemas.

## Sistema de ayudas

Cada Ejercicio dispone de tres ayudas voluntarias y progresivas:

| Ayuda | Propósito |
|---|---|
| **H1 — Atención perceptiva** | Resalta un dato, objeto o región relevante sin revelar la respuesta. |
| **H2 — Estrategia** | Recuerda una propiedad matemática y orienta el siguiente paso. |
| **H3 — Explicación guiada** | Desarrolla el razonamiento y muestra la solución explicada. |

H1 está disponible desde el inicio; H2 se habilita después de consultar H1 y H3 después de H2. Consultar una ayuda no reduce el progreso. Aunque H3 explique el procedimiento, la persona jugadora debe reconstruir la respuesta con los controles y pulsar **Probar**.

## Mecánicas principales

| Acción | Aplicación matemática | Ejercicios |
|---|---|---|
| Observar y clasificar | Reconocer existencia y unicidad | E01 |
| Conectar o desconectar | Reparar relaciones entre conjuntos | E02–E03 |
| Sombrear y delimitar | Representar dominios, rangos y exclusiones | E04–E06, E10–E11, E13, E15 |
| Ajustar parámetros | Modificar pendiente, intersección o vértice | E07–E08 |
| Arrastrar puntos | Construir la reflexión de una función inversa | E11 |
| Posicionar asíntotas | Identificar orientación y valor límite | E10–E11, E13 |
| Construir conjuntos | Expresar todas las preimágenes reales o el conjunto vacío | E09, E14 |
| Completar y evaluar | Convertir formas exponenciales y logarítmicas o evaluar ramas | E12, E15 |

## Organización por zonas

| Zona | Sistema de la misión | Contenido principal |
|---|---|---|
| 1. Máquina de Enlaces | Distribución de energía y datos | Existencia y unicidad |
| 2. Escáner de Proyección | Sensores y límites de operación | Dominio y rango |
| 3. Sintonizador de Trayectorias | Orientación y navegación | Funciones lineales, cuadráticas y preimágenes |
| 4. Espejo de las Inversas | Codificación de señales | Funciones exponenciales y logarítmicas |
| 5. Sala de Integración | Núcleo del satélite | Restricciones, conjuntos solución y funciones por tramos |

## Accesibilidad e interacción

La interfaz se diseña para computadora y tableta, con soporte para mouse, pantalla táctil y teclado. Las acciones esenciales deben ofrecer controles etiquetados, foco visible y alternativas numéricas de precisión. Los estados se comunican mediante texto e iconos además del color. Las animaciones deben ser breves y reducibles; toda señal sonora debe tener un equivalente visual y la música y los efectos podrán silenciarse por separado.

Estas reglas proceden del GDD v0.1 y fueron aprobadas como diseño definitivo del juego. Su implementación y funcionamiento todavía deberán comprobarse mediante pruebas.

# Ejercicios y soluciones

El juego utiliza quince ejercicios, tres por cada Zona. El [Banco canónico de ejercicios](./banco_ejercicios.md) contiene los enunciados, procedimientos, alternativas válidas, errores frecuentes y soluciones formales. La [Guía técnica](./exercises.md) resume su correspondencia con las interacciones del juego y el [GDD v0.1](./workspace/GDD_FUNctions_v0.1.md) define sus mecánicas y casos de prueba de diseño.

| ID | Ejercicio | Solución principal |
|---|---|---|
| E01 | El Conector de Energía | La relación es una función: cada entrada posee exactamente una imagen. |
| E02 | El Cortocircuito de Unicidad | Retirar `(1,4)` o `(1,5)` para conservar una única imagen de `1`. |
| E03 | Restauración de Existencia | Agregar `(2,4)` o `(2,5)` para asignar una imagen a `2`. |
| E04 | Escáner de Señal Lineal | Para `f(x)=2x−1`, dominio `ℝ` y rango `ℝ`. |
| E05 | Umbral del Sensor | Para `f(x)=√(x−2)`, dominio `[2,+∞)` y rango `[0,+∞)`. |
| E06 | Frecuencia Prohibida | Para `f(x)=5/(x−3)`, dominio `ℝ∖{3}`; se excluye `x=3`. |
| E07 | Sintonizador de Pendiente | `m=−2`, `b=4`; por tanto, `f(x)=−2x+4`. |
| E08 | Foco del Vértice | `h=3`, `k=2`; por tanto, `f(x)=(x−3)²+2`. |
| E09 | Eco de Preimágenes | Las preimágenes de `8` en `f(x)=x²−1` son `{−3,3}`. |
| E10 | Frecuencia Exponencial | Dominio `ℝ`, rango `(0,+∞)` y asíntota horizontal `y=0`. |
| E11 | El Reflejo de la Inversa | Puntos `(1,0)` y `(2,1)`, dominio `(0,+∞)`, rango `ℝ` y asíntota `x=0`. |
| E12 | Conversión de Poder | `3ˣ=81 ⇔ x=log₃(81)=4`. |
| E13 | Filtro del Satélite | Dominio `(4,+∞)` y asíntota vertical `x=4`. |
| E14 | Verificador de Imposibles | Para `2ˣ=−2`, `S₁=∅`; para `3x+1=−2`, `S₂={−1}`. |
| E15 | Núcleo Integrado a Trozos | `f(−2)=0`, `f(0)=11` y dominio total `ℝ`. |

La hoja de trabajo está disponible en [Práctica de los quince ejercicios](latex/Banco%20de%20Ejercicios%20de%20FUNctions.pdf). Antes de la entrega deben incorporarse en esta sección los procedimientos completos y realizarse la revisión cruzada de las soluciones. Los casos del GDD son resultados esperados de diseño y no deben presentarse como pruebas ya ejecutadas.

# Créditos y roles del equipo

La siguiente distribución corresponde a los roles registrados. Antes de la entrega debe actualizarse para describir únicamente los aportes efectivamente realizados y respaldados por los anexos.

| Integrante | Rol y responsabilidades registradas |
|---|---|
| Edwin Ernesto Rodríguez Pérez | Coordinación general, desarrollo, integración del documento y despliegue. |
| Danny Mauricio Trujillo Alvarado | Subcoordinación, revisión didáctica y matemática, y pruebas. |
| María Erika González Ortez | Pruebas de usabilidad, revisión de casos límite y evaluación de ayudas. |

# Enlace al juego

- **Juego publicado:** pendiente.
- **Repositorio del código:** pendiente.
- **Verificación de acceso abierto:** pendiente.

# Anexos

## Material documental disponible

- [Documento de Diseño de Juego de FUNctions, versión 0.1](./workspace/GDD_FUNctions_v0.1.md).
- [Banco canónico de los quince ejercicios](./banco_ejercicios.md).
- [Guía técnica de ejercicios](./exercises.md).
- [Práctica de los quince ejercicios en PDF](latex/Banco%20de%20Ejercicios%20de%20FUNctions.pdf).
- [Planificación de actividades](./actividades.csv).

## Evidencias pendientes de incorporar

- Capturas del juego y del entorno de desarrollo.
- Historial de aportes de los tres integrantes.
- Evidencia de las revisiones matemática, didáctica y de usabilidad.
- Resultados de pruebas del juego.
- Verificación del enlace público en una sesión sin permisos especiales.

# Bibliografía

Apple TV. (s. f.). *For All Mankind*. https://tv.apple.com/us/show/for-all-mankind/umc.cmc.6wsi780sz5tdbqcf11k76mkp7

Pilar Suárez, M. (2015). *Homo Ludens, Homo Loquens: el juego y la palabra en la Edad Media*. Editorial Universidad Autónoma de Madrid. https://elibro.net/es/ereader/biblioues/53995?page=390

Stewart, J., Redlin, L., & Watson, S. (2016). *Precálculo: Matemáticas para el cálculo* (7.ª ed.; J. León Cárdenas, Trad.). Cengage Learning.
