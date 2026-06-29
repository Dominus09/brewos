# 13 — Taxonomía de Recursos

Taxonomía oficial de tipos y subtipos de Recursos en BrewOS. Define comportamiento por defecto, campos recomendados y reglas de participación en otros módulos.

**Documentos relacionados:** [12 — Dominio de Recursos](12-resource-domain.md) · [14 — Ciclo de vida](14-resource-lifecycle.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)

---

## Estructura de la taxonomía

```
Recurso
├── tipo (obligatorio, 1 de 10)
├── subtipo (obligatorio si el tipo tiene subtipos definidos)
├── categoría (opcional, jerárquica, libre)
└── etiquetas (opcional, transversal)
```

Los **tipos** son fijos y administrados por el sistema. Los **subtipos** son fijos por tipo. Las **categorías** y **etiquetas** las define el operador.

---

## Leyenda de columnas

| Columna | Significado |
|---------|-------------|
| **Inventariable** | Normalmente tiene stock |
| **Consumible** | Normalmente se usa en recetas y se descuenta |
| **Trazable** | Normalmente requiere registro detallado en producción |
| **Costo** | Puede tener costo de compra / promedio / valor estimado |
| **Recetas** | Puede ser ingrediente en recetas |
| **Producción** | Participa en lotes (consumo o output) |

Valores: **Sí** / **No** / **Opcional** / **Parcial** (casos especiales).

---

## 1. Insumo

| Campo | Valor |
|-------|-------|
| **Descripción** | Materia prima que se incorpora al producto o se transforma en el proceso. |
| **Ejemplos** | Alcohol 96°, malta, lúpulo, levadura, agua tratada, azúcar, nutrientes, clarificantes |
| **Inventariable** | Sí |
| **Consumible** | Sí |
| **Trazable** | Sí |
| **Costo** | Sí |
| **Recetas** | Sí |
| **Producción** | Sí (consumo) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Alcohol | Alcohol 96°, vodka neutro, vino base |
| Malta | Malta Pilsen, Malta Munich, extracto de malta |
| Lúpulo | Lúpulo pellet, lúpulo flor |
| Levadura | Kveik, US-05, levadura destilación |
| Agua | Agua osmotizada, agua ajustada |
| Azúcar | Glucosa, sacarosa, jarabe |
| Aditivo | Nutrientes, enzimas, clarificantes, ácidos |

### Campos recomendados

Obligatorios: nombre, código, subtipo, unidad base, inventariable, consumible, trazable.  
Recomendados: proveedor, costo de compra, stock mínimo, requiere lote (alcohol, levadura), ficha de seguridad (químicos).

---

## 2. Botánico

| Campo | Valor |
|-------|-------|
| **Descripción** | Material de origen vegetal o extracto botánico usado en maceración, destilación o aromatización. |
| **Ejemplos** | Enebro, murta, calafate, boldo, canela, raíz de angélica |
| **Inventariable** | Sí |
| **Consumible** | Sí |
| **Trazable** | Sí |
| **Costo** | Sí |
| **Recetas** | Sí |
| **Producción** | Sí (consumo) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Comprado | Enebro seco importado, extracto comercial |
| Cultivado | Murta de jardín propio, calafate plantada |
| Silvestre / Recolección | Material recolectado en terreno autorizado |
| Seco | Hierbas deshidratadas |
| Fresco | Frutos o hojas frescas de cosecha |

### Campos recomendados

Obligatorios: nombre, código, subtipo, unidad base, cultivable (según subtipo), trazable.  
Recomendados: vínculo jardín (si cultivado), requiere lote, requiere vencimiento (fresco), proveedor (si comprado).

---

## 3. Envase

| Campo | Valor |
|-------|-------|
| **Descripción** | Contenedor o cierre que envuelve el producto terminado. |
| **Ejemplos** | Botella 500 ml, barril, growler, tapa corona, corcho |
| **Inventariable** | Sí |
| **Consumible** | Sí |
| **Trazable** | Sí |
| **Costo** | Sí |
| **Recetas** | Opcional (puede incluirse en receta de embotellado) |
| **Producción** | Sí (consumo en embotellado) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Botella | Vidrio 500 ml, 750 ml |
| Tapa | Corona, rosca, swing top |
| Corcho | Corcho natural, sintético |
| Caja | Caja 6 unidades, estuche |
| Etiqueta | Etiqueta frontal, contramarca |

### Campos recomendados

Obligatorios: nombre, código, subtipo, unidad base (unidad).  
Recomendados: proveedor, costo de compra, stock mínimo.

---

## 4. Equipamiento

| Campo | Valor |
|-------|-------|
| **Descripción** | Bien de capital usado repetidamente en producción. No se consume por lote. |
| **Ejemplos** | Alambique 10 L, fermentador 20 L, tinaja, bomba, refrigerador |
| **Inventariable** | Opcional (activo unitario) |
| **Consumible** | No |
| **Trazable** | Sí (uso en lote, no cantidad) |
| **Costo** | Sí (valor estimado / adquisición) |
| **Recetas** | No |
| **Producción** | Sí (equipo utilizado) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Elaboración | Ollas, tinas de maceración |
| Fermentación | Fermentador, airlock |
| Destilación | Alambique, condensador |
| Medición | Densímetro, refractómetro, termómetro |
| Embotellado | Llenadora, capsuladora |
| Electrónica | ESP32 instalado, controlador |
| Seguridad | Extintor, kit derrames |

### Campos recomendados

Obligatorios: nombre, código, subtipo, activo/equipamiento, estado de equipamiento.  
Recomendados: valor estimado, ficha técnica, manual en Laboratorio.

---

## 5. Herramienta

| Campo | Valor |
|-------|-------|
| **Descripción** | Utensilio de uso manual o eléctrico de apoyo. Menor valor y portabilidad que equipamiento. |
| **Ejemplos** | Cuchara inox, cautín, hidrómetro, tijeras de poda |
| **Inventariable** | Opcional |
| **Consumible** | No |
| **Trazable** | Opcional |
| **Costo** | Sí |
| **Recetas** | No |
| **Producción** | Opcional |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Manual | Cuchara, embudo, termómetro manual |
| Eléctrica | Cautín, batidora, bomba pequeña |
| Limpieza | Cepillo, esponja dedicada |
| Jardinería | Tijeras, rastrillo, macetero |

### Campos recomendados

Obligatorios: nombre, código, subtipo.  
Recomendados: valor estimado, ubicación.

---

## 6. Producto Terminado

| Campo | Valor |
|-------|-------|
| **Descripción** | Producto elaborado listo para venta, cata o exhibición. Puede nacer de un lote de producción. |
| **Ejemplos** | Gin Murta 500 ml, IPA en botella, agua mineral, licor calafate |
| **Inventariable** | Sí |
| **Consumible** | No (es output, no input típico) |
| **Trazable** | Sí |
| **Costo** | Sí (derivado de lote) |
| **Recetas** | No (es resultado de receta) |
| **Producción** | Sí (output) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Gin | Gin Murta, Gin Calafate |
| Cerveza | IPA, Stout, Lager |
| Agua | Agua mineral, agua aromatizada |
| Licor | Licor de murta, mistela |
| Merchandising | Copa, polera, kit regalo |

### Campos recomendados

Obligatorios: nombre, código, subtipo, vendible, trazable, requiere lote.  
Recomendados: valor estimado (precio venta), ficha técnica, vínculo receta/lote de origen.

---

## 7. Servicio

| Campo | Valor |
|-------|-------|
| **Descripción** | Oferta comercial o experiencia sin stock físico. Planificación futura. |
| **Ejemplos** | Tour Premium, cata guiada, arriendo de quincho |
| **Inventariable** | No |
| **Consumible** | No |
| **Trazable** | Opcional |
| **Costo** | Sí (valor referencia) |
| **Recetas** | No |
| **Producción** | No |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Tour | Tour Premium, tour jardín |
| Cata | Cata de gin, maridaje |
| Arriendo | Arriendo espacio, equipamiento |
| Experiencia | Workshop, masterclass |

### Campos recomendados

Obligatorios: nombre, código, subtipo, vendible, estado (a menudo Borrador al inicio).  
Recomendados: valor estimado, descripción comercial.

---

## 8. Material de Limpieza

| Campo | Valor |
|-------|-------|
| **Descripción** | Insumos para sanitización y limpieza de equipos y espacios. |
| **Ejemplos** | Sanitizante no enjuague, alcohol de limpieza, guantes, paños |
| **Inventariable** | Sí |
| **Consumible** | Sí (puede asignarse a lote o centro de costo) |
| **Trazable** | Opcional |
| **Costo** | Sí |
| **Recetas** | No |
| **Producción** | Opcional (costo indirecto) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Sanitizante | Star San, peróxido |
| Alcohol limpieza | Alcohol 70° limpieza |
| Paños | Paño microfibra, trapo |
| Guantes | Guantes nitrilo |
| Cepillos | Cepillo botellas, cepillo fermentador |

### Campos recomendados

Obligatorios: nombre, código, subtipo, inventariable.  
Recomendados: ficha de seguridad (sanitizantes), stock mínimo.

---

## 9. Material de Packaging

| Campo | Valor |
|-------|-------|
| **Descripción** | Elementos de presentación y protección del producto. Puede solaparse con Envase; se distingue por uso gráfico/secundario. |
| **Ejemplos** | Etiqueta, caja de cartón, bolsa, sello de lacre, collarín |
| **Inventariable** | Sí |
| **Consumible** | Sí |
| **Trazable** | Opcional |
| **Costo** | Sí |
| **Recetas** | Opcional (embotellado) |
| **Producción** | Sí |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| Etiqueta | Etiqueta gin, contramarca |
| Caja | Pack 3, estuche regalo |
| Bolsa | Bolsa papel kraft |
| Sello | Lacre, sticker |
| Collarín | Collarín botella |

### Campos recomendados

Obligatorios: nombre, código, subtipo, unidad base.  
Recomendados: proveedor, costo, stock mínimo.

---

## 10. Componente Electrónico

| Campo | Valor |
|-------|-------|
| **Descripción** | Partes para BrewNode, sensores y automatización futura. |
| **Ejemplos** | ESP32, sensor DS18B20, cable, fuente, pantalla OLED |
| **Inventariable** | Sí |
| **Consumible** | Parcial (se instala; no se consume por lote de bebida) |
| **Trazable** | Opcional |
| **Costo** | Sí |
| **Recetas** | No |
| **Producción** | No (módulo BrewNode futuro) |

### Subtipos

| Subtipo | Ejemplos |
|---------|----------|
| ESP32 | ESP32-WROOM, ESP32-S3 |
| Sensor | DS18B20, celda de carga |
| Cable | Jumper, USB, alimentación |
| Fuente | Fuente 5V, transformador |
| Módulo | Relé, ADC, level shifter |
| Pantalla | OLED, TFT local |

### Campos recomendados

Obligatorios: nombre, código, subtipo.  
Recomendados: proveedor, valor estimado, ficha técnica, vínculo equipamiento instalado.

---

## Matriz resumen por tipo

| Tipo | Inv. | Cons. | Traz. | Recetas | Prod. |
|------|------|-------|-------|---------|-------|
| Insumo | Sí | Sí | Sí | Sí | Consumo |
| Botánico | Sí | Sí | Sí | Sí | Consumo |
| Envase | Sí | Sí | Sí | Opc. | Consumo |
| Equipamiento | Opc. | No | Sí | No | Uso |
| Herramienta | Opc. | No | Opc. | No | Opc. |
| Producto Terminado | Sí | No | Sí | No | Output |
| Servicio | No | No | Opc. | No | No |
| Mat. Limpieza | Sí | Sí | Opc. | No | Opc. |
| Mat. Packaging | Sí | Sí | Opc. | Opc. | Consumo |
| Comp. Electrónico | Sí | Parcial | Opc. | No | No |

---

## Solapamientos y reglas de desambiguación

| Caso | Regla |
|------|-------|
| Etiqueta como Envase vs Packaging | **Envase** si es contenedor físico de cierre; **Packaging** si es elemento gráfico/adhesivo |
| ESP32 como Equipamiento vs Componente | **Componente** si es repuesto/stock; **Equipamiento** si está instalado como nodo BrewNode activo |
| Botella vs Producto Terminado | **Envase** es el envase vacío; **Producto Terminado** es la unidad llena y etiquetada |
| Alcohol insumo vs alcohol limpieza | **Insumo → Alcohol** vs **Material de Limpieza → Alcohol limpieza** — códigos distintos obligatorios |

---

## Validaciones por tipo (para implementación futura)

Al crear o editar un recurso, el sistema debe:

1. Mostrar solo subtipos del tipo seleccionado
2. Aplicar defaults de flags según matriz de este documento
3. Ocultar campos irrelevantes (ej. `cultivable` en Equipamiento)
4. Exigir campos recomendados marcados como obligatorios por configuración
5. Impedir `consumible = true` en Equipamiento y Servicio

---

*Documento v1.0 — Taxonomía de Recursos BrewOS*
