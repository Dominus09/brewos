# ADR-0005: Recurso como entidad central

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principios 16–20](../11-product-principles.md) |

---

## Contexto

BrewOS gestiona insumos, botánicos, envases, equipamiento, herramientas, productos terminados, servicios, materiales de limpieza, packaging y componentes electrónicos. Una decisión de modelado temprana es si cada familia vive en una entidad separada (`supplies`, `equipment`, `bottles`, `botanicals`, `products`) o si comparten una entidad unificada con taxonomía.

Sin esta decisión, el riesgo es duplicar modelos, APIs y pantallas; romper trazabilidad; y dificultar reportes de costos consolidados.

---

## Decisión

1. **Recurso (`resources`) será la entidad central de BrewOS** para todo elemento físico, biológico, técnico o comercial del dominio operativo.

2. La diferenciación no se hace por tabla separada sino por:
   - `resource_types` y `resource_subtypes`
   - flags de comportamiento (`inventariable`, `consumible`, `cultivable`, etc.)
   - validaciones y formularios adaptados al tipo

3. El módulo de navegación principal se llama **Recursos** (reemplaza «Catálogo» en UI). Ver [10 — Mapa de navegación](../10-navigation-map.md).

4. Las entidades de Jardín Botánico (`botanical_plants`, `harvests`) **complementan** recursos cultivables; no los reemplazan.

---

## Por qué no separar en entidades aisladas desde el inicio

| Entidad separada | Problema |
|------------------|----------|
| `supplies` + `equipment` + `bottles` | Mismo alcohol en insumo y en «limpieza» duplicado |
| `botanicals` aparte de `resources` | Cosecha no conecta con receta sin mapeo artificial |
| `products` aparte | Producto terminado no comparte costos ni trazabilidad con insumos |
| `services` aislado | Misma infraestructura de código sin beneficio claro |

Un operador artesanal piensa: «¿qué tengo, qué uso, qué me costó?» — no en tablas de base de datos distintas.

---

## Beneficios

| Beneficio | Explicación |
|-----------|-------------|
| **Evita duplicidad** | Un solo registro por elemento real |
| **Facilita inventario** | Un modelo de movimientos para todo lo inventariable |
| **Facilita costos** | Costo rastreable hasta `resource_id` |
| **Facilita recetas** | Ingredientes siempre referencian la misma entidad |
| **Facilita trazabilidad** | Historial unificado de «qué recurso» en cada lote |
| **Permite crecimiento futuro** | Nuevos tipos (merchandising, experiencias) sin nueva tabla maestra |
| **API coherente** | `/api/v1/resources` como contrato principal |

---

## Consecuencias

| Área | Consecuencia |
|------|--------------|
| Base de datos | Tabla `resources` amplia; tablas de taxonomía y costos satélite |
| Backend | Servicio de recursos con validación por tipo; no micro-CRUDs por familia |
| Frontend | Módulo Recursos con submenús por tipo; formularios dinámicos |
| Inventario | FK única `resource_id` |
| Recetas | FK única en `recipe_items` |
| Reportes | Agregación simple por `resource_type` |
| Onboarding | Curva de aprendizaje: entender «Recurso» como concepto paraguas |

---

## Riesgos

| Riesgo | Descripción |
|--------|-------------|
| Modelo demasiado genérico | Tabla `resources` con muchos campos NULL según tipo |
| Usuarios no entienden «Recurso» | Término abstracto frente a «insumo» o «botella» |
| Formularios sobrecargados | Mostrar todos los campos a todos los tipos |
| Validación débil | Mezclar comportamientos incompatibles (equipo consumible) |

---

## Mitigación

| Riesgo | Mitigación |
|--------|------------|
| Modelo genérico | Campos comunes en `resources`; extensiones en tablas satélite si necesario; flags en lugar de columnas raras |
| Término «Recurso» | Submenús por tipo visibles (Insumos, Botánicos, Envases…); usuario rara vez crea desde «Todos» sin tipo |
| Formularios | UI adaptada al tipo: mostrar/ocultar campos según taxonomía ([13 — Taxonomía](../13-resource-taxonomy.md)) |
| Validación | Reglas por tipo en backend; defaults de flags; tests de combinaciones prohibidas |

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Tabla por familia (5–10 tablas) | Duplicación, joins complejos, trazabilidad fragmentada |
| Solo «Insumos» como base | No cubre equipamiento, servicios ni producto terminado |
| Catálogo sin entidad nombrada Recurso | Mismo modelo pero peor alineación concepto ↔ código (`resources`) |
| EAV (entidad-atributo-valor) puro | Complejidad excesiva para etapa artesanal inicial |

---

## Relación con ADR-0002

[ADR-0002](ADR-0002-catalog-before-inventory.md) establece que el maestro de recursos se desarrolla antes que Inventario. Con ADR-0005, ese maestro es explícitamente la entidad **Recurso** y el módulo **Recursos**. El principio se mantiene; solo se unifica nomenclatura.

---

## Referencias

- [12 — Dominio de Recursos](../12-resource-domain.md)
- [13 — Taxonomía de Recursos](../13-resource-taxonomy.md)
- [14 — Ciclo de vida](../14-resource-lifecycle.md)
- [05 — Modelo de datos](../05-data-model.md)
