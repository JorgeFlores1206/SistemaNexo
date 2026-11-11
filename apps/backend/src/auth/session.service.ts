import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class SessionService {
  validateBearerToken(authorization: string | undefined): string {
    const token = authorization?.replace(/^Bearer\s+/, "");
    if (!token) throw new UnauthorizedException();
    return token;
  }
}
