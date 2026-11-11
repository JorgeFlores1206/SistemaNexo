# Contrato de arquitectura

## Frontera frontend-API

- El frontend consume endpoints HTTPS de la API NestJS.
- Las entradas y salidas se validan con esquemas Zod compartidos.
- Las respuestas de error deben ser accionables y no revelar secretos ni detalles internos de la base.

## Autenticación y autorización

- La sesión segura es gestionada por NestJS.
- Cada endpoint protegido valida sesión y permisos en el backend.
- Ocultar controles en la interfaz no reemplaza la autorización.

## Persistencia

- Solo la API accede a PostgreSQL mediante Prisma.
- El esquema de Nexo es `nexo`.
- Supabase se limita a PostgreSQL; quedan fuera Auth, API automática y cliente de navegador.

## Cambios materiales

Una nueva tecnología o cambio de frontera debe registrar motivo, alternativas, impacto en seguridad
y datos, y aprobación antes de incorporarse.
