# Flujo de trabajo Git — BrewOS

Convenciones de ramas, commits y pull requests para el repositorio BrewOS.

---

## Ramas

| Rama | Uso |
|------|-----|
| `main` | Producción; siempre desplegable |
| `develop` | Integración (opcional; usar si el equipo crece) |
| `feat/*` | Nuevas funcionalidades |
| `fix/*` | Corrección de bugs |
| `docs/*` | Solo documentación |
| `refactor/*` | Refactor sin cambio de comportamiento |

**Flujo recomendado (equipo pequeño):**

```text
main ← PR ← feat/resources-crud
```

**Flujo con integración:**

```text
main ← PR ← develop ← PR ← feat/inventory-movements
```

---

## Convención de commits — Conventional Commits

Formato:

```text
<tipo>(<ámbito opcional>): <descripción en imperativo>

[cuerpo opcional]

[footer opcional]
```

### Tipos permitidos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `refactor` | Refactor sin feat ni fix |
| `style` | Formato, sin cambio de lógica |
| `test` | Tests nuevos o corregidos |
| `build` | Build, dependencias, Docker |
| `ci` | Pipelines, GitHub Actions, Coolify |
| `chore` | Mantenimiento menor (no código de producto) |
| `perf` | Mejora de performance |

### Ámbitos sugeridos

`frontend`, `backend`, `database`, `docs`, `config`, `resources`, `inventory`, `docker`, `foundation`

### Ejemplos reales

```text
feat(resources): add resource list view with dynamic filters

fix(frontend): correct standalone start command for Coolify deploy

docs(foundation): add ADR-0006 dynamic production configuration

refactor(backend): extract resource validation to domain service

test(resources): add unit tests for resource filter service

build(docker): align Dockerfile with nixpacks start command

ci: add frontend lint and typecheck to pipeline

feat(config): add form schema version endpoint

fix(inventory): prevent negative stock on manual adjustment

docs(navigation): update settings production admin submenu

chore(deps): bump next.js to 15.5.19
```

### Reglas de mensaje

- Imperativo en presente: «add», no «added» ni «adds»
- Primera línea ≤ 72 caracteres
- Sin punto final en la primera línea
- Cuerpo opcional: el **por qué**, no el qué (el diff muestra el qué)
- Referenciar issue: `Closes #42` en footer si aplica

---

## Pull Requests

### Título

Mismo formato que commit principal:

```text
feat(resources): implement resource detail tabs
```

### Descripción mínima

```markdown
## Resumen
- Qué cambia y por qué

## Tipo de cambio
- [ ] feat / fix / docs / refactor / ...

## Checklist
- [ ] code-review-checklist.md completado
- [ ] Tests pasan
- [ ] Documentación actualizada si aplica

## Screenshots (si UI)
```

### Tamaño

- PR pequeño y revisable: **< 400 líneas** de diff ideal
- Un módulo o concern por PR
- Dividir features grandes en PRs secuenciales

---

## Qué no commitear

- `.env`, credenciales, tokens
- `node_modules/`, `.next/`, `__pycache__/`
- Secretos en código o migraciones
- Cambios de formateo masivos mezclados con lógica (PR separado `style:`)

---

## Tags y releases (futuro)

```text
v0.1.0-alpha   → primer deploy visual
v0.2.0         → Recursos + config API
v1.0.0         → producción Insular Origins estable
```

Formato [Semantic Versioning](https://semver.org/).

---

## Resolución de conflictos

- Rebase preferido sobre merge commit en ramas de feature (`git rebase main`)
- No force-push a `main`
- Resolver conflictos localmente; verificar build tras rebase

---

*Flujo Git BrewOS — v1.0*
