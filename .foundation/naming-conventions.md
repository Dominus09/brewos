# Convenciones de nombres — BrewOS

Reglas unificadas de nomenclatura. **UI en español; código y base de datos en inglés** (ADR-0001).

**Identidad operacional:** códigos visibles, prefijos, QR y reportes — ver [18 — Identidad operacional](../docs/18-operational-identity.md) y [ADR-0007](../docs/decisions/ADR-0007-operational-identity-standard.md).

---

## Identidad operacional (códigos visibles)

Norma oficial en [18 — Identidad operacional](../docs/18-operational-identity.md). Resumen:

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Entidades maestras | `BREW-{FAMILIA}-{NNNNNN}` | `BREW-RES-000001` |
| Operaciones | `{PREFIJO}-{YYYYMMDD}-{NNN}` | `DIS-20260701-001` |
| Columna en BD | `internal_code` | No es PK; único por entidad |
| Identificador técnico | `id` (UUID) | **Nunca visible en UI** |
| API response | Siempre `id` + `internal_code` | Frontend muestra solo `internal_code` |
| Búsqueda humana | Por `internal_code` | No por UUID |
| Inmutabilidad | Código no cambia tras publicación | — |
| Reinicio secuencia | Solo operaciones diarias | Maestros nunca reinician |

### Prefijos maestros (registro oficial)

| Familia | Prefijo |
|---------|---------|
| Recursos | `BREW-RES` |
| Recetas | `BREW-REC` |
| Versiones receta | `BREW-REV` |
| Proveedores | `BREW-SUP` |
| Usuarios | `BREW-USR` |
| Clientes | `BREW-CLI` |
| Botánicos / plantas | `BREW-BOT` / `BREW-PLT` |
| Líneas de negocio | `BREW-BUS` |

Nuevos prefijos requieren actualización del doc 18 o ADR.

---

## Base de datos (PostgreSQL)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Tablas | plural, snake_case | `resources`, `inventory_movements` |
| Columnas | snake_case | `internal_code`, `created_at` |
| Primary key | `id` (UUID) | `id` |
| Foreign key columna | `{entidad_singular}_id` | `resource_type_id` |
| Booleanos | `is_` o `has_` prefijo | `is_inventoriable`, `has_lot` |
| Timestamps | `created_at`, `updated_at`, `deleted_at` | — |
| Índices | `ix_{tabla}_{cols}` | `ix_resources_internal_code` |
| Unique | `uq_{tabla}_{cols}` | `uq_resource_types_code` |
| FK constraint | `fk_{tabla}_{ref}` | `fk_resources_resource_type_id` |

---

## API REST (endpoints)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Base | `/api/v1/` | — |
| Recursos | plural, kebab-case si compuesto | `/api/v1/resources` |
| Anidados | máx. 2 niveles | `/api/v1/resources/{id}/documents` |
| Config | namespace dedicado | `/api/v1/config/resource-types` |
| Query params | snake_case | `?page_size=25&resource_type_id=` |
| Acciones no CRUD | verbo en subruta | `POST /batches/{id}/close` |

---

## Backend (Python)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | snake_case | `resource_service.py` |
| Clases | PascalCase | `ResourceService`, `ResourceCreate` |
| Funciones | snake_case | `get_by_id`, `list_filtered` |
| Constantes | UPPER_SNAKE | `MAX_PAGE_SIZE` |
| Schemas Pydantic | PascalCase + sufijo | `ResourceCreate`, `ResourceRead` |
| Models SQLAlchemy | PascalCase singular | `Resource`, `InventoryMovement` |
| Tabla ORM | `__tablename__` plural | `resources` |

---

## Frontend (TypeScript / React)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Carpetas features | kebab-case o singular dominio | `features/resources/` |
| Archivos componente | kebab-case | `resource-table.tsx` |
| Componentes React | PascalCase | `ResourceTable`, `SettingsSubnav` |
| Hooks | camelCase, prefijo `use` | `useResourcesFilter` |
| Services | kebab-case archivo | `resource-service.ts` |
| Funciones service | camelCase | `getResources`, `getResourceById` |
| Types / interfaces | PascalCase | `Resource`, `ResourceFilters` |
| Props type | `{Component}Props` | `ResourceTableProps` |
| Constantes UI | UPPER_SNAKE en config | `MAIN_NAVIGATION` |
| Rutas Next.js | kebab-case inglés | `/settings/production/resource-types` |
| Labels UI | español | «Tipos de recursos» |

---

## Variables y constantes

| Contexto | Convención | Ejemplo |
|----------|------------|---------|
| Variables TS/JS | camelCase | `filteredResources`, `activeTab` |
| Variables Python | snake_case | `filtered_resources` |
| Env vars | UPPER_SNAKE | `NEXT_PUBLIC_API_URL`, `DATABASE_URL` |
| Códigos de negocio config | snake_case inglés | `finished_product`, `cosmetic_supply` |
| Códigos visibles (operacionales) | `BREW-*` o prefijo operación | `BREW-RES-000042`, `DIS-20260701-001` |

---

## DTO / Schemas

| Capa | Crear | Leer | Actualizar | Lista |
|------|-------|------|------------|-------|
| Backend Pydantic | `ResourceCreate` | `ResourceRead` | `ResourceUpdate` | `ResourceListItem` |
| Frontend types | `CreateResourceInput` | `Resource` | `UpdateResourceInput` | `ResourceListItem` |

Alinear nombres entre capas; documentar mapeo si difieren.

---

## Git

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Ramas | `tipo/descripcion-corta` | `feat/resources-api` |
| Commits | Conventional Commits | `feat(resources): add list endpoint` |

---

## Documentación

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Docs numerados | `NN-titulo-kebab.md` | `16-production-administration.md` |
| ADRs | `ADR-NNNN-titulo-kebab.md` | `ADR-0006-dynamic-production-configuration.md` |
| Foundation | kebab-case | `development-manifesto.md` |

---

## Prohibido

| Incorrecto | Correcto |
|------------|----------|
| `Resources` (tabla) | `resources` |
| `get_user_data()` en TS | `getUserData()` |
| `resourceCard` (componente) | `ResourceCard` |
| `/api/v1/Resource` | `/api/v1/resources` |
| `tipoRecurso` en código | `resourceType` |
| Labels en inglés en UI | español |
| Mostrar UUID al usuario | `internal_code` (doc 18) |
| Prefijos ad-hoc (`INS-`, `LOT-`) | `BREW-RES-`, `DIS-YYYYMMDD-` (doc 18) |

---

*Convenciones de nombres BrewOS — v1.1 (ADR-0007)*
