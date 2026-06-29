# Assets

Recursos visuales y de marca para BrewOS e Insular Origins.

## Propósito

Esta carpeta almacena archivos estáticos de identidad y diseño:

- Logos (principal Insular Origins, monograma IO)
- Paleta de colores exportada (CSS, JSON, Figma)
- Iconografía del sistema
- Imágenes de referencia para UI
- Fuentes con licencia adecuada (si se incluyen en repo)

## Estado actual

**Vacía.** La dirección de marca está documentada; los archivos gráficos se añadirán en Sprint 0–1.

## Estructura prevista

```
assets/
├── brand/            # Logos, monograma, guía rápida
├── icons/            # Iconos de la aplicación
├── images/           # Imágenes de referencia
└── fonts/            # Tipografías (si aplica)
```

## Uso

- El frontend importará assets desde aquí o desde `frontend/public/` según convención de Next.js
- No duplicar logos en múltiples carpetas sin versión canónica en `assets/brand/`

## Referencias

- [06 — Dirección de marca](../docs/06-brand-direction.md)
