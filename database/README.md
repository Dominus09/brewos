# Database — BrewOS

Esquemas, migraciones y datos semilla de **PostgreSQL** para BrewOS.

## Arquitectura de schemas

BrewOS comparte la base de datos **`analytics`** con otros sistemas de la empresa. Cada sistema tiene su **propio schema PostgreSQL**; BrewOS usa exclusivamente **`brewos`**.

```text
analytics (database)
├── analytics      # Datos analíticos
├── app            # Aplicaciones internas
├── bsale          # Integración BSale
├── distribuidora  # Distribuidora
├── brewos         # BrewOS — ERP/LIMS artesanal
└── public         # Objetos compartidos / legacy
```

### Principios

| Principio | Aplicación |
|-----------|------------|
| Una base PostgreSQL | `analytics` — respaldo, monitoreo y conexiones centralizados |
| Múltiples schemas | Separación lógica por sistema sin duplicar instancias |
| Aislamiento funcional | BrewOS solo crea/lee tablas en `brewos`; no toca `bsale`, `distribuidora`, etc. |
| Consultas cruzadas | Posibles con `schema.tabla` cuando un reporte integre sistemas |
| Migraciones propias | Alembic de BrewOS solo gestiona objetos en `brewos` |

### Convención de nombres

- Base de datos: `analytics`
- Schema BrewOS: `brewos` (constante `DATABASE_SCHEMA` en backend)
- Tabla de ejemplo: `analytics.brewos.resources`

La tabla de versiones de Alembic (`alembic_version`) también reside en `brewos`.

## Estrategia PostgreSQL

- **Una sola base** PostgreSQL (`analytics`) con schema dedicado `brewos`.
- **Integridad referencial** con FK explícitas e índices en columnas de join.
- **Sin datos mock** en base real: solo seeds documentados y datos operativos creados por usuarios.
- **Tipos de negocio configurables** en tablas (`resource_types`, `configurable_states`, etc.), no enums PostgreSQL de dominio.

## Identificadores

| Tipo | Uso |
|------|-----|
| `id UUID` | Primary key. `DEFAULT gen_random_uuid()`. Usado en API, FK y sistema. |
| `internal_code` | Código visible humano (ej. `INS-ALC-096`). Único donde aplique. Indexado. No es PK. |
| `code` | Código estable de configuración (ej. `supply`, `kg`). Único por tabla/ámbito. |

Las APIs y relaciones internas usan **UUID**. Los reportes, etiquetas y búsqueda rápida pueden usar `internal_code` o `code`.

## Timestamps

Toda tabla transaccional y de configuración incluye:

| Columna | Regla |
|---------|-------|
| `created_at TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |
| `updated_at TIMESTAMPTZ` | `NOT NULL DEFAULT now()`; actualizado en cada modificación |

## Soft delete

| Columna | Regla |
|---------|-------|
| `deleted_at TIMESTAMPTZ` | `NULL` = activo; timestamp = archivado |

- Queries por defecto filtran `WHERE deleted_at IS NULL`.
- No se usa `DELETE` físico en operación normal.
- `DELETE` físico solo en scripts de mantenimiento documentados.

### Índices únicos parciales (activos)

Para evitar duplicados entre registros activos con soft delete:

| Tabla | Constraint |
|-------|------------|
| `resource_suppliers` | `(resource_id, supplier_id)` único si `deleted_at IS NULL` |
| `resource_suppliers` | Un solo `is_primary = true` por `resource_id` activo |
| `resource_tag_links` | `(resource_id, tag_id)` único si `deleted_at IS NULL` |
| `resource_tags` | `slug` único si `deleted_at IS NULL` |
| `resource_photos` | Un solo `is_primary = true` por `resource_id` activo |

## Migraciones (Alembic)

**Alembic en `backend/` es la única forma de migrar el esquema.**

```
backend/
├── alembic/
│   ├── env.py
│   └── versions/       # Archivos de migración versionados
└── alembic.ini
```

### Reglas

1. Toda modificación de esquema = nueva revisión Alembic.
2. Prohibido `ALTER TABLE` manual en staging o producción.
3. Migraciones reversibles cuando sea posible (`upgrade` + `downgrade`).
4. Una migración por cambio lógico coherente.
5. Revisar SQL generado antes de merge.
6. **No editar** migraciones ya aplicadas en producción; crear migración correctiva.

### Migraciones aplicadas

| Revisión | Descripción |
|----------|-------------|
| `001_initial_resource_catalog` | Catálogo base: líneas, tipos, categorías, unidades, proveedores, recursos |
| `002_resource_satellite_tables` | Satélites de recurso: proveedores, costos, documentos, fotos, etiquetas |


## Seed inicial (obligatorio en entornos nuevos)

Los datos base **no se ejecutan automáticamente** al arrancar la API. Deben aplicarse manualmente tras la primera migración.

```
database/seeds/
├── README.md
└── 001_base_seed.sql       # Líneas de negocio, tipos y unidades base
```

Contenido mínimo del seed:

- Líneas de negocio: **Destilería**, **Cervecería**
- Tipos de recurso base (supply, botanical, container, equipment, …)
- Unidades: **unidad**, **g**, **kg**, **ml**, **L**

Ver `database/seeds/README.md` para instrucciones de ejecución.

## Reglas de nombres

Alineado con [.foundation/naming-conventions.md](../.foundation/naming-conventions.md):

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Tablas | plural, snake_case | `resource_types` |
| Columnas | snake_case | `resource_type_id` |
| PK | `id` (UUID) | — |
| FK | `{entidad_singular}_id` | `business_line_id` |
| Booleanos | prefijo `is_` / `has_` | `is_inventoriable` |
| Índices | `ix_{tabla}_{cols}` | `ix_resources_internal_code` |
| Unique | `uq_{tabla}_{cols}` | `uq_resource_types_code` |
| FK constraint | `fk_{tabla}_{ref}` | `fk_resources_resource_type_id` |

## Estructura del repositorio

```
database/
├── README.md           # Este archivo
├── seeds/              # Scripts SQL de datos iniciales
└── diagrams/           # ER exportados (futuro)

backend/
├── alembic/            # Migraciones Alembic (fuente de verdad del esquema)
└── app/models/         # Modelos SQLAlchemy (deben coincidir con migraciones)
```

## Referencias

- [05 — Modelo de datos](../docs/05-data-model.md)
- [Reglas de base de datos](../.foundation/database-rules.md)
- [ADR-0005 — Recurso como entidad central](../docs/decisions/ADR-0005-resource-as-core-entity.md)
- [ADR-0006 — Configuración dinámica](../docs/decisions/ADR-0006-dynamic-production-configuration.md)
