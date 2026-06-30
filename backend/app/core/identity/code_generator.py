"""Operational code formatting and generation."""

from __future__ import annotations

from datetime import date, datetime
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.core.identity.prefix_registry import get_by_entity_type, get_by_prefix
from app.core.identity.sequence_manager import allocate_next_value
from app.core.identity.exceptions import UnsupportedFormatError
from app.models.operational_code_prefix import OperationalCodePrefix

OPERATIONAL_TIMEZONE = ZoneInfo("America/Santiago")

FORMAT_MASTER = "master"
FORMAT_DAILY = "daily"

MASTER_SEQUENCE_WIDTH = 6
DAILY_SEQUENCE_WIDTH = 3


def operational_today(*, at: datetime | None = None) -> date:
    """Calendar date in the operational timezone (America/Santiago)."""
    moment = at or datetime.now(tz=OPERATIONAL_TIMEZONE)
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=OPERATIONAL_TIMEZONE)
    return moment.astimezone(OPERATIONAL_TIMEZONE).date()


def format_master_code(prefix_row: OperationalCodePrefix, sequence_value: int) -> str:
    return f"{prefix_row.prefix}-{sequence_value:0{MASTER_SEQUENCE_WIDTH}d}"


def format_daily_code(
    prefix_row: OperationalCodePrefix,
    sequence_value: int,
    sequence_date: date,
) -> str:
    date_part = sequence_date.strftime("%Y%m%d")
    return f"{prefix_row.prefix}-{date_part}-{sequence_value:0{DAILY_SEQUENCE_WIDTH}d}"


def generate_from_prefix_row(
    session: Session,
    prefix_row: OperationalCodePrefix,
    *,
    operation_date: date | None = None,
) -> str:
    """Generate the next operational code for a resolved prefix row."""
    if prefix_row.format_type == FORMAT_MASTER:
        value = allocate_next_value(session, prefix_row.id, None)
        return format_master_code(prefix_row, value)

    if prefix_row.format_type == FORMAT_DAILY:
        seq_date = operation_date or operational_today()
        value = allocate_next_value(session, prefix_row.id, seq_date)
        return format_daily_code(prefix_row, value, seq_date)

    raise UnsupportedFormatError(
        f"Unsupported format_type={prefix_row.format_type!r} for prefix={prefix_row.prefix!r}"
    )


def generate_master_code(session: Session, entity_type: str) -> str:
    """Generate a master entity code (e.g. BREW-RES-000001)."""
    prefix_row = get_by_entity_type(session, entity_type)
    if prefix_row.format_type != FORMAT_MASTER:
        raise UnsupportedFormatError(
            f"entity_type={entity_type!r} is not a master prefix (format_type={prefix_row.format_type!r})"
        )
    return generate_from_prefix_row(session, prefix_row)


def generate_operation_code(
    session: Session,
    *,
    entity_type: str | None = None,
    prefix: str | None = None,
    operation_date: date | None = None,
) -> str:
    """Generate a daily operation code (e.g. DIS-20260701-001)."""
    if entity_type is not None and prefix is not None:
        raise ValueError("Provide entity_type or prefix, not both")
    if entity_type is not None:
        prefix_row = get_by_entity_type(session, entity_type)
    elif prefix is not None:
        prefix_row = get_by_prefix(session, prefix)
    else:
        raise ValueError("entity_type or prefix is required")

    if prefix_row.format_type != FORMAT_DAILY:
        raise UnsupportedFormatError(
            f"Prefix {prefix_row.prefix!r} is not a daily operation prefix"
        )
    return generate_from_prefix_row(session, prefix_row, operation_date=operation_date)
