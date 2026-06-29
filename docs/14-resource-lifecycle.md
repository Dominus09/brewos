# 14 — Ciclo de vida de Recursos

Estados, transiciones y reglas de ciclo de vida de Recursos en BrewOS según su naturaleza. Complementa el estado global del recurso con estados específicos por dominio.

**Documentos relacionados:** [12 — Dominio de Recursos](12-resource-domain.md) · [13 — Taxonomía](13-resource-taxonomy.md) · [ADR-0005](decisions/ADR-0005-resource-as-core-entity.md)

---

## Visión general

Un recurso tiene:

1. **Estado global** — aplica a todos los tipos
2. **Estado extendido** — según flags y tipo (inventariable, equipamiento, cultivable, producto terminado)
3. **Estado de instancia en Inventario** — por lote de stock (no confundir con estado del maestro)

El **maestro del recurso** (`resources`) define identidad y reglas. El **stock** (`inventory_movements` / saldos) refleja cantidad y estado de instancias.

---

## Estados globales

Aplican a **todos** los tipos de recurso.

| Estado | Descripción | Visible en selectores operativos | Usable en nuevas recetas |
|--------|-------------|----------------------------------|--------------------------|
| **Borrador** | En definición; datos incompletos | No | No |
| **Activo** | Operativo y vigente | Sí (prioritario) | Sí |
| **Inactivo** | Existe pero no se usa en operación corriente | Sí (secundario, con aviso) | No recomendado |
| **Archivado** | Histórico; no operativo | No | No |

### Transiciones globales permitidas

```
Borrador → Activo
Activo → Inactivo
Activo → Archivado
Inactivo → Activo
Inactivo → Archivado
Archivado → (ninguna operativa; solo consulta)
```

**Regla:** pasar a **Activo** puede exigir campos obligatorios del tipo (ej. ficha técnica en equipamiento).

---

## Estados para inventariables

Aplican al **stock** de un recurso con `inventariable = true`, no al maestro en sí. Un mismo recurso puede tener múltiples lotes de stock en distintos estados.

| Estado | Descripción |
|--------|-------------|
| **Disponible** | Stock utilizable para producción o venta |
| **Reservado** | Cantidad apartada para un lote planificado |
| **Consumido** | Cantidad ya utilizada; histórico en movimientos |
| **Merma** | Pérdida registrada (derrame, rotura, vencimiento) |
| **Vencido** | Stock no utilizable por fecha de vencimiento |

### Relación con Inventario

| Acción en Inventario | Efecto en estado de stock |
|----------------------|---------------------------|
| Entrada | Crea stock **Disponible** (con lote/vencimiento si aplica) |
| Reserva para lote | **Disponible** → **Reservado** |
| Consumo en producción | **Reservado** o **Disponible** → **Consumido** |
| Ajuste negativo / merma | → **Merma** |
| Control de vencimiento | **Disponible** → **Vencido** |

### Relación con otros módulos

| Módulo | Uso |
|--------|-----|
| **Recetas** | No gestiona stock; referencia el recurso maestro |
| **Producción** | Dispara consumo; cambia estado de instancias de stock |
| **Trazabilidad** | Registra qué lote de stock se usó |
| **Reportes** | Valorización sobre **Disponible**; mermas y vencidos en análisis de pérdida |

---

## Estados para equipamiento

Aplican a recursos con `activo/equipamiento = true` (tipos Equipamiento, y opcionalmente Herramienta o Componente instalado).

| Estado | Descripción |
|--------|-------------|
| **Operativo** | Listo para usar en producción |
| **En mantención** | Temporalmente no disponible; mantenimiento programado |
| **Fuera de servicio** | Avería o revisión prolongada |
| **Retirado** | Dado de baja; histórico |

### Transiciones

```
Operativo ↔ En mantención
Operativo → Fuera de servicio
Fuera de servicio → En mantención → Operativo
Cualquiera → Retirado (irreversible operativamente)
```

### Relación con otros módulos

| Módulo | Uso |
|--------|-----|
| **Producción** | Solo equipos **Operativo** como opción principal en registro de lote |
| **Trazabilidad** | Registra qué equipo se usó (sin consumir cantidad) |
| **Laboratorio** | Manuales y procedimientos de mantención |
| **Reportes** | Valor de activos, tiempo fuera de servicio |

**Regla:** equipamiento **no se descuenta** por consumo normal en producción.

---

## Estados para botánicos cultivados

Aplican al vínculo entre recurso botánico `cultivable = true` y entidades del **Jardín Botánico** (`botanical_plants`, `harvests`). El estado del recurso maestro sigue siendo global (Activo); estos estados viven en la planta/cosecha.

| Estado | Descripción |
|--------|-------------|
| **Planificado** | Especie o plantación prevista, aún no ejecutada |
| **Plantado** | En suelo o contenedor; inicio de cultivo |
| **En crecimiento** | Desarrollo vegetativo activo |
| **Listo para cosecha** | Punto óptimo de recolección |
| **Cosechado** | Material recolectado; puede generar entrada a inventario |
| **Perdido** | Planta muerta o perdida |
| **Archivado** | Registro histórico de plantación |

### Relación con otros módulos

| Módulo | Uso |
|--------|-----|
| **Recursos** | Recurso botánico cultivable como maestro |
| **Jardín Botánico** | Estados en planta y cosecha |
| **Inventario** | Cosecha **Cosechado** → entrada de stock del recurso botánico |
| **Producción** | Consumo del stock originado en cosecha |
| **Trazabilidad** | Cadena planta → cosecha → lote → producto |

---

## Estados para producto terminado

Estado extendido del recurso tipo **Producto Terminado**, complementario al estado global.

| Estado | Descripción |
|--------|-------------|
| **En desarrollo** | Producto en formulación; no aprobado para venta |
| **Aprobado** | Receta y ficha validadas; listo para producir |
| **Producido** | Existe al menos un lote; puede haber stock |
| **En maduración** | Producto en reposo/barrica antes de venta |
| **Disponible para venta** | Stock apto para comercialización |
| **Retirado** | Descontinuado |

### Transiciones típicas

```
En desarrollo → Aprobado
Aprobado → Producido (primer lote)
Producido → En maduración (si aplica)
En maduración → Disponible para venta
Disponible para venta → Retirado
```

### Relación con otros módulos

| Módulo | Uso |
|--------|-----|
| **Recetas** | Receta asociada al producto terminado |
| **Producción** | Lote genera stock del recurso Producto Terminado |
| **Inventario** | Stock del producto envasado |
| **Trazabilidad** | Lote de producción → unidades producidas |
| **Reportes** | Ventas, costos, márgenes (futuro) |

**Regla:** un producto terminado **puede nacer desde un lote de producción** que crea o incrementa el stock del recurso correspondiente.

---

## Reglas de ciclo de vida (obligatorias)

| # | Regla |
|---|-------|
| 1 | Un recurso **archivado** no debe usarse en nuevas recetas |
| 2 | Un recurso **inactivo** no debe aparecer como opción principal en selectores |
| 3 | Un recurso **consumible** puede descontarse en producción |
| 4 | Un recurso **activo/equipamiento** no se descuenta por consumo normal |
| 5 | Un recurso **cultivable** puede conectarse con plantas y cosechas del Jardín Botánico |
| 6 | Un **producto terminado** puede nacer desde un lote de producción |
| 7 | Stock **vencido** no puede consumirse en producción sin ajuste explícito documentado |
| 8 | Recurso en **borrador** no genera movimientos de inventario |

---

## Integración entre ciclos de vida

```
                    ┌──────────────────┐
                    │ Estado global    │
                    │ Borrador/Activo/ │
                    │ Inactivo/Archivado│
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌─────────────┐    ┌──────────────┐   ┌──────────────┐
  │ Stock       │    │ Equipamiento │   │ Botánico     │
  │ inventariable│    │ Operativo/   │   │ Plantado →   │
  │ Disponible… │    │ Mantención…  │   │ Cosechado    │
  └──────┬──────┘    └──────┬───────┘   └──────┬───────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
                    ┌──────────────┐
                    │ Producción   │
                    │ (lote)       │
                    └──────┬───────┘
                            ▼
                    ┌──────────────┐
                    │ Trazabilidad │
                    └──────────────┘
```

---

## Impacto por módulo (resumen)

| Módulo | Qué respeta del ciclo de vida |
|--------|-------------------------------|
| **Recursos** | Estado global; flags; estado extendido según tipo |
| **Inventario** | Estados de stock; no opera sobre archivados |
| **Recetas** | Solo recursos activos; no archivados ni borrador |
| **Producción** | Consumibles + equipos operativos; congela versiones |
| **Trazabilidad** | Registra transiciones y lotes de stock usados |
| **Jardín Botánico** | Estados de cultivo y cosecha |
| **Reportes** | Excluye borradores; segmenta por estado |
| **Laboratorio** | Documentos requeridos para activación |

---

*Documento v1.0 — Ciclo de vida de Recursos BrewOS*
