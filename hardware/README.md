# Hardware

Documentación de hardware físico relacionado con BrewOS y BrewNode.

## Propósito

Esta carpeta centraliza referencias de equipamiento y electrónica:

- Esquemas de conexión ESP32 + sensores
- Listas de materiales (BOM) por dispositivo BrewNode
- Datasheets de sensores (temperatura, peso, pantallas)
- Documentación de equipamiento de producción (fermentadores, alambiques, etc.) cuando aplique a integración futura

## Estado actual

**Vacía.** Solo placeholder para documentación futura.

## Contenido previsto

```
hardware/
├── brewnode/         # Esquemas y BOM del nodo ESP32
├── sensors/          # Referencias de sensores
└── production/       # Equipamiento de planta (referencia cruzada con Recursos)
```

## Relación con otros módulos

- Equipamiento catalogado en BrewOS → módulo **Recursos**
- Esquemas y manuales técnicos → **Knowledge Base** (Sprint 8)
- Firmware que controla el hardware → carpeta `firmware/`

## Referencias

- [Firmware — BrewNode](../firmware/README.md)
- [Roadmap — Sprint 9](../docs/03-roadmap.md)
