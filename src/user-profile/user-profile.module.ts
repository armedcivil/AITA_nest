import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
