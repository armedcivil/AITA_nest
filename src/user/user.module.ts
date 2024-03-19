import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [AuthModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
