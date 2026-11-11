# Feature Specification: Ajuste de inventario físico

**Feature Branch**: `010-movimientos-inventario`  
**Created**: 2026-11-11  
**Status**: Draft  
**Input**: User description: "Registrar el resultado del inventario físico en Saldo mediante ajustes."

## Clarifications

### Session 2026-11-11

- Q: ¿Qué movimiento debe cubrir la Spec 010? → A: Solo ajustes derivados del inventario físico; el usuario ingresa en `Saldo` la cantidad encontrada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar el resultado del inventario físico (Priority: P1)

Como Administrador, necesito ingresar en `Saldo` la cantidad encontrada durante un inventario físico para que el sistema refleje el conteo realizado.

**Independent Test**: Seleccionar un artículo, ingresar una cantidad física válida y comprobar que `Saldo` se actualiza y el ajuste queda registrado.

**Acceptance Scenarios**:

1. **Given** un artículo existente, **When** el Administrador ingresa una cantidad física entera no negativa y un motivo, **Then** el sistema actualiza `Saldo` con el valor encontrado y registra el ajuste.
2. **Given** un ajuste confirmado, **When** se consulta el historial, **Then** se muestran artículo, saldo anterior, saldo nuevo, motivo, fecha y Administrador responsable.
3. **Given** una cantidad negativa, decimal, vacía o inválida, **When** el Administrador intenta confirmar el ajuste, **Then** el sistema lo rechaza y conserva el saldo anterior.

### User Story 2 - Revisar ajustes realizados (Priority: P2)

Como Administrador, necesito consultar y filtrar los ajustes para revisar los resultados de inventarios físicos anteriores.

**Independent Test**: Consultar el historial y filtrar por artículo y periodo; verificar que solo aparecen ajustes coincidentes.

**Acceptance Scenarios**:

1. **Given** ajustes registrados, **When** el Administrador consulta el historial, **Then** se muestran del más reciente al más antiguo.
2. **Given** filtros por artículo o periodo, **When** el Administrador los aplica, **Then** el resultado contiene únicamente los ajustes coincidentes.
3. **Given** no existen ajustes para los filtros seleccionados, **When** se consulta el historial, **Then** el sistema informa que no hay resultados.

### Edge Cases

- El artículo está inactivo o no existe.
- El inventario físico encuentra cero unidades.
- Dos Administradores intentan ajustar el mismo artículo simultáneamente.
- El ajuste se envía dos veces.
- Se intenta editar o eliminar un ajuste confirmado.
- El usuario intenta registrar entradas, salidas o transferencias de almacén mediante este flujo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Solo el Administrador MUST poder registrar y consultar ajustes de inventario físico.
- **FR-002**: El ajuste MUST actualizar únicamente el campo `Saldo` del artículo seleccionado con la cantidad encontrada físicamente.
- **FR-003**: La cantidad encontrada MUST ser un entero no negativo; el sistema MUST rechazar valores vacíos, decimales, negativos o no numéricos.
- **FR-004**: Cada ajuste MUST requerir artículo, saldo anterior, saldo nuevo, motivo, fecha y Administrador responsable.
- **FR-005**: El sistema MUST conservar el saldo anterior y registrar el saldo nuevo sin modificar `On hand`, el estado calculado, la alerta ni la condición `Dañado`.
- **FR-006**: Un ajuste confirmado MUST ser inmutable y no MUST poder editarse ni eliminarse por el flujo normal; una corrección requiere un nuevo ajuste.
- **FR-007**: El sistema MUST evitar que un ajuste concurrente sobrescriba silenciosamente otro y MUST comunicar el conflicto al Administrador.
- **FR-008**: Si el ajuste falla, el sistema MUST conservar el saldo anterior y MUST comunicar que no se completó.
- **FR-009**: El historial MUST permitir filtrar por artículo y rango de fechas, y MUST ordenar los ajustes más recientes primero.
- **FR-010**: Cada ajuste confirmado o rechazado MUST registrarse en la bitácora conforme a las reglas vigentes, sin guardar contraseñas ni secretos.
- **FR-011**: Esta Spec MUST NOT registrar entradas, salidas, ventas, compras, recepciones ni transferencias entre almacenes.
- **FR-012**: El sistema MUST impedir el doble envío de un mismo ajuste y MUST evitar duplicar la operación.

### Key Entities

- **Ajuste de inventario físico**: Registro inmutable del saldo anterior, saldo encontrado, motivo, artículo, fecha y Administrador.
- **Artículo**: Producto cuyo campo `Saldo` se actualiza mediante un ajuste físico.
- **Saldo**: Cantidad encontrada en el inventario físico y registrada por el Administrador.

## Success Criteria *(mandatory)*

- **SC-001**: El 100% de los ajustes válidos actualiza `Saldo` con la cantidad física confirmada.
- **SC-002**: El 100% de los ajustes inválidos se rechaza sin modificar el saldo anterior.
- **SC-003**: El 100% de los ajustes confirmados conserva saldo anterior, saldo nuevo, motivo, fecha y responsable.
- **SC-004**: Ningún ajuste modifica `On hand`, estados, alertas ni condición `Dañado`.
- **SC-005**: Ninguna operación de ajuste crea registros de entrada, salida o transferencia.
- **SC-006**: Un Administrador puede registrar un ajuste válido en menos de 60 segundos.

## Assumptions

- `Saldo` representa el valor encontrado y confirmado durante el inventario físico.
- `On hand` conserva su significado de cantidad física de referencia y no se modifica mediante este flujo.
- Los ajustes son la única operación incluida en esta Spec; entradas y salidas requieren una Spec independiente.
- La cantidad encontrada se registra como entero no negativo.

## Out of Scope

- Entradas y salidas de inventario.
- Ventas, compras, recepción de mercancías y transferencias entre almacenes.
- Importación masiva de ajustes desde Excel.
- Edición o eliminación de ajustes confirmados.
