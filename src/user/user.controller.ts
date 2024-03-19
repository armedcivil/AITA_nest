import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { UserService } from './user.service';
import { UserPager } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './user-update.dto';
import { CreateUserDto } from './user-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService, JwtPayload } from 'src/auth/auth.service';
import { Request } from 'express';

// TODO : Remove password from response by attach @UseInterceptors(ClassSerializerInterceptor)
// TODO : Treat uploaded file on create and update

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @Auth()
  @Role(['company'])
  async index(
    @Req() req: Request,
    @Query('page') page: string = '1',
  ): Promise<UserPager> {
    const token: string = await this.authService.extractTokenFromHeader(
      req.headers.authorization,
    );
    const payload: JwtPayload = await this.authService.checkAuth(token);
    return await this.userService.all(parseInt(page), 10, payload.id);
  }

  @Get('/:id')
  @Auth()
  @Role(['company'])
  async show(@Req() req: Request, @Param('id') id: string): Promise<User> {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);

      const user: User = await this.userService.find(parseInt(id), payload.id);
      delete user.password;
      return user;
    } catch (e: any) {
      throw new NotFoundException();
    }
  }

  @Post()
  @Auth()
  @Role(['company'])
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Req() req: Request,
    @UploadedFile() file,
    @Body() dto: CreateUserDto,
  ): Promise<User> {
    const token: string = await this.authService.extractTokenFromHeader(
      req.headers.authorization,
    );
    const payload: JwtPayload = await this.authService.checkAuth(token);
    return await this.userService.create(dto, payload.id);
  }

  @Patch('/:id')
  @Auth()
  @Role(['company'])
  @UseInterceptors(FileInterceptor('icon'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file,
    @Body() dto: UpdateUserDto,
  ): Promise<{ result: string }> {
    const updateResult = await this.userService.update(parseInt(id), dto);
    const result = { result: 'success' };
    if (!updateResult.affected) {
      result.result = 'failed';
    }
    return result;
  }

  @Delete('/:id')
  @Auth()
  @Role(['company'])
  async delete(@Param('id') id: string): Promise<{ result: string }> {
    const deleteResult = await this.userService.delete(parseInt(id));
    const result = { result: 'success' };
    if (!deleteResult.affected) {
      result.result = 'failed';
    }
    return result;
  }
}
