# Checklist de code review — BrewOS

Todo Pull Request debe ser revisado contra esta lista. El autor marca los ítems antes de solicitar review; el revisor verifica.

**Referencias:** [development-manifesto.md](development-manifesto.md) · [architecture-rules.md](architecture-rules.md)

---

## General

- [ ] El PR tiene un propósito claro y acotado (un módulo o concern)
- [ ] Título sigue [Conventional Commits](git-workflow.md)
- [ ] Descripción explica el **por qué**, no solo el qué
- [ ] Sin archivos accidentales (`.env`, `node_modules`, builds)
- [ ] Tamaño razonable (< 400 líneas de diff ideal)

---

## Arquitectura y diseño

- [ ] Respeta capas: router delgado, service con lógica, repository con SQL
- [ ] `app/` delgado en frontend; lógica en `features/`
- [ ] Sin duplicación de datos maestros
- [ ] Respeta ADR-0005 (recurso central) y ADR-0006 (config dinámica)
- [ ] Sin reglas de negocio hardcodeadas (taxonomía, estados, formularios)
- [ ] Documentación actualizada si cambia arquitectura, modelo o navegación

---

## Código limpio

- [ ] Sin hardcodeos de negocio (tipos, estados, industrias en `const`)
- [ ] Sin código comentado «por si acaso»
- [ ] Sin `TODO` sin issue o contexto
- [ ] Nombres claros según [naming-conventions.md](naming-conventions.md)
- [ ] Funciones y componentes con responsabilidad única

---

## TypeScript / Python

- [ ] Sin `any` (TypeScript)
- [ ] Sin `@ts-ignore` / `# type: ignore` sin justificación
- [ ] Tipado correcto en props, services, schemas
- [ ] Pydantic schemas separados Create/Read/Update
- [ ] `npm run typecheck` / `mypy` pasan

---

## Frontend

- [ ] Sin `fetch` directo en componentes — usar services
- [ ] Componentes < 300 líneas
- [ ] UI en español; rutas y código en inglés
- [ ] Sigue [09 — Design System](../docs/09-design-system.md)
- [ ] **Responsive:** probado móvil + desktop
- [ ] **Accesibilidad:** labels en inputs, contraste, navegación teclado en formularios
- [ ] Sin regresión visual obvia

---

## Backend

- [ ] Sin SQL en routers
- [ ] Sin lógica de negocio en endpoints
- [ ] Validación en service, formato en schema
- [ ] Errores con códigos HTTP correctos
- [ ] OpenAPI coherente con implementación

---

## Base de datos

- [ ] Migración Alembic incluida si hay cambio de esquema
- [ ] `created_at`, `updated_at` en tablas nuevas
- [ ] Soft delete donde corresponde
- [ ] UUID como PK; `internal_code` separado si aplica
- [ ] Sin `ALTER` manual — solo migraciones

---

## Tests

- [ ] Tests nuevos para lógica nueva (service, hook, validación)
- [ ] Suite existente pasa
- [ ] Sin tests skip sin motivo

---

## Performance

- [ ] Sin N+1 queries obvias en listados
- [ ] Sin re-renders innecesarios evidentes (frontend)
- [ ] Paginación en listados que pueden crecer
- [ ] Sin cargar datasets completos sin límite

---

## Seguridad

- [ ] Sin secretos en código
- [ ] Inputs validados en backend
- [ ] Endpoints protegidos con auth cuando corresponde
- [ ] Sin exposición de `deleted_at`, hashes o datos internos en API

---

## Git y deploy

- [ ] Commits siguen convención
- [ ] Sin force-push a `main`
- [ ] Variables de entorno documentadas si hay nuevas
- [ ] Build pasa (`npm run build` / Docker)

---

## Aprobación

| Rol | Nombre | Fecha |
|-----|--------|-------|
| Autor | | |
| Revisor | | |

**Mínimo 1 aprobación** antes de merge a `main`.

---

*Checklist de code review BrewOS — v1.0*
