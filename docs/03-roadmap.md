# 03 — Roadmap

Roadmap de desarrollo de BrewOS por sprints. Cada sprint entrega valor funcional incremental. No se avanza al siguiente sin tener estable la base del anterior.

---

## Sprint 0 — Fundación

**Objetivo:** Establecer las bases del proyecto antes de escribir código de aplicación.

- [x] Estructura del repositorio
- [x] Documentación inicial (visión, arquitectura, módulos, modelo de datos)
- [x] Definición de módulos funcionales
- [x] Estilo base (tipografía, colores, componentes UI de referencia) → ver [09 — Design System](09-design-system.md)
- [ ] Configuración inicial de entornos (cuando corresponda)

**Entregable:** Repositorio documentado, visión clara, equipo alineado.

---

## Sprint 1 — Design System

**Objetivo:** Definir la identidad visual oficial y el sistema de diseño antes del código frontend.

- [x] Design System documentado ([09 — Design System](09-design-system.md))
- [x] Paleta de colores (claro / oscuro)
- [x] Tipografía y escala
- [x] Iconografía y componentes
- [x] Conceptos de logo y monograma
- [x] Estructura de carpetas en `assets/`
- [ ] Logo final (diseño gráfico)
- [ ] Mockups Figma de Login y Dashboard
- [ ] Export `tokens.json` en `assets/colors/`

**Entregable:** Design System listo para implementación frontend.

---

## Sprint 2 — Login y Dashboard

**Objetivo:** Acceso seguro al sistema y vista general del estado operativo.

- Login (email/contraseña o método definido)
- Gestión de usuarios
- Roles y permisos básicos
- Dashboard — Centro de Control (según Design System)

**Pregunta que responde:** ¿Quién entra y qué está pasando hoy?

---

## Sprint 3 — Recursos

**Objetivo:** Catálogo maestro de todo lo que existe en la operación.

- Crear y editar recursos
- Categorías de recursos
- Unidades de medida
- Proveedores
- Valores y costos de referencia
- Tipos específicos:
  - Equipamiento
  - Insumos
  - Botánicos
  - Envases
  - Herramientas

**Pregunta que responde:** ¿Qué existe y cómo se describe?

---

## Sprint 4 — Inventario

**Objetivo:** Control de stock y movimientos.

- Entradas de inventario
- Salidas de inventario
- Ajustes (mermas, correcciones)
- Alertas de stock mínimo
- Cálculo de costo promedio ponderado

**Pregunta que responde:** ¿Cuánto tenemos y a qué costo?

---

## Sprint 5 — Recetario

**Objetivo:** Formulaciones versionadas y reproducibles.

- Crear y editar recetas
- Versionado de recetas
- Ingredientes vinculados a recursos existentes
- Rendimiento esperado
- Costos estimados por versión

**Pregunta que responde:** ¿Cómo se elabora y cuánto debería costar?

---

## Sprint 6 — Producción

**Objetivo:** Ejecución de lotes en el mundo real.

- Crear lotes de producción
- Etapas del proceso
- Consumo automático de inventario según receta
- Registro manual de proceso (temperaturas, tiempos, observaciones)

**Pregunta que responde:** ¿Qué estamos haciendo ahora?

---

## Sprint 7 — Trazabilidad

**Objetivo:** Historial completo e inmutable por lote.

- Historial completo por lote
- Recursos utilizados (con lote de insumo si aplica)
- Costos reales vs estimados
- Fotos del proceso
- Notas y observaciones
- Documentos adjuntos

**Pregunta que responde:** ¿Qué ocurrió exactamente?

---

## Sprint 8 — Jardín Botánico

**Objetivo:** Gestión del cultivo y su vínculo con la producción.

- Catálogo de especies botánicas
- Ubicaciones en el terreno/jardín
- Registro de plantaciones
- Cosechas
- Fotografías por planta o zona
- Relación cosecha → lote de producción

**Pregunta que responde:** ¿Qué cultivamos y de dónde salió este botánico?

---

## Sprint 9 — Knowledge Base

**Objetivo:** Repositorio de conocimiento del proyecto.

- Biblioteca de documentos
- Manuales de equipamiento y procesos
- BrandBook
- Master Plan (referencia al documento vivo)
- Procedimientos operativos
- Normativas aplicables
- Bitácora del proyecto (journal)

**Pregunta que responde:** ¿Qué hemos aprendido y cómo lo hacemos?

---

## Sprint 10 — BrewNode / ESP32

**Objetivo:** Integración con hardware de sensores.

- Firmware para ESP32
- Sensores de temperatura
- Sensores de peso
- Comunicación con API BrewCore
- Pantalla local para visualización

**Prerrequisito:** Módulos base (Sprints 2–7) estables y API documentada.

**Pregunta que responde:** ¿Qué dicen los sensores en tiempo real?

---

## Criterios generales entre sprints

- Cada sprint incluye pruebas manuales en dispositivos reales (móvil, tablet, PC)
- Documentación de API actualizada al cerrar cada sprint
- No se implementan sensores antes de tener módulos base operativos
- Responsive obligatorio en cada entrega
