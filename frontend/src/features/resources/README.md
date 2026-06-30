# Feature: Recursos

Módulo central de BrewOS. Gestiona el catálogo maestro de todo lo que existe en Insular Origins.

**Pregunta:** ¿Qué recursos existen dentro de Insular Origins?

**Especificación UX:** [docs/15-resources-ui-ux.md](../../../docs/15-resources-ui-ux.md)

## Estado

Solo estructura y documentación. Sin implementación, sin API, sin lógica de negocio.

## Estructura

```
resources/
├── components/     # UI del módulo (tabla, wizard, detalle, timeline…)
├── pages/          # Composición de pantallas (conectan componentes)
├── hooks/          # Estado UI local, filtros, paginación (sin fetch aún)
├── types/          # Contratos TypeScript del dominio Recursos
└── README.md
```

## Pantallas planificadas

| Pantalla | Ruta |
|----------|------|
| Lista | `/resources` |
| Nuevo (wizard) | `/resources/new` |
| Detalle | `/resources/[id]` |
| Editar | `/resources/[id]/edit` |
| Proveedores | `/resources/suppliers` |
| Unidades | `/resources/units` |
| Categorías | `/resources/categories` |
| Etiquetas | `/resources/tags` |

## Reglas

1. No importar desde otros features (inventory, production, etc.)
2. Componentes reutilizables globales → `components/common` o `features/shared`
3. Tipos alineados con `docs/12–14` y `docs/13-resource-taxonomy.md`
4. UI en español; rutas en inglés (ADR-0001)

## Referencias

- [12 — Dominio de Recursos](../../../docs/12-resource-domain.md)
- [13 — Taxonomía](../../../docs/13-resource-taxonomy.md)
- [14 — Ciclo de vida](../../../docs/14-resource-lifecycle.md)
- [ADR-0005](../../../docs/decisions/ADR-0005-resource-as-core-entity.md)
