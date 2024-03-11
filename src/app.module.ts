import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './data-source.options';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AdminModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
