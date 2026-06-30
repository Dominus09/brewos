# 20 — Estrategia de bootstrap

**Estrategia oficial de inicialización de BrewOS** — desde instalación en cero hasta operación con configuración administrada en UI.

**Documentos relacionados:** [ADR-0009](decisions/ADR-0009-bootstrap-strategy.md) · [18 — Identidad operacional](18-operational-identity.md) · [19 — Core Engine](19-core-engine.md)

**Estado:** Aceptado. Supersede el enfoque monolítico `001_base_seed.sql`.

---

## 1. Filosofía

BrewOS debe poder **instalarse desde cero** con un proceso:

- **Determinista** — mismo orden en dev, staging y producción
- **Modular** — un archivo, una responsabilidad
- **Mínimo** — solo lo indispensable para arrancar; el resto en UI (ADR-0006)
- **Alineado** — ADR-0005 (recurso), ADR-0006 (config dinámica), ADR-0007 (identidad), ADR-0008 (Core Engine)
- **Mantenible 10+ años** — nuevas industrias = nuevos seeds opcionales o plantillas UI, no un SQL gigante

### Principio rector

> **El esquema lo crean las migraciones. Los seeds solo insertan datos mínimos. La configuración rica la crea el administrador en la interfaz.**

### Qué NO es bootstrap

- Datos de demostración o mock
- Recursos, recetas, lotes, inventario de ejemplo
- Categorías, subtipos, procesos y formularios completos de Insular Origins hardcodeados
- Creación del schema `brewos` vía SQL manual en operación normal

---

## 2. Flujo completo de inicialización

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. BOOTSTRAP DE PLATAFORMA (infra / ops)                        │
│    Base analytics existe · usuario DB con permisos en brewos    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. SCHEMA (Alembic — única fuente de verdad)                    │
│    CREATE SCHEMA brewos · tablas · índices · alembic_version    │
│    Comando: cd backend && alembic upgrade head                  │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. VERIFICACIÓN (bootstrap/000_verify_prerequisites.sql)        │
│    Schema brewos existe · tablas mínimas · migración al head    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. SEEDS MÍNIMOS (database/seeds/ en orden numérico)            │
│    001 units · 002 business_lines · 003 resource_types · …      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. CONFIGURACIÓN INICIAL (seeds opcionales o wizard primer run)  │
│    Plantilla industria Insular Origins · prefijos Identity      │
│    Puede completarse en UI en lugar de SQL                      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. PRIMER INICIO BrewOS (API + frontend)                        │
│    Health OK · catálogo mínimo cargado · sin datos operativos   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. CONFIGURACIÓN DESDE UI (Administración de Producción)        │
│    Categorías · subtipos · formularios · procesos · estados     │
│    Import plantilla industria · ajuste sin código               │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. OPERACIÓN                                                    │
│    Recursos · inventario · producción — datos creados por users │
│    Identity Engine asigna BREW-RES-* al publicar recursos       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Responsabilidades por capa

| Capa | Responsable | Artefacto | Crea schema |
|------|-------------|-----------|-------------|
| Infraestructura | Ops / DBA | Base `analytics`, roles | No |
| Esquema | **Alembic** | `backend/alembic/versions/` | **Sí** (`brewos`) |
| Verificación | Bootstrap scripts | `database/bootstrap/` | No |
| Datos mínimos | Seeds modulares | `database/seeds/` | No |
| Config inicial | Seeds opcionales + wizard | `004_*` o UI | No |
| Config dinámica | **Solo UI** | Administración de Producción | No |
| Códigos operacionales | **Identity Engine** | Core Engine (futuro) | No |
| Datos operativos | Usuarios | Módulos Recursos, Producción… | No |

### Regla crítica: schema

```text
CREATE SCHEMA brewos  →  SOLO en migración Alembic 001 (o posterior)
                      →  NUNCA en seeds
                      →  bootstrap/ NO crea schema en producción
```

Los seeds asumen `brewos.*` ya existe. Si no existe, el error es correcto: **ejecutar `alembic upgrade head`**.

---

## 4. Estructura de carpetas

```text
database/
├── README.md
├── bootstrap/
│   ├── README.md
│   └── 000_verify_prerequisites.sql    # Comprueba schema + tablas + alembic
└── seeds/
    ├── README.md
    ├── run_all.sql                     # Orquestador psql (\i en orden)
    ├── 001_units.sql                   # Bootstrap obligatorio
    ├── 002_business_lines.sql          # Bootstrap obligatorio (mínimo)
    ├── 003_resource_types.sql          # Configuración inicial (plantilla sistema)
    └── 004_operational_prefixes.sql    # Registro prefijos ADR-0007 (cuando exista tabla)
```

**Eliminado:** `001_base_seed.sql` monolítico (desalineado con ADR-0007 y no escalable).

---

## 5. Clasificación de tablas (estado actual + futuro)

### A — Bootstrap obligatorio

Sin estas tablas y filas mínimas, BrewOS **no puede operar** (validaciones de unidad, medidas).

| Tabla | Seed | Mínimo |
|-------|------|--------|
| `units` | `001_units.sql` | unidad, g, kg, ml, L |
| `business_lines` | `002_business_lines.sql` | Opcional 0 filas en instalación genérica; Insular Origins: Destilería, Cervecería |

> **Nota:** En instalación multi-tenant futura, `business_lines` podría pasar a solo UI; hoy se seedea mínimo Insular Origins.

### B — Configuración inicial

Datos de **plantilla sistema** (`is_system = true`). Permiten arrancar sin UI; el administrador puede modificarlos después (ADR-0006).

| Tabla | Seed / origen | Notas |
|-------|---------------|-------|
| `resource_types` | `003_resource_types.sql` | Tipos base (supply, botanical, …) **sin** `code_prefix` legacy |
| `operational_code_prefixes` | `004_operational_prefixes.sql` | Prefijos oficiales doc 18 (CE-1) |
| `industry_templates` | UI o seed opcional | Plantilla «Insular Origins» importable |

### C — Configuración dinámica (solo UI)

**Nunca** en seeds de producción. Se administran en Configuración → Administración de Producción.

| Tabla | Motivo |
|-------|--------|
| `resource_subtypes` | Por línea y tipo |
| `resource_categories` | Jerarquía libre |
| `dynamic_properties` | Campos EAV |
| `dynamic_forms` / `dynamic_form_versions` / `dynamic_form_fields` | Formularios versionados |
| `production_processes` / `production_process_steps` | Procesos por industria |
| `configurable_states` | Estados y transiciones |
| `resource_tags` | Etiquetas operativas |

### D — Datos operacionales (jamás en seeds)

| Tabla | Motivo |
|-------|--------|
| `resources` | Creados por usuarios; `internal_code` vía Identity Engine |
| `suppliers` | Catálogo vivo |
| `resource_suppliers` | Vínculos reales |
| `resource_costs` | Historial real |
| `resource_documents` / `resource_photos` | Archivos reales |
| `resource_tag_links` | Asignaciones |
| `recipes` / `recipe_versions` / `recipe_items` | Futuro |
| `batches` / `inventory_movements` | Futuro |
| `harvests` / `botanical_plants` | Futuro |
| `domain_events` / `audit_log` | Generados por Core Engine en runtime |

---

## 6. Seeds modulares — contenido y reglas

### `001_units.sql`

- Solo unidades SI base
- Conversiones kg↔g, L↔ml
- Idempotente: `ON CONFLICT (code)`

### `002_business_lines.sql`

- Mínimo Insular Origins (distillery, brewery)
- Sin JSON de configuración pesada

### `003_resource_types.sql`

- Tipos con `default_flags` JSONB
- **`code_prefix` = NULL** (deprecado — ver §8)
- `is_system = true`
- No insertar subtipos ni categorías

### `004_operational_prefixes.sql`

- Pobla `operational_code_prefixes` (migración CE-1 / `003`)
- Prefijos maestros `BREW-*` y operaciones `DIS`, `PO`, etc. según doc 18
- Idempotente: `ON CONFLICT (prefix) WHERE deleted_at IS NULL DO NOTHING`

### `run_all.sql`

Ejecuta seeds en orden. Requiere `psql` con `\i` relativo al directorio `seeds/`.

---

## 7. Configuración fija vs dinámica vs bootstrap

| Concepto | Qué es | Dónde vive | Ejemplo |
|----------|--------|------------|---------|
| **Bootstrap** | Infraestructura de datos mínima universal | Seeds 001–002 | Unidades SI |
| **Configuración inicial** | Plantilla sistema editable después | Seed 003 o wizard | Tipos de recurso base |
| **Configuración dinámica** | Negocio específico, evoluciona en UI | Solo PostgreSQL vía API admin | Categorías, formularios |
| **Operacional** | Transacciones del día a día | Módulos operativos | Recursos, lotes |

```text
Bootstrap          →  universal, casi nunca cambia
Config inicial     →  arranque rápido, is_system, ADR-0006 permite editar
Config dinámica    →  ADR-0006: administrador en UI
Operacional        →  nunca seed
```

---

## 8. Análisis: campo `code_prefix` en `resource_types`

### Estado actual

- Columna `code_prefix` en `resource_types` (migración 001)
- Seeds antiguos usaban `INS`, `BOT`, `EQP`, …
- [16 — Administración](../16-production-administration.md) documentaba prefijos por tipo

### Conflicto con ADR-0007

[18 — Identidad operacional](18-operational-identity.md) define:

- Todos los recursos maestros: **`BREW-RES-{NNNNNN}`**
- Prefijos `INS-*`, `BOT-*` **obsoletos** como identidad operacional
- Identity Engine es el **único** asignador de `internal_code`

### Decisión documentada (sin cambio de código aún)

| Pregunta | Respuesta |
|----------|-----------|
| ¿Sigue teniendo sentido `code_prefix` en `resource_types`? | **No** para identidad operacional |
| ¿Eliminar? | **Sí**, en migración futura `00X_drop_resource_types_code_prefix` tras deprecación |
| ¿Reemplazar? | Catálogo `operational_code_prefixes` en **Identity Engine** (Core CE-1) |
| ¿Quién administra prefijos? | **Solo Identity Engine** + registro en doc 18 / tabla `operational_code_prefixes` |
| ¿Qué hacer en seeds ahora? | **No poblar** `code_prefix`; insertar `NULL` u omitir columna |
| ¿Qué distingue tipos entonces? | Columna `code` (`supply`, `botanical`) + `default_flags` — no el código visible del recurso |

### Periodo de transición

1. Seeds nuevos sin `code_prefix`
2. Documentación actualizada (este doc, 05, database-rules)
3. Implementar Identity Engine con `BREW-RES` único
4. Migración Alembic elimina columna
5. Actualizar doc 16 para quitar referencia a `code_prefix`

---

## 9. Relación con Core Engine (ADR-0008)

| Fase bootstrap | Motor Core |
|----------------|------------|
| Seeds 001–003 | Ninguno (datos estáticos) |
| Seed 004 | Identity — registro de prefijos |
| Crear recurso en UI | Identity asigna código · Event emite · Audit/Timeline derivan |
| Seeds | **Nunca** llaman Identity Engine |

---

## 10. Instalación desde cero (runbook)

```powershell
# 1. Schema (obligatorio)
cd backend
$env:DATABASE_URL = "postgresql://USER:PASS@HOST:5432/analytics"
.\.venv\Scripts\python.exe -m alembic upgrade head

# 2. Verificar
psql $env:DATABASE_URL -f database/bootstrap/000_verify_prerequisites.sql

# 3. Seeds
psql $env:DATABASE_URL -f database/seeds/run_all.sql

# 4. Arrancar API (cuando exista)
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload

# 5. Completar config en UI
#    Configuración → Administración de Producción
```

---

## 11. Escalabilidad multi-industria (10 años)

| Necesidad | Mecanismo |
|-----------|-----------|
| Nueva industria (velas, turismo) | Plantilla `industry_templates` importada en UI — **no** seed monolítico |
| Nuevas unidades raras | UI Configuración o seed `001` ampliado con ADR |
| Nuevo prefijo operación (`SAP-`) | ADR + `operational_code_prefixes` — no `code_prefix` en tipo |
| Nuevo tenant | Seeds bootstrap + wizard por organización |
| CI/CD | `alembic upgrade head` + `run_all.sql` en pipeline de deploy |

---

## 12. Errores comunes (lecciones aprendidas)

| Error | Causa | Solución |
|-------|-------|----------|
| `brewos.business_lines does not exist` | Seeds antes de Alembic | `alembic upgrade head` primero |
| `SET search_path` sin schema | Seed asumía schema creado por SQL | Schema solo vía Alembic |
| Prefijos `INS-` en seed | Pre-ADR-0007 | Usar seeds modulares nuevos |
| Un solo SQL enorme | Deuda de mantenimiento | Seeds por responsabilidad |
| Categorías en seed | Confunde con config dinámica | Solo UI |

---

## Referencias

- [ADR-0009 — Bootstrap](decisions/ADR-0009-bootstrap-strategy.md)
- [database/README.md](../database/README.md)
- [database/seeds/README.md](../database/seeds/README.md)
- [database/bootstrap/README.md](../database/bootstrap/README.md)

---

*Documento v1.0 — Estrategia de bootstrap BrewOS / Insular Origins*
