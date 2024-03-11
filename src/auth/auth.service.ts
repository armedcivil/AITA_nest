import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/admin.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = { id: number; name: string; email: string };

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const admin: Admin = await this.adminService.findByEmail(email);

    if (await compare(password, admin.password)) {
      const payload: JwtPayload = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      };
      return { accessToken: this.jwtService.sign(payload) };
    }

    throw new UnauthorizedException();
  }

  checkAuth(accessToken: string): JwtPayload {
    return this.jwtService.verify(accessToken);
  }
}
