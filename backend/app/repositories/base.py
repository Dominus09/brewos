"""Shared repository helpers."""

from typing import TypeVar
from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


def active_only(stmt: Select[tuple[ModelT]], model: type[ModelT]) -> Select[tuple[ModelT]]:
    """Filter out soft-deleted rows."""
    return stmt.where(model.deleted_at.is_(None))  # type: ignore[attr-defined]


class ReadRepository:
    """Base read-only repository with soft-delete filtering."""

    def __init__(self, session: Session, model: type[ModelT]) -> None:
        self._session = session
        self._model = model

    def get_by_id(self, entity_id: UUID) -> ModelT | None:
        stmt = active_only(
            select(self._model).where(self._model.id == entity_id),  # type: ignore[attr-defined]
            self._model,
        )
        return self._session.scalars(stmt).first()
