-- BrewOS seed 004 — operational_code_prefixes (Configuración inicial — categoría B)
-- Registro oficial de prefijos para Identity Engine (ADR-0007 / ADR-0008 / CE-1).
-- PREREQUISITO: migración 003_core_engine_identity_events aplicada.
-- ADR-0009 · docs/18-operational-identity.md · docs/20-bootstrap-strategy.md

BEGIN;

SET search_path TO brewos, public;

INSERT INTO operational_code_prefixes (
    entity_type, prefix, format_type, reset_policy, example, is_active
)
VALUES
    -- Entidades maestras (secuencia global, sin reinicio diario)
    ('resource', 'BREW-RES', 'master', 'never', 'BREW-RES-000001', true),
    ('recipe', 'BREW-REC', 'master', 'never', 'BREW-REC-000001', true),
    ('recipe_version', 'BREW-REV', 'master', 'never', 'BREW-REV-000001', true),
    ('equipment', 'BREW-EQP', 'master', 'never', 'BREW-EQP-000001', true),
    ('supplier', 'BREW-SUP', 'master', 'never', 'BREW-SUP-000001', true),
    ('user', 'BREW-USR', 'master', 'never', 'BREW-USR-000001', true),
    ('client', 'BREW-CLI', 'master', 'never', 'BREW-CLI-000001', true),
    ('botanical', 'BREW-BOT', 'master', 'never', 'BREW-BOT-000001', true),
    ('plant', 'BREW-PLT', 'master', 'never', 'BREW-PLT-000001', true),
    ('business_line', 'BREW-BUS', 'master', 'never', 'BREW-BUS-000001', true),
    -- Operaciones (secuencia diaria America/Santiago)
    ('production', 'PRO', 'daily', 'daily', 'PRO-20260701-001', true),
    ('distillation', 'DIS', 'daily', 'daily', 'DIS-20260701-001', true),
    ('fermentation', 'FER', 'daily', 'daily', 'FER-20260701-001', true),
    ('maceration', 'MAC', 'daily', 'daily', 'MAC-20260701-001', true),
    ('bottling', 'BOT', 'daily', 'daily', 'BOT-20260701-001', true),
    ('harvest', 'HAR', 'daily', 'daily', 'HAR-20260701-001', true),
    ('laboratory', 'LAB', 'daily', 'daily', 'LAB-20260701-001', true),
    ('purchase_order', 'PO', 'daily', 'daily', 'PO-20260715-001', true),
    ('work_order', 'WO', 'daily', 'daily', 'WO-20260715-001', true)
ON CONFLICT (prefix) WHERE deleted_at IS NULL DO NOTHING;

COMMIT;
