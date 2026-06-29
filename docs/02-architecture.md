# 02 — Arquitectura

## Visión general

BrewOS sigue una arquitectura en capas con separación clara entre la plataforma web (**BrewCore**) y el ecosistema de sensores embebidos (**BrewNode**). En la primera etapa solo se define y documenta BrewCore; BrewNode queda planificado para sprints futuros.

```
┌─────────────────────────────────────────────────────────────┐
│                      Clientes                               │
│         PC · Tablet · Móvil · (futuro) Pantalla ESP32       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Frontend — Next.js                        │
│         UI responsive · SSR/SSG · consumo de API REST       │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS / REST
┌─────────────────────────▼───────────────────────────────────┐
│                   Backend — FastAPI                         │
│    Autenticación · Módulos · Lógica de negocio · API REST   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  PostgreSQL                                 │
│         Datos transaccionales · Trazabilidad · Archivos     │
└─────────────────────────────────────────────────────────────┘

          (futuro) BrewNode / ESP32 ──REST──► Backend
```

## BrewCore vs BrewNode

| Componente | Rol | Estado |
|------------|-----|--------|
| **BrewCore** | Plataforma web: gestión, inventario, recetas, producción, trazabilidad, jardín, knowledge base | Sprint 0–8 |
| **BrewNode** | Firmware ESP32: sensores (temperatura, peso), comunicación con API, pantalla local | Sprint 9+ |

**Regla de separación:** BrewCore no depende de BrewNode para operar. Los módulos base deben funcionar al 100 % con entrada manual. BrewNode amplía capacidades; no las reemplaza.

## Stack tecnológico

### Frontend — Next.js

- Aplicación web responsive (PC, tablet, móvil)
- Consumo de API REST del backend
- Rutas y layouts por módulo funcional
- Preparado para autenticación basada en sesión o token

### Backend — FastAPI

- API REST como contrato principal entre frontend y datos
- Validación de datos con Pydantic
- Autenticación y autorización por roles
- Módulos alineados con la estructura funcional de BrewOS

### Base de datos — PostgreSQL

- Fuente única de verdad para datos transaccionales
- Relaciones fuertes para trazabilidad e integridad referencial
- Migraciones versionadas (cuando se implemente la capa `database/`)

### Despliegue — Coolify

- Contenedores Docker gestionados por Coolify
- Dominio temporal: `tv.quillotana.cl`
- Dominio futuro: `brewos.quillotana.cl`
- Variables de entorno para configuración por ambiente

## API REST (fase inicial)

La comunicación entre frontend y backend será **REST** en la primera etapa:

- Endpoints por recurso y módulo (`/api/v1/...`)
- Respuestas JSON
- Códigos HTTP estándar
- Paginación y filtros en listados
- Autenticación vía header (Bearer token o equivalente)

No se planifica GraphQL ni WebSockets en la fase inicial. Eventos en tiempo real (sensores BrewNode) se evaluarán en Sprint 9.

## Firmware — ESP32 (futuro)

BrewNode enviará lecturas de sensores al backend vía API REST. El firmware vivirá en `firmware/` y no compartirá código con BrewCore, solo el contrato de API.

Capacidades previstas:

- Lectura de temperatura y peso
- Envío periódico o bajo demanda a la API
- Pantalla local para visualización básica
- Operación autónoma si la red falla (buffer local, sincronización posterior)

## Estructura del monorepo

```
brewos/
├── frontend/     # App Next.js
├── backend/      # API FastAPI
├── database/     # Migraciones y seeds
├── docker/       # Compose, Dockerfiles, config Coolify
├── firmware/     # BrewNode / ESP32
├── hardware/     # Esquemas y docs de hardware
├── assets/       # Marca e imágenes
├── foundation/   # Referencias y decisiones base
└── docs/         # Documentación de producto y arquitectura
```

## Principios arquitectónicos

1. **Una fuente de verdad** — PostgreSQL centraliza todos los datos de negocio
2. **API como contrato** — Frontend y firmware consumen la misma API
3. **Módulos desacoplados** — Cada área funcional tiene límites claros en backend y frontend
4. **Responsive first** — La UI se diseña para móvil y escala hacia escritorio
5. **Manual primero, sensores después** — Ningún módulo base requiere hardware
6. **Trazabilidad por diseño** — Movimientos de inventario, lotes y eventos son auditables

## Seguridad (dirección)

- Autenticación obligatoria en todos los endpoints excepto login
- Roles con permisos por módulo
- HTTPS en producción
- Secretos solo en variables de entorno, nunca en el repositorio
- Validación de entrada en backend (no confiar solo en frontend)
