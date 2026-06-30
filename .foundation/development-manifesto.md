# Manifiesto de desarrollo — BrewOS

Cómo se construye BrewOS a partir de este sprint. Toda persona que contribuya al repositorio sigue estas reglas antes de escribir código.

**Documentos relacionados:** [BREWOS_MANIFESTO.md](../BREWOS_MANIFESTO.md) · [architecture-rules.md](architecture-rules.md) · [docs/08 — Reglas de desarrollo](../docs/08-development-rules.md) · [ADR-0006](../docs/decisions/ADR-0006-dynamic-production-configuration.md)

---

## Propósito

BrewOS es un sistema de largo plazo. La etapa de Discovery, UX y Arquitectura terminó. El desarrollo real exige **una sola metodología** compartida por frontend, backend, base de datos y documentación.

Este manifiesto es la fuente de verdad operativa del **cómo** desarrollamos.

---

## Principios fundamentales

### 1. Código limpio

- Funciones y módulos con una responsabilidad clara
- Nombres que revelan intención (español en UI, inglés en código)
- Sin comentarios que repitan lo obvio; sí comentarios para reglas de negocio no evidentes
- Eliminar código muerto en el mismo PR que lo deja obsoleto

### 2. Arquitectura desacoplada

- Capas con dependencias unidireccionales (UI → servicios → API → dominio → datos)
- Ningún módulo operativo conoce detalles de PostgreSQL o de componentes UI ajenos
- Configuración de producción consumida, no embebida en código

### 3. Simplicidad

- La solución más simple que resuelva el caso real de Insular Origins
- No microservicios, no abstracciones prematuras, no frameworks adicionales sin ADR
- Un CRUD claro y trazable vale más que una arquitectura sofisticada sin usuarios

### 4. Escalabilidad

- Diseñar para crecer en datos y módulos, no para hipotéticos millones de usuarios día uno
- `tenant_id` y versionado considerados desde el diseño de configuración
- Performance medida cuando hay problema real, no optimizada por intuición

### 5. Documentación obligatoria

- Cambios de arquitectura → `docs/` o ADR en `docs/decisions/`
- Nuevos módulos → actualizar mapa de navegación y modelo de datos cuando aplique
- APIs públicas → OpenAPI actualizado
- Decisiones que contradigan principios → ADR antes de merge

### 6. No hardcodear reglas de negocio

- Taxonomía, tipos, formularios, procesos y estados **no viven en constantes de código**
- Lo configurable se administra desde **Administración de Producción** (ADR-0006)
- El código implementa el **motor**; el administrador define las **líneas de negocio**

### 7. Configuración sobre programación

- Nueva industria (cosmética, turismo, conservas) = configuración + plantilla, no sprint de desarrollo
- Enums de negocio en código están prohibidos salvo núcleo del sistema documentado en ADR

### 8. Componentes reutilizables

- UI compartida en `components/`; lógica de dominio en `features/`
- Servicios de API reutilizables; no duplicar fetch ni validación
- Backend: servicios compartidos; no copiar queries entre routers

### 9. Evitar deuda técnica

- No mergear «temporal» sin issue o TODO con fecha y responsable
- No `any`, no `@ts-ignore`, no `# type: ignore` sin justificación en PR
- Refactorizar en el mismo sprint si el costo de postergar supera el de hacerlo ahora
- Revisar [code-review-checklist.md](code-review-checklist.md) en cada PR

---

## Orden de desarrollo de módulos

Respetar dependencias del dominio:

```
Administración de Producción (config)
        ↓
Recursos
        ↓
Inventario
        ↓
Recetas
        ↓
Producción
        ↓
Trazabilidad
        ↓
Jardín · Laboratorio · Reportes
```

No implementar consumo de inventario en producción sin recursos e inventario estables.

---

## Qué hacer antes de cada sprint de implementación

1. Leer ADRs y principios de producto aplicables
2. Verificar que el diseño UX existe en `docs/` (si hay UI)
3. Confirmar modelo de datos en `docs/05-data-model.md`
4. Definir contrato API (schemas) antes de implementar frontend
5. Planificar migraciones antes de tocar PostgreSQL

---

## Qué no hacer

| Prohibido | Alternativa |
|-----------|-------------|
| Crear recurso desde Inventario | Wizard en Recursos |
| Taxonomía en `const` o enums de negocio | API de configuración |
| SQL en routers FastAPI | Repositories |
| `fetch` en componentes React | Services en `features/*/services/` |
| `ALTER TABLE` manual en producción | Migraciones versionadas |
| Commits sin tipo (`git-workflow.md`) | `feat:`, `fix:`, `docs:`… |
| PR sin checklist | [code-review-checklist.md](code-review-checklist.md) |

---

## Jerarquía documental

En caso de conflicto:

1. ADRs aceptados (`docs/decisions/`)
2. Principios de producto (`docs/11-product-principles.md`)
3. Reglas de `.foundation/`
4. `docs/08-development-rules.md`
5. Convención local del módulo

---

## Referencias rápidas

| Tema | Documento |
|------|-----------|
| Arquitectura | [architecture-rules.md](architecture-rules.md) |
| Frontend | [frontend-rules.md](frontend-rules.md) |
| Backend | [backend-rules.md](backend-rules.md) |
| Base de datos | [database-rules.md](database-rules.md) |
| Git | [git-workflow.md](git-workflow.md) |
| Nombres | [naming-conventions.md](naming-conventions.md) |
| Tests | [testing-strategy.md](testing-strategy.md) |
| Estructura | [folder-structure.md](folder-structure.md) |
| Contribuir | [CONTRIBUTING.md](../CONTRIBUTING.md) |

---

*Manifiesto de desarrollo BrewOS — v1.0*
