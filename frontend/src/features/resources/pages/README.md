# resources/pages

Composición de pantallas del módulo Recursos. Cada archivo exporta la vista completa de una ruta.

## Páginas planificadas

| Archivo (futuro) | Ruta App Router |
|------------------|-----------------|
| `resources-list-page.tsx` | `app/(app)/resources/page.tsx` |
| `resource-create-wizard-page.tsx` | `app/(app)/resources/new/page.tsx` |
| `resource-detail-page.tsx` | `app/(app)/resources/[id]/page.tsx` |
| `resource-edit-page.tsx` | `app/(app)/resources/[id]/edit/page.tsx` |
| `suppliers-page.tsx` | `app/(app)/resources/suppliers/page.tsx` |
| `units-page.tsx` | `app/(app)/resources/units/page.tsx` |
| `categories-page.tsx` | `app/(app)/resources/categories/page.tsx` |
| `tags-page.tsx` | `app/(app)/resources/tags/page.tsx` |

## Patrón

```text
page.tsx (app/)     →  import { XxxPage } from '@/features/resources/pages/...'
XxxPage             →  compone components/ + layouts existentes
```

Las rutas en `app/` deben permanecer delgadas (metadata + export default).
