# 04 — Módulos

BrewOS se organiza en módulos funcionales. Cada módulo responde una pregunta operativa concreta. Juntos forman el flujo completo de una operación artesanal.

---

## Inicio (Dashboard)

**¿Qué está pasando?**

Vista general del estado actual: lotes en curso, alertas de stock bajo, actividad reciente, accesos rápidos a tareas frecuentes. Es el punto de entrada después del login.

| Elementos clave |
|-----------------|
| Resumen de inventario crítico |
| Lotes activos |
| Últimos movimientos |
| Accesos directos por módulo |

---

## Recursos

**¿Qué existe?**

Catálogo maestro de todo lo que la operación utiliza. Ningún insumo, herramienta o equipamiento entra al sistema sin pasar primero por Recursos.

| Tipos de recurso |
|------------------|
| Insumos (malta, levadura, agua tratada, etc.) |
| Botánicos (especies, extractos, hierbas) |
| Equipamiento (fermentadores, alambiques, etc.) |
| Envases (botellas, barricas, tapones) |
| Herramientas (instrumentos de medición, utensilios) |

También gestiona categorías, unidades, proveedores y costos de referencia.

---

## Inventario

**¿Cuánto tenemos?**

Movimientos de stock: entradas (compras, donaciones, producción propia), salidas (consumo, venta, merma) y ajustes. Calcula stock actual y costo promedio.

| Operaciones |
|-------------|
| Entrada |
| Salida |
| Ajuste |
| Alerta de stock mínimo |

Inventario **no crea recursos**; solo mueve stock de recursos ya existentes.

---

## Recetas

**¿Cómo se elabora?**

Formulaciones versionadas que definen ingredientes, cantidades, rendimiento esperado y costo estimado. Una receta puede tener múltiples versiones; la producción congela la versión usada.

| Elementos |
|-----------|
| Receta base |
| Versiones |
| Ingredientes (vinculados a recursos) |
| Rendimiento esperado |
| Costo estimado |

---

## Producción

**¿Qué estamos haciendo?**

Ejecución de lotes en curso o completados. Vincula una versión de receta, registra etapas del proceso y consume inventario según la formulación.

| Elementos |
|-----------|
| Lote |
| Etapas del proceso |
| Consumo de inventario |
| Registro manual (temperatura, tiempos, notas) |

---

## Trazabilidad

**¿Qué ocurrió?**

Historial completo e inmutable por lote: qué recursos se usaron, en qué cantidad, a qué costo, con fotos, notas y documentos. Permite reconstruir la historia de cualquier producto.

| Registros |
|-----------|
| Eventos por lote |
| Recursos consumidos |
| Costos reales |
| Fotografías |
| Notas y documentos |

---

## Jardín Botánico

**¿Qué cultivamos?**

Gestión del cultivo: especies, ubicaciones en el terreno, plantaciones individuales, cosechas y su relación con lotes de producción.

| Elementos |
|-----------|
| Especies botánicas |
| Ubicaciones |
| Plantaciones |
| Cosechas |
| Fotografías |
| Vínculo cosecha → lote |

---

## Knowledge Base

**¿Qué hemos aprendido?**

Repositorio de conocimiento del proyecto: biblioteca, manuales, BrandBook, Master Plan, procedimientos, normativas y bitácora.

| Contenido |
|-----------|
| Documentos y manuales |
| Procedimientos operativos |
| Normativas |
| Bitácora del proyecto |
| Referencias de marca |

---

## Reportes

**¿Qué nos dicen los datos?**

Vistas analíticas sobre inventario, costos, producción y trazabilidad. Exportación y filtros por período.

| Reportes previstos |
|--------------------|
| Stock y valorización |
| Costos por lote |
| Consumo por período |
| Historial de producción |
| Rendimiento vs estimado |

*Nota: los reportes se implementarán progresivamente a medida que los módulos base generen datos.*

---

## Configuración

**¿Cómo se administra el sistema?**

Parámetros globales, usuarios, roles, unidades, categorías, preferencias y ajustes de la instalación.

| Áreas |
|-------|
| Usuarios y roles |
| Parámetros del sistema |
| Categorías y unidades |
| Integraciones (futuro BrewNode) |

---

## Mapa de relaciones entre módulos

```
Recursos ──► Inventario ──► Producción ──► Trazabilidad
    │              │              │
    └── Recetas ◄──┘              │
         │                        │
         └────────────────────────┘

Jardín Botánico ──► Recursos (botánicos) ──► Producción

Knowledge Base ◄── documenta ──► todos los módulos

Reportes ◄── lee ──► Inventario · Producción · Trazabilidad
```
