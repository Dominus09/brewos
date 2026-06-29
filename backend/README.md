# Backend

API REST de BrewOS construida con **FastAPI**.

## Propósito

Esta carpeta alojará el servidor backend de BrewCore:

- Autenticación y autorización
- Lógica de negocio por módulo (recursos, inventario, recetas, producción, etc.)
- Exposición de endpoints REST consumidos por el frontend
- Integración futura con BrewNode (ESP32) vía la misma API

## Estado actual

**No implementado.** Sprint 0 — solo estructura y documentación.

## Estructura prevista (futuro)

```
backend/
├── app/
│   ├── api/          # Routers por módulo
│   ├── core/         # Config, seguridad, dependencias
│   ├── models/       # Modelos SQLAlchemy o equivalente
│   ├── schemas/      # Pydantic (request/response)
│   └── services/     # Lógica de negocio
├── tests/
└── requirements.txt
```

## Referencias

- [Arquitectura](../docs/02-architecture.md)
- [Modelo de datos](../docs/05-data-model.md)
- [Reglas de desarrollo](../docs/08-development-rules.md)
