-- BrewOS seed 003 — resource_types (Configuración inicial — categoría B)
-- Plantilla sistema (is_system = true). Editable después en UI (ADR-0006).
-- SIN code_prefix — identidad operacional vía BREW-RES-* (ADR-0007 / Identity Engine).
-- ADR-0009 · docs/20-bootstrap-strategy.md

BEGIN;

SET search_path TO brewos, public;

INSERT INTO resource_types (code, name, description, sort_order, default_flags, status, is_system)
VALUES
    ('supply', 'Insumo', 'Materias primas y consumibles de producción', 10,
     '{"is_inventoriable": true, "is_consumable": true, "is_traceable": true}', 'active', true),
    ('botanical', 'Botánico', 'Plantas y materiales botánicos', 20,
     '{"is_inventoriable": true, "is_consumable": true, "is_cultivable": true, "is_traceable": true}', 'active', true),
    ('container', 'Envase', 'Botellas, barricas, toneles y contenedores', 30,
     '{"is_inventoriable": true, "is_traceable": false}', 'active', true),
    ('equipment', 'Equipamiento', 'Equipos de producción y laboratorio', 40,
     '{"is_equipment": true, "is_inventoriable": true, "is_traceable": true}', 'active', true),
    ('tool', 'Herramienta', 'Herramientas y utensilios', 50,
     '{"is_inventoriable": true}', 'active', true),
    ('finished_product', 'Producto terminado', 'Productos listos para venta o distribución', 60,
     '{"is_sellable": true, "is_inventoriable": true, "is_traceable": true}', 'active', true),
    ('service', 'Servicio', 'Servicios operativos (talleres, catas, tours)', 70,
     '{"is_sellable": true}', 'active', true),
    ('cleaning_material', 'Material de limpieza', 'Insumos de limpieza y sanitización', 80,
     '{"is_inventoriable": true, "is_consumable": true}', 'active', true),
    ('packaging_material', 'Material de empaque', 'Etiquetas, cajas, tapas y empaques', 90,
     '{"is_inventoriable": true, "is_consumable": true}', 'active', true),
    ('electronic_component', 'Componente electrónico', 'Sensores, controladores y componentes BrewNode', 100,
     '{"is_inventoriable": true}', 'active', true)
ON CONFLICT (code) DO NOTHING;

COMMIT;
