# Services

Capa de acceso a datos y APIs externas.

En esta etapa está vacía. Cuando exista backend FastAPI, aquí vivirán:

- Clientes HTTP (`api-client.ts`)
- Servicios por dominio (`resources.service.ts`, etc.)
- Mapeo DTO → tipos de dominio

Los componentes y páginas no deben llamar `fetch` directamente; usarán estos servicios.
