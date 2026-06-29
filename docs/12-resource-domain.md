# 12 — Dominio de Recursos

Definición precisa del concepto **Recurso** en BrewOS: qué es, qué atributos tiene, cuándo aplican y cómo se ejemplifica en la operación de Insular Origins.

**Documentos relacionados:** [13 — Taxonomía](13-resource-taxonomy.md) · [14 — Ciclo de vida](14-resource-lifecycle.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md) · [05 — Modelo de datos](05-data-model.md)

---

## Qué es un Recurso

Un **Recurso** es cualquier elemento **físico, biológico, técnico o comercial** necesario para producir, documentar, almacenar, transformar, embotellar o vender algo dentro de Insular Origins.

No es solo un «insumo». Un recurso puede ser:

- algo que se **compra** y se **consume** (alcohol, malta, botella),
- algo que se **cultiva** y se **cosecha** (murta, calafate),
- algo que se **usa sin gastarse** en un lote (alambique, fermentador),
- algo que **resulta** de la producción (Gin Murta 500 ml),
- algo que se **ofrecerá** en el futuro (Tour Premium).

**Regla fundacional:** en BrewOS, **todo nace como Recurso**. Inventario, recetas, producción, trazabilidad y jardín botánico operan sobre recursos ya definidos — nunca al revés.

---

## Alcance y límites

| Pertenece al dominio Recursos | No pertenece al dominio Recursos |
|-------------------------------|----------------------------------|
| Alcohol 96°, enebro, botella 500 ml | Usuario del sistema |
| Alambique 10 L, ESP32, sensor DS18B20 | Rol o permiso |
| Gin Murta 500 ml (producto terminado) | Lote de producción (vive en Producción) |
| Tour Premium (servicio futuro) | Movimiento de stock (vive en Inventario) |
| Murta cultivada (botánico) | Entrada de bitácora (vive en Laboratorio) |

Un **lote de producción** no es un recurso: es una instancia operativa que **consume** recursos y puede **generar** un recurso de tipo Producto Terminado.

---

## Ejemplos del dominio

| Ejemplo | Naturaleza |
|---------|------------|
| Alcohol 96° | Insumo consumible e inventariable |
| Enebro | Botánico comprado, consumible en receta |
| Murta | Botánico cultivable, vinculable al jardín |
| Calafate | Botánico (comprado, cultivado o de recolección) |
| Botella 500 ml | Envase consumible e inventariable |
| Tapa corona | Envase / packaging consumible |
| Etiqueta | Material de packaging consumible |
| Alambique 10 L | Equipamiento activo, no consumible |
| Fermentador 20 L | Equipamiento activo |
| Cuchara acero inoxidable | Herramienta reutilizable |
| Cautín | Herramienta eléctrica |
| ESP32 | Componente electrónico / equipamiento |
| Sensor DS18B20 | Componente electrónico consumible en ensamblaje |
| Gin Murta 500 ml | Producto terminado vendible |
| Tour Premium | Servicio futuro, no inventariable |

---

## Atributos conceptuales

Cada recurso puede tener los siguientes atributos. No todos aplican a todos los tipos; la **taxonomía** y los **flags de comportamiento** determinan cuáles son obligatorios, opcionales u ocultos en la UI.

### Identidad y clasificación

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **nombre** | Denominación legible para humanos. Único recomendado por tipo + subtipo en la práctica operativa. | Siempre. Obligatorio. |
| **código interno** | Identificador corto estable (ej. `INS-ALC-096`, `BOT-MUR-001`). Generado o manual. | Siempre. Obligatorio en recursos activos. |
| **tipo** | Clasificación principal de la taxonomía (Insumo, Botánico, Envase, etc.). | Siempre. Obligatorio. Define comportamiento base. |
| **subtipo** | Clasificación secundaria dentro del tipo (ej. Insumo → Alcohol; Botánico → Cultivado). | Siempre que el tipo tenga subtipos definidos. |
| **categoría** | Agrupación operativa libre o jerárquica (ej. Destilados → Botánicos chilotes). | Opcional. Recomendado para filtros y reportes. |
| **descripción** | Texto libre: origen, uso, notas de manejo. | Opcional. Recomendado en botánicos y equipamiento. |
| **estado** | Estado global del recurso: Borrador, Activo, Inactivo, Archivado. | Siempre. Ver [14 — Ciclo de vida](14-resource-lifecycle.md). |
| **notas** | Observaciones internas no estructuradas. | Opcional. |

### Unidad y proveedor

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **unidad base** | Unidad en que se mide el recurso (L, kg, unidad, %). | Siempre. Obligatorio. |
| **proveedor principal** | Proveedor habitual de compra. Referencia a `suppliers`. | Cuando el recurso se adquiere externamente. No aplica a cultivados propios ni servicios sin proveedor definido. |

### Costos

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **costo de compra** | Último o referencia de precio de adquisición por unidad base. | Recursos comprados. Insumos, envases, botánicos comprados, componentes. |
| **costo promedio** | Promedio ponderado calculado desde movimientos de inventario. | Solo si `inventariable = true`. **Derivado** — no se edita manualmente salvo ajuste excepcional documentado. |
| **valor estimado** | Valor de referencia para equipamiento, herramientas o activos sin rotación de stock. | Equipamiento, herramientas, componentes instalados. Opcional en insumos. |

### Inventario y consumo

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **stock mínimo** | Umbral de alerta de stock bajo. | Solo si `inventariable = true`. |
| **inventariable** | Si el recurso puede tener stock y movimientos en Inventario. | Insumos, envases, packaging, la mayoría de botánicos comprados. `false` en servicios, equipamiento, algunos productos terminados de solo referencia. |
| **consumible** | Si se descuenta o agota al usarse en producción. | Insumos, envases, botánicos en receta. `false` en equipamiento y herramientas reutilizables. |

### Origen y cultivo

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **cultivable** | Si puede vincularse con plantas y cosechas del Jardín Botánico. | Botánicos de origen vegetal. `true` para murta, calafate cultivados; `false` para enebro comprado seco. |

### Naturaleza del activo

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **activo / equipamiento** | Si es un bien de uso repetido, no consumido por lote. | Equipamiento, herramientas, electrónica instalada. Implica ciclo de vida de equipamiento. |
| **vendible** | Si puede comercializarse como producto o servicio al cliente. | Productos terminados, servicios, eventualmente merchandising. |

### Trazabilidad y cumplimiento

| Atributo | Descripción | Cuándo aplica |
|----------|-------------|---------------|
| **trazable** | Si cada uso en producción debe quedar registrado en Trazabilidad con detalle. | Casi todos los consumibles en producción. Obligatorio en botánicos, alcohol, productos terminados. |
| **requiere lote** | Si las entradas de inventario deben registrar lote de proveedor o interno. | Insumos críticos, alcohol, levadura, botánicos perecederos. |
| **requiere vencimiento** | Si las entradas deben registrar fecha de vencimiento. | Insumos perecederos, botánicos frescos, algunos químicos. |
| **requiere ficha técnica** | Si debe existir documento técnico adjunto antes de activar. | Equipamiento, insumos regulados, productos terminados aprobados. |
| **requiere ficha de seguridad** | Si requiere hoja de seguridad (MSDS o equivalente). | Alcohol, sanitizantes, aditivos químicos, materiales de limpieza. |

---

## Flags de comportamiento (resumen)

Los flags no son independientes; el **tipo** sugiere valores por defecto que el operador puede ajustar dentro de reglas de validación.

```
tipo → defaults de flags → validaciones en UI y API
```

| Flag | Efecto en el sistema |
|------|---------------------|
| `inventariable` | Habilita stock, movimientos, stock mínimo, costo promedio |
| `consumible` | Puede aparecer en recetas y descontarse en producción |
| `cultivable` | Enlace opcional con Jardín Botánico |
| `activo/equipamiento` | Ciclo de vida de equipamiento; no descuento por consumo normal |
| `vendible` | Visible en contexto comercial / producto terminado |
| `trazable` | Obligatoriedad de registro en Trazabilidad al consumir |

---

## Fichas de ejemplo completas

### 1. Alcohol 96°

| Atributo | Valor |
|----------|-------|
| nombre | Alcohol etílico 96° |
| código interno | INS-ALC-096 |
| tipo | Insumo |
| subtipo | Alcohol |
| categoría | Destilados → Base alcohólica |
| unidad base | L |
| descripción | Alcohol etílico alimenticio/grado neutral para maceración y ajuste |
| proveedor principal | Distribuidor químico local |
| costo de compra | Referencia por litro |
| costo promedio | Calculado desde entradas |
| valor estimado | — |
| stock mínimo | 5 L |
| inventariable | Sí |
| consumible | Sí |
| cultivable | No |
| activo/equipamiento | No |
| vendible | No |
| trazable | Sí |
| requiere lote | Sí |
| requiere vencimiento | Opcional según proveedor |
| requiere ficha técnica | Sí |
| requiere ficha de seguridad | Sí |
| estado | Activo |
| notas | Almacenar alejado de ignición |

---

### 2. Murta cultivada

| Atributo | Valor |
|----------|-------|
| nombre | Murta (Ugni molinae) — cultivada |
| código interno | BOT-MUR-CUL-001 |
| tipo | Botánico |
| subtipo | Cultivado |
| categoría | Botánicos chilotes → Frutos |
| unidad base | kg |
| descripción | Fruto de murta de plantación propia en patio/jardín |
| proveedor principal | — (producción propia) |
| costo de compra | — |
| costo promedio | Calculado si entra por cosecha a inventario |
| valor estimado | Costo estimado de cultivo (opcional) |
| stock mínimo | 0.5 kg |
| inventariable | Sí (tras cosecha) |
| consumible | Sí |
| cultivable | Sí |
| activo/equipamiento | No |
| vendible | No (como materia prima) |
| trazable | Sí |
| requiere lote | Sí (lote de cosecha) |
| requiere vencimiento | Sí (fresco) |
| requiere ficha técnica | No |
| requiere ficha de seguridad | No |
| estado | Activo |
| notas | Vincular con planta en Jardín Botánico |

---

### 3. Botella 500 ml

| Atributo | Valor |
|----------|-------|
| nombre | Botella vidrio 500 ml |
| código interno | ENV-BOT-500 |
| tipo | Envase |
| subtipo | Botella |
| categoría | Embotellado → Vidrio |
| unidad base | unidad |
| descripción | Botella transparente para gin/cerveza 500 ml |
| proveedor principal | Proveedor envases |
| costo de compra | Precio por unidad |
| costo promedio | Calculado |
| valor estimado | — |
| stock mínimo | 24 unidades |
| inventariable | Sí |
| consumible | Sí |
| cultivable | No |
| activo/equipamiento | No |
| vendible | No |
| trazable | Sí |
| requiere lote | Opcional |
| requiere vencimiento | No |
| requiere ficha técnica | No |
| requiere ficha de seguridad | No |
| estado | Activo |
| notas | — |

---

### 4. Alambique 10 L

| Atributo | Valor |
|----------|-------|
| nombre | Alambique cobre 10 L |
| código interno | EQP-ALQ-010 |
| tipo | Equipamiento |
| subtipo | Destilación |
| categoría | Destilería → Alambiques |
| unidad base | unidad |
| descripción | Alambique artesanal de cobre, capacidad nominal 10 L |
| proveedor principal | Fabricante / artesano |
| costo de compra | Valor de adquisición |
| costo promedio | — |
| valor estimado | Valor en libros del activo |
| stock mínimo | — |
| inventariable | No (o sí como activo unitario sin rotación — decisión de implementación) |
| consumible | No |
| cultivable | No |
| activo/equipamiento | Sí |
| vendible | No |
| trazable | Sí (uso en lote, no consumo) |
| requiere lote | No |
| requiere vencimiento | No |
| requiere ficha técnica | Sí |
| requiere ficha de seguridad | No |
| estado | Activo |
| estado equipamiento | Operativo |
| notas | Manual de operación en Laboratorio |

---

### 5. Gin Murta 500 ml

| Atributo | Valor |
|----------|-------|
| nombre | Gin Murta 500 ml |
| código interno | PT-GIN-MUR-500 |
| tipo | Producto Terminado |
| subtipo | Gin |
| categoría | Destilados → Gin |
| unidad base | unidad |
| descripción | Gin artesanal con botánico murta Insular Origins |
| proveedor principal | — (producción propia) |
| costo de compra | — |
| costo promedio | Derivado de costo de lote / producción |
| valor estimado | Precio de venta referencia |
| stock mínimo | 6 unidades |
| inventariable | Sí |
| consumible | No (es el output, no input de receta estándar) |
| cultivable | No |
| activo/equipamiento | No |
| vendible | Sí |
| trazable | Sí |
| requiere lote | Sí (lote de producción) |
| requiere vencimiento | Opcional según normativa |
| requiere ficha técnica | Sí |
| requiere ficha de seguridad | No |
| estado | Activo |
| estado producto | Aprobado / Disponible para venta |
| notas | Nace desde lote de producción; receta asociada |

---

### 6. Tour Premium (futuro)

| Atributo | Valor |
|----------|-------|
| nombre | Tour Premium Insular Origins |
| código interno | SRV-TOUR-PREM-001 |
| tipo | Servicio |
| subtipo | Tour |
| categoría | Experiencias → Turismo |
| unidad base | unidad (sesión / persona — definir al activar) |
| descripción | Recorrido premium por jardín, producción y cata |
| proveedor principal | — (servicio propio) |
| costo de compra | — |
| costo promedio | — |
| valor estimado | Precio de venta referencia |
| stock mínimo | — |
| inventariable | No |
| consumible | No |
| cultivable | No |
| activo/equipamiento | No |
| vendible | Sí |
| trazable | Opcional (registro de experiencia, no lote) |
| requiere lote | No |
| requiere vencimiento | No |
| requiere ficha técnica | No |
| requiere ficha de seguridad | No |
| estado | Borrador |
| notas | Servicio futuro; no bloquea operación actual |

---

## Relación con otros módulos

| Módulo | Cómo usa Recursos |
|--------|-------------------|
| **Inventario** | Solo recursos con `inventariable = true` |
| **Recetas** | Solo recursos con `consumible = true` como ingredientes |
| **Producción** | Consume recursos; puede generar Producto Terminado |
| **Trazabilidad** | Registra qué recurso, cuánto y de qué origen |
| **Jardín Botánico** | Recursos con `cultivable = true` |
| **Reportes** | Agrega por tipo, categoría, costo |
| **Laboratorio** | Fichas técnicas y de seguridad vía `resource_documents` |

---

## Reglas del dominio

1. Un recurso **archivado** no puede usarse en nuevas recetas ni movimientos.
2. Un recurso en **borrador** no aparece en selectores operativos (inventario, recetas).
3. El **código interno** no se reutiliza tras archivar (recomendado).
4. **Costo promedio** es derivado de inventario, no fuente primaria.
5. **Producto terminado** puede crearse como recurso y vincularse al lote que lo generó.

---

*Documento v1.0 — Dominio de Recursos BrewOS*
