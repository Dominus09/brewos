# Features

Código organizado por dominio funcional. Cada módulo de BrewOS tendrá su carpeta aquí.

```
features/
├── control-center/     # Centro de Control
├── resources/          # Recursos (Sprint 3)
├── inventory/          # Inventario
├── recipes/            # Recetas
├── production/         # Producción
├── traceability/       # Trazabilidad
├── botanical-garden/   # Jardín Botánico
├── laboratory/         # Laboratorio
├── reports/            # Reportes
├── settings/           # Configuración
└── shared/             # Componentes compartidos entre features
```

Regla: un feature no importa componentes internos de otro feature. Usar `components/` o `shared/` para UI transversal.
