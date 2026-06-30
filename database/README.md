# Database — BrewOS

Esquemas, migraciones y datos semilla de **PostgreSQL** para BrewOS.

## Estrategia PostgreSQL

- **Una sola base** PostgreSQL para BrewOS (datos transaccionales y configuración dinámica).
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

### Flujo local

```bash
cd backend
alembic upgrade head          # aplicar pendientes
alembic revision --autogenerate -m "descripcion"  # nueva migración
alembic downgrade -1          # revertir última (solo desarrollo)
```

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
