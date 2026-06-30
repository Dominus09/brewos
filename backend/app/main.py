"""BrewOS FastAPI application entry point."""

from fastapi import FastAPI

from app.core.config import get_settings
from app.routers import resources

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs" if settings.app_env == "development" else None,
    redoc_url="/redoc" if settings.app_env == "development" else None,
)

app.include_router(resources.router, prefix="/api/v1")


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Liveness probe — no business logic."""
    return {"status": "ok", "app": settings.app_name}
