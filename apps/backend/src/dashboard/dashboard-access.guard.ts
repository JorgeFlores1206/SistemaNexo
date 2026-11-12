import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class DashboardAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
    if (!request.headers?.authorization?.startsWith("Bearer ")) throw new UnauthorizedException();
    const role = request.headers["x-role"];
    if (role !== "Administrador" && role !== "Usuario") throw new ForbiddenException();
    return true;
  }
}
