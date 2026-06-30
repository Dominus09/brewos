# ADR-0007: Estándar de identidad operacional

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principios 26–30](../11-product-principles.md) |
| **Documento normativo** | [18 — Identidad operacional](../18-operational-identity.md) |

---

## Contexto

BrewOS gestiona entidades que existen durante años (recursos, recetas, equipos) y operaciones que ocurren en minutos u horas (destilaciones, fermentaciones, órdenes de compra). Los operadores de Insular Origins trabajan en taller, jardín y laboratorio — con etiquetas físicas, conversación oral y reportes impresos — no frente a identificadores de base de datos.

PostgreSQL y la API REST usan **UUID** como clave primaria: correcto para integridad técnica, incorrecto como lenguaje humano.

Sin un estándar explícito, cada módulo tiende a inventar su propio formato (`INS-ALC-096`, `LOT-2024-001`, UUID truncado en pantalla), lo que:

- Dificulta auditorías y trazabilidad entre módulos
- Impide etiquetas QR coherentes en toda la operación
- Confunde al operador y al equipo de desarrollo
- Escala mal cuando se agregan industrias (cosmética, turismo, gourmet)

El documento [18 — Identidad operacional](../18-operational-identity.md) consolida el estándar visual y operativo. Este ADR **fija la decisión arquitectónica** que lo gobierna.

---

## Decisión

BrewOS adopta **dos identidades separadas e inmutables en su contrato**:

| Capa | Identificador | Visible al usuario |
|------|---------------|-------------------|
| Técnica | `id` (UUID) | **Nunca** |
| Operacional | `internal_code` / códigos de operación | **Siempre** |

### Reglas decisorias

1. **Ninguna pantalla, reporte, etiqueta ni exportación** muestra UUID al usuario final.
2. Todo maestro publicado recibe un código `BREW-{FAMILIA}-{SECUENCIA}` según [18 — §3](../18-operational-identity.md).
3. Toda operación transaccional recibe un código `{PREFIJO}-{YYYYMMDD}-{NNN}` según [18 — §4](../18-operational-identity.md).
4. Los códigos operacionales **no cambian** y **no se reutilizan** tras asignación.
5. La API **siempre** devuelve `id` + `internal_code` en entidades identificables; el frontend usa `internal_code` para display y búsqueda humana.
6. Nuevas industrias y líneas de negocio **no alteran** el prefijo corporativo `BREW-`; solo añaden contexto visual (icono, color de línea).

---

## Problema que resuelve

| Problema | Solución |
|----------|----------|
| Operador no puede citar un lote en voz alta | `DIS-20260701-001` memorable y único |
| Etiquetas de taller inconsistentes | Layout y QR estándar (doc 18 §8) |
| Reportes con identificadores distintos por módulo | Columna «Código» unificada |
| Desarrolladores exponen UUID en UI por comodidad | Contrato API y principios 26–27 |
| Escalada multi-industria fragmenta nomenclatura | Un solo árbol de prefijos gobernado |

---

## Consecuencias

### Positivas

- Lenguaje operativo único en toda Insular Origins durante décadas
- Trazabilidad citável en auditorías internas y externas
- QR y etiquetas físicas implementables una sola vez
- Frontend y reportes desacoplados del formato interno del UUID
- Integración futura entre schemas (`analytics.brewos`, `bsale`, etc.) por código legible

### Negativas / costos

- Servicio de generación de secuencias (concurrencia, unicidad) obligatorio antes de producción masiva
- Migración de códigos legacy si existían formatos previos (`INS-*`, etc.)
- Disciplina de equipo: code review debe rechazar UUID visible
- Nuevos prefijos de operación requieren gobernanza (no ad-hoc en código)

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Solo UUID en todo | Ilegible en taller; inutilizable en QR oral |
| Código = derivado del UUID (base62) | Parece aleatorio; no comunica familia ni fecha |
| Prefijo por línea de negocio (`DST-RES`, `CER-RES`) | Fragmenta estándar; dificulta reportes corporativos |
| Secuencia única global sin prefijos | No identifica tipo de entidad de un vistazo |
| SKU libre editable por usuario | Rompe inmutabilidad y unicidad garantizada |

---

## Implementación (fuera de alcance de este ADR)

Este ADR **no incluye código**. La implementación futura comprende:

- Tabla `operational_code_sequences` en `analytics.brewos`
- Servicio `OperationalCodeService` en backend
- Columna `internal_code` ya prevista en `resources` y extensible a otras entidades
- Tokens de color e iconografía en Design System (fase frontend)

---

## Referencias

- [18 — Identidad operacional](../18-operational-identity.md)
- [ADR-0005 — Recurso como entidad central](ADR-0005-resource-as-core-entity.md) — `internal_code` en recursos
- [ADR-0006 — Configuración dinámica](ADR-0006-dynamic-production-configuration.md) — nuevos procesos y prefijos gobernados
- [.foundation/naming-conventions.md](../../.foundation/naming-conventions.md)

---

*ADR-0007 — BrewOS / Insular Origins*
