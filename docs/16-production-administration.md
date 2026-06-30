# 16 — Administración de Producción

Arquitectura de la capa **Administración de Producción** de BrewOS. Define cómo el sistema deja de depender del código para describir tipos de producción y pasa a ser un **Sistema de Gestión de Producción Artesanal** configurable desde la interfaz.

**Sprint:** 4  
**Estado:** Especificación arquitectónica — sin implementación ni backend.  
**Pregunta que responde:** ¿Cómo configura el operador qué produce, con qué reglas y con qué formularios — sin tocar código?

**Documentos relacionados:** [05 — Modelo de datos](05-data-model.md) · [12 — Dominio de Recursos](12-resource-domain.md) · [13 — Taxonomía](13-resource-taxonomy.md) · [14 — Ciclo de vida](14-resource-lifecycle.md) · [10 — Mapa de navegación](10-navigation-map.md) · [11 — Principios de producto](11-product-principles.md) · [17 — Administración de Producción UX](17-production-administration-ux.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)

---

## 1. Visión Sprint 4

### Meta

Convertir BrewOS en un ERP de producción artesanal **completamente configurable**, donde cualquier nueva línea de negocio pueda incorporarse desde **Configuración → Administración de producción**, sin despliegue de código.

### Objetivo principal

**Eliminar toda dependencia del código respecto al tipo de producción.**

Hoy la taxonomía de 10 tipos de recurso ([13 — Taxonomía](13-resource-taxonomy.md)) está definida en documentación y parcialmente en frontend (`resource-types.ts`). Sprint 4 migra esa definición a **datos administrables**, conservando el recurso como entidad central ([ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)).

### De destilería a plataforma artesanal

| Antes (implícito) | Después (Sprint 4) |
|-------------------|-------------------|
| BrewOS pensado para destilería / cervecería | BrewOS como plataforma de producción artesanal multi-industria |
| Tipos fijos en código | Tipos, categorías y campos definidos en base de datos |
| Formularios por tipo hardcodeados | Formularios generados desde esquema dinámico |
| Procesos implícitos en documentación | Procesos productivos configurables por línea de negocio |
| Estados en enum de código | Estados configurables con transiciones validadas |

---

## 2. Líneas de negocio soportadas (sin modificar código)

El sistema debe admitir — mediante configuración — industrias como:

| Industria | Ejemplos de output |
|-----------|-------------------|
| Destilería | Gin, vodka, licores, destilados botánicos |
| Cervecería | Cerveza artesanal, fermentados |
| Agua purificada | Agua osmotizada, agua mineral |
| Cosmética natural | Cremas, bálsamos, jabones |
| Velas artesanales | Velas de soja, beeswax |
| Aceites esenciales | Destilados, macerados |
| Hidrolatos | Aguas florales, hidrolatos de destilación |
| Mermeladas gourmet | Conservas dulces |
| Conservas | Enlatados, escabeches |
| Charcutería | Embutidos, curados |
| Productos deshidratados | Hierbas, frutas, snacks |
| Turismo | Tours, visitas guiadas |
| Talleres | Experiencias formativas |
| Catas | Degustaciones, eventos |
| Merchandising | Productos derivados de marca |

**Mecanismo:** no hay tabla ni módulo por industria. Cada industria es una combinación de **línea de negocio** + **plantilla de configuración** + **tipos/procesos/recursos** definidos por el administrador.

---

## 3. Principios arquitectónicos

| # | Principio | Implicación |
|---|-----------|-------------|
| P1 | **Recurso sigue siendo la entidad central** | La configuración describe *cómo* se comportan los recursos; no crea entidades paralelas por industria |
| P2 | **Configuración es datos, no código** | Tipos, campos, procesos y estados viven en PostgreSQL; el frontend los interpreta |
| P3 | **Separación esquema / valor** | El *esquema* del formulario (qué campos existen) es distinto del *valor* almacenado en cada recurso |
| P4 | **Defaults por plantilla, libertad por operador** | Las plantillas de industria aceleran el onboarding; el operador puede modificarlas |
| P5 | **Versionado de esquemas** | Cambiar un campo obligatorio no corrompe recursos existentes; los esquemas versionan |
| P6 | **Un solo lugar para cada regla** | Si una validación existe en Administración de Producción, no se repite en código de módulos |
| P7 | **Módulos operativos son consumidores** | Recursos, Inventario, Recetas y Producción *leen* configuración; no la definen |
| P8 | **Español en UI, inglés en código** | Labels configurables en español; `code` interno en inglés snake_case |

---

## 4. Capa «Administración de Producción»

### 4.1 Ubicación en el producto

Submódulo de **Configuración** (ya esbozado en UI: `/settings/production/*`).

```
Configuración
├── Empresa, Usuarios, Seguridad, Respaldos, Integraciones
└── Administración de producción
    ├── Tipos
    ├── Categorías
    ├── Subcategorías
    ├── Propiedades
    ├── Unidades
    ├── Estados
    ├── Procesos
    ├── Equipos
    ├── Recursos (reglas del catálogo)
    ├── Botánicos (reglas del dominio vegetal)
    └── Productos (tipos de producto terminado)
```

### 4.2 Responsabilidad

| Hace | No hace |
|------|---------|
| Define taxonomía y comportamiento | Crear instancias operativas (eso es Recursos / Producción) |
| Define esquemas de formulario | Ejecutar lotes |
| Define procesos y etapas tipo | Registrar movimientos de inventario |
| Define estados y transiciones | Autenticar usuarios |
| Publica plantillas de industria | Reemplazar el módulo Recursos en operación diaria |

### 4.3 Flujo de dependencias

```
Administración de Producción (configura)
        │
        ▼
    Recursos (instancia maestros)
        │
        ├──► Inventario
        ├──► Recetas
        ├──► Producción
        └──► Trazabilidad
```

---

## 5. Líneas de negocio (`business_lines`)

Nueva entidad conceptual: agrupa la configuración de una operación productiva dentro de Insular Origins.

| Campo conceptual | Descripción |
|------------------|-------------|
| `code` | Identificador estable (`distillery`, `brewery`, `cosmetics`) |
| `name` | Nombre visible («Destilería Insular», «Línea Cosmética») |
| `description` | Propósito de la línea |
| `is_active` | Si está operativa |
| `template_id` | Plantilla de industria aplicada al crear (opcional) |
| `settings` | JSON: moneda, prefijos de código, defaults globales |

**Regla:** un recurso, receta o lote puede asociarse opcionalmente a una `business_line_id` para filtrar y reportar. No es obligatorio en instalaciones mono-línea.

**Multi-línea:** Insular Origins puede operar destilería + turismo + merchandising en la misma instancia, cada uno con tipos y procesos distintos.

---

## 6. Entidades configurables

### 6.1 Tipos de recursos (`resource_types`)

**Evolución:** de enum fijo de 10 tipos a **registro administrable**.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | Único por tenant (`supply`, `botanical`, `finished_product`, `experience`) |
| `name` | Label UI («Insumo», «Experiencia») |
| `description` | Ayuda contextual |
| `icon` | Identificador Lucide o custom |
| `color_token` | Token visual del design system |
| `sort_order` | Orden en filtros y wizard |
| `business_line_id` | Opcional: tipo exclusivo de una línea |
| `default_flags` | JSON: inventariable, consumible, cultivable, vendible, trazable, equipamiento |
| ~~`code_prefix`~~ | **Deprecado** (ADR-0007/0009). Identidad operacional vía `BREW-RES-*` (Identity Engine). Ver [20 — Bootstrap §8](20-bootstrap-strategy.md) |
| `form_schema_id` | FK al esquema de formulario activo |
| `status` | draft, active, archived |
| `is_system` | Si proviene de plantilla base (no eliminable, solo archivable) |

**Comportamiento que define:**

- Qué subtipos y categorías son válidos
- Qué flags vienen pre-marcados
- Qué formulario muestra el wizard de Recursos
- En qué submenús de Recursos aparece
- Qué módulos pueden referenciarlo (recetas, inventario, jardín)

**Los 10 tipos actuales** ([13 — Taxonomía](13-resource-taxonomy.md)) pasan a ser **plantilla seed** «Producción artesanal base», no constantes de código.

---

### 6.2 Categorías (`resource_categories`)

Jerarquía libre **por tipo de recurso** o transversal.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `resource_type_id` | Opcional: categoría scoped a un tipo |
| `parent_id` | Jerarquía (árbol) |
| `code`, `name`, `description` | Identidad |
| `sort_order` | Orden en selectores |
| `business_line_id` | Opcional |
| `status` | active, archived |

**Ejemplos configurables:**

- Destilería: `Destilados → Botánicos chilotes`
- Cervecería: `Cervezas → IPA → Experimental`
- Cosmética: `Cuidado facial → Sérum`

---

### 6.3 Subcategorías (`resource_subtypes`)

**Nota de nomenclatura:** en el modelo actual «subtipo» = clasificación secundaria fija por tipo. Sprint 4 unifica bajo administración con nombre UI **Subcategorías** (subtipos técnicos).

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `resource_type_id` | Obligatorio |
| `code`, `name`, `description` | Identidad |
| `default_flags` | Override parcial de flags del tipo |
| `form_schema_id` | Override de formulario (opcional; hereda del tipo si null) |
| `validation_rules` | JSON: reglas adicionales |
| `sort_order`, `status` | |

**Herencia:** subcategoría hereda esquema del tipo salvo override explícito.

---

### 6.4 Unidades (`units`)

Sistema de medida configurable con conversiones.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `kg`, `L`, `ml`, `unit`, `percent`, `hour` |
| `name` | «Kilogramo», «Litro», «Sesión» |
| `symbol` | Símbolo corto |
| `unit_type` | mass, volume, count, time, temperature, custom |
| `is_base` | Si es unidad base de su familia |
| `base_unit_id` | FK para conversiones |
| `conversion_factor` | Factor hacia unidad base |
| `decimal_places` | Precisión de visualización |
| `status` | |

**Conversiones:** tabla `unit_conversions` para pares no jerárquicos (ej. `bottle_500ml` → `L`).

---

### 6.5 Propiedades dinámicas (`property_definitions`)

Define **campos configurables** del sistema. Es el núcleo del motor de formularios.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `alcohol_proof`, `botanical_origin`, `shelf_life_days` |
| `name` | Label UI |
| `description` | Tooltip / ayuda |
| `data_type` | text, long_text, number, decimal, boolean, date, datetime, select, multi_select, file, resource_ref, unit_ref |
| `options` | JSON: opciones para select |
| `unit_id` | Unidad asociada si numérico con dimensión |
| `is_required_default` | Default al asignar a un esquema |
| `validation` | JSON: min, max, regex, pattern |
| `scope` | resource, recipe, batch, equipment — dónde aplica |
| `status` | |

**No almacena valores** — solo define qué puede existir.

---

### 6.6 Esquemas de formulario (`form_schemas`)

Agrupa propiedades en layouts para tipos, subcategorías o procesos.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `supply_alcohol_v1` |
| `name` | Nombre administrativo |
| `version` | Entero incremental |
| `entity_type` | resource, recipe, batch_step, equipment |
| `resource_type_id` | Scope opcional |
| `layout` | JSON: secciones, orden, condiciones de visibilidad |
| `status` | draft, published, archived |
| `published_at` | |

**Tabla de unión:** `form_schema_fields`

| Campo | Descripción |
|-------|-------------|
| `form_schema_id` | |
| `property_definition_id` | |
| `section_key` | Agrupación UI |
| `sort_order` | |
| `is_required` | Override |
| `is_visible` | |
| `visibility_condition` | JSON: ej. mostrar si `subtype = Alcohol` |
| `default_value` | JSON |

**Versionado:** al publicar v2, los recursos creados con v1 conservan su esquema (`form_schema_version` en el recurso).

---

### 6.7 Valores de propiedades (`entity_property_values`)

Almacén EAV tipado de valores dinámicos.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `entity_type` | resource, recipe_version, batch, equipment_instance |
| `entity_id` | UUID de la entidad |
| `property_definition_id` | |
| `value_text`, `value_number`, `value_boolean`, `value_date`, `value_json` | Columnas según tipo |
| `form_schema_version` | Trazabilidad del esquema usado |

**Índice único:** `(entity_type, entity_id, property_definition_id)`.

**Alternativa híbrida:** campos ultra-frecuentes (`internal_code`, `name`, `status`, flags) permanecen columnas en `resources`; el resto va a EAV.

---

### 6.8 Tipos de productos (`product_types`)

Clasificación de **outputs** de producción, distinta del tipo de recurso `finished_product`.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `gin`, `beer`, `candle`, `tour` |
| `name` | «Gin», «Cerveza», «Vela», «Tour» |
| `resource_type_id` | Normalmente `finished_product` o `service` |
| `default_recipe_form_schema_id` | Formulario para recetas de este producto |
| `default_batch_process_id` | Proceso productivo por defecto |
| `business_line_id` | |
| `status` | |

**Relación:** un recurso `finished_product` tiene `product_type_id` opcional. Una receta se asocia a `product_type_id` para filtrar ingredientes y etapas válidas.

---

### 6.9 Procesos productivos (`production_processes`)

Plantilla de **cómo se elabora** algo — independiente de una receta específica.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `distillation`, `maceration`, `fermentation`, `bottling`, `workshop` |
| `name` | «Destilación», «Fermentación», «Embotellado» |
| `description` | |
| `product_type_id` | Opcional: proceso típico de un tipo de producto |
| `business_line_id` | |
| `form_schema_id` | Campos del proceso (temperaturas, tiempos) |
| `status` | |

**Etapas:** `production_process_steps`

| Campo | Descripción |
|-------|-------------|
| `production_process_id` | |
| `code`, `name`, `description` | |
| `sort_order` | Orden obligatorio |
| `step_type` | manual, timer, measurement, equipment_use, consumption, quality_check |
| `form_schema_id` | Campos de la etapa |
| `default_duration_minutes` | Opcional |
| `equipment_type_ids` | JSON: equipos válidos |
| `is_optional` | |

**Uso en Producción:** al crear un lote, se instancia `batch_steps` desde `production_process_steps`. La receta puede referenciar un proceso o definir el suyo.

---

### 6.10 Equipos (`equipment_types` + instancias)

Separación entre **tipo de equipo** (configurable) e **instancia** (recurso con `equipamiento = true`).

#### `equipment_types` (configuración)

| Campo | Descripción |
|-------|-------------|
| `code`, `name`, `description` | |
| `resource_type_id` | Normalmente tipo Equipamiento |
| `form_schema_id` | Campos: marca, modelo, capacidad |
| `maintenance_interval_days` | Opcional |
| `status` | |

#### Instancia operativa

La instancia física sigue siendo un **`resource`** con `resource_type` = Equipamiento y propiedades dinámicas. No hay tabla `equipment` separada — coherente con ADR-0005.

**Estados de equipamiento:** ver §6.11.

---

### 6.11 Estados configurables (`state_definitions`)

Reemplaza enums fijos de [14 — Ciclo de vida](14-resource-lifecycle.md) por definiciones administrables **por dominio**.

| Campo conceptual | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code` | `active`, `operative`, `reserved` |
| `name` | Label UI |
| `state_group` | resource_global, inventory_stock, equipment, batch, recipe_version |
| `semantic` | success, warning, neutral, danger (para badges) |
| `is_initial` | Estado al crear |
| `is_terminal` | Sin transiciones salientes |
| `sort_order` | |
| `status` | |

**Transiciones:** `state_transitions`

| Campo | Descripción |
|-------|-------------|
| `from_state_id`, `to_state_id` | |
| `requires_permission` | Opcional |
| `validation_rules` | JSON: campos obligatorios para transitar |
| `is_automatic` | Si el sistema puede aplicarla |

**Estados globales de recurso** (Borrador, Activo, Inactivo, Archivado) permanecen como **plantilla seed** pero pueden extenderse (ej. «En revisión regulatoria») sin cambiar código.

---

### 6.12 Etiquetas (`tags`)

Etiquetas transversales configurables — evolución de `resource_tags`.

| Campo | Descripción |
|------------------|-------------|
| `id` | UUID |
| `code`, `name` | |
| `color` | Token o hex |
| `scope` | resource, recipe, batch, document — dónde puede aplicarse |
| `business_line_id` | Opcional |
| `status` | |

**Unión:** `entity_tags` (`entity_type`, `entity_id`, `tag_id`).

---

### 6.13 Atributos personalizados

Sinónimo operativo de **propiedades dinámicas** (§6.5–6.7). En UI de Administración se agrupan bajo «Propiedades» y «Atributos personalizados» según scope:

| Término UI | Scope técnico |
|------------|---------------|
| Propiedades de recurso | `entity_type = resource` |
| Atributos de receta | `entity_type = recipe` |
| Atributos de lote | `entity_type = batch` |
| Atributos de equipo | `entity_type = resource` + tipo Equipamiento |

**Regla:** un solo motor (`property_definitions` + `form_schemas` + `entity_property_values`), múltiples puntos de entrada en UI.

---

## 7. Motor de formularios dinámicos

### 7.1 Arquitectura

```
property_definitions (catálogo de campos)
        │
        ▼
form_schemas (layout + versión)
        │
        ├──► resource_types / subtypes (wizard Recursos)
        ├──► product_types (wizard Recetas)
        └──► production_process_steps (etapas de lote)
        │
        ▼
entity_property_values (valores por instancia)
```

### 7.2 Renderizado frontend (futuro)

1. API devuelve `form_schema` publicado + `property_definitions` resueltas
2. Componente `DynamicForm` interpreta `layout` JSON
3. Validación cliente con reglas del esquema; servidor re-valida siempre
4. Tipos de campo mapean a componentes shadcn/ui existentes

### 7.3 Tipos de campo soportados (v1)

| data_type | Componente UI |
|-----------|---------------|
| text | Input |
| long_text | Textarea |
| number / decimal | Input numérico |
| boolean | Switch |
| date / datetime | Date picker |
| select / multi_select | Select / chips |
| file | Upload → Laboratorio / `resource_documents` |
| resource_ref | Combobox de recursos filtrado |
| unit_ref | Select de unidades |

### 7.4 Condiciones de visibilidad

JSON en `form_schema_fields.visibility_condition`:

```json
{
  "operator": "and",
  "conditions": [
    { "field": "subtype_code", "equals": "alcohol" },
    { "field": "flags.consumible", "equals": true }
  ]
}
```

El motor evalúa contra valores actuales del formulario (y flags del tipo).

---

## 8. Plantillas de industria (`industry_templates`)

Aceleradores de onboarding. **No son código desplegado** — son paquetes JSON importables.

| Campo | Descripción |
|-------|-------------|
| `code` | `distillery`, `brewery`, `cosmetics`, `food_preserve` |
| `name` | Nombre visible |
| `version` | |
| `payload` | JSON: tipos, subcategorías, propiedades, procesos, estados, unidades |
| `is_official` | Mantenido por Insular Origins |

**Flujo:** Configuración → «Importar plantilla» → previsualizar → aplicar (crea registros en tablas de configuración).

**Plantilla base incluida:** equivalente a la taxonomía actual de [13 — Taxonomía](13-resource-taxonomy.md) para no romper instalaciones existentes.

---

## 9. Relación con módulos operativos

| Módulo | Consume de Administración de Producción |
|--------|----------------------------------------|
| **Recursos** | Tipos, subcategorías, categorías, esquemas, estados globales, etiquetas |
| **Inventario** | Estados de stock, unidades |
| **Recetas** | Tipos de producto, propiedades de receta, ingredientes válidos por tipo |
| **Producción** | Procesos, etapas, esquemas de lote, estados de batch |
| **Trazabilidad** | Sin configuración propia; hereda de lote y recursos |
| **Jardín Botánico** | Reglas de botánicos (flags cultivable, propiedades de origen) |
| **Reportes** | Dimensiones configurables (tipo, categoría, línea de negocio) |
| **Laboratorio** | Tipos de documento vinculables a propiedades `file` |

---

## 10. Tablas necesarias (resumen)

### Configuración — núcleo

| Tabla | Propósito |
|-------|-----------|
| `business_lines` | Líneas de negocio |
| `industry_templates` | Plantillas importables |
| `resource_types` | Tipos de recurso configurables |
| `resource_subtypes` | Subcategorías |
| `resource_categories` | Categorías jerárquicas |
| `units` | Unidades de medida |
| `unit_conversions` | Conversiones entre unidades |
| `property_definitions` | Catálogo de propiedades dinámicas |
| `form_schemas` | Esquemas versionados |
| `form_schema_fields` | Campos por esquema |
| `product_types` | Tipos de producto |
| `production_processes` | Procesos productivos |
| `production_process_steps` | Etapas de proceso |
| `equipment_types` | Tipos de equipamiento |
| `state_definitions` | Estados configurables |
| `state_transitions` | Transiciones permitidas |
| `tags` | Etiquetas |
| `entity_tags` | Unión entidad ↔ etiqueta |
| `entity_property_values` | Valores EAV |

### Operativas (existentes — se extienden)

| Tabla | Extensión Sprint 4 |
|-------|-------------------|
| `resources` | + `business_line_id`, `product_type_id`, `form_schema_id`, `form_schema_version` |
| `recipes` | + `product_type_id`, `production_process_id` |
| `recipe_versions` | + `form_schema_id` |
| `batches` | + `production_process_id`, `business_line_id` |
| `batch_steps` | + `production_process_step_id`, `form_schema_id` |
| `inventory_movements` | `stock_status` → FK a `state_definitions` (grupo inventory_stock) |

### Sin tablas nuevas por industria

No existirán `distillery_*`, `brewery_*`, `cosmetics_*`. Toda industria usa las mismas tablas de configuración.

---

## 11. Qué permanece fijo (no configurable)

| Elemento | Motivo |
|----------|--------|
| **Entidad `resources` como núcleo** | ADR-0005; integridad del modelo |
| **Flujo Recursos → Inventario → Recetas → Producción → Trazabilidad** | Principios 2–7, 16–20 |
| **Separación maestro / instancia** | Configuración describe; módulos operativos instancian |
| **Congelamiento de `recipe_version` en lote** | Principio 6 |
| **Trazabilidad append-only** | Principio 7 |
| **Módulos de navegación principales (10)** | [10 — Mapa de navegación](10-navigation-map.md) |
| **Idioma UI español / código inglés** | ADR-0001 |
| **Motor EAV + columnas núcleo híbrido** | Performance y simplicidad de queries frecuentes |
| **Permisos y autenticación** | Seguridad no configurable por operador |
| **Estructura de API REST versionada** | `/api/v1/resources`, `/api/v1/config/...` |

---

## 12. Qué es configurable (resumen)

| Entidad | Configurable por admin |
|---------|------------------------|
| Tipos de recursos | ✅ Crear, editar, archivar |
| Subcategorías | ✅ |
| Categorías | ✅ |
| Unidades y conversiones | ✅ |
| Propiedades y atributos | ✅ |
| Esquemas de formulario | ✅ Con versionado |
| Tipos de producto | ✅ |
| Procesos y etapas | ✅ |
| Tipos de equipo | ✅ |
| Estados y transiciones | ✅ Por grupo de dominio |
| Etiquetas | ✅ |
| Líneas de negocio | ✅ |
| Plantillas de industria | ✅ Importar / exportar |

---

## 13. Flujos de configuración típicos

### 13.1 Nueva línea: Cosmética natural

1. Crear `business_line` «Cosmética Insular»
2. Importar plantilla `cosmetics` (o crear desde cero)
3. Revisar tipos: Insumo, Envase, Producto terminado, Servicio
4. Ajustar propiedades: `ph_level`, `shelf_life_months`, `skin_type`
5. Definir proceso «Emulsión» con etapas
6. Publicar esquemas
7. Operador crea recursos y recetas bajo la nueva línea

### 13.2 Agregar campo a tipo existente

1. Administración → Propiedades → Crear `alcohol_proof`
2. Administración → Tipos → Insumo → Esquema → Nueva versión
3. Agregar campo a sección «Composición»
4. Publicar v2
5. Recursos nuevos usan v2; existentes conservan v1 hasta migración opcional

### 13.3 Nuevo tipo sin código

1. Administración → Tipos → «Experiencia» (`experience`)
2. Flags: vendible, no inventariable
3. Asociar esquema con campos: duración, capacidad, idioma
4. Aparece automáticamente en Recursos y filtros

---

## 14. Riesgos de escalabilidad

| Riesgo | Descripción | Mitigación |
|--------|-------------|------------|
| **Explosión de propiedades** | Cientos de campos custom degradan UX y queries EAV | Límites por esquema; revisión periódica; índices en `entity_property_values` |
| **Esquemas huérfanos** | Versiones viejas sin documentación | Auditoría de esquemas; UI de «recursos en esquema obsoleto» |
| **Validación inconsistente** | Cliente y servidor interpretan JSON distinto | Un solo motor de validación en backend; tests de esquema |
| **Performance de formularios dinámicos** | Render lento con muchas condiciones | Cache de esquemas publicados; CDN interna |
| **Configuración incorrecta bloquea operación** | Admin archiva tipo en uso | Soft-delete; validación de dependencias antes de archivar |
| **Multi-tenant futuro** | Insular Origins + clientes externos | `tenant_id` en todas las tablas de configuración desde diseño |
| **Plantillas incompatibles** | Import rompe datos existentes | Modo preview; merge strategy; rollback |
| **Complejidad cognitiva** | Operador no distingue tipo vs subcategoría vs categoría | UX guiada; plantillas; documentación in-app |
| **Reportes sobre EAV** | Agregaciones lentas en propiedades custom | Materializar propiedades frecuentes; vistas SQL |
| **Sobre-configuración** | Más opciones que valor | Principio 11: primero simple; plantillas opinionadas |

---

## 15. Recomendaciones para 10 años

### Arquitectura

1. **Mantener recurso único** — no fragmentar por industria aunque crezca el catálogo de tipos.
2. **Versionar todo esquema** — nunca editar in-place un formulario en producción.
3. **API de configuración separada** — `/api/v1/config/*` con cache agresivo; invalidación por evento.
4. **Event sourcing ligero para configuración** — log de quién cambió qué esquema y cuándo.
5. **Diseñar `tenant_id` desde Sprint 4** aunque haya un solo tenant hoy.

### Producto

6. **Plantillas oficiales mantenidas** — destilería, cervecería, cosmética, turismo como paquetes versionados.
7. **Modo «solo operación»** — ocultar Administración de Producción a roles que no configuran.
8. **Export / import de configuración** — backup y clonación entre entornos (dev → prod).
9. **Simulador de formulario** — previsualizar esquema antes de publicar.

### Datos

10. **Híbrido columna + EAV** — núcleo relacional para listados; EAV para extensibilidad.
11. **Índices parciales** en `entity_property_values` por `entity_type` y `property_definition_id`.
12. **Archivado, no borrado** — toda entidad configurable es soft-delete.

### Evolución documental

13. **Actualizar [13 — Taxonomía](13-resource-taxonomy.md)** — pasar de «tipos fijos» a «plantilla seed de referencia».
14. **Nuevo ADR-0006** (futuro) — «Configuración de producción como datos, no código».
15. **Principio 18 evoluciona** — de «tipo define comportamiento» a «configuración de tipo define comportamiento».

---

## 16. Impacto en código actual (referencia futura)

| Artefacto actual | Acción futura |
|------------------|---------------|
| `frontend/.../resource-types.ts` | Eliminar constantes; consumir API `/config/resource-types` |
| `docs/13-resource-taxonomy.md` | Marcado como plantilla seed; no fuente de verdad runtime |
| `mock-resources.ts` | Generar desde seed JSON alineado con plantilla |
| Settings UI `/settings/production/*` | Conectar CRUD real a tablas de configuración |
| Validaciones hardcodeadas en wizard | Reemplazar por motor `DynamicForm` |

**Sprint 4 actual:** solo este documento. Sin migraciones ni código.

---

## 17. Próximos pasos

| Orden | Entregable |
|-------|------------|
| 1 | ADR-0006: Configuración de producción administrable |
| 2 | Actualizar `05-data-model.md` con tablas de §10 |
| 3 | Esquema PostgreSQL en `database/` |
| 4 | API `/api/v1/config/*` |
| 5 | Motor `DynamicForm` en frontend |
| 6 | CRUD Administración de Producción |
| 7 | Migración de taxonomía fija → seed importado |
| 8 | Plantillas: destilería, cervecería, turismo |

---

*Documento v1.0 — Sprint 4: Administración de Producción / BrewOS como Sistema de Gestión de Producción Artesanal*
