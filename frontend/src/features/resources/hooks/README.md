# resources/hooks

Hooks de UI del módulo Recursos. **Sin lógica de negocio ni llamadas API en esta fase.**

## Hooks planificados

| Hook | Responsabilidad |
|------|-----------------|
| `useResourcesFilters` | Estado de búsqueda, filtros, query params URL |
| `useResourcesPagination` | Página, tamaño, ordenación |
| `useResourceWizard` | Paso actual, tipo seleccionado, datos del formulario |
| `useResourceDetailTabs` | Tab activa, sincronización con URL hash opcional |
| `useResourceTypeFields` | Campos visibles/obligatorios según tipo (desde config) |

## Cuando exista API

Los hooks de datos vivirán aquí o en `services/`:

- `useResourcesList` — lista paginada
- `useResource` — detalle por id
- `useResourceHistory` — timeline
- `useResourceRelations` — relaciones

Regla: componentes no llaman `fetch` directamente.
