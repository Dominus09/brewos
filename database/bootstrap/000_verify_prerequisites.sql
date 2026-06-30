-- BrewOS bootstrap — 000 verify prerequisites
-- NO crea schema ni tablas. Solo verifica que Alembic ya corrió.
-- Ver database/bootstrap/README.md y docs/20-bootstrap-strategy.md

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = 'brewos'
    ) THEN
        RAISE EXCEPTION 'Schema brewos no existe. Ejecutar: cd backend && alembic upgrade head';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'brewos' AND table_name = 'units'
    ) THEN
        RAISE EXCEPTION 'Tabla brewos.units no existe. Ejecutar migraciones Alembic al head.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'brewos' AND table_name = 'alembic_version'
    ) THEN
        RAISE EXCEPTION 'Tabla brewos.alembic_version no existe. Ejecutar migraciones Alembic.';
    END IF;

    RAISE NOTICE 'OK: prerequisites verified (schema brewos, tables, alembic_version).';
END $$;
