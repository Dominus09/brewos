# Estrategia de testing — BrewOS

Cómo se prueba BrewOS en frontend, backend y base de datos.

**Referencias:** [testing-strategy en code-review](code-review-checklist.md) · [development-manifesto](development-manifesto.md)

---

## Pirámide de tests

```
        ┌─────────┐
        │  E2E    │  Pocos — flujos críticos
        ├─────────┤
        │ Integr. │  API + DB, servicios con DB test
        ├─────────┤
        │  Unit   │  Muchos — dominio, services, utils
        └─────────┘
```

**Prioridad:** tests unitarios de lógica de negocio > integración API > E2E.

---

## Backend

### Unitarios (`tests/unit/`)

| Qué testear | Herramienta |
|-------------|-------------|
| Services (lógica de negocio) | pytest |
| Domain / validaciones puras | pytest |
| Schemas Pydantic (casos límite) | pytest |
| Utilidades | pytest |

- Mockear repositories en tests de service
- No tocar PostgreSQL en unitarios

### Integración (`tests/integration/`)

| Qué testear | Herramienta |
|-------------|-------------|
| Repositories contra DB real | pytest + PostgreSQL test (Docker) |
| Endpoints API completos | pytest + httpx `AsyncClient` |
| Migraciones Alembic | aplicar upgrade en DB vacía |

- DB de test descartable por run o transacciones con rollback
- Fixtures: datos mínimos (tipo recurso, unidad, usuario)

### Cobertura mínima (objetivo)

| Área | Objetivo |
|------|----------|
| Services críticos | ≥ 80 % |
| Routers | Smoke + casos happy/error |
| Repositories | CRUD básico por entidad |

---

## Frontend

### Unitarios / componentes

| Qué testear | Herramienta |
|-------------|-------------|
| Utilidades y formatters | Vitest |
| Hooks aislados | Vitest + `@testing-library/react` |
| Componentes puros | Testing Library (render, assert) |

- No testear implementación interna; testear comportamiento visible
- Mock de services, no de `fetch`

### Integración frontend

| Qué testear | Herramienta |
|-------------|-------------|
| Flujos con MSW (mock API) | Vitest + MSW |
| Formularios (validación) | Testing Library + user-event |

### E2E (futuro — fase estable)

| Qué testear | Herramienta |
|-------------|-------------|
| Login → Centro de Control | Playwright |
| Crear recurso (flujo crítico) | Playwright |

- E2E contra entorno staging, no producción
- Mínimo: smoke post-deploy

---

## Base de datos

| Test | Descripción |
|------|-------------|
| Migración limpia | `alembic upgrade head` en DB vacía sin error |
| Rollback | `downgrade -1` cuando esté definido |
| Constraints | FK rechaza huérfanos; unique rechaza duplicados |
| Seeds | Plantilla industria importa sin violar constraints |

---

## Configuración dinámica (ADR-0006)

Tests específicos obligatorios cuando se implemente:

- Publicar formulario v2 no altera recursos con v1
- Archivar tipo con recursos activos → rechazado
- Motor de validación: campo obligatorio según esquema
- Límites de guardrails (máx. campos por formulario)

---

## CI (objetivo)

Pipeline mínimo por PR:

```text
1. frontend: npm run lint && npm run typecheck && npm run test
2. backend: ruff/black + pytest unit
3. backend: pytest integration (si hay DB en CI)
4. database: alembic upgrade head en DB efímera
```

Bloquear merge si falla lint, typecheck o tests unitarios.

---

## Checklist antes de merge

### General

- [ ] Tests nuevos para código nuevo (service, hook, validación)
- [ ] Tests existentes pasan
- [ ] Sin `.only` ni tests skip sin issue
- [ ] Sin dependencia de orden entre tests

### Backend

- [ ] Service testado con casos happy + error
- [ ] Schema valida casos límite documentados

### Frontend

- [ ] Hook o util testado si contiene lógica
- [ ] Componente crítico con al menos un test de render

### Manual (hasta tener E2E)

- [ ] Flujo probado en navegador (móvil + desktop)
- [ ] Sin regresión visual obvia en módulo tocado

---

## Qué no testear (bajo valor)

- Componentes shadcn sin modificar
- Getters/setters triviales
- Configuración de Next.js o FastAPI sin lógica
- Snapshots masivos frágiles de UI completa

---

*Estrategia de testing BrewOS — v1.0*
