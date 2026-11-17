# Cuestionario para cerrar la Constitución (v0.2.0 → v0.3.0)

**Proyecto:** FUNctions  
**Documento de referencia:** `.specify/memory/constitution.md` (versión 0.2.0, sin ratificar)  
**Objetivo:** obtener las decisiones que faltan para corregir los hallazgos del diagnóstico y poder ratificar la Constitución.  
**Elaborado:** 15/11/2026  
**Respuestas revisadas:** 15/11/2026

---

## Cómo usar este cuestionario

- Tiempo estimado: 30–40 minutos.
- Puede responderse en equipo, pero **una sola persona debe consolidar** las respuestas.
- Responder con la letra de la opción y, si hace falta, una frase de aclaración.
- Si no hay decisión, escribir **N/S** (no sé). No se completará por inferencia.
- La opción marcada con ⭐ es la recomendada; no es obligatoria.
- Al final hay una plantilla para devolver solo las respuestas.

**No se pregunta por decisiones ya cerradas:** nombre *FUNctions*, licencia MIT, público de bachillerato, 15 ejercicios en 5 zonas, componentes del stack (React, PixiJS, Mafs, FastAPI, SymPy, LocalStorage) y fecha de entrega del 17/11/2026. Esas no se reabren aquí.

---

## Bloque 0 — Identificación

| Campo | Respuesta |
|---|---|
| Nombre de quien responde | Edwin Pérez|
| Rol en el equipo | Scrum Master, Developer, Product Owner |
| Fecha | 15/11/2026 |
| ¿Representa al equipo? | Sí |
| ¿Tiene autoridad para aprobar? | Sí |

---

## Bloque A — Gobernanza y aprobación

**Q1. ¿Quién es el Aprobador único de cada etapa?** *(Hallazgo H1)*
- **A.** El coordinador del equipo (Edwin), con un suplente designado (Danny)

*Consecuencia:* sin un nombre, no se puede saber cuándo una etapa está aprobada.

**Q2. Si el Aprobador no responde, ¿qué pasa?** *(H1, M4)*
- **B.** Puede aprobar el suplente.


**Q3. Si se usa la figura «aprobación del equipo», ¿qué significa exactamente?** *(H1)*
- **A.** Confirmación por coordinador.

**Q4. ¿Dónde se registra una aprobación?** *(H2, M2)*
- **A.** En `specs/README.md` y en un bloque `## Aprobaciones` dentro del artefacto. ⭐

**Q5. ¿Qué campos mínimos debe tener el registro?** *(M2)* — marcar todos los que apliquen.
- [x] Etapa aprobada
- [x] Veredicto (aprobado / rechazado / en revisión)
- [x] Fecha en formato `YYYY-MM-DD`
- [x] Quién autorizó (nombre y rol)
- [x] Enlace a la evidencia (commit, mensaje, acta)
- [x] Versión del artefacto aprobado
- [x] Comentarios o condiciones

**Q6. ¿Quién puede aprobar una excepción a la Constitución y por cuánto tiempo?** *(M3)*
- **A.** El Aprobador, con caducidad al cerrar la etapa. ⭐

**Q7. ¿La Constitución está por encima de las instrucciones del equipo?** *(H8)*
- **A.** Sí: las instrucciones se aplican dentro de la Constitución y solo se cambia por enmienda. ⭐

**Q8. Las decisiones ya tomadas (nombre, licencia, stack…), ¿dónde están registradas oficialmente?** *(H9)*
- **A.** En `docs/respuestas.csv` y `docs/conclusión_de_respuestas.md`. ⭐

**Q9. ¿Cuándo se ratifica la Constitución y quién firma?** *(M4)*
- **A.** Antes del 16/11/2026, con el Aprobador definido en Q1. ⭐


---

## Bloque B — Estado y versión del documento

**Q10. ¿El Principio VII (control humano) ya obliga o solo después de ratificar?** *(H7)*
- **A.** Obliga desde la ratificación de la versión 0.2.0; antes de esa ratificación continúa como propuesta.

**Q11. ¿Qué versión debe figurar como actual?** *(H7)*
- **A.** 0.2.0; el Principio VII se marca como «vigente» únicamente desde la ratificación de esa versión.

**Q12. ¿Qué hacemos con la instalación existente de Spec Kit?** *(H10)*
- **A.** Se considera autorizada; solo se actualiza con aprobación expresa. ⭐

**Q13. ¿Qué hacemos con `docs/constitution_draft.md`?** *(H3)*
- **A.** Mantenerlo como borrador de trabajo no normativo para preparar enmiendas. No es fuente de reglas vigentes ni debe sustituir la Constitución canónica.

La única fuente de verdad es `development/.specify/memory/constitution.md`.


---

## Bloque C — Alineación con Specify

**Q14. ¿Dónde vive la Constitución canónica?** *(H3)*
- **A.** Solo en `.specify/memory/constitution.md`, porque es la ruta que leen los comandos. ⭐

**Q15. ¿El plan debe generar todos los artefactos de la plantilla?** *(H4)*
- **A.** Sí: `research.md`, `data-model.md`, `quickstart.md` y `contracts/`. ⭐

**Q16. ¿Qué identificadores usamos para requisitos y criterios?** *(H5)*
- **A.** `REQ-01` y `AC-01`, como la spec actual, declarando la equivalencia con `FR`/`SC`. ⭐

**Q17. ¿Qué hacemos con la spec `001-nucleo-validacion`?** *(H5)*
- **B.** Se migra al formato de la plantilla (`Feature Branch`, `Created`, `User Scenarios`, `Success Criteria`).

**Q18. ¿Confirmamos la numeración de specs?** *(H2)*
- **A.** `001` = núcleo de validación; `002` = primer recorrido E01/E08. ⭐

**Q19. ¿Qué pruebas son obligatorias?** *(H6)* — marcar todas.
- [ ] Validadores matemáticos
- [ ] Contratos de API
- [ ] Persistencia / LocalStorage
- [x] Componentes y flujos de interfaz: pruebas manuales documentadas
- [ ] Ninguna; basta una revisión manual sin evidencia

**Decisión:** solo se han declarado obligatorias las pruebas manuales documentadas para la UI. No se infieren pruebas automatizadas obligatorias para validadores, contratos o persistencia a partir de esta respuesta.

**Q20. ¿Qué comandos de Specify son obligatorios?** *(M5)* — marcar todos.
- [x] `clarify` si quedan `NEEDS CLARIFICATION`
- [x] `analyze` antes de implementar
- [x] `checklist` como revisión de calidad
- [ ] `converge`
- [ ] Ninguno adicional; basta el flujo de cuatro etapas

**Q21. Si `analyze` encuentra un hallazgo `CRITICAL`, ¿bloquea la implementación?** *(M5)*
- **A.** Sí, hasta corregirlo o registrar una excepción aprobada. ⭐

**Q22. ¿Qué instalaciones habilita la aprobación de la etapa de implementación?** *(M11)*
- **A.** Solo las enumeradas y aprobadas en el plan. ⭐

**Q23. ¿Qué política de ramas y commits adoptamos?** *(L4)*
- **A.** Una rama por spec, llamada según el identificador y nombre de la spec (`NNN-nombre`). La política concreta de commits permanece pendiente.

---

## Bloque D — Producto, contenido y alcance

**Q24. ¿Qué hacemos con la meta del 80% de participantes?** *(M6)*
- **B.** Se retira del documento.

**Q25. ¿Qué métricas sí pueden usarse como criterios de éxito de una spec?** *(M6)* — marcar todas.
- [x] Latencia de validación
- [x] Precisión de los validadores (casos correctos/incorrectos)
- [x] Accesibilidad (teclado, etiquetas)
- [x] Tasa de error de formato
- [ ] Cobertura de pruebas
- [ ] Otra: __________

**Q26. ¿Añadimos un principio de accesibilidad?** *(M10)*
- **C.** No; basta con lo que diga cada spec.


**Q27. ¿Qué idioma tendrá la interfaz y la documentación?** *(M10)*
- **A.** Español únicamente. ⭐

**Q28. ¿Qué política de privacidad adoptamos?** *(M10)*
- **A.** Sin datos personales ni analítica externa. ⭐

**Q29. ¿Qué navegadores y dispositivos son objetivo?** *(M10)*
- **A.** Navegadores

**Q30. ¿Dónde se define la gramática de respuestas exactas y qué pasa si falta?** *(M9)*
- **A.** La gramática base compartida se define en `contracts/` de la spec del núcleo. Las restricciones particulares pueden definirse en la spec consumidora correspondiente.


**Q31. ¿Aplicamos el Glosario de forma estricta?** *(M7)*
- **A.** Usar de forma consistente «Zona», «Ejercicio», «Modo estático» y «Backend». El Glosario sirve como referencia de redacción, pero no es una política normativa por sí mismo; las obligaciones deben constar en la Constitución o en una spec aprobada.

---

## Bloque E — Redacción y mantenimiento

**Q32. ¿Un solo documento o Constitución + políticas separadas?** *(M8)*
- **A.** La Constitución es la autoridad normativa de la metodología. Los documentos de `development/docs/politicas/` son referencias técnicas no oficiales y no crean obligaciones por sí mismos.

**Q33. ¿Adoptamos palabras normativas tipo RFC 2119?** *(L3)*
- **A.** Sí: DEBE / DEBERÍA / PUEDE. ⭐

**Q34. ¿Cómo manejamos enlaces y pie de página?** *(L1, L5)*
- **A.** Enlaces relativos verificados. Mientras no ocurra la ratificación se mostrará `Ratified: pendiente`; después se registrará la fecha real, sin conservar el marcador `TODO`.

**Q35. ¿Cuándo se revisa la Constitución?** *(M8)*
- **C.** Solo cuando se proponga una enmienda.

---

## Respuestas
Las respuestas han sido seleccionadas en el documento entero y revisadas con las aclaraciones posteriores del responsable.

### Decisiones aclaratorias posteriores

| ID | Decisión consolidada |
|---|---|
| R1 | El registro de aprobación incluye quién autorizó, con nombre y rol. |
| R2 | Las pruebas manuales documentadas son obligatorias para la UI; no se infieren otras pruebas obligatorias. |
| R3 | Las políticas de `development/docs/politicas/` son referencias no oficiales; la autoridad normativa reside en la Constitución y las specs aprobadas. |
| R4 | La gramática base compartida se define en `contracts/` de la spec del núcleo. |
| R5 | El Principio VII obliga desde la ratificación de la versión 0.2.0. |
| R6 | `docs/constitution_draft.md` se conserva como borrador no normativo; la única fuente de verdad es `development/.specify/memory/constitution.md`. |
| R7 | Se utilizará una rama por spec, nombrada según la spec. |
| R8 | Los enlaces serán relativos y se verificarán. |

---

## Trazabilidad con el diagnóstico

| Bloque | Preguntas | Hallazgos que resuelve |
|---|---|---|
| A — Gobernanza | Q1–Q9 | H1, H2, H8, H9, M2, M3, M4 |
| B — Estado y versión | Q10–Q13 | H3, H7, H10 |
| C — Alineación Specify | Q14–Q23 | H4, H5, H6, M1, M5, M11, L4 |
| D — Producto y alcance | Q24–Q31 | M6, M7, M9, M10 |
| E — Redacción | Q32–Q35 | M8, L1, L3, L5 |

---

## Próximos pasos después de responder

1. Redactar la **enmienda 0.3.0** con los cambios exactos, sin tocar lo que no se haya decidido.
2. Actualizar `specs/README.md` y los enlaces rotos.
3. Generar una lista de verificación para comprobar que la Constitución corregida sigue el flujo de Specify.
