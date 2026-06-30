# resources/components

Componentes de UI específicos del módulo Recursos.

## Componentes planificados

| Componente | Uso |
|------------|-----|
| `ResourcesPageHeader` | Título, descripción, botón Nuevo recurso |
| `ResourcesSummaryCards` | Grid de cards por tipo con cantidad |
| `ResourcesFiltersBar` | Buscador + filtros rápidos |
| `ResourcesTable` | Tabla desktop |
| `ResourcesMobileList` | Lista cards en móvil |
| `ResourceCreateWizard` | Asistente 3 pasos |
| `ResourceTypeSelector` | Paso 1 — grid de tipos |
| `ResourceDynamicForm` | Paso 2 — campos por tipo |
| `ResourceReviewStep` | Paso 3 — revisión |
| `ResourceDetailHero` | Imagen, código, nombre, acciones |
| `ResourceDetailTabs` | Pestañas del detalle |
| `ResourceGeneralTab` | Atributos en secciones |
| `ResourceInventoryTab` | Stock resumen + link |
| `ResourceCostsTab` | Cards costo + historial |
| `ResourceDocumentsTab` | Lista documentos |
| `ResourcePhotosTab` | Galería + principal |
| `ResourceHistoryTimeline` | Timeline vertical |
| `ResourceRelationsPanel` | Recetas, lotes, compras |
| `ResourceTypeBadge` | Badge tipo (→ shared futuro) |
| `ResourceStatusBadge` | Badge estado |
| `ResourcesSubNav` | Subnavegación por tipo |

## Convenciones

- Solo presentación; sin `fetch`
- Props tipadas desde `../types`
- Estilos con Tailwind + shadcn; ver `09-design-system.md`
