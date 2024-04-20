import { Module } from '@nestjs/common';
import { CompanyFloorController } from './company-floor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FloorModule } from 'src/floor/floor.module';

@Module({
  controllers: [CompanyFloorController],
  imports: [AuthModule, FloorModule],
})
export class CompanyFloorModule {}
