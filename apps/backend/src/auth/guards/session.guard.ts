import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { SessionService } from "../session.service";
import type { AuthenticatedRequest } from "../../common/auth-context";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await this.sessions.authenticate(request.headers.authorization);
    request.user = session.user;
    request.sessionId = session.sessionId;
    return true;
  }
}
