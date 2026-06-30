# Contribuir a BrewOS

Gracias por contribuir a BrewOS — la plataforma de gestión de producción artesanal de Insular Origins.

**Antes de tu primer PR**, lee:

1. [BREWOS_MANIFESTO.md](BREWOS_MANIFESTO.md) — filosofía del producto
2. [.foundation/development-manifesto.md](.foundation/development-manifesto.md) — cómo desarrollamos
3. [docs/11-product-principles.md](docs/11-product-principles.md) — principios obligatorios
4. [docs/decisions/](docs/decisions/) — ADRs aceptados

---

## Requisitos previos

| Herramienta | Versión |
|-------------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Python | 3.12+ (cuando backend esté activo) |
| PostgreSQL | 16+ (cuando database esté activo) |
| Git | 2.40+ |

---

## Configuración local

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000

### Backend (cuando exista)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
uvicorn app.main:app --reload
```

### Base de datos (cuando exista)

```bash
cd database
# Ver database/README.md
alembic upgrade head
```

---

## Cómo crear un módulo nuevo

### 1. Documentación primero

- Verificar que existe spec en `docs/` (UX, dominio, modelo)
- Si cambia arquitectura → ADR en `docs/decisions/`
- Actualizar `docs/10-navigation-map.md` si hay nueva ruta

### 2. Frontend

```
frontend/src/
├── app/(app)/<modulo>/page.tsx          # Ruta delgada
└── features/<modulo>/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── config/
```

Ver [.foundation/folder-structure.md](.foundation/folder-structure.md) y [.foundation/frontend-rules.md](.foundation/frontend-rules.md).

### 3. Backend

```
backend/app/
├── api/v1/routers/<modulo>.py
├── services/<modulo>_service.py
├── repositories/<modulo>_repository.py
├── schemas/<modulo>.py
└── models/<modulo>.py
```

Ver [.foundation/backend-rules.md](.foundation/backend-rules.md).

### 4. Base de datos

- Actualizar `docs/05-data-model.md`
- Crear migración Alembic
- Ver [.foundation/database-rules.md](.foundation/database-rules.md)

---

## Cómo hacer commits

Seguir [Conventional Commits](.foundation/git-workflow.md):

```bash
git checkout -b feat/resources-api
# ... cambios ...
git add .
git commit -m "feat(resources): add list and detail endpoints"
git push -u origin feat/resources-api
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`

---

## Cómo documentar

| Cambio | Dónde documentar |
|--------|------------------|
| Decisión arquitectónica | `docs/decisions/ADR-NNNN-*.md` |
| Modelo de datos | `docs/05-data-model.md` |
| UX de módulo | `docs/NN-modulo-ui-ux.md` |
| Regla de código nueva | `.foundation/*.md` |
| API | OpenAPI (auto) + comentarios en schemas |
| Changelog usuario | `CHANGELOG.md` |

---

## Cómo probar

Antes de abrir PR:

```bash
# Frontend
cd frontend
npm run lint
npm run typecheck
npm run build
npm run test          # cuando existan tests

# Backend (futuro)
cd backend
ruff check .
pytest tests/unit
```

Checklist completo: [.foundation/code-review-checklist.md](.foundation/code-review-checklist.md)

---

## Pull Requests

1. Crear rama desde `main`
2. Implementar cambios acotados
3. Completar checklist de code review
4. Abrir PR con título Conventional Commits
5. Esperar al menos 1 aprobación
6. Merge (squash preferido en features pequeñas)

---

## Qué no contribuir sin discusión previa

- Nuevas dependencias pesadas
- Cambios que contradigan ADRs
- Taxonomía o reglas de negocio en código
- Microservicios o arquitecturas alternativas
- Código de sensores/firmware antes de Sprint 9

---

## Contacto y dudas

Proyecto privado de **Insular Origins** / Quillotana.

Para dudas de arquitectura, consultar `.foundation/` y ADRs antes de abrir issue o PR.

---

*CONTRIBUTING.md — BrewOS v1.0*
