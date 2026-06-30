# Reglas de base de datos — BrewOS

Reglas obligatorias para PostgreSQL, esquema y migraciones.

**Referencias:** [05 — Modelo de datos](../docs/05-data-model.md) · [16 — Administración de Producción](../docs/16-production-administration.md) · [20 — Bootstrap](../docs/20-bootstrap-strategy.md) · [ADR-0005](../docs/decisions/ADR-0005-resource-as-core-entity.md) · [ADR-0007](../docs/decisions/ADR-0007-operational-identity-standard.md) · [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)

---

## Principios

| Principio | Aplicación |
|-----------|------------|
| Una fuente de verdad | PostgreSQL para datos transaccionales |
| Integridad referencial | FK explícitas; no confiar solo en aplicación |
| Migraciones versionadas | Alembic; nunca `ALTER` manual en producción |
| Soft delete | Registros operativos no se borran físicamente |
| Auditoría temporal | `created_at`, `updated_at` en tablas transaccionales |
| UUID internos | Identificadores primarios UUID v4 (o v7 si se adopta) |

---

## Identificadores

### UUID internos

- **Primary key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- No exponer secuencias enteras como único identificador de negocio
- APIs usan UUID en rutas: `/api/v1/resources/{id}`

### Código visible (negocio)

- Columna separada: `internal_code VARCHAR` (ej. `BREW-RES-000042` — [ADR-0007](../docs/decisions/ADR-0007-operational-identity-standard.md))
- Generado **únicamente** por Identity Engine (Core Engine) — no por `code_prefix` en `resource_types`
- **Único** por tenant/organización cuando aplique
- Indexado para búsqueda; no es primary key

```text
id (UUID)           → sistema, FK, API
internal_code       → humano, etiquetas, reportes (BREW-* / DIS-YYYYMMDD-*)
```

**Deprecado:** `resource_types.code_prefix` (`INS`, `BOT`, …). Eliminar en migración futura. Ver [20 — Bootstrap §8](../docs/20-bootstrap-strategy.md).

---

## Timestamps

Toda tabla transaccional incluye:

| Columna | Tipo | Regla |
|---------|------|-------|
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()`; trigger o ORM on update |

Tablas de solo configuración: mismas columnas.

---

## Soft delete

| Columna | Tipo | Regla |
|---------|------|-------|
| `deleted_at` | `TIMESTAMPTZ` | `NULL` = activo; timestamp = archivado |

- Queries por defecto filtran `WHERE deleted_at IS NULL`
- Repositories exponen `soft_delete(id)` — no `DELETE` físico en operación normal
- `DELETE` físico solo en scripts de mantenimiento documentados

---

## Versionado

Aplicable a entidades con evolución de esquema (formularios, recetas, configuración):

| Patrón | Uso |
|--------|-----|
| `version INTEGER` | Versión incremental en `form_schemas`, `recipe_versions` |
| `published_at TIMESTAMPTZ` | Momento de publicación |
| `status` | `draft`, `published`, `archived` |

- Recursos y lotes guardan `form_schema_version` al crear para trazabilidad del esquema usado

---

## Nomenclatura de tablas y columnas

Ver [naming-conventions.md](naming-conventions.md). Resumen:

- Tablas: plural, snake_case — `resources`, `inventory_movements`
- Columnas: snake_case — `resource_type_id`, `is_inventoriable`
- FK: `{tabla_singular}_id` — `resource_id`, `supplier_id`
- Índices: `ix_{tabla}_{columnas}` — `ix_resources_internal_code`
- Constraints: `uq_`, `fk_`, `ck_` con nombre explícito

---

## Migraciones (Alembic)

### Reglas

1. **Toda** modificación de esquema = archivo de migración en `database/migrations/`
2. **Prohibido** `ALTER TABLE` manual en staging o producción
3. Migraciones **reversibles** cuando sea posible (`upgrade` + `downgrade`)
4. Una migración por cambio lógico (no mezclar «tabla recursos» + «tabla usuarios» sin relación)
5. Revisar migración en PR con diff SQL legible
6. Datos seed en scripts modulares en `database/seeds/` — ver [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)

### Bootstrap y seeds

| Regla | Detalle |
|-------|---------|
| Schema `brewos` | **Solo Alembic** — nunca en seeds |
| Orden | `alembic upgrade head` → `bootstrap/verify` → `seeds/run_all.sql` |
| Modularidad | Un archivo SQL = una responsabilidad |
| Prohibido en seeds | `CREATE SCHEMA`, datos operacionales, config dinámica (categoría C) |
| `code_prefix` | No poblar en seeds; deprecado |

### Flujo

```text
1. Actualizar models SQLAlchemy
2. alembic revision --autogenerate -m "add resource_types table"
3. Revisar y editar SQL generado
4. alembic upgrade head (local)
5. Commit migración + model
6. CI aplica migración en test DB
```

### Prohibido

- Editar migración ya aplicada en producción (crear nueva migración correctiva)
- `DROP COLUMN` sin periodo de deprecación documentado
- Índices sin justificación en tablas grandes

---

## Tipos de datos

| Uso | Tipo PostgreSQL |
|-----|-----------------|
| Texto corto | `VARCHAR(n)` con n justificado |
| Texto largo | `TEXT` |
| Dinero | `NUMERIC(12, 4)` + columna `currency CHAR(3)` |
| Cantidades | `NUMERIC(12, 4)` |
| Booleanos | `BOOLEAN NOT NULL DEFAULT false` |
| JSON configuración | `JSONB` (con schema validado en app) |
| Enums técnicos | `VARCHAR` o PostgreSQL ENUM solo si estable |

**Evitar** enums PostgreSQL para valores de negocio configurables (usar tablas `state_definitions`, `resource_types`).

---

## Multi-tenant (futuro)

- Columna `organization_id` o `tenant_id` UUID en tablas de configuración y operación
- Índices compuestos `(tenant_id, ...)` en tablas grandes
- Diseñar desde Sprint 5 aunque haya un solo tenant (Insular Origins)

---

## Configuración dinámica (tablas clave)

Ver [16 — §10](../docs/16-production-administration.md):

- `resource_types`, `resource_subtypes`, `resource_categories`
- `property_definitions`, `form_schemas`, `form_schema_fields`
- `entity_property_values` (EAV)
- `production_processes`, `state_definitions`, `business_lines`

---

## Checklist base de datos (PR)

- [ ] Migración Alembic incluida
- [ ] `created_at`, `updated_at` en tablas nuevas
- [ ] Soft delete si es entidad operativa
- [ ] UUID como PK
- [ ] `internal_code` separado si aplica
- [ ] FK con índice
- [ ] Sin enums de negocio hardcodeados
- [ ] Modelo alineado con `docs/05-data-model.md`
- [ ] Downgrade probado o documentado como no reversible

---

*Reglas de base de datos BrewOS — v1.1 (ADR-0007, ADR-0009)*
