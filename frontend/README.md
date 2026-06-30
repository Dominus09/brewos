# Frontend — BrewOS

Aplicación web de BrewOS. Sprint de despliegue: UI completa sin backend.

## Requisitos

- Node.js 20+
- npm 10+

## Ejecutar en local

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) → redirige a **Login**.

El botón «Iniciar sesión» redirige al **Centro de Control** (sin autenticación real).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor producción (tras build) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run docker:build` | Imagen Docker local |
| `npm run docker:run` | Contenedor en puerto 3000 |

## Build de producción

```bash
npm run build
npm run start
```

O con Docker:

```bash
npm run docker:build
npm run docker:run
```

## Despliegue en Coolify

Ver guía completa: [docker/README.md](../docker/README.md)

Resumen:

1. Recurso **Application** en Coolify
2. Dockerfile: `frontend/Dockerfile`
3. Base directory: `frontend`
4. Variables: `NEXT_PUBLIC_APP_URL=https://tv.quillotana.cl`
5. Puerto: **3000**
6. Dominio: `tv.quillotana.cl` + HTTPS

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- next-themes (oscuro por defecto)
- React Hook Form + Zod (instalados, sin uso aún)

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/` | → `/login` |
| `/login` | Login visual |
| `/control-center` | Centro de Control |
| `/resources` … `/settings` | Módulos placeholder |

## Estructura

```
src/
├── app/              # App Router
├── components/       # UI compartida + shadcn
├── config/           # site, navigation
├── features/         # Por dominio
├── hooks/
├── layouts/          # AppShell
├── lib/
├── providers/
├── services/
├── styles/
└── types/
```

## Producción

URL objetivo: [https://tv.quillotana.cl](https://tv.quillotana.cl)

Sin backend en esta etapa — solo frontend visual.
