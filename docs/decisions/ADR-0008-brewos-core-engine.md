# ADR-0008: BrewOS Core Engine

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins · Arquitectura BrewOS |
| **Principios relacionados** | [11 — Principios 31–35](../11-product-principles.md) |
| **Documento normativo** | [19 — Core Engine](../19-core-engine.md) |
| **Relacionado con** | [ADR-0005](ADR-0005-resource-as-core-entity.md) · [ADR-0006](ADR-0006-dynamic-production-configuration.md) · [ADR-0007](ADR-0007-operational-identity-standard.md) |

---

## Contexto

BrewOS crece en módulos: Recursos, Inventario, Recetas, Producción, Jardín, Laboratorio, Compras, Reportes. Cada uno necesita capacidades **idénticas en política** pero **distintas en datos de negocio**:

- Códigos operacionales legibles ([ADR-0007](ADR-0007-operational-identity-standard.md), [18 — Identidad operacional](../18-operational-identity.md))
- Registro de quién hizo qué y cuándo
- Líneas de tiempo en vistas 360°
- Archivos adjuntos y fotos
- QR y etiquetas de taller
- Alertas y integraciones futuras (Bsale, BrewNode, IA)

Sin arquitectura transversal, cada sprint tiende a:

- Duplicar generación de secuencias en `ResourceService`, `BatchService`, etc.
- Olvidar auditoría en endpoints nuevos
- Crear tablas `resource_timeline`, `batch_timeline` incompatible entre sí
- Exponer UUID en UI «porque el endpoint ya devolvía `id`»
- Integrar Bsale con lógica copy-paste en un router

Los pilares ADR-0005 (recurso central), ADR-0006 (config dinámica) y ADR-0007 (identidad operacional) definen **qué** debe ocurrir. Falta **dónde** vive la implementación compartida.

---

## Decisión

BrewOS adopta un **Core Engine** transversal — infraestructura de dominio dentro de `backend/app/core/` — con ocho motores internos:

| Motor | Responsabilidad |
|-------|-----------------|
| **Identity Engine** | Códigos `BREW-*` y operaciones con fecha |
| **Event Engine** | Bus de eventos de dominio |
| **Audit Engine** | Registro forense append-only |
| **Timeline Engine** | Proyecciones 360° para UI |
| **File Engine** | Documentos y fotos unificados |
| **QR / Label Engine** | QR, plantillas, PDF/ZPL futuro |
| **Notification Engine** | Alertas internas (fase posterior) |
| **Integration Engine** | Bsale, Distribuidora, BrewNode, IA (fase posterior) |

### Reglas decisorias

1. Los **módulos de negocio** (services) **consumen** el Core Engine; no duplican sus capacidades.
2. Los **routers** no generan códigos, no escriben auditoría ni timeline directamente.
3. **Todo evento importante** se emite vía Event Engine; auditoría y timeline son **consecuencias** del evento.
4. El Core Engine **no contiene** lógica específica de industria (gin, cerveza, velas, cosmética).
5. **Dependencia unidireccional:** `services/` → `core/` → repositorios core; nunca `core/` → `services/`.

---

## Problema que resuelve

| Problema | Solución |
|----------|----------|
| Fragmentación de identidad operacional | Identity Engine único |
| Auditoría incompleta o inconsistente | Audit Engine desde eventos |
| Timelines incompatibles entre módulos | Timeline Engine derivado de catálogo de eventos |
| Side effects en routers | Event Engine + handlers |
| Archivos con políticas distintas | File Engine |
| Etiquetas reinventadas por módulo | Label Engine |
| Integraciones acopladas | Integration Engine |

---

## Beneficios

- **Consistencia operativa** en toda Insular Origins durante años
- **Un solo lugar** para evolucionar identidad (ADR-0007), auditoría y archivos
- **Testabilidad:** motores core mockeables; services de módulo más simples
- **Escalabilidad de equipo:** reglas claras — «¿es transversal? → core»
- **Preparación multi-integración** sin reescribir módulos base
- **Alineación con eventos** facilita notificaciones y analytics futuros

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Core Engine se convierte en «god object» | Motores separados por carpeta; interfaces pequeñas; prohibir lógica de negocio en core |
| Latencia por capas adicionales | Handlers audit/timeline async u outbox; Identity en misma TX sin I/O externo |
| Catálogo de eventos descontrolado | Registro en doc 19; nuevo evento = PR con actualización de catálogo |
| Duplicación evento + audit manual | Code review: audit solo vía handler; checklist backend |
| Equipo ignora Core en urgencias | Principios 31–35; rechazo en review si router hace side effects |
| Over-engineering en v1 | Implementar CE-1 (Identity + Event + Audit) primero; resto incremental |

---

## Consecuencias técnicas futuras

1. **Nuevas tablas** en `analytics.brewos`: `domain_events`, `audit_log`, `operational_code_sequences`, `files`, etc. (ver doc 19 §8).
2. **Estructura `backend/app/core/`** con subcarpetas por motor.
3. **Services de módulo** reciben dependencias Core vía `Depends()` o inyección en constructor.
4. **Tests:** unit tests por motor; integration tests de flujos (crear recurso → evento → audit).
5. **Frontend:** consume `internal_code` y timeline API unificada; no asume formato por módulo.
6. **OpenAPI:** schemas de timeline y audit read-only expuestos por módulos, datos producidos por Core.

---

## Relación con ADR-0005, ADR-0006 y ADR-0007

```text
ADR-0005 (Recurso central)
    └── ResourceService usa Core: Identity (BREW-RES), Event (Resource*), Timeline 360

ADR-0006 (Config dinámica)
    └── ConfigService emite ConfigPublished; no genera códigos fuera de prefijos registrados

ADR-0007 (Identidad operacional)
    └── Identity Engine implementa doc 18; único asignador de internal_code
```

El Core Engine **no supersede** los ADR anteriores; los **materializa** en infraestructura compartida.

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Cada módulo implementa su auditoría/timeline | Duplicación, inconsistencia, deuda técnica |
| Microservicio Core separado | Complejidad operativa prematura para escala Insular Origins |
| Solo librería utils (`code_generator.py`) | Sin eventos ni auditoría unificada; no escala |
| Event sourcing completo en todas las entidades | Sobrecarga; event log selectivo es suficiente |
| Timeline solo en frontend | Sin fuente única; reportes y auditoría rotos |

---

## Implementación

**Fuera de alcance de este ADR.** Orden sugerido: CE-1 Identity + Event + Audit → CE-2 Timeline + File → CE-3 Label → CE-4 Notification → CE-5 Integration.

Ver [19 — Core Engine §12](../19-core-engine.md).

---

## Referencias

- [19 — BrewOS Core Engine](../19-core-engine.md)
- [18 — Identidad operacional](../18-operational-identity.md)
- [.foundation/architecture-rules.md](../../.foundation/architecture-rules.md)
- [.foundation/backend-rules.md](../../.foundation/backend-rules.md)

---

*ADR-0008 — BrewOS / Insular Origins*
