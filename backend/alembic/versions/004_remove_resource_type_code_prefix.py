"""Remove deprecated resource_types.code_prefix; nullable internal_code for drafts.

Revision ID: 004_remove_resource_type_code_prefix
Revises: 003_core_engine_identity_events
Create Date: 2026-06-30

Operational identity lives exclusively in operational_code_prefixes (Identity Engine).
Draft resources have internal_code = NULL until publish.

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

from app.core.database_schema import DATABASE_SCHEMA as SCHEMA

revision: str = "004_remove_resource_type_code_prefix"
down_revision: Union[str, None] = "003_core_engine_identity_events"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("resource_types", "code_prefix", schema=SCHEMA)

    op.alter_column(
        "resources",
        "internal_code",
        existing_type=sa.String(length=50),
        nullable=True,
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.alter_column(
        "resources",
        "internal_code",
        existing_type=sa.String(length=50),
        nullable=False,
        schema=SCHEMA,
    )

    op.add_column(
        "resource_types",
        sa.Column("code_prefix", sa.String(length=10), nullable=True),
        schema=SCHEMA,
    )
