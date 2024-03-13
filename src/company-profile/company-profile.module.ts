import { Module } from '@nestjs/common';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyModule } from '../company/company.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, CompanyModule],
  controllers: [CompanyProfileController],
})
export class CompanyProfileModule {}
