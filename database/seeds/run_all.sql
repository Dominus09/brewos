-- BrewOS seeds — run all (orquestador)
-- Ejecutar desde el directorio database/seeds/:
--   psql $DATABASE_URL -f run_all.sql
--
-- Orden obligatorio. Ver docs/20-bootstrap-strategy.md

\echo '=== BrewOS seeds: start ==='

\i 001_units.sql
\i 002_business_lines.sql
\i 003_resource_types.sql
\i 004_operational_prefixes.sql

\echo '=== BrewOS seeds: complete ==='
