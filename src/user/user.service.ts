import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from './user-create.dto';
import { UpdateUserDto } from './user-update.dto';

export type UserPager = {
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
  maxPage: number;
  data: User[];
};

@Injectable()
export class UserService {
  constructor() {}

  async all(page: number, limit: number = 10): Promise<UserPager> {
    const queryBuider = User.createQueryBuilder();
    const companies: User[] = await queryBuider
      .select()
      .addOrderBy('id')
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const total = await User.count();

    const maxPage = this.getMaxPage(total, limit);

    return {
      total,
      hasPrevious: page > 1,
      hasNext: page < maxPage,
      currentPage: page,
      maxPage,
      data: companies,
    };
  }

  async find(id: number): Promise<User> {
    const company: User = await User.getRepository().findOne({
      where: { id: id },
    });
    return company;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const data = { ...dto };
    data.password = await hash(data.password, 10);
    return await User.getRepository().create(data).save();
  }

  async update(id: number, dto: UpdateUserDto): Promise<UpdateResult> {
    const data = { ...dto };
    if (data.password) {
      data.password = await hash(data.password, 10);
      delete data.password_confirmation;
    }
    return await User.getRepository().update(id, data);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await User.getRepository().delete(id);
  }

  private getMaxPage(total: number, perPage: number) {
    return total % perPage > 0
      ? Math.floor(total / perPage) + 1
      : Math.floor(total / perPage);
  }
}
