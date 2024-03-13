import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Role } from '../role/role.decorator';
import { Company } from 'src/company/company.entity';
import { AuthService, JwtPayload } from 'src/auth/auth.service';
import { CompanyService } from 'src/company/company.service';
import { UpdateCompanyDto } from '../company/company-update.dto';

@Controller('company/profile')
export class CompanyProfileController {
  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
  ) {}

  @Get()
  @Auth()
  @Role(['company'])
  async show(
    @Req() req: Request & { headers: { authorization?: string } },
  ): Promise<Company> {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      const company: Company = await this.companyService.find(payload.id);
      delete company.password;
      return company;
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }

  @Patch()
  @Auth()
  @Role(['company'])
  async update(
    @Req() req: Request & { headers: { authorization: string } },
    @Body() dto: UpdateCompanyDto,
  ): Promise<{ result: string }> {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      const updateResult = await this.companyService.update(payload.id, dto);
      const result = { result: 'success' };
      if (!updateResult.affected) {
        result.result = 'failed';
      }
      return result;
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }
}
