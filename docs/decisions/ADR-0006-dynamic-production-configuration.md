# ADR-0006: Configuración dinámica de producción

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principios 18, 21–25](../11-product-principles.md) |
| **Supersede parcialmente** | Taxonomía fija en código ([13 — Taxonomía](../13-resource-taxonomy.md) pasa a plantilla seed) |

---

## Contexto

BrewOS nació orientado a la operación de Insular Origins (destilería, cervecería, jardín botánico). La taxonomía inicial — diez tipos de recurso, subtipos, estados y formularios — está documentada en [13 — Taxonomía](../13-resource-taxonomy.md) y parcialmente codificada en el frontend.

Esa aproximación resuelve el arranque, pero **no escala** cuando la operación incorpora nuevas líneas sin intervención de desarrollo:

- Cosmética natural, velas, hidrolatos, aceites esenciales
- Mermeladas, conservas, charcutería, productos gourmet
- Turismo, talleres, catas, merchandising
- Agua purificada y futuras industrias artesanales

Cada nueva línea no debe implicar: despliegue de código, nuevos enums, formularios hardcodeados ni tablas por industria.

Los documentos [16 — Administración de Producción](../16-production-administration.md) y [17 — Administración de Producción UX](../17-production-administration-ux.md) especifican la arquitectura y la experiencia. Este ADR **consolida la decisión** que los gobierna.

**Filosofía adoptada:**

> *Todo aquello que pueda ser configurable por un administrador NO debe quedar definido en el código.*

---

## Decisión

BrewOS permitirá **administrar visualmente desde el frontend** la configuración de producción artesanal, **sin modificar código** para agregar:

- Nuevas **líneas de negocio**
- **Tipos de recursos** y familias
- **Categorías** y **subcategorías**
- **Unidades** de medida y conversiones
- **Propiedades dinámicas** y **formularios** versionados
- **Procesos productivos** y tipos de **lotes**
- **Estados** configurables y transiciones
- **Tipos de productos** y **tipos de documentos**
- **Plantillas de industria** importables

La configuración vive en **Configuración → Administración de Producción** ([10 — Mapa de navegación](../10-navigation-map.md)). Los módulos operativos (Recursos, Inventario, Recetas, Producción, Trazabilidad) **consumen** esa configuración; no la definen.

El **Recurso** sigue siendo la entidad central operativa ([ADR-0005](ADR-0005-resource-as-core-entity.md)). La configuración describe *cómo* se comportan los recursos; no crea entidades paralelas por industria.

---

## Problema que resuelve

| Problema actual o inminente | Cómo lo resuelve esta decisión |
|-----------------------------|--------------------------------|
| Taxonomía fija en código y docs | Tipos y campos administrables en base de datos |
| Cada industria nueva = sprint de desarrollo | Plantilla de industria + ajuste en UI |
| Formularios distintos por tipo hardcodeados | Motor de formularios dinámicos con esquemas versionados |
| Estados en enums rígidos | Estados y transiciones configurables por dominio |
| Riesgo de fork por vertical (destilería vs cosmética) | Una plataforma, múltiples líneas de negocio |
| Operador dependiente del equipo técnico para cambios menores | Administrador de producción autónomo dentro de guardrails |

---

## Crecimiento multi-industria sin código

BrewOS evoluciona de **software para destilerías** a **plataforma de gestión de producción artesanal**. El mecanismo es siempre el mismo:

```
Línea de negocio  +  Plantilla de industria  +  Ajuste administrativo
        │
        ▼
Tipos · Categorías · Propiedades · Formularios · Procesos · Estados
        │
        ▼
Módulos operativos (Recursos → Producción → Trazabilidad)
```

| Industria futura | Qué configura el admin (ejemplo) |
|------------------|----------------------------------|
| Destilería / Cervecería | Plantilla base; tipos Insumo, Botánico, Proceso destilación |
| Cosmética natural | Línea «Cosmética»; campo `pH`; proceso «Emulsión» |
| Velas / Aceites / Hidrolatos | Tipos materia prima y producto; unidades masa/volumen |
| Mermeladas / Conservas / Charcutería | Procesos térmicos; requisitos de lote y vencimiento |
| Turismo / Talleres / Merchandising | Tipo Servicio o Experiencia; sin inventario |
| Agua purificada | Proceso filtración; controles de calidad como propiedades |

**No existirán** módulos, tablas ni rutas por industria (`/distillery`, `/cosmetics`). Solo configuración bajo la misma Administración de Producción.

---

## Elementos configurables

Administrables desde **Configuración → Administración de Producción** (rol `config:production`):

| Ámbito | Elementos |
|--------|-----------|
| **Organización** | Líneas de negocio, plantillas de industria |
| **Taxonomía** | Tipos de recursos, familias, categorías, subcategorías, tipos de envases |
| **Medida** | Unidades, conversiones |
| **Atributos** | Propiedades dinámicas (catálogo global), formularios versionados, etiquetas |
| **Producción** | Tipos de productos, procesos productivos, tipos de lotes |
| **Ciclo de vida** | Estados y transiciones (recurso, stock, equipo, lote, receta) |
| **Documentación** | Tipos de documentos |
| **Dominios especiales** | Reglas de botánicos, reglas del catálogo |

Detalle de UX: [17 — Administración de Producción UX](../17-production-administration-ux.md).  
Detalle de modelo: [16 — Administración de Producción](../16-production-administration.md).

---

## Elementos internos (no configurables)

| Elemento | Motivo |
|----------|--------|
| **Diez módulos de navegación principal** | Coherencia de producto |
| **Entidad Recurso como núcleo** | ADR-0005 |
| **Flujo Recursos → Inventario → Recetas → Producción → Trazabilidad** | Integridad operativa |
| **Campos núcleo** (nombre, código, tipo, estado, unidad en recursos; versión congelada en lotes) | Integridad de datos |
| **Trazabilidad append-only** | Principio 7 |
| **Autenticación, roles, permisos de módulo** | Seguridad |
| **Contrato API `/api/v1/*`** | Estabilidad técnica |
| **Motor de renderizado de formularios** (código) | El código define el *motor*, no las líneas de negocio |
| **Scripts, fórmulas arbitrarias, layout libre CSS** | Riesgo de seguridad y mantenimiento |

El administrador **añade** campos y reglas; **no elimina** el núcleo del sistema.

---

## Riesgos

| Riesgo | Descripción |
|--------|-------------|
| **Sobre-configuración** | Demasiados tipos, campos o estados degradan la UX operativa |
| **Propiedades duplicadas** | Múltiples definiciones de «pH» o «graduación» sin catálogo único |
| **Esquemas divergentes** | Recursos en distintas versiones de formulario dificultan reportes |
| **Configuración incorrecta** | Archivar tipo en uso, transiciones imposibles, formularios vacíos |
| **Complejidad del motor EAV** | Propiedades dinámicas con impacto en performance de consultas |
| **Curva de aprendizaje del admin** | Distinguir tipo, categoría, subcategoría, propiedad y formulario |
| **Confusión admin vs operador** | Cambios en producción sin entender impacto |
| **Plantilla mal importada** | Configuración incoherente de una línea completa |
| **Deriva respecto a ADR-0005** | Tentación de crear tablas por industria que rompan el modelo unificado |

---

## Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Sobre-configuración | Límites documentados (tipos, campos por formulario, profundidad de categorías) — [17 — §12](../17-production-administration-ux.md) |
| Propiedades duplicadas | Catálogo global único; UI favorece «usar propiedad existente» |
| Esquemas divergentes | Versionado obligatorio; recursos conservan versión de esquema al crear |
| Configuración incorrecta | Pestaña «Impacto»; bloqueo al archivar con dependencias; preview antes de publicar |
| Performance EAV | Modelo híbrido: columnas núcleo + EAV para extensión; índices por `entity_type` |
| Curva de aprendizaje | Plantillas de industria; checklist post-importación; documentación in-app |
| Admin vs operador | Rol `config:production` separado; confirmación en acciones destructivas |
| Plantilla incorrecta | Preview de importación; rollback de importación |
| Deriva de ADR-0005 | Revisión de ADR en todo diseño de tabla; prohibición explícita de tablas por vertical |

---

## Consecuencias técnicas futuras

| Área | Consecuencia |
|------|--------------|
| **Base de datos** | Nuevas tablas de configuración (`resource_types`, `form_schemas`, `property_definitions`, `production_processes`, `state_definitions`, etc.) — ver [16 — §10](../16-production-administration.md) |
| **Backend** | API `/api/v1/config/*` separada; cache de esquemas publicados; validación server-side del motor de formularios |
| **Frontend** | Eliminar constantes de taxonomía (`resource-types.ts`); componente `DynamicForm`; CRUD en `/settings/production/*` |
| **Recursos** | Wizard y detalle leen esquema publicado por tipo |
| **Recetas / Producción** | Procesos y tipos de lote desde configuración |
| **Migración** | Taxonomía actual ([13](../13-resource-taxonomy.md)) → plantilla seed «Producción artesanal base» |
| **Principio 18** | Evoluciona: el *tipo configurado* define comportamiento, no el enum en código |
| **Documentación** | [13 — Taxonomía](../13-resource-taxonomy.md) pasa a referencia seed, no runtime |
| **Testing** | Tests de esquemas, transiciones de estado y guardrails de límites |
| **Multi-tenant (futuro)** | `tenant_id` en tablas de configuración desde diseño |

---

## Relación con ADR-0005

ADR-0005 establece **Recurso como entidad central**. ADR-0006 **no lo revoca** — lo fortalece:

- ADR-0005: *qué* es un recurso y *por qué* uno solo
- ADR-0006: *cómo* se describe cada recurso sin codificar cada industria

La diferenciación por tipo deja de vivir en código y pasa a **configuración administrable**, manteniendo `resource_id` como FK única en inventario, recetas y trazabilidad.

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Mantener taxonomía fija en código | No escala a 15+ industrias; cada línea = desarrollo |
| Tabla y módulo por industria | Fragmenta ADR-0005; duplica APIs y reportes |
| EAV puro sin columnas núcleo | Complejidad y performance para listados frecuentes |
| Configuración solo vía JSON/YAML en repo | Requiere despliegue; excluye al administrador de producción |
| Formularios en low-code externo | Dependencia de terceros; desalineación con BrewOS |

---

## Referencias

- [16 — Administración de Producción (arquitectura)](../16-production-administration.md)
- [17 — Administración de Producción UX](../17-production-administration-ux.md)
- [10 — Mapa de navegación](../10-navigation-map.md)
- [11 — Principios de producto](../11-product-principles.md)
- [ADR-0005 — Recurso como entidad central](ADR-0005-resource-as-core-entity.md)
