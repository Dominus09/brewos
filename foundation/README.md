# Foundation

Decisiones fundacionales, referencias y material de contexto que no encaja en `docs/` ni en código.

## Propósito

La carpeta `foundation/` es el **archivo de origen** del proyecto: decisiones tomadas antes o durante el desarrollo que deben preservarse aunque el código evolucione.

Contenido típico:

- Actas de reuniones o decisiones de producto
- Referencias externas (normativas, papers, competidores)
- Borradores del Master Plan físico (planos, renders)
- ADRs (Architecture Decision Records) cuando se formalicen
- Notas de investigación (proveedores, equipos evaluados)

## Diferencia con `docs/`

| `docs/` | `foundation/` |
|---------|-----------------|
| Documentación curada y estable | Material de trabajo y referencia cruda |
| Visión, arquitectura, roadmap | Evidencia y contexto detrás de las decisiones |
| Lectura obligatoria para desarrolladores | Consulta según necesidad |

## Estado actual

**Vacía.** Lista para recibir material de contexto del equipo Insular Origins.

## Estructura sugerida

```
foundation/
├── decisions/        # ADRs
├── references/       # PDFs, enlaces exportados
├── master-plan/      # Planos y material del terreno
└── research/         # Investigación de mercado, equipos, etc.
```

## Referencias

- [07 — Master Plan](../docs/07-master-plan.md)
- [01 — Visión](../docs/01-vision.md)
