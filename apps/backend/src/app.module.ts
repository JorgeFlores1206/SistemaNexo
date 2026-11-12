import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ReportesProgramadosModule } from "./reportes-programados/reportes-programados.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { InventarioModule } from "./inventario/inventario.module";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { RolesModule } from "./roles/roles.module";
import { BitacoraModule } from "./bitacora/bitacora.module";
import { PerfilModule } from "./perfil/perfil.module";

@Module({ imports: [AuthModule, ReportesProgramadosModule, DashboardModule, InventarioModule, UsuariosModule, RolesModule, BitacoraModule, PerfilModule] })
export class AppModule {}
