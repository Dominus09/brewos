# 05 — Modelo de datos

Modelo conceptual de BrewOS. **No incluye migraciones ni SQL** — define entidades, relaciones y propósito de cada tabla para guiar el diseño de la base de datos.

**Entidad central:** `resources` — ver [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md) · [12 — Dominio de Recursos](12-resource-domain.md)

**Configuración dinámica:** taxonomía, formularios, procesos y estados administrables — ver [ADR-0006](decisions/ADR-0006-dynamic-production-configuration.md) · [16 — Administración de Producción](16-production-administration.md)

---

## Diagrama conceptual simplificado

```
business_lines
    │
    ├── resource_types ── resource_subtypes
    │       └── resource_categories
    │
    ├── dynamic_forms ── dynamic_form_versions ── dynamic_form_fields
    │       └── dynamic_properties (definiciones)
    │
    ├── production_processes ── production_process_steps
    ├── configurable_states
    └── industry_templates

resources ◄── resource_types, resource_subtypes, resource_categories, units
    ├── resource_suppliers ── suppliers
    ├── resource_costs
    ├── resource_documents
    ├── resource_photos
    ├── resource_tag_links ── resource_tags
    └── (valores dinámicos vía EAV futuro)

users ── roles
  ├── inventory_movements ──► resources
  ├── batches ── batch_steps
  ├── harvests
  └── documents
```

---

## Configuración de negocio

### `business_lines`

Líneas de negocio o industrias operadas en la organización (ej. Destilería, Cervecería, Cosmética).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `is_active`, `settings` (JSONB) |

**Para qué sirve:** Segmentar taxonomía, formularios y procesos por industria sin tablas duplicadas. Un recurso puede asociarse a una línea para filtros y reglas.

---

### `industry_templates`

Plantillas exportables/importables de configuración completa para arrancar una nueva línea.

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `template_payload` (JSONB), `version`, `status` |

**Para qué sirve:** Acelerar onboarding de industrias (velas, turismo, conservas) aplicando tipos, unidades, formularios y procesos predefinidos desde la UI.

---

## Núcleo: Recursos

### `resources`

Entidad central del sistema. Todo insumo, botánico, envase, equipamiento, herramienta, producto terminado, servicio y componente es un recurso.

| Grupo de campos | Ejemplos conceptuales |
|-----------------|----------------------|
| Identidad | `name`, `internal_code`, `description`, `notes` |
| Clasificación | `resource_type_id`, `resource_subtype_id`, `resource_category_id`, `business_line_id` |
| Medida | `unit_id` |
| Comportamiento | `is_inventoriable`, `is_consumable`, `is_cultivable`, `is_equipment`, `is_sellable`, `is_traceable` |
| Trazabilidad / cumplimiento | `requires_lot`, `requires_expiry`, `requires_tech_sheet`, `requires_safety_sheet` |
| Inventario | `min_stock` (si inventariable) |
| Estado | `status` (referencia `configurable_states` o código estable) |
| Formulario | `dynamic_form_version_id` (esquema congelado al crear) |

**Para qué sirve:** Fuente única de verdad para cualquier elemento usado en inventario, recetas, producción, trazabilidad y reportes.

**Relaciones:** Ver tablas satélite abajo.

---

### `resource_types`

Tipos principales de la taxonomía de recursos (ej. supply, botanical, equipment, finished_product).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `icon`, `color_token`, `sort_order` |
| `business_line_id` (opcional) |
| `default_flags` (JSONB: flags por defecto al crear recurso) |
| `code_prefix` (prefijo para `internal_code`) |
| `status`, `is_system` |

**Para qué sirve:** Define comportamiento por defecto, subtipos válidos y prefijos de código. Administrable desde Configuración (ADR-0006); el seed inicial solo arranca el catálogo base.

---

### `resource_subtypes`

Subtipos dentro de cada tipo (ej. Insumo → Alcohol; Botánico → Cultivado).

| Campos conceptuales |
|---------------------|
| `resource_type_id`, `code`, `name`, `description`, `default_flags` (JSONB), `sort_order`, `status` |

**Para qué sirve:** Granularidad de clasificación, defaults de validación en UI y condiciones de visibilidad en formularios dinámicos.

---

### `resource_categories`

Jerarquía libre de categorías operativas (ej. Destilados → Botánicos chilotes).

| Campos conceptuales |
|---------------------|
| `resource_type_id` (opcional), `parent_id`, `business_line_id` |
| `code`, `name`, `description`, `sort_order`, `status` |

**Para qué sirve:** Organización, filtros y reportes independientes del tipo formal.

---

### `resource_tags`

Etiquetas transversales para búsqueda y agrupación (ej. `orgánico`, `experimental`, `prioridad-alta`).

| Campos conceptuales |
|---------------------|
| `name`, `color` (opcional), `status` |

**Para qué sirve:** Clasificación flexible sin alterar taxonomía formal.

---

### `resource_tag_links`

Tabla de unión muchos-a-muchos entre `resources` y `resource_tags`.

| Campos conceptuales |
|---------------------|
| `resource_id`, `resource_tag_id` |

**Para qué sirve:** Asignar múltiples etiquetas a un recurso.

---

### `units`

Unidades de medida con soporte de conversión (unidad, g, kg, ml, L, %).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `symbol`, `unit_type` (mass, volume, count, …) |
| `is_base`, `base_unit_id`, `conversion_factor`, `decimal_places`, `status` |

**Para qué sirve:** Estandarizar cantidades en recursos, inventario y recetas; conversiones entre unidades derivadas.

---

### `suppliers`

Proveedores de recursos.

| Campos conceptuales |
|---------------------|
| `name`, `contact_email`, `contact_phone`, `notes`, `status` |

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

### `resource_photos`

Imágenes asociadas a un recurso (producto, equipo, botánico).

| Campos conceptuales |
|---------------------|
| `resource_id`, `title`, `file_ref`, `sort_order`, `is_primary`, `uploaded_at` |

**Para qué sirve:** Galería visual en ficha de recurso, trazabilidad y catálogo comercial.

---

## Configuración dinámica (ADR-0006)

### `dynamic_properties`

Definiciones de propiedades extensibles (catálogo EAV).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `data_type` (text, number, boolean, date, select, json) |
| `validation_rules` (JSONB), `options` (JSONB para select) |
| `applies_to` (resource, recipe_version, batch, …) |
| `business_line_id` (opcional), `status` |

**Para qué sirve:** Describir campos que no justifican columna fija en `resources`; reutilizables en múltiples formularios.

---

### `dynamic_forms`

Formularios dinámicos agrupadores (ej. «Ficha de insumo», «Alta de equipamiento»).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `applies_to`, `business_line_id`, `status` |

**Para qué sirve:** Contenedor lógico de versiones de esquema; vinculable a tipos de recurso o procesos.

---

### `dynamic_form_versions`

Versiones publicadas de un formulario.

| Campos conceptuales |
|---------------------|
| `dynamic_form_id`, `version_number`, `status` (draft, published, archived), `published_at` |

**Para qué sirve:** Versionado inmutable; recursos y lotes congelan la versión usada al crearse.

---

### `dynamic_form_fields`

Campos de una versión de formulario (layout + reglas).

| Campos conceptuales |
|---------------------|
| `dynamic_form_version_id`, `dynamic_property_id` |
| `section_key`, `sort_order`, `is_required`, `is_visible` |
| `visibility_condition` (JSONB), `default_value` (JSONB) |

**Para qué sirve:** Orden, agrupación UI, obligatoriedad y condiciones de visibilidad por subtipo o contexto.

---

### `production_processes`

Plantilla de cómo se elabora algo — independiente de una receta específica.

| Campos conceptuales |
|---------------------|
| `code`, `name`, `description`, `business_line_id` |
| `dynamic_form_id` (campos del proceso), `status` |

**Para qué sirve:** Definir destilación, fermentación, embotellado, taller, etc. como plantillas reutilizables.

---

### `production_process_steps`

Etapas ordenadas de un proceso productivo.

| Campos conceptuales |
|---------------------|
| `production_process_id`, `code`, `name`, `description`, `sort_order` |
| `step_type` (manual, timer, measurement, equipment_use, consumption, quality_check) |
| `dynamic_form_id`, `default_duration_minutes`, `equipment_type_ids` (JSONB), `is_optional` |

**Para qué sirve:** Flujo temporal configurable; al crear un lote se instancian `batch_steps` desde aquí.

---

### `configurable_states`

Estados administrables por dominio (reemplaza enums fijos de negocio).

| Campos conceptuales |
|---------------------|
| `code`, `name`, `state_group` (resource_global, inventory_stock, equipment, batch, recipe_version) |
| `semantic` (success, warning, neutral, danger), `is_initial`, `is_terminal` |
| `allowed_transitions` (JSONB), `business_line_id` (opcional), `status` |

**Para qué sirve:** Badges, flujos de aprobación y reglas de transición sin despliegue de código.

---

## Inventario y producción (futuro)

### `inventory_movements`

Movimientos de stock: entradas, salidas y ajustes.

| Campos conceptuales |
|---------------------|
| `resource_id`, `movement_type`, `quantity`, `unit_cost`, `lot_code`, `expiry_date` |
| `reference_type`, `reference_id`, `stock_status`, `user_id` |

**Para qué sirve:** Historial de stock, costo promedio y alertas. Nunca crea recursos.

---

### `recipes` / `recipe_versions` / `recipe_items`

Recetas versionadas con ingredientes que referencian `resources` consumibles.

**Para qué sirve:** Composición, costos estimados y congelación de versión en lotes.

---

### `batches` / `batch_steps` / `traceability_events`

Lotes de producción con etapas y trazabilidad inmutable.

**Para qué sirve:** Unidad central de producción; consume recursos y registra eventos.

---

## Jardín botánico (futuro)

### `botanical_species` / `botanical_plants` / `harvests`

Catálogo de especies, plantas en ubicación y cosechas vinculadas a recursos botánicos.

**Para qué sirve:** Puente Jardín → Inventario → Producción → Trazabilidad.

---

## Usuarios y documentación (futuro)

### `users` / `roles`

Autenticación y permisos por módulo.

### `documents` / `journal_entries`

Archivos del Laboratorio y bitácora del proyecto.

---

## Reglas del modelo

1. **Todo elemento operativo es un `resource`** antes de inventario, recetas o producción
2. `inventory_movements` nunca crea recursos; solo referencia `resource_id`
3. `recipe_items` solo referencian recursos con `is_consumable = true`
4. Un `batch` congela `recipe_version` al crearse
5. `resource_costs` centraliza costos; promedio derivado de movimientos
6. Recursos archivados no aparecen en nuevas recetas ni movimientos
7. Taxonomía y formularios viven en tablas de configuración (ADR-0006), no en enums de código
8. `dynamic_form_versions` publicadas son inmutables; cambios crean nueva versión
9. `internal_code` es identificador humano; `id` (UUID) es identificador de sistema

---

## Implementación por fases

| Fase | Tablas |
|------|--------|
| **Fase 1 (actual)** | `business_lines`, `resource_types`, `resource_subtypes`, `resource_categories`, `units`, `suppliers`, `resources` |
| Fase 2 | `resource_suppliers`, `resource_costs`, `resource_documents`, `resource_photos`, `resource_tags`, `resource_tag_links` |
| Fase 3 | `dynamic_properties`, `dynamic_forms`, `dynamic_form_versions`, `dynamic_form_fields` |
| Fase 4 | `production_processes`, `production_process_steps`, `configurable_states`, `industry_templates` |
| Fase 5+ | Inventario, recetas, lotes, usuarios |

Migraciones en `backend/alembic/versions/`. Seeds en `database/seeds/`.

**Referencias:** [13 — Taxonomía](13-resource-taxonomy.md) · [14 — Ciclo de vida](14-resource-lifecycle.md) · [16 — Administración de Producción](16-production-administration.md)
