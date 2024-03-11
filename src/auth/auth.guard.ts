import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const checkAuth = this.reflector.get('auth', context.getHandler());
    if (checkAuth) {
      const accessToken = this.extractTokenFromHeader(request);
      if (accessToken) {
        const jwtPayload: JwtPayload = this.authService.checkAuth(accessToken);
        const roles: string[] = this.reflector.get(
          'role',
          context.getHandler(),
        );
        if (jwtPayload) {
          if (roles) {
            return this.matchRoles(roles, jwtPayload.roles);
          } else {
            return true; // 有効なアクセストークンで Role の指定がアクションになかった場合
          }
        }
      }

      throw new UnauthorizedException();
    } else {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private matchRoles(roles: string[], accountRoles: string[]) {
    if (!roles || roles.length === 0) {
      return true; // アクションに @Role の指定がなければ全アカウントからのアクセスを許可する
    }
    for (const role of roles) {
      for (const accountRole of accountRoles) {
        const regex = new RegExp(`^${accountRole}$`);
        if (regex.test(role)) {
          return true;
        }
      }
    }
    return false;
  }
}
