# Data Model: Diccionario de datos

## Producto

| Campo | Regla |
|---|---|
| Artículo | Código único, texto, conserva mayúsculas/minúsculas y ceros iniciales |
| Descripción del artículo | Nombre del producto; separado del código |
| On hand | Cantidad física, entero no negativo |
| Saldo | Cantidad ingresada o encontrada, entero no negativo; puede diferir de On hand |
| Trazabilidad | Texto importable; no contiene fecha de vencimiento implícita |
| UOM primaria | Unidad de medida importable |
| Laboratorio | Texto importable |
| Marca | Texto importable |
| Política devolución | Catálogo: En el mes, 1 mes antes, 2 meses antes, 3 meses antes o sin política |
| Observación | Texto importable |
| Fecha de vencimiento | Dato separado, formato `DD/MM/YYYY`; opcional para productos sin vencimiento |
| Estado | Calculado; no importable |
| Pronto a vencer | Alerta calculada separada del estado |
| Dañado | Condición independiente; puede coexistir con cualquier estado |

## Usuario y Rol

Un usuario tiene identidad, correo único, estado y un rol aprobado. Los roles iniciales son
Administrador y Usuario. Los permisos se documentan sin crear privilegios no aprobados.

## Bitácora

Registra actor, acción, recurso afectado, fecha, resultado y referencia de decisión cuando aplique.
No contiene contraseñas, tokens, secretos ni copias innecesarias del inventario.

## Relationships

- Un producto tiene una política de devolución opcional.
- Un producto puede tener múltiples eventos de bitácora relacionados con cambios o consultas.
- Un usuario tiene un rol vigente.
- Un rol determina permisos, pero no cambia la identidad del usuario.
