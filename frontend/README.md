# Frontend — BrewOS

Aplicación web de BrewOS: **Next.js**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Lucide Icons**.

## Estado

**UI Foundation (Sprint 1)** — Pantallas visuales sin backend, autenticación ni datos reales.

## Inicio rápido

```bash
cd frontend
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

| Ruta | Pantalla |
|------|----------|
| `/login` | Login |
| `/dashboard` | Centro de Control (módulos) |
| `/dashboard/[module]` | Placeholder por módulo |
| `/design-system` | Showcase de componentes |

## Estructura

```
src/
├── app/
│   ├── login/              # Pantalla de acceso (solo UI)
│   ├── (shell)/            # Layout con sidebar
│   │   ├── dashboard/      # Centro de Control
│   │   └── design-system/  # Componentes base
│   ├── layout.tsx          # Fuentes, tema, providers
│   └── globals.css         # Tokens BrewOS
├── components/
│   ├── brand/              # Logo
│   ├── dashboard/          # ModuleCard
│   ├── design-system/      # EmptyState, LoadingState
│   ├── layout/             # Sidebar, Header
│   ├── theme/              # Dark/light
│   └── ui/                 # shadcn/ui
└── lib/
    └── modules.ts          # Definición de módulos
```

## Decisiones de diseño

- **Modo oscuro por defecto** — operación tipo panel de control (Grafana, Home Assistant)
- **Sidebar shadcn** — colapsable en desktop, drawer en móvil
- **Sin datos mock** — placeholders y empty states únicamente
- **Tokens en CSS** — colores del [Design System](../docs/09-design-system.md) en `globals.css`
- **Route group `(shell)`** — layout compartido sin afectar `/login`

## Referencias

- [09 — Design System](../docs/09-design-system.md)
- [assets/colors/tokens.json](../assets/colors/tokens.json)
