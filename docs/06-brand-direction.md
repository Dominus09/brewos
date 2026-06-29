# 06 — Dirección de marca

Guía de identidad visual para BrewOS e Insular Origins. Define el tono, la paleta y los principios que evitan una estética genérica de cervecería.

---

## Inspiración: Insular Origins

Insular Origins nace en Chiloé: isla, bosque, mar, artesanía y territorio. La identidad visual debe transmitir:

- **Raíz** — conexión con el origen, lo local, lo cultivado
- **Premium sobrio** — calidad sin ostentación
- **Natural** — materiales, texturas y colores del entorno chilote
- **Artesanal con intención** — oficio cuidado, no rusticidad decorativa

BrewOS es la interfaz digital de esa filosofía. Debe sentirse como extensión de la marca, no como un panel genérico de software.

---

## Paleta de color

| Nombre | Uso | Referencia |
|--------|-----|------------|
| **Verde bosque** | Color primario, navegación, acentos principales | Profundidad, naturaleza, estabilidad |
| **Verde oliva** | Secundario, fondos suaves, estados inactivos | Cultivo, madurez |
| **Nogal** | Textos secundarios, bordes, superficies cálidas | Madera, barricas, calidez |
| **Marfil** | Fondos principales, tarjetas | Limpieza, legibilidad |
| **Dorado envejecido** | Acentos premium, detalles, iconografía especial | Artesanía, valor, tiempo |
| **Gris piedra** | Textos, divisores, UI neutra | Solidez, sobriedad |

### Valores orientativos (a definir en diseño)

```
Verde bosque:      #2D4A3E  (aprox.)
Verde oliva:       #6B7B5C  (aprox.)
Nogal:             #5C4A3A  (aprox.)
Marfil:            #F5F0E8  (aprox.)
Dorado envejecido: #B8956B  (aprox.)
Gris piedra:       #6E6E6A  (aprox.)
```

*Los valores hex finales se fijarán en el sistema de diseño del Sprint 0–1.*

---

## Lo que evitamos

| Evitar | Por qué |
|--------|---------|
| Paleta ámbar genérica de cervecería | Asocia a apps de homebrew sin identidad |
| Tipografía display excesiva | Compite con el contenido operativo |
| Iconografía de barril/cerveza en exceso | Reduce BrewOS a “app de cerveza” |
| Gradientes saturados | Rompe la sobriedad premium |
| UI tipo dashboard SaaS genérico | Pierde conexión con Insular Origins |

---

## Logotipos

### Logo principal — Insular Origins

- Sobrio, legible en pequeño y grande
- Funciona en positivo (sobre marfil) y negativo (sobre verde bosque)
- Sin elementos decorativos innecesarios

### Monograma IO — Logo secundario

- Iniciales **I** y **O** entrelazadas o apiladas
- Uso: favicon, app móvil, espacios reducidos, watermark
- Misma paleta que el logo principal

BrewOS puede usar el monograma IO en la barra de navegación y el logo completo en login y documentos.

---

## Tipografía (dirección)

| Uso | Dirección |
|-----|-----------|
| Títulos | Serif con carácter o sans serif con personalidad — elegante, no industrial |
| Cuerpo | Sans serif legible en móvil (14–16px base) |
| Datos / tablas | Monoespaciada o sans neutra para números y códigos |

*Fuentes concretas se definirán en `assets/` y el sistema de diseño.*

---

## Packaging y materiales físicos

- **Premium limpio** — poco texto, mucho espacio, materiales nobles
- Papel texturizado, sellos en dorado envejecido, verde bosque como color de marca
- Etiquetas con trazabilidad (lote, origen botánico) como parte del diseño, no como sticker aparte

---

## Experiencia turística vs operativa

BrewOS tiene dos registros visuales complementarios:

| Contexto | Tono |
|----------|------|
| **Operativo** (inventario, producción, costos) | Sobrio, eficiente, datos claros, poca decoración |
| **Turístico / storytelling** (knowledge base, presentación de lotes) | Más cálido, fotográfico, narrativo, artesanal |

La misma paleta y tipografía unifican ambos registros; cambia la densidad de contenido y el uso de imagen.

---

## Aplicación en BrewOS

- Fondo general: marfil
- Barra lateral / header: verde bosque con texto marfil
- Botones primarios: verde bosque; secundarios: borde nogal
- Alertas: dorado envejecido (advertencia), tonos apagados (error — no rojo chillón)
- Tarjetas: marfil con sombra suave y borde gris piedra muy sutil
- Iconos: línea fina, estilo consistente, sin rellenos saturados

---

## Referencias en el repositorio

Assets de marca (logos, paleta exportada, ejemplos) vivirán en `assets/`. El BrandBook completo se documentará en la Knowledge Base (Sprint 8).
