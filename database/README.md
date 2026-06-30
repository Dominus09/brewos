# Database — BrewOS

Esquemas, migraciones, bootstrap y seeds de **PostgreSQL** para BrewOS.

**Estrategia de inicialización:** [20 — Bootstrap](../docs/20-bootstrap-strategy.md) · [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)

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

La tabla de versiones de Alembic (`alembic_version`) reside en `brewos`.

---

## Flujo de inicialización

```text
alembic upgrade head  →  bootstrap/000_verify  →  seeds/run_all.sql  →  UI config
```

| Paso | Responsable | Crea schema `brewos` |
|------|-------------|---------------------|
| 1. Migraciones Alembic | `backend/alembic` | **Sí** |
| 2. Verificación | `database/bootstrap/` | No |
| 3. Seeds modulares | `database/seeds/` | No |
| 4. Configuración | UI Administración de Producción | No |

**Regla:** los seeds **nunca** ejecutan `CREATE SCHEMA`. Si falta `brewos`, correr Alembic primero.

---

## Estructura del repositorio

```text
database/
├── README.md
├── bootstrap/
│   ├── README.md
│   └── 000_verify_prerequisites.sql
├── seeds/
│   ├── README.md
│   ├── run_all.sql
│   ├── 001_units.sql
│   ├── 002_business_lines.sql
│   ├── 003_resource_types.sql
│   └── 004_operational_prefixes.sql
└── diagrams/              # (futuro)

backend/
├── alembic/               # Única fuente de verdad del esquema
└── app/models/
```

**Eliminado:** `001_base_seed.sql` monolítico (superseded por ADR-0009).

---

## Clasificación de datos

| Cat. | Qué | Ejemplo | Seed |
|------|-----|---------|------|
| **A** Bootstrap | Sin esto BrewOS no arranca | `units` | 001, 002 |
| **B** Config inicial | Plantilla `is_system` | `resource_types` | 003, 004 |
| **C** Config dinámica | Solo UI (ADR-0006) | categorías, formularios | Nunca |
| **D** Operacional | Usuarios en runtime | `resources`, lotes | Nunca |

---

## Migraciones (Alembic)

**Alembic en `backend/` es la única forma de migrar el esquema.**

| Revisión | Descripción |
|----------|-------------|
| `001_initial_resource_catalog` | `CREATE SCHEMA brewos` + catálogo base |
| `002_resource_satellite_tables` | Satélites de recurso |
| `003_core_engine_identity_events` | Core CE-1: prefijos, secuencias, eventos, auditoría |
| `004_remove_resource_type_code_prefix` | DROP `code_prefix`; `internal_code` nullable en borradores |

```powershell
cd backend
$env:DATABASE_URL = "postgresql://USER:PASS@HOST:5432/analytics"
.\.venv\Scripts\python.exe -m alembic upgrade head
```

---

## Seeds modulares

```powershell
psql $env:DATABASE_URL -f database/bootstrap/000_verify_prerequisites.sql
psql $env:DATABASE_URL -f database/seeds/run_all.sql
```

- Sin prefijos legacy `INS`/`BOT` — alineado ADR-0007
- Sin `code_prefix` en `resource_types`
- Idempotente (`ON CONFLICT DO NOTHING`)

Ver [seeds/README.md](seeds/README.md).

---

## Identificadores

| Tipo | Uso |
|------|-----|
| `id UUID` | Sistema, FK, API |
| `internal_code` | Humano — `BREW-RES-000001` (ADR-0007, Identity Engine) |
| `code` | Config estable — `supply`, `kg` |

---

## Soft delete, timestamps, índices

Ver [.foundation/database-rules.md](../.foundation/database-rules.md).

---

## Referencias

- [05 — Modelo de datos](../docs/05-data-model.md)
- [18 — Identidad operacional](../docs/18-operational-identity.md)
- [ADR-0005](../docs/decisions/ADR-0005-resource-as-core-entity.md)
- [ADR-0006](../docs/decisions/ADR-0006-dynamic-production-configuration.md)
- [ADR-0009](../docs/decisions/ADR-0009-bootstrap-strategy.md)
