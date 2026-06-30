-- BrewOS seed 001 — units (Bootstrap obligatorio — categoría A)
-- PREREQUISITO: alembic upgrade head + bootstrap/000_verify_prerequisites.sql
-- ADR-0009 · docs/20-bootstrap-strategy.md

BEGIN;

SET search_path TO brewos, public;

INSERT INTO units (code, name, symbol, unit_type, is_base, decimal_places, status)
VALUES
    ('unit', 'Unidad', 'u', 'count', true, 0, 'active'),
    ('g', 'Gramo', 'g', 'mass', true, 2, 'active'),
    ('kg', 'Kilogramo', 'kg', 'mass', false, 2, 'active'),
    ('ml', 'Mililitro', 'ml', 'volume', true, 2, 'active'),
    ('l', 'Litro', 'L', 'volume', false, 2, 'active')
ON CONFLICT (code) DO NOTHING;

UPDATE units SET base_unit_id = (SELECT id FROM units WHERE code = 'g'), conversion_factor = 1000
WHERE code = 'kg' AND base_unit_id IS NULL;

UPDATE units SET base_unit_id = (SELECT id FROM units WHERE code = 'ml'), conversion_factor = 1000
WHERE code = 'l' AND base_unit_id IS NULL;

COMMIT;
