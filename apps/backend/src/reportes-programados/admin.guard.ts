import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SessionService } from "../auth/session.service";
import type { AuthenticatedRequest } from "../common/auth-context";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await this.sessions.authenticate(request.headers.authorization);
    request.user = session.user;
    request.sessionId = session.sessionId;
    if (session.user.debeCambiarPassword) throw new ForbiddenException("Debes cambiar tu contraseña antes de continuar");
    if (session.user.rol !== "ADMINISTRADOR") throw new ForbiddenException("Operación reservada al Administrador");
    return true;
  }
}
