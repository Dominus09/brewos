# Docker — BrewOS

Configuración de despliegue en Coolify.

## Opción recomendada: Nixpacks

Para esta etapa, el frontend **no usa** `output: "standalone"`. Nixpacks ejecuta `npm run build` + `npm run start` sin configuración especial.

### Coolify — Nixpacks

| Campo | Valor |
|-------|-------|
| **Build Pack** | Nixpacks |
| **Base Directory** | `frontend` |
| **Install Command** | *(vacío — usa `npm ci` de `nixpacks.toml`)* |
| **Build Command** | *(vacío — usa `npm run build` de `nixpacks.toml`)* |
| **Start Command** | *(vacío — usa `npm run start` de `nixpacks.toml`)* |
| **Publish Directory** | *(vacío — no es static export)* |
| **Puerto** | `3000` |

### Variables de entorno

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://tv.quillotana.cl` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `HOSTNAME` | `0.0.0.0` |

### Dominio

- Asignar: `tv.quillotana.cl`
- HTTPS en Coolify (Let's Encrypt)

### Health check (opcional)

- Path: `/login`
- Puerto: `3000`

---

## Opción alternativa: Dockerfile

Si prefieres Build Pack **Dockerfile**:

| Campo | Valor |
|-------|-------|
| **Build Pack** | Dockerfile |
| **Dockerfile location** | `frontend/Dockerfile` |
| **Base Directory** | `frontend` |

Build local:

```bash
cd frontend
docker build -t brewos-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -e PORT=3000 \
  brewos-frontend
```

---

## Error 526 (Cloudflare)

El **Error 526** no se corrige en el código del proyecto. Indica que Cloudflare (modo Full/Strict) no confía en el certificado SSL del servidor de origen (Coolify).

Verificar en infraestructura:

1. **Cloudflare SSL/TLS** → modo *Full* o *Full (strict)*
2. **Coolify** → certificado Let's Encrypt activo para `tv.quillotana.cl`
3. Si Cloudflare está en *Full (strict)*, el origen debe tener certificado válido (no autofirmado)
4. Alternativa temporal: modo *Full* (no strict) mientras se provisiona el cert en Coolify
5. Confirmar que el contenedor escucha en `0.0.0.0:3000` (ya configurado en `package.json`)

---

## Notas

- Sin backend en esta etapa — solo frontend Next.js
- Futuro dominio: `brewos.quillotana.cl` — actualizar `NEXT_PUBLIC_APP_URL`

## Referencias

- [frontend/README.md](../frontend/README.md)
- [02 — Arquitectura](../docs/02-architecture.md)
