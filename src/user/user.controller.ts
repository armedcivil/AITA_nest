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
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { UserService } from './user.service';
import { UserPager } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './user-update.dto';
import { CreateUserDto } from './user-create.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth()
  @Role(['company'])
  async index(@Query('page') page: string = '1'): Promise<UserPager> {
    return await this.userService.all(parseInt(page));
  }

  @Get('/:id')
  @Auth()
  @Role(['company'])
  async show(@Param('id') id: string): Promise<User> {
    try {
      const user: User = await this.userService.find(parseInt(id));
      delete user.password;
      return user;
    } catch (e: any) {
      throw new NotFoundException();
    }
  }

  @Post()
  @Auth()
  @Role(['company'])
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.create(dto);
  }

  @Patch('/:id')
  @Auth()
  @Role(['company'])
  async update(
    @Param('id') id: string,
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
