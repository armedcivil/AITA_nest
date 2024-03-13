import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './data-source.options';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CompanyModule } from './company/company.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AdminModule,
    AuthModule,
    CompanyProfileModule,
    CompanyModule,
    UserProfileModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
