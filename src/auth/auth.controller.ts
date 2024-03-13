import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, JwtPayload } from './auth.service';
import { AuthDto } from './auth.dto';
import { Admin } from 'src/admin/admin.entity';
import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/admin/login')
  async adminLogin(@Body() authDto: AuthDto) {
    return await this.authService.signIn(
      authDto.email,
      authDto.password,
      Admin,
      ['admin'],
    );
  }

  @Post('/company/login')
  async companyLogin(@Body() authDto: AuthDto) {
    return await this.authService.signIn(
      authDto.email,
      authDto.password,
      Company,
      ['company'],
    );
  }

  @Post('/user/login')
  async userLogin(@Body() authDto: AuthDto) {
    return await this.authService.signIn(
      authDto.email,
      authDto.password,
      User,
      ['user'],
    );
  }
}
