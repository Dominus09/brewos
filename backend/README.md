# Backend — BrewOS API

API REST de BrewOS construida con **FastAPI**, **SQLAlchemy 2.x**, **Alembic** y **PostgreSQL**.

## Estado

**Fase 1 — base técnica.** Modelos iniciales del catálogo de recursos, migración Alembic y seed documentado. Sin endpoints de negocio ni autenticación.

## Estructura

```
backend/
├── app/
│   ├── main.py              # FastAPI app + /health
│   ├── core/                # Configuración (env vars)
│   ├── db/                  # Base, session, mixins
│   ├── models/              # Modelos SQLAlchemy
│   ├── schemas/             # Pydantic v2 (pendiente)
│   ├── repositories/        # Acceso a datos (pendiente)
│   ├── services/            # Lógica de negocio (pendiente)
│   └── routers/             # Endpoints API (pendiente)
├── alembic/
│   └── versions/            # Migraciones
├── alembic.ini
├── requirements.txt
└── .env.example
```

## Requisitos

- Python 3.11+
- PostgreSQL 14+

## Configuración

```bash
cd backend
cp .env.example .env
# Editar DATABASE_URL en .env
```

Variables:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/brewos` |
| `APP_ENV` | `development` \| `staging` \| `production` |
| `APP_NAME` | Título de la API |

## Instalación

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

## Migraciones

```bash
cd backend
alembic upgrade head
```

## Seed inicial

No se ejecuta automáticamente. Ver [database/seeds/README.md](../database/seeds/README.md).

```bash
psql "$DATABASE_URL" -f ../database/seeds/001_base_seed.sql
```

## Desarrollo local

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health: `GET http://localhost:8000/health`
- Docs (solo `APP_ENV=development`): `http://localhost:8000/docs`

## Tablas fase 1

- `business_lines`
- `resource_types`
- `resource_subtypes`
- `resource_categories`
- `units`
- `suppliers`
- `resources`

## Referencias

- [Modelo de datos](../docs/05-data-model.md)
- [Database](../database/README.md)
- [Reglas backend](../.foundation/backend-rules.md)
- [ADR-0005](../docs/decisions/ADR-0005-resource-as-core-entity.md)
- [ADR-0006](../docs/decisions/ADR-0006-dynamic-production-configuration.md)
