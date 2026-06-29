# Docker

Configuración de contenedores y despliegue para BrewOS en **Coolify**.

## Propósito

Esta carpeta centralizará la infraestructura como código:

- `Dockerfile` para backend (FastAPI) y frontend (Next.js)
- `docker-compose.yml` para desarrollo local
- Configuración de servicios (PostgreSQL, reverse proxy)
- Variables de entorno de ejemplo (`.env.example`)
- Notas de despliegue en Coolify

## Estado actual

**No implementado.** Sin `docker-compose` ni Dockerfiles en esta etapa.

## Entornos

| Entorno | Dominio / notas |
|---------|-----------------|
| Desarrollo | Local con Docker Compose |
| Staging / temporal | tv.quillotana.cl |
| Producción futura | brewos.quillotana.cl |

## Estructura prevista (futuro)

```
docker/
├── docker-compose.yml
├── docker-compose.dev.yml
├── backend.Dockerfile
├── frontend.Dockerfile
└── coolify/          # Notas y config específica de Coolify
```

## Referencias

- [Arquitectura — Despliegue](../docs/02-architecture.md)
