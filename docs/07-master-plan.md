# 07 — Master Plan

## Insular Origins Master Plan

Documento de visión del proyecto físico que BrewOS acompaña y documenta. No es un plano arquitectónico; es el **mapa de intención** del terreno, las zonas y el principio que guía el crecimiento.

---

## Punto de partida

Insular Origins **no nace en un predio de 5.000 m²**. Nace en un **patio de casa**: espacio reducido, equipos básicos, primeras recetas, primeras plantas. BrewOS registra ese origen desde el día uno.

El Master Plan describe hacia dónde va el proyecto, no dónde está hoy.

---

## Terreno futuro

**Superficie aproximada:** 5.000 m²

Ubicación y detalles catastrales se documentarán en `foundation/` a medida que el proyecto avance. BrewOS almacenará referencias, planos y bitácora de decisiones relacionadas con el terreno.

---

## Zonas planificadas

| Zona | Propósito |
|------|-----------|
| **Jardín botánico** | Cultivo de especies para botánicos, investigación y exhibición |
| **Destilería** | Producción de destilados, alambiques, área de maduración |
| **Cervecería** | Producción de cerveza artesanal, fermentación, acondicionamiento |
| **Planta de agua** | Tratamiento y abastecimiento de agua para producción |
| **Quincho / bar de catas** | Experiencia turística, degustaciones, eventos |
| **Senderos** | Recorrido peatonal entre zonas, interpretación del territorio |
| **Cabañas** | Hospedaje o estadía para visitantes y equipo |
| **Tinajas** | Almacenamiento tradicional, maduración, elemento patrimonial |

Cada zona tendrá su representación en BrewOS a medida que se habilite: ubicaciones en jardín botánico, equipamiento en recursos, procedimientos en knowledge base.

---

## Relación patio → terreno

```
HOY                          FUTURO
────                         ──────
Patio de casa        →       5.000 m² integrados
Producción piloto    →       Cervecería + destilería
Macetas y canteros   →       Jardín botánico
Cocina / garaje      →       Quincho + bar de catas
Bitácora en cuaderno →       BrewOS como memoria viva
```

BrewOS debe soportar esta transición sin migraciones dolorosas: mismos recursos, mismas recetas, misma trazabilidad — solo más volumen y más zonas.

---

## Principio interno

> **Crecer sin perder el origen.**

| Significado práctico |
|----------------------|
| Cada ampliación física se documenta en BrewOS antes o durante la obra |
| Las recetas y procesos del patio siguen siendo válidos en escala mayor |
| La trazabilidad del primer lote experimental tiene el mismo peso que la de producción comercial |
| La identidad visual y narrativa no se diluye al crecer |

---

## Rol de BrewOS en el Master Plan

| Función |
|---------|
| Bitácora de decisiones de diseño y construcción |
| Inventario de equipamiento por zona |
| Mapa de ubicaciones del jardín botánico |
| Documentación de normativas y permisos |
| Referencia cruzada entre zonas físicas y módulos del sistema |

El documento vivo del Master Plan (planos, renders, cronogramas) vivirá en la **Knowledge Base**; este archivo en `docs/` es la referencia conceptual permanente en el repositorio.

---

## Próximos pasos (fuera de BrewOS)

- Definición legal y catastral del terreno
- Estudios de suelo y agua
- Permisos sanitarios y municipales
- Diseño paisajístico y arquitectónico por zonas

BrewOS documentará cada hito en `journal_entries` y `documents` cuando los módulos correspondientes estén implementados.
