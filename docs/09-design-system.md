# 09 — Design System BrewOS

**Sprint 1 — Identidad visual y sistema de diseño oficial**

Documento de referencia para diseño e implementación del frontend. BrewOS es software profesional para Insular Origins. No es una marca de cerveza ni una destilería: es una plataforma de gestión operativa con estética tecnológica premium.

**Referencias de tono:** Home Assistant · Grafana · Synology DSM · Ubiquiti UniFi · Tesla Energy

**Documento relacionado:** [06 — Dirección de marca](06-brand-direction.md) (contexto Insular Origins; este documento define la identidad visual de BrewOS como producto software)

---

## Filosofía visual

BrewOS debe sentirse como un **centro de control moderno**: preciso, silencioso, confiable. La interfaz no compite con los datos; los presenta.

### Principios

| Principio | Aplicación |
|-----------|------------|
| **Minimalismo** | Cada elemento en pantalla debe justificar su presencia |
| **Espacio** | Márgenes generosos, densidad controlada, jerarquía por aire — no por ornamentos |
| **Limpieza** | Superficies planas, bordes sutiles, sin texturas ni decoración |
| **Responsive** | Misma calidad de experiencia en PC, tablet y celular |
| **Calma** | Colores apagados, animaciones discretas, sin alertas visuales innecesarias |

### Lo que debe transmitir

- **Tecnología** — Software actual, no herramienta artesanal decorativa
- **Precisión** — Datos claros, números legibles, estados inequívocos
- **Calma** — Operación de largo plazo sin fatiga visual
- **Orden** — Estructura predecible, navegación consistente
- **Laboratorio** — Entorno de medición, registro y control
- **Innovación** — Preparado para sensores, nodos y automatización futura

### Lo que evitamos

- Estética industrial pesada (metal, remaches, paneles tipo fábrica)
- Estética gamer (neón, ángulos agresivos, gradientes RGB)
- Estética artesanal o rústica (madera, papel kraft, tipografía display)
- Iconografía de cerveza, barriles, lúpulo o destilería
- Skeuomorphism, gradientes exagerados, sombras fuertes

---

## Paleta de colores

Paleta diseñada para **modo claro y modo oscuro**. Los tonos verde-pizarra y gris mineral toman inspiración leve de Insular Origins (bosque, piedra, calma del territorio) reinterpretados como interfaz tecnológica — sin copiar la marca ni usar su paleta comercial directamente.

### Colores base

| Token | HEX (claro) | HEX (oscuro) | Uso |
|-------|-------------|--------------|-----|
| **Primario** | `#0A8F7A` | `#12B89E` | Acciones principales, enlaces activos, indicadores de sistema activo |
| **Primario hover** | `#087566` | `#0E9A84` | Estados hover del primario |
| **Primario muted** | `#E6F5F2` | `#0A2E28` | Fondos de acento suave, badges activos |
| **Secundario** | `#5C6B66` | `#8A9893` | Acciones secundarias, iconos inactivos en sidebar |
| **Background** | `#F5F7F6` | `#0B0E0D` | Fondo general de la aplicación |
| **Background elevated** | `#FFFFFF` | `#111514` | Área de contenido principal |
| **Cards** | `#FFFFFF` | `#161B19` | Tarjetas, paneles, módulos del dashboard |
| **Sidebar** | `#FFFFFF` | `#0E1211` | Navegación lateral |
| **Sidebar hover** | `#EEF2F0` | `#1A211F` | Ítem de menú en hover |
| **Sidebar active** | `#E6F5F2` | `#0F2A25` | Ítem de menú activo |
| **Texto principal** | `#0F1614` | `#E8EDEB` | Títulos, cuerpo, datos prioritarios |
| **Texto secundario** | `#5C6863` | `#8A9691` | Descripciones, metadatos, placeholders |
| **Texto disabled** | `#9CA8A3` | `#4A5551` | Elementos deshabilitados |
| **Bordes** | `#DDE4E1` | `#1F2A27` | Divisores, contornos de inputs y cards |
| **Bordes subtle** | `#E8EDEB` | `#17201D` | Separadores internos de baja jerarquía |

### Estados semánticos

| Estado | HEX | Uso |
|--------|-----|-----|
| **Success** | `#16A34A` | Operación exitosa, stock OK, lote completado |
| **Success muted** | `#DCFCE7` / `#0A2318` | Fondo de badge o alerta success |
| **Warning** | `#CA8A04` | Stock bajo, acción pendiente, atención requerida |
| **Warning muted** | `#FEF9C3` / `#2A2208` | Fondo de badge o alerta warning |
| **Danger** | `#DC2626` | Error, eliminación, stock crítico |
| **Danger muted** | `#FEE2E2` / `#2A0F0F` | Fondo de badge o alerta danger |
| **Info** | `#0284C7` | Información neutral, tips, estados informativos |
| **Info muted** | `#E0F2FE` / `#0A1E2A` | Fondo de badge o alerta info |

### Reglas de uso del color

1. El **primario** se reserva para acciones y estados activos — no cubrir grandes superficies con él
2. En modo oscuro, el primario se aclara ligeramente para mantener contraste WCAG AA
3. Los estados semánticos nunca son el color dominante de una pantalla
4. Máximo un color de acento por vista; el resto es escala de grises verdosos
5. Exportar tokens en `assets/colors/` cuando se generen archivos (JSON, CSS variables)

### Inspiración Insular Origins (sin copiar)

| Origen natural | Traducción en BrewOS |
|----------------|----------------------|
| Verde bosque profundo | Primario teal-verde `#0A8F7A` |
| Gris piedra chilota | Textos secundarios y bordes |
| Calma del mar y la niebla | Fondos neutros fríos, baja saturación |
| Precisión del laboratorio | Estados semánticos contenidos, sin saturación extrema |

---

## Tipografía

Todas las fuentes provienen de **Google Fonts**, libres y optimizadas para web.

### Familias

| Rol | Fuente | Pesos | Uso |
|-----|--------|-------|-----|
| **Título** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | 600, 700 | H1, H2, nombre de módulos, títulos de cards |
| **Subtítulos** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | 500 | H3, H4, labels de sección, encabezados de tabla |
| **Texto** | [Inter](https://fonts.google.com/specimen/Inter) | 400, 500 | Cuerpo, descripciones, botones, inputs |
| **Monoespaciada** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500 | IDs de lote, códigos, valores numéricos tabulares, timestamps |

### Escala tipográfica

| Token | Tamaño | Line height | Fuente |
|-------|--------|-------------|--------|
| `display` | 28px | 36px | Plus Jakarta Sans 700 |
| `h1` | 24px | 32px | Plus Jakarta Sans 600 |
| `h2` | 20px | 28px | Plus Jakarta Sans 600 |
| `h3` | 16px | 24px | Plus Jakarta Sans 500 |
| `body` | 14px | 20px | Inter 400 |
| `body-sm` | 13px | 18px | Inter 400 |
| `caption` | 12px | 16px | Inter 400 |
| `mono` | 13px | 20px | JetBrains Mono 400 |
| `mono-sm` | 12px | 16px | JetBrains Mono 400 |

### Por qué estas fuentes

**Plus Jakarta Sans** — Geométrica y contemporánea sin ser fría. Usada en productos SaaS premium; transmite modernidad y orden sin parecer plantilla genérica. Diferencia visual clara respecto a Inter solo.

**Inter** — Estándar de facto en dashboards y aplicaciones de datos. Excelente legibilidad en 14px, amplio soporte de pesos, rendering consistente en todos los dispositivos.

**JetBrains Mono** — Diseñada para interfaces de desarrollo y datos técnicos. Distingue claramente `0`/`O` y `1`/`l`; ideal para lotes, SKUs y lecturas de sensores futuras.

### Reglas tipográficas

- Máximo dos familias visibles por pantalla (Jakarta + Inter; mono solo en datos)
- No usar más de tres pesos por vista
- Títulos en sentence case o title case — nunca todo mayúsculas
- Números en tablas y métricas siempre en JetBrains Mono

---

## Iconografía

### Estilo

| Atributo | Valor |
|----------|-------|
| Tipo | Outline (contorno) |
| Grosor de trazo | 1.5px (escala 24px) |
| Esquinas | Redondeadas (stroke-linecap: round, linejoin: round) |
| Tamaños | 16px (inline), 20px (navegación), 24px (módulos) |
| Color | Hereda del texto (`currentColor`) |
| Relleno | Ninguno — solo trazo |

### Referencia de librería

Usar **Lucide Icons** (o equivalente compatible) como base. Mantiene consistencia con el ecosistema React/Next.js y cumple el estilo outline minimal.

### Iconos por módulo (referencia)

| Módulo | Icono sugerido | Concepto |
|--------|----------------|----------|
| Inicio | `layout-dashboard` | Centro de control |
| Recursos | `package` | Catálogo |
| Inventario | `warehouse` | Stock |
| Recetas | `flask-conical` | Formulación / laboratorio |
| Producción | `play-circle` | Lote en curso |
| Trazabilidad | `git-branch` | Historial ramificado |
| Jardín Botánico | `sprout` | Cultivo (uso sobrio, sin decoración) |
| Knowledge Base | `book-open` | Documentación |
| Reportes | `bar-chart-2` | Datos |
| Configuración | `settings` | Sistema |

### Reglas

- Un icono por acción o módulo — no apilar iconos decorativos
- Icono + label en sidebar; solo icono en bottom nav móvil con tooltip
- Estados activos: color primario en el icono, no cambio de estilo a filled
- No mezclar librerías de iconos

---

## Componentes

Especificación conceptual para implementación futura. Sin código en este documento.

### Botones

| Variante | Apariencia | Uso |
|----------|------------|-----|
| **Primary** | Fondo primario, texto blanco, sin borde | Acción principal (Guardar, Crear, Confirmar) |
| **Secondary** | Fondo transparente, borde 1px, texto principal | Cancelar, acciones alternativas |
| **Ghost** | Sin borde ni fondo, texto primario en hover | Acciones terciarias, toolbar |
| **Danger** | Fondo danger muted, texto danger | Eliminar, acciones destructivas |

**Tamaños:** `sm` (32px), `md` (40px), `lg` (44px) de altura.  
**Radio:** 8px.  
**Estados:** hover (opacidad o fondo ±10%), disabled (opacity 0.5), loading (spinner inline, texto oculto o "Procesando…").

### Inputs

- Altura 40px, radio 8px, borde 1px `bordes`
- Padding horizontal 12px
- Label arriba, 13px, peso 500
- Placeholder en texto secundario
- Focus: borde primario 1px, sin glow exagerado (ring sutil 2px primario muted)
- Error: borde danger + mensaje caption debajo en danger
- Tipos: text, number, password, date, textarea (min-height 96px)

### Select

- Misma altura y estilo que input
- Chevron discreto a la derecha
- Dropdown: card con sombra suave (blur sutil), max-height con scroll
- Opción hover: sidebar-hover background
- Opción seleccionada: check icon + texto principal

### Tablas

- Header: fondo `background`, texto secundario 12px uppercase tracking sutil (opcional) o 13px medium
- Filas: altura 48px, borde inferior subtle
- Hover fila: fondo sidebar-hover
- Datos numéricos y códigos: JetBrains Mono
- Acciones al final de fila: iconos ghost
- Paginación debajo, alineada a la derecha
- En móvil: tabla colapsa a cards por fila (responsive pattern)

### Cards

- Fondo `cards`, borde 1px `bordes`, radio 12px
- Sin sombra en reposo; sombra mínima solo en hover si es clickeable (`0 1px 3px rgba(0,0,0,0.06)`)
- Padding interno 20px (desktop), 16px (móvil)
- Header opcional: título h3 + acción ghost a la derecha
- Divider interno: 1px `bordes subtle`

### Sidebar

- Ancho fijo: 240px (desktop), colapsable a 64px (solo iconos)
- Fondo `sidebar`, borde derecho 1px `bordes`
- Logo BrewOS arriba (32px altura)
- Secciones de navegación con label caption opcional
- Ítem: 40px altura, radio 8px, padding 12px, icono 20px + label
- Estado activo: fondo sidebar-active + borde izquierdo 3px primario (o icono primario)
- Footer: avatar usuario + nombre + toggle tema

### Navbar (móvil / superior)

- Altura 56px, fondo `background elevated`, borde inferior subtle
- Móvil: hamburger + título de página + acción contextual
- Tablet: puede fusionarse con sidebar o mostrar breadcrumb
- Sin navbar pesada en desktop si hay sidebar completa

### Badges

- Altura 22px, padding 6px 10px, radio 6px
- Variantes: default (gris), primary, success, warning, danger, info
- Texto 12px medium
- Uso: estados de lote, stock, roles — no como decoración

### Estados

| Estado | Tratamiento visual |
|--------|-------------------|
| Hover | Cambio de fondo sutil, sin escala |
| Focus | Ring 2px primario muted, accesible por teclado |
| Active/pressed | Fondo ligeramente más oscuro |
| Disabled | Opacity 0.5, cursor not-allowed |
| Selected | Fondo primario muted + texto/borde primario |

### Loading

- **Spinner:** círculo 20px, trazo 2px, primario, animación 0.8s linear
- **Skeleton:** rectángulos con fondo `bordes subtle`, animación pulse suave
- **Página completa:** spinner centrado + texto "Cargando…" en secundario
- Nunca bloquear toda la UI sin indicador

### Empty States

- Ilustración: no usar — solo icono outline 48px en texto secundario
- Título h3: "No hay recursos aún"
- Descripción body-sm en secundario
- CTA primary debajo
- Centrado vertical en el área de contenido

---

## Logo BrewOS

**No hay logo final en este sprint.** Solo conceptos para evaluación.

### Concepto A — Solo tipografía

**Qué representa:** Confianza en el nombre. BrewOS como marca de software puro, sin símbolo que compita con la legibilidad. La palabra "Brew" alude al ecosistema (BrewCore, BrewNode) sin iconografía literal.

**Dónde funcionaría:** Header de sidebar, pantalla de login, documentación técnica, favicon tipográfico (letra B estilizada).

**Tipografía propuesta:** Plus Jakarta Sans 700, tracking -0.02em. "Brew" en peso 700, "OS" en peso 500 con color primario o secundario para diferenciar el sufijo sistema.

| Ventajas | Desventajas |
|----------|-------------|
| Máxima claridad y escalabilidad | Menos memorable visualmente |
| Fácil de implementar en cualquier tamaño | Sin icono para favicon/app icon distintivo |
| Estética alineada con Grafana, UniFi | Puede parecer genérico sin tratamiento cuidado |

---

### Concepto B — Tipografía + isotipo pequeño

**Qué representa:** El isotipo es un **nodo conectado** — círculo central con tres líneas finas saliendo a puntos secundarios (red, sensor, sistema). Evoca BrewNode y trazabilidad sin referencias a producción alcohólica.

**Dónde funcionaría:** Sidebar expandida, login, materiales de presentación, app icon simplificado.

**Composición:** Isotipo 24×24px a la izquierda + wordmark. Isotipo puede usarse solo en sidebar colapsada y favicon.

| Ventajas | Desventajas |
|----------|-------------|
| Identidad reconocible en icono y texto | Requiere diseño y prueba en tamaños pequeños |
| Comunica "sistema conectado" | Riesgo de parecer logo de red WiFi si no se ejecuta bien |
| Balance entre minimalismo y marca | Más archivos y variantes que mantener |

---

### Concepto C — Monograma

**Qué representa:** Las letras **B** y **O** (BrewOS) o **B** estilizada como **nodo-circuito** — líneas rectas, ángulos de 90°, estética de PCB o diagrama de sistema.

**Dónde funcionaría:** Favicon, sidebar colapsada, splash móvil, watermark en reportes, futura pantalla ESP32 BrewNode.

**Composición:** Monograma cuadrado o circular, trazo uniforme 2px, sin rellenos.

| Ventajas | Desventajas |
|----------|-------------|
| Muy compacto — ideal para 16×16px | Sin wordmark pierde significado para usuarios nuevos |
| Fuerte presencia tecnológica | Puede confundirse con otras marcas "B" si es muy abstracto |
| Coherente con estética UniFi / Tesla app icon | Requiere más iteración de diseño |

### Recomendación de dirección

**Concepto B** como identidad principal, con el monograma de **Concepto C** derivado del isotipo para favicon y espacios reducidos. El wordmark de **Concepto A** se usa en contextos editoriales y documentación.

Archivos finales vivirán en `assets/brand/logos/` cuando se diseñen.

---

## Monograma

Ideas de símbolo para BrewOS y BrewNode. Sin imágenes en este sprint — solo dirección conceptual.

### Idea 1 — Nodo central

Un punto o círculo pequeño conectado por líneas rectas a 3–4 nodos periféricos. Representa BrewCore como centro y BrewNode como extremos. Estética de diagrama de red limpio.

### Idea 2 — Circuito "B"

La letra B construida con segmentos de circuito impreso: líneas horizontales y verticales, esquinas a 90°, un punto de conexión en cada unión. Tecnológico y legible como monograma.

### Idea 3 — Anillo de datos

Un anillo incompleto (arco 270°) con un punto en cada extremo — sugiere flujo continuo de trazabilidad y lectura de sensores. Minimal, funciona en 16px.

### Idea 4 — Celda hexagonal

Hexágono outline con un punto central — referencia sutil a estructura molecular / laboratorio sin ser literal. Común en software científico moderno.

### Idea 5 — Pulse line

Una línea recta con un único pico tipo señal (como lectura de sensor). Comunica monitoreo y datos en tiempo real para la era BrewNode.

### Restricciones confirmadas

No usar: cerveza, lúpulo, alambique, barriles, montañas, árboles, gotas de líquido, llamas.

### Criterios de selección

1. Legible a 16×16px (favicon)
2. Funciona en positivo y negativo (claro y oscuro)
3. Un solo color por versión
4. Coherente con iconografía Lucide (mismo grosor de trazo)

---

## UI

Descripción de las pantallas y patrones de layout.

### Login

- Pantalla centrada, fondo `background`
- Card 400px max-width, padding 40px
- Logo BrewOS arriba (wordmark o isotipo + texto)
- Subtítulo: "Centro de control · Insular Origins" en texto secundario
- Campos email y contraseña
- Botón primary full-width "Iniciar sesión"
- Sin ilustraciones, sin fotos de fondo, sin gradientes
- En móvil: card ocupa ancho completo menos 24px margen

### Dashboard — Centro de Control

Ver sección dedicada más abajo.

### Sidebar

- Siempre visible en desktop (≥1024px)
- Colapsable manualmente
- En tablet (768–1023px): overlay al abrir, backdrop semitransparente
- En móvil (<768px): drawer desde la izquierda o bottom navigation simplificada (5 ítems principales + "Más")

### Cards en contenido

- Grid responsive: 1 col (móvil), 2 col (tablet), 3–4 col (desktop) según módulo
- Cards de módulo clickeables con hover sutil
- Sin gráficos en dashboard inicial — solo módulos y estado resumido

### Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| `< 768px` | Single column, bottom nav o hamburger, tablas → cards |
| `768–1023px` | Sidebar colapsada por defecto, grid 2 columnas |
| `≥ 1024px` | Sidebar expandida, grid 3–4 columnas, tablas completas |

### Modo claro

- Fondo general `#F5F7F6`, cards blancas
- Mayor contraste en bordes para definición
- Uso preferido en ambientes con mucha luz

### Modo oscuro

- Fondo general `#0B0E0D`, cards `#161B19`
- Primario ligeramente más claro (`#12B89E`) para contraste
- Sin negro puro (`#000`) — siempre tonos verde-gris profundos
- **Modo oscuro es el default** — alineado con Grafana, Home Assistant y operación en sala de control
- Toggle en sidebar footer; preferencia persistida

---

## Dashboard — Centro de Control

Primera pantalla después del login. **Sin gráficos.** Solo módulos y estado operativo resumido.

### Estructura

```
┌─────────────────────────────────────────────────────────┐
│  Centro de Control                          [Usuario ▾] │
├──────────┬──────────────────────────────────────────────┤
│          │  Bienvenido · Estado del sistema             │
│ Sidebar  │                                              │
│          │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│          │  │Recursos │ │Inventar.│ │ Recetas │        │
│          │  │  142    │ │ 3 alert │ │   28    │        │
│          │  └─────────┘ └─────────┘ └─────────┘        │
│          │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│          │  │Producc. │ │Trazabil.│ │ Jardín  │        │
│          │  │ 2 activ │ │         │ │   12    │        │
│          │  └─────────┘ └─────────┘ └─────────┘        │
│          │  ┌─────────┐ ┌─────────┐                    │
│          │  │Knowledge│ │Reportes │                    │
│          │  └─────────┘ └─────────┘                    │
│          │                                              │
│          │  Actividad reciente                          │
│          │  ┌──────────────────────────────────────┐  │
│          │  │ Entrada inventario · Malta Pilsen · 2h │  │
│          │  │ Lote #0042 iniciado · IPA Ver.3 · 5h   │  │
│          │  │ Stock bajo · Levadura Kveik · ayer     │  │
│          │  └──────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

### Elementos

1. **Saludo / contexto** — "Centro de Control" como H1; línea secundaria con fecha y estado general del sistema (ej. "Todos los sistemas operativos" con badge success)

2. **Grid de módulos** — Una card por módulo principal:
   - Icono outline 24px
   - Nombre del módulo (h3)
   - Métrica clave o estado (mono o body-sm)
   - Toda la card es clickeable → navega al módulo
   - Badge warning en esquina si hay alertas (ej. inventario)

3. **Actividad reciente** — Lista simple de últimos 5–10 eventos:
   - Timestamp en mono-sm secundario
   - Descripción en body
   - Sin gráficos, sin charts, sin widgets de terceros

4. **Sin widgets configurables** en v1 — layout fijo y predecible

### Métricas por módulo (dashboard v1)

| Módulo | Métrica en card |
|--------|-----------------|
| Recursos | Total de recursos activos |
| Inventario | Cantidad de alertas de stock bajo |
| Recetas | Recetas activas |
| Producción | Lotes en curso |
| Trazabilidad | Último evento registrado (texto) |
| Jardín Botánico | Especies o plantaciones activas |
| Knowledge Base | Documentos recientes (count) |
| Reportes | Acceso directo — "Ver reportes" sin métrica |

---

## Reglas

Reglas obligatorias del Design System. Toda implementación frontend debe cumplirlas.

1. **No skeuomorphism** — Sin texturas de madera, metal, papel o profundidad simulada
2. **No gradientes exagerados** — Máximo gradiente sutil en fondos hero si alguna vez se usa; por defecto colores planos
3. **No sombras fuertes** — Elevación máxima: `0 1px 3px rgba(0,0,0,0.08)`; preferir bordes sobre sombras
4. **No iconografía recargada** — Un icono por elemento; sin badges con iconos dentro de iconos
5. **Espaciado en escala 4px** — 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
6. **Border radius consistente** — 8px inputs/botones, 12px cards, 6px badges
7. **Transiciones cortas** — 150ms ease para hover/focus; nada mayor a 300ms
8. **Accesibilidad** — Contraste WCAG AA mínimo; focus visible siempre; labels en todos los inputs
9. **Datos primero** — La UI desaparece detrás de la información operativa
10. **Escalable** — Tokens de diseño centralizados; ningún valor mágico hardcodeado en componentes

---

## Estructura de assets

```
assets/
├── brand/
│   └── logos/          # Logos finales (pendiente diseño)
├── icons/              # Iconos custom si se crean
├── colors/             # tokens.json, paleta exportada
├── typography/         # Referencias de fuentes
├── ui/                 # Componentes de referencia (Figma exports)
└── mockups/            # Mockups de pantallas clave
```

---

## Propuesta de identidad visual — Resumen ejecutivo

BrewOS se posiciona como **software de control operativo premium** para Insular Origins: la estética de un panel de infraestructura moderna (Home Assistant, Grafana, UniFi), no la de una cervecería artesanal.

| Dimensión | Decisión |
|-----------|----------|
| **Personalidad** | Tecnológica, precisa, calmada, de laboratorio |
| **Color** | Teal-verde primario `#0A8F7A` sobre neutros pizarra; modo oscuro por defecto |
| **Tipografía** | Plus Jakarta Sans (títulos) + Inter (cuerpo) + JetBrains Mono (datos) |
| **Iconografía** | Lucide outline, 1.5px, sin rellenos |
| **Logo** | Dirección Concepto B (wordmark + isotipo nodo) con monograma derivado |
| **Layout** | Sidebar + contenido; dashboard modular sin gráficos |
| **Componentes** | Planos, bordes sutiles, radios 8–12px, sin skeuomorphism |

### Listo para frontend

Al iniciar el desarrollo (Sprint 1 técnico / Sprint 2), el equipo debe:

1. Instalar fuentes Google Fonts indicadas
2. Crear tokens de color en `assets/colors/tokens.json` a partir de esta tabla
3. Configurar tema claro/oscuro con los valores HEX definidos
4. Adoptar Lucide como librería de iconos
5. Implementar layout sidebar + dashboard según wireframe de este documento
6. Encargar diseño final de logo (Concepto B + monograma) en paralelo — usar wordmark temporal Plus Jakarta Sans hasta entonces

---

*Documento v1.0 — Sprint 1 Design System — BrewOS / Insular Origins*
