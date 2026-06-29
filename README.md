# BrewOS

**BrewOS** es la plataforma digital de **Insular Origins**: un sistema web responsive para gestionar de forma integral una operación artesanal de cervecería, destilería, jardín botánico y laboratorio de producción.

No es una app de sensores. Es un **ERP/LIMS artesanal** que centraliza recursos, inventario, recetas, producción, trazabilidad, jardín botánico, costos y documentación del proyecto — desde el patio de casa hasta una operación de escala mayor.

## ¿Qué resuelve?

BrewOS permite administrar todo lo que se usa, se produce y se aprende en una futura cervecería y destilería:

- **Recursos** — insumos, equipamiento, botánicos, envases, herramientas y proveedores
- **Inventario** — entradas, salidas, ajustes y costos
- **Recetas** — formulaciones versionadas con rendimiento y costo estimado
- **Producción** — lotes, etapas y consumo de inventario
- **Trazabilidad** — historial completo por lote: qué se usó, cuánto costó, fotos y notas
- **Jardín botánico** — especies, plantaciones, cosechas y su relación con la producción
- **Knowledge Base** — biblioteca, procedimientos, normativas y bitácora del proyecto

## Enfoque

- **Responsive desde el inicio** — usable en PC, tablet y celular
- **Documentar todo desde el origen** — cada decisión, lote y recurso queda registrado
- **Primero simple, luego escalable** — nace pequeño en un patio, preparado para crecer
- **Integración futura** — más adelante se conectará con **BrewNode** (ESP32) para sensores y monitoreo local; en esta primera etapa no hay firmware ni hardware implementado

## Stack previsto

| Capa        | Tecnología   |
|-------------|--------------|
| Frontend    | Next.js      |
| Backend     | FastAPI      |
| Base de datos | PostgreSQL |
| Deploy      | Coolify      |

**Dominio temporal:** [tv.quillotana.cl](https://tv.quillotana.cl)  
**Dominio futuro:** brewos.quillotana.cl

## Estructura del repositorio

```
brewos/
├── docs/           # Visión, arquitectura, roadmap y reglas
├── backend/        # API FastAPI (futuro)
├── frontend/       # App Next.js (futuro)
├── database/       # Esquemas y migraciones (futuro)
├── docker/         # Contenedores y despliegue (futuro)
├── firmware/       # BrewNode / ESP32 (futuro)
├── hardware/       # Documentación de hardware (futuro)
├── assets/         # Marca, iconos e imágenes
└── foundation/     # Decisiones fundacionales y referencias
```

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [01 — Visión](docs/01-vision.md) | Propósito y filosofía del proyecto |
| [02 — Arquitectura](docs/02-architecture.md) | Stack, capas y separación BrewCore / BrewNode |
| [03 — Roadmap](docs/03-roadmap.md) | Sprints planificados |
| [04 — Módulos](docs/04-modules.md) | Módulos funcionales y preguntas que responden |
| [05 — Modelo de datos](docs/05-data-model.md) | Entidades conceptuales iniciales |
| [06 — Dirección de marca](docs/06-brand-direction.md) | Identidad visual Insular Origins |
| [07 — Master Plan](docs/07-master-plan.md) | Visión del terreno y zonas futuras |
| [08 — Reglas de desarrollo](docs/08-development-rules.md) | Principios para implementar el sistema |

## Estado actual

**Sprint 0 — Fundación.** Este repositorio contiene únicamente estructura, documentación y visión de producto. No hay código de aplicación, dependencias ni despliegue configurado aún.

## Licencia y propiedad

Proyecto privado de **Insular Origins** / Quillotana.
