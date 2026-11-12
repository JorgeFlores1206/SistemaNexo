import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
    if (!request.headers?.authorization?.startsWith("Bearer ")) throw new UnauthorizedException();
    if (request.headers["x-role"] !== "Administrador") throw new ForbiddenException();
    return true;
  }
}
