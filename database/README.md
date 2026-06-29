# Database

Esquemas, migraciones y datos semilla de **PostgreSQL** para BrewOS.

## Propósito

Esta carpeta alojará todo lo relacionado con la capa de persistencia:

- Migraciones versionadas (Alembic u herramienta equivalente)
- Scripts de seed para datos iniciales (unidades, categorías, roles)
- Diagramas ER actualizados
- Consultas de referencia o vistas materializadas (si aplica)

## Estado actual

**No implementado.** El modelo conceptual está definido en documentación; no hay SQL ni migraciones aún.

## Fuente de verdad conceptual

El diseño inicial de entidades está en [05 — Modelo de datos](../docs/05-data-model.md).

## Estructura prevista (futuro)

```
database/
├── migrations/       # Archivos de migración
├── seeds/            # Datos iniciales
└── diagrams/         # ER exportados
```

## Reglas

- Una sola base PostgreSQL para BrewCore
- Migraciones obligatorias; sin cambios manuales en producción
- Integridad referencial según el modelo conceptual

## Referencias

- [Modelo de datos](../docs/05-data-model.md)
- [Reglas de desarrollo](../docs/08-development-rules.md)
