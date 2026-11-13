import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PerfilController } from "./perfil.controller";
import { PerfilGuard } from "./perfil.guard";
import { PerfilService } from "./perfil.service";

@Module({ imports: [AuthModule], controllers: [PerfilController], providers: [PerfilGuard, PerfilService] })
export class PerfilModule {}
