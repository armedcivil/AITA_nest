import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  NotFoundException,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Role } from '../role/role.decorator';
import { CompanyService, CompanyPager } from './company.service';
import { Company } from './company.entity';
import { AuthService, JwtPayload } from '../auth/auth.service';
import { CreateCompanyDto } from './company-create.dto';
import { UpdateCompanyDto } from './company-update.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
  ) {}

  @Get()
  @Auth()
  @Role(['admin'])
  async index(@Query('page') page: string = '1'): Promise<CompanyPager> {
    return await this.companyService.all(parseInt(page));
  }

  @Get('/:id')
  @Auth()
  @Role(['admin'])
  async show(@Param('id') id: string): Promise<Company> {
    try {
      const company: Company = await this.companyService.find(parseInt(id));
      delete company.password;
      return company;
    } catch (e: any) {
      throw new NotFoundException();
    }
  }

  @Post()
  @Auth()
  @Role(['admin'])
  async create(@Body() dto: CreateCompanyDto): Promise<Company> {
    return await this.companyService.create(dto);
  }

  @Patch('/:id')
  @Auth()
  @Role(['admin'])
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<{ result: string }> {
    const updateResult = await this.companyService.update(parseInt(id), dto);
    const result = { result: 'success' };
    if (!updateResult.affected) {
      result.result = 'failed';
    }
    return result;
  }

  @Delete('/:id')
  @Auth()
  @Role(['admin'])
  async delete(@Param('id') id: string): Promise<{ result: string }> {
    const deleteResult = await this.companyService.delete(parseInt(id));
    const result = { result: 'success' };
    if (!deleteResult.affected) {
      result.result = 'failed';
    }
    return result;
  }
}
