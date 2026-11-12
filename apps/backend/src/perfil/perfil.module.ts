import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PerfilController } from "./perfil.controller";
import { PerfilGuard } from "./perfil.guard";
import { PerfilService } from "./perfil.service";

@Module({ controllers: [PerfilController], providers: [PrismaService, PerfilGuard, PerfilService] })
export class PerfilModule {}
