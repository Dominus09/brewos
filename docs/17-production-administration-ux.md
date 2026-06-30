# 17 — Administración de Producción: UI/UX

Especificación funcional y de experiencia de usuario de la sección **Configuración → Administración de Producción** de BrewOS.

Define qué puede configurar un administrador desde la interfaz, cómo navega, cómo crea taxonomías y formularios dinámicos, qué permanece fijo en el sistema, límites de seguridad y buenas prácticas de escalabilidad.

**Filosofía del producto:**

> *Todo aquello que pueda ser configurable por un administrador NO debe quedar definido en el código.*

**Pregunta que responde:** ¿Cómo diseña un administrador la operación productiva de Insular Origins — para destilería, cosmética, turismo o cualquier línea futura — sin intervención técnica?

**Documentos relacionados:** [09 — Design System](09-design-system.md) · [10 — Mapa de navegación](10-navigation-map.md) · [11 — Principios de producto](11-product-principles.md) · [16 — Administración de Producción (arquitectura)](16-production-administration.md) · [15 — Recursos UI/UX](15-resources-ui-ux.md)

**Estado:** Especificación UX — sin implementación, sin backend, sin código.

---

## 1. Principios de diseño del módulo

| Principio | Aplicación |
|-----------|------------|
| **Configurar, no programar** | El administrador nunca ve JSON, código ni expresiones técnicas; solo formularios guiados |
| **Plantilla primero, personalizar después** | Importar una industria y ajustar es más rápido que empezar en blanco |
| **Previsualizar antes de publicar** | Todo esquema o cambio estructural tiene vista previa del formulario resultante |
| **Impacto visible** | Antes de archivar un tipo o campo, el sistema muestra cuántos registros se ven afectados |
| **Versionar, no sobrescribir** | Cambiar un formulario crea nueva versión; los datos existentes no se corrompen |
| **Calma y claridad** | Misma estética premium del Design System: sin ruido visual, sin gradientes fuertes |
| **Español en UI** | Labels, ayudas y errores en español; rutas en inglés — ADR-0001 |
| **El operador no ve esto** | Administración de Producción es rol restringido; el productor diario usa Recursos y Producción |

---

## 2. Visión: de destilería a plataforma artesanal

BrewOS evoluciona hacia un **Sistema de Gestión de Producción Artesanal** configurable. Las siguientes líneas de negocio deben poder incorporarse **solo desde la interfaz administrativa**:

| Línea | Ejemplos de output |
|-------|-------------------|
| Destilería | Gin, vodka, licores |
| Cervecería | Cerveza artesanal, fermentados |
| Agua purificada | Agua osmotizada, mineral |
| Cosmética natural | Cremas, bálsamos, jabones |
| Velas | Velas de soja, cera |
| Hidrolatos | Aguas florales |
| Aceites esenciales | Macerados, destilados |
| Mermeladas | Conservas dulces gourmet |
| Conservas | Escabeches, enlatados |
| Charcutería | Embutidos, curados |
| Productos gourmet | Ediciones limitadas |
| Turismo | Tours, visitas |
| Talleres | Experiencias formativas |
| Merchandising | Productos de marca |

**No hay pantalla «Modo destilería».** Hay **líneas de negocio** + **plantillas de industria** + **configuración propia**.

---

## 3. Arquitectura de información

### 3.1 Ubicación en BrewOS

```
Sidebar principal
└── Configuración (/settings)
    ├── [Grupo] Configuración general
    │   ├── Empresa
    │   ├── Usuarios
    │   ├── Seguridad
    │   ├── Respaldos
    │   └── Integraciones
    │
    └── [Grupo] Administración de producción
        ├── Inicio (panel)                    /settings/production
        ├── Líneas de negocio                 /settings/production/business-lines
        ├── Plantillas de industria           /settings/production/templates
        ├── ─── Taxonomía ───
        ├── Tipos de recursos                 /settings/production/resource-types
        ├── Familias de recursos              /settings/production/resource-families
        ├── Categorías                        /settings/production/categories
        ├── Subcategorías                     /settings/production/subcategories
        ├── Tipos de envases                  /settings/production/container-types
        ├── ─── Atributos y formularios ───
        ├── Propiedades dinámicas             /settings/production/properties
        ├── Formularios                       /settings/production/forms
        ├── ─── Producción ───
        ├── Tipos de productos                /settings/production/product-types
        ├── Procesos productivos              /settings/production/processes
        ├── Tipos de lotes                    /settings/production/batch-types
        ├── Estados                           /settings/production/states
        ├── ─── Soporte transversal ───
        ├── Unidades                          /settings/production/units
        ├── Etiquetas                         /settings/production/tags
        ├── Tipos de documentos               /settings/production/document-types
        ├── Reglas de botánicos               /settings/production/botanicals
        └── Reglas del catálogo               /settings/production/catalog-rules
```

### 3.2 Subnavegación

| Viewport | Comportamiento |
|----------|----------------|
| **Desktop** | Segunda columna fija (240px) a la izquierda del contenido; grupos colapsables |
| **Tablet** | Subnav colapsable; icono «Secciones» abre panel |
| **Móvil** | Sheet lateral desde botón «Secciones»; contenido a ancho completo |

La sidebar principal de BrewOS **no cambia**. Solo se expande el interior de Configuración.

### 3.3 Breadcrumbs

Patrón uniforme:

`Centro de Control › Configuración › Administración de producción › [Sección] › [Detalle]`

Ejemplo:

`Centro de Control › Configuración › Administración de producción › Tipos de recursos › Cosmético`

---

## 4. Elementos configurables desde la interfaz

Todo lo siguiente es **creable, editable y archivable** por un administrador con permiso `config:production`.

### 4.1 Taxonomía y clasificación

| Elemento | Qué configura el admin | Dónde impacta |
|----------|------------------------|---------------|
| **Líneas de negocio** | Nombre, descripción, moneda, prefijos de código, plantilla base | Filtros globales, reportes, wizard de alta |
| **Tipos de recursos** | Nombre, icono, color, flags por defecto, prefijo de código, formulario asociado | Recursos, filtros, wizard, submenús |
| **Familias de recursos** | Agrupación transversal de tipos (ej. «Materia prima», «Activo», «Experiencia») | Navegación, reportes, permisos opcionales |
| **Categorías** | Árbol jerárquico libre, opcionalmente scoped a un tipo | Filtros, organización del catálogo |
| **Subcategorías** | Subdivisión dentro de tipo; puede heredar o sobrescribir formulario | Wizard de Recursos, validaciones |
| **Tipos de envases** | Subconjunto especializado de envases: botella, tapa, etiqueta, caja | Embotellado, recetas de packaging |

### 4.2 Atributos y formularios

| Elemento | Qué configura el admin | Dónde impacta |
|----------|------------------------|---------------|
| **Propiedades dinámicas** | Catálogo global de campos reutilizables (nombre, tipo de dato, validación) | Todos los formularios |
| **Formularios** | Composición de propiedades en secciones; versión; condiciones de visibilidad | Recursos, recetas, lotes, equipos |
| **Etiquetas** | Nombre, color, ámbitos de uso (recurso, receta, lote, documento) | Búsqueda, filtros, reportes |

### 4.3 Producción y operación

| Elemento | Qué configura el admin | Dónde impacta |
|----------|------------------------|---------------|
| **Tipos de productos** | Clasificación de outputs: gin, cerveza IPA, vela, tour | Recetas, producción, reportes |
| **Procesos productivos** | Secuencia de etapas con campos por etapa | Lotes, trazabilidad |
| **Tipos de lotes** | Plantilla de lote: proceso por defecto, campos, estados iniciales | Módulo Producción |
| **Estados** | Estados y transiciones por dominio (recurso, stock, equipo, lote, receta) | Badges, flujos, validaciones |
| **Unidades** | Símbolo, tipo, conversiones, decimales | Recursos, inventario, recetas |

### 4.4 Documentación y dominios especiales

| Elemento | Qué configura el admin | Dónde impacta |
|----------|------------------------|---------------|
| **Tipos de documentos** | Ficha técnica, ficha de seguridad, certificado, manual | Recursos, Laboratorio, cumplimiento |
| **Reglas de botánicos** | Flags cultivable, vínculo jardín, requisitos de lote/vencimiento | Jardín Botánico, Recursos botánicos |
| **Reglas del catálogo** | Código automático, unicidad, campos siempre visibles | Módulo Recursos globalmente |

### 4.5 Plantillas (aceleradores, no código)

| Elemento | Qué configura el admin | Dónde impacta |
|----------|------------------------|---------------|
| **Plantillas de industria** | Paquetes predefinidos importables (destilería, cosmética, turismo…) | Onboarding de nueva línea |

---

## 5. Navegación del usuario

### 5.1 Personas

| Persona | Acceso | Objetivo típico |
|---------|--------|-----------------|
| **Administrador de producción** | Administración de producción completa | Definir tipos, formularios y procesos |
| **Administrador del sistema** | Configuración general + producción | Usuarios + taxonomía |
| **Operador / productor** | Sin acceso a esta sección | Usa Recursos, Producción con lo ya configurado |

### 5.2 Flujo de entrada

```
Login → Centro de Control
    │
    └─► Sidebar → Configuración (/settings)
            │
            ├─► Overview: dos grupos de cards
            │       ├── Configuración general (5 ítems)
            │       └── Administración de producción (panel + ítems)
            │
            └─► Clic «Administración de producción»
                    → Panel de inicio (/settings/production)
```

### 5.3 Panel de inicio — Administración de producción

**Ruta:** `/settings/production`

**Contenido:**

| Zona | Elementos |
|------|-----------|
| Header | Título, descripción, botón «Importar plantilla de industria» |
| Resumen | Cards: líneas activas, tipos de recurso, formularios publicados, procesos |
| Accesos rápidos | «Nuevo tipo de recurso», «Nueva propiedad», «Nuevo proceso» |
| Actividad reciente | Últimos cambios de configuración (quién, qué, cuándo) — futuro |
| Secciones | Misma estructura que subnav, en cards agrupadas |

### 5.4 Flujo entre secciones

El administrador puede:

1. Entrar por **subnav lateral** a cualquier maestro
2. Desde un **tipo de recurso**, saltar a su **formulario** o **subcategorías** vinculadas
3. Desde una **propiedad**, ver en qué **formularios** se usa
4. Volver siempre a `/settings/production` vía breadcrumb

### 5.5 Mapa de flujos principales

```
Panel inicio
    │
    ├─► Importar plantilla → Preview → Confirmar → Panel con resumen de lo creado
    │
    ├─► Tipos de recursos → Lista → Detalle tipo → Pestañas:
    │       General | Subcategorías | Formulario | Estados | Impacto
    │
    ├─► Propiedades → Lista → Crear / editar propiedad
    │
    ├─► Formularios → Lista → Editor visual → Preview → Publicar versión
    │
    ├─► Categorías → Árbol drag-and-drop → Crear / mover / archivar
    │
    ├─► Procesos → Lista → Detalle → Etapas ordenables
    │
    └─► Estados → Selector de dominio → Diagrama de transiciones
```

---

## 6. Experiencia: crear una nueva categoría de producción

En BrewOS, «categoría de producción» puede significar dos cosas. La UX las distingue claramente:

| Concepto UI | Significado | Pantalla |
|-------------|-------------|----------|
| **Línea de negocio** | Una operación productiva (ej. «Cosmética Insular») | Líneas de negocio |
| **Categoría de recurso** | Clasificación dentro del catálogo (ej. «Cuidado facial») | Categorías |

### 6.1 Flujo A — Nueva línea de negocio (recomendado para nueva industria)

**Objetivo:** Incorporar cosmética natural sin tocar código.

```
Paso 1 — Inicio
    Administración de producción → «Nueva línea de negocio»

Paso 2 — Identidad
    Campos: Nombre, Código interno (auto-sugerido), Descripción
    Toggle: «Usar plantilla de industria» → Select: Cosmética natural

Paso 3 — Preview de plantilla
    Lista de lo que se creará:
    · 6 tipos de recurso
    · 12 propiedades
    · 3 procesos
    · 1 formulario por tipo principal
    Botón: «Personalizar antes de importar» (opcional)

Paso 4 — Confirmación
    Resumen + advertencia: «Podrás modificar todo después»
    → Crear línea

Paso 5 — Post-creación
    Toast: «Línea Cosmética Insular creada»
    Redirección al detalle de la línea con checklist:
    ☐ Revisar tipos de recurso
    ☐ Ajustar formulario «Insumo cosmético»
    ☐ Definir primer proceso «Emulsión»
    ☐ Crear primer recurso de prueba (enlace a /resources/new)
```

### 6.2 Flujo B — Nueva categoría dentro del catálogo

**Objetivo:** Organizar recursos bajo «Cuidado facial › Sérum».

```
Paso 1 — Categorías → «Nueva categoría»

Paso 2 — Formulario lateral (Sheet) o panel centrado
    · Nombre: «Sérum»
    · Categoría padre: «Cuidado facial» (combobox con árbol)
    · Tipo de recurso asociado: «Producto terminado» (opcional)
    · Línea de negocio: «Cosmética Insular» (opcional)
    · Descripción

Paso 3 — Guardar
    → La categoría aparece en el árbol
    → Disponible de inmediato en filtros de Recursos y en wizard
```

### 6.3 Reglas UX del flujo

- Crear categoría **nunca** requiere más de 4 campos en el primer guardado
- El árbol se actualiza en tiempo real sin recargar página
- Archivar categoría con recursos hijos → diálogo de confirmación con conteo
- No se puede eliminar permanentemente; solo archivar

---

## 7. Formularios dinámicos sin modificar código

### 7.1 Concepto para el administrador

El administrador no «programa formularios». **Ensambla** propiedades existentes en un **formulario versionado** asociado a un tipo, subcategoría, proceso o lote.

```
Propiedad (reutilizable)     Formulario (composición)     Pantalla operativa
      pH          ──┐
      nombre      ──┼──►  Formulario «Insumo cosmético» v2  ──►  Wizard Recursos
      proveedor   ──┘
```

### 7.2 Ciclo de vida de un formulario

| Estado | Significado | Visible en operación |
|--------|-------------|---------------------|
| **Borrador** | En edición | No |
| **Publicado** | Versión activa para nuevos registros | Sí |
| **Archivado** | Histórico; no asignable a nuevos tipos | No |

Al publicar **v3**, los recursos creados con v1 o v2 **conservan su versión** hasta migración opcional.

### 7.3 Dónde se aplican los formularios

| Ámbito | Cuándo lo ve el operador |
|--------|--------------------------|
| Recurso | Wizard y edición en módulo Recursos |
| Receta | Formulación en módulo Recetas |
| Etapa de proceso | Registro durante un lote |
| Lote | Cabecera del lote en Producción |
| Equipo | Alta de equipamiento en Recursos |

El administrador elige el ámbito al crear el formulario.

---

## 8. Agregar campos visualmente — flujo detallado

### 8.1 Ejemplo narrativo: tipo «Cosmético» + campo «pH»

**Contexto:** El administrador ya creó el tipo de recurso «Cosmético» (código `cosmetic_supply`).

```
1. Ir a: Tipos de recursos → Cosmético → pestaña «Formulario»

2. Clic: «Agregar campo»

3. Modal «Nuevo campo» — dos pestañas:
   [ Crear propiedad nueva ]  [ Usar propiedad existente ]

4. Pestaña «Crear propiedad nueva»:
   ┌─────────────────────────────────────────┐
   │ Nombre visible *                        │
   │ [ pH                                  ] │
   │                                         │
   │ Código interno (auto: ph_level)         │
   │                                         │
   │ Tipo de dato *                          │
   │ [ Número decimal              ▼ ]       │
   │                                         │
   │ Unidad de medida                        │
   │ [ pH (escala)                 ▼ ]       │
   │                                         │
   │ Validación                              │
   │ Mín: [ 0    ]  Máx: [ 14   ]           │
   │                                         │
   │ Obligatorio                             │
   │ [●] Sí  [ ] No                          │
   │                                         │
   │ Visibilidad por módulo                  │
   │ [●] Recursos  [●] Detalle recurso       │
   │ [●] Inventario [ ] Producción           │
   │ [ ] Recetas   [ ] Reportes              │
   │                                         │
   │ Texto de ayuda (tooltip)                │
   │ [ Escala 0–14. Óptimo 5.0–5.5 para... ] │
   │                                         │
   │ Sección del formulario                  │
   │ [ Composición y calidad       ▼ ]       │
   │                                         │
   │        [ Cancelar ]  [ Agregar campo ]  │
   └─────────────────────────────────────────┘

5. El campo aparece en el editor visual del formulario
   → Reordenable por drag-and-drop
   → Editable (lápiz) o removable (×)

6. Clic «Previsualizar formulario»
   → Modal muestra el formulario tal como lo verá el operador en Recursos

7. Clic «Publicar cambios» → crea versión v2 del formulario
   → Diálogo: «3 recursos existentes usan v1. No se verán afectados.»
```

### 8.2 Tipos de dato disponibles en UI

| Tipo en UI | Uso |
|------------|-----|
| Texto corto | Nombres, códigos de referencia |
| Texto largo | Descripciones, notas |
| Número entero | Cantidades discretas |
| Número decimal | pH, graduación, densidad |
| Sí / No | Flags específicos del tipo |
| Fecha | Vencimiento, cosecha |
| Fecha y hora | Eventos puntuales |
| Lista desplegable | Opciones fijas definidas por admin |
| Selección múltiple | Etiquetas, usos permitidos |
| Archivo / documento | Ficha técnica adjunta |
| Referencia a recurso | Ingrediente relacionado, envase asociado |
| Unidad de medida | Campo numérico con unidad |

### 8.3 Condiciones de visibilidad (sin código)

El administrador define reglas con constructor visual:

```
Mostrar campo «Graduación alcohólica»
    CUANDO Subcategoría es «Alcohol»
    Y Tipo es «Insumo»
```

UI: filas de condición — Campo | Operador (es / no es / mayor que) | Valor.

**Límite:** máximo 5 condiciones por campo (ver §11).

---

## 9. Interfaz para administrar campos y formularios

### 9.1 Pantalla: Propiedades dinámicas (lista)

**Ruta:** `/settings/production/properties`

| Elemento | Especificación |
|----------|----------------|
| Header | Título, descripción, botón «Nueva propiedad» |
| Buscador | Por nombre o código |
| Filtros | Tipo de dato, ámbito, «en uso» / «sin usar» |
| Tabla | Nombre, Código, Tipo, Ámbitos, Usada en N formularios, Estado |
| Acciones fila | Editar, Ver uso, Archivar |

**Regla:** no se puede archivar una propiedad usada en un formulario publicado sin antes removerla o publicar nueva versión del formulario.

### 9.2 Pantalla: Editor de formulario

**Ruta:** `/settings/production/forms/[id]`

Layout **dos columnas** en desktop:

| Columna izquierda (60%) | Columna derecha (40%) |
|-------------------------|----------------------|
| Editor del formulario | Panel de propiedades |
| Secciones colapsables | Buscar propiedad |
| Campos drag-and-drop | «Crear nueva» |
| Botón «Agregar sección» | Propiedades arrastrables al formulario |

**Barra superior del editor:**

- Nombre del formulario + badge de versión (v2 Publicado)
- Botones: `Previsualizar` | `Guardar borrador` | `Publicar`
- Indicador de cambios sin publicar

**Sección tipo en editor:**

```
▼ Identificación
    [ nombre          ]  obligatorio  ⋮
    [ código interno  ]  automático   ⋮
▼ Composición y calidad
    [ pH              ]  obligatorio  ⋮
    [ densidad        ]  opcional     ⋮
▼ Proveedor y costos
    [ proveedor       ]  opcional     ⋮
```

### 9.3 Pantalla: Tipos de recursos (detalle)

**Ruta:** `/settings/production/resource-types/[id]`

**Pestañas:**

| Pestaña | Contenido |
|---------|-----------|
| **General** | Nombre, código, icono, color, familia, línea de negocio, flags por defecto |
| **Subcategorías** | Mini-tabla CRUD de subcategorías del tipo |
| **Formulario** | Acceso directo al editor; preview embebido |
| **Estados** | Estados aplicables y transiciones |
| **Impacto** | Cuántos recursos, recetas y lotes usan este tipo |

### 9.4 Pantalla: Estados

**Ruta:** `/settings/production/states`

1. Selector de dominio: Recurso | Stock | Equipo | Lote | Receta
2. Lista de estados con color semántico
3. Vista «Diagrama» — nodos y flechas de transición (solo lectura visual)
4. Editar transición → permisos y campos obligatorios al cambiar

### 9.5 Pantalla: Procesos productivos

**Ruta:** `/settings/production/processes/[id]`

- Cabecera: nombre, tipo de producto asociado, línea de negocio
- **Etapas** ordenables verticalmente (timeline invertido)
- Cada etapa expandible: nombre, duración sugerida, equipos válidos, formulario de etapa
- Preview: «Simular lote con este proceso»

### 9.6 Estilo visual

- Misma paleta y tipografía que [09 — Design System](09-design-system.md)
- Badges de estado: Borrador (outline), Publicado (success muted), Archivado (muted)
- Iconos Lucide outline; sin ilustraciones decorativas
- Densidad media en tablas; más aire en editores de formulario
- Modo oscuro por defecto

---

## 10. Elementos que SIEMPRE permanecen internos

Estos elementos **nunca** serán configurables por el administrador. No aparecen en la UI de Administración de Producción.

### 10.1 Núcleo del sistema

| Elemento fijo | Motivo |
|---------------|--------|
| Módulos principales (10 ítems de navegación) | Coherencia de producto y desarrollo |
| Entidad **Recurso** como concepto único | ADR-0005 |
| Flujo Recursos → Inventario → Recetas → Producción → Trazabilidad | Integridad operativa |
| Congelamiento de versión de receta al crear lote | Principio 6 |
| Trazabilidad append-only (no borrar eventos) | Principio 7 |
| Autenticación, sesiones, cifrado | Seguridad |
| Permisos de acceso a módulos (`config:production`, etc.) | Seguridad |
| Estructura de API `/api/v1/*` | Contrato técnico |
| Idioma del código y base de datos (inglés) | ADR-0001 |

### 10.2 Campos núcleo de cada entidad (no removibles)

Siempre presentes en formularios de operación, aunque el admin configure campos extra:

| Entidad | Campos fijos |
|---------|--------------|
| Recurso | Nombre, Código interno, Tipo, Estado global, Unidad base |
| Receta | Nombre, Versión, Estado |
| Lote | Código de lote, Receta versión congelada, Estado |
| Movimiento inventario | Recurso, Tipo movimiento, Cantidad, Fecha |
| Usuario | Email, Rol |

El administrador puede **añadir** campos; no puede **eliminar** los núcleo.

### 10.3 Límites técnicos no expuestos

| No configurable | Motivo |
|-----------------|--------|
| Tipos de dato SQL / JSON Schema interno | Capa técnica |
| Expresiones script o fórmulas arbitrarias | Riesgo de seguridad y mantenimiento |
| Layout libre (pixel-perfect) | Solo secciones y orden, no CSS |
| Webhooks arbitrarios por campo | Solo en Integraciones (futuro controlado) |

---

## 11. Riesgos de complejidad

| # | Riesgo | Impacto en UX | Mitigación diseñada |
|---|--------|---------------|---------------------|
| R1 | Demasiados tipos de recurso | Filtros inutilizables, wizard largo | Límite soft 30 tipos; agrupar en familias |
| R2 | Formularios con >25 campos | Abandono del wizard | Alerta al publicar; sugerir secciones |
| R3 | Propiedades duplicadas («pH» × 3) | Inconsistencia de datos | Catálogo único; favorecer «Usar existente» |
| R4 | Condiciones de visibilidad enredadas | Campos que no aparecen | Preview obligatorio; máx. 5 condiciones |
| R5 | Estados con transiciones circulares | Lotes atrapados en flujo | Validación de grafo acíclico al publicar |
| R6 | Archivar tipo en uso | Recursos huérfanos | Bloqueo con mensaje + conteo de impacto |
| R7 | Plantilla mal importada | Configuración incoherente | Preview + rollback de importación |
| R8 | Admin vs operador confundidos | Cambios accidentales en producción | Rol separado; confirmación en acciones destructivas |
| R9 | Multi-línea sin separación clara | Mezcla de taxonomías | Filtro por línea de negocio en todas las listas |
| R10 | Versiones de formulario divergentes | Datos difíciles de reportar | Indicador de versión en detalle de recurso |

---

## 12. Límites del sistema (guardrails)

Límites mostrados al administrador **antes** de alcanzarlos (advertencia al 80%).

| Límite | Valor recomendado | Comportamiento al exceder |
|--------|-------------------|---------------------------|
| Tipos de recurso activos | 30 | Advertencia; requiere confirmación |
| Subcategorías por tipo | 50 | Bloqueo con sugerencia de categorías |
| Propiedades en catálogo global | 200 | Advertencia de deuda técnica |
| Campos por formulario | 40 | Bloqueo al publicar |
| Secciones por formulario | 12 | Advertencia |
| Condiciones de visibilidad por campo | 5 | Bloqueo |
| Etapas por proceso | 20 | Advertencia |
| Estados por dominio | 15 | Advertencia |
| Niveles de categoría (profundidad árbol) | 5 | Bloqueo |
| Etiquetas activas | 100 | Advertencia |
| Líneas de negocio activas | 10 | Advertencia (multi-tenant futuro) |
| Versiones de formulario conservadas | 50 por formulario | Archivo automático de las más antiguas |

**Principio:** el sistema **advierte y guía** antes de **bloquear**. El bloqueo solo aplica a acciones que romperían integridad.

---

## 13. Buenas prácticas — escalabilidad 10 años

### 13.1 Para administradores

| Práctica | Por qué |
|----------|---------|
| Empezar con **plantilla de industria** | Evita reinventar taxonomía |
| Reutilizar **propiedades** del catálogo global | Un solo `pH`, no diez variantes |
| Publicar formularios solo tras **previsualizar** | Reduce sorpresas en operación |
| Usar **familias de recursos** antes de crear tipos nuevos | Mantiene navegación legible |
| Archivar, no eliminar | Preserva trazabilidad histórica |
| Una **línea de negocio** por operación productiva distinta | Separación clara en reportes |
| Documentar en «Texto de ayuda» cada campo no obvio | Reduce errores del operador |
| Revisar pestaña **Impacto** antes de cambios estructurales | Conciencia de dependencias |

### 13.2 Para el producto (diseño del sistema)

| Práctica | Por qué |
|----------|---------|
| Versionar todo esquema de formulario | Compatibilidad con datos históricos |
| Mantener catálogo global de propiedades | Evita fragmentación semántica |
| Ofrecer plantillas oficiales versionadas | Onboarding predecible |
| Log de cambios de configuración | Auditoría y rollback |
| Modo «solo operación» para productores | Menos ruido, menos errores |
| Export / import de configuración | Clonar entornos dev → prod |
| Simulador de lote y recurso desde admin | Validar antes de operar |
| Checklist post-importación | Guía al admin en primeros pasos |

### 13.3 Evolución por fases (recomendación UX)

| Fase | Alcance Administración de Producción |
|------|-------------------------------------|
| **v1** | Tipos, categorías, subcategorías, unidades, propiedades, formularios básicos |
| **v2** | Procesos, tipos de lote, estados configurables, plantillas de industria |
| **v3** | Diagrama de estados, simulador, log de cambios, export/import |
| **v4** | Multi-tenant, permisos granulares por línea de negocio |

---

## 14. Estados vacíos y mensajes

| Situación | Mensaje | Acción |
|-----------|---------|--------|
| Sin tipos de recurso | «Aún no hay tipos definidos. Importa una plantilla o crea el primero.» | Importar plantilla / Crear tipo |
| Formulario sin campos | «Este formulario está vacío. Arrastra propiedades o crea una nueva.» | Abrir panel propiedades |
| Propiedad sin uso | «Esta propiedad no se usa en ningún formulario publicado.» | Agregar a formulario / Archivar |
| Sin líneas de negocio | «Define una línea de negocio para organizar tu operación.» | Nueva línea |
| Error de validación al publicar | «No se puede publicar: [lista concreta de problemas]» | Corregir y reintentar |

---

## 15. Responsive

| Viewport | Adaptación |
|----------|------------|
| Desktop ≥1280px | Subnav fija + editor dos columnas |
| Tablet 768–1279px | Subnav colapsable; editor una columna con panel inferior de propiedades |
| Móvil <768px | Solo consulta y acciones simples; **edición de formularios desaconsejada** — banner: «Usa pantalla amplia para editar formularios» |

La configuración compleja es **desktop-first**; móvil permite revisar y aprobar, no diseñar formularios complejos.

---

## 16. Relación con módulos operativos

```
Administración de Producción (configura el «qué» y «cómo se registra»)
        │
        ▼
Recursos · Inventario · Recetas · Producción · Trazabilidad (operan con lo configurado)
```

| Cambio en admin | Efecto visible para operador |
|-----------------|------------------------------|
| Nuevo tipo «Cosmético» | Aparece en wizard y filtros de Recursos |
| Campo «pH» publicado | Visible en formulario de insumos cosméticos |
| Nuevo proceso «Emulsión» | Disponible al crear lote |
| Estado «En maceración» | Badge en lotes |
| Plantilla destilería importada | 10+ tipos listos para usar |

---

## 17. Checklist de implementación futura (referencia)

Cuando se implemente — **no en este sprint**:

- [ ] Panel `/settings/production`
- [ ] CRUD de cada maestro documentado en §4
- [ ] Editor visual de formularios con drag-and-drop
- [ ] Constructor de condiciones de visibilidad
- [ ] Preview de formulario en modal
- [ ] Importador de plantillas con preview
- [ ] Pestaña Impacto en tipos y propiedades
- [ ] Guardrails de §12 en UI
- [ ] Log de cambios de configuración

---

## 18. Resumen ejecutivo

| Pregunta | Respuesta |
|----------|-----------|
| ¿Qué es configurable? | Taxonomía, formularios, procesos, estados, unidades, etiquetas, documentos — §4 |
| ¿Cómo navega el admin? | Configuración → Administración de producción → subnav por grupos — §5 |
| ¿Nueva industria? | Línea de negocio + plantilla + checklist — §6 |
| ¿Formularios sin código? | Propiedades + composición versionada + preview — §7–9 |
| ¿Qué es fijo? | Módulos, recurso como entidad, campos núcleo, seguridad — §10 |
| ¿Riesgos? | Complejidad, duplicación, formularios largos — §11 |
| ¿Límites? | Cuotas documentadas en §12 |
| ¿10 años? | Plantillas, versionado, catálogo único, export — §13 |

---

*Documento v1.0 — Especificación UX: Administración de Producción / BrewOS*
