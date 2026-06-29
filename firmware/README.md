# Firmware — BrewNode

Firmware para **ESP32** del ecosistema BrewNode: sensores, comunicación con BrewCore y pantalla local.

## Propósito

BrewNode es la capa de hardware de BrewOS. Vive separada de BrewCore y se comunica exclusivamente vía API REST.

Capacidades planificadas (Sprint 9):

- Lectura de sensores de temperatura
- Lectura de sensores de peso
- Envío de datos al backend FastAPI
- Pantalla local para visualización básica
- Operación con buffer local si la red no está disponible

## Estado actual

**No implementado.** Esta etapa no incluye firmware ni desarrollo de sensores.

## Separación BrewCore / BrewNode

| BrewCore | BrewNode |
|----------|----------|
| Plataforma web completa | Dispositivo embebido |
| Funciona sin hardware | Amplía capacidades; no reemplaza entrada manual |
| FastAPI + Next.js | C / MicroPython / Arduino en ESP32 |

## Regla

No iniciar desarrollo de firmware hasta que los módulos base de BrewCore (Sprints 1–6) estén estables.

## Referencias

- [Arquitectura — BrewNode](../docs/02-architecture.md)
- [Roadmap — Sprint 9](../docs/03-roadmap.md)
- [Hardware](../hardware/README.md)
