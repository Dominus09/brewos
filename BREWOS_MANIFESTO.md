# BrewOS — Manifiesto

**BrewOS** es la plataforma tecnológica de **Insular Origins**: un sistema de gestión de producción artesanal diseñado para acompañar a productores que elaboran con las manos, documentan con rigor y escalan sin perder su identidad.

---

## Qué es BrewOS

BrewOS es un **ERP/LIMS artesanal** web responsive que centraliza:

- **Recursos** — todo lo que existe en la operación
- **Inventario** — stock y movimientos
- **Recetas** — formulaciones versionadas
- **Producción** — lotes y procesos
- **Trazabilidad** — historial completo por lote
- **Jardín Botánico** — cultivo y cosechas
- **Laboratorio** — conocimiento y documentación
- **Reportes** — vistas analíticas
- **Configuración** — administración del sistema y de la producción

No es una app de sensores. Es el **cerebro operativo** de una cervecería, destilería, cosmética artesanal, conservas gourmet, turismo de experiencia o cualquier línea de producción artesanal que Insular Origins decida incorporar.

**Dominio:** [tv.quillotana.cl](https://tv.quillotana.cl) · Futuro: `brewos.quillotana.cl`

---

## Misión

Dar a los productores artesanales las mismas herramientas de orden, trazabilidad y costos que tienen las industrias grandes — **sin imponer procesos de fábrica** ni sustituir el criterio humano.

---

## Visión

Ser la **plataforma de referencia** para gestión de producción artesanal en Chile y Latinoamérica: configurable por industria, honesta con el oficio, y preparada para crecer desde un patio hasta una operación multi-línea.

---

## Objetivo a 10 años

En 2036, BrewOS debe ser:

1. **La plataforma tecnológica consolidada de Insular Origins** — destilería, jardín, laboratorio, turismo y futuras líneas
2. **Un sistema altamente configurable** donde nuevas industrias se incorporan por administración, no por desarrollo
3. **Confiable para auditoría y trazabilidad** — cada lote explicable hasta el recurso original
4. **Ampliado por BrewNode** (ESP32) donde los sensores aporten datos, sin depender de ellos
5. **Mantenible por un equipo pequeño** gracias a arquitectura clara, documentación viva y deuda técnica controlada

---

## Qué queremos construir

| Sí | Descripción |
|----|-------------|
| **Plataforma configurable** | Tipos, formularios, procesos y estados administrables desde la UI |
| **Experiencia premium y calmada** | UI en español, oscura, minimalista, usable en patio con el móvil |
| **Trazabilidad real** | Cada lote reconstruible: qué se usó, cuánto costó, quién lo hizo |
| **Un solo recurso maestro** | Un alcohol, un botánico, una botella — un registro, muchos usos |
| **Producción manual primero** | Funciona al 100 % sin sensores ni automatización |
| **Documentación como ciudadano** | Decisiones, dominio y UX documentados antes de código |
| **Arquitectura de largo plazo** | Capas claras, migraciones, tests, ADRs |

---

## Qué NO queremos construir

| No | Por qué |
|----|---------|
| **Software rígido para una sola industria** | Insular Origins es multi-línea; el mundo artesanal es diverso |
| **ERP de estantería genérico** | SAP para una microcervecería no sirve; necesitamos oficio, no burocracia |
| **Fábrica automatizada** | El operador decide; el sistema registra |
| **Datos duplicados** | Una fuente de verdad por concepto |
| **Código como configuración** | Si un admin puede definirlo, no va en un `const` |
| **Sensores como requisito** | BrewNode amplía; no bloquea |
| **Deuda técnica «temporal» eterna** | Lo provisional se resuelve o se documenta con fecha |
| **Complejidad sin valor** | Microservicios, GraphQL, cachés exóticos — solo si el dolor es real |

---

## Principios

### Del producto

1. Todo dato existe en un solo lugar
2. Recursos antes que Inventario
3. Producción congela la versión de receta
4. Todo lote debe ser trazable
5. Todo costo debe poder explicarse
6. El software acompaña al productor, no lo reemplaza
7. Todo nace como Recurso
8. **Todo lo configurable se administra desde la interfaz** (ADR-0006)
9. **El código define el motor, no las líneas de negocio**
10. **Las nuevas industrias se agregan por configuración, no por desarrollo**

Ver lista completa: [docs/11-product-principles.md](docs/11-product-principles.md)

### Del desarrollo

1. Código limpio y arquitectura desacoplada
2. Configuración sobre programación
3. Documentación obligatoria
4. Primero simple, luego escalable
5. Responsive desde el inicio
6. Sin hardcodear reglas de negocio

Ver: [.foundation/development-manifesto.md](.foundation/development-manifesto.md)

---

## Filosofía de configuración

> *Todo aquello que pueda ser configurable por un administrador NO debe quedar definido en el código.*

BrewOS debe soportar — sin modificar el repositorio — industrias como:

Destilería · Cervecería · Agua purificada · Cosmética natural · Velas · Hidrolatos · Aceites esenciales · Mermeladas · Conservas · Charcutería · Productos gourmet · Turismo · Talleres · Merchandising

El administrador define **qué** se produce y **cómo se registra**. El código define **el motor** que lo hace posible.

---

## Para quién es BrewOS

| Persona | Rol |
|---------|-----|
| **Productor / operador** | Usa Recursos, Inventario, Producción día a día |
| **Administrador de producción** | Configura tipos, formularios y procesos |
| **Administrador del sistema** | Usuarios, seguridad, integraciones |
| **Desarrollador** | Extiende el motor respetando `.foundation/` y ADRs |

---

## Compromiso con Insular Origins

BrewOS no es un producto genérico abandonado a su suerte. Es la **infraestructura digital** de Insular Origins: nace en un patio de Quillota, crece con la operación real, y documenta cada decisión desde el primer lote.

**Powered by Insular Origins**  
**Crafted by Carlos Romero Ramírez**

---

## Siguiente paso

Si contribuyes al proyecto:

1. Lee este manifiesto
2. Lee [CONTRIBUTING.md](CONTRIBUTING.md)
3. Lee [.foundation/](.foundation/)
4. Construye

---

*BrewOS Manifiesto — v1.0 · Insular Origins*
