"""Transactional sequence allocation for operational codes."""

from __future__ import annotations

from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.operational_sequence import OperationalSequence

_MAX_ALLOCATION_RETRIES = 5


def _sequence_filter(sequence_date: date | None):
    if sequence_date is not None:
        return OperationalSequence.sequence_date == sequence_date
    return OperationalSequence.sequence_date.is_(None)


def _lock_sequence_row(
    session: Session,
    prefix_id: UUID,
    sequence_date: date | None,
) -> OperationalSequence | None:
    stmt = (
        select(OperationalSequence)
        .where(
            OperationalSequence.prefix_id == prefix_id,
            _sequence_filter(sequence_date),
        )
        .with_for_update()
    )
    return session.scalar(stmt)


def allocate_next_value(
    session: Session,
    prefix_id: UUID,
    sequence_date: date | None = None,
) -> int:
    """Atomically increment and return the next sequence value for a prefix (+ optional date)."""
    for _ in range(_MAX_ALLOCATION_RETRIES):
        row = _lock_sequence_row(session, prefix_id, sequence_date)
        if row is not None:
            row.current_value += 1
            session.flush()
            return row.current_value

        try:
            with session.begin_nested():
                session.add(
                    OperationalSequence(
                        prefix_id=prefix_id,
                        sequence_date=sequence_date,
                        current_value=0,
                    )
                )
                session.flush()
        except IntegrityError:
            continue

        row = _lock_sequence_row(session, prefix_id, sequence_date)
        if row is not None:
            row.current_value += 1
            session.flush()
            return row.current_value

    raise RuntimeError("Failed to allocate operational sequence after retries")
