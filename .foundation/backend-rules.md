# Reglas de backend — BrewOS

Reglas obligatorias para el backend FastAPI + Python.

**Referencias:** [02 — Arquitectura](../docs/02-architecture.md) · [architecture-rules.md](architecture-rules.md) · [ADR-0008](../docs/decisions/ADR-0008-brewos-core-engine.md) · [19 — Core Engine](../docs/19-core-engine.md)

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
│   ├── main.py
│   ├── core/                   # Config + BrewOS Core Engine
│   │   ├── config.py
│   │   ├── database_schema.py
│   │   ├── dependencies.py
│   │   ├── exceptions.py
│   │   ├── identity/           # Identity Engine
│   │   ├── events/             # Event Engine
│   │   ├── audit/              # Audit Engine
│   │   ├── timeline/           # Timeline Engine
│   │   ├── files/              # File Engine
│   │   ├── labels/             # QR / Label Engine
│   │   ├── notifications/      # (futuro)
│   │   └── integrations/       # (futuro)
│   ├── api/v1/routers/         # HTTP delgado
│   ├── services/               # Orquestan core + repositories
│   ├── repositories/
│   ├── models/
│   ├── schemas/
│   └── domain/
├── tests/
├── alembic/
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
- Generar `internal_code` o códigos de operación
- Escribir en `audit_log` o `timeline_entries` directamente
- Subir archivos sin File Engine
- Más de ~30 líneas por endpoint sin justificación

### Services (`services/`)

**Responsabilidad:**

- Lógica de negocio y orquestación
- Validaciones semánticas (unicidad, transiciones de estado, permisos)
- Coordinar repositories + **Core Engine** en una transacción
- Emitir eventos de dominio vía Event Engine
- Lanzar excepciones de dominio (`ResourceNotFound`, `InvalidTransition`)

**Ejemplo correcto:**

```text
ResourceService.create(data):
  → validar tipo existe en config
  → validar flags según tipo
  → IdentityEngine.assign_master_code("resource")
  → repository.create(...)
  → EventEngine.emit(ResourceCreated)
  → (handlers) AuditEngine + TimelineEngine
```

**Nunca:**

- Asignar `internal_code` sin Identity Engine
- Insertar auditoría o timeline manualmente
- Importar lógica de otro módulo sin pasar por contrato claro

### BrewOS Core Engine (`core/identity`, `core/events`, …)

**Responsabilidad:**

- Capacidades transversales: identidad, eventos, auditoría, timeline, archivos, QR
- Sin reglas de negocio de industria (gin, cerveza, velas…)
- Consumido por services; no expone HTTP

Ver [19 — Core Engine](../docs/19-core-engine.md).

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
- Auth y permisos (`security.py` — futuro)
- Dependencias FastAPI compartidas
- Mapeo excepción → HTTP status
- **BrewOS Core Engine:** identity, events, audit, timeline, files, labels (ver doc 19)

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
| Código operacional fuera de Identity Engine | Rompe ADR-0007 |
| Auditoría/timeline en router o service sin evento | Rompe ADR-0008 |
| `core/` importando `services/` | Dependencia invertida |

---

## Checklist backend (PR)

- [ ] Router delgado — un service por endpoint
- [ ] Lógica en service de módulo
- [ ] Side effects transversales vía Core Engine
- [ ] Códigos solo desde Identity Engine
- [ ] Eventos tipados para mutaciones significativas
- [ ] SQL solo en repository
- [ ] Schemas Create/Read separados
- [ ] Excepciones mapeadas a HTTP
- [ ] OpenAPI coherente
- [ ] Tests unitarios del service + motores core afectados
- [ ] Sin reglas de negocio hardcodeadas (ADR-0006)

---

*Reglas de backend BrewOS — v1.1 (ADR-0008)*
