import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SessionGuard } from "./guards/session.guard";
import { SessionService } from "./session.service";
import { AuthController } from "./auth.controller";

@Module({ imports: [PrismaModule], controllers: [AuthController], providers: [SessionService, SessionGuard], exports: [SessionService, SessionGuard] })
export class AuthModule {}
