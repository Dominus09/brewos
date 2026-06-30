# Reglas de backend — BrewOS

Reglas obligatorias para el backend FastAPI + Python.

**Referencias:** [02 — Arquitectura](../docs/02-architecture.md) · [architecture-rules.md](architecture-rules.md)

---

## Stack

| Tecnología | Uso |
|------------|-----|
| Python 3.12+ | Runtime |
| FastAPI | API REST, OpenAPI automático |
| Pydantic v2 | Schemas, validación |
| SQLAlchemy 2.x | ORM |
| Alembic | Migraciones |
| PostgreSQL | Base de datos (cuando se implemente) |

---

## Estructura de carpetas

```
backend/
├── app/
│   ├── main.py                 # FastAPI app, montaje de routers
│   ├── core/
│   │   ├── config.py           # Settings desde env
│   │   ├── security.py         # Auth, JWT, permisos
│   │   ├── dependencies.py     # Depends() reutilizables
│   │   └── exceptions.py       # Excepciones HTTP mapeadas
│   ├── api/
│   │   └── v1/
│   │       ├── router.py       # Agregador v1
│   │       └── routers/
│   │           ├── resources.py
│   │           ├── inventory.py
│   │           ├── config.py   # Administración de producción
│   │           └── ...
│   ├── services/
│   │   ├── resource_service.py
│   │   └── config_service.py
│   ├── repositories/
│   │   ├── resource_repository.py
│   │   └── base_repository.py
│   ├── models/
│   │   ├── resource.py
│   │   └── base.py             # Mixins: timestamps, soft delete
│   ├── schemas/
│   │   ├── resource.py         # ResourceCreate, ResourceRead, ...
│   │   └── common.py           # Pagination, ErrorResponse
│   └── domain/                 # Reglas puras (opcional v1)
├── tests/
│   ├── unit/
│   └── integration/
├── alembic/
├── pyproject.toml
└── README.md
```

---

## Capas y responsabilidades

### Routers (`api/v1/routers/`)

**Solo:**

- Definir ruta HTTP y método
- Inyectar dependencias (`Depends(get_db)`, `Depends(get_current_user)`)
- Validar body/query con schema Pydantic
- Llamar al service
- Devolver response schema con status code correcto

**Nunca:**

- Escribir SQL
- Aplicar reglas de negocio («si no hay stock, rechazar»)
- Acceder al ORM directamente
- Más de ~30 líneas por endpoint sin justificación

### Services (`services/`)

**Responsabilidad:**

- Lógica de negocio y orquestación
- Validaciones semánticas (unicidad, transiciones de estado, permisos)
- Coordinar varios repositories en una transacción
- Lanzar excepciones de dominio (`ResourceNotFound`, `InvalidTransition`)

**Ejemplo correcto:**

```text
ResourceService.create(data):
  → validar tipo existe en config
  → validar flags según tipo
  → repository.create(...)
  → registrar evento de timeline
```

### Repositories (`repositories/`)

**Responsabilidad:**

- CRUD y queries contra PostgreSQL vía SQLAlchemy
- Filtros, paginación, ordenación a nivel SQL
- Soft delete (`deleted_at IS NULL`)

**Nunca:**

- Reglas de negocio
- Conocer HTTP o schemas Pydantic

### Schemas (`schemas/`)

| Tipo | Sufijo | Uso |
|------|--------|-----|
| Entrada creación | `*Create` | POST body |
| Entrada actualización | `*Update` | PATCH/PUT body |
| Salida lectura | `*Read` | Response detalle |
| Salida lista | `*ListItem` | Response listado (campos reducidos) |
| Filtros | `*Filter` | Query params |

- `model_config = ConfigDict(from_attributes=True)` solo en Read cuando se mapea desde ORM
- No exponer campos internos (`deleted_at`, hashes)

### Models (`models/`)

- Una clase por tabla
- Mixins: `TimestampMixin`, `SoftDeleteMixin`, `UUIDPrimaryKeyMixin`
- Relaciones explícitas con `relationship()` y `back_populates`

### Core (`core/`)

- Configuración centralizada (`pydantic-settings`)
- Auth y permisos
- Dependencias FastAPI compartidas
- Mapeo excepción → HTTP status

---

## API REST

| Regla | Detalle |
|-------|---------|
| Versionado | `/api/v1/` desde el primer endpoint |
| Nombres | Plural, kebab-case en rutas anidadas: `/api/v1/resources/{id}/documents` |
| Paginación | `?page=1&page_size=25` en listados |
| Errores | JSON: `{ "code": "...", "message": "...", "detail": ... }` |
| OpenAPI | Siempre actualizado; Swagger en `/docs` solo en no-producción |
| Idempotencia | PUT/PATCH documentados; POST no idempotente por defecto |

---

## Autenticación y permisos

- Validar en cada endpoint protegido vía `Depends`
- Permisos por módulo: `resources:read`, `config:production`, etc.
- Nunca confiar en datos de rol enviados por el cliente

---

## Configuración dinámica (ADR-0006)

- Router dedicado `/api/v1/config/`
- Services separados de módulos operativos
- Cache de `form_schemas` publicados
- Validación de esquema al crear/actualizar recursos

---

## Prohibido

| Anti-patrón | Motivo |
|-------------|--------|
| SQL en router | Rompe capas |
| Lógica de negocio en router | No testeable |
| ORM model como response | Filtra campos sensibles |
| Raw SQL sin repository | Sin abstracción |
| Secrets en código | Usar variables de entorno |
| Endpoints sin schema Pydantic | Sin contrato |

---

## Checklist backend (PR)

- [ ] Router delgado
- [ ] Lógica en service
- [ ] SQL solo en repository
- [ ] Schemas Create/Read separados
- [ ] Excepciones mapeadas a HTTP
- [ ] OpenAPI coherente
- [ ] Tests unitarios del service
- [ ] Sin reglas de negocio hardcodeadas (ADR-0006)

---

*Reglas de backend BrewOS — v1.0*
