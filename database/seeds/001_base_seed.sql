-- BrewOS base seed — 001
-- Base de datos: analytics | Schema: brewos
-- Ejecutar manualmente después de: alembic upgrade head
-- Ver database/seeds/README.md

BEGIN;

SET search_path TO brewos, public;

-- ---------------------------------------------------------------------------
-- business_lines
-- ---------------------------------------------------------------------------
INSERT INTO brewos.business_lines (code, name, description, is_active)
VALUES
    ('distillery', 'Destilería', 'Línea de negocio de destilados y botánicos', true),
    ('brewery', 'Cervecería', 'Línea de negocio de cerveza artesanal', true)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- resource_types (catálogo base Insular Origins)
-- ---------------------------------------------------------------------------
INSERT INTO brewos.resource_types (code, name, description, sort_order, default_flags, code_prefix, status, is_system)
VALUES
    ('supply', 'Insumo', 'Materias primas y consumibles de producción', 10, '{"is_inventoriable": true, "is_consumable": true, "is_traceable": true}', 'INS', 'active', true),
    ('botanical', 'Botánico', 'Plantas y materiales botánicos', 20, '{"is_inventoriable": true, "is_consumable": true, "is_cultivable": true, "is_traceable": true}', 'BOT', 'active', true),
    ('container', 'Envase', 'Botellas, barricas, toneles y contenedores', 30, '{"is_inventoriable": true, "is_traceable": false}', 'ENV', 'active', true),
    ('equipment', 'Equipamiento', 'Equipos de producción y laboratorio', 40, '{"is_equipment": true, "is_inventoriable": true, "is_traceable": true}', 'EQP', 'active', true),
    ('tool', 'Herramienta', 'Herramientas y utensilios', 50, '{"is_inventoriable": true}', 'HER', 'active', true),
    ('finished_product', 'Producto terminado', 'Productos listos para venta o distribución', 60, '{"is_sellable": true, "is_inventoriable": true, "is_traceable": true}', 'PRD', 'active', true),
    ('service', 'Servicio', 'Servicios operativos (talleres, catas, tours)', 70, '{"is_sellable": true}', 'SRV', 'active', true),
    ('cleaning_material', 'Material de limpieza', 'Insumos de limpieza y sanitización', 80, '{"is_inventoriable": true, "is_consumable": true}', 'LIM', 'active', true),
    ('packaging_material', 'Material de empaque', 'Etiquetas, cajas, tapas y empaques', 90, '{"is_inventoriable": true, "is_consumable": true}', 'EMP', 'active', true),
    ('electronic_component', 'Componente electrónico', 'Sensores, controladores y componentes BrewNode', 100, '{"is_inventoriable": true}', 'ELC', 'active', true)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- units
-- ---------------------------------------------------------------------------
INSERT INTO brewos.units (code, name, symbol, unit_type, is_base, decimal_places, status)
VALUES
    ('unit', 'Unidad', 'u', 'count', true, 0, 'active'),
    ('g', 'Gramo', 'g', 'mass', true, 2, 'active'),
    ('kg', 'Kilogramo', 'kg', 'mass', false, 2, 'active'),
    ('ml', 'Mililitro', 'ml', 'volume', true, 2, 'active'),
    ('l', 'Litro', 'L', 'volume', false, 2, 'active')
ON CONFLICT (code) DO NOTHING;

-- Conversiones derivadas (requieren IDs de unidades base ya insertadas)
UPDATE brewos.units SET base_unit_id = (SELECT id FROM brewos.units WHERE code = 'g'), conversion_factor = 1000
WHERE code = 'kg' AND base_unit_id IS NULL;

UPDATE brewos.units SET base_unit_id = (SELECT id FROM brewos.units WHERE code = 'ml'), conversion_factor = 1000
WHERE code = 'l' AND base_unit_id IS NULL;

COMMIT;
