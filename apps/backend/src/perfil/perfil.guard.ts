import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class PerfilGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
    if (!request.headers?.authorization?.startsWith("Bearer ")) throw new UnauthorizedException();
    if (!request.headers["x-user-id"]) throw new UnauthorizedException();
    return true;
  }
}
