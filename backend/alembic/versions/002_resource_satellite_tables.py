"""Resource satellite tables.

Revision ID: 002_resource_satellite_tables
Revises: 001_initial_resource_catalog
Create Date: 2026-06-29

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from app.core.database_schema import DATABASE_SCHEMA as SCHEMA

revision: str = "002_resource_satellite_tables"
down_revision: Union[str, None] = "001_initial_resource_catalog"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "resource_tags",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("slug", sa.String(length=100), nullable=False),
        sa.Column("color", sa.String(length=20), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
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
    op.create_index("ix_resource_tags_slug", "resource_tags", ["slug"], schema=SCHEMA)
    op.create_index(
        "uq_resource_tags_slug_active",
        "resource_tags",
        ["slug"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
        schema=SCHEMA,
    )

    op.create_table(
        "resource_suppliers",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("supplier_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("supplier_sku", sa.String(length=100), nullable=True),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("last_purchase_price", sa.Numeric(precision=12, scale=4), nullable=True),
        sa.Column("currency", sa.String(length=3), nullable=True),
        sa.Column("lead_time_days", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
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
        sa.ForeignKeyConstraint(
            ["resource_id"],
            ["resources.id"],
            name="fk_resource_suppliers_resource_id",
        ),
        sa.ForeignKeyConstraint(
            ["supplier_id"],
            ["suppliers.id"],
            name="fk_resource_suppliers_supplier_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_suppliers_resource_id",
        "resource_suppliers",
        ["resource_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_suppliers_supplier_id",
        "resource_suppliers",
        ["supplier_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "uq_resource_suppliers_resource_id_supplier_id_active",
        "resource_suppliers",
        ["resource_id", "supplier_id"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
        schema=SCHEMA,
    )
    op.create_index(
        "uq_resource_suppliers_resource_id_primary_active",
        "resource_suppliers",
        ["resource_id"],
        unique=True,
        postgresql_where=sa.text("is_primary = true AND deleted_at IS NULL"),
        schema=SCHEMA,
    )

    op.create_table(
        "resource_costs",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("cost_type", sa.String(length=30), nullable=False),
        sa.Column("amount", sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="CLP"),
        sa.Column("source", sa.String(length=100), nullable=True),
        sa.Column("effective_date", sa.Date(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
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
        sa.ForeignKeyConstraint(
            ["resource_id"],
            ["resources.id"],
            name="fk_resource_costs_resource_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index("ix_resource_costs_resource_id", "resource_costs", ["resource_id"], schema=SCHEMA)
    op.create_index(
        "ix_resource_costs_resource_id_effective_date",
        "resource_costs",
        ["resource_id", "effective_date"],
        schema=SCHEMA,
    )

    op.create_table(
        "resource_documents",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("document_type", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=2048), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=True),
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
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
        sa.ForeignKeyConstraint(
            ["resource_id"],
            ["resources.id"],
            name="fk_resource_documents_resource_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_documents_resource_id",
        "resource_documents",
        ["resource_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_documents_resource_id_document_type",
        "resource_documents",
        ["resource_id", "document_type"],
        schema=SCHEMA,
    )

    op.create_table(
        "resource_photos",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("photo_url", sa.String(length=2048), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("caption", sa.Text(), nullable=True),
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["resource_id"],
            ["resources.id"],
            name="fk_resource_photos_resource_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index("ix_resource_photos_resource_id", "resource_photos", ["resource_id"], schema=SCHEMA)
    op.create_index(
        "uq_resource_photos_resource_id_primary_active",
        "resource_photos",
        ["resource_id"],
        unique=True,
        postgresql_where=sa.text("is_primary = true AND deleted_at IS NULL"),
        schema=SCHEMA,
    )

    op.create_table(
        "resource_tag_links",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tag_id", postgresql.UUID(as_uuid=True), nullable=False),
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
        sa.ForeignKeyConstraint(
            ["resource_id"],
            ["resources.id"],
            name="fk_resource_tag_links_resource_id",
        ),
        sa.ForeignKeyConstraint(
            ["tag_id"],
            ["resource_tags.id"],
            name="fk_resource_tag_links_tag_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_tag_links_resource_id",
        "resource_tag_links",
        ["resource_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "ix_resource_tag_links_tag_id",
        "resource_tag_links",
        ["tag_id"],
        schema=SCHEMA,
    )
    op.create_index(
        "uq_resource_tag_links_resource_id_tag_id_active",
        "resource_tag_links",
        ["resource_id", "tag_id"],
        unique=True,
        postgresql_where=sa.text("deleted_at IS NULL"),
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_index(
        "uq_resource_tag_links_resource_id_tag_id_active",
        table_name="resource_tag_links",
        schema=SCHEMA,
    )
    op.drop_index("ix_resource_tag_links_tag_id", table_name="resource_tag_links", schema=SCHEMA)
    op.drop_index("ix_resource_tag_links_resource_id", table_name="resource_tag_links", schema=SCHEMA)
    op.drop_table("resource_tag_links", schema=SCHEMA)

    op.drop_index(
        "uq_resource_photos_resource_id_primary_active",
        table_name="resource_photos",
        schema=SCHEMA,
    )
    op.drop_index("ix_resource_photos_resource_id", table_name="resource_photos", schema=SCHEMA)
    op.drop_table("resource_photos", schema=SCHEMA)

    op.drop_index(
        "ix_resource_documents_resource_id_document_type",
        table_name="resource_documents",
        schema=SCHEMA,
    )
    op.drop_index("ix_resource_documents_resource_id", table_name="resource_documents", schema=SCHEMA)
    op.drop_table("resource_documents", schema=SCHEMA)

    op.drop_index(
        "ix_resource_costs_resource_id_effective_date",
        table_name="resource_costs",
        schema=SCHEMA,
    )
    op.drop_index("ix_resource_costs_resource_id", table_name="resource_costs", schema=SCHEMA)
    op.drop_table("resource_costs", schema=SCHEMA)

    op.drop_index(
        "uq_resource_suppliers_resource_id_primary_active",
        table_name="resource_suppliers",
        schema=SCHEMA,
    )
    op.drop_index(
        "uq_resource_suppliers_resource_id_supplier_id_active",
        table_name="resource_suppliers",
        schema=SCHEMA,
    )
    op.drop_index("ix_resource_suppliers_supplier_id", table_name="resource_suppliers", schema=SCHEMA)
    op.drop_index("ix_resource_suppliers_resource_id", table_name="resource_suppliers", schema=SCHEMA)
    op.drop_table("resource_suppliers", schema=SCHEMA)

    op.drop_index("uq_resource_tags_slug_active", table_name="resource_tags", schema=SCHEMA)
    op.drop_index("ix_resource_tags_slug", table_name="resource_tags", schema=SCHEMA)
    op.drop_table("resource_tags", schema=SCHEMA)
