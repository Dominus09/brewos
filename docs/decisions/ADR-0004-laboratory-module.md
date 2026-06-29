# ADR-0004: Módulo Laboratorio en lugar de Knowledge Base

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principio 9](../11-product-principles.md) |

---

## Contexto

BrewOS debe almacenar documentación del proyecto: bitácora, procedimientos, normativas, identidad de marca, Master Plan e investigación. En documentación temprana este módulo se llamó **Knowledge Base** (término anglosajón común en wikis corporativas). Insular Origins combina producción artesanal, experimentación y documentación de un proyecto con identidad fuerte — el nombre del módulo debe reflejar ese espíritu.

---

## Decisión

1. El módulo se llamará **Laboratorio** en toda la interfaz en español.

2. El término **Knowledge Base** queda deprecado en UI y documentación de producto.

3. **Laboratorio** contendrá:

   | Submenú | Contenido |
   |---------|-----------|
   | Bitácora | Entradas cronológicas del proyecto |
   | Master Plan | Visión del terreno y zonas futuras |
   | BrandBook | Identidad Insular Origins |
   | Procedimientos | Pasos operativos estandarizados |
   | Manuales | Equipos y procesos |
   | Normativas | Regulaciones aplicables |
   | Investigación | Experimentos y referencias |
   | Aprendizajes | Conclusiones y lecciones |

4. La ruta técnica puede ser `/laboratory` o `/laboratorio` según convención de rutas; identificadores de código en inglés (`documents`, `journal_entries`).

5. En el roadmap, Laboratorio corresponde al **Sprint 9** (antes «Knowledge Base»).

---

## Por qué Laboratorio

### Representa el espíritu experimental y documental

Insular Origins no es solo producción: es investigación en patio, iteración de recetas, aprendizaje de cultivo y construcción de un proyecto con memoria. **Laboratorio** comunica:

- Experimentación controlada
- Registro de hipótesis y resultados
- Cultura de documentar para repetir y mejorar
- Coherencia con «Sistema de Gestión de Producción Artesanal» y módulos como Recetas y Jardín Botánico

### Knowledge Base es insuficiente

| Knowledge Base | Laboratorio |
|----------------|-------------|
| Término genérico de software | Término con identidad de oficio |
| Evoca wiki corporativa pasiva | Evoca acción, prueba y registro |
| En inglés en UI (viola espíritu ADR-0001) | Español natural para el equipo |
| Separado de la «operación» | Integrado en la narrativa del productor-artesano |

---

## Consecuencias

| Área | Consecuencia |
|------|--------------|
| Navegación | Ítem sidebar: «Laboratorio» con submenús listados arriba |
| Modelo de datos | Sin cambio: `documents`, `journal_entries` siguen en inglés |
| Sprint 8/9 roadmap | Renombrar entregable a Laboratorio |
| Contenido cruzado | Master Plan y BrandBook viven aquí; `docs/` en repo es documentación de desarrollo, no duplicado |
| Trazabilidad | Documentos de lote pueden referenciar procedimientos del Laboratorio |

---

## Beneficios

- Nombre alineado con operadores en Chile y con la identidad Insular Origins.
- Refuerza el principio «todo aprendizaje debe documentarse».
- Agrupa bajo un concepto unificado lo que antes parecía «wiki aparte».
- Mejor descubribilidad: el productor entiende que ahí va su bitácora y sus notas de prueba.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Confusión con «laboratorio físico» o módulo de análisis químico | Subtítulo en UI: documentación y conocimiento; análisis instrumental es futuro |
| Solapamiento con Recetas «notas de prueba» | Notas de prueba en receta = iteración de formulación; aprendizajes generales en Laboratorio |
| Documentación antigua dice Knowledge Base | Actualizar referencias en `04-modules`, README y roadmap |

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Knowledge Base | Anglicismo; genérico; pasivo |
| Biblioteca | Solo lectura; no cubre bitácora ni investigación activa |
| Documentación | Demasiado amplio; suena a archivo muerto |
| Archivo | Connotación pasiva, poco operativa |

---

## Referencias

- [10 — Mapa de navegación: Laboratorio](../10-navigation-map.md)
- [07 — Master Plan](../07-master-plan.md)
- [11 — Principios de producto](../11-product-principles.md)
- [ADR-0001: Idioma de interfaz](ADR-0001-interface-language.md)
