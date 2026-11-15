# Guía de convenciones de código

**Estado:** estándar inicial propuesto para el equipo de FUNtions.  
**Ámbito:** frontend React/TypeScript, visualizaciones PixiJS y Mafs, backend FastAPI/SymPy y documentación técnica.

## 1. Propósito y aplicación

Esta guía define las convenciones que deben aplicar quienes implementen, revisen o mantengan FUNtions. Se aplica a código nuevo y a cambios en código existente. Cuando una regla no se pueda cumplir, el autor debe explicarlo en la solicitud de cambio y acordar una excepción con quien revise.

Los términos **Zona**, **Ejercicio**, **Validador**, **Modo estático**, **API** y **Progreso local** tienen el significado definido en el [Glosario único](./glosario.md). La distribución de carpetas que complementa estas reglas está en la [Estructura definitiva](./estructura-proyecto.md).

## 2. Principios comunes

1. Preferir código explícito, pequeño y fácil de probar.
2. Separar presentación, interacción, reglas del dominio y acceso a servicios.
3. No duplicar reglas matemáticas entre interfaz y servidor. El cliente puede validar formato y respuestas finitas simples; las comprobaciones simbólicas autoritativas corresponden al backend cuando está disponible. El [Contrato de API](./contrato-api.md) define los límites de esa responsabilidad.
4. No asumir que una gráfica, aproximación numérica o muestra finita demuestra equivalencia matemática.
5. Los errores y los estados no resueltos deben ser visibles y distinguibles de una respuesta incorrecta.
6. Usar nombres de dominio del [Glosario único](./glosario.md) en código, documentación, pruebas y revisiones.

## 3. Formato y nomenclatura

### 3.1 TypeScript y React

- Usar TypeScript estricto. Evitar `any`; modelar los datos con tipos, uniones discriminadas y validaciones en los límites.
- Componentes React, tipos, interfaces y enumeraciones usan `PascalCase`: `ExerciseCard`, `ExerciseResult`.
- Variables, funciones, propiedades y hooks usan `camelCase`: `currentZone`, `useLocalProgress`.
- Los hooks propios empiezan con `use`.
- Constantes compartidas e inmutables usan `camelCase`, salvo constantes globales que sean realmente convenciones del lenguaje o del proyecto; no convertir variables ordinarias a mayúsculas solo por ser constantes.
- Archivos de componentes usan `PascalCase.tsx`; módulos de lógica, hooks y utilidades usan `camelCase.ts`. Los nombres de carpetas siguen `kebab-case`.
- Preferir componentes funcionales y funciones puras para reglas que no necesitan estado de interfaz.
- No guardar reglas matemáticas, persistencia ni peticiones HTTP dentro del componente que dibuja el canvas o la gráfica.

### 3.2 Python

- Seguir PEP 8: módulos y funciones en `snake_case`, clases en `PascalCase` y constantes de módulo en `UPPER_SNAKE_CASE`.
- Añadir anotaciones de tipos a las interfaces de módulo y a las funciones de dominio, validación y API.
- Usar modelos Pydantic para validar entradas y serializar salidas HTTP; no exponer directamente objetos internos de SymPy.
- Mantener las rutas FastAPI delgadas: validar el contrato, delegar al servicio y traducir errores conocidos a respuestas documentadas.
- Evitar `except Exception` como manejo normal. Capturar únicamente errores previstos, registrarlos con contexto útil y devolver el código de error del contrato.

### 3.3 Documentación y datos

- Usar Markdown con títulos jerárquicos, tablas solo cuando mejoren la consulta y ejemplos JSON válidos.
- Mantener identificadores estables de ejercicios (`E01`–`E15`) y de zonas (`1`–`5`); no codificar el orden de una respuesta como su identidad.
- Representar intervalos, conjuntos vacíos, infinitos y extremos abiertos/cerrados mediante estructuras explícitas, no mediante texto libre ambiguo.
- No incluir secretos, datos personales ni credenciales en el repositorio, ejemplos o LocalStorage.

## 4. Responsabilidades por capa

| Capa | Responsabilidad | No debe hacer |
|---|---|---|
| React | Navegación, composición de pantallas, estado de interacción y accesibilidad | Resolver de forma improvisada problemas simbólicos |
| PixiJS, Zona 1 | Dibujar nodos y conexiones y comunicar acciones de interacción a React | Ser la fuente de verdad de las reglas de existencia/unicidad |
| Mafs, Zonas 2–5 | Dibujar gráficas y controles matemáticos y comunicar valores de interacción a React | Decidir por muestreo visual que una afirmación algebraica es verdadera |
| Servicios del cliente | Comunicar con FastAPI, adaptar DTO y exponer estados de carga/error | Mezclar transporte HTTP con componentes de presentación |
| Progreso local | Guardar y recuperar progreso del navegador en LocalStorage | Guardar credenciales o asumir sincronización entre dispositivos |
| FastAPI | Exponer el contrato HTTP, validar modelos y coordinar servicios | Confiar en datos del cliente como prueba de corrección |
| Servicio matemático | Aplicar validadores acotados del banco y usar SymPy para las comprobaciones simbólicas soportadas | Aceptar y ejecutar código o expresiones Python arbitrarias del cliente |
| Modo estático | Permitir que el banco cerrado funcione sin API mediante validadores/respuestas precalculados verificados | Afirmar que una API desconectada fue utilizada o reemplazar SymPy con una malla numérica |

La respuesta del backend puede ser `correct`, `incorrect` o `indeterminate`. `indeterminate` no debe mostrarse como incorrecta; la interfaz debe ofrecer una explicación y, cuando proceda, reintento o modo alternativo.

## 5. Organización y calidad

- Aplicar la [Estructura definitiva](./estructura-proyecto.md). No crear una segunda ubicación para la misma responsabilidad.
- Mantener secretos y configuración de despliegue fuera del código; usar variables de entorno y documentar solo nombres y valores de ejemplo no sensibles.
- Mantener los componentes visuales accesibles: controles operables por teclado cuando corresponda, etiquetas legibles y estado no expresado únicamente por color.
- No usar `console.log`, `print` ni trazas temporales para diagnóstico en la versión publicada. Los registros del servidor no deben incluir respuestas completas ni datos sensibles.
- Toda modificación de la API debe cumplir el [Contrato de API](./contrato-api.md) y la [Política de versiones](./politica-versiones.md).

## 6. Pruebas y revisión de cambios

Cada cambio debe incluir pruebas proporcionales al riesgo:

- **Dominio y validadores:** casos correctos, incorrectos, límites y casos indeterminados; comparar con resultados matemáticos revisados.
- **React y visualizaciones:** estados de interacción relevantes, errores y navegación; probar por separado las zonas PixiJS y Mafs.
- **Persistencia:** lectura, escritura, datos ausentes, JSON inválido y versión de esquema no reconocida.
- **API:** contrato de entrada/salida, códigos HTTP, límites y respuestas de error.
- **Integración:** confirmar el comportamiento en modo conectado y, cuando el cambio afecte al fallback, en Modo estático.

Antes de integrar un cambio, quien lo revisa debe comprobar que:

1. el propósito y el comportamiento esperado están descritos;
2. se mantiene la separación de responsabilidades y la convención de nombres;
3. las pruebas pertinentes pasan y las nuevas reglas tienen casos de referencia;
4. no se introducen secretos, dependencias o cambios incompatibles no documentados;
5. la documentación directamente afectada se actualiza.

Los cambios que afectan a validación matemática requieren revisión de otra persona distinta de quien implementó la regla. No se debe aprobar una respuesta matemática únicamente porque la animación o la gráfica parece correcta.

## 7. Herramientas y supuestos por confirmar

**Suposición de publicación:** el equipo adoptará formato y análisis automatizados para TypeScript y Python, además de pruebas en integración continua. Las herramientas y versiones exactas (por ejemplo, formateador, linter, verificador de tipos y runner de pruebas) no constan como decisión confirmada; deben fijarse en los manifiestos del proyecto y ejecutarse automáticamente antes de exigirlas como control de integración. Hasta entonces, esta guía define el resultado esperado, no comandos concretos.
