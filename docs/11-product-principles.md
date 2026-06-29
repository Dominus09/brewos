# 11 — Principios de producto

Principios oficiales de BrewOS. Guían decisiones de producto, diseño, desarrollo y operación. Son obligatorios: ninguna funcionalidad ni excepción técnica debe contradecirlos sin un ADR que lo justifique.

**Documentos relacionados:** [08 — Reglas de desarrollo](08-development-rules.md) · [10 — Mapa de navegación](10-navigation-map.md) · [12 — Dominio de Recursos](12-resource-domain.md) · [decisions/](decisions/)

---

## 1. Todo dato existe en un solo lugar

Cada pieza de información tiene una **fuente única de verdad**. Si un dato puede derivarse de otro, se deriva — no se duplica.

| Ejemplo correcto | Ejemplo incorrecto |
|------------------|-------------------|
| Nombre del insumo solo en Recursos | Copiar el nombre en cada receta y lote |
| Costo promedio calculado desde movimientos | Campo de costo desincronizado en varias tablas |

**Por qué importa:** Evita inconsistencias, simplifica mantenimiento y garantiza que reportes y trazabilidad sean confiables.

---

## 2. Recursos antes que Inventario

Ningún recurso tiene stock sin existir primero en **Recursos**. El flujo obligatorio es: crear recurso → mover stock.

Ver [ADR-0002](decisions/ADR-0002-catalog-before-inventory.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md).

---

## 3. Inventario registra movimientos, no crea recursos

El módulo **Inventario** solo registra entradas, salidas y ajustes. No define materiales, categorías ni proveedores — eso pertenece a **Recursos**.

---

## 4. Las recetas usan recursos existentes

Todo ingrediente de una receta referencia un recurso de **Recursos**. No existen ingredientes «libres» sin vínculo. Esto habilita costos estimados actualizables y trazabilidad coherente.

---

## 5. Las recetas tienen versiones

Una receta evoluciona en el tiempo. Cada formulación publicada es una **versión** numerada. Las versiones anteriores permanecen consultables; no se sobrescriben en silencio.

---

## 6. Producción congela la versión de receta usada

Al crear un lote, se vincula una `recipe_version` específica. Esa versión **no cambia** aunque la receta evolucione después. Lo producido ayer debe explicarse con las reglas de ayer.

---

## 7. Todo lote debe ser trazable

Si un evento relevante no está registrado en **Trazabilidad**, no ocurrió para efectos del sistema. Consumos, observaciones, fotos y documentos forman parte del historial del lote.

---

## 8. Todo costo debe poder explicarse

Todo costo mostrado en el sistema debe poder **desglosarse** hasta su origen: compra, movimiento de inventario, recurso en Recursos, versión de receta. Sin cifras mágicas ni agregados opacos.

---

## 9. Todo aprendizaje debe documentarse

Experimentos, errores, aciertos y decisiones del proyecto viven en **Laboratorio** (bitácora, aprendizajes, investigación). El conocimiento no debe quedar solo en la memoria del operador.

Ver [ADR-0004](decisions/ADR-0004-laboratory-module.md).

---

## 10. El sistema debe funcionar en PC, tablet y celular

Toda pantalla y flujo se diseña y prueba en escritorio, tablet y móvil. No se entregan vistas «solo desktop» con promesa de adaptar después.

---

## 11. Primero simple, luego automatizable

Prioridad: flujos manuales completos y usables por uno o pocos operadores. La automatización (consumos automáticos, sensores, alertas inteligentes) viene después de que la base manual funcione bien.

---

## 12. Los sensores son una fuente de datos, no el centro del sistema

**BrewNode** (ESP32) ampliará capacidades en el futuro, pero BrewOS debe operar al 100 % con entrada manual. Los sensores alimentan datos; no definen la arquitectura ni bloquean módulos base.

---

## 13. La interfaz es en español

Toda la experiencia de usuario — menús, mensajes, etiquetas, errores, documentación en app — está en **español**. El equipo opera en Chile; el software habla su idioma.

Ver [ADR-0001](decisions/ADR-0001-interface-language.md).

---

## 14. El código y la base de datos serán en inglés

Identificadores técnicos — tablas, columnas, endpoints, variables, commits de esquema — en **inglés**. Separa la capa humana (español) de la capa técnica (inglés estándar de la industria).

Ver [ADR-0001](decisions/ADR-0001-interface-language.md).

---

## 15. El software acompaña al productor, no lo reemplaza

BrewOS registra, ordena y explica. No automatiza decisiones artesanales ni impone procesos rígidos de fábrica. El operador siempre puede registrar manualmente, corregir y documentar. La herramienta se adapta al oficio, no al revés.

---

## 16. Todo nace como Recurso

Todo elemento físico, biológico, técnico o comercial de la operación se registra primero como **Recurso**. No hay tablas maestras paralelas por familia (insumos, equipos, envases por separado).

Ver [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md) · [12 — Dominio de Recursos](12-resource-domain.md).

---

## 17. Un recurso tiene naturaleza múltiple por flags

Un recurso puede ser — según su tipo y configuración — **consumible**, **inventariable**, **cultivable**, **vendible** o **equipamiento**. No son categorías excluyentes en todos los casos, pero el **tipo** define los defaults y las validaciones.

---

## 18. El tipo de recurso define su comportamiento

La taxonomía (`resource_types`, `resource_subtypes`) determina qué campos son obligatorios, qué módulos participan y qué acciones están permitidas. Ver [13 — Taxonomía](13-resource-taxonomy.md).

---

## 19. La trazabilidad comienza en Recursos

Toda cadena de trazabilidad se resuelve hasta un `resource_id` identificable: qué insumo, qué botánico, qué envase, qué producto. Sin recurso maestro no hay trazabilidad confiable.

---

## 20. Los costos deben rastrearse hasta el recurso original

Todo costo de lote, receta o reporte debe poder explicarse hasta el recurso y su costo de compra, promedio o valor estimado en `resource_costs` / movimientos de inventario.

---

## Jerarquía de principios

En caso de conflicto aparente, aplicar en este orden:

1. Integridad de datos (principios 1, 2, 3, 6, 7, 8, 16, 19, 20)
2. Operabilidad manual (principios 11, 12, 15)
3. Experiencia de usuario (principios 10, 13)
4. Escalabilidad técnica (principio 14)

---

## Uso en el equipo

| Momento | Acción |
|---------|--------|
| Diseño de feature | Verificar que respeta principios 1–8 y 16–20 |
| Code review | Rechazar duplicación de datos y atajos que salten Recursos |
| Sprint planning | Ordenar módulos según dependencias (Recursos → Inventario → …) |
| ADR nuevo | Referenciar principio(s) afectados |

---

*Documento v1.1 — Principios de producto BrewOS / Insular Origins*
