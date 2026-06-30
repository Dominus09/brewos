# Backend — BrewOS API

API REST de BrewOS construida con **FastAPI**, **SQLAlchemy 2.x**, **Alembic** y **PostgreSQL**.

## Estado

**Fase 2 — satélites de recurso.** Catálogo base + tablas satélite. Schema dedicado `brewos` en base `analytics`. Sin endpoints de negocio ni autenticación.

## Base de datos y schema

BrewOS **no tiene base de datos propia**. Conecta a la base compartida **`analytics`** y opera exclusivamente en el schema **`brewos`**:

```text
postgresql://user:pass@host:5432/analytics  →  schema brewos
```

| Objeto | Ubicación |
|--------|-----------|
| Base de datos | `analytics` |
| Schema BrewOS | `brewos` |
| Tabla ejemplo | `brewos.resources` |
| Constante | `DATABASE_SCHEMA` en `app/core/database_schema.py` |
| Alembic version | `brewos.alembic_version` |

### Configuración SQLAlchemy

1. **Metadata con schema** — `app/db/base.py` define `MetaData(schema=DATABASE_SCHEMA)`; todos los modelos heredan el schema automáticamente.
2. **`brewos_table_args()`** — helper para modelos con índices/constraints en `__table_args__`.
3. **`search_path`** — al conectar, `app/db/session.py` ejecuta `SET search_path TO brewos, public` para SQL ad-hoc.
4. **Alembic** — `env.py` usa `include_schemas=True` y `version_table_schema=DATABASE_SCHEMA`.

### Migraciones futuras

Toda nueva revisión Alembic debe:

- Importar `from app.core.database_schema import DATABASE_SCHEMA as SCHEMA`
- Pasar `schema=SCHEMA` en `op.create_table`, `op.create_index`, `op.drop_table`, etc.
- **No** crear tablas en `public` ni en otros schemas

La migración `001` crea el schema: `CREATE SCHEMA IF NOT EXISTS brewos`.

## Estructura

```
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   └── database_schema.py   # DATABASE_SCHEMA = "brewos"
│   ├── db/
│   │   ├── base.py              # MetaData(schema=brewos)
│   │   └── session.py
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routers/
├── alembic/
└── alembic.ini
```

## Requisitos

- Python 3.11+
- PostgreSQL 14+
- Acceso a base `analytics` con permisos en schema `brewos`

## Configuración

```bash
cd backend
cp .env.example .env
# Editar DATABASE_URL → postgresql://...@host:5432/analytics
```

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Conexión a base `analytics` |
| `APP_ENV` | `development` \| `staging` \| `production` |
| `APP_NAME` | Título de la API |

## Instalación

```bash
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Migraciones

```powershell
cd backend
$env:DATABASE_URL = "postgresql://user:pass@host:5432/analytics"
.\.venv\Scripts\python.exe -m alembic upgrade head
```

| Revisión | Descripción |
|----------|-------------|
| `001_initial_resource_catalog` | `CREATE SCHEMA brewos` + catálogo base |
| `002_resource_satellite_tables` | Tablas satélite de recursos |

## Seed inicial

```powershell
psql $env:DATABASE_URL -f ..\database\seeds\001_base_seed.sql
```

## Desarrollo local

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Referencias

- [Modelo de datos](../docs/05-data-model.md)
- [Database](../database/README.md)
- [Reglas backend](../.foundation/backend-rules.md)
