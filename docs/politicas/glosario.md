# Glosario único de FUNtions

**Estado:** vocabulario canónico inicial para código, documentación, revisiones y consultas asistidas por IA.  
**Regla de uso:** conservar los nombres y significados de esta tabla; no reutilizar un término para otro concepto sin actualizar este documento y los estándares que lo referencian.

| Término | Definición normativa |
|---|---|
| **API** | Interfaz HTTP versionada de FastAPI que recibe solicitudes de validación y devuelve resultados conforme al [Contrato de API](./contrato-api.md). |
| **Backend** | Servicio FastAPI que valida entradas, coordina validadores y usa SymPy para comprobaciones simbólicas acotadas. No administra el Progreso local. |
| **Banco de ejercicios** | Conjunto publicado de quince Ejercicios identificados de forma estable (`E01`–`E15`), con enunciados, respuestas de referencia, ayudas y criterios de validación. |
| **Capa** | Parte de la arquitectura con responsabilidad definida: interfaz, visualización, dominio, transporte, persistencia o servicio matemático. Una capa depende de contratos explícitos, no de detalles internos de otra. |
| **Cliente** | Aplicación web React/TypeScript ejecutada en el navegador. Coordina interfaz, Zonas, llamadas a API y Progreso local. |
| **Contrato de API** | Especificación normativa de rutas, solicitudes, respuestas, errores, compatibilidad y comportamiento HTTP. Su documento vigente es [Contrato de API](./contrato-api.md). |
| **Ejercicio** | Unidad identificable de actividad educativa, con enunciado, respuesta o respuestas válidas, ayuda y criterio de evaluación. Un Ejercicio pertenece a una Zona. |
| **Estado indeterminado** | Resultado que indica que el validador no pudo decidir si una respuesta es correcta dentro del alcance o tiempo permitido. No significa incorrecta. |
| **Fallback / Modo estático** | Ejecución del cliente sin API, mediante validadores o respuestas precalculadas revisados para el Banco de ejercicios. Solo cubre ese banco; no es un motor simbólico general. |
| **FastAPI** | Framework Python que implementa el servidor HTTP y sus rutas y modelos de API. |
| **LocalStorage** | Almacenamiento del navegador usado para guardar y recuperar el Progreso local en el mismo navegador y origen. Puede borrarse o no estar disponible; no sincroniza dispositivos. |
| **Mafs** | Biblioteca de visualización matemática utilizada para gráficas y controles de las Zonas 2–5. Es una capa de representación, no la autoridad de validación simbólica. |
| **Modo conectado** | Operación en la que el Cliente envía la respuesta a la API y recibe un resultado del Backend. |
| **PixiJS** | Motor de renderizado e interacción de canvas usado en la Zona 1 para la representación de nodos y conexiones. No contiene la fuente de verdad de las reglas matemáticas. |
| **Progreso local** | Estado de avance del jugador almacenado en LocalStorage. Pertenece a un navegador y origen; no es una cuenta ni un registro del servidor. |
| **React** | Biblioteca utilizada para componer la interfaz y coordinar el estado de la aplicación web. |
| **Resultado** | Estado emitido al evaluar una respuesta: `correct`, `incorrect` o `indeterminate`, según el Contrato de API. |
| **SymPy** | Biblioteca Python para operaciones simbólicas usadas por validadores del Backend dentro de un alcance definido. No se presume que pueda decidir cualquier problema matemático. |
| **Validador** | Regla implementada que compara una respuesta con el criterio de un Ejercicio. Puede ser local o del Backend; debe distinguir respuesta incorrecta de resultado indeterminado. |
| **Zona** | Una de las cinco áreas progresivas del juego, con tres Ejercicios previstos cada una. Zona 1 usa PixiJS; Zonas 2–5 usan Mafs. |
| **ZDP / ayuda progresiva** | Estrategia didáctica de ofrecer apoyos graduales para ayudar a resolver un Ejercicio sin revelar de inmediato su respuesta completa. |

## 1. Vocabulario de zonas

| Zona | Nombre de referencia | Tecnología de visualización | Foco general |
|---|---|---|---|
| 1 | La Máquina de Enlaces | PixiJS | Existencia y unicidad de correspondencias |
| 2 | El Escáner de Proyección | Mafs | Dominio y rango |
| 3 | Sintonizador de Trayectorias | Mafs | Parámetros, vértices y preimágenes |
| 4 | Espejo de las Inversas | Mafs | Exponenciales, logaritmos e inversas |
| 5 | Sala de Integración | Mafs | Restricciones, casos imposibles e integración de conceptos |

Estos nombres describen la organización pedagógica; no implican que cada Zona solo pueda contener una operación matemática. El inventario vigente es el Banco de ejercicios revisado.

## 2. Términos que deben evitarse o precisar

- No llamar **incorrecta** a una respuesta `indeterminate`.
- No llamar **API** a un validador que corre exclusivamente en el navegador.
- No decir que el juego **usa SymPy** cuando se ejecuta en Modo estático.
- No llamar **persistencia en servidor** a LocalStorage ni afirmar que el progreso sincroniza dispositivos.
- No afirmar que una gráfica o un conjunto finito de muestras **demuestra** equivalencia simbólica.
- No usar **Zona** como sinónimo de pantalla, módulo de código o carpeta: en este glosario se refiere al área pedagógica del juego.

## 3. Reglas de mantenimiento del vocabulario

Cuando se introduzca un término nuevo:

1. añadir una definición única aquí;
2. comprobar que no contradice una definición existente;
3. usarlo de forma uniforme en la Guía de convenciones, la Política de versiones, la Estructura definitiva y el Contrato de API;
4. si cambia un término normativo, actualizar referencias y notas de versión relacionadas.
