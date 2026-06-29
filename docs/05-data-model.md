# 05 — Modelo de datos

Modelo conceptual inicial de BrewOS. **No incluye migraciones ni SQL** — solo define entidades, relaciones y propósito de cada tabla para guiar el diseño de la base de datos en sprints futuros.

---

## Diagrama conceptual simplificado

```
users ── roles
  │
  ├── inventory_movements
  ├── batches ── batch_steps
  │       └── traceability_events
  ├── harvests
  ├── documents
  └── journal_entries

resources ── resource_categories
    ├── units
    ├── suppliers
    ├── recipe_items ◄── recipe_versions ◄── recipes
    ├── inventory_movements
    └── traceability_events

botanical_species ── botanical_plants ── harvests
```

---

## Entidades

### `users`

Usuarios del sistema con acceso a BrewOS.

| Campo conceptual | Descripción |
|------------------|-------------|
| Identidad | Nombre, email, credenciales |
| Rol | Referencia a `roles` |
| Estado | Activo, inactivo |

**Para qué sirve:** Autenticación, autorización y auditoría (quién hizo qué).

---

### `roles`

Roles con permisos por módulo (admin, operador, consulta, etc.).

**Para qué sirve:** Control de acceso granular sin hardcodear permisos en código.

---

### `resources`

Catálogo maestro de todo lo que existe: insumos, botánicos, equipamiento, envases, herramientas.

| Relaciones |
|------------|
| `resource_categories` — clasificación |
| `units` — unidad de medida |
| `suppliers` — proveedor principal (opcional) |

**Para qué sirve:** Fuente única de verdad para cualquier elemento usado en inventario, recetas o producción.

---

### `resource_categories`

Jerarquía de categorías (ej: Insumos → Malta → Malta base).

**Para qué sirve:** Organización, filtros y reportes por tipo de recurso.

---

### `units`

Unidades de medida (kg, L, g, unidad, %).

**Para qué sirve:** Estandarizar cantidades en recursos, inventario y recetas.

---

### `suppliers`

Proveedores de recursos.

**Para qué sirve:** Trazabilidad de origen de compras y análisis de costos por proveedor.

---

### `inventory_movements`

Movimientos de stock: entradas, salidas y ajustes.

| Campos conceptuales |
|---------------------|
| Recurso |
| Tipo (entrada / salida / ajuste) |
| Cantidad |
| Costo unitario (en entradas) |
| Referencia (lote, compra, producción) |
| Usuario y fecha |

**Para qué sirve:** Historial de stock y base para cálculo de costo promedio y alertas.

---

### `recipes`

Receta base (nombre, tipo de producto, descripción).

**Para qué sirve:** Agrupar versiones de una misma formulación bajo un identificador estable.

---

### `recipe_versions`

Versiones numeradas de una receta. Cada versión es un snapshot editable hasta que se usa en producción.

| Campos conceptuales |
|---------------------|
| Número de versión |
| Rendimiento esperado |
| Costo estimado |
| Estado (borrador / activa / archivada) |

**Para qué sirve:** Evolución controlada de formulaciones; la producción congela la versión usada.

---

### `recipe_items`

Ingredientes de una versión de receta: recurso + cantidad + unidad.

**Para qué sirve:** Definir la composición exacta de cada versión y calcular costos estimados.

---

### `batches`

Lote de producción en curso o completado.

| Relaciones |
|------------|
| `recipe_versions` — versión congelada al iniciar |
| `batch_steps` — etapas del proceso |
| `traceability_events` — historial |

**Para qué sirve:** Unidad central de producción; todo lo que ocurre en un lote cuelga de aquí.

---

### `batch_steps`

Etapas del proceso de un lote (maceración, fermentación, destilación, etc.).

| Campos conceptuales |
|---------------------|
| Nombre de etapa |
| Inicio / fin |
| Observaciones |
| Datos manuales (temperatura, densidad, etc.) |

**Para qué sirve:** Registrar el flujo temporal del proceso productivo.

---

### `traceability_events`

Eventos de trazabilidad vinculados a un lote: consumo de recurso, observación, foto, documento.

**Para qué sirve:** Historial completo e inmutable de qué ocurrió en cada lote.

---

### `botanical_species`

Catálogo de especies botánicas (nombre científico, común, notas de cultivo).

**Para qué sirve:** Identificar qué se cultiva independientemente de plantas individuales.

---

### `botanical_plants`

Plantas individuales o grupos plantados en una ubicación.

| Relaciones |
|------------|
| `botanical_species` |
| Ubicación en terreno |
| Fecha de plantación |
| Estado |

**Para qué sirve:** Seguimiento fino del jardín y origen de cosechas.

---

### `harvests`

Cosechas de plantas botánicas.

| Relaciones |
|------------|
| `botanical_plants` |
| Cantidad cosechada |
| Fecha |
| Lote de producción (opcional) |

**Para qué sirve:** Conectar el jardín con la producción y la trazabilidad de botánicos.

---

### `documents`

Archivos y referencias documentales (manuales, normativas, fotos, PDFs).

| Campos conceptuales |
|---------------------|
| Título, tipo, archivo o URL |
| Módulo relacionado (opcional) |
| Entidad relacionada (lote, recurso, etc.) |

**Para qué sirve:** Knowledge Base y adjuntos en trazabilidad.

---

### `journal_entries`

Entradas de bitácora del proyecto: decisiones, aprendizajes, hitos.

| Campos conceptuales |
|---------------------|
| Título, contenido |
| Fecha |
| Autor |
| Etiquetas |

**Para qué sirve:** Memoria viva del proyecto más allá de los datos transaccionales.

---

## Reglas del modelo

1. Todo insumo, herramienta o equipamiento es un `resource` antes de aparecer en inventario o recetas
2. `inventory_movements` nunca crea recursos; solo mueve stock
3. Un `batch` referencia una `recipe_version` congelada al momento de creación
4. `traceability_events` complementa al lote; no reemplaza movimientos de inventario
5. `harvests` pueden vincularse a `batches` para trazabilidad botánica
6. `documents` y `journal_entries` alimentan la Knowledge Base

---

## Próximo paso

Cuando se inicie el Sprint 1, traducir este modelo a esquema PostgreSQL con migraciones en `database/`.
