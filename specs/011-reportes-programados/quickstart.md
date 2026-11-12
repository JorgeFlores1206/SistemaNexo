# Quickstart de validación: Spec 011

## Prerrequisitos

- Node.js `>=24 <25` y npm 11.
- Variables `DATABASE_URL` y `DIRECT_URL` configuradas para PostgreSQL.
- Productos con vencimiento válido, sin vencimiento, con y sin política de devolución.
- Un usuario Administrador y un usuario sin permiso administrativo.

## Preparación

Desde la raíz:

```powershell
npm install
npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma
```

Iniciar backend y frontend según sus scripts locales. Las peticiones del navegador deben pasar por la API NestJS.

## Escenarios de aceptación

1. Configurar fecha de negocio el último día del mes. Ejecutar el caso de uso de generación para el primer día del mes siguiente. Confirmar una generación `GENERADO` y una fila por producto dentro de 1–30 días.
2. Repetir la generación del mismo mes. Confirmar que la restricción de unicidad conserva una sola generación visible.
3. Incluir productos fuera de ventana, en el día 30, en el día 1, sin fecha válida y con fecha relevante igual a la fecha de negocio. Confirmar inclusión/exclusión según `data-model.md`.
4. Consultar como Administrador. Confirmar código, nombre, política, fechas, estado, días restantes y “Dañado” separado.
5. Consultar con inventario sin coincidencias. Confirmar `VACIO`, cantidad cero y mensaje claro.
6. Simular fallo de generación. Confirmar `FALLIDO`, error seguro y ausencia de fallback a una generación anterior.
7. Consultar como Usuario sin permiso. Confirmar `403` sin datos de inventario.
8. Consultar bitácora. Confirmar registros para generaciones exitosas, vacías y fallidas, con mes, fecha de negocio, resultado y cantidad.

## Verificación técnica

```powershell
npm run lint
npm run build
```

Contratos y campos esperados están definidos en `contracts/reportes-programados-contract.md`; entidades y reglas en `data-model.md`.
