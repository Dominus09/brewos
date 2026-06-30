# 18 — Identidad operacional

**Estándar oficial de identidad operacional de BrewOS.**

Este documento define el lenguaje visual y operativo que utilizará **todo BrewOS** durante los próximos años: cómo las personas identifican entidades, operaciones, etiquetas físicas, reportes y pantallas — independiente de cómo el sistema las almacena internamente.

**Documentos relacionados:** [09 — Design System](09-design-system.md) · [11 — Principios de producto](11-product-principles.md) · [ADR-0007](decisions/ADR-0007-operational-identity-standard.md)

**Estado:** Aceptado como pilar del proyecto. Cualquier desviación requiere ADR.

---

## 1. Filosofía

BrewOS opera con **dos identidades distintas** que nunca deben confundirse:

| Identidad | Audiencia | Formato | Dónde aparece |
|-----------|-----------|---------|---------------|
| **Técnica** | Sistema, API, base de datos, integraciones | UUID v4 (`id`) | Rutas API, FK, logs técnicos, payloads JSON |
| **Operacional** | Operadores, auditores, clientes, etiquetas físicas | Código visible (`internal_code` / códigos de operación) | UI, reportes, QR, PDF, conversación oral |

### Principio rector

> **Nunca se muestra un UUID al usuario.**

El operador de Insular Origins no piensa en `a3f2c891-…`. Piensa en «el BREW-RES-000042», «el lote DIS-20260701-003» o «la orden PO-20260715-002».

### Separación de responsabilidades

```text
UUID (id)              →  integridad, relaciones, API REST, unicidad global
Código operacional     →  memoria humana, etiquetas, auditoría, búsqueda rápida
Nombre / descripción   →  lenguaje natural (puede cambiar sin romper trazabilidad)
```

El **nombre** de un recurso puede editarse («Gin Patagonia» → «Gin Patagonia Reserva»). El **código operacional** no.

---

## 2. Reglas generales

Estas reglas aplican a **todos** los códigos operacionales de BrewOS:

| # | Regla | Implicación |
|---|-------|-------------|
| 1 | **Un código nunca cambia** | Tras asignación y publicación, es inmutable. Correcciones de datos no alteran el código. |
| 2 | **Un código nunca se reutiliza** | Aunque la entidad se archive o elimine lógicamente, su código queda reservado para siempre. |
| 3 | **El código visible no depende del UUID** | Se genera por reglas de negocio (prefijo + secuencia/fecha), no derivado del `id`. |
| 4 | **El código identifica la entidad de un vistazo** | Prefijo de 3–8 caracteres + cuerpo legible; sin ambigüedad entre familias. |
| 5 | **Legibilidad humana** | Mayúsculas, guiones, sin caracteres confusos (`O`/`0`, `I`/`1` evitados en secuencias si es posible). |
| 6 | **Apto para QR** | Máximo ~40 caracteres en operaciones; charset ASCII seguro. |
| 7 | **Apto para etiquetas físicas** | Impreso en 12–18 pt; escaneable a 30 cm en condiciones de taller. |
| 8 | **Apto para reportes** | Columna fija «Código» antes del nombre en todo listado y exportación. |
| 9 | **Apto para auditorías** | Un auditor puede citar `BREW-RES-000042` sin ambigüedad en cualquier módulo. |
| 10 | **Un solo estándar en toda la empresa** | Insular Origins y futuras líneas usan el mismo sistema de prefijos; la línea de negocio no altera el formato base. |

### Formato canónico

```text
{PREFIJO}-{SECUENCIA}
{PREFIJO}-{YYYYMMDD}-{SECUENCIA_DIARIA}    ← operaciones con fecha
```

- Separador: guion `-` (ASCII 0x2D)
- Fecha: `YYYYMMDD` en zona horaria operativa (`America/Santiago`)
- Secuencia numérica: padding de 3 dígitos en operaciones diarias; 6 dígitos en maestros

---

## 3. Estándar de códigos — Entidades maestras

Prefijo corporativo **`BREW-`** para entidades persistentes del catálogo. Secuencia **global, continua, sin reinicio diario**.

| Entidad | Prefijo | Formato | Ejemplo | Tabla / módulo |
|---------|---------|---------|---------|----------------|
| Recursos | `BREW-RES` | `BREW-RES-{NNNNNN}` | `BREW-RES-000001` | Recursos |
| Recetas (cabecera) | `BREW-REC` | `BREW-REC-{NNNNNN}` | `BREW-REC-000001` | Recetas |
| Versiones de receta | `BREW-REV` | `BREW-REV-{NNNNNN}` | `BREW-REV-000042` | Recetas |
| Equipos (instancia recurso) | `BREW-EQP` | `BREW-EQP-{NNNNNN}` | `BREW-EQP-000001` | Recursos (tipo equipment) |
| Proveedores | `BREW-SUP` | `BREW-SUP-{NNNNNN}` | `BREW-SUP-000001` | Recursos / Compras |
| Usuarios | `BREW-USR` | `BREW-USR-{NNNNNN}` | `BREW-USR-000001` | Configuración |
| Clientes | `BREW-CLI` | `BREW-CLI-{NNNNNN}` | `BREW-CLI-000001` | Comercial (futuro) |
| Botánicos (recurso maestro) | `BREW-BOT` | `BREW-BOT-{NNNNNN}` | `BREW-BOT-000001` | Recursos / Jardín |
| Plantas (instancia en jardín) | `BREW-PLT` | `BREW-PLT-{NNNNNN}` | `BREW-PLT-000001` | Jardín Botánico |
| Líneas de negocio | `BREW-BUS` | `BREW-BUS-{NNNNNN}` | `BREW-BUS-000001` | Configuración |
| Documentos | `BREW-DOC` | `BREW-DOC-{NNNNNN}` | `BREW-DOC-000001` | Laboratorio / adjuntos |
| Etiquetas (tag) | `BREW-TAG` | `BREW-TAG-{NNNNNN}` | `BREW-TAG-000001` | Recursos |
| Lotes de producción | `BREW-BAT` | `BREW-BAT-{NNNNNN}` | `BREW-BAT-000001` | Producción |
| Especies botánicas | `BREW-SPC` | `BREW-SPC-{NNNNNN}` | `BREW-SPC-000001` | Jardín Botánico |

**Nota sobre recursos:** Todo insumo, envase, herramienta, producto terminado o servicio catalogado recibe `BREW-RES-…` como código operacional principal. Los prefijos `BREW-EQP`, `BREW-BOT` son **alias semánticos** opcionales en UI e iconografía cuando el tipo lo amerita, pero el `internal_code` canónico en base de datos es siempre `BREW-RES-…` para mantener una sola secuencia de recursos (ADR-0005).

---

## 4. Estándar de códigos — Operaciones

Las **operaciones** incorporan **fecha** y reinician secuencia **cada día calendario** (zona `America/Santiago`).

| Operación | Prefijo | Formato | Ejemplo |
|-----------|---------|---------|---------|
| Producción (genérico) | `PRO` | `PRO-{YYYYMMDD}-{NNN}` | `PRO-20260701-001` |
| Destilación | `DIS` | `DIS-{YYYYMMDD}-{NNN}` | `DIS-20260701-001` |
| Fermentación | `FER` | `FER-{YYYYMMDD}-{NNN}` | `FER-20260701-001` |
| Maceración | `MAC` | `MAC-{YYYYMMDD}-{NNN}` | `MAC-20260701-001` |
| Embotellado | `BOT` | `BOT-{YYYYMMDD}-{NNN}` | `BOT-20260701-001` |
| Cosecha | `HAR` | `HAR-{YYYYMMDD}-{NNN}` | `HAR-20260701-001` |
| Laboratorio (ensayo / muestra) | `LAB` | `LAB-{YYYYMMDD}-{NNN}` | `LAB-20260701-001` |
| Orden de compra | `PO` | `PO-{YYYYMMDD}-{NNN}` | `PO-20260715-001` |
| Orden de trabajo | `WO` | `WO-{YYYYMMDD}-{NNN}` | `WO-20260715-001` |
| Movimiento de inventario | `MOV` | `MOV-{YYYYMMDD}-{NNN}` | `MOV-20260701-001` |
| Despacho / envío | `SHP` | `SHP-{YYYYMMDD}-{NNN}` | `SHP-20260720-001` |
| Trazabilidad (evento) | `TRC` | `TRC-{YYYYMMDD}-{NNN}` | `TRC-20260701-001` |

### Relación operación ↔ lote maestro

Un lote de producción tiene **dos códigos complementarios**:

| Tipo | Ejemplo | Uso |
|------|---------|-----|
| Maestro persistente | `BREW-BAT-000128` | Referencia histórica, reportes anuales |
| Operación del día | `DIS-20260701-001` | Etiqueta de taller, QR en proceso activo |

Ambos coexisten; la UI de taller prioriza el código con fecha; reportes consolidados pueden usar cualquiera con enlace cruzado.

---

## 5. Iconografía oficial

Iconografía **operacional** (etiquetas, QR, reportes, sidebar contextual). Distinta de los iconos Lucide del Design System, pero debe convivir con él.

| Entidad / módulo | Icono | Uso principal |
|------------------|-------|---------------|
| Recursos | 📦 | Catálogo, fichas, listados |
| Laboratorio | 🧪 | Ensayos, bitácora, investigación |
| Destilaciones | 🍶 | Proceso DIS, lotes destilería |
| Jardín Botánico | 🌿 | Plantas, cosechas, especies |
| Producción | ⚙️ | Lotes, etapas, órdenes de trabajo |
| Documentos | 📄 | Fichas técnicas, adjuntos |
| Etiquetas (tags) | 🏷️ | Clasificación transversal |
| Compras | 🛒 | Órdenes PO, recepciones |
| Usuarios | 👤 | Cuentas, permisos |
| Proveedores | 🏢 | Catálogo de proveedores |
| Despachos | 🚚 | Envíos, salidas comerciales |
| Inventario | 📊 | Stock, movimientos MOV |
| Trazabilidad | 🔗 | Eventos TRC, cadena de custodia |
| Reportes | 📈 | Análisis, exportaciones |
| Configuración | 🔧 | Administración del sistema |

### Iconografía por línea de negocio (contexto visual, no en código)

| Línea | Icono | Color asociado (ver §6) |
|-------|-------|------------------------|
| Destilados | 🥃 | Ámbar profundo |
| Cervezas | 🍺 | Dorado malta |
| Cosmética | 🧴 | Rosa salvia |
| Velas | 🕯️ | Crema cálido |
| Gourmet / mermeladas | 🍯 | Miel |
| Turismo / talleres | 🎫 | Terracota |

Estos iconos de línea aparecen como **badge secundario** en fichas y reportes; nunca sustituyen el prefijo `BREW-` ni los prefijos de operación.

---

## 6. Colores oficiales

Colores **semánticos por módulo y entidad**, alineados con [09 — Design System](09-design-system.md). Tokens listos para implementación futura en frontend.

### Módulos principales

| Módulo | Nombre | HEX claro | HEX oscuro | Token sugerido |
|--------|--------|-----------|------------|----------------|
| Recursos | Verde bosque | `#1B6B52` | `#2D8A68` | `module-resources` |
| Inventario | Verde pizarra | `#0A8F7A` | `#12B89E` | `module-inventory` (primario DS) |
| Recetas | Verde musgo | `#4A7C59` | `#5E9A6E` | `module-recipes` |
| Producción | Azul petróleo | `#1A4D5C` | `#2A6B7D` | `module-production` |
| Trazabilidad | Índigo | `#3D4F7C` | `#5A6FA0` | `module-traceability` |
| Jardín Botánico | Verde oliva | `#6B7C3D` | `#8A9E52` | `module-garden` |
| Laboratorio | Morado | `#6B4C8A` | `#8A6BA8` | `module-laboratory` |
| Reportes | Azul | `#0284C7` | `#38A8E8` | `module-reports` (info DS) |
| Configuración | Gris mineral | `#5C6B66` | `#8A9893` | `module-settings` (secundario DS) |
| Compras | Naranja tierra | `#B45309` | `#D97706` | `module-purchasing` |
| Comercial / clientes | Azul acero | `#475569` | `#64748B` | `module-commercial` |

### Líneas de negocio (acento en badges y reportes filtrados)

| Línea | HEX acento |
|-------|------------|
| Destilería | `#92400E` |
| Cervecería | `#CA8A04` |
| Cosmética | `#BE185D` |
| Velas | `#D97706` |
| Gourmet | `#A16207` |
| Turismo | `#C2410C` |

### Reglas de uso del color

1. El color de módulo se aplica a: borde izquierdo de card, badge de módulo en breadcrumbs, cabecera de reporte PDF.
2. **Nunca** como único indicador de estado (accesibilidad); siempre acompañar texto o icono.
3. Modo claro y oscuro deben mantener contraste WCAG AA mínimo sobre fondo de card.
4. Los colores de línea de negocio son **acento**, no reemplazan el color del módulo.

---

## 7. Reglas de numeración

| Categoría | Entidades | Secuencia | Reinicio | Dígitos |
|-----------|-----------|-----------|----------|---------|
| **Maestros globales** | BREW-RES, BREW-REC, BREW-SUP, BREW-USR, BREW-CLI, BREW-PLT, BREW-BUS, BREW-DOC, BREW-TAG, BREW-BAT, BREW-SPC | Continua desde 1 | **Nunca** | 6 (`000001`) |
| **Operaciones diarias** | PRO, DIS, FER, MAC, BOT, HAR, LAB, PO, WO, MOV, SHP, TRC | Por día calendario | **Cada medianoche** (America/Santiago) | 3 (`001`) |
| **Versiones** | BREW-REV | Continua ligada a receta | Nunca por versión publicada | 6 |
| **Borradores** | Cualquier maestro en `draft` | Sin código operacional | — | Código se asigna al **publicar** |

### Reglas de asignación

1. **Borrador:** sin `internal_code` operacional; mostrar «Borrador» o ID temporal interno no visible al usuario.
2. **Publicación:** asignación atómica de siguiente número en transacción (sin huecos intencionales; huecos por rollback son aceptables).
3. **Operación:** al crear el registro operativo (inicio de lote, apertura de PO), asignar código con fecha del momento de creación.
4. **Concurrencia:** bloqueo por prefijo + fecha en base de datos para evitar duplicados en operaciones simultáneas.

---

## 8. Reglas para QR

### Contenido del QR

El QR codifica **solo el código operacional** (no UUID, no URL con id):

```text
DIS-20260701-001
```

Opcional en fase futura: URL corta `https://tv.quillotana.cl/q/DIS-20260701-001` que resuelve internamente por código — la URL visible en etiqueta sigue siendo humana; el payload QR puede ser código puro para robustez offline.

### Layout de etiqueta física (taller)

```text
┌─────────────────────────────────────┐
│  🍶  DIS-20260701-001               │  ← icono línea + código operación
│  Gin Patagonia                      │  ← nombre legible
│  Estado: En maceración              │  ← estado configurable
│  BREW-BAT-000128                    │  ← código maestro (opcional, texto pequeño)
│                                     │
│         [ QR ]                      │  ← mínimo 25×25 mm impreso
└─────────────────────────────────────┘
```

### Especificaciones técnicas

| Parámetro | Valor |
|-----------|-------|
| Estándar QR | QR Code Model 2, corrección M |
| Tamaño mínimo impreso | 25 mm × 25 mm |
| Material | Resistente a humedad y alcohol (PET, polipropileno) |
| Fuente código | Monoespaciada o sans semibold, ≥ 10 pt |
| Información obligatoria | Código operación + nombre + estado |
| Información prohibida en QR | UUID, credenciales, datos personales sensibles |

---

## 9. Reglas para reportes

| Regla | Aplicación |
|-------|------------|
| Columna «Código» siempre visible | Primera o segunda columna en todo listado exportable |
| Formato sin abreviar | `BREW-RES-000042`, nunca `RES-42` ni solo `000042` |
| Encabezado de reporte | Incluir rango de fechas + filtros + logo Insular Origins |
| Pie de página | «Generado por BrewOS · {fecha hora} · Usuario {BREW-USR-…}» |
| Referencias cruzadas | Al citar entidad relacionada, usar su código operacional |
| PDF / Excel | Columna código como texto (no número) para preservar ceros |
| Auditoría | Toda fila debe poder rastrearse a un código único e inmutable |

### Ejemplo de fila en reporte de inventario

| Código | Nombre | Tipo | Stock | Unidad |
|--------|--------|------|-------|--------|
| BREW-RES-000042 | Alcohol 96° | Insumo | 12.5 | L |

---

## 10. Reglas API

### Contrato de respuesta (lectura)

Todo endpoint que devuelve una entidad identificable **debe** incluir:

```json
{
  "id": "a3f2c891-4b2e-4c1a-9d0e-8f7e6d5c4b3a",
  "internal_code": "BREW-RES-000042",
  "name": "Alcohol 96°"
}
```

| Campo | Uso en frontend |
|-------|-----------------|
| `id` | Rutas API, mutaciones, joins internos — **oculto en UI** salvo modo diagnóstico admin |
| `internal_code` | **Siempre visible** al usuario: listas, detalle, breadcrumbs, copiar al portapapeles |
| `name` | Título legible |

### Prohibido en API y UI

- Mostrar `id` (UUID) en tablas, detalles, etiquetas o reportes
- Usar UUID como parámetro de búsqueda visible al operador (búsqueda por `internal_code`)
- Generar códigos operacionales a partir del UUID (hash, truncado)
- Devolver solo `id` sin `internal_code` en entidades publicadas

### Búsqueda

`GET /api/v1/resources?search=BREW-RES-000042` y búsqueda parcial por prefijo/código.

---

## 11. Futuras industrias

Nuevas líneas de negocio **no crean nuevos prefijos de código maestro**. El estándar `BREW-*` es corporativo e inmutable.

| Industria | Cómo se incorpora | Código | Icono / color |
|-----------|-------------------|--------|---------------|
| Cosmética natural | Línea de negocio + plantilla industria | Mismos `BREW-RES`, `PRO-…` | 🧴 Rosa salvia |
| Velas | Idem | Idem | 🕯️ Crema cálido |
| Aceites esenciales | Idem | Idem | 🌿 Verde oliva |
| Mermeladas / conservas | Idem | Idem | 🍯 Miel |
| Charcutería | Idem | Idem | 🥩 (badge futuro) |
| Turismo / talleres | Recursos tipo `service` + operaciones WO | `BREW-RES` + `WO-…` | 🎫 Terracota |
| Merchandising | Recursos `finished_product` | `BREW-RES` | 📦 Verde bosque |

### Procesos nuevos por industria

Si una industria requiere un proceso no listado (ej. «saponificación»):

1. Registrar proceso en **Administración de Producción** (ADR-0006)
2. Solicitar **nuevo prefijo de operación** de 3 letras vía ADR o registro de prefijos (ej. `SAP-{YYYYMMDD}-{NNN}`)
3. **No** inventar prefijos en código sin documentar en este estándar

---

## 12. Buenas prácticas y errores comunes

### Hacer siempre

- Mostrar `internal_code` junto al nombre en la primera pantalla de detalle
- Copiar código al portapapeles con un clic
- Validar unicidad en base de datos (`UNIQUE` en `internal_code`)
- Documentar nuevos prefijos en este documento antes de implementar
- Usar zona horaria `America/Santiago` para operaciones diarias

### Errores comunes

| Error | Por qué es grave | Corrección |
|-------|------------------|------------|
| Mostrar UUID en UI «porque es más fácil» | Rompe confianza operativa; ilegible en taller | Usar `internal_code` siempre |
| Reutilizar código de entidad archivada | Contamina auditoría y trazabilidad | Secuencia sin reutilización |
| Editar código tras publicación | Rompe etiquetas ya impresas y reportes históricos | Inmutabilidad; crear nueva entidad si aplica |
| Prefijos distintos por desarrollador (`INS-`, `RES-`, `BREW-RES-`) | Fragmenta el estándar | Un solo registro de prefijos |
| Secuencia diaria sin bloqueo transaccional | Duplicados en turnos simultáneos | Lock por prefijo + fecha |
| QR con URL que expone UUID | Filtración de identificadores internos | QR = código operacional |
| Códigos solo en inglés en UI | Viola ADR-0001 para labels; códigos técnicos sí en inglés/ASCII | Labels español; códigos ASCII mayúsculas |
| Mezclar `code_prefix` de tipo de recurso con `internal_code` | Dos sistemas en conflicto | `code_prefix` de taxonomía es config interna; `internal_code` sigue `BREW-RES-` |

---

## Gobernanza del estándar

| Acción | Responsable | Artefacto |
|--------|-------------|-----------|
| Nuevo prefijo maestro u operación | Producto + Arquitectura | ADR o actualización de este doc |
| Cambio de formato | Solo vía ADR que supere ADR-0007 | Nueva versión doc 18 |
| Implementación técnica | Backend (secuencias, validación) | Servicio `OperationalCodeService` (futuro) |
| Validación visual | Diseño + Frontend | Tokens en Design System |

---

## Referencias

- [ADR-0007 — Identidad operacional](decisions/ADR-0007-operational-identity-standard.md)
- [05 — Modelo de datos](05-data-model.md) — columna `internal_code`
- [.foundation/naming-conventions.md](../.foundation/naming-conventions.md)
- [09 — Design System](09-design-system.md)

---

*Documento v1.0 — Identidad operacional BrewOS / Insular Origins — Pilar del proyecto*
