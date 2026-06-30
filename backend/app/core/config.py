"""Application configuration from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    database_url: str
    app_env: str = "development"
    app_name: str = "BrewOS API"

    @property
    def database_schema(self) -> str:
        from app.core.database_schema import DATABASE_SCHEMA

        return DATABASE_SCHEMA


@lru_cache
def get_settings() -> Settings:
    return Settings()
