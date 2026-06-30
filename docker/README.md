# Docker — BrewOS

Configuración de contenedores para despliegue en Coolify.

## Frontend (Next.js)

El Dockerfile vive en `frontend/Dockerfile` y usa `output: "standalone"` de Next.js.

### Build local

```bash
cd frontend
docker build -t brewos-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_URL=http://localhost:3000 brewos-frontend
```

Abrir [http://localhost:3000](http://localhost:3000)

## Coolify — Frontend

### 1. Crear recurso

1. En Coolify → **New Resource** → **Application**
2. Conectar repositorio `brewos`
3. **Build Pack:** Dockerfile
4. **Dockerfile location:** `frontend/Dockerfile`
5. **Base directory / Root:** `frontend` (si Coolify lo pide como subcarpeta)

### 2. Variables de entorno

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://tv.quillotana.cl` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

### 3. Dominio

- Asignar dominio: `tv.quillotana.cl`
- Activar HTTPS (Let's Encrypt)

### 4. Puerto

- Puerto interno del contenedor: **3000**
- Coolify proxy → contenedor:3000

### 5. Deploy

- Push a la rama configurada → Coolify build + deploy automático
- Primer deploy: verificar logs de build (`npm run build` dentro del Dockerfile)

### 6. Health check (opcional)

- Path: `/login`
- Puerto: 3000

## Notas

- Sin backend en esta etapa: solo frontend estático/SSR de páginas placeholder
- El login no autentica; redirige visualmente al Centro de Control
- Futuro dominio: `brewos.quillotana.cl` — actualizar `NEXT_PUBLIC_APP_URL`

## Referencias

- [frontend/README.md](../frontend/README.md)
- [02 — Arquitectura](../docs/02-architecture.md)
