"""Core Engine CE-1: identity, events, audit tables.

Revision ID: 003_core_engine_identity_events
Revises: 002_resource_satellite_tables
Create Date: 2026-06-30

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from app.core.database_schema import DATABASE_SCHEMA as SCHEMA

revision: str = "003_core_engine_identity_events"
down_revision: Union[str, None] = "002_resource_satellite_tables"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "operational_code_prefixes",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("entity_type", sa.String(length=50), nullable=False),
        sa.Column("prefix", sa.String(length=20), nullable=False),
        sa.Column("format_type", sa.String(length=20), nullable=False),
        sa.Column("reset_policy", sa.String(length=20), nullable=False),
        sa.Column("example", sa.String(length=50), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_operational_code_prefixes_entity_type",
        "operational_code_prefixes",
        ["entity_type"],
        schema=SCHEMA,
    )
    op.create_index(
        "uq_operational_code_prefixes_prefix_active",
        "operational_code_prefixes",
        ["prefix"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
        schema=SCHEMA,
    )
    op.create_index(
        "uq_operational_code_prefixes_entity_type_active",
        "operational_code_prefixes",
        ["entity_type"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
        schema=SCHEMA,
    )

    op.create_table(
        "operational_sequences",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("prefix_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sequence_date", sa.Date(), nullable=True),
        sa.Column(
            "current_value",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["prefix_id"],
            [f"{SCHEMA}.operational_code_prefixes.id"],
            name="fk_operational_sequences_prefix_id",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "uq_operational_sequences_prefix_master",
        "operational_sequences",
        ["prefix_id"],
        unique=True,
        postgresql_where=sa.text("sequence_date IS NULL"),
        schema=SCHEMA,
    )
    op.create_index(
        "uq_operational_sequences_prefix_daily",
        "operational_sequences",
        ["prefix_id", "sequence_date"],
        unique=True,
        postgresql_where=sa.text("sequence_date IS NOT NULL"),
        schema=SCHEMA,
    )

    op.create_table(
        "domain_events",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("event_type", sa.String(length=100), nullable=False),
        sa.Column("entity_type", sa.String(length=50), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("internal_code", sa.String(length=50), nullable=True),
        sa.Column(
            "payload",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_domain_events_event_type",
        "domain_events",
        ["event_type"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_domain_events_entity",
        "domain_events",
        ["entity_type", "entity_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_domain_events_occurred_at",
        "domain_events",
        ["occurred_at"],
        schema=SCHEMA,
    )

    op.create_table(
        "audit_log",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("event_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("entity_type", sa.String(length=50), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(length=50), nullable=False),
        sa.Column("before_data", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("after_data", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("actor_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["event_id"],
            [f"{SCHEMA}.domain_events.id"],
            name="fk_audit_log_event_id",
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_log_event_id",
        "audit_log",
        ["event_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_log_entity",
        "audit_log",
        ["entity_type", "entity_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_audit_log_created_at",
        "audit_log",
        ["created_at"],
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_index("ix_audit_log_created_at", table_name="audit_log", schema=SCHEMA)
    op.drop_index("ix_audit_log_entity", table_name="audit_log", schema=SCHEMA)
    op.drop_index("ix_audit_log_event_id", table_name="audit_log", schema=SCHEMA)
    op.drop_table("audit_log", schema=SCHEMA)

    op.drop_index("ix_domain_events_occurred_at", table_name="domain_events", schema=SCHEMA)
    op.drop_index("ix_domain_events_entity", table_name="domain_events", schema=SCHEMA)
    op.drop_index("ix_domain_events_event_type", table_name="domain_events", schema=SCHEMA)
    op.drop_table("domain_events", schema=SCHEMA)

    op.drop_index(
        "uq_operational_sequences_prefix_daily",
        table_name="operational_sequences",
        schema=SCHEMA,
    )
    op.drop_index(
        "uq_operational_sequences_prefix_master",
        table_name="operational_sequences",
        schema=SCHEMA,
    )
    op.drop_table("operational_sequences", schema=SCHEMA)

    op.drop_index(
        "uq_operational_code_prefixes_entity_type_active",
        table_name="operational_code_prefixes",
        schema=SCHEMA,
    )
    op.drop_index(
        "uq_operational_code_prefixes_prefix_active",
        table_name="operational_code_prefixes",
        schema=SCHEMA,
    )
    op.drop_index(
        "ix_operational_code_prefixes_entity_type",
        table_name="operational_code_prefixes",
        schema=SCHEMA,
    )
    op.drop_table("operational_code_prefixes", schema=SCHEMA)
