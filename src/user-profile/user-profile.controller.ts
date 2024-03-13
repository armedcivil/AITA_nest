import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { AuthService, JwtPayload } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { UpdateUserDto } from 'src/user/user-update.dto';

@Controller('user/profile')
export class UserProfileController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  @Auth()
  @Role(['user'])
  async show(
    @Req() req: Request & { headers: { authorization?: string } },
  ): Promise<User> {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      const user: User = await this.userService.find(payload.id);
      delete user.password;
      return user;
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }

  @Patch()
  @Auth()
  @Role(['user'])
  async update(
    @Req() req: Request & { headers: { authorization: string } },
    @Body() dto: UpdateUserDto,
  ): Promise<{ result: string }> {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      const updateResult = await this.userService.update(payload.id, dto);
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
