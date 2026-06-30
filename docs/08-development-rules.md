# 08 — Reglas de desarrollo

Reglas obligatorias para implementar BrewOS. Aplican a backend, frontend, base de datos y documentación. Su objetivo es mantener coherencia de datos, trazabilidad y escalabilidad sin sobreingeniería.

---

## 1. No duplicar datos

Cada pieza de información tiene **una sola fuente de verdad**.

| Correcto | Incorrecto |
|----------|------------|
| Nombre del insumo en `resources`; recetas referencian por ID | Copiar nombre del insumo en cada receta |
| Costo promedio calculado desde `inventory_movements` | Campo de costo duplicado sin sincronización |
| Versión de receta congelada en `batches` | Receta editable que afecta lotes pasados |

Si un dato puede derivarse de otro, **derivarlo** — no duplicarlo.

---

## 2. Todo recurso se crea primero en Recursos

Ningún insumo, herramienta, botánico, envase o equipamiento aparece en inventario, recetas o producción sin existir previamente en el módulo **Recursos**.

Flujo obligatorio:

```
Crear resource → Usar en inventario / receta / producción
```

No existen "insumos rápidos" ni creación implícita desde otros módulos.

---

## 3. Inventario solo mueve stock

El módulo **Inventario** registra entradas, salidas y ajustes. **No define** recursos, categorías ni costos de referencia — solo los movimientos y el stock resultante.

| Responsabilidad de Inventario | No es responsabilidad de Inventario |
|-------------------------------|-------------------------------------|
| Cantidad en stock | Crear nuevos recursos |
| Historial de movimientos | Editar datos maestros del recurso |
| Costo promedio (calculado) | Definir recetas |

---

## 4. Recetas usan recursos existentes

Cada `recipe_item` referencia un `resource` existente. No se permiten ingredientes "libres" sin vínculo al catálogo.

Beneficios:

- Costos estimados siempre actualizables desde el catálogo
- Trazabilidad coherente en producción
- Un solo lugar para renombrar o reclasificar un insumo

---

## 5. Producción congela la versión de receta

Al crear un `batch`, se vincula una `recipe_version` específica. Esa versión **no cambia** aunque la receta evolucione después.

| Momento | Comportamiento |
|---------|----------------|
| Crear lote | Se selecciona o confirma la versión activa |
| Durante el lote | La versión queda congelada |
| Después | Nuevas versiones no afectan lotes cerrados |

---

## 6. Trazabilidad debe registrar todo

Todo evento relevante de un lote genera un `traceability_event`:

- Consumo de inventario vinculado al lote
- Observaciones del operador
- Fotos y documentos
- Cambios de etapa

Si no está registrado, **no ocurrió** para efectos del sistema.

---

## 7. Responsive desde el inicio

Toda pantalla y flujo se diseña y prueba en:

- Móvil (375px+)
- Tablet (768px+)
- Escritorio (1024px+)

No se implementan vistas "solo desktop" con promesa de adaptar después.

---

## 8. Primero simple, luego escalable

| Prioridad | Enfoque |
|-----------|---------|
| Alta | Flujo manual completo y usable por un operador |
| Media | Automatizaciones y atajos |
| Baja | Optimizaciones prematuras, microservicios, caché complejo |

Un CRUD claro y trazable vale más que una arquitectura sofisticada sin usuarios.

---

## 9. No implementar sensores antes de los módulos base

**BrewNode (ESP32) es Sprint 9.** No se escribe firmware ni se diseña UI de sensores hasta que estén estables:

- Login y usuarios
- Recursos
- Inventario
- Recetas
- Producción
- Trazabilidad

Los módulos base deben funcionar al 100 % con entrada manual.

---

## 10. Reglas adicionales de implementación

### API

- Validar en backend; el frontend es conveniencia, no seguridad
- Respuestas de error consistentes (código, mensaje, detalle)
- Versionar la API (`/api/v1/`) desde el primer endpoint

### Base de datos

- Migraciones versionadas; nunca alterar producción a mano
- Claves foráneas para integridad referencial
- Timestamps (`created_at`, `updated_at`) en tablas transaccionales

### Código

- Convenciones del stack (Python/PEP 8 en backend, ESLint/Prettier en frontend)
- Commits descriptivos en español o inglés — consistentes en el repo
- No commitear secretos, `.env` ni credenciales

### Documentación

- Actualizar `docs/` cuando cambie arquitectura o modelo de datos
- Registrar decisiones importantes en `docs/decisions/` (ADR) o `.foundation/`

---

## Checklist antes de cerrar un sprint

- [ ] Flujos probados en móvil
- [ ] Sin duplicación de datos maestros
- [ ] Trazabilidad verificada en al menos un caso de uso real
- [ ] API documentada (OpenAPI / Swagger)
- [ ] Sin dependencia de hardware no implementado
