-- BrewOS seed 002 — business_lines (Bootstrap obligatorio — categoría A)
-- Mínimo Insular Origins. Instalaciones genéricas pueden vaciar este archivo vía UI después.
-- ADR-0009 · docs/20-bootstrap-strategy.md

BEGIN;

SET search_path TO brewos, public;

INSERT INTO business_lines (code, name, description, is_active)
VALUES
    ('distillery', 'Destilería', 'Línea de negocio de destilados y botánicos', true),
    ('brewery', 'Cervecería', 'Línea de negocio de cerveza artesanal', true)
ON CONFLICT (code) DO NOTHING;

COMMIT;
