import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Account } from 'src/account.entity';
import { Request } from 'express';
import { Admin } from 'src/admin/admin.entity';
import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';

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

  async signInAdmin(email: string, password: string, roles: string[]) {
    return await this.signIn(
      email,
      password,
      roles,
      Admin.createQueryBuilder(),
    );
  }

  async signInCompany(email: string, password: string, roles: string[]) {
    return await this.signIn(
      email,
      password,
      roles,
      Company.createQueryBuilder(),
    );
  }

  async signInUser(email: string, password: string, roles: string[]) {
    return await this.signIn(email, password, roles, User.createQueryBuilder());
  }

  private async signIn<T extends Account>(
    email: string,
    password: string,
    roles: string[],
    queryBuilder: SelectQueryBuilder<T>,
  ): Promise<{ accessToken: string }> {
    const account: T = await queryBuilder
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
