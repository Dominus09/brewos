# ADR-0003: Centro de Control, no Dashboard

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principio 15](../11-product-principles.md) |

---

## Contexto

La pantalla principal de BrewOS tras el login es el punto de entrada a todos los módulos. En documentación temprana se usó el término «Dashboard» (común en software analítico). BrewOS no es una herramienta de BI ni un panel de métricas: es un **sistema de gestión de producción artesanal** orientado a la operación diaria.

---

## Decisión

1. El módulo y la pantalla principal se llamarán **Centro de Control** en toda la interfaz en español.

2. El término **Dashboard** no se usará en labels, menús ni documentación de usuario.

3. La ruta técnica puede permanecer `/dashboard` por convención de código en inglés (ver [ADR-0001](ADR-0001-interface-language.md)); el título visible siempre es «Centro de Control».

4. El contenido del Centro de Control en v1 es **operativo**, no analítico: resumen, actividad reciente, alertas y accesos rápidos — **sin gráficos** como elemento central.

---

## Por qué representa mejor el propósito

| Dashboard (rechazado) | Centro de Control (adoptado) |
|-----------------------|------------------------------|
| Evoca gráficos y KPIs | Evoca operación y supervisión |
| Asociado a BI y analytics | Asociado a sala de control, Home Assistant, Grafana operativo |
| Pasivo: «mirar datos» | Activo: «qué hacer ahora» |
| Genérico en SaaS | Específico al rol del productor artesanal |

BrewOS no es solo analítica: es **operación** — saber qué lotes están activos, qué stock requiere atención y desde dónde lanzar la siguiente acción.

---

## Consecuencias

| Área | Consecuencia |
|------|--------------|
| UI | Título H1: «Centro de Control»; sidebar: mismo nombre |
| Design System | Wireframes y mockups actualizados a esta nomenclatura |
| Reportes | Gráficos y análisis profundos viven en módulo Reportes, no aquí |
| Documentación | `docs/` usa «Centro de Control»; código puede usar `dashboard` |
| Marketing / onboarding | Mensaje: «tu centro de control de producción» |

---

## Beneficios

- Expectativas correctas: el usuario no busca gráficos elaborados en la pantalla inicial.
- Coherencia con referencias de producto (Home Assistant, Synology, Grafana como monitoreo operativo).
- Diferenciación de herramientas de business intelligence.
- Refuerza que BrewOS acompaña la operación diaria del patio y el laboratorio.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Desalineación ruta `/dashboard` vs nombre UI | ADR-0001 ya establece español en UI, inglés en rutas |
| Documentación antigua dice «Dashboard» | Actualizar `04-modules.md` y roadmap en revisión posterior |
| Usuarios esperan gráficos en «control» | Submenú Reportes para análisis; Centro de Control sin charts en v1 |

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Dashboard | Connotación analítica; no refleja operación artesanal |
| Inicio | Demasiado genérico; no comunica rol de supervisión |
| Panel principal | Vago; poco distintivo |
| Home | Anglicismo en UI; inconsistente con ADR-0001 |

---

## Referencias

- [10 — Mapa de navegación: Centro de Control](../10-navigation-map.md)
- [09 — Design System: Dashboard / Centro de Control](../09-design-system.md)
- [ADR-0001: Idioma de interfaz](ADR-0001-interface-language.md)
