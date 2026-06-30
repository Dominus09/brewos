"""Database engine and session factory."""

from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.core.database_schema import DATABASE_SCHEMA

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)


@event.listens_for(engine, "connect")
def set_brewos_search_path(dbapi_connection, _connection_record) -> None:
    """Ensure ad-hoc SQL resolves brewos tables without schema prefix."""
    cursor = dbapi_connection.cursor()
    cursor.execute(f'SET search_path TO "{DATABASE_SCHEMA}", public')
    cursor.close()


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
