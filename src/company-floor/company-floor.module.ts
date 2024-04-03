import { Module } from '@nestjs/common';
import { CompanyFloorController } from './company-floor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FloorService } from 'src/floor/floor.service';

@Module({
  controllers: [CompanyFloorController],
  imports: [AuthModule],
  providers: [FloorService],
})
export class CompanyFloorModule {}
