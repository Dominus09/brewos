# ADR-0002: Catálogo antes que Inventario

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principios 2 y 3](../11-product-principles.md) |

---

## Contexto

BrewOS gestiona materiales, equipos y botánicos que luego tendrán stock, aparecerán en recetas y se consumirán en lotes. Sin una regla explícita de orden de implementación y de uso, es común que sistemas permitan «crear insumos al vuelo» desde inventario o producción, generando duplicados, nombres inconsistentes y costos incorrectos.

---

## Decisión

1. El módulo **Catálogo** se desarrolla y se pone en producción **antes** que el módulo **Inventario**.

2. **Todo recurso debe existir en el Catálogo** antes de poder tener stock, aparecer en una receta o registrarse en un consumo de producción.

3. **Inventario no puede crear recursos.** Solo selecciona recursos existentes y registra movimientos.

4. En el roadmap, Catálogo corresponde al **Sprint 3** e Inventario al **Sprint 4**.

---

## Por qué

### Todo recurso debe existir antes de tener stock

El stock es una propiedad de un recurso ya definido (unidad, categoría, costo de referencia). Sin catálogo, «stock de qué» no tiene identidad estable en el sistema.

### Evita duplicidad

Si Inventario permite crear materiales inline, aparecen variantes del mismo insumo («Malta Pilsen», «malta pilsen», «Malta Pilsen 25kg») que rompen costos promedio y trazabilidad.

### Permite costos, recetas y trazabilidad

| Módulo | Dependencia del Catálogo |
|--------|--------------------------|
| Recetas | Ingredientes = recursos catalogados |
| Producción | Consumo referencia recursos con ID estable |
| Trazabilidad | Historial de «qué recurso» requiere entidad maestra |
| Reportes | Agregación por categoría y tipo |
| Jardín Botánico | Cosechas vinculadas a botánicos del catálogo |

---

## Consecuencias

| Área | Consecuencia |
|------|--------------|
| UX Inventario | Selector de recurso obligatorio; sin campo «nombre libre» |
| UX Producción | No hay «agregar insumo rápido» sin pasar por Catálogo |
| API | Endpoints de movimiento requieren `resource_id` válido |
| Onboarding | Primer uso del sistema: cargar catálogo mínimo antes de operar stock |
| Sprint planning | No iniciar Inventario hasta CRUD de Catálogo estable |

---

## Beneficios

- Fuente única de verdad desde el primer día operativo.
- Costos estimados de recetas calculables desde el inicio.
- Trazabilidad con identificadores estables.
- Menor deuda técnica por migraciones de «datos sucios» creados en inventario.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Fricción para usuario que quiere «solo anotar una entrada» | Flujo guiado: crear recurso en Catálogo en pocos campos, luego entrada |
| Catálogo vacío bloquea inventario | Seeds de unidades y categorías base; plantillas de recursos comunes |
| Percepción de lentitud vs Excel | Catálogo se carga una vez; movimientos son rápidos después |

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Inventario y Catálogo en paralelo mismo sprint | Riesgo de atajos que crean recursos desde inventario |
| Inventario primero (enfoque «stock rápido») | Duplicidad y deuda de datos casi inevitable |
| Un solo módulo «Recursos e Inventario» | Mezcla responsabilidades; viola principio de movimientos vs maestros |

---

## Referencias

- [10 — Mapa de navegación: Catálogo e Inventario](../10-navigation-map.md)
- [05 — Modelo de datos: resources, inventory_movements](../05-data-model.md)
- [08 — Reglas de desarrollo](../08-development-rules.md)
