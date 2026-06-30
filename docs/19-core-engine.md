# 19 — BrewOS Core Engine

**Núcleo transversal de infraestructura de dominio** que centraliza capacidades compartidas por todos los módulos de BrewOS.

**Documentos relacionados:** [18 — Identidad operacional](18-operational-identity.md) · [ADR-0007](decisions/ADR-0007-operational-identity-standard.md) · [ADR-0008](decisions/ADR-0008-brewos-core-engine.md)

**Estado:** CE-1 implementado (Identity + Event + Audit). Timeline, File, Label pendientes.

---

## 1. Propósito

El **Core Engine** es la capa de infraestructura de dominio que evita que cada módulo (Recursos, Producción, Jardín, Laboratorio, Compras…) reimplemente por separado:

- Generación de códigos operacionales
- Auditoría y trazabilidad de cambios
- Líneas de tiempo visibles (360°)
- Emisión y consumo de eventos
- Gestión de archivos y adjuntos
- QR y etiquetas físicas
- Notificaciones internas
- Integraciones externas futuras

### Qué es

> Infraestructura transversal, agnóstica de industria, que los **módulos de negocio consumen** — no duplican.

### Qué no es

- No es un módulo de UI
- No contiene lógica de gin, cerveza, velas, cosmética ni turismo
- No reemplaza los services de dominio (`ResourceService`, `BatchService`)
- No es un microservicio separado en v1 (vive dentro de `backend/app/core/`)

---

## 2. Problemas que resuelve

| Problema sin Core Engine | Con Core Engine |
|--------------------------|-----------------|
| Cada módulo genera códigos distintos | Un solo **Identity Engine** (ADR-0007) |
| Auditoría inconsistente o ausente | **Audit Engine** append-only unificado |
| Timelines duplicados por módulo | **Timeline Engine** derivado de eventos |
| Side effects dispersos en routers | **Event Engine** como bus de dominio |
| Archivos con políticas distintas | **File Engine** con metadatos y permisos comunes |
| QR/etiquetas reinventadas por sprint | **QR / Label Engine** centralizado |
| Alertas acopladas a cada feature | **Notification Engine** (futuro) |
| Integraciones Bsale/BrewNode ad-hoc | **Integration Engine** (futuro) |

---

## 3. Límites y fronteras

### El Core Engine SÍ hace

- Proveer APIs internas (Python) consumidas por services de módulo
- Persistir eventos, auditoría, secuencias, metadatos de archivos
- Aplicar políticas transversales (inmutabilidad de códigos, append-only audit)
- Construir proyecciones de lectura (timeline, historial de cambios)

### El Core Engine NO hace

- Validar reglas de negocio de un lote («¿puede cerrarse sin etapa X?») — eso es `BatchService`
- Definir taxonomía de recursos — eso es Configuración (ADR-0006)
- Renderizar UI o exponer endpoints HTTP propios (salvo webhooks de integración futuros)
- Calcular costos de receta o stock — módulos de dominio
- Decidir si un recurso es inventariable — flags del recurso + config

### Regla de oro

```text
Módulo de negocio  →  orquesta  →  Core Engine  →  persistencia transversal
                     nunca al revés
```

---

## 4. Motores internos

### 4.1 Identity Engine

**Responsable de toda identidad operacional** según [18 — Identidad operacional](18-operational-identity.md).

| Responsabilidad | Detalle |
|-----------------|---------|
| Generar `internal_code` | Único punto de asignación |
| Prefijos oficiales | `BREW-RES`, `DIS`, `PO`, etc. desde registro |
| Secuencias transaccionales | Lock por prefijo (+ fecha si aplica) |
| Códigos maestros | `BREW-{FAMILIA}-{NNNNNN}` — sin reinicio |
| Códigos operacionales | `{PREFIJO}-{YYYYMMDD}-{NNN}` — reinicio diario |
| Anti-duplicados | `UNIQUE` + reserva atómica en transacción |
| Prohibición UUID visible | Nunca devuelve ni deriva código desde `id` |

### Implementación CE-1 (backend)

```text
backend/app/core/
├── identity/
│   ├── engine.py              # IdentityEngine facade
│   ├── prefix_registry.py     # Lee operational_code_prefixes
│   ├── sequence_manager.py    # SELECT FOR UPDATE + operational_sequences
│   └── code_generator.py      # BREW-RES-000001 / DIS-YYYYMMDD-NNN
├── events/
│   ├── event_types.py         # ResourceCreated, OperationalCodeGenerated, …
│   └── event_engine.py        # Persiste domain_events
└── audit/
    └── audit_engine.py        # Deriva audit_log desde eventos
```

**Uso interno (dentro de transacción de service):**

```python
from app.core.identity import IdentityEngine
from app.core.events import EventEngine

identity = IdentityEngine()
code = identity.assign_master_code(session, "resource")  # → BREW-RES-000001
dis = identity.assign_operation_code(session, prefix="DIS")  # → DIS-20260701-001

EventEngine().emit_resource_created(session, entity_id=..., internal_code=code, after_data={...})
```

### Implementación CE-2 (ResourceService)

```text
POST /api/v1/resources          → ResourceService.create_draft()     (sin internal_code)
POST /api/v1/resources/{id}/publish → IdentityEngine + EventEngine + AuditEngine
PATCH /api/v1/resources/{id}  → ResourceService.update()         (ResourceUpdated si active)
```

Regla: `internal_code` **solo al publicar**. Borradores tienen `internal_code = NULL`.

---

### 4.2 Event Engine

**Bus de eventos de dominio** — todo hecho significativo emite un evento tipado.

| Responsabilidad | Detalle |
|-----------------|---------|
| Emitir eventos | Después de commit exitoso del agregado (o dentro de misma TX según política) |
| Esquema estable | `event_type`, `aggregate_type`, `aggregate_id`, `payload`, `metadata` |
| Idempotencia | `event_id` UUID; consumidores pueden deduplicar |
| Desacoplamiento | Audit, Timeline y Notification **escuchan** eventos |

**Eventos mínimos v1 (catálogo inicial):**

| Evento | Agregado | Cuándo |
|--------|----------|--------|
| `ResourceCreated` | `resource` | Alta publicada |
| `ResourceUpdated` | `resource` | Cambio de campos |
| `ResourceArchived` | `resource` | Soft delete / archivado |
| `RecipeCreated` | `recipe` | Nueva receta |
| `RecipePublished` | `recipe_version` | Versión publicada |
| `ProductionStarted` | `batch` | Inicio de lote |
| `ProductionFinished` | `batch` | Cierre de lote |
| `HarvestRegistered` | `harvest` | Cosecha registrada |
| `DocumentUploaded` | `file` | Archivo persistido |
| `PhotoAdded` | `file` | Foto asociada |
| `SupplierAdded` | `resource_supplier` | Vínculo proveedor-recurso |
| `CostUpdated` | `resource_cost` | Nuevo registro de costo |
| `InventoryMovementRecorded` | `inventory_movement` | Entrada/salida/ajuste |
| `TraceabilityEventRecorded` | `traceability_event` | Evento en lote |
| `ConfigPublished` | `dynamic_form_version` | Formulario publicado |

**API interna futura:**

```text
EventEngine.emit(event: DomainEvent, *, tx) → event_id
EventEngine.subscribe(event_type, handler)
```

---

### 4.3 Audit Engine

**Registro forense append-only** de acciones sobre el sistema.

| Campo | Descripción |
|-------|-------------|
| `actor_id` | Usuario (`BREW-USR-…`) |
| `action` | `create`, `update`, `archive`, `publish`, … |
| `entity_type` / `entity_id` | Qué se afectó |
| `occurred_at` | Timestamp UTC |
| `source` | `api`, `import`, `integration`, `system` |
| `request_context` | IP, user-agent, correlation_id (opcional) |
| `changes` | JSON before/after cuando aplica |

| Regla | Detalle |
|-------|---------|
| Append-only | Sin UPDATE ni DELETE en registros de auditoría |
| Consecuencia de evento | Audit escribe al procesar evento, no manualmente en router |
| Retención | Mínimo 7 años recomendado para operación artesanal regulada |

---

### 4.4 Timeline Engine

**Proyección de lectura** para vistas 360° del operador.

| Vista | Entidades enlazadas |
|-------|---------------------|
| Recurso 360 | Eventos de recurso, costos, documentos, fotos, movimientos, lotes que lo consumieron |
| Lote 360 | Etapas, trazabilidad, consumos, documentos, fotos |
| Planta 360 | Cosechas, observaciones, fotos, recursos botánicos |
| Receta 360 | Versiones, publicaciones, lotes que la usaron |

| Regla | Detalle |
|-------|---------|
| Derivado | Timeline se **construye** desde eventos + metadatos; no se escribe ad-hoc |
| Orden | `occurred_at` descendente; agrupación por día en UI |
| Presentación | Icono + color según doc 18; código operacional siempre visible |

---

### 4.5 File Engine

**Gestión unificada de archivos** vinculados a entidades.

| Tipo | Ejemplos |
|------|----------|
| Documentos | Ficha técnica, MSDS, certificados, facturas, manuales |
| Fotos | Producto, equipo, planta, proceso |

| Responsabilidad | Detalle |
|-----------------|---------|
| Metadatos | `file_name`, `mime_type`, `size`, `checksum`, `storage_key` |
| Política de almacenamiento | Local / S3 / MinIO — abstracto detrás del engine |
| Vínculo polimórfico | `entity_type` + `entity_id` (recurso, lote, proveedor…) |
| Emisión de evento | `DocumentUploaded` / `PhotoAdded` tras persistir |
| URLs | Firmadas o públicas según política; nunca UUID en path visible |

---

### 4.6 QR / Label Engine

**Generación de códigos QR y plantillas de etiqueta** según doc 18 §8.

| Responsabilidad | Detalle |
|-----------------|---------|
| Payload QR | Código operacional (`DIS-20260701-001`) |
| URL estable | `https://tv.quillotana.cl/q/{code}` (futuro) |
| Plantillas | Layout taller: icono, código, nombre, estado, QR |
| Formatos salida | PNG/SVG (pantalla), PDF (impresión), ZPL (térmica, futuro) |
| Sin lógica de negocio | Solo renderiza datos que el módulo provee |

---

### 4.7 Notification Engine (futuro)

| Canal | Uso |
|-------|-----|
| In-app | Centro de Control, badge de alertas |
| Email / push | Opcional, fase posterior |

| Trigger (ejemplos) | Evento origen |
|--------------------|---------------|
| Stock mínimo | `InventoryMovementRecorded` + regla |
| Vencimiento próximo | Job programado + recurso |
| Lote pendiente cierre | `ProductionStarted` + tiempo |
| Sensor umbral | `IntegrationEngine` → evento |

---

### 4.8 Integration Engine (futuro)

| Integración | Dirección | Notas |
|-------------|-----------|-------|
| Bsale | Bidireccional | Productos, ventas — schema `bsale` |
| Distribuidora | Lectura / sync | Schema `distribuidora` |
| BrewNode | Ingesta | Sensores → eventos |
| IA | Lectura | Análisis sobre eventos agregados |
| Reportes externos | Export | CSV/PDF vía File Engine |

| Regla | Integración **nunca** escribe auditoría directamente; emite eventos o llama services |

---

## 5. Arquitectura futura sugerida

```text
backend/app/
├── main.py
├── api/v1/routers/          # HTTP delgado — sin side effects transversales
├── services/                # Módulos de negocio (orquestan Core + repos)
│   ├── resource_service.py
│   ├── batch_service.py
│   └── ...
├── repositories/            # Persistencia por agregado
├── models/                  # ORM tablas de negocio
├── schemas/
└── core/                    # ← BrewOS Core Engine
    ├── config.py
    ├── database_schema.py
    ├── dependencies.py
    ├── exceptions.py
    ├── identity/
    │   ├── engine.py
    │   ├── prefixes.py
    │   └── sequences.py
    ├── events/
    │   ├── engine.py
    │   ├── catalog.py
    │   └── handlers/
    ├── audit/
    │   ├── engine.py
    │   └── repository.py
    ├── timeline/
    │   ├── engine.py
    │   └── projections/
    ├── files/
    │   ├── engine.py
    │   ├── storage.py
    │   └── policies.py
    ├── labels/
    │   ├── qr.py
    │   └── templates/
    ├── notifications/       # fase posterior
    │   └── engine.py
    └── integrations/        # fase posterior
        ├── bsale/
        └── brewnode/
```

### Diagrama de dependencias

```text
┌─────────────────────────────────────────────────────────────┐
│  Routers (api/v1)                                           │
└───────────────────────────┬─────────────────────────────────┘
                            │ llama solo
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Services de módulo (ResourceService, BatchService, …)      │
└───────────────────────────┬─────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Repositories │  │ Core Engine  │  │ Domain rules │
│  (negocio)   │  │  (motores)   │  │  (opcional)  │
└──────────────┘  └──────┬───────┘  └──────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     ▼         ▼         ▼         ▼         ▼
 Identity   Event    Audit   Timeline   File/Label
```

**Prohibido:** `core/` importando `services/resource_service.py`  
**Correcto:** `ResourceService` importa `IdentityEngine`, `EventEngine`

---

## 6. Flujos de ejemplo

### 6.1 Crear recurso (publicar)

```text
1. Router POST /api/v1/resources
2. ResourceService.create(data, actor, ctx)
   a. Validar tipo/subtipo contra Config (ADR-0006)
   b. Validar flags según tipo
   c. BEGIN TRANSACTION
   d. IdentityEngine.assign_master_code("resource") → BREW-RES-000043
   e. ResourceRepository.create({... internal_code ...})
   f. EventEngine.emit(ResourceCreated, payload)
   g. COMMIT
3. (async o inline post-commit)
   h. AuditEngine.record from ResourceCreated
   i. TimelineEngine.project ResourceCreated
4. Router devuelve ResourceRead { id, internal_code, name }
```

**Prohibido en este flujo:** router genera código; service escribe audit_log manualmente; service inserta fila timeline directamente.

---

### 6.2 Iniciar producción

```text
1. BatchService.start(recipe_version_id, actor, ctx)
   a. Validar receta publicada, recursos disponibles (reglas de negocio)
   b. BEGIN TRANSACTION
   c. master = IdentityEngine.assign_master_code("batch") → BREW-BAT-000128
   d. operation = IdentityEngine.assign_operation_code("DIS") → DIS-20260701-003
   e. BatchRepository.create({ master_code, operation_code, ... })
   f. EventEngine.emit(ProductionStarted, { batch_id, operation_code, recipe_version_id })
   g. COMMIT
2. Audit + Timeline desde evento
3. LabelEngine puede generar QR para DIS-20260701-003 bajo demanda
```

---

### 6.3 Registrar cosecha

```text
1. HarvestService.register(plant_id, quantity, actor, ctx)
   a. Validar planta activa, recurso botánico vinculado
   b. BEGIN TRANSACTION
   c. operation = IdentityEngine.assign_operation_code("HAR") → HAR-20260715-002
   d. HarvestRepository.create(...)
   e. EventEngine.emit(HarvestRegistered, ...)
   f. (opcional) InventoryService.movement from harvest — emite InventoryMovementRecorded
   g. COMMIT
2. Timeline Planta 360 actualizada vía proyección
```

---

### 6.4 Subir documento

```text
1. ResourceService.attach_document(resource_id, file, doc_type, actor, ctx)
   a. Validar recurso existe y permisos
   b. FileEngine.store(file, entity_type=resource, entity_id)
   c. BEGIN TRANSACTION
   d. ResourceDocumentRepository.create(metadata from FileEngine)
   e. EventEngine.emit(DocumentUploaded, { file_id, document_type, resource_id })
   f. COMMIT
2. Audit + Timeline desde evento
```

---

## 7. Comunicación con módulos

| Patrón | Uso |
|--------|-----|
| **Llamada síncrona** | Identity, File store, Label render en el mismo request |
| **Evento + handler** | Audit, Timeline, Notification post-commit |
| **Proyección bajo demanda** | Timeline 360 al abrir detalle (query sobre eventos + tablas) |
| **Outbox (futuro)** | Si handlers async fallan, reintento desde `core_outbox` |

Los **services de módulo** son el único punto que combina reglas de negocio + Core Engine. Los **routers** solo invocan un método de service.

---

## 8. Tablas futuras (schema `brewos`)

| Tabla | Motor | Propósito |
|-------|-------|-----------|
| `operational_sequences` | Identity | Secuencia transaccional por prefijo (+ fecha) |
| `operational_code_prefixes` | Identity | Registro de prefijos válidos (seed 004) |
| `domain_events` | Event | Log de eventos emitidos |
| `audit_log` | Audit | Registro forense append-only |
| `timeline_entries` | Timeline | Proyección materializada (opcional; puede ser vista) |
| `files` | File | Metadatos de archivos |
| `file_links` | File | Vínculo polimórfico entidad ↔ archivo |
| `label_templates` | Label | Plantillas de etiqueta versionadas |
| `notifications` | Notification | Alertas pendientes/leídas |
| `integration_jobs` | Integration | Cola de sync externa |
| `core_outbox` | Event | Outbox pattern para handlers |

Las tablas de negocio existentes (`resources`, `resource_documents`, …) **permanecen** en módulos; el Core añade tablas transversales.

---

## 9. Servicios backend futuros

| Servicio Core | Consumido por |
|---------------|---------------|
| `IdentityEngine` | Todos los services que publican entidades u operaciones |
| `EventEngine` | Todos los services tras mutación significativa |
| `AuditEngine` | Handlers de eventos (no services directamente, salvo casos system) |
| `TimelineEngine` | Routers de detalle 360, reportes |
| `FileEngine` | Resources, Production, Laboratory, Purchases |
| `LabelEngine` | Production, Inventory, Resources (impresión) |
| `NotificationEngine` | Control Center, jobs |
| `IntegrationEngine` | Workers background |

---

## 10. Reglas de diseño

| # | Regla |
|---|-------|
| 1 | **Ningún router** genera códigos, escribe auditoría ni inserta timeline |
| 2 | **Todo evento importante** pasa por Event Engine |
| 3 | **Auditoría y timeline** son consecuencia del evento, no del router |
| 4 | **Códigos visibles** solo desde Identity Engine (ADR-0007) |
| 5 | **Archivos y etiquetas** siguen política común del File/Label Engine |
| 6 | **Core no conoce** reglas de gin, fermentación ni cosmética |
| 7 | **Dependencia unidireccional:** módulos → core, nunca core → módulos |
| 8 | **Transacciones:** Identity + persistencia agregado + emit en misma TX cuando sea posible |
| 9 | **Handlers idempotentes** ante reentrega de eventos |
| 10 | **Nuevos eventos** se documentan en catálogo antes de implementar |

---

## 11. Relación con ADRs existentes

| ADR | Relación con Core Engine |
|-----|--------------------------|
| **ADR-0005** Recurso central | Identity asigna `BREW-RES-*`; eventos de recurso alimentan timeline 360 |
| **ADR-0006** Config dinámica | `ConfigPublished` es evento; Identity no genera códigos de config arbitraria sin prefijo registrado |
| **ADR-0007** Identidad operacional | Identity Engine es la **implementación** del estándar doc 18 |

---

## 12. Fases de implementación sugeridas

| Fase | Motores | Prioridad |
|------|---------|-----------|
| **CE-1** | Identity + Event + Audit | **Implementado** — `backend/app/core/{identity,events,audit}/`, migración `003` |
| **CE-2 (actual)** | `ResourceService`, API `/api/v1/resources`, migración DROP `code_prefix` |
| **CE-3** | Timeline + File | Recurso 360, documentos |
| **CE-4** | Notification | Centro de Control alertas |
| **CE-5** | Integration | Bsale, BrewNode |

---

## Referencias

- [ADR-0008 — BrewOS Core Engine](decisions/ADR-0008-brewos-core-engine.md)
- [18 — Identidad operacional](18-operational-identity.md)
- [.foundation/architecture-rules.md](../.foundation/architecture-rules.md)
- [.foundation/backend-rules.md](../.foundation/backend-rules.md)

---

*Documento v1.0 — BrewOS Core Engine / Insular Origins — Pilar del proyecto*
