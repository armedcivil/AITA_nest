import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Admin } from 'src/admin/admin.entity';
import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';
import { Auth } from './auth.decorator';
import { Role } from 'src/role/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/admin/login')
  async adminLogin(@Body() authDto: AuthDto) {
    return await this.authService.signInAdmin(authDto.email, authDto.password, [
      'admin',
    ]);
  }

  @Post('/company/login')
  async companyLogin(@Body() authDto: AuthDto) {
    return await this.authService.signInCompany(
      authDto.email,
      authDto.password,
      ['company'],
    );
  }

  @Post('/user/login')
  async userLogin(@Body() authDto: AuthDto) {
    return await this.authService.signInUser(authDto.email, authDto.password, [
      'user',
    ]);
  }

  @Get('/check')
  @Auth()
  @Role(['admin', 'company', 'user'])
  async check() {
    return { check: true };
  }
}
