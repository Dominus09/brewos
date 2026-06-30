# Reglas de frontend — BrewOS

Reglas obligatorias para el frontend Next.js 15 + TypeScript + Tailwind + shadcn/ui.

**Referencias:** [09 — Design System](../docs/09-design-system.md) · [frontend-rules en architecture](architecture-rules.md) · [ADR-0001](../docs/decisions/ADR-0001-interface-language.md)

---

## Stack

| Tecnología | Uso |
|------------|-----|
| Next.js 15 | App Router, SSR/SSG según página |
| TypeScript | Modo estricto obligatorio |
| Tailwind CSS v4 | Estilos; tokens en `globals.css` |
| shadcn/ui | Componentes base en `components/ui/` |
| Lucide React | Iconografía |
| React Hook Form + Zod | Formularios (validación cliente) |

---

## Estructura por capas

```
src/
├── app/              # Rutas delgadas — SOLO composición
├── features/         # Lógica y UI por dominio
├── components/       # UI compartida (no de negocio)
├── config/           # site, navigation (fuente única sidebar)
├── layouts/          # AppShell, header, footer, sidebar
├── providers/        # Theme, contexto global
├── hooks/            # Hooks globales (use-mobile)
├── lib/              # Utilidades puras
├── services/         # Solo si es transversal; preferir features/*/services
├── styles/           # globals.css
└── types/            # Tipos globales (navigation)
```

---

## Reglas de componentes

### Tamaño máximo

**Nunca más de 300 líneas por archivo de componente.** Si se supera:

- Extraer subcomponentes en el mismo directorio
- Extraer lógica a custom hooks
- Dividir por responsabilidad (lista / filtros / tabla)

### Separación obligatoria

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **UI** | `components/`, `features/*/components/` | Render, eventos, composición |
| **Hooks** | `features/*/hooks/`, `hooks/` | Estado, efectos, orquestación |
| **Tipos** | `features/*/types/`, `types/` | Interfaces, enums técnicos |
| **Servicios** | `features/*/services/` | HTTP, mapeo API ↔ UI |
| **Config** | `config/`, `features/*/config/` | Constantes de UI, no reglas de negocio |

### Server vs Client

- `"use client"` solo cuando hay estado, efectos o eventos
- Preferir Server Components en `app/` para data fetching futuro
- Metadata y SEO en server `page.tsx` / `layout.tsx`

---

## Servicios — regla de oro

**Nunca usar `fetch` directamente en componentes.**

```text
Componente → hook (opcional) → service → API
```

### Service típico

- Funciones async tipadas: `getResources()`, `getResourceById(id)`
- Base URL desde `process.env.NEXT_PUBLIC_API_URL`
- Manejo de errores centralizado (futuro: `api-client.ts`)
- Mock local intercambiable por API real sin cambiar componentes

---

## TypeScript

- `"strict": true` en `tsconfig.json` — sin excepciones
- Prohibido `any`; usar `unknown` + type guards si es necesario
- Prohibido `@ts-ignore` sin comentario y issue asociado
- Props de componentes siempre tipadas con `type` o `interface`
- Exportar tipos de dominio desde `features/*/types/`

---

## Estilos y UI

- Seguir [09 — Design System](../docs/09-design-system.md)
- Modo oscuro por defecto
- Sin gradientes fuertes; paleta teal-verde Insular Origins
- Labels y mensajes en **español**; rutas y código en **inglés**
- Responsive obligatorio: móvil 375px+, tablet 768px+, desktop 1024px+
- Usar componentes shadcn existentes antes de crear nuevos

---

## Navegación

- Fuente única: `config/navigation.ts` para sidebar principal
- Subnavegación de módulo en `features/<módulo>/config/`
- Breadcrumbs en todas las vistas internas
- No duplicar rutas ni labels en múltiples archivos

---

## Formularios dinámicos (futuro — ADR-0006)

- Componente `DynamicForm` interpreta esquema de API
- No hardcodear campos por tipo de recurso en código
- Validación Zod generada o derivada del esquema publicado
- Preview de formulario en admin antes de publicar

---

## Estado y datos

- Estado local: `useState` para UI efímera
- Estado de servidor: React Query / SWR (cuando se adopte) o Server Components
- No duplicar datos maestros en contexto global innecesario
- Mock data solo en `features/*/data/` con interfaz de service intercambiable

---

## Prohibido

| Anti-patrón | Motivo |
|-------------|--------|
| `fetch` en componente | Acoplamiento, no testeable |
| Taxonomía de negocio en `const` | ADR-0006 |
| Componente > 300 líneas | Mantenibilidad |
| `any` | Seguridad de tipos |
| Lógica de negocio en UI | Debe vivir en service/backend |
| Estilos inline salvo casos dinámicos | Usar Tailwind |
| Copiar componentes shadcn sin `components/ui/` | Una sola fuente |

---

## Checklist frontend (PR)

- [ ] `app/` delgado
- [ ] Sin `fetch` en componentes
- [ ] Sin `any`
- [ ] Archivos < 300 líneas
- [ ] Tipos en `types/`
- [ ] Responsive verificado
- [ ] Textos en español en UI
- [ ] Sin reglas de negocio hardcodeadas

---

*Reglas de frontend BrewOS — v1.0*
