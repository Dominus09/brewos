# Seeds — BrewOS

Scripts modulares de datos iniciales. **No crean schema ni tablas.**

**Estrategia completa:** [20 — Bootstrap](../docs/20-bootstrap-strategy.md) · [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)

## Orden obligatorio

```text
1. alembic upgrade head          (backend/) — crea schema brewos + tablas
2. bootstrap/000_verify_…sql   — verifica prerequisitos
3. seeds/run_all.sql           — datos mínimos en orden
```

**El schema `brewos` lo crea solo Alembic.** Los seeds no ejecutan `CREATE SCHEMA`.

## Archivos

| Archivo | Categoría | Responsabilidad |
|---------|-----------|-----------------|
| `001_units.sql` | A — Bootstrap | Unidades SI (u, g, kg, ml, L) |
| `002_business_lines.sql` | A — Bootstrap | Líneas mínimas Insular Origins |
| `003_resource_types.sql` | B — Config inicial | Tipos sistema (`is_system`), sin `code_prefix` |
| `004_operational_prefixes.sql` | B — Config inicial | Prefijos oficiales doc 18 (requiere migración `003`) |
| `run_all.sql` | — | Orquestador `\i` en orden |

**Eliminado:** `001_base_seed.sql` (monolítico, desalineado ADR-0007).

## Ejecución

```powershell
cd backend
$env:DATABASE_URL = "postgresql://USER:PASS@HOST:5432/analytics"
.\.venv\Scripts\python.exe -m alembic upgrade head

cd ..
psql $env:DATABASE_URL -f database/bootstrap/000_verify_prerequisites.sql
psql $env:DATABASE_URL -f database/seeds/run_all.sql
```

Desde `database/seeds/` (para `\i` relativos):

```powershell
psql $env:DATABASE_URL -f run_all.sql
```

## Qué NO va en seeds

- `resources`, `suppliers`, inventario, recetas, lotes, jardín (categoría D)
- `resource_subtypes`, `resource_categories`, formularios, procesos (categoría C — solo UI)
- Datos mock o de demostración
- `CREATE SCHEMA` ni DDL

## Idempotencia

Todos los INSERT usan `ON CONFLICT … DO NOTHING` donde aplica. Re-ejecutar es seguro.

## Solución de problemas

| Error | Acción |
|-------|--------|
| `brewos.business_lines does not exist` | `alembic upgrade head` primero |
| Schema no existe | Alembic, no seeds |
| Prefijos `INS-` en datos viejos | Re-seed con archivos modulares; migrar recursos a ADR-0007 en fase Identity Engine |

## Referencias

- [database/bootstrap/README.md](../bootstrap/README.md)
- [database/README.md](../README.md)
