# Estructura de carpetas — BrewOS

Árbol definitivo esperado del repositorio. Toda contribución debe respetar esta organización o justificar desviación con ADR.

---

## Raíz del repositorio

```
brewos/
├── .foundation/              # Metodología y reglas de desarrollo (este sprint)
├── BREWOS_MANIFESTO.md       # Filosofía del producto
├── CONTRIBUTING.md           # Guía para contribuir
├── CHANGELOG.md              # Historial de versiones
├── README.md                 # Punto de entrada del repo
│
├── docs/                     # Documentación curada y estable
│   ├── 01-vision.md … 17-*.md
│   └── decisions/            # ADRs
│
├── foundation/               # Archivo de origen (material crudo, referencias)
│
├── frontend/                 # Next.js 15 — BrewCore UI
├── backend/                  # FastAPI — BrewCore API
├── database/                 # Migraciones, seeds, scripts SQL
├── docker/                   # Docker, Coolify, despliegue
├── scripts/                  # Automatización repo (setup, seed, ci helpers)
│
├── assets/                   # Design system, marca, tokens, mockups
├── firmware/                 # BrewNode ESP32 (futuro)
└── hardware/                 # Documentación hardware (futuro)
```

---

## `.foundation/` — Metodología

```
.foundation/
├── development-manifesto.md
├── architecture-rules.md
├── frontend-rules.md
├── backend-rules.md
├── database-rules.md
├── git-workflow.md
├── naming-conventions.md
├── testing-strategy.md
├── folder-structure.md
└── code-review-checklist.md
```

**Lectura obligatoria** antes del primer PR de implementación.

---

## `docs/` — Documentación de producto

```
docs/
├── 01-vision.md
├── 02-architecture.md
├── …
├── 16-production-administration.md
├── 17-production-administration-ux.md
└── decisions/
    ├── README.md
    ├── ADR-0001-*.md
    └── ADR-0006-*.md
```

---

## `frontend/` — Next.js

```
frontend/
├── public/
├── src/
│   ├── app/                      # App Router — RUTAS DELGADAS
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   └── (app)/                # AppShell
│   │       ├── layout.tsx
│   │       ├── control-center/
│   │       ├── resources/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   └── [id]/
│   │       ├── inventory/
│   │       ├── recipes/
│   │       ├── production/
│   │       ├── traceability/
│   │       ├── botanical-garden/
│   │       ├── laboratory/
│   │       ├── reports/
│   │       └── settings/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── [...path]/
│   │           └── production/
│   │
│   ├── features/                 # LÓGICA POR DOMINIO
│   │   ├── control-center/
│   │   ├── resources/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── config/
│   │   │   ├── data/               # mocks temporales
│   │   │   └── lib/
│   │   ├── inventory/
│   │   ├── recipes/
│   │   ├── production/
│   │   ├── settings/
│   │   │   └── production/         # Admin producción UI
│   │   └── shared/
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn
│   │   ├── brand/
│   │   └── common/
│   ├── config/                     # navigation.ts, site.ts
│   ├── layouts/                    # AppShell, sidebar, header, footer
│   ├── providers/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
│
├── Dockerfile
├── nixpacks.toml
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

**Regla:** nuevo módulo operativo = carpeta en `features/` + rutas en `app/(app)/`.

---

## `backend/` — FastAPI

```
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── dependencies.py
│   │   └── exceptions.py
│   ├── api/
│   │   └── v1/
│   │       ├── router.py
│   │       └── routers/
│   │           ├── auth.py
│   │           ├── resources.py
│   │           ├── inventory.py
│   │           ├── recipes.py
│   │           ├── batches.py
│   │           ├── traceability.py
│   │           └── config/
│   │               ├── resource_types.py
│   │               ├── form_schemas.py
│   │               └── ...
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── schemas/
│   └── domain/
├── tests/
│   ├── unit/
│   └── integration/
├── alembic/
│   ├── versions/
│   └── env.py
├── pyproject.toml
├── Dockerfile
└── README.md
```

---

## `database/` — PostgreSQL

```
database/
├── migrations/               # Alembic (o symlink a backend/alembic/versions)
├── seeds/
│   ├── 001_base_units.sql
│   └── industry_templates/
│       ├── distillery.json
│       └── cosmetics.json
├── scripts/
│   ├── reset-dev.sh
│   └── backup.sh
└── README.md
```

---

## `docker/` — Despliegue

```
docker/
├── README.md                   # Guía Coolify
└── compose/                    # docker-compose futuro (dev local full stack)
    └── docker-compose.yml
```

---

## `scripts/` — Automatización

```
scripts/
├── setup-dev.sh                # Bootstrap entorno local
├── lint-all.sh
└── test-all.sh
```

---

## `assets/` — Design system

```
assets/
├── brand/
├── colors/
├── typography/
├── icons/
├── mockups/
└── ui/
```

---

## Módulos futuros (no crear hasta sprint correspondiente)

```
firmware/                       # Sprint 9+ BrewNode
hardware/                       # Documentación sensores y cableado
```

---

## Dónde va cada cosa nueva

| Quiero agregar… | Ubicación |
|-----------------|-----------|
| Pantalla de módulo | `frontend/src/app/(app)/<modulo>/` + `features/<modulo>/` |
| Componente UI compartido | `frontend/src/components/` |
| Endpoint API | `backend/app/api/v1/routers/` |
| Lógica de negocio | `backend/app/services/` |
| Tabla nueva | `backend/app/models/` + migración Alembic |
| Regla de producto | `docs/` o ADR |
| Regla de código | `.foundation/` |
| Decisión arquitectónica | `docs/decisions/ADR-*.md` |
| Script de deploy | `docker/` o `scripts/` |

---

*Estructura de carpetas BrewOS — v1.0*
