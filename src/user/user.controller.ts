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
  ClassSerializerInterceptor,
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
import { createWriteStream, rm } from 'fs';
import { join } from 'path';

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
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(ClassSerializerInterceptor)
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

    let iconImagePath: string | undefined = undefined;

    if (file.size > 0) {
      iconImagePath = join(
        'uploaded',
        `img_${payload.id}_${new Date().getTime()}.png`,
      );
      const writeStream = createWriteStream(
        join(__dirname, '..', '..', '..', 'public', iconImagePath),
      );
      writeStream.write(file.buffer, (e) => {
        console.log(e);
      });
      writeStream.close();
    }

    return await this.userService.create(dto, payload.id, iconImagePath);
  }

  @Patch('/:id')
  @Auth()
  @Role(['company'])
  @UseInterceptors(FileInterceptor('icon'))
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file,
    @Body() dto: UpdateUserDto,
  ): Promise<{ result: string }> {
    const token: string = await this.authService.extractTokenFromHeader(
      req.headers.authorization,
    );
    const payload: JwtPayload = await this.authService.checkAuth(token);

    let iconImagePath: string | undefined = undefined;

    if (file.size > 0) {
      iconImagePath = join(
        'uploaded',
        `img_${payload.id}_${new Date().getTime()}.png`,
      );
      const writeStream = createWriteStream(
        join(__dirname, '..', '..', '..', 'public', iconImagePath),
      );
      writeStream.write(file.buffer, (e) => {
        console.log(e);
      });
      writeStream.close();
    }

    const updateResult = await this.userService.update(
      parseInt(id),
      dto,
      iconImagePath,
    );
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
    const user = await this.userService.find(parseInt(id));
    const iconImagePath = user.iconImagePath;
    if (iconImagePath) {
      await rm(
        join(__dirname, '..', '..', '..', 'public', iconImagePath),
        () => {},
      );
    }

    const deleteResult = await this.userService.delete(parseInt(id));
    const result = { result: 'success' };
    if (!deleteResult.affected) {
      result.result = 'failed';
    }
    return result;
  }
}
