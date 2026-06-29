# ADR-0001: Idioma de interfaz vs idioma técnico

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Decisores** | Producto Insular Origins |
| **Principios relacionados** | [11 — Principios 13 y 14](../11-product-principles.md) |

---

## Contexto

BrewOS es operado por un equipo en Chile, en contexto artesanal y de laboratorio. El código será mantenido con convenciones estándar de la industria (FastAPI, PostgreSQL, Next.js). Se necesita una política clara de idioma para evitar mezclas inconsistentes en UI, API y base de datos.

---

## Decisión

1. **La interfaz de usuario será en español.** Incluye: menús, labels, mensajes de error, placeholders, notificaciones, textos de ayuda y documentación embebida en la aplicación.

2. **El código, la API y la base de datos serán en inglés.** Incluye: nombres de tablas y columnas, endpoints REST, parámetros JSON, variables, funciones, tipos TypeScript/Python, migraciones y comentarios técnicos de esquema.

3. **Las respuestas de API orientadas al usuario** (mensajes de validación mostrados en frontend) pueden viajar en español en el campo `message` o equivalente, mientras el código de error (`code`) permanece en inglés.

---

## Por qué

### Interfaz en español

- El operador principal trabaja en español; reduce fricción y errores de interpretación.
- Términos del dominio (lote, cosecha, botánico, insumo) son naturales en español en el contexto chileno.
- Alinea BrewOS con Insular Origins como marca local con proyección premium.

### Código y datos en inglés

- Convención universal en stacks FastAPI / PostgreSQL / Next.js; facilita contratación, librerías y ejemplos.
- Evita problemas con acentos, espacios y pluralización en identificadores SQL.
- Separación clara entre capa de presentación (i18n futuro posible) y capa persistente.

---

## Consecuencias

| Área | Consecuencia |
|------|--------------|
| Frontend | Textos en español en componentes; claves de ruta en inglés (`/dashboard`, `/catalog`) |
| Backend | Endpoints en inglés (`/api/v1/inventory-movements`); mensajes de error bilingües si aplica |
| Base de datos | Tablas `resources`, `batches`, no `recursos`, `lotes` |
| Documentación | Docs de producto en español (`docs/`); esquema DB y OpenAPI en inglés |
| Testing | Assertions sobre textos UI en español; nombres de fixtures en inglés |

---

## Beneficios

- Experiencia natural para el usuario final sin sacrificar mantenibilidad técnica.
- Base preparada para i18n futuro (segundo idioma solo en capa de presentación).
- Consistencia en code reviews: regla simple y verificable.
- Integración con herramientas (ORM, migraciones, linters) sin fricción.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Desalineación entre nombre UI y nombre técnico | Mapa de navegación y glosario producto ↔ código en `docs/` |
| Mensajes de error del framework en inglés | Wrapper de validación que traduce mensajes al español en backend |
| Contribuidores mezclan idiomas en commits | Regla en [08 — Reglas de desarrollo](../08-development-rules.md) y revisión de PR |
| Documentación API confusa para operador | OpenAPI para desarrolladores; UI nunca expone nombres de tabla |

---

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|-------------|-------------------|
| Todo en español (incl. código y DB) | Fricción con ecosistema, problemas en SQL y APIs |
| Todo en inglés (incl. UI) | Barrera para operador artesanal en Chile |
| i18n completo desde día uno | Complejidad prematura; español es el único idioma requerido hoy |

---

## Referencias

- [11 — Principios de producto](../11-product-principles.md)
- [10 — Mapa de navegación](../10-navigation-map.md)
