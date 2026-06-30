"""Initial resource catalog tables.

Revision ID: 001_initial_resource_catalog
Revises:
Create Date: 2026-06-29

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001_initial_resource_catalog"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    op.create_table(
        "business_lines",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("settings", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
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
        sa.UniqueConstraint("code", name="uq_business_lines_code"),
    )

    op.create_table(
        "suppliers",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=True),
        sa.Column("contact_phone", sa.String(length=50), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
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
    )

    op.create_table(
        "units",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("symbol", sa.String(length=20), nullable=False),
        sa.Column("unit_type", sa.String(length=30), nullable=False),
        sa.Column("is_base", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("base_unit_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("conversion_factor", sa.Numeric(precision=18, scale=8), nullable=True),
        sa.Column("decimal_places", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
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
            ["base_unit_id"],
            ["units.id"],
            name="fk_units_base_unit_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code", name="uq_units_code"),
    )

    op.create_table(
        "resource_types",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("icon", sa.String(length=100), nullable=True),
        sa.Column("color_token", sa.String(length=50), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("business_line_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("default_flags", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("code_prefix", sa.String(length=10), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
        sa.Column("is_system", sa.Boolean(), nullable=False, server_default=sa.text("false")),
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
            ["business_line_id"],
            ["business_lines.id"],
            name="fk_resource_types_business_line_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code", name="uq_resource_types_code"),
    )
    op.create_index(
        "ix_resource_types_business_line_id",
        "resource_types",
        ["business_line_id"],
    )

    op.create_table(
        "resource_subtypes",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_type_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("default_flags", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
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
            ["resource_type_id"],
            ["resource_types.id"],
            name="fk_resource_subtypes_resource_type_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "resource_type_id",
            "code",
            name="uq_resource_subtypes_resource_type_id_code",
        ),
    )
    op.create_index(
        "ix_resource_subtypes_resource_type_id",
        "resource_subtypes",
        ["resource_type_id"],
    )

    op.create_table(
        "resource_categories",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("resource_type_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("parent_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("business_line_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("code", sa.String(length=50), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
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
            ["business_line_id"],
            ["business_lines.id"],
            name="fk_resource_categories_business_line_id",
        ),
        sa.ForeignKeyConstraint(
            ["parent_id"],
            ["resource_categories.id"],
            name="fk_resource_categories_parent_id",
        ),
        sa.ForeignKeyConstraint(
            ["resource_type_id"],
            ["resource_types.id"],
            name="fk_resource_categories_resource_type_id",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_resource_categories_resource_type_id",
        "resource_categories",
        ["resource_type_id"],
    )
    op.create_index(
        "ix_resource_categories_business_line_id",
        "resource_categories",
        ["business_line_id"],
    )

    op.create_table(
        "resources",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("internal_code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("resource_type_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("resource_subtype_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("resource_category_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("business_line_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("unit_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="draft"),
        sa.Column("is_inventoriable", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_consumable", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_cultivable", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_equipment", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_sellable", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_traceable", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("requires_lot", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("requires_expiry", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("requires_tech_sheet", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("requires_safety_sheet", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("min_stock", sa.Numeric(precision=12, scale=4), nullable=True),
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
            ["business_line_id"],
            ["business_lines.id"],
            name="fk_resources_business_line_id",
        ),
        sa.ForeignKeyConstraint(
            ["resource_category_id"],
            ["resource_categories.id"],
            name="fk_resources_resource_category_id",
        ),
        sa.ForeignKeyConstraint(
            ["resource_subtype_id"],
            ["resource_subtypes.id"],
            name="fk_resources_resource_subtype_id",
        ),
        sa.ForeignKeyConstraint(
            ["resource_type_id"],
            ["resource_types.id"],
            name="fk_resources_resource_type_id",
        ),
        sa.ForeignKeyConstraint(
            ["unit_id"],
            ["units.id"],
            name="fk_resources_unit_id",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("internal_code", name="uq_resources_internal_code"),
    )
    op.create_index("ix_resources_internal_code", "resources", ["internal_code"])
    op.create_index("ix_resources_resource_type_id", "resources", ["resource_type_id"])
    op.create_index("ix_resources_business_line_id", "resources", ["business_line_id"])


def downgrade() -> None:
    op.drop_index("ix_resources_business_line_id", table_name="resources")
    op.drop_index("ix_resources_resource_type_id", table_name="resources")
    op.drop_index("ix_resources_internal_code", table_name="resources")
    op.drop_table("resources")

    op.drop_index("ix_resource_categories_business_line_id", table_name="resource_categories")
    op.drop_index("ix_resource_categories_resource_type_id", table_name="resource_categories")
    op.drop_table("resource_categories")

    op.drop_index("ix_resource_subtypes_resource_type_id", table_name="resource_subtypes")
    op.drop_table("resource_subtypes")

    op.drop_index("ix_resource_types_business_line_id", table_name="resource_types")
    op.drop_table("resource_types")

    op.drop_table("units")
    op.drop_table("suppliers")
    op.drop_table("business_lines")
