# 10 — Mapa de navegación

Mapa funcional de navegación principal de BrewOS. Define la estructura del menú, submenús, acciones, datos y relaciones entre módulos antes del desarrollo funcional.

**Documentos relacionados:** [04 — Módulos](04-modules.md) · [03 — Roadmap](03-roadmap.md) · [11 — Principios de producto](11-product-principles.md) · [12 — Dominio de Recursos](12-resource-domain.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)

---

## Estructura del menú principal

```
BrewOS
├── Centro de Control
├── Recursos
├── Inventario
├── Recetas
├── Producción
├── Trazabilidad
├── Jardín Botánico
├── Laboratorio
├── Reportes
└── Configuración
```

Orden intencional: de lo maestro (recursos) a lo operativo (producción), luego trazabilidad, cultivo, conocimiento, análisis y administración.

---

## Centro de Control

| Campo | Definición |
|-------|------------|
| **Propósito** | Punto de entrada operativo tras el login. Ofrece una vista sintética del estado del sistema sin profundizar en ningún módulo. |
| **Pregunta que responde** | ¿Qué está pasando ahora y qué requiere atención? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Resumen general | Estado global: lotes activos, alertas pendientes, accesos a módulos |
| Actividad reciente | Últimos movimientos, lotes y eventos registrados en el sistema |
| Alertas | Stock bajo, lotes pendientes de cierre, tareas sin completar |
| Accesos rápidos | Enlaces directos a acciones frecuentes (nueva entrada, nuevo lote, etc.) |

### Acciones principales

- Navegar a cualquier módulo
- Revisar alertas y actividad reciente
- Iniciar flujos frecuentes (accesos rápidos)

### Qué datos usa

- Agregados de Inventario (alertas de stock)
- Lotes activos de Producción
- Últimos eventos de Trazabilidad y movimientos de Inventario
- No almacena datos propios; es una capa de lectura

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Inventario | Alertas de stock, últimos movimientos |
| Producción | Lotes en curso |
| Trazabilidad | Actividad reciente |
| Todos | Accesos rápidos por módulo |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| UI shell | Sprint 2 | Layout, sidebar, cards de módulos sin datos reales |
| Datos vivos | Sprint 4+ | Alertas e actividad cuando Inventario y Producción existan |

---

## Recursos

| Campo | Definición |
|-------|------------|
| **Propósito** | Entidad central de BrewOS. Fuente única de verdad para todo elemento físico, biológico, técnico o comercial de la operación. Ningún elemento entra a Inventario o Recetas sin existir aquí primero. |
| **Pregunta que responde** | ¿Qué existe y cómo se describe? |

**Nota de nomenclatura:** **Recursos** reemplaza a «Catálogo» como nombre del módulo en interfaz y documentación de producto. La entidad técnica sigue siendo `resources`. Ver [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md).

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Todos | Vista unificada con filtros por tipo, estado y categoría |
| Insumos | Materias primas: alcohol, malta, levadura, agua, aditivos |
| Botánicos | Enebro, murta, calafate, hierbas y extractos vegetales |
| Envases | Botellas, barricas, tapones, corchos |
| Equipamiento | Alambiques, fermentadores, medición, embotellado |
| Herramientas | Utensilios manuales, eléctricos, jardinería |
| Productos Terminados | Gin, cerveza, licores, merchandising |
| Servicios | Tours, catas, experiencias (incluye futuros) |
| Limpieza | Sanitizantes, alcohol de limpieza, guantes, cepillos |
| Packaging | Etiquetas, cajas, sellos, collarines |
| Electrónica | ESP32, sensores, cables, módulos BrewNode |
| Proveedores | Maestro de proveedores vinculables a recursos |
| Unidades | Unidades de medida (kg, L, g, unidad, %) |
| Categorías | Jerarquía libre de clasificación |
| Etiquetas | Tags transversales para búsqueda y agrupación |

### Acciones principales

- Crear, editar, activar y archivar recursos
- Filtrar por tipo, subtipo, categoría y etiqueta
- Gestionar proveedores, unidades, categorías y etiquetas
- Definir costos de referencia y flags de comportamiento
- Adjuntar fichas técnicas y de seguridad

### Qué datos usa

- `resources`, `resource_types`, `resource_subtypes`, `resource_categories`, `resource_tags`, `units`, `suppliers`, `resource_costs`, `resource_documents`

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Inventario | Solo recursos con `inventariable = true` |
| Recetas | Ingredientes = recursos con `consumible = true` |
| Producción | Consumo y output (producto terminado) |
| Trazabilidad | Registro de recursos usados por lote |
| Jardín Botánico | Recursos con `cultivable = true` |
| Laboratorio | Fichas y documentos vinculados |
| Reportes | Valorización, uso y costos por recurso |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| CRUD base | Sprint 3 | Tipos principales, taxonomía, unidades, proveedores |
| Tipos extendidos | Sprint 3–4 | Limpieza, packaging, electrónica, servicios |
| Documentos | Sprint 4 | Fichas técnicas y de seguridad |

Ver [ADR-0002](decisions/ADR-0002-catalog-before-inventory.md) · [12 — Dominio](12-resource-domain.md) · [13 — Taxonomía](13-resource-taxonomy.md).

---

## Inventario

| Campo | Definición |
|-------|------------|
| **Propósito** | Registrar movimientos de stock y calcular cantidades y costos. No crea recursos; solo opera sobre Recursos. |
| **Pregunta que responde** | ¿Cuánto tenemos, a qué costo y qué se movió? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Stock | Vista actual por recurso |
| Movimientos | Historial completo de entradas, salidas y ajustes |
| Entradas | Registro de ingresos de material |
| Salidas | Registro de egresos (consumo, venta, merma) |
| Ajustes | Correcciones, mermas, inventario físico |
| Compras | Entradas asociadas a proveedor y documento de compra |
| Stock mínimo | Umbrales y alertas por recurso |
| Valorización | Valor del stock según costo promedio |

### Acciones principales

- Registrar entrada, salida o ajuste
- Consultar stock actual y historial
- Configurar stock mínimo
- Revisar valorización del inventario

### Qué datos usa

- `inventory_movements`, recursos, proveedores

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Recursos | Origen de todos los recursos con stock |
| Producción | Salidas automáticas al consumir en un lote |
| Reportes | Stock, costos, valorización |
| Centro de Control | Alertas de stock bajo |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Movimientos | Sprint 4 | Entradas, salidas, ajustes, costo promedio |
| Compras y alertas | Sprint 4 | Stock mínimo, valorización |

---

## Recetas

| Campo | Definición |
|-------|------------|
| **Propósito** | Definir formulaciones versionadas: ingredientes, rendimiento esperado y costo estimado. Base reproducible para la producción. |
| **Pregunta que responde** | ¿Cómo se elabora y cuánto debería costar? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Recetas | Listado y ficha de recetas base |
| Versiones | Historial y estado de cada versión (borrador, activa, archivada) |
| Ingredientes | Composición por versión, vinculada a Recursos |
| Rendimiento esperado | Volumen o cantidad de producto por lote teórico |
| Costos estimados | Cálculo desde costos de referencia de Recursos |
| Notas de prueba | Observaciones de iteraciones y experimentos |

### Acciones principales

- Crear y editar recetas
- Publicar nueva versión
- Calcular costo estimado
- Archivar versiones obsoletas

### Qué datos usa

- `recipes`, `recipe_versions`, `recipe_items`, recursos

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Recursos | Ingredientes = recursos existentes |
| Producción | Lote usa una versión congelada |
| Trazabilidad | Comparación estimado vs real |
| Reportes | Costos y rendimiento |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Recetario completo | Sprint 5 | Versionado, ingredientes, costos estimados |

---

## Producción

| Campo | Definición |
|-------|------------|
| **Propósito** | Ejecutar lotes reales: vincular receta, registrar etapas, consumir inventario y documentar el proceso manualmente. |
| **Pregunta que responde** | ¿Qué estamos produciendo ahora y en qué etapa está? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Lotes | Creación y listado de lotes |
| Etapas | Fases del proceso (maceración, fermentación, destilación, etc.) |
| Consumo de inventario | Materiales retirados del stock según receta o ajuste manual |
| Registro manual del proceso | Temperaturas, tiempos, mediciones ingresadas a mano |
| Adjuntos | Archivos asociados al lote |
| Observaciones | Notas libres del operador |

### Acciones principales

- Iniciar lote desde versión de receta
- Avanzar o cerrar etapas
- Registrar consumos y observaciones
- Adjuntar archivos

### Qué datos usa

- `batches`, `batch_steps`, `recipe_versions`, movimientos de Inventario

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Recetas | Versión congelada al crear el lote |
| Inventario | Consumo genera salidas |
| Trazabilidad | Cada acción alimenta el historial del lote |
| Jardín Botánico | Botánicos de cosecha propia |
| Centro de Control | Lotes activos |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Lotes y etapas | Sprint 6 | Consumo de inventario, registro manual |

---

## Trazabilidad

| Campo | Definición |
|-------|------------|
| **Propósito** | Historial completo e inmutable por lote: qué ocurrió, qué se usó, cuánto costó y qué evidencia existe. |
| **Pregunta que responde** | ¿Qué ocurrió exactamente en este lote? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Historial por lote | Línea de tiempo de eventos |
| Recursos usados | Detalle de insumos y cantidades |
| Costos reales | Costo efectivo vs estimado de la receta |
| Fotos | Imágenes del proceso |
| Documentos | PDFs, fichas, certificados |
| Eventos | Registro cronológico de acciones |
| Relación con cosechas | Vínculo cosecha del jardín → botánico en lote |

### Acciones principales

- Consultar historial de un lote
- Agregar eventos, fotos y documentos
- Reconstruir la cadena de un producto

### Qué datos usa

- `traceability_events`, `batches`, recursos, `harvests`, `documents`

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Producción | Origen de lotes y etapas |
| Inventario | Costos reales de consumo |
| Jardín Botánico | Cosechas en la cadena |
| Laboratorio | Documentos y procedimientos de referencia |
| Reportes | Trazabilidad y costos |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Historial completo | Sprint 7 | Eventos, recursos, costos, adjuntos |

---

## Jardín Botánico

| Campo | Definición |
|-------|------------|
| **Propósito** | Gestionar cultivo: especies, plantas, ubicaciones, cosechas y su relación con botánicos de Recursos y lotes de Producción. |
| **Pregunta que responde** | ¿Qué cultivamos y de dónde provino este material? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Especies | Catálogo botánico (nombre común, científico, notas) |
| Plantas | Individuos o grupos plantados |
| Ubicaciones | Zonas del terreno, macetas, canteros |
| Plantaciones | Registro de siembra o trasplante |
| Cosechas | Cantidad, fecha, planta de origen |
| Fotos | Registro visual por planta o zona |
| Notas | Observaciones de cultivo |
| Relación con botánicos y lotes | Puente hacia Recursos y Producción |

### Acciones principales

- Registrar especie, plantación y cosecha
- Vincular cosecha a recurso botánico de Recursos
- Asociar cosecha a lote de producción
- Documentar con fotos y notas

### Qué datos usa

- `botanical_species`, `botanical_plants`, `harvests`, recursos botánicos

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Recursos | Botánicos cultivables como recursos |
| Producción / Trazabilidad | Origen de material en lote |
| Laboratorio | Aprendizajes y procedimientos de cultivo |
| Reportes | Actividad del jardín |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Jardín completo | Sprint 8 | Especies, plantas, cosechas, vínculos |

---

## Laboratorio

| Campo | Definición |
|-------|------------|
| **Propósito** | Repositorio de conocimiento, documentación y memoria del proyecto: bitácora, planes, marca, procedimientos, normativas e investigación. |
| **Pregunta que responde** | ¿Qué hemos aprendido, documentado y decidido? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Bitácora | Entradas cronológicas del proyecto |
| Master Plan | Visión y zonas del terreno Insular Origins |
| BrandBook | Identidad de marca y lineamientos visuales |
| Procedimientos | Pasos operativos estandarizados |
| Manuales | Documentación de equipos y procesos |
| Normativas | Regulaciones y requisitos aplicables |
| Investigación | Notas de experimentos y referencias |
| Aprendizajes | Conclusiones y lecciones registradas |

### Acciones principales

- Crear y consultar documentos y entradas de bitácora
- Enlazar procedimientos a módulos operativos
- Archivar investigación y aprendizajes

### Qué datos usa

- `documents`, `journal_entries`, referencias cruzadas a lotes y recursos

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Todos | Procedimientos y manuales como referencia |
| Producción / Trazabilidad | Adjuntos y contexto documental |
| Configuración | BrandBook y tema visual |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Laboratorio base | Sprint 9 | Bitácora, documentos, procedimientos |

Ver [ADR-0004](decisions/ADR-0004-laboratory-module.md).

---

## Reportes

| Campo | Definición |
|-------|------------|
| **Propósito** | Vistas analíticas y exportables sobre datos operativos. No duplica datos; lee de otros módulos. |
| **Pregunta que responde** | ¿Qué nos dicen los datos acumulados? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Costos | Por lote, recurso, período |
| Stock | Niveles, movimientos, valorización |
| Producción | Lotes completados, volúmenes |
| Rendimiento | Real vs esperado por receta |
| Uso de recursos | Consumo agregado por tipo o período |
| Actividad del jardín | Cosechas, especies, zonas |
| Inversión del proyecto | Resumen de costos acumulados del proyecto |

### Acciones principales

- Filtrar por período, recurso o lote
- Exportar vistas (cuando se implemente)
- Comparar estimado vs real

### Qué datos usa

- Lectura agregada de Inventario, Producción, Trazabilidad, Recursos, Jardín

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Todos los operativos | Fuente de datos |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Reportes básicos | Sprint 7–9 | Progresivo según datos disponibles |
| Reportes avanzados | Post Sprint 9 | Inversión, rendimiento consolidado |

---

## Configuración

| Campo | Definición |
|-------|------------|
| **Propósito** | Administración del sistema, usuarios, parámetros globales e integraciones futuras. |
| **Pregunta que responde** | ¿Cómo se administra BrewOS? |

### Submenús

| Submenú | Descripción |
|---------|-------------|
| Usuarios | Cuentas de acceso |
| Roles | Permisos por módulo |
| Empresa / Proyecto | Datos de Insular Origins en el sistema |
| Parámetros | Ajustes globales (moneda, formatos, defaults) |
| Tema visual | Claro / oscuro, preferencias de interfaz |
| Seguridad | Políticas de contraseña, sesión (futuro) |
| Integraciones futuras | BrewNode, ESP32, APIs externas |

### Acciones principales

- Gestionar usuarios y roles
- Configurar parámetros del proyecto
- Ajustar tema y preferencias
- Preparar integraciones (cuando existan)

### Qué datos usa

- `users`, `roles`, parámetros de sistema

### Módulos conectados

| Módulo | Tipo de conexión |
|--------|------------------|
| Todos | Permisos de acceso por módulo |
| Laboratorio | BrandBook y documentación de marca |

### Estado de desarrollo sugerido

| Fase | Sprint | Notas |
|------|--------|-------|
| Usuarios y roles | Sprint 2 | Login y permisos básicos |
| Resto | Sprint 3+ | Parámetros e integraciones progresivas |

---

## Mapa de relaciones entre módulos

```
                    ┌─────────────────┐
                    │ Centro de Control│
                    └────────┬────────┘
                             │ lee
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────┐         ┌──────────┐        ┌──────────┐
    │ Recursos│────────►│Inventario│───────►│Producción│
    └────┬────┘         └──────────┘        └────┬─────┘
         │                                        │
         ▼                                        ▼
    ┌─────────┐                              ┌─────────────┐
    │ Recetas │─────────────────────────────►│Trazabilidad │
    └─────────┘                              └──────┬──────┘
         │                                          │
         │         ┌──────────────┐                 │
         └────────►│Jardín Botánico│◄────────────────┘
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │  Laboratorio │
                   └──────────────┘

    Reportes ◄── lee ── todos los módulos operativos
    Configuración ── administra ── acceso a todos
```

---

## Convenciones de navegación

1. **Un módulo = un ítem principal** en la sidebar; submenús dentro de cada módulo
2. **Centro de Control** es la ruta por defecto tras login (`/dashboard` o equivalente)
3. **Breadcrumbs** en vistas internas: Módulo → Submenú → Detalle
4. **Móvil:** sidebar colapsada; mismos módulos, sin ocultar funcionalidad
5. **Nombres en español** en interfaz; identificadores técnicos en inglés (ver [ADR-0001](decisions/ADR-0001-interface-language.md))

---

## Alineación con sprints

| Módulo | Sprint principal |
|--------|------------------|
| Centro de Control | 2 |
| Recursos | 3 |
| Inventario | 4 |
| Recetas | 5 |
| Producción | 6 |
| Trazabilidad | 7 |
| Jardín Botánico | 8 |
| Laboratorio | 9 |
| Reportes | 7–9 (progresivo) |
| Configuración | 2 (usuarios) + continuo |

---

*Documento v1.1 — Mapa de navegación BrewOS (módulo Recursos)*
