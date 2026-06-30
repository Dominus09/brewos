# Reglas de arquitectura — BrewOS

Reglas obligatorias de arquitectura para frontend, backend y base de datos.

**Referencias:** [02 — Arquitectura](../docs/02-architecture.md) · [ADR-0005](../docs/decisions/ADR-0005-resource-as-core-entity.md) · [ADR-0006](../docs/decisions/ADR-0006-dynamic-production-configuration.md)

---

## Visión de capas

```
┌─────────────────────────────────────────────────────────┐
│  Presentación (Next.js · App Router · features UI)      │
├─────────────────────────────────────────────────────────┤
│  Aplicación (hooks · casos de uso del cliente)          │
├─────────────────────────────────────────────────────────┤
│  Servicios API (frontend services · HTTP clients)         │
├─────────────────────────────────────────────────────────┤
│  API REST (FastAPI routers · schemas · auth)            │
├─────────────────────────────────────────────────────────┤
│  Dominio / Servicios (lógica de negocio · validación)   │
├─────────────────────────────────────────────────────────┤
│  Repositorios (acceso a datos · queries)                │
├─────────────────────────────────────────────────────────┤
│  Persistencia (PostgreSQL · migraciones)                │
└─────────────────────────────────────────────────────────┘
```

**Regla de dependencia:** las capas superiores dependen de las inferiores. Nunca al revés.

---

## Frontend — reglas estructurales

### App delgada

`src/app/` solo contiene:

- Rutas y layouts de Next.js
- Metadata y `generateStaticParams` cuando aplique
- Composición de una vista de `features/` (una línea o pocas líneas)

**Incorrecto:** 200 líneas de lógica en `page.tsx`  
**Correcto:** `page.tsx` importa `<ResourcesView />` desde `features/resources/`

### Features gruesas

Toda lógica de módulo vive en `src/features/<dominio>/`:

```
features/resources/
├── components/     # UI del dominio
├── hooks/          # Estado y efectos
├── services/       # Llamadas API
├── types/          # Tipos del dominio
├── config/         # Config local del feature (no taxonomía de negocio)
└── lib/            # Utilidades del dominio
```

### Servicios desacoplados

- Un service por agregado o bounded context (`resource-service.ts`, `config-service.ts`)
- Los componentes **nunca** llaman `fetch` directamente
- Los services devuelven tipos TypeScript; no `unknown`
- Mock local solo en desarrollo; interfaz idéntica a API futura

---

## Backend — reglas estructurales

### Capas obligatorias

```
backend/
├── app/
│   ├── main.py
│   ├── core/           # Config, seguridad, dependencias
│   ├── api/
│   │   └── v1/
│   │       └── routers/    # Solo HTTP: parse, status, delegar
│   ├── services/       # Lógica de negocio
│   ├── repositories/   # SQL / ORM
│   ├── models/         # SQLAlchemy / tablas
│   ├── schemas/        # Pydantic: request/response DTO
│   └── domain/         # Entidades y reglas puras (opcional, crecer con complejidad)
```

### Routers

- Reciben request, validan con schema Pydantic, llaman service, devuelven response
- **Sin SQL** en routers
- **Sin lógica de negocio** en routers (no `if stock < 0` en el endpoint)
- Un router por recurso REST (`resources.py`, `batches.py`, `config.py`)

### Services

- Orquestan repositorios y aplican reglas de negocio
- Transacciones cuando varias tablas deben ser atómicas
- Lanzan excepciones de dominio traducidas a HTTP en capa API

### Repositories

- Único lugar con queries SQL/ORM
- Métodos expresivos: `get_by_id`, `list_filtered`, `soft_delete`
- Sin lógica de negocio (no calcular costo promedio aquí — eso es service)

### Schemas (DTO)

- **Request schemas:** entrada del API (`ResourceCreate`, `ResourceUpdate`)
- **Response schemas:** salida (`ResourceRead`, `ResourceListItem`)
- Separar create/update/read; no reutilizar el modelo ORM como response
- Validación de formato en schema; validación de negocio en service

### Models

- Reflejo de tablas PostgreSQL
- Sin lógica de presentación
- Relaciones SQLAlchemy explícitas

### Domain (cuando aplique)

- Reglas puras testeables sin DB ni HTTP
- Ejemplo: validar transición de estado, calcular prefijo de código
- Opcional en v1; obligatorio cuando la lógica se duplica entre services

---

## Configuración dinámica (ADR-0006)

```
/api/v1/config/*     → services de configuración
/api/v1/resources/*  → consume tipos y esquemas de config
```

- El módulo `config` es primero ciudadano, no un apéndice
- Cache de esquemas publicados en backend; invalidación por evento
- Frontend lee configuración; no duplica taxonomía en `const`

---

## Interfaces y contratos

| Contrato | Ubicación |
|----------|-----------|
| API REST | OpenAPI generado por FastAPI; versionado `/api/v1/` |
| Frontend ↔ Backend | Types en `features/*/types/` alineados con schemas Pydantic |
| DB ↔ Backend | Models SQLAlchemy; migraciones como contrato de esquema |

Cambio breaking en API → nueva versión `/api/v2/` o extensión backward-compatible documentada.

---

## Validaciones

| Capa | Qué valida |
|------|------------|
| **Schema (Pydantic / Zod)** | Tipos, formatos, campos obligatorios, rangos |
| **Service** | Reglas de negocio, permisos, transiciones, unicidad semántica |
| **Repository** | Constraints de DB (FK, unique) — última línea de defensa |
| **Frontend** | UX y feedback rápido; **nunca** única fuente de verdad |

---

## Separación BrewCore / BrewNode

- BrewCore opera al 100 % sin sensores
- Integraciones hardware solo en `firmware/` y endpoints dedicados (futuro)
- Ningún módulo base depende de BrewNode

---

## Checklist de arquitectura (nuevo módulo)

- [ ] ¿La ruta `app/` es delgada?
- [ ] ¿La lógica está en `features/` o `services/`?
- [ ] ¿Hay router + service + repository + schemas?
- [ ] ¿Las reglas de negocio están en service/domain, no en router?
- [ ] ¿Hay tipos/DTO separados del modelo de persistencia?
- [ ] ¿Se respetan ADR-0005 y ADR-0006?
- [ ] ¿Se actualizó documentación si cambia el modelo o la navegación?

---

*Reglas de arquitectura BrewOS — v1.0*
