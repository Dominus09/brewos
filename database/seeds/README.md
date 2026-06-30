# Seeds — BrewOS

Scripts de datos iniciales para PostgreSQL. **No se ejecutan automáticamente** al iniciar FastAPI.

## Cuándo ejecutar

1. Base de datos vacía creada y accesible.
2. Migraciones aplicadas: `alembic upgrade head` desde `backend/`.
3. Ejecutar el seed manualmente (una vez por entorno nuevo).

## Archivos

| Archivo | Contenido |
|---------|-----------|
| `001_base_seed.sql` | Líneas Destilería/Cervecería, tipos de recurso base, unidades (unidad, g, kg, ml, L) |

## Ejecución

### Con psql

```bash
psql "$DATABASE_URL" -f database/seeds/001_base_seed.sql
```

### Desde Windows (PowerShell)

```powershell
$env:DATABASE_URL = "postgresql://user:pass@localhost:5432/brewos"
psql $env:DATABASE_URL -f database/seeds/001_base_seed.sql
```

## Idempotencia

El script usa `ON CONFLICT` sobre códigos únicos. Puede re-ejecutarse sin duplicar filas base.

## Reglas

- No incluir datos mock de demostración.
- No incluir usuarios ni credenciales (auth pendiente).
- Cambios al seed deben documentarse en el PR y alinearse con `docs/05-data-model.md`.
