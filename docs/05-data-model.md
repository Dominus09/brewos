# 05 — Modelo de datos

Modelo conceptual de BrewOS. **No incluye migraciones ni SQL** — define entidades, relaciones y propósito de cada tabla para guiar el diseño de la base de datos.

**Entidad central:** `resources` — ver [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md) · [12 — Dominio de Recursos](12-resource-domain.md)

---

## Diagrama conceptual simplificado

```
users ── roles
  │
  ├── inventory_movements ──► resources ◄── resource_costs
  ├── batches ── batch_steps          ◄── resource_documents
  │       └── traceability_events     ◄── recipe_items
  ├── harvests                        ◄── recipe_versions ◄── recipes
  ├── documents
  └── journal_entries

resources ── resource_types
    ├── resource_subtypes
    ├── resource_categories
    ├── resource_tags (via resource_tag_links)
    ├── units
    ├── suppliers (via resource_suppliers)
    ├── inventory_movements
    ├── recipe_items
    └── traceability_events

botanical_species ── botanical_plants ── harvests ──► resources (botánicos)
```

---

## Núcleo: Recursos

### `resources`

Entidad central del sistema. Todo insumo, botánico, envase, equipamiento, herramienta, producto terminado, servicio y componente es un recurso.

| Grupo de campos | Ejemplos conceptuales |
|-----------------|----------------------|
| Identidad | `name`, `internal_code`, `description`, `notes` |
| Clasificación | `resource_type_id`, `resource_subtype_id`, `resource_category_id` |
| Medida | `unit_id` |
| Comportamiento | `is_inventoriable`, `is_consumable`, `is_cultivable`, `is_equipment`, `is_sellable`, `is_traceable` |
| Trazabilidad / cumplimiento | `requires_lot`, `requires_expiry`, `requires_tech_sheet`, `requires_safety_sheet` |
| Inventario | `min_stock` (si inventariable) |
| Estado | `status` (draft, active, inactive, archived) |
| Estado extendido | `equipment_status`, `finished_product_status` (según tipo) |

**Para qué sirve:** Fuente única de verdad para cualquier elemento usado en inventario, recetas, producción, trazabilidad y reportes.

**Relaciones:** Ver tablas satélite abajo.

---

### `resource_types`

Tipos principales fijos de la taxonomía.

| Valores (conceptuales) |
|------------------------|
| supply, botanical, container, equipment, tool, finished_product, service, cleaning_material, packaging_material, electronic_component |

**Para qué sirve:** Define comportamiento por defecto y subtipos válidos. Administrado por el sistema, no libre.

---

### `resource_subtypes`

Subtipos dentro de cada tipo (ej. Insumo → Alcohol; Botánico → Cultivado).

| Campos conceptuales |
|---------------------|
| `resource_type_id`, `code`, `name`, `default_flags` (JSON o columnas) |

**Para qué sirve:** Granularidad de clasificación y defaults de validación en UI.

---

### `resource_categories`

Jerarquía libre de categorías operativas (ej. Destilados → Botánicos chilotes).

| Campos conceptuales |
|---------------------|
| `name`, `parent_id`, `description` |

**Para qué sirve:** Organización, filtros y reportes independientes del tipo.

---

### `resource_tags`

Etiquetas transversales para búsqueda y agrupación (ej. `orgánico`, `experimental`, `prioridad-alta`).

| Campos conceptuales |
|---------------------|
| `name`, `color` (opcional) |

**Para qué sirve:** Clasificación flexible sin alterar taxonomía formal.

---

### `resource_tag_links`

Tabla de unión muchos-a-muchos entre `resources` y `resource_tags`.

**Para qué sirve:** Asignar múltiples etiquetas a un recurso.

---

### `units`

Unidades de medida (kg, L, g, unidad, %).

**Para qué sirve:** Estandarizar cantidades en recursos, inventario y recetas.

---

### `suppliers`

Proveedores de recursos.

| Campos conceptuales |
|---------------------|
| `name`, `contact`, `notes`, `status` |

**Para qué sirve:** Trazabilidad de origen de compras y análisis de costos por proveedor.

---

### `resource_suppliers`

Relación muchos-a-muchos: un recurso puede tener varios proveedores; un proveedor suministra muchos recursos.

| Campos conceptuales |
|---------------------|
| `resource_id`, `supplier_id`, `is_primary`, `supplier_code`, `last_purchase_price` |

**Para qué sirve:** Proveedor principal vs alternativos; historial de referencia de compra.

---

### `resource_costs`

Historial y referencias de costo por recurso.

| Campos conceptuales |
|---------------------|
| `resource_id`, `cost_type` (purchase, average, estimated), `amount`, `currency`, `valid_from`, `source` |

**Para qué sirve:** Separar costo de compra, promedio calculado y valor estimado sin duplicar en `resources`. El promedio puede derivarse de inventario y sincronizarse aquí.

---

### `resource_documents`

Documentos adjuntos a un recurso: ficha técnica, ficha de seguridad, certificados.

| Campos conceptuales |
|---------------------|
| `resource_id`, `document_type`, `title`, `file_ref` o FK a `documents`, `uploaded_at` |

**Para qué sirve:** Cumplimiento (`requires_tech_sheet`, `requires_safety_sheet`) y consulta desde Recursos o Laboratorio.

---

## Inventario y producción

### `inventory_movements`

Movimientos de stock: entradas, salidas y ajustes.

| Campos conceptuales |
|---------------------|
| `resource_id` |
| `movement_type` (in, out, adjustment) |
| `quantity`, `unit_cost` (en entradas) |
| `lot_code`, `expiry_date` (si aplica) |
| `reference_type`, `reference_id` (batch, purchase, harvest) |
| `stock_status` (available, reserved, consumed, waste, expired) |
| `user_id`, `created_at` |

**Para qué sirve:** Historial de stock, costo promedio y alertas. Nunca crea recursos.

---

### `recipes`

Receta base (nombre, tipo de producto, descripción).

**Para qué sirve:** Agrupar versiones bajo un identificador estable. Puede vincularse a recurso `finished_product`.

---

### `recipe_versions`

Versiones numeradas de una receta.

| Campos conceptuales |
|---------------------|
| `recipe_id`, `version_number`, `expected_yield`, `estimated_cost`, `status` |

**Para qué sirve:** Evolución controlada; producción congela la versión usada.

---

### `recipe_items`

Ingredientes: recurso + cantidad + unidad.

**Para qué sirve:** Composición y cálculo de costos estimados. Solo recursos `consumible`.

---

### `batches`

Lote de producción.

| Relaciones |
|------------|
| `recipe_version_id` congelada |
| `batch_steps`, `traceability_events` |
| Output opcional: `finished_product_resource_id` |

**Para qué sirve:** Unidad central de producción.

---

### `batch_steps`

Etapas del proceso de un lote.

**Para qué sirve:** Flujo temporal y datos manuales del proceso.

---

### `traceability_events`

Eventos por lote: consumo, observación, foto, documento, uso de equipo.

**Para qué sirve:** Historial inmutable. Referencia `resource_id` en consumos.

---

## Jardín botánico

### `botanical_species`

Catálogo de especies (nombre científico, común, notas).

**Para qué sirve:** Identificar qué se cultiva. Puede vincular a recurso botánico maestro.

---

### `botanical_plants`

Plantas o grupos en una ubicación.

| Campos conceptuales |
|---------------------|
| `species_id`, `resource_id` (botánico cultivable), `location`, `planted_at`, `cultivation_status` |

**Para qué sirve:** Seguimiento fino y origen de cosechas.

---

### `harvests`

Cosechas vinculadas a plantas y opcionalmente a lotes.

**Para qué sirve:** Puente Jardín → Inventario → Producción → Trazabilidad.

---

## Usuarios y documentación

### `users` / `roles`

Autenticación y permisos por módulo.

---

### `documents`

Archivos generales del Laboratorio y adjuntos transversales.

---

### `journal_entries`

Bitácora del proyecto en Laboratorio.

---

## Reglas del modelo

1. **Todo elemento operativo es un `resource`** antes de inventario, recetas o producción
2. `inventory_movements` nunca crea recursos; solo referencia `resource_id`
3. `recipe_items` solo referencian recursos con `is_consumable = true`
4. Un `batch` congela `recipe_version` al crearse
5. `resource_costs` centraliza costos; promedio derivado de movimientos
6. Recursos `archived` no aparecen en nuevas recetas ni movimientos
7. `harvests` pueden generar entrada de inventario del recurso botánico vinculado
8. `resource_documents` satisface requisitos de ficha técnica y seguridad

---

## Próximo paso

Traducir este modelo a esquema PostgreSQL con migraciones en `database/` cuando inicie Sprint 3 (Recursos).

**Referencias:** [13 — Taxonomía](13-resource-taxonomy.md) · [14 — Ciclo de vida](14-resource-lifecycle.md)
