import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityTarget, DataSource } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Account } from 'src/account.entity';
import { Request } from 'express';

export type JwtPayload = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async signIn<T extends Account>(
    email: string,
    password: string,
    entityType: EntityTarget<T>,
    roles: string[],
  ): Promise<{ accessToken: string }> {
    const queryBuider = this.dataSource
      .getRepository(entityType)
      .createQueryBuilder();
    const account: T = await queryBuider
      .select()
      .where({ email: email })
      .getOne();

    if (!account) {
      throw new UnauthorizedException();
    }

    if (await compare(password, account.password)) {
      const payload: JwtPayload = {
        id: account.id,
        name: account.name,
        email: account.email,
        roles: roles,
      };
      return { accessToken: this.jwtService.sign(payload) };
    }

    throw new UnauthorizedException();
  }

  checkAuth(accessToken: string): JwtPayload {
    try {
      return this.jwtService.verify(accessToken);
    } catch (e: any) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      }
    }
  }

  extractTokenFromHeader(authorization: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
