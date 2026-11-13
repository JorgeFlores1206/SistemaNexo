import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";

@Module({ imports: [AuthModule], controllers: [UsuariosController], providers: [AdminGuard, UsuariosService] })
export class UsuariosModule {}
