# .foundation — Metodología de desarrollo BrewOS

Carpeta de **reglas obligatorias** para todo desarrollo a partir del Sprint de implementación.

La etapa de Discovery, UX y Arquitectura terminó. Este directorio define **cómo** se construye BrewOS.

---

## Lectura obligatoria (en orden)

| # | Documento | Contenido |
|---|-----------|-----------|
| 1 | [../BREWOS_MANIFESTO.md](../BREWOS_MANIFESTO.md) | Filosofía del producto |
| 2 | [development-manifesto.md](development-manifesto.md) | Principios de desarrollo |
| 3 | [architecture-rules.md](architecture-rules.md) | Capas y desacoplamiento |
| 4 | [folder-structure.md](folder-structure.md) | Árbol del repositorio |

Según tu rol:

| Rol | Leer además |
|-----|-------------|
| Frontend | [frontend-rules.md](frontend-rules.md) |
| Backend | [backend-rules.md](backend-rules.md) |
| Base de datos | [database-rules.md](database-rules.md) |
| Todos | [git-workflow.md](git-workflow.md) · [naming-conventions.md](naming-conventions.md) · [testing-strategy.md](testing-strategy.md) · [code-review-checklist.md](code-review-checklist.md) |

---

## Índice completo

```
.foundation/
├── README.md                    ← este archivo
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

---

## Relación con otras carpetas

| Carpeta | Propósito |
|---------|-----------|
| `.foundation/` | **Cómo** desarrollamos — reglas y metodología |
| `docs/` | **Qué** construimos — producto, dominio, UX, ADRs |
| `foundation/` | Material crudo y archivo de origen |
| `CONTRIBUTING.md` | Guía práctica para contribuir |

---

## Jerarquía en conflictos

1. ADRs (`docs/decisions/`)
2. Principios de producto (`docs/11-*.md`)
3. `.foundation/`
4. `docs/08-development-rules.md`

---

*`.foundation/` — BrewOS v1.0*
