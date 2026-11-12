import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesService {
  listar() {
    return { permisos: [
      { modulo: "Dashboard", accion: "Consultar", administrador: true, usuario: true },
      { modulo: "Inventario", accion: "Consultar", administrador: true, usuario: true },
      { modulo: "Inventario", accion: "Importar Excel", administrador: true, usuario: true },
      { modulo: "Usuarios", accion: "Administrar", administrador: true, usuario: false },
      { modulo: "Roles y privilegios", accion: "Consultar", administrador: true, usuario: false },
      { modulo: "Bitácora", accion: "Consultar", administrador: true, usuario: false },
      { modulo: "Ajustes físicos", accion: "Registrar", administrador: true, usuario: false },
    ] };
  }
}
