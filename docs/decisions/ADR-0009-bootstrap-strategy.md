# ADR-0009: Estrategia de bootstrap modular

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins · Arquitectura BrewOS |
| **Supersede** | Enfoque monolítico `database/seeds/001_base_seed.sql` |
| **Documento normativo** | [20 — Estrategia de bootstrap](../20-bootstrap-strategy.md) |
| **Relacionado con** | [ADR-0006](ADR-0006-dynamic-production-configuration.md) · [ADR-0007](ADR-0007-operational-identity-standard.md) · [ADR-0008](ADR-0008-brewos-core-engine.md) |

---

## Contexto

BrewOS evolucionó con cuatro pilares arquitectónicos (recurso central, config dinámica, identidad operacional, Core Engine). La estrategia inicial de datos usaba:

- Un único archivo `001_base_seed.sql`
- `SET search_path TO brewos` sin garantizar el schema (responsabilidad mezclada con Alembic)
- Prefijos `INS`, `BOT`, `EQP` en `resource_types.code_prefix` — **incompatibles** con ADR-0007 (`BREW-RES-*`)
- Mezcla de bootstrap, configuración inicial y datos que deberían ser solo UI (ADR-0006)

Esto provocó errores en instalación (`relation brewos.business_lines does not exist`) y no escala a múltiples industrias ni tenants.

---

## Decisión

Adoptar una **estrategia de bootstrap modular** con separación estricta de responsabilidades:

```text
Alembic (schema)  →  verify (bootstrap/)  →  seeds modulares (seeds/)  →  UI (config dinámica)
```

### Reglas decisorias

1. **Solo Alembic** crea el schema `brewos` y las tablas.
2. **Seeds** insertan datos mínimos en archivos **uno por responsabilidad**; no crean schema.
3. Clasificación de datos: **Bootstrap (A)** · **Config inicial (B)** · **Config dinámica (C, solo UI)** · **Operacional (D, nunca seed)**.
4. **`code_prefix` en `resource_types` queda deprecado**; identidad operacional vía Identity Engine (ADR-0007/0008).
5. Nuevas industrias se incorporan por **plantillas UI** o seeds opcionales — no por un SQL monolítico.
6. Eliminar `001_base_seed.sql`; reemplazar por `001_units.sql`, `002_business_lines.sql`, `003_resource_types.sql`, etc.

---

## Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| Instalación predecible | Orden documentado; errores claros |
| Alineación ADR | Sin prefijos legacy; config dinámica en UI |
| Mantenibilidad | Un archivo = una responsabilidad |
| CI/CD | `alembic upgrade` + `run_all.sql` automatizable |
| Multi-industria | Plantillas importables sin tocar bootstrap universal |
| Separación schema/datos | No más `CREATE SCHEMA` en seeds |

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Más archivos que mantener | Numeración clara; `run_all.sql`; README por carpeta |
| Orden incorrecto de seeds | `run_all.sql` obligatorio; FK documentadas |
| Entornos con seed antiguo | Runbook de migración; no reutilizar `001_base_seed` |
| Admin borra tipos `is_system` | UI guardrails; seeds idempotentes para reparar |
| `code_prefix` en DB sin uso | Migración futura DROP COLUMN documentada |
| Confusión bootstrap vs UI | Tabla de clasificación en doc 20 |

---

## Consecuencias técnicas (futuras, fuera de este ADR)

- Reorganizar `database/seeds/` según doc 20
- Migración eliminando `resource_types.code_prefix`
- Tabla `operational_code_prefixes` + seed `004`
- Wizard «primer inicio» en frontend como alternativa a seed 003
- Pipeline deploy: verificar + seeds tras Alembic

---

## Alternativas consideradas

| Alternativa | Rechazo |
|-------------|---------|
| Seed monolítico mejorado | No escala; mezcla responsabilidades |
| Todo en migraciones Alembic (data + schema) | Datos de negocio no pertenecen a migraciones de esquema |
| Sin seeds — solo UI | Arranque en frío imposible sin tipos/unidades mínimas |
| `CREATE SCHEMA` en seed | Duplica Alembic; causa confusión operativa |
| Mantener `code_prefix` | Contradice ADR-0007 |

---

## Referencias

- [20 — Estrategia de bootstrap](../20-bootstrap-strategy.md)
- [18 — Identidad operacional](../18-operational-identity.md)
- [19 — Core Engine](../19-core-engine.md)

---

*ADR-0009 — BrewOS / Insular Origins*
