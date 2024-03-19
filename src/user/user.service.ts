import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from './user-create.dto';
import { UpdateUserDto } from './user-update.dto';
import { Company } from 'src/company/company.entity';

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

  async all(
    page: number,
    limit: number = 10,
    companyId?: number | bigint,
  ): Promise<UserPager> {
    const queryBuider = User.createQueryBuilder();

    const query = queryBuider
      .select()
      .addOrderBy('id')
      .offset((page - 1) * limit)
      .limit(limit);

    if (companyId) {
      query.where('company_id = :companyId', { companyId });
    }

    const companies: User[] = await query.getMany();

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

  async find(id: number, companyId?: number | bigint): Promise<User> {
    const query = User.createQueryBuilder().select().where('id = :id', { id });

    if (companyId) {
      query.andWhere('company_id = :companyId', { companyId });
    }

    const company: User = await query.getOne();
    return company;
  }

  async create(dto: CreateUserDto, companyId: number | bigint): Promise<User> {
    const data = { ...dto };
    data.password = await hash(data.password, 10);

    const company = await Company.findOne({ where: { id: Number(companyId) } });

    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    user.company = company;

    const savedUser = await user.save();

    return Promise.resolve(savedUser);
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    companyId?: number | bigint,
  ): Promise<UpdateResult> {
    const data = { ...dto };
    if (data.password) {
      data.password = await hash(data.password, 10);
      delete data.password_confirmation;
    }
    return await User.getRepository().update(id, data);
  }

  async delete(id: number, companyId?: number | bigint): Promise<DeleteResult> {
    return await User.getRepository().delete(id);
  }

  private getMaxPage(total: number, perPage: number) {
    return total % perPage > 0
      ? Math.floor(total / perPage) + 1
      : Math.floor(total / perPage);
  }
}
