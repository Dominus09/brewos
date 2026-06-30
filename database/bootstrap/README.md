# Bootstrap — BrewOS

Scripts de **verificación** previos a seeds. **No crean el schema** en operación normal.

## Responsabilidad del schema

| Artefacto | Crea `brewos` | Crea tablas |
|-----------|---------------|-------------|
| **Alembic** (`backend/alembic`) | **Sí** | **Sí** |
| `bootstrap/*.sql` | **No** | **No** |
| `seeds/*.sql` | **No** | **No** |

El schema se crea en la migración `001_initial_resource_catalog`:

```sql
CREATE SCHEMA IF NOT EXISTS brewos;
```

## Uso

```powershell
# Después de alembic upgrade head
psql $env:DATABASE_URL -f database/bootstrap/000_verify_prerequisites.sql
```

Si la verificación falla, **no ejecutar seeds** — corregir migraciones primero.

## Referencias

- [20 — Estrategia de bootstrap](../docs/20-bootstrap-strategy.md)
- [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)
