# 15 — Recursos: UI/UX

Especificación de experiencia de usuario del módulo **Recursos** de BrewOS. Define pantallas, flujos, componentes, estados y reglas responsive para implementación frontend sin ambigüedad.

**Pregunta que responde el módulo:** ¿Qué recursos existen dentro de Insular Origins?

**Documentos relacionados:** [09 — Design System](09-design-system.md) · [10 — Mapa de navegación](10-navigation-map.md) · [12 — Dominio](12-resource-domain.md) · [13 — Taxonomía](13-resource-taxonomy.md) · [14 — Ciclo de vida](14-resource-lifecycle.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)

**Estado:** Especificación UX — sin implementación ni backend.

---

## 1. Principios de diseño del módulo

| Principio | Aplicación en Recursos |
|-----------|------------------------|
| **Experiencia, no tabla** | La lista es el centro operativo, pero está precedida de contexto (cards resumen) y acompañada de detalle rico |
| **Tipo define forma** | El wizard y los formularios muestran solo campos relevantes al tipo elegido |
| **Un recurso, una ficha** | El detalle es la pantalla más importante; la lista es el índice |
| **Trazabilidad visible** | Historial en timeline; relaciones explícitas hacia recetas, lotes y compras |
| **Premium y calmado** | Mucho espacio, sin gradientes, sin skeuomorphism — ver Design System |
| **Español en UI** | Labels, mensajes y ayudas en español; rutas en inglés (`/resources`) — ADR-0001 |

---

## 2. Arquitectura de información

### 2.1 Jerarquía del módulo

```
Recursos (/resources)
├── Lista principal                    /resources
├── Asistente nuevo recurso            /resources/new
├── Detalle                            /resources/[id]
│   ├── General (default)
│   ├── Inventario
│   ├── Costos
│   ├── Documentos
│   ├── Fotografías
│   ├── Historial
│   └── Relaciones
├── Editar                             /resources/[id]/edit
└── Submódulos de maestros (sidebar secundaria o tabs superiores)
    ├── Proveedores                    /resources/suppliers
    ├── Unidades                       /resources/units
    ├── Categorías                     /resources/categories
    └── Etiquetas                      /resources/tags
```

### 2.2 Subnavegación lateral (dentro de Recursos)

Alineada con [10 — Mapa de navegación](10-navigation-map.md):

| Ítem | Ruta | Comportamiento |
|------|------|----------------|
| Todos | `/resources` | Lista con todos los tipos |
| Insumos | `/resources?type=supply` | Lista filtrada |
| Botánicos | `/resources?type=botanical` | Lista filtrada |
| Envases | `/resources?type=container` | Lista filtrada |
| Equipamiento | `/resources?type=equipment` | Lista filtrada |
| Herramientas | `/resources?type=tool` | Lista filtrada |
| Productos Terminados | `/resources?type=finished_product` | Lista filtrada |
| Servicios | `/resources?type=service` | Lista filtrada |
| Limpieza | `/resources?type=cleaning_material` | Lista filtrada |
| Packaging | `/resources?type=packaging_material` | Lista filtrada |
| Electrónica | `/resources?type=electronic_component` | Lista filtrada |
| — | — | Separador |
| Proveedores | `/resources/suppliers` | Maestro de proveedores |
| Unidades | `/resources/units` | Maestro de unidades |
| Categorías | `/resources/categories` | Maestro de categorías |
| Etiquetas | `/resources/tags` | Maestro de etiquetas |

En **desktop**, subnavegación como segunda columna o tabs horizontales bajo el header del módulo. En **móvil**, selector desplegable «Vista: Todos / Insumos / …».

---

## 3. Flujo del usuario

### 3.1 Flujo principal — consultar y crear

```
Entrar a Recursos
    │
    ├─► Ver cards resumen por tipo
    ├─► Buscar / filtrar
    ├─► Clic en fila → Detalle del recurso
    │       ├─► Editar
    │       ├─► Ver historial / relaciones / costos
    │       └─► Archivar (con confirmación)
    │
    └─► «Nuevo recurso» → Wizard
            Paso 1: Elegir tipo
            Paso 2: Campos dinámicos
            Paso 3: Revisión y confirmación
            → Detalle del recurso creado
```

### 3.2 Flujo secundario — maestros

```
Recursos → Proveedores / Unidades / Categorías / Etiquetas
    → CRUD simple de maestro (futuro)
    → Volver a lista de recursos
```

### 3.3 Flujo desde otros módulos (futuro)

| Origen | Destino | Comportamiento |
|--------|---------|----------------|
| Inventario → «Crear recurso» | Wizard | Tipo preseleccionado si contexto lo permite |
| Recetas → ingrediente faltante | Wizard | Tipo Insumo o Botánico sugerido |
| Jardín → botánico | Detalle recurso cultivable | Vínculo bidireccional |

---

## 4. Pantalla: Lista de Recursos

**Ruta:** `/resources` (con query params para filtros)

### 4.1 Header de página

| Elemento | Especificación |
|----------|----------------|
| Breadcrumb | `Recursos` o `Recursos › Insumos` si filtro de tipo activo |
| Título | **Recursos** |
| Descripción | «Catálogo maestro de insumos, equipos, envases y materiales de Insular Origins.» |
| Acción primaria | Botón **➕ Nuevo recurso** — primario, alineado a la derecha en desktop |

### 4.2 Barra de búsqueda y filtros

**Buscador global**

- Placeholder: «Buscar por nombre, código o proveedor…»
- Busca en: nombre, `internal_code`, nombre de proveedor, etiquetas
- Debounce 300 ms
- Icono lupa; botón limpiar (×) si hay texto
- Atajo: `/` enfoca el buscador (desktop)

**Filtros rápidos** — fila de chips o panel colapsable «Filtros»

| Filtro | Control | Valores |
|--------|---------|---------|
| Tipo | Multi-select o chips | 10 tipos de taxonomía |
| Estado | Multi-select | Borrador, Activo, Inactivo, Archivado |
| Proveedor | Combobox | Lista de proveedores |
| Etiquetas | Multi-select chips | Tags existentes |
| Inventariable | Toggle sí/no/todos | |
| Consumible | Toggle sí/no/todos | |
| Cultivable | Toggle sí/no/todos | |
| Vendible | Toggle sí/no/todos | |

- Filtros activos visibles como chips removibles bajo la barra
- Botón «Limpiar filtros» si hay alguno activo
- En móvil: filtros en Sheet lateral desde botón «Filtros»

### 4.3 Cards resumen (antes de la tabla)

Grid horizontal scroll en móvil; grid 4–5 columnas en desktop.

| Card | Contenido | Clic |
|------|-----------|------|
| Insumos | Icono + «Insumos» + cantidad | Filtra lista por tipo Insumo |
| Botánicos | Idem | Filtra Botánico |
| Equipamiento | Idem | Filtra Equipamiento |
| Envases | Idem | Filtra Envase |
| Herramientas | Idem | Filtra Herramienta |
| Productos Terminados | Idem | Filtra Producto Terminado |
| Servicios | Idem | Filtra Servicio |
| Componentes Electrónicos | Idem | Filtra Electrónica |

**Nota:** Limpieza y Packaging pueden agruparse en segunda fila o scroll; cantidad en cada card. Card activa (filtro aplicado): borde primario sutil.

Estilo: card plana, sin sombra fuerte, número en JetBrains Mono, icono outline Lucide.

### 4.4 Tabla de recursos

Tabla moderna — filas clickeables, hover sutil, densidad media (48px altura fila).

| Columna | Ancho | Contenido |
|---------|-------|-----------|
| Código | Fijo ~100px | `internal_code` — mono, ej. `INS-ALC-096` |
| Imagen | 40px | Thumbnail o placeholder con icono por tipo |
| Nombre | Flexible | Nombre + subtipo en caption secundario |
| Tipo | ~120px | Badge con nombre del tipo |
| Subtipo | ~100px | Texto secundario |
| Unidad | ~80px | kg, L, unidad |
| Estado | ~100px | Badge semántico (Activo=success muted, Borrador=outline, etc.) |
| Costo | ~100px | Último costo referencia o «—»; mono |
| Stock | ~80px | Cantidad si inventariable; «—» si no; link a Inventario (futuro) |
| Proveedor | ~140px | Nombre corto o «—» |
| Última modificación | ~120px | Fecha relativa + absoluta en tooltip |

**Acciones de fila** (iconos ghost al hover o menú ⋯):

- Ver detalle
- Editar
- Duplicar
- Archivar

**Paginación:** 25 / 50 / 100 por página; total de registros visible.

**Ordenación:** Clic en header ordena por columna (nombre, código, fecha, costo).

**Selección múltiple (futuro):** checkbox para acciones masivas (archivar, etiquetar).

---

## 5. Asistente «Nuevo Recurso»

**Ruta:** `/resources/new`

**Formato:** Wizard de 3 pasos en panel centrado (desktop) o pantalla completa (móvil). Barra de progreso superior: Tipo → Datos → Revisión.

### 5.1 Paso 1 — Seleccionar tipo

Título: «¿Qué tipo de recurso vas a registrar?»

Presentación: **grid de tarjetas seleccionables** (no dropdown). Una opción activa con borde primario.

| Opción UI | Tipo taxonomía | Icono sugerido |
|-----------|----------------|----------------|
| Insumo | supply | FlaskConical |
| Botánico | botanical | Sprout |
| Equipamiento | equipment | Factory o Cog |
| Herramienta | tool | Wrench |
| Envase | container | Package |
| Producto | finished_product | Box |
| Servicio | service | Ticket |
| Electrónica | electronic_component | Cpu |
| Limpieza | cleaning_material | Sparkles |
| Packaging | packaging_material | Tag |

Botones: **Cancelar** (vuelve a lista) · **Continuar** (deshabilitado hasta elegir tipo).

### 5.2 Paso 2 — Campos dinámicos

Título: «Datos del recurso» + badge con tipo elegido.

Subtítulo dinámico si aplica subtipo (selector de subtipo según tipo — ver taxonomía).

**Regla:** solo mostrar campos definidos para el tipo. Agrupar en secciones colapsables si > 8 campos.

#### Matriz de campos por tipo (implementación UX)

##### Insumo — subtipo Alcohol (ejemplo usuario)

| Campo | Control | Obligatorio |
|-------|---------|-------------|
| Nombre | Input texto | Sí |
| Subtipo | Select (Alcohol, Malta, …) | Sí |
| Graduación | Input número + % | Si subtipo Alcohol |
| Proveedor principal | Combobox proveedores | Recomendado |
| Costo de compra | Input moneda | Recomendado |
| Unidad base | Select unidades | Sí |
| Inventariable | Switch (default sí) | Sí |
| Consumible | Switch (default sí) | Sí |
| Trazable | Switch (default sí) | Sí |
| Requiere lote | Switch | Recomendado |
| Ficha de seguridad | Upload / link documento | Si químico |
| Stock mínimo | Input número | Opcional |
| Notas | Textarea | Opcional |

##### Botánico

| Campo | Control | Obligatorio |
|-------|---------|-------------|
| Nombre | Input | Sí |
| Subtipo origen | Radio: Cultivado / Comprado / Silvestre | Sí |
| Formato | Radio: Seco / Fresco | Recomendado |
| Estado global | Select (Borrador / Activo) | Sí |
| Unidad base | Select | Sí |
| Cultivable | Switch (on si Cultivado) | Según origen |
| Proveedor | Combobox (si Comprado) | Condicional |
| Fotos | Upload múltiple | Opcional |
| Notas | Textarea | Opcional |

##### Equipamiento

| Campo | Control | Obligatorio |
|-------|---------|-------------|
| Nombre | Input | Sí |
| Subtipo | Select (Elaboración, Fermentación, …) | Sí |
| Marca | Input | Opcional |
| Modelo | Input | Opcional |
| Costo / valor estimado | Input moneda | Recomendado |
| Fecha de compra | Date picker | Opcional |
| Estado equipamiento | Select: Operativo / En mantención / … | Sí |
| Vida útil estimada | Input + unidad (años) | Opcional |
| Manual | Upload → Laboratorio | Recomendado |
| Fotografía | Upload imagen principal | Opcional |
| Activo/equipamiento | Switch (default sí, oculto) | — |

##### Envase, Herramienta, Producto Terminado, Servicio, Limpieza, Packaging, Electrónica

Seguir campos recomendados en [13 — Taxonomía](13-resource-taxonomy.md). Misma lógica: defaults de flags pre-marcados según tipo.

**Ayudas contextuales:** icono (?) junto a labels no obvios («Trazable», «Cultivable») con tooltip de una línea.

Botones: **Atrás** · **Continuar** (validación visual de obligatorios).

### 5.3 Paso 3 — Revisión

Resumen legible de todos los campos ingresados. Secciones: Identidad · Clasificación · Comportamiento · Costos · Documentos.

Botones: **Atrás** · **Crear recurso** (primario).

Post-creación: toast «Recurso creado» + redirección a `/resources/[id]`.

**Código interno:** generado automáticamente en implementación futura (prefijo por tipo + secuencia). En UX mostrar preview: «Se asignará al guardar: INS-XXX».

---

## 6. Pantalla: Detalle del Recurso

**Ruta:** `/resources/[id]` — **pantalla más importante del módulo.**

### 6.1 Hero superior

Layout horizontal desktop; apilado móvil.

| Zona | Contenido |
|------|-----------|
| Imagen | 120×120 desktop / full width móvil — foto principal o placeholder con icono de tipo |
| Identidad | Código (mono) · Nombre H1 · Badges: Tipo, Subtipo, Estado |
| Meta | Unidad · Proveedor principal · Última modificación |
| Acciones | **Editar** (primario outline) · **Duplicar** · **Archivar** · **Imprimir QR** (deshabilitado + badge «Próximamente») |

### 6.2 Pestañas

| Pestaña | Contenido |
|---------|-----------|
| **General** | Todos los atributos del dominio en secciones: Identidad, Clasificación, Comportamiento (flags), Notas |
| **Inventario** | Stock actual, mínimo, enlace «Ver en Inventario»; vacío si no inventariable |
| **Costos** | Ver sección 8 |
| **Documentos** | Ver sección 9 |
| **Fotografías** | Ver sección 10 |
| **Historial** | Ver sección 7 |
| **Relaciones** | Ver sección 11 |

En móvil: tabs scroll horizontal o select «Sección».

### 6.3 General — layout

Secciones en cards apiladas:

1. **Identificación** — código, nombre, descripción
2. **Clasificación** — tipo, subtipo, categoría, etiquetas
3. **Comportamiento** — chips: Inventariable, Consumible, Cultivable, Vendible, Trazable, Equipamiento
4. **Requisitos** — lote, vencimiento, ficha técnica, ficha seguridad (sí/no)
5. **Notas**

---

## 7. Historial — Timeline

**Pestaña Historial** en detalle (también accesible desde `/resources/[id]/history` si se prefiere ruta dedicada).

**No es una tabla de logs.** Es **línea de tiempo vertical** con nodos.

### Estructura visual

```
● 15/07/2026 — Creado
│  por Carlos Romero · estado Borrador
│
● 18/07/2026 — Costo actualizado
│  $4.500 → $4.800 / L
│
● 25/07/2026 — Usado en lote
│  GIN-000001 · Producción
│  [Ver lote →]
│
● 03/08/2026 — Proveedor cambiado
│  Distribuidor A → Distribuidor B
│
● 10/08/2026 — Usado en lote
│  REC-000004 · Producción
```

| Tipo de evento | Icono | Color acento |
|----------------|-------|--------------|
| Creado | Plus | Info |
| Editado | Pencil | Neutral |
| Costo | DollarSign | Warning |
| Usado en lote | PlayCircle | Primary |
| Proveedor | Truck | Neutral |
| Documento adjunto | File | Neutral |
| Archivado | Archive | Destructive muted |
| Estado | RefreshCw | Neutral |

Filtro opcional por tipo de evento. Paginación «Cargar más» al final.

---

## 8. Costos

**Pestaña Costos** en detalle.

### 8.1 Resumen (cards horizontales)

| Card | Valor |
|------|-------|
| Costo de compra | Última referencia / unidad |
| Costo promedio | Calculado (solo inventariable) — mono |
| Última compra | Fecha + monto |
| Proveedor habitual | Nombre + link |

### 8.2 Historial de costos

Tabla simple: Fecha · Tipo (compra, ajuste, estimado) · Monto · Fuente · Notas.

Gráfico de línea **opcional en fase 2** — no en MVP UX.

---

## 9. Documentos

**Pestaña Documentos.**

Tipos soportados (badges):

| Tipo | Uso |
|------|-----|
| Manual | Equipamiento |
| Ficha técnica | Insumos, productos, equipos |
| MSDS / Ficha seguridad | Alcohol, sanitizantes |
| Factura | Compras |
| Cotización | Referencia proveedor |
| Otro | Libre |

Lista: icono tipo · nombre · fecha · acciones (ver, descargar, eliminar).

Empty state: «Sin documentos» + CTA «Subir documento».

Drag & drop en zona punteada (implementación futura).

---

## 10. Fotografías

**Pestaña Fotografías.**

- **Imagen principal** — grande, con badge «Principal»
- **Galería** — grid 3–4 columnas; clic abre lightbox
- Acciones: establecer como principal, eliminar, subir
- Empty state: ilustración mínima (icono) + «Añade fotos de este recurso»

---

## 11. Relaciones

**Pestaña Relaciones.**

Diagrama o lista jerárquica: «Este recurso se utiliza en»

| Bloque | Contenido | Ejemplo Alcohol 96° |
|--------|-----------|-------------------|
| Recetas | Lista con link | Gin Murta v2, Macerado calafate |
| Lotes | Lista con link | GIN-000001, REC-000004 |
| Productos | Si es insumo de PT | Gin Murta 500 ml |
| Compras | Entradas inventario | Compra #12 — 20 L |
| Jardín | Si cultivable | Murta planta #3 (futuro) |

Cada ítem: código + nombre + fecha último uso.

Empty state: «Este recurso aún no ha sido utilizado en producción ni recetas.»

---

## 12. Editar Recurso

**Ruta:** `/resources/[id]/edit`

Mismo conjunto de campos que wizard paso 2, en **formulario de una página** con secciones (no wizard).

- Breadcrumb: `Recursos › [Nombre] › Editar`
- Botones fijos al pie: **Cancelar** · **Guardar cambios**
- Si estado Archivado: formulario solo lectura con banner «Recurso archivado»
- Cambio de tipo: **no permitido** tras creación (mostrar tipo como solo lectura)

---

## 13. Estados UX

### 13.1 Empty states

| Contexto | Título | Descripción | CTA |
|----------|--------|-------------|-----|
| Lista sin recursos | Sin recursos aún | Comienza registrando insumos, equipos y materiales. | Nuevo recurso |
| Lista sin resultados | Sin coincidencias | Prueba otros filtros o términos de búsqueda. | Limpiar filtros |
| Detalle inventario (no inv.) | No inventariable | Este recurso no lleva stock. | — |
| Documentos vacío | Sin documentos | Adjunta fichas técnicas, MSDS o facturas. | Subir documento |
| Fotos vacío | Sin fotografías | Añade imágenes para identificar el recurso. | Subir foto |
| Historial vacío | Sin historial | Los eventos aparecerán al usar el recurso. | — |
| Relaciones vacío | Sin relaciones | Aún no se usa en recetas ni lotes. | — |

### 13.2 Loading

| Contexto | Patrón |
|----------|--------|
| Lista | Skeleton: 4 cards + 8 filas tabla |
| Detalle | Skeleton hero + tabs |
| Wizard | Skeleton campos |
| Timeline | Skeleton 5 nodos |

Spinner centrado solo en carga inicial de página completa.

### 13.3 Mensajes (toast)

| Acción | Mensaje |
|--------|---------|
| Crear | «Recurso [nombre] creado correctamente» |
| Guardar | «Cambios guardados» |
| Archivar | «Recurso archivado» |
| Duplicar | «Copia creada como borrador» |
| Error genérico | «No se pudo completar la acción. Intenta de nuevo.» |

### 13.4 Confirmaciones (dialog)

| Acción | Título | Cuerpo | Botón destructivo |
|--------|--------|--------|-------------------|
| Archivar | ¿Archivar recurso? | No aparecerá en nuevas recetas ni movimientos. | Archivar |
| Eliminar documento | ¿Eliminar documento? | Esta acción no se puede deshacer. | Eliminar |
| Salir wizard sin guardar | ¿Descartar cambios? | Perderás los datos ingresados. | Descartar |

### 13.5 Ayudas contextuales

| Campo / concepto | Ayuda (tooltip) |
|----------------|-----------------|
| Inventariable | «Lleva stock y movimientos en Inventario» |
| Consumible | «Se descuenta al usarlo en un lote» |
| Cultivable | «Puede vincularse con plantas del Jardín Botánico» |
| Trazable | «Cada uso queda registrado en Trazabilidad» |
| Código interno | «Identificador único. No se reutiliza al archivar» |

---

## 14. Responsive

### 14.1 Desktop (≥1024px)

- Subnavegación tipos visible (tabs o sidebar secundaria 200px)
- Cards resumen: 4–5 columnas
- Tabla: todas las columnas
- Detalle: hero horizontal, tabs bajo hero
- Wizard: panel max-width 640px centrado

### 14.2 Tablet (768–1023px)

- Subnavegación: tabs scroll horizontal
- Cards resumen: 3 columnas
- Tabla: ocultar Proveedor y Última modificación; resto visible
- Detalle: hero apilado, imagen izquierda 96px

### 14.3 Móvil (<768px)

- Subnavegación: select «Vista»
- Cards resumen: scroll horizontal snap
- Tabla → **lista de cards** por recurso (no tabla horizontal)
  - Cada card: imagen, nombre, código, tipo, estado, stock
- Filtros en Sheet desde botón
- Wizard: pantalla completa, pasos con botón fijo inferior
- Detalle: tabs scroll; acciones en menú ⋯
- FAB «Nuevo recurso» opcional en esquina inferior derecha

---

## 15. Componentes reutilizables

Identificados para extraer a `components/common` o `features/shared` — usados por Inventario, Producción, Jardín Botánico.

| Componente | Uso en Recursos | Reutilización futura |
|------------|-----------------|-------------------|
| `ResourceTypeBadge` | Tabla, detalle, wizard | Inventario, Producción, Trazabilidad |
| `ResourceStatusBadge` | Tabla, detalle | Todos los módulos |
| `ResourceThumbnail` | Tabla, detalle, galería | Inventario, Producción |
| `ResourceSearchBar` | Lista | Inventario (buscar recurso) |
| `FilterChipGroup` | Filtros rápidos | Inventario, Reportes |
| `SummaryTypeCard` | Cards resumen | Reportes por categoría |
| `DataTable` | Lista recursos | Inventario movimientos, Lotes |
| `ResourcePicker` | Combobox buscar recurso | Recetas, Producción, Inventario |
| `Timeline` | Historial | Trazabilidad, Producción |
| `RelationList` | Relaciones | Trazabilidad, Recetas |
| `DocumentList` | Documentos | Laboratorio, Trazabilidad |
| `PhotoGallery` | Fotografías | Jardín Botánico, Trazabilidad |
| `CostSummaryCards` | Costos | Inventario valorización, Reportes |
| `WizardShell` | Nuevo recurso | Producción (nuevo lote), Recetas |
| `DynamicFormSections` | Wizard / editar | Recetas ingredientes |
| `EmptyState` | Todos los vacíos | Global |
| `ConfirmDialog` | Archivar, eliminar | Global |
| `PageHeader` | Todas las pantallas | Global |
| `ModuleSubNav` | Subnavegación tipos | Otros módulos con subvistas |

---

## 16. Mapa de rutas (implementación futura)

| Ruta | Pantalla | Componente página |
|------|----------|-------------------|
| `/resources` | Lista | `ResourcesListPage` |
| `/resources/new` | Wizard | `ResourceCreateWizardPage` |
| `/resources/[id]` | Detalle | `ResourceDetailPage` |
| `/resources/[id]/edit` | Editar | `ResourceEditPage` |
| `/resources/suppliers` | Maestro proveedores | `SuppliersPage` |
| `/resources/units` | Maestro unidades | `UnitsPage` |
| `/resources/categories` | Maestro categorías | `CategoriesPage` |
| `/resources/tags` | Maestro etiquetas | `TagsPage` |

---

## 17. Riesgos detectados

| Riesgo | Impacto | Mitigación UX |
|--------|---------|---------------|
| Formularios dinámicos complejos | Desarrollo lento, bugs de validación | Matriz tipo→campos en config; tests por tipo |
| Tabla con muchas columnas en móvil | Mala UX | Vista cards en móvil obligatoria |
| Usuario no entiende «Recurso» | Abandono | Subnavegación por tipo visible; nunca formulario genérico |
| Duplicar recursos similares | Datos sucios | Duplicar como borrador; resaltar código único |
| Wizard largo para equipamiento | Abandono | Secciones colapsables; guardar borrador (fase 2) |
| Relaciones sin backend | Pantalla vacía en MVP | Empty state claro; mock solo en dev |
| Confusión Envase vs Packaging | Duplicados | Ayuda en wizard paso 1 por tarjeta |

---

## 18. Mejoras futuras sugeridas

| Fase | Mejora |
|------|--------|
| MVP+ | Guardar borrador en wizard |
| MVP+ | Importación CSV de recursos |
| v2 | QR en etiquetas físicas (acción Imprimir QR) |
| v2 | Vista kanban por estado (Borrador / Activo) |
| v2 | Comparar dos recursos lado a lado |
| v2 | Gráfico evolución de costos |
| v3 | Sugerencia de recurso duplicado al crear («¿Es el mismo que…?») |
| v3 | Plantillas por tipo («Crear alcohol base», «Crear botella estándar») |
| Integración | Vista stock en tiempo real desde Inventario en pestaña Inventario |
| Integración | Link directo a planta en Jardín si cultivable |

---

## 19. Checklist para implementación

El desarrollador debe verificar antes de cerrar el módulo:

- [ ] 10 tipos en wizard y subnavegación
- [ ] Campos dinámicos según matriz de sección 5.2
- [ ] Lista con cards resumen + tabla (cards en móvil)
- [ ] Detalle con 7 pestañas
- [ ] Timeline en historial (no tabla plana)
- [ ] Relaciones con empty state
- [ ] Todos los empty/loading/documentados
- [ ] Rutas en inglés, UI en español
- [ ] Sin crear recurso desde Inventario (solo link a wizard)
- [ ] Archivar pide confirmación
- [ ] Recurso archivado no editable

---

*Documento v1.0 — Recursos UI/UX BrewOS / Insular Origins*
