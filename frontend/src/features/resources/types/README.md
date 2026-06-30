# resources/types

Contratos TypeScript del módulo Recursos. Alineados con documentación de dominio (sin espejar DB literalmente).

## Archivos planificados

| Archivo | Contenido |
|---------|-----------|
| `resource.ts` | `Resource`, flags, estados globales |
| `resource-type.ts` | `ResourceType`, `ResourceSubtype` — 10 tipos |
| `resource-filters.ts` | Filtros de lista, sort, pagination |
| `resource-wizard.ts` | Pasos, payload por tipo |
| `resource-history.ts` | Eventos de timeline |
| `resource-relations.ts` | Recetas, lotes, compras vinculadas |
| `resource-document.ts` | Tipos de documento (MSDS, manual, etc.) |
| `resource-cost.ts` | Costos y historial |

## Mapeo dominio → tipos

| Doc | Tipo TS |
|-----|---------|
| Estado global (14-lifecycle) | `ResourceStatus: 'draft' \| 'active' \| 'inactive' \| 'archived'` |
| 10 tipos (13-taxonomy) | `ResourceTypeId` enum o union |
| Flags (12-domain) | `ResourceFlags` interface |

## Convención

- Identificadores en **inglés** (ADR-0001)
- Labels para UI en archivos de config/i18n, no en tipos
